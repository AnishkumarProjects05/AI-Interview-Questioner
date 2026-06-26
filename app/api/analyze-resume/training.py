import os
import json
from supabase import create_client, Client
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import SupabaseVectorStore
from langchain_core.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
import io
from pypdf import PdfReader
print("Successfully Imported Packages")
def load_env():
    # Attempt to load .env files manually if they are not already loaded into os.environ
    base_dir = os.path.dirname(os.path.abspath(__file__))
    possible_paths = [
        os.path.join(base_dir, ".env"),
        os.path.join(base_dir, ".env.local"),
        os.path.join(base_dir, "../../..", ".env"),
        os.path.join(base_dir, "../../..", ".env.local"),
        ".env",
        ".env.local"
    ]
    for path in possible_paths:
        try:
            abs_path = os.path.abspath(path)
            if os.path.exists(abs_path) and os.path.isfile(abs_path):
                with open(abs_path, "r", encoding="utf-8") as f:
                    for line in f:
                        line = line.strip()
                        if not line or line.startswith("#"):
                            continue
                        if "=" in line:
                            key, val = line.split("=", 1)
                            key = key.strip()
                            val = val.strip().strip("'\"")
                            if key and key not in os.environ:
                                os.environ[key] = val
        except Exception:
            pass

load_env()

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL") or os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY") or os.environ.get("NEXT_PUBLIC_SUPABASE_KEY") or os.environ.get("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in environment variables.")

supabase_client: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
print("Supabase client initialized successfully")

google_api_key = os.environ.get("GOOGLE_API_KEY")
if not google_api_key:
    raise ValueError("GOOGLE_API_KEY must be set in environment variables.")

# Ensure the SDK can read the API key from os.environ
os.environ["GOOGLE_API_KEY"] = google_api_key

model_name = os.environ.get("GEMINI_MODEL") or "gemini-2.5-flash"

embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
# FIXED: Explicitly initializing the LLM to structure outputs as native JSON objects
llm = ChatGoogleGenerativeAI(
    model=model_name,
    temperature=0.0,
    model_kwargs={"response_format": {"type": "json_object"}}
)

print("Models and Supabase Client Ready.")

def extract_skills(skills_node):
    extracted = []
    if not isinstance(skills_node, dict):
        return extracted
    for key in ['technical', 'frameworks', 'databases', 'cloud', 'automation', 'project_management']:
        sub_list = skills_node.get(key, [])
        if isinstance(sub_list, list):
            for item in sub_list:
                if isinstance(item, dict) and 'name' in item:
                    extracted.append(item['name'])
    return extracted

def parse_and_ingest_messy_json(file_path):
    if not os.path.exists(file_path):
        print(f"Ingestion skipped: File '{file_path}' not found in runtime. Moving on...")
        return

    raw_documents = []
    with open(file_path, 'r', encoding='utf-8') as f:
        for line_num, line in enumerate(f, 1):
            if not line.strip():
                continue
            try:
                data = json.loads(line.strip())
                info = data.get("personal_info", {})
                title = info.get("title", "Unknown Role")
                location = info.get("location", {})
                city = location.get("city", "Unknown City")
                summary = info.get("summary", "")
                skills_list = extract_skills(data.get("skills", {}))

                exp_list = data.get("experience", [])
                formatted_exp = []
                for exp in exp_list:
                    role = exp.get("title", "")
                    company = exp.get("company", "")
                    duration = exp.get("duration", "")
                    if role or company:
                        formatted_exp.append(f"{role} at {company} ({duration})")

                edu_list = data.get("education", [])
                formatted_edu = []
                for edu in edu_list:
                    degree = edu.get("degree", "")
                    field = edu.get("field", "")
                    inst = edu.get("institution", {}).get("name", "")
                    if degree or inst:
                        formatted_edu.append(f"{degree} in {field} from {inst}")

                full_text_profile = f"""
                Profile Title: {title}
                Location: {city}
                Professional Summary: {summary}
                Technical Skills: {', '.join(skills_list)}
                Work Experience: {'; '.join(formatted_exp)}
                Education History: {'; '.join(formatted_edu)}
                """.strip()

                doc = Document(
                    page_content=full_text_profile,
                    metadata={"candidate_title": title, "city": city, "line_id": line_num}
                )
                raw_documents.append(doc)
            except json.JSONDecodeError:
                continue

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1200, chunk_overlap=200)
    split_docs = text_splitter.split_documents(raw_documents)
    print(f"Parsed {len(raw_documents)} resumes into {len(split_docs)} chunks. Synchronizing with Supabase...")

    SupabaseVectorStore.from_documents(
        split_docs, embeddings, client=supabase_client, table_name="resumes", query_name="match_resumes"
    )
    print("Database sync executed successfully.")

def evaluate_single_resume(job_description: str, resume_text: str):
    print("Analyzing the provided resume against the Job Description...\n")
    
    prompt_template = """
    You are an expert technical recruiter analyzing a target Job Description against a specific candidate's resume.
    
    Job Description:
    {job_description}
    
    Candidate Resume:
    {resume_text}
    
    Perform a strict, realistic skill evaluation based ONLY on the provided resume.
    Calculate an accurate skill match percentage (0-100) based on how well their skills, experience, and tools align with the requirements.
    
    You must output a clean, valid JSON object with exactly the following structure:
    {{
        "candidate_name": "Extract candidate name if present, else use Unknown",
        "skill_match_percentage": 85,
        "matched_skills": ["skill1", "skill2"],
        "missing_skills": ["skill3"],
        "justification": "A brief sentence explaining the percentage evaluation score."
    }}
    """
    
    prompt = PromptTemplate(
        template=prompt_template,
        input_variables=["job_description", "resume_text"]
    )
    
    match_chain = prompt | llm
    
    response = match_chain.invoke({
        "job_description": job_description,
        "resume_text": resume_text
    })
    
    # CLEANUP: Strip out markdown formatting if the model accidentally includes it
    raw_content = response.content.strip()
    if raw_content.startswith("```json"):
        raw_content = raw_content[7:]
    elif raw_content.startswith("```"):
        raw_content = raw_content[3:]
    if raw_content.endswith("```"):
        raw_content = raw_content[:-3]
    raw_content = raw_content.strip()
    
    try:
        final_json = json.loads(raw_content)
        print("=== Direct Match Evaluation Result ===")
        print(json.dumps(final_json, indent=2))
        print("=" * 38)
    except Exception as e:
        print("Error parsing final JSON response. Raw string output:")
        print(response.content)

def upload_and_extract_resume() -> str:
    print("Please select your resume file (PDF format preferred):")
    # This opens the interactive file picker widget in Colab (imported inline)
    from google.colab import files
    uploaded = files.upload()
    
    if not uploaded:
        print("No file was uploaded.")
        return ""
        
    # Get the filename and data bytes
    file_name = list(uploaded.keys())[0]
    file_data = uploaded[file_name]
    
    print(f"\nSuccessfully uploaded: {file_name}")
    print("Extracting text content...")
    
    # Check if it's a PDF file
    if file_name.lower().endswith('.pdf'):
        try:
            pdf_stream = io.BytesIO(file_data)
            reader = PdfReader(pdf_stream)
            extracted_text = ""
            
            # Loop through all pages and extract text characters
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    extracted_text += text + "\n"
            
            print("Extraction successful!")
            return extracted_text.strip()
            
        except Exception as e:
            print(f"Error parsing PDF file: {e}")
            return ""
    else:
        # If it's a plain text or .txt file, decode it directly
        try:
            return file_data.decode('utf-8').strip()
        except Exception as e:
            print(f"Could not automatically decode file text: {e}")
            return ""

if __name__ == '__main__':
    import sys
    if len(sys.argv) > 1:
        # Next.js API / Headless CLI Mode
        config_path = sys.argv[1]
        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                config = json.load(f)
            pdf_path = config.get('pdfPath')
            job_description = config.get('jobDescription', '')
            
            if not pdf_path or not os.path.exists(pdf_path):
                sys.stderr.write(f"Error: PDF path '{pdf_path}' not found.\n")
                sys.exit(1)
                
            # Extract PDF text
            reader = PdfReader(pdf_path)
            resume_text = ""
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    resume_text += text + "\n"
                    
            evaluate_single_resume(job_description=job_description, resume_text=resume_text.strip())
        except Exception as e:
            sys.stderr.write(f"Error during execution: {e}\n")
            sys.exit(1)
    else:
        # Interactive Google Colab mode
        parse_and_ingest_messy_json("masterresume.jsonl")
        
        sample_jd = """
A Software Development Engineer (SDE) designs, codes, tests, and maintains software applications and systems. They translate business requirements into technical solutions, collaborate with cross-functional teams, and ensure applications are scalable, secure, and user-friendly.Key ResponsibilitiesDevelopment: Write clean, maintainable, and efficient code.Testing: Create and execute unit, integration, and performance tests.Debugging: Troubleshoot, identify bottlenecks, and resolve system issues.Collaboration: Participate in code reviews and coordinate with product managers, QA, and DevOps teams.Documentation: Document software designs and technical specifications for future reference.Core Requirements & SkillsProgramming Languages: Proficiency in languages like Java, Python, C++, or C#.Foundations: Deep understanding of Data Structures and Algorithms (DSA), Object-Oriented Programming (OOP), and database management (SQL/NoSQL).Tools & Tech: Familiarity with version control (Git), CI/CD pipelines, and cloud platforms (AWS, Azure, GCP).Problem-Solving: Strong analytical and logical thinking capabilities to design complex system architecture
"""
        sample_resume = upload_and_extract_resume()
        if sample_resume:
            print("\n--- Running Evaluation with Live Uploaded Resume ---")
            evaluate_single_resume(job_description=sample_jd, resume_text=sample_resume)

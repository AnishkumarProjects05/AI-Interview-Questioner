"use client";

import React, { useState } from "react";
import { 
  FileText, 
  UploadCloud, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  FileSearch2, 
  RefreshCw,
  Award,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function ResumeJdAnalyzerPage() {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState("");
  const [results, setResults] = useState(null);

  // Drag handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
        toast.success(`Selected file: ${droppedFile.name}`);
      } else {
        toast.error("Please upload a PDF file only.");
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        toast.success(`Selected file: ${selectedFile.name}`);
      } else {
        toast.error("Please upload a PDF file only.");
      }
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const handleAnalyze = async () => {
    if (!file) {
      toast.error("Please upload a candidate resume PDF.");
      return;
    }
    if (!jobDescription.trim()) {
      toast.error("Please paste the job description.");
      return;
    }

    setIsLoading(true);
    setResults(null);

    // Simulate multi-stage loading messages for premium feedback
    const stages = [
      "Uploading PDF...",
      "Extracting text from Resume PDF...",
      "Initiating RAG python model...",
      "Matching skills & credentials...",
      "Generating Recruiter report..."
    ];

    let currentStageIndex = 0;
    setLoadingStage(stages[currentStageIndex]);

    const stageInterval = setInterval(() => {
      if (currentStageIndex < stages.length - 1) {
        currentStageIndex++;
        setLoadingStage(stages[currentStageIndex]);
      }
    }, 1500);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jobDescription);

      const response = await fetch("/api/analyze-resume", {
        method: "POST",
        body: formData,
      });

      clearInterval(stageInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze resume.");
      }

      const data = await response.json();
      setResults(data);
      toast.success("Resume analysis complete!");
    } catch (error) {
      clearInterval(stageInterval);
      console.error(error);
      toast.error(error.message || "An error occurred during analysis.");
    } finally {
      setIsLoading(false);
      setLoadingStage("");
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-500 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20";
    if (score >= 60) return "text-indigo-500 border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20";
    if (score >= 40) return "text-amber-500 border-amber-500 bg-amber-50 dark:bg-amber-950/20";
    return "text-rose-500 border-rose-500 bg-rose-50 dark:bg-rose-950/20";
  };

  const getScoreCircleColor = (score) => {
    if (score >= 80) return "stroke-emerald-500";
    if (score >= 60) return "stroke-indigo-500";
    if (score >= 40) return "stroke-amber-500";
    return "stroke-rose-500";
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 p-6 md:p-8 font-poppins">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-500 bg-clip-text text-transparent flex items-center gap-3">
              <FileSearch2 className="w-8 h-8 text-indigo-600" />
              Resume & JD Analyzer
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Validate resumes against specific Job Descriptions using AI-powered RAG modeling.
            </p>
          </div>
          {results && (
            <Button 
              onClick={() => {
                setResults(null);
                setFile(null);
                setJobDescription("");
              }}
              variant="outline" 
              className="border-indigo-100 hover:bg-indigo-50 dark:border-white/10 dark:hover:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Reset Form
            </Button>
          )}
        </div>

        {/* INPUT FORM (ONLY SHOWN IF NO RESULTS YET) */}
        {!results && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* LEFT COLUMN: JOB DESCRIPTION */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm flex flex-col space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                  <Award className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Job Description</h2>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Paste the detailed responsibilities, qualifications, and stack requirements for the role.
              </p>
              <Textarea
                placeholder="Example: We are looking for a Software Developer proficient in Java and Python, with a strong foundation in OOP and database queries (SQL). Familiarity with Git version control, CI/CD pipelines, and GCP is highly desirable..."
                className="flex-1 min-h-[300px] border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-slate-950 rounded-xl resize-none font-sans leading-relaxed text-sm p-4"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            {/* RIGHT COLUMN: RESUME UPLOAD */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm flex flex-col space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Candidate Resume</h2>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Provide the candidate's CV/Resume in PDF format to parse and evaluate.
              </p>

              {/* DRAG AND DROP ZONE */}
              {!file ? (
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`flex-1 min-h-[220px] flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition-all cursor-pointer p-6 text-center ${
                    dragActive 
                      ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20" 
                      : "border-slate-200 hover:border-indigo-400 dark:border-white/10 hover:bg-slate-50/50 dark:hover:bg-slate-950/50"
                  }`}
                  onClick={() => document.getElementById("file-upload").click()}
                >
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept="application/pdf"
                    onChange={handleFileChange}
                  />
                  <UploadCloud className="w-12 h-12 text-slate-400 dark:text-slate-600 mb-4 animate-bounce" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Drag and drop your PDF resume here
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                    or click to browse local files
                  </p>
                </div>
              ) : (
                <div className="flex-1 min-h-[220px] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-white/5 rounded-xl p-6">
                  <div className="p-4 bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 rounded-2xl mb-4 relative group">
                    <FileText className="w-12 h-12" />
                  </div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 text-center max-w-xs truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                  <button
                    onClick={removeFile}
                    className="mt-6 flex items-center gap-2 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 px-4 py-2.5 rounded-xl transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove PDF
                  </button>
                </div>
              )}

              {/* ANALYZE BUTTON */}
              <Button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="w-full h-14 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 active:scale-95 transition-all text-base flex items-center justify-center gap-3 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span className="font-semibold">{loadingStage}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Run Match Analysis</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* LOADING SHIMMER STATE */}
        {isLoading && (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm space-y-6 animate-pulse">
            <div className="h-6 w-1/3 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
              <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
              <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
            </div>
            <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          </div>
        )}

        {/* RESULTS RENDERING */}
        {results && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* OVERALL STATISTICS ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* CARD 1: SCORE DIAL */}
              <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Match Score
                </h3>
                
                {/* SVG Circular Chart */}
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="72"
                      cy="72"
                      r="60"
                      className="stroke-slate-100 dark:stroke-slate-800"
                      strokeWidth="10"
                      fill="transparent"
                    />
                    <circle
                      cx="72"
                      cy="72"
                      r="60"
                      className={`transition-all duration-1000 ease-out ${getScoreCircleColor(results.skill_match_percentage)}`}
                      strokeWidth="10"
                      fill="transparent"
                      strokeDasharray={376.8}
                      strokeDashoffset={376.8 - (376.8 * results.skill_match_percentage) / 100}
                    />
                  </svg>
                  <span className="absolute text-3xl font-black text-slate-800 dark:text-slate-100">
                    {results.skill_match_percentage}%
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-400">Candidate Name</p>
                  <p className="text-lg font-black text-slate-800 dark:text-slate-200">
                    {results.candidate_name || "N/A"}
                  </p>
                </div>
              </div>

              {/* CARD 2: MATCHED SKILLS */}
              <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm flex flex-col space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-white/5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Matched Skills ({results.matched_skills?.length || 0})
                  </h3>
                </div>
                
                <div className="flex flex-wrap gap-2 overflow-y-auto max-h-[180px] pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                  {results.matched_skills && results.matched_skills.length > 0 ? (
                    results.matched_skills.map((skill, i) => (
                      <span 
                        key={i} 
                        className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-bold border border-emerald-100 dark:border-emerald-950/50 flex items-center gap-1.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400">No matching skills identified.</p>
                  )}
                </div>
              </div>

              {/* CARD 3: MISSING SKILLS */}
              <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm flex flex-col space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-white/5">
                  <AlertTriangle className="w-5 h-5 text-rose-500" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Missing Keywords ({results.missing_skills?.length || 0})
                  </h3>
                </div>
                
                <div className="flex flex-wrap gap-2 overflow-y-auto max-h-[180px] pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                  {results.missing_skills && results.missing_skills.length > 0 ? (
                    results.missing_skills.map((skill, i) => (
                      <span 
                        key={i} 
                        className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-lg text-xs font-bold border border-rose-100 dark:border-rose-950/50 flex items-center gap-1.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400">No missing skills detected. Excellent alignment!</p>
                  )}
                </div>
              </div>

            </div>

            {/* FULL WIDTH CARD: RECRIUTER JUSTIFICATION */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-white/5">
                <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  AI Recruiter Assessment & Justification
                </h3>
              </div>
              <div className="bg-indigo-50/40 dark:bg-indigo-950/10 border-l-4 border-indigo-500 rounded-r-xl p-5">
                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic">
                  "{results.justification || "No justification provided."}"
                </p>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

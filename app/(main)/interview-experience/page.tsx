export default function InterviewExperiencePage() {
  const sampleCode = `function greet(name: string) {
  return \`Hello,!\`;
}`;

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>Welcome to the Interview Experience</h1>
      <p>Here is a sample code snippet to get started:</p>
      <pre
        style={{
          background: "#f4f4f5",
          padding: 16,
          borderRadius: 8,
          overflowX: "auto",
          marginTop: 16,
        }}
      >
        <code>{sampleCode}</code>
      </pre>
    </main>
  );
}

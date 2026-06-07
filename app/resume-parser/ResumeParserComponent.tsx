"use client";
import { useState, useEffect } from "react";
import { readPdf } from "@/lib/resume/parse-resume-from-pdf/read-pdf";
import type { TextItems } from "@/lib/resume/parse-resume-from-pdf/types";
import { groupTextItemsIntoLines } from "@/lib/resume/parse-resume-from-pdf/group-text-items-into-lines";
import { groupLinesIntoSections } from "@/lib/resume/parse-resume-from-pdf/group-lines-into-sections";
import { extractResumeFromSections } from "@/lib/resume/parse-resume-from-pdf/extract-resume-from-sections";
import { ResumeDropzone } from "@/components/resume/ResumeDropzone";
import { cx } from "@/lib/resume/cx";
import { Heading, Link, Paragraph } from "@/components/resume/documentation";
import { ResumeTable } from "./ResumeTable";
import { FlexboxSpacer } from "@/components/resume/FlexboxSpacer";
import { ResumeParserAlgorithmArticle } from "./ResumeParserAlgorithmArticle";
import React from 'react';
import { FileText, Database } from "lucide-react";

const RESUME_EXAMPLES = [
  {
    fileUrl: "resume-example/laverne-resume.pdf",
    description: (
      <span>
        Borrowed from University of La Verne Career Center -{" "}
        <Link href="https://laverne.edu/careers/wp-content/uploads/sites/15/2010/12/Undergraduate-Student-Resume-Examples.pdf">
          Link
        </Link>
      </span>
    ),
  },
  {
    fileUrl: "resume-example/openresume-resume.pdf",
    description: (
      <span>
        Created with Folonite Resume builder -{" "}
        <Link href="/resume-builder">Link</Link>
      </span>
    ),
  },
];

const defaultFileUrl = RESUME_EXAMPLES[0]["fileUrl"];

export function ResumeParserComponent() {
  const [fileUrl, setFileUrl] = useState(defaultFileUrl);
  const [textItems, setTextItems] = useState<TextItems>([]);
  const [activeTab, setActiveTab] = useState<"pdf" | "results">("results");
  
  const lines = groupTextItemsIntoLines(textItems || []);
  const sections = groupLinesIntoSections(lines);
  const resume = extractResumeFromSections(sections);

  useEffect(() => {
    async function fetchTextItems() {
      const fetchedTextItems = await readPdf(fileUrl);
      setTextItems(fetchedTextItems);
    }
    fetchTextItems();
  }, [fileUrl]);

  return (
    <main className="h-full w-full md:overflow-hidden overflow-y-auto bg-slate-50 dark:bg-slate-950 relative">
      <div className="grid grid-cols-1 md:grid-cols-6 h-full md:h-auto">
        
        {/* LEFT PANEL — PDF preview */}
        <div className={`flex justify-center px-2 col-span-1 md:col-span-3 h-auto md:h-[calc(100vh-var(--top-nav-bar-height))] md:justify-end w-full ${activeTab === "pdf" ? "block" : "hidden md:block"}`}>
          <section className="mt-5 grow px-4 md:max-w-[600px] md:px-0 w-full">
            <iframe
              src={`${fileUrl}#navpanes=0&view=FitH`}
              className="w-full"
              style={{ minHeight: "75vh", height: "100%" }}
              title="Resume preview"
            />
          </section>
          <FlexboxSpacer maxWidth={45} className="hidden md:block" />
        </div>

        {/* RIGHT PANEL — Description and table */}
        <div className={`flex px-6 text-gray-900 col-span-1 md:col-span-3 h-auto md:h-[calc(100vh-var(--top-nav-bar-height))] md:overflow-y-scroll overflow-visible pb-24 md:pb-12 ${activeTab === "results" ? "block" : "hidden md:block"}`}>
          <FlexboxSpacer maxWidth={45} className="hidden md:block" />
          <section className="max-w-[600px] grow w-full">
            <Heading className="text-primary !mt-4">
              Resume Parser Playground
            </Heading>
            <Paragraph smallMarginTop={true}>
              This playground showcases the Folonite resume parser and its ability to parse information from a resume PDF. Click around the PDF examples below to observe different parsing results.
            </Paragraph>
            <div className="mt-3 flex gap-3">
              {RESUME_EXAMPLES.map((example, idx) => (
                <article
                  key={idx}
                  className={cx(
                    "flex-1 cursor-pointer rounded-md border-2 px-4 py-3 shadow-sm outline-none hover:bg-gray-50 focus:bg-gray-50",
                    example.fileUrl === fileUrl ? "border-blue-400" : "border-gray-300"
                  )}
                  onClick={() => setFileUrl(example.fileUrl)}
                  tabIndex={0}
                >
                  <h1 className="font-semibold">Resume Example {idx + 1}</h1>
                  <p className="mt-2 text-sm text-gray-500">{example.description}</p>
                </article>
              ))}
            </div>
            <Paragraph>
              You can also <span className="font-semibold">add your resume below</span> to access how well your resume would be parsed by similar Application Tracking Systems (ATS) used in job applications.
            </Paragraph>
            <div className="mt-3">
              <ResumeDropzone
                onFileUrlChange={(fileUrl) => setFileUrl(fileUrl || defaultFileUrl)}
                playgroundView={true}
              />
            </div>
            <Heading level={2} className="!mt-[1.2em]">
              Resume Parsing Results
            </Heading>
            <ResumeTable resume={resume} />
          </section>
        </div>

      </div>

      {/* FLOATING MOBILE SWITCHER */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-full p-1.5 shadow-2xl shadow-indigo-500/10 flex items-center gap-1.5 transition-all">
        <button
          onClick={() => setActiveTab("results")}
          className={`px-5 py-2.5 rounded-full text-xs font-black tracking-wider uppercase transition-all duration-300 flex items-center gap-2 ${
            activeTab === "results"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
              : "text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          Results
        </button>
        <button
          onClick={() => setActiveTab("pdf")}
          className={`px-5 py-2.5 rounded-full text-xs font-black tracking-wider uppercase transition-all duration-300 flex items-center gap-2 ${
            activeTab === "pdf"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
              : "text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          PDF
        </button>
      </div>
    </main>
  );
}

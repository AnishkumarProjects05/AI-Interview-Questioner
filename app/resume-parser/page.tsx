"use client";
import dynamic from "next/dynamic";
import React from "react";

const ResumeParserComponent = dynamic(
  () => import("./ResumeParserComponent").then((mod) => mod.ResumeParserComponent),
  { ssr: false }
);

export default function ResumeParserPage() {
  return <ResumeParserComponent />;
}

"use client";
import dynamic from "next/dynamic";
import React from "react";

const ResumeImportComponent = dynamic(
  () => import("./ResumeImportComponent").then((mod) => mod.ResumeImportComponent),
  { ssr: false }
);

export default function ResumeImportPage() {
  return <ResumeImportComponent />;
}

"use client";
import React, { useState } from "react";
import { Provider } from "react-redux";
import { store } from "@/lib/resume/redux/store";
import { ResumeForm } from "@/components/resume/ResumeForm";
import { Resume } from "@/components/resume/Resume";
import { Edit, Eye } from "lucide-react";

export default function Create() {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  return (
    <Provider store={store}>
      {/* h-full fills the flex-1 wrapper from layout. overflow-hidden prevent any bleed. */}
      <div className="flex h-full overflow-hidden bg-slate-50 dark:bg-slate-950 relative">

        {/* LEFT — Scrollable form panel */}
        <div className={`w-full md:w-1/2 h-full overflow-y-auto border-r border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 ${activeTab === "edit" ? "block" : "hidden md:block"}`}>
          <ResumeForm />
        </div>

        {/* RIGHT — Fixed resume preview panel, never scrolls */}
        <div className={`w-full md:w-1/2 h-full overflow-hidden bg-slate-100 dark:bg-slate-950 flex flex-col ${activeTab === "preview" ? "flex" : "hidden md:flex"}`}>
          <Resume />
        </div>

        {/* FLOATING MOBILE SWITCHER */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-full p-1.5 shadow-2xl shadow-indigo-500/10 flex items-center gap-1.5 transition-all">
          <button
            onClick={() => setActiveTab("edit")}
            className={`px-5 py-2.5 rounded-full text-xs font-black tracking-wider uppercase transition-all duration-300 flex items-center gap-2 ${
              activeTab === "edit"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                : "text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
            }`}
          >
            <Edit className="w-3.5 h-3.5" />
            Edit
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`px-5 py-2.5 rounded-full text-xs font-black tracking-wider uppercase transition-all duration-300 flex items-center gap-2 ${
              activeTab === "preview"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                : "text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Preview
          </button>
        </div>
      </div>
    </Provider>
  );
}

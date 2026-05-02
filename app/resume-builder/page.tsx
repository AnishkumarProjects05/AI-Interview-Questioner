"use client";
import { Provider } from "react-redux";
import { store } from "@/lib/resume/redux/store";
import { ResumeForm } from "@/components/resume/ResumeForm";
import { Resume } from "@/components/resume/Resume";

export default function Create() {
  return (
    <Provider store={store}>
      {/* h-full fills the flex-1 wrapper from layout. overflow-hidden prevent any bleed. */}
      <div className="flex h-full overflow-hidden bg-slate-50 dark:bg-slate-950">

        {/* LEFT — Scrollable form panel */}
        <div className="w-1/2 h-full overflow-y-auto border-r border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900">
          <ResumeForm />
        </div>

        {/* RIGHT — Fixed resume preview panel, never scrolls */}
        <div className="w-1/2 h-full overflow-hidden bg-slate-100 dark:bg-slate-950 flex flex-col">
          <Resume />
        </div>
      </div>
    </Provider>
  );
}

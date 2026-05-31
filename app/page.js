import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Loader2 } from "lucide-react";
export default function Home() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      {/* Animated Spinner Icon */}
      <div className="relative flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        {/* Optional: A subtle outer glowing ring to match your theme */}
        <div className="absolute h-16 w-16 animate-ping rounded-full border border-blue-500/20 opacity-25"></div>
      </div>

      {/* Text Container */}
      <div className="space-y-1.5">
        <h2 className="text-xl font-semibold text-slate-200">
          AI Interview Question Generator
        </h2>
        <p className="animate-pulse text-sm font-medium text-slate-400 tracking-wide">
          Redirecting...
        </p>
      </div>
    </div>
  );
}

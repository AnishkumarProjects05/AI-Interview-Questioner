"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import { ResumeIframeCSR } from "@/components/resume/Resume/ResumeIFrame";
import { ResumePDF } from "@/components/resume/Resume/ResumePDF";
import {
  ResumeControlBarCSR,
  ResumeControlBarBorder,
} from "@/components/resume/Resume/ResumeControlBar";
import { useAppSelector } from "@/lib/resume/redux/hooks";
import { selectResume } from "@/lib/resume/redux/resumeSlice";
import { selectSettings } from "@/lib/resume/redux/settingsSlice";
import { DEBUG_RESUME_PDF_FLAG } from "@/lib/resume/constants";
import {
  useRegisterReactPDFFont,
  useRegisterReactPDFHyphenationCallback,
} from "@/components/resume/fonts/hooks";
import { NonEnglishFontsCSSLazyLoader } from "@/components/resume/fonts/NonEnglishFontsCSSLoader";
import {
  A4_WIDTH_PX,
  A4_HEIGHT_PX,
  LETTER_WIDTH_PX,
  LETTER_HEIGHT_PX,
} from "@/lib/resume/constants";

export const Resume = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.8);
  const [autoScale, setAutoScale] = useState(true);

  const resume = useAppSelector(selectResume);
  const settings = useAppSelector(selectSettings);
  const document = useMemo(
    () => <ResumePDF resume={resume} settings={settings} isPDF={true} />,
    [resume, settings]
  );

  useRegisterReactPDFFont();
  useRegisterReactPDFHyphenationCallback(settings.fontFamily);

  const isA4 = settings.documentSize === "A4";
  const docWidth = isA4 ? A4_WIDTH_PX : LETTER_WIDTH_PX;
  const docHeight = isA4 ? A4_HEIGHT_PX : LETTER_HEIGHT_PX;

  // Auto-scale: fit the A4/Letter sheet inside the container panel
  useEffect(() => {
    if (!autoScale) return;
    const el = containerRef.current;
    if (!el) return;

    const compute = () => {
      const panelW = el.clientWidth - 48;  // horizontal padding
      const panelH = el.clientHeight - 80; // leave room for control bar
      const scaleByW = panelW / docWidth;
      const scaleByH = panelH / docHeight;
      const s = Math.min(scaleByW, scaleByH, 1.0);
      setScale(Math.round(s * 100) / 100);
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [autoScale, docWidth, docHeight]);

  return (
    <div ref={containerRef} className="relative flex flex-col h-full w-full overflow-hidden">
      <NonEnglishFontsCSSLazyLoader />

      {/* Preview area — centered, fills all available space */}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <div
          style={{
            width: `${docWidth * scale}px`,
            height: `${docHeight * scale}px`,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: `${docWidth}px`,
              height: `${docHeight}px`,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
            className="bg-white shadow-2xl dark:shadow-black/50"
          >
            <ResumeIframeCSR
              documentSize={settings.documentSize}
              scale={1}
              enablePDFViewer={DEBUG_RESUME_PDF_FLAG}
            >
              <ResumePDF
                resume={resume}
                settings={settings}
                isPDF={DEBUG_RESUME_PDF_FLAG}
              />
            </ResumeIframeCSR>
          </div>
        </div>
      </div>

      {/* Control bar pinned at bottom */}
      <ResumeControlBarBorder />
      <ResumeControlBarCSR
        scale={scale}
        setScale={(s) => { setAutoScale(false); setScale(s); }}
        documentSize={settings.documentSize}
        document={document}
        fileName={resume.profile.name + " - Resume"}
      />
    </div>
  );
};

import { useState, useEffect, useRef } from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { useAutosizeTextareaHeight } from "@/lib/resume/hooks/useAutosizeTextareaHeight";
import { Bold, Italic, Underline } from "lucide-react";

interface InputProps<K extends string, V extends string | string[]> {
  label: string;
  labelClassName?: string;
  name: K;
  value?: V;
  placeholder: string;
  onChange: (name: K, value: V) => void;
}

export const InputGroupWrapper = ({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children?: React.ReactNode;
}) => (
  <div className={`flex flex-col ${className}`}>
    <label className="text-base font-medium text-gray-700 mb-1">{label}</label>
    {children}
  </div>
);

export const INPUT_CLASS_NAME =
  "px-3 py-2 block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm outline-none font-normal text-base focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500";

export const Input = <K extends string>({
  name,
  value = "",
  placeholder,
  onChange,
  label,
  labelClassName,
}: InputProps<K, string>) => {
  return (
    <InputGroupWrapper label={label} className={labelClassName}>
      <input
        type="text"
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(name, e.target.value)}
        className={INPUT_CLASS_NAME}
      />
    </InputGroupWrapper>
  );
};

export const Textarea = <T extends string>({
  label,
  labelClassName: wrapperClassName,
  name,
  value = "",
  placeholder,
  onChange,
}: InputProps<T, string>) => {
  const textareaRef = useAutosizeTextareaHeight({ value });

  return (
    <InputGroupWrapper label={label} className={wrapperClassName}>
      <textarea
        ref={textareaRef}
        name={name}
        className={`${INPUT_CLASS_NAME} resize-none overflow-hidden`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
      />
    </InputGroupWrapper>
  );
};

export const BulletListTextarea = <T extends string>(
  props: InputProps<T, string[]> & { showBulletPoints?: boolean }
) => {
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const isFirefox = navigator.userAgent.includes("Firefox");
    const isSafari =
      navigator.userAgent.includes("Safari") &&
      !navigator.userAgent.includes("Chrome");
    if (isFirefox || isSafari) {
      setShowFallback(true);
    }
  }, []);

  if (showFallback) {
    return <BulletListTextareaFallback {...props} />;
  }
  return <BulletListTextareaGeneral {...props} />;
};

const RichTextToolbar = ({ onFormat }: { onFormat: (command: string) => void }) => {
  return (
    <div className="flex items-center gap-1 mb-2 bg-gray-50 border border-gray-200 rounded-md p-1 w-fit">
      <button
        type="button"
        onMouseDown={(e) => { e.preventDefault(); onFormat("bold"); }}
        className="p-1 hover:bg-gray-200 rounded text-gray-700 transition"
        title="Bold (Ctrl+B)"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        type="button"
        onMouseDown={(e) => { e.preventDefault(); onFormat("italic"); }}
        className="p-1 hover:bg-gray-200 rounded text-gray-700 transition"
        title="Italic (Ctrl+I)"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        type="button"
        onMouseDown={(e) => { e.preventDefault(); onFormat("underline"); }}
        className="p-1 hover:bg-gray-200 rounded text-gray-700 transition"
        title="Underline (Ctrl+U)"
      >
        <Underline className="w-4 h-4" />
      </button>
    </div>
  );
};

const getBulletListStringsFromHTML = (html: string) => {
  if (typeof document === "undefined") return [];
  const div = document.createElement("div");
  div.innerHTML = html;

  const lines: string[] = [];
  Array.from(div.childNodes).forEach((node) => {
    if (node.nodeName === "DIV" || node.nodeName === "P") {
      const inner = (node as HTMLElement).innerHTML;
      if (inner === "<br>") lines.push("");
      else lines.push(inner);
    } else {
      if (lines.length === 0) lines.push("");
      if (node.nodeType === Node.TEXT_NODE) {
        lines[lines.length - 1] += node.textContent;
      } else {
        lines[lines.length - 1] += (node as HTMLElement).outerHTML;
      }
    }
  });
  return lines;
};

const getHTMLFromBulletListStrings = (bulletListStrings: string[]) => {
  if (bulletListStrings.length === 0) {
    return "<div><br></div>";
  }
  return bulletListStrings.map((text) => `<div>${text || "<br>"}</div>`).join("");
};

const BulletListTextareaGeneral = <T extends string>({
  label,
  labelClassName: wrapperClassName,
  name,
  value: bulletListStrings = [],
  placeholder,
  onChange,
  showBulletPoints = true,
}: InputProps<T, string[]> & { showBulletPoints?: boolean }) => {
  const html = getHTMLFromBulletListStrings(bulletListStrings);
  const containerRef = useRef<HTMLElement>(null);

  const handleFormat = (command: string) => {
    document.execCommand(command, false, undefined);
    if (containerRef.current) {
      const newStrings = getBulletListStringsFromHTML(containerRef.current.innerHTML);
      onChange(name, newStrings);
    }
  };

  return (
    <InputGroupWrapper label={label} className={wrapperClassName}>
      <RichTextToolbar onFormat={handleFormat} />
      <ContentEditable
        innerRef={containerRef as any}
        contentEditable={true}
        className={`${INPUT_CLASS_NAME} cursor-text [&>div]:list-item min-h-[100px] ${showBulletPoints ? "pl-7" : "[&>div]:list-['']"
          }`}
        placeholder={placeholder}
        onChange={(e: ContentEditableEvent) => {
          const newStrings = getBulletListStringsFromHTML(e.target.value);
          onChange(name, newStrings);
        }}
        html={html}
      />
    </InputGroupWrapper>
  );
};

// --- Fallback for Firefox/Safari ---
const NORMALIZED_LINE_BREAK = "\n";
const normalizeLineBreak = (str: string) => str.replace(/\r?\n/g, NORMALIZED_LINE_BREAK);
const getStringsByLineBreak = (str: string) => str.split(NORMALIZED_LINE_BREAK);

const BulletListTextareaFallback = <T extends string>({
  label,
  labelClassName,
  name,
  value: bulletListStrings = [],
  placeholder,
  onChange,
  showBulletPoints = true,
}: InputProps<T, string[]> & { showBulletPoints?: boolean }) => {
  const textareaValue = getTextareaValueFromBulletListStrings(bulletListStrings, showBulletPoints);

  return (
    <Textarea
      label={label}
      labelClassName={labelClassName}
      name={name}
      value={textareaValue}
      placeholder={placeholder}
      onChange={(name, value) => {
        onChange(name, getBulletListStringsFromTextareaValue(value, showBulletPoints));
      }}
    />
  );
};

const getTextareaValueFromBulletListStrings = (bulletListStrings: string[], showBulletPoints: boolean) => {
  const prefix = showBulletPoints ? "• " : "";
  if (bulletListStrings.length === 0) return prefix;

  let value = "";
  for (let i = 0; i < bulletListStrings.length; i++) {
    const string = bulletListStrings[i].replace(/<[^>]*>?/gm, ''); // Strip HTML in fallback
    const isLastItem = i === bulletListStrings.length - 1;
    value += `${prefix}${string}${isLastItem ? "" : "\r\n"}`;
  }
  return value;
};

const getBulletListStringsFromTextareaValue = (textareaValue: string, showBulletPoints: boolean) => {
  const textareaValueWithNormalizedLineBreak = normalizeLineBreak(textareaValue);
  const strings = getStringsByLineBreak(textareaValueWithNormalizedLineBreak);

  if (showBulletPoints) {
    const nonEmptyStrings = strings.filter((s) => s !== "•");
    let newStrings: string[] = [];
    for (let string of nonEmptyStrings) {
      if (string.startsWith("• ")) newStrings.push(string.slice(2));
      else if (string.startsWith("•")) {
        const lastItemIdx = newStrings.length - 1;
        if (lastItemIdx >= 0) newStrings[lastItemIdx] = `${newStrings[lastItemIdx]}${string.slice(1)}`;
        else newStrings.push(string.slice(1));
      } else newStrings.push(string);
    }
    return newStrings;
  }
  return strings;
};

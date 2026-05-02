import { TopNavBar } from "@/components/resume/TopNavBar";

export default function ResumeParserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
            <TopNavBar />
            {children}
        </div>
    );
}

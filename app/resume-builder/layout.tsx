import { TopNavBar } from "@/components/resume/TopNavBar";

export default function ResumeBuilderLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        // fixed inset-0: hard-locks to viewport, zero body scroll possible
        <div className="fixed inset-0 flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden">
            <TopNavBar />
            {/* flex-1 + min-h-0 lets the child fill exactly remaining height */}
            <div className="flex-1 min-h-0">
                {children}
            </div>
        </div>
    );
}

"use client"
import React, { useContext, useState, useEffect } from "react";
import { InterviewDataContext } from "@/context/InterviewDataContext";
import { Timer, Mic, PhoneOff, Video, MicOff, MoreVertical } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

function StartInterviewPage() {
    const { interviewInfo } = useContext(InterviewDataContext);
    const [isMuted, setIsMuted] = useState(false);
    const [time, setTime] = useState(0);

    // Simple timer logic
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(prev => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const userInitial = interviewInfo?.userName ? interviewInfo.userName[0].toUpperCase() : "U";

    return (
        <div className="flex flex-col h-screen bg-[#F3F4F6] overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between px-10 py-6 bg-transparent">
                <h1 className="text-xl font-bold text-gray-800">AI Interview Session</h1>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
                    <Timer className="w-5 h-5 text-gray-600" />
                    <span className="font-mono text-lg font-semibold text-gray-700">
                        {formatTime(time)}
                    </span>
                </div>
            </header>

            {/* Main Content - Panels */}
            <main className="flex-1 px-10 pb-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                    {/* AI Recruiter Panel */}
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 flex flex-col items-center justify-center relative transition-all hover:shadow-lg">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 bg-gray-50 relative mb-4">
                            <Image
                                src={'/ai.png'}
                                alt="AI Recruiter"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-700">AI Recruiter</h2>
                        <div className="absolute top-4 left-4 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium border border-primary/20">
                            Live
                        </div>
                    </div>

                    {/* Candidate Panel */}
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 flex flex-col items-center justify-center relative transition-all hover:shadow-lg">
                        <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center text-5xl font-bold text-white mb-4 shadow-inner">
                            {userInitial}
                        </div>
                        <h2 className="text-lg font-semibold text-gray-700">
                            {interviewInfo?.userName || "Candidate"}
                        </h2>
                        <div className="absolute top-4 left-4 bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-medium border border-gray-200">
                            You
                        </div>
                    </div>
                </div>
            </main>

            {/* Bottom Toolbar & Feedback */}
            <footer className="fixed bottom-0 left-0 right-0 p-6 flex flex-col items-center gap-4 bg-gradient-to-t from-[#F3F4F6] to-transparent">
                {/* Voice Amplitude Bar (Mockup Style) */}
                <div className="flex items-center gap-1 h-8 px-4 bg-white/50 rounded-full backdrop-blur-sm">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i) => (
                        <div
                            key={i}
                            className={`w-1 rounded-full transition-all duration-300 ${i % 2 === 0 ? 'bg-primary h-3' : 'bg-red-500 h-5'}`}
                            style={{ opacity: 0.5 + (Math.random() * 0.5) }}
                        />
                    ))}
                </div>

                {/* Controls */}
                <div className="flex items-center gap-6 bg-white px-8 py-4 rounded-3xl shadow-xl border border-gray-200">
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`rounded-full w-12 h-12 ${isMuted ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        onClick={() => setIsMuted(!isMuted)}
                    >
                        {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                    </Button>

                    <Button
                        variant="destructive"
                        size="icon"
                        className="rounded-full w-14 h-14 shadow-lg hover:scale-105 transition-transform"
                    >
                        <PhoneOff className="w-8 h-8" />
                    </Button>

                    <Button variant="ghost" size="icon" className="rounded-full w-12 h-12 bg-gray-100 text-gray-600 hover:bg-gray-200">
                        <MoreVertical className="w-6 h-6" />
                    </Button>
                </div>
            </footer>
        </div>
    );
}

export default StartInterviewPage;

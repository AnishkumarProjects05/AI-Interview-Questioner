"use client";
import React, { useEffect, useState, useContext } from "react";
import InterviewHeader from "../_components/InterviewHeader";
import Image from "next/image";
import { Clock, Loader2, Video, CheckCircle2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { supabase } from "@/services/supabaseClient";
import { InterviewDataContext } from "@/context/InterviewDataContext";
import { useUser } from "@/app/provider";

function InterviewPage() {
    const { interview_id } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
    const { user } = useUser();

    useEffect(() => {   
        if (interview_id) {
            GetInterviewDetails();
        }
    }, [interview_id]);

    const GetInterviewDetails = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('Interviews')
                .select('*')
                .eq('interview_id', interview_id)
                .single();

            if (error) {
                console.error("Error fetching interview details:", error);
            } else {
                setInterviewInfo(data);
                console.log("Fetched Interview Data:", data);
            }
        } catch (err) {
            console.error("An unexpected error occurred:", err);
        } finally {
            setLoading(false);
        }
    }

    const onJoinInterview = async () => {
        setLoading(true);
        let { data: Interviews, error } = await supabase
            .from('Interviews')
            .select('*')
            .eq('interview_id', interview_id);

        if (error) {
            console.error("Error fetching for join:", error);
            setLoading(false);
            return;
        }

        console.log(Interviews[0]);
        setInterviewInfo({
            userName: user?.name,
            interviewData: Interviews[0]
        });
        router.push('/interview/' + interview_id + '/start');
        setLoading(false);
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                <p className="text-xl font-medium text-slate-300 animate-pulse">Loading Interview Details...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden scroll-smooth">
            {/* Ambient Background Gradient Orbs */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-[250px] h-[250px] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />

            {/* Glassmorphic Container Card */}
            <div className="w-full max-w-2xl backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col items-center text-center gap-6 relative z-10 transition-all duration-300">
                
                {/* Logo & Header */}
                <Image src={'/logo.png'} alt='logo' width={200} height={200} className="w-36 sm:w-48 object-contain drop-shadow-md" />
                <h2 className="text-2xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
                    AI-Interview Platform
                </h2>
                
                <Image src={'/interview.png'} alt='Interview' width={200} height={200} className="mt-2 w-36 sm:w-48 object-contain transition-transform duration-300 hover:scale-105" />

                {/* Interview Info */}
                <h2 className="text-xl sm:text-3xl font-bold text-white tracking-tight">
                    {interviewInfo?.jobPosition || "Job Role"} Interview
                </h2>

                <h2 className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-md bg-white/10 border border-white/15 text-slate-200 text-sm sm:text-base font-medium">
                    <Clock className="h-5 w-5 text-blue-400" />
                    {interviewInfo?.duration || "N/A"} Minutes
                </h2>

                {/* System Check Glass Box */}
                <div className="mt-4 p-6 backdrop-blur-md bg-slate-900/40 border border-white/10 rounded-2xl shadow-inner text-left w-full space-y-3">
                    <h2 className="text-lg sm:text-xl font-semibold text-white/90 text-center sm:text-left">
                        Welcome to Vapi AI Mock Interview, {user?.name || "Candidate"}
                    </h2>
                    
                    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        <li className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/5 text-xs sm:text-sm text-slate-200">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                            <span>Ensure Good Network</span>
                        </li>
                        <li className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/5 text-xs sm:text-sm text-slate-200">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                            <span>Ensure Good Microphone</span>
                        </li>
                        <li className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/5 text-xs sm:text-sm text-slate-200">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                            <span>Ensure Good Camera</span>
                        </li>
                    </ul>
                </div>

                {/* Action Button */}
                <Button 
                    className="w-full sm:w-auto px-8 py-6 text-base font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 transition-all duration-200 flex items-center justify-center gap-3 active:scale-95 mt-2"
                    onClick={onJoinInterview}
                >
                    <Video className="w-5 h-5" /> 
                    {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                    Start Interview
                </Button>
            </div>
        </div>
    )
}

export default InterviewPage;
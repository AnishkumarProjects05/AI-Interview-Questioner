"use client"
import React, { useContext, useState, useEffect } from "react";
import Vapi from '@vapi-ai/web';
import { InterviewDataContext } from "@/context/InterviewDataContext";
import { Timer, Mic, Phone, PhoneOff, Video, MicOff, MoreVertical } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import AlertCallConfirmation from "./_components/AlertCallConfirmation";
import { useUser } from "@/app/provider";
import { toast } from "sonner";
import { supabase } from "@/services/supabaseClient";
import { useRouter } from "next/navigation";
function StartInterviewPage() {
    const router = useRouter();
    const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
    const { user } = useUser();
    const [isMuted, setIsMuted] = useState(false);
    const [time, setTime] = useState(0);
    const [vapi, setVapi] = useState(null);
    const [activeUser,setActiveUser] = useState(false);
    const [callStatus, setCallStatus] = useState("inactive"); // inactive, connecting, active, error
    const [isMounted, setIsMounted] = useState(false);


    // Simple timer logic
    useEffect(() => {
        setIsMounted(true);
        const interval = setInterval(() => {
            setTime(prev => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);


    useEffect(() => {
        const apiKey = process.env.NEXT_PUBLIC_VAPI_KEY;
        console.log("Vapi Key loaded:", apiKey ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}` : "undefined");

        const vapiInstance = new Vapi(apiKey);
        setVapi(vapiInstance);

        vapiInstance.on('call-start', () => {
            console.log('Vapi Call started');
            setCallStatus("active");
            toast("Call Connected To AI Recruiter");
        });
        vapiInstance.on('call-end', () => {
            console.log('Vapi Call ended');
            setCallStatus("inactive");
            toast("Call has stopped");
        });
        vapiInstance.on('speech-start', () => {
            console.log("Assistance is started");
            toast("Assistance is started");
            setActiveUser(false);
        });
        vapiInstance.on('speech-end', () => {
            console.log('Speech has ended');
            toast("Assistance is ended");
            setActiveUser(true);
        });
        vapiInstance.on('error', (e) => {
            console.error('Vapi error:', e);
            setCallStatus("error");
        });

        return () => {
            vapiInstance.stop();
        };
    }, []);


    const handleStartCall = () => {
        if (vapi && interviewInfo) {
            setCallStatus("connecting");
            startCall();
        } else {
            console.warn("Vapi or interviewInfo not ready", { vapi: !!vapi, interviewInfo: !!interviewInfo });
        }
    };

    const startCall = () => {
        if (!vapi || !interviewInfo) {
            console.error("Cannot start call: Vapi or interviewInfo missing", { vapi: !!vapi, interviewInfo: !!interviewInfo });
            setCallStatus("error");
            return;
        }

        const userName = interviewInfo?.userName || user?.name || "Candidate";
        console.log("Starting call with userName:", userName);

        let questionList = "";
        if (interviewInfo.interviewData?.questionList) {
            interviewInfo.interviewData.questionList.forEach((item, index) => {
                questionList = (item?.question || "") + (questionList ? ',' + questionList : "");
            });
        }
        const assistantOptions = {
            name: "AI Recruiter",
            firstMessage: "Hi " + userName + ", how are you? Ready for your interview on " + (interviewInfo?.interviewData?.jobPosition || "this role") + "?",
            model: {
                provider: "openai",
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: `
                    You are an AI voice assistant conducting interviews.
                    Your job is to ask candidates provided interview questions, assess their responses.
                    Begin the conversation with a friendly introduction, setting a relaxed yet professional tone. Example:
                    "Hey there! Welcome to your ${interviewInfo?.interviewData?.jobPosition || "job"} interview. Let's get started with a few questions!"
                    Ask one question at a time and wait for the candidate's response before proceeding. Keep the questions clear and concise. Below Are the questions ask one by one:
                    Questions: ${questionList}
                    If the candidate struggles, offer hints or rephrase the question without giving away the answer.
                    Provide brief, encouraging feedback after each answer.
                    Keep the conversation natural and engaging.
                    After 5-7 questions, wrap up the interview smoothly.
                    End on a positive note.
                    Key Guidelines:
                    ✅ Be friendly, engaging, and witty 🎉
                    ✅ Keep responses short and natural, like a real conversation
                    ✅ Adapt based on the candidate's confidence level
                    ✅ Ensure the interview remains focused on React
                            `.trim(),
                    },
                ],
            },
        };
        console.log("Assistant Options:", JSON.stringify(assistantOptions, null, 2));
        vapi.start(assistantOptions);

    }
    const stopInterviewCall = async () => {
        if (vapi) {
            vapi.stop();
            setCallStatus("inactive");

            try {
                // Formatting the actual duration spent
                const actualDuration = Math.floor(time / 60); // minutes
                
                console.log("Updating Interview record with duration:", actualDuration);

                const { data, error } = await supabase
                    .from('Interviews')
                    .update({ 
                        duration: actualDuration.toString(),
                        // We can also store the exact seconds if needed, but the table seems to expect minutes
                    })
                    .eq('interview_id', interviewInfo?.interviewData?.interview_id || interviewInfo?.interview_id);

                if (error) {
                    console.error("Supabase Update Error:", error);
                    toast("Meeting Ended. (History note: Failed to update duration)");
                } else {
                    console.log("Interview Updated Successfully");
                    toast("Meeting Ended and Saved Successfully");
                }
            } catch (err) {
                console.error("Unexpected error updating interview:", err);
                toast("Meeting Ended");
            } finally {
                // Redirect to dashboard
                router.push('/dashboard');
            }
        }
    }
    if (!isMounted) return null;



    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const userInitial = (interviewInfo?.userName || user?.name || "Candidate")[0].toUpperCase();

    return (
        <div className="flex flex-col h-screen bg-background overflow-hidden font-inter relative selection:bg-indigo-500/30 transition-colors duration-500">
            
            {/* Immersive Background Mesh */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-40">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-100 dark:bg-indigo-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-100 dark:bg-violet-600/10 rounded-full blur-[100px]"></div>
            </div>

            {/* Header */}
            <header className="flex items-center justify-between px-10 py-6 bg-white/80 dark:bg-slate-950/50 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 border-t border-white/10 dark:border-white/20">
                        <Video className="w-5 h-5 text-white" />
                    </div>
                    <div className="space-y-0.5">
                        <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Session Active</h1>
                        <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest leading-none">Protected Line</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 px-5 py-2 rounded-xl border border-slate-200 dark:border-white/5 shadow-inner">
                        <Timer className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span className="font-mono text-lg font-black text-slate-700 dark:text-slate-200 tracking-tighter">
                            {formatTime(time)}
                        </span>
                    </div>
                </div>
            </header>

            {/* Main Content - Panels */}
            <main className="flex-1 px-10 pt-10 pb-32 relative z-10 overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto h-full max-h-[550px]">
                    
                    {/* AI Panel */}
                    <div className="bg-white dark:bg-slate-900/40 backdrop-blur-2xl rounded-2xl border border-slate-200 dark:border-white/5 flex flex-col items-center justify-center relative group overflow-hidden animate-in fade-in slide-in-from-left-8 duration-1000 shadow-sm">
                        
                        {/* Status Badge */}
                        <div className={`absolute top-6 left-6 z-20 flex items-center gap-2 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-200 dark:border-white/5 ${callStatus === 'active' ? 'bg-indigo-600/20 text-indigo-600 dark:text-indigo-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'} transition-all`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${callStatus === 'active' ? 'bg-indigo-500 animate-pulse' : 'bg-slate-400 dark:bg-slate-600'}`}></div>
                            {callStatus === 'active' ? 'System Live' : 'System Offline'}
                        </div>

                        {!activeUser && (
                            <div className="relative group/avatar">
                                <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-[80px] group-hover:bg-indigo-500/40 transition-all duration-1000"></div>
                                <div className="w-40 h-40 rounded-2xl overflow-hidden border-4 border-slate-800 bg-slate-900 relative z-10 shadow-2xl transition-all duration-700 group-hover/avatar:scale-105 group-hover/avatar:-rotate-3">
                                    <Image
                                        src={'/ai.png'}
                                        alt="AI Recruiter"
                                        fill
                                        className="object-cover" />
                                </div>
                            </div>
                        )}
                        
                        <div className="mt-8 text-center space-y-2 relative z-10">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Neural Interviewer</h2>
                            <p className="text-indigo-600 dark:text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] bg-indigo-50 dark:bg-slate-800/50 px-3 py-1 rounded-md border border-indigo-100 dark:border-white/5">V2.4 Active</p>
                        </div>

                        <div className="mt-12 relative z-10">
                            {callStatus === "inactive" && (
                                <Button onClick={handleStartCall} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-10 py-7 text-lg font-black shadow-2xl shadow-indigo-500/20 transition-all active:scale-95 border-t border-white/10">
                                    Initiate Intelligence
                                </Button>
                            )}
                            {callStatus === "connecting" && (
                                <div className="flex flex-col items-center gap-4">
                                    <div className="flex gap-1.5">
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                                    </div>
                                    <span className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em]">Synapsing...</span>
                                </div>
                            )}
                        </div>

                        {callStatus === "error" && (
                            <div className="mt-6 text-red-500 font-bold text-sm text-center px-8 relative z-10">
                                <p>Neural Link Severed.</p>
                                <Button onClick={handleStartCall} variant="outline" size="sm" className="mt-4 border-red-500/20 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20">
                                    Refresh Session
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Candidate Panel */}
                    <div className="bg-white dark:bg-slate-900/40 backdrop-blur-2xl rounded-2xl border border-slate-200 dark:border-white/5 flex flex-col items-center justify-center relative overflow-hidden animate-in fade-in slide-in-from-right-8 duration-1000 shadow-sm">
                        <div className="absolute top-6 left-6 z-20 px-3 py-1 rounded-lg border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-[9px] font-black uppercase tracking-widest">
                            Candidate Focus
                        </div>
                        
                        <div className="relative group/user">
                            <div className="absolute inset-0 bg-indigo-500/10 dark:bg-violet-500/10 rounded-full blur-[80px] group-hover:bg-indigo-500/20 dark:group-hover:bg-violet-500/20 transition-all duration-1000"></div>
                            <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-indigo-600 down to-violet-700 flex items-center justify-center text-6xl font-black text-white relative z-10 shadow-2xl shadow-indigo-500/10 transition-transform duration-700 group-hover/user:scale-105 group-hover/user:rotate-3">
                                {userInitial}
                            </div>
                        </div>

                        <div className="mt-8 text-center space-y-2">
                             <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                                {interviewInfo?.userName || user?.name || "Candidate"}
                            </h2>
                            <p className="text-slate-400 dark:text-slate-500 text-[9px] font-black uppercase tracking-widest px-4">Calibrating Performance...</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Bottom Toolbar & Feedback */}
            <footer className="fixed bottom-0 left-0 right-0 p-8 flex flex-col items-center gap-6 bg-gradient-to-t from-background via-background/90 to-transparent relative z-20">
                
                {/* Voice Amplitude Bar */}
                <div className="flex items-end gap-1 px-5 h-10 bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-white/5 rounded-full shadow-indigo-100 dark:shadow-black">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((i) => {
                        const heights = [10, 15, 20, 25, 30, 25, 20, 15, 10, 20, 30, 40, 50, 40, 30, 20, 15, 20, 25, 15];
                        return (
                            <div
                                key={i}
                                className={`w-1 rounded-full transition-all duration-300 ${callStatus === 'active' ? 'bg-indigo-500' : 'bg-slate-800'}`}
                                style={{ 
                                    height: callStatus === 'active' ? `${heights[i-1]}%` : '15%',
                                    opacity: callStatus === 'active' ? (i % 3 === 0 ? 0.3 : 1) : 0.4 
                                }}
                            />
                        );
                    })}
                </div>

                {/* Controls Bar */}
                <div className="flex items-center gap-6 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-white/5 shadow-2xl shadow-indigo-200 dark:shadow-black animate-in slide-in-from-bottom-8 duration-1000">
                    <button className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer border border-slate-100 dark:border-transparent hover:border-slate-200 dark:hover:border-white/5 active:scale-95 group">
                        <MicOff className="h-6 w-6 transition-transform group-hover:scale-110" />
                    </button>
                    
                    <AlertCallConfirmation stopInterview={() => stopInterviewCall()}>
                        <button className="p-5 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all cursor-pointer shadow-xl shadow-red-500/20 active:scale-95 group">
                            <PhoneOff className="h-7 w-7 transition-transform group-hover:rotate-12" />
                        </button>
                    </AlertCallConfirmation>

                    <button className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer border border-slate-100 dark:border-transparent hover:border-slate-200 dark:hover:border-white/5 active:scale-95 group">
                        <Video className="h-6 w-6 transition-transform group-hover:scale-110" />
                    </button>
                </div>
            </footer>
        </div>
    );
}

export default StartInterviewPage;

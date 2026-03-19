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
        <div className="flex flex-col h-screen bg-[#1a1b1e] overflow-hidden font-inter text-white selection:bg-indigo-500/30">
            
            {/* Minimalist Header */}
            <header className="flex items-center justify-between px-6 py-4 z-20">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 group cursor-default">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/10">
                            <Video className="w-4 h-4 text-white" />
                        </div>
                        <h1 className="text-sm font-bold tracking-tight text-gray-300 group-hover:text-white transition-colors">AI Interview Session</h1>
                    </div>
                    <div className="h-4 w-[1px] bg-gray-700 mx-2"></div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-gray-800/50 rounded-full border border-gray-700/50">
                        <div className={`w-2 h-2 rounded-full ${callStatus === 'active' ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            {callStatus === 'active' ? 'Live' : 'Ready'}
                        </span>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 bg-gray-800/80 px-4 py-1.5 rounded-full border border-gray-700/50 shadow-xl">
                        <Timer className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="font-mono text-sm font-bold text-gray-200">
                            {formatTime(time)}
                        </span>
                    </div>
                </div>
            </header>

            {/* Main Video Grid */}
            <main className="flex-1 px-6 pb-24 flex items-center justify-center relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full max-w-6xl aspect-video lg:aspect-auto h-full max-h-[70vh]">
                    
                    {/* AI Interviewer Panel */}
                    <div className="relative bg-[#202124] rounded-2xl border border-gray-700/30 overflow-hidden flex items-center justify-center group shadow-2xl transition-all duration-500">
                        <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded bg-black/40 backdrop-blur-md border border-white/5 text-[10px] font-bold uppercase tracking-widest text-gray-300">
                            Neural Interviewer
                        </div>
                        
                        {!activeUser ? (
                            <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                                <div className="absolute inset-0 bg-indigo-500/5 rounded-full blur-[100px]"></div>
                                <div className="w-32 h-32 md:w-48 md:h-48 rounded-3xl overflow-hidden border-2 border-gray-700 bg-gray-950 relative z-10 shadow-2xl transition-all duration-700 group-hover:scale-105">
                                    <Image
                                        src={'/ai.png'}
                                        alt="AI Recruiter"
                                        fill
                                        className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-full bg-gray-900 flex flex-col items-center justify-center gap-6">
                                <div className="w-24 h-24 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center animate-pulse">
                                     <Mic className="w-10 h-10 text-indigo-400" />
                                </div>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em]">Listening...</p>
                            </div>
                        )}

                        {/* Initial State Button */}
                        {callStatus === "inactive" && (
                            <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-500">
                                <Button onClick={handleStartCall} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 py-6 text-lg font-black shadow-2xl transition-all active:scale-95">
                                    Join Interview
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Candidate (User) Panel */}
                    <div className="relative bg-[#202124] rounded-2xl border border-gray-700/30 overflow-hidden flex items-center justify-center group shadow-2xl transition-all duration-500">
                        <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded bg-black/40 backdrop-blur-md border border-white/5 text-[10px] font-bold uppercase tracking-widest text-gray-300">
                            {interviewInfo?.userName || user?.name || "You"} (Candidate)
                        </div>
                        
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-gray-900 to-gray-800 relative">
                             <div className="absolute inset-0 bg-violet-500/5 rounded-full blur-[100px]"></div>
                             <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center text-5xl md:text-7xl font-black text-white relative z-10 shadow-2xl transition-transform duration-700 group-hover:scale-105">
                                {userInitial}
                            </div>
                        </div>

                        {/* Status Overlay */}
                        <div className="absolute bottom-4 right-4 z-20">
                             <div className="flex items-center gap-2 px-2 py-1 bg-black/40 backdrop-blur-md rounded border border-white/5">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-[9px] font-bold uppercase text-gray-400">Stable Link</span>
                             </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Bottom Floating Control Bar */}
            <footer className="fixed bottom-0 left-0 right-0 p-6 flex flex-col items-center z-50 pointer-events-none">
                
                {/* Visual Feedback (Small) */}
                <div className="mb-4 flex items-center justify-center gap-1.5 px-4 h-8 bg-gray-900/80 backdrop-blur-md border border-gray-700/50 rounded-full pointer-events-auto">
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                        <div
                            key={i}
                            className={`w-1 rounded-full transition-all duration-300 ${callStatus === 'active' ? 'bg-indigo-400' : 'bg-gray-700'}`}
                            style={{ 
                                height: callStatus === 'active' ? `${[20, 40, 60, 80, 60, 40, 20][i-1]}%` : '20%',
                                animationDelay: `${i * 0.1}s`
                            }}
                        />
                    ))}
                </div>

                <div className="flex items-center gap-4 bg-[#202124] p-3 md:p-4 rounded-full border border-gray-700/50 shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto transition-transform hover:scale-[1.02] duration-300">
                    <button 
                        onClick={() => setIsMuted(!isMuted)}
                        className={`p-3.5 rounded-full transition-all active:scale-95 group ${isMuted ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600 border border-gray-600/50 hover:text-white'}`}
                    >
                        {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </button>
                    
                    <button 
                        className="p-3.5 bg-gray-700/50 text-gray-300 rounded-full hover:bg-gray-600 hover:text-white border border-gray-600/50 transition-all active:scale-95"
                    >
                        <Video className="h-5 w-5" />
                    </button>

                    <div className="w-[1px] h-6 bg-gray-700 mx-1"></div>

                    <AlertCallConfirmation stopInterview={() => stopInterviewCall()}>
                        <button className="p-4 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all shadow-xl shadow-red-500/20 active:scale-95 group px-8 flex items-center gap-2">
                            <PhoneOff className="h-5 w-5" />
                            <span className="text-xs font-black uppercase tracking-widest hidden md:block">Leave Call</span>
                        </button>
                    </AlertCallConfirmation>

                    <div className="w-[1px] h-6 bg-gray-700 mx-1"></div>

                    <button className="p-3.5 bg-gray-700/50 text-gray-300 rounded-full hover:bg-gray-600 hover:text-white border border-gray-600/50 transition-all active:scale-95">
                        <MoreVertical className="h-5 w-5" />
                    </button>
                </div>
            </footer>
        </div>
    );
}

export default StartInterviewPage;

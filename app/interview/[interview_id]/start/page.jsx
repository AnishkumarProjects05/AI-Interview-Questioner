"use client"
import React, { useContext, useState, useEffect } from "react";
import Vapi from '@vapi-ai/web';
import { InterviewDataContext } from "@/context/InterviewDataContext";
import { Timer, Mic, Phone, PhoneOff, Video, MicOff, MoreVertical } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import AlertCallConfirmation from "./_components/AlertCallConfirmation";
import { useUser } from "@/app/provider";

function StartInterviewPage() {
    const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
    const { user } = useUser();
    const [isMuted, setIsMuted] = useState(false);
    const [time, setTime] = useState(0);
    const [vapi, setVapi] = useState(null);
    const [callStatus, setCallStatus] = useState("inactive"); // inactive, connecting, active, error

    // Simple timer logic
    useEffect(() => {
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
        });
        vapiInstance.on('call-end', () => {
            console.log('Vapi Call ended');
            setCallStatus("inactive");
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
    const stopInterviewCall = () => {
        if (vapi) {
            vapi.stop();
            setCallStatus("inactive");
        }
    }


    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const userInitial = (interviewInfo?.userName || user?.name || "Candidate")[0].toUpperCase();

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

                        {callStatus === "inactive" && (
                            <Button onClick={handleStartCall} className="mt-4">
                                Connect AI Recruiter
                            </Button>
                        )}
                        {callStatus === "connecting" && (
                            <div className="mt-4 text-primary animate-pulse font-medium">
                                Connecting...
                            </div>
                        )}
                        {callStatus === "error" && (
                            <div className="mt-4 text-red-500 font-medium text-sm text-center px-4">
                                Connection Error. Check your API Key and Network.
                                <Button onClick={handleStartCall} variant="outline" size="sm" className="mt-2 block mx-auto">
                                    Retry
                                </Button>
                            </div>
                        )}

                        <div className={`absolute top-4 left-4 ${callStatus === 'active' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-gray-100 text-gray-400 border-gray-200'} px-3 py-1 rounded-full text-xs font-medium border`}>
                            {callStatus === 'active' ? 'Live' : 'Offline'}
                        </div>
                    </div>

                    {/* Candidate Panel */}
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 flex flex-col items-center justify-center relative transition-all hover:shadow-lg">
                        <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center text-5xl font-bold text-white mb-4 shadow-inner">
                            {userInitial}
                        </div>
                        <h2 className="text-lg font-semibold text-gray-700">
                            {interviewInfo?.userName || user?.name || "Candidate"}
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
                            style={{ opacity: 0.7 }}
                        />
                    ))}
                </div>

                {/* Controls */}
                <div className="flex items-center gap-6 bg-white px-8 py-4 rounded-3xl shadow-xl border border-gray-200">
                    <Mic className="h-12 w-12 p-3 bg-gray-500 text-white rounded-full cursor-pointer" />
                    <AlertCallConfirmation stopInterview={() => stopInterviewCall()}>
                        <Phone className="h-12 w-12 p-3 bg-gray-500 text-white rounded-full cursor-pointer" />
                    </AlertCallConfirmation>

                </div>
            </footer>
        </div>
    );
}

export default StartInterviewPage;

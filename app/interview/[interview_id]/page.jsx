"use client"
import React, { useEffect, useState, useContext } from "react";
import InterviewHeader from "../_components/InterviewHeader";
import Image from "next/image";
import { Clock, Loader2, Video } from "lucide-react";
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
            return;
        }

        console.log(Interviews[0]);
        setInterviewInfo({
            userName: user?.name,
            questionlist: Interviews[0]
        });
        router.push('/interview/' + interview_id + '/start');
        setLoading(false);
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="text-xl font-medium text-gray-600">Loading Interview Details...</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center gap-5 p-10">
            <Image src={'/logo.png'} alt='logo' width={200} height={200} />
            <h2 className="text-3xl font-bold text-primary">AI-Interview Platform</h2>
            <Image src={'/interview.png'} alt='Interview' width={200} height={200} className="mt-4" />

            <h2 className="text-2xl font-bold text-gray-800">
                {interviewInfo?.jobPosition || "Job Role"} Interview
            </h2>

            <h2 className="m-3 flex flex-row items-center gap-3 text-lg font-medium text-gray-600">
                <Clock className="h-5 w-5" />
                {interviewInfo?.duration || "N/A"} Minutes
            </h2>

            <div className="mt-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 text-center max-w-2xl">
                <h2 className="text-xl font-semibold text-gray-700">
                    Welcome to Vapi AI Mock Interview, {user?.name || "Candidate"}
                </h2>
                <div className="mt-4 text-left text-gray-500 space-y-2 ml-14">
                    <li className="list-disc text-blue-900">Ensure You Have Good Network Connection</li>
                    <li className="list-disc text-blue-900">Ensure You Have Good Microphone</li>
                    <li className="list-disc text-blue-900">Ensure You Have Good Camera</li>

                </div>
            </div>

            <Button className="flex flex-row gap-3 mt-6"
                onClick={onJoinInterview}>
                <Video /> {loading && <Loader2 />}Start Interview
            </Button>
        </div>
    )
}

export default InterviewPage;
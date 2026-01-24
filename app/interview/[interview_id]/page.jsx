import React from "react";
import InterviewHeader from "../_components/InterviewHeader";
import Image from "next/image";

function InterviewPage() {
    return (
        <div className="flex flex-col items-center justify-center gap-5 ">
            <Image src={'/logo.png'} alt='logo' width={200} height={200} />
            <h2 className="text-3xl font-bold ">AI-Interview Platform</h2>
            <Image src={'/interview.png'} alt='Interview' width={200} height={200} className="" />

        </div>
    )
}
export default InterviewPage
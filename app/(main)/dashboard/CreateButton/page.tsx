"use client"

import { Progress } from "@/components/ui/progress"
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import FormContainer from "./_components/FormContainer";
import QuestionList from "./_components/QuestionList";
import { toast } from "sonner";
import CreateinterviewLink from './_components/CreateInterviewLink';

function CreateInterview() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [interviewId, setinterviewId] = useState();
  const onHandleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    console.log("FormData", formData);

  };
  const GoToNext = () => {
    if (Object.keys(formData).length <= 3) {
      toast('Please Enter all the Details')
      return;
    }
    setStep(step + 1);
  }
  const onCreateLink = (interview_id) => {
    setinterviewId(interview_id);
    setStep(step + 1);
    console.log(interview_id);
        
  }
  return (
    <div className='mt-10 px-10 lg:px-44 xl:px-56 font-inter'>
      <div className='flex gap-5 items-center mb-6'>
        <button 
          onClick={() => router.back()} 
          className='p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm'
        >
          <ArrowLeft className='w-5 h-5' />
        </button>
        <h2 className='text-3xl font-black text-slate-900 dark:text-white tracking-tight'>Session Architect</h2>
      </div>
      <Progress value={step * 33.33} className='h-2 mb-10' />

      {step === 1 && (
        <FormContainer
          onHandleInputChange={onHandleInputChange}
          GoToNext={GoToNext}
        />
      )}
      {step === 2 && (
        <QuestionList formData={formData} onCreateLink={onCreateLink} />
      )}
      {step === 3 && (
        <CreateinterviewLink interviewId={interviewId} formData={formData} />
      )}

    </div>
  )
}

export default CreateInterview;

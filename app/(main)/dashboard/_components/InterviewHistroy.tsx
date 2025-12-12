"use client"
import { Camera, Video } from 'lucide-react';
import React, { useState } from 'react'

function InterviewHistroy() {
    const [interviewlist,setInterviewlist] = useState([]);
  return (
    <div className='my-5'>
        <h2 className=' ml-4 font-bold text-4xl text-emerald-500 text-center'>Interview Histroy</h2>
        {interviewlist?.length == 0 && 
        <div className='flex flex-col gap-5 items-center mt-10 p-5'>
            <Video className='  text-black  '/>
            <h2 className=''>You Had not attended any Interview Recently</h2>
        </div>
        }
      
    </div>
  )
}

export default InterviewHistroy

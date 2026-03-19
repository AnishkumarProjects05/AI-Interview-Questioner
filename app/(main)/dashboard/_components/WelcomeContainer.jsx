"use client"
import React from 'react'
import { useUser } from '@/app/provider';
import Image from 'next/image';

function WelcomeContainer() {
  const { user } = useUser();

  return (
    <div className='w-full'>
      <div className='relative overflow-hidden bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 font-inter shadow-xl shadow-indigo-100 dark:shadow-indigo-500/10 group transition-all hover:border-indigo-500/20 dark:hover:border-indigo-500/30'>

        {/* Decorative Glows */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-50 dark:bg-indigo-600/10 rounded-full blur-[100px] -mr-40 -mt-40 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-600/20 transition-all duration-1000"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-violet-50 dark:bg-violet-600/5 rounded-full blur-[80px] -ml-20 -mb-20"></div>

        <div className='relative z-10 flex flex-col md:flex-row items-center justify-between gap-10'>

          <div className='flex-1 space-y-6'>
            <div className='inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-full'>
              <div className='w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse'></div>
              <span className='text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest'>Platform Overview</span>
            </div>

            <div className='space-y-3'>
              <h1 className='text-4xl md:text-5xl font-black text-[#0f172a] dark:text-white tracking-tight leading-[1.1]'>
                Master Your Next <br />
                <span className='text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400'>Technical Interview</span>
              </h1>
              <p className='text-slate-500 dark:text-slate-400 text-lg font-medium max-w-xl leading-relaxed'>
                Practice with our advanced AI recruiter. Realistic simulations, instant feedback, and data-driven insights to help you land your dream job.
              </p>
            </div>


          </div>

          <div className='relative w-[280px] h-[280px] hidden lg:flex items-center justify-center group/img'>
            <div className='absolute inset-0 bg-indigo-100 rounded-full blur-3xl animate-pulse opacity-50'></div>
            <Image
              src={'/meeting.png'}
              alt='hero'
              width={240}
              height={240}
              className='relative z-10 object-contain drop-shadow-[0_20px_50px_rgba(99,102,241,0.15)] transition-transform duration-700 group-hover/img:scale-110 group-hover/img:-rotate-3'
            />
          </div>

        </div>
      </div>
    </div>
  )
}

export default WelcomeContainer
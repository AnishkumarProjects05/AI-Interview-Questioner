"use client"
import Link from 'next/link'
import { FileText, Phone, Plus, Video } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

function Options() {

  const cardBase = 'group relative flex flex-col p-8 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/30 dark:hover:border-indigo-500/50 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 dark:shadow-black/20';

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-8 w-full font-inter'>

      {/* Main Hero Card */}
      <Link href="/dashboard/CreateButton" className={`${cardBase} md:col-span-2 bg-gradient-to-br from-white to-indigo-50/30 dark:from-slate-900 dark:to-slate-950 min-h-[320px] justify-between`}>
        
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 dark:bg-indigo-600/10 rounded-full blur-[100px] dark:blur-[120px] -mr-40 -mt-40 transition-all group-hover:bg-indigo-500/10 dark:group-hover:bg-indigo-600/20"></div>

        <div className="relative z-10 space-y-6 max-w-2xl">
            <div className='p-4 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl w-fit group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 border border-indigo-100 dark:border-transparent'>
              <Video className="w-8 h-8" />
            </div>

            <div className="space-y-3">
                <h4 className='text-3xl font-black text-[#0f172a] dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors'>AI Mock Interview</h4>
                <p className='text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed'>
                  Experience a high-fidelity technical interview simulation. Our AI evaluates your responses, 
                  coding patterns, and soft skills in <span className='text-indigo-600 dark:text-indigo-400 font-bold'>real-time</span>.
                </p>
            </div>
        </div>

        <div className='relative z-10 mt-8 flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white w-fit rounded-xl font-black transition-all duration-300 shadow-lg shadow-indigo-200 active:scale-95'>
          <Plus className="w-5 h-5" />
          <span>Start New Session</span>
        </div>

        {/* Floating Decoration */}
        <div className='absolute bottom-8 right-8 hidden lg:block animate-pulse'>
            <div className='w-24 h-24 bg-indigo-100 rounded-full blur-2xl'></div>
        </div>
      </Link>

      {/* Secondary Cards (Placeholders / Minor Actions) */}
      <div className={`${cardBase} h-[200px] justify-center items-center opacity-70 grayscale hover:grayscale-0 transition-all bg-slate-50/50 border-dashed`}>
        <div className="text-center space-y-2">
           <Phone className="w-6 h-6 text-slate-400 mx-auto" />
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Behavioral Coach</p>
           <p className="text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-1 rounded-full w-fit mx-auto">Coming Soon</p>
        </div>
      </div>

      <div 
        onClick={() => toast('Resume Analyzer feature is coming soon!')}
        className={`${cardBase} h-[200px] justify-center items-center opacity-70 grayscale hover:grayscale-0 cursor-pointer transition-all bg-slate-50/50 dark:bg-slate-900/50 border-dashed group/resume`}
      >
        <div className="text-center space-y-2">
           <FileText className="w-6 h-6 text-slate-400 mx-auto group-hover/resume:text-indigo-500 transition-colors" />
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resume Analyzer</p>
           <p className="text-[10px] text-slate-500 font-bold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full w-fit mx-auto">Coming Soon</p>
        </div>
      </div>

      <div className={`${cardBase} h-[200px] justify-center items-center opacity-50 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/20`}>
          <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Upcoming Module: DS & Algo</p>
      </div>

    </div>
  )
}

export default Options
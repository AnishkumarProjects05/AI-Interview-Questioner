"use client"
import Image from 'next/image'
import React from 'react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/services/supabaseClient'
import { LogIn } from 'lucide-react'

function Login() {
  const signInGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
    if (error) {
      console.log('Error: ', error.message)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden font-inter selection:bg-indigo-500/30">
      
      {/* Immersive Background Mesh */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-100 dark:bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-violet-100 dark:bg-violet-600/10 rounded-full blur-[140px] animate-pulse delay-1000"></div>
        <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-blue-50 dark:bg-blue-600/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md bg-white/80 dark:bg-slate-900/40 backdrop-blur-2xl rounded-2xl border border-slate-100 dark:border-white/5 shadow-2xl shadow-indigo-100 dark:shadow-black/50 overflow-hidden flex flex-col items-center p-12 relative z-10 animate-in fade-in zoom-in duration-700">
        
        {/* Glow Top Border Effect */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>

        {/* Logo Section */}
        <div className="mb-12 hover:scale-110 transition-transform duration-500">
          <Image src="/logo.png" alt="logo" width={200} height={200} className='w-[140px]' priority />
        </div>

        {/* Illustration Section */}
        <div className="mb-10 relative group">
            <div className="absolute inset-0 bg-indigo-500/20 rounded-full scale-125 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            <Image 
              src={'/login.png'} 
              alt='login' 
              width={260} 
              height={200} 
              className='relative z-10 w-[240px] h-auto object-contain transition-transform duration-700 group-hover:scale-105 group-hover:-rotate-2'
            />
        </div>

        {/* Text Section */}
        <div className="text-center space-y-4 mb-12">
          <h2 className='text-3xl font-black text-[#0f172a] dark:text-white tracking-tight leading-tight'>
            Elevate Your <span className='text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400'>Career</span>
          </h2>
          <p className='text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed px-2'>
            Practice with the next generation of <span className="text-indigo-600 dark:text-indigo-400 font-bold border-b border-indigo-200 dark:border-indigo-400/20">AI Recruiter</span>. Realistic, insightful, and professional.
          </p>
        </div>

        {/* Action Section */}
        <div className="w-full space-y-6">
            <Button 
                className='w-full py-7 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-lg shadow-xl shadow-indigo-500/20 border-t border-white/10 transition-all flex items-center justify-center gap-3 active:scale-[0.97]'
                onClick={signInGoogle}
            >
                <LogIn className="w-5 h-5" />
                Get Started
            </Button>
            
            <div className="flex items-center justify-center gap-2 pt-2">
               <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></div>
               <p className="text-[9px] text-slate-500 text-center uppercase tracking-[0.2em] font-black">
                   Secured by CareerConnect Cloud
               </p>
            </div>
        </div>
      </div>

      {/* Subtle Footer */}
      <div className="absolute bottom-10 text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-4">
        <span>© 2024 AI-INTERVIEWER</span>
        <div className='w-1 h-1 bg-slate-200 dark:bg-slate-800 rounded-full'></div>
        <span>TERMS</span>
        <div className='w-1 h-1 bg-slate-200 dark:bg-slate-800 rounded-full'></div>
        <span>PRIVACY</span>
      </div>
    </div>
  )
}

export default Login

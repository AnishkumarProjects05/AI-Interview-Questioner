import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link' // Fixed: Import Link from next/link for navigation
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Copy, Clock, List, ArrowLeft, Plus, Mail, MessageCircle, Check } from 'lucide-react'
import { toast } from 'sonner'

function CreateInterviewLink({ interviewId, formData }) {

  const [interviewUrl, setInterviewUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (interviewId) {
      GetInterviewUrl();
    }
  }, [interviewId])

  const GetInterviewUrl = () => {
    const url = window.location.origin + '/interview/' + interviewId;
    setInterviewUrl(url);
  }

  const onCopy = () => {
    navigator.clipboard.writeText(interviewUrl);
    setCopied(true);
    toast('Link Copied to Clipboard');

    // Reset icon after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className='flex flex-col items-center justify-center my-10 px-4 font-inter min-h-[70vh] relative'>
      
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none opacity-50" />

      {/* Main Success Card */}
      <div className='w-full max-w-2xl bg-white dark:bg-slate-900/40 backdrop-blur-3xl rounded-2xl border border-slate-200 dark:border-white/5 shadow-2xl shadow-indigo-100 dark:shadow-black/50 overflow-hidden animate-in fade-in zoom-in slide-in-from-bottom-8 duration-1000 relative z-10 transition-colors duration-500'>

        {/* Header Section */}
        <div className='bg-gradient-to-br from-indigo-50 dark:from-indigo-600/20 to-transparent p-12 flex flex-col items-center text-center border-b border-slate-200 dark:border-white/5 relative group'>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[100px] -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-1000"></div>
          </div>
          
          <div className='bg-white dark:bg-slate-950 p-6 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 mb-8 relative z-10 transform group-hover:rotate-2 transition-transform duration-700 hover:scale-105 shadow-indigo-100 dark:shadow-black'>
            <Image src="/meeting.png" width={160} height={160} alt="Interview Ready" className='object-contain' />
          </div>
          
          <div className="relative z-10 space-y-3">
            <h2 className='font-black text-4xl text-slate-900 dark:text-white tracking-tight'>
              Neural Path Verified
            </h2>
            <p className='text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium text-lg leading-relaxed'>
              Your AI-powered environment is mapped. Intelligence is primed for <span className="text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-widest text-sm">{formData?.jobPosition || 'Target Candidate'}</span>.
            </p>
          </div>
        </div>

        {/* Link & Details Section */}
        <div className='p-10 space-y-10'>

          {/* URL Copy Section */}
          <div className="bg-slate-50 dark:bg-slate-950/50 p-8 rounded-xl border border-slate-200 dark:border-white/5 shadow-inner">
            <label className='text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-4 block text-center'>Session Invitation Protocol</label>
            <div className='flex flex-col sm:flex-row gap-4'>
              <div className="relative flex-1 group/input">
                <Input
                  value={interviewUrl}
                  readOnly
                  className='h-14 bg-white dark:bg-slate-900/50 border-slate-200 dark:border-white/10 text-indigo-600 dark:text-indigo-400 rounded-xl focus-visible:ring-indigo-500/30 font-bold pr-12 shadow-inner transition-all'
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover/input:text-indigo-400 transition-colors">
                  <Check className={`w-5 h-5 ${copied ? 'text-indigo-500 opacity-100' : 'opacity-20'} transition-opacity`} />
                </div>
              </div>
              <Button
                onClick={onCopy}
                className={`h-14 px-8 rounded-xl shadow-xl transition-all duration-500 text-sm font-black active:scale-[0.98] ${copied ? 'bg-indigo-800 text-white shadow-indigo-500/10' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20'} border-t border-white/10`}
              >
                {copied ? <Check className='w-4 h-4 mr-2' /> : <Copy className='w-4 h-4 mr-2' />}
                {copied ? 'Copied' : 'Secure Copy'}
              </Button>
            </div>
          </div>

          {/* Interview Details Grid */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='flex items-center gap-4 p-5 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200 dark:border-white/5 hover:border-indigo-500/30 transition-all group/info'>
              <div className='p-3.5 bg-white dark:bg-slate-800 rounded-lg text-indigo-600 dark:text-indigo-400 group-hover/info:bg-indigo-600 group-hover/info:text-white transition-all shadow-sm border border-slate-200 dark:border-transparent'>
                <Clock className='w-5 h-5' />
              </div>
              <div>
                <p className='text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mb-0.5'>Temporal Scope</p>
                <p className='text-lg font-black text-slate-900 dark:text-white'>{formData?.duration || '0'} Mins</p>
              </div>
            </div>

            <div className='flex items-center gap-4 p-5 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200 dark:border-white/5 hover:border-indigo-500/30 transition-all group/info'>
              <div className='p-3.5 bg-white dark:bg-slate-800 rounded-lg text-indigo-600 dark:text-indigo-400 group-hover/info:bg-indigo-600 group-hover/info:text-white transition-all shadow-sm border border-slate-200 dark:border-transparent'>
                <List className='w-5 h-5' />
              </div>
              <div>
                <p className='text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mb-0.5'>Logic Target</p>
                <p className='text-lg font-black text-slate-900 dark:text-white truncate max-w-[120px]' title={formData?.jobPosition}>
                  {formData?.jobPosition || 'General'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col gap-4">
             <Link href={'/interview/' + interviewId} className="w-full">
                <Button className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-lg font-black shadow-2xl shadow-indigo-500/20 border-t border-white/10 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group/start">
                   Enter Session Node
                   <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center group-hover/start:translate-x-1.5 transition-transform duration-300">
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                   </div>
                </Button>
             </Link>
             
             <div className="flex gap-4">
                <Link href={'/dashboard'} className="flex-1">
                    <Button variant="outline" className="w-full h-14 rounded-xl border-white/5 bg-slate-800/50 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:bg-slate-800 hover:text-white shadow-sm transition-all focus:ring-0">
                         Dashboard
                    </Button>
                </Link>
                <Link href={'/dashboard/CreateButton'} className="flex-1">
                    <Button variant="outline" className="w-full h-14 rounded-xl border-indigo-500/20 bg-indigo-500/5 text-indigo-400 font-black uppercase text-[10px] tracking-widest hover:bg-indigo-500/10 hover:text-indigo-300 shadow-sm transition-all focus:ring-0">
                        Reset Flux
                    </Button>
                </Link>
             </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default CreateInterviewLink
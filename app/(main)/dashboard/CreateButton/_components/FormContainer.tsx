import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import React, { useEffect, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { InterviewType } from '@/services/Constant'
import { ArrowRight, Briefcase, Clock, FileText, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

function FormContainer({ onHandleInputChange, GoToNext }) {
    // State to handle the selected Interview Type
    const [selectedType, setSelectedType] = useState([]);

    useEffect(() => {
        onHandleInputChange('type', selectedType);
    }, [selectedType])

    const addInterviewType = (type) => {
        if (!selectedType.includes(type)) {
            setSelectedType(prev => [...prev, type]);
        } else {
            const result = selectedType.filter(item => item !== type);
            setSelectedType(result);
        }
    }

    return (
        <div className='bg-white dark:bg-slate-900/40 backdrop-blur-2xl rounded-2xl border border-slate-200 dark:border-white/5 shadow-2xl shadow-indigo-100 dark:shadow-black/50 overflow-hidden font-inter transition-colors duration-500'>
            
            {/* Header Section */}
            <div className='bg-gradient-to-br from-indigo-50 dark:from-indigo-600/20 to-transparent p-10 border-b border-slate-200 dark:border-white/5 relative overflow-hidden group'>
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[100px] -mr-20 -mt-20 group-hover:bg-indigo-500/20 transition-all duration-1000"></div>
                
                <div className="relative z-10 flex items-center gap-5">
                    <div className='p-4 bg-indigo-600 rounded-xl text-white shadow-xl shadow-indigo-500/20 border-t border-white/10'>
                        <Sparkles className='w-7 h-7' />
                    </div>
                    <div>
                        <h1 className='text-3xl font-black text-slate-900 dark:text-white tracking-tight'>Session Architect</h1>
                        <p className='text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1'>
                            Define your performance parameters
                        </p>
                    </div>
                </div>
            </div>

            <div className='p-8 space-y-10'>
                
                {/* Job Details Section */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                    
                    {/* Job Position */}
                    <div className='space-y-3'>
                        <label className='flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1'>
                            <Briefcase className='w-3.5 h-3.5 text-indigo-500' />
                            Target Position
                        </label>
                        <Input
                            type="text"
                            placeholder="Ex. Lead Systems Engineer"
                            className="h-14 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-white/10 rounded-xl focus:bg-white dark:focus:bg-slate-950 focus:border-indigo-500/50 focus:ring-indigo-500/20 transition-all font-bold text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 shadow-inner"
                            onChange={(event) => onHandleInputChange('jobPosition', event.target.value)}
                        />
                    </div>

                    {/* Duration */}
                    <div className='space-y-3'>
                        <label className='flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1'>
                            <Clock className='w-3.5 h-3.5 text-indigo-500' />
                            Session Scope
                        </label>
                        <Select onValueChange={(value) => onHandleInputChange('duration', value)}>
                            <SelectTrigger className="h-14 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-white/10 rounded-xl focus:border-indigo-500/50 focus:ring-indigo-500/20 font-bold text-slate-900 dark:text-slate-200 shadow-inner">
                                <SelectValue placeholder="Select Duration" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-200">
                                <SelectItem value="5" className="focus:bg-indigo-500/10 focus:text-indigo-600 dark:focus:bg-indigo-500/20 dark:focus:text-indigo-400">05 Minutes (Blitz)</SelectItem>
                                <SelectItem value="15" className="focus:bg-indigo-500/10 focus:text-indigo-600 dark:focus:bg-indigo-500/20 dark:focus:text-indigo-400">15 Minutes (Standard)</SelectItem>
                                <SelectItem value="30" className="focus:bg-indigo-500/10 focus:text-indigo-600 dark:focus:bg-indigo-500/20 dark:focus:text-indigo-400">30 Minutes (Deep Dive)</SelectItem>
                                <SelectItem value="60" className="focus:bg-indigo-500/10 focus:text-indigo-600 dark:focus:bg-indigo-500/20 dark:focus:text-indigo-400">60 Minutes (Marathon)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Description */}
                <div className='space-y-3'>
                    <label className='flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1'>
                        <FileText className='w-3.5 h-3.5 text-indigo-500' />              
                        Contextual Intel <span className='lowercase opacity-50'>(Job Description)</span>
                    </label>
                    <Textarea
                        placeholder="Neural engine needs context... Paste technical requirements or role summary here."
                        className="min-h-[160px] bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-white/10 rounded-xl focus:bg-white dark:focus:bg-slate-950 focus:border-indigo-500/50 focus:ring-indigo-500/20 transition-all resize-none p-6 font-medium text-slate-800 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-700 shadow-inner"
                        onChange={(event) => onHandleInputChange('jobDescription', event.target.value)}
                    />
                </div>

                {/* Interview Type Selector (Grid Design) */}
                <div className='space-y-6'>
                    <label className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2'>
                        Specialization Nodes <span className='text-slate-600 lowercase ml-2'>(multi-select)</span>
                    </label>
                    
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                        {InterviewType.map((type, index) => {
                            const isActive = selectedType.includes(type.title);
                            return (
                                <div
                                    key={index}
                                    onClick={() => addInterviewType(type.title)}
                                    className={`
                                        cursor-pointer relative p-5 rounded-xl border transition-all duration-500 flex flex-col items-center justify-center gap-3 text-center group overflow-hidden
                                        ${isActive 
                                            ? 'border-indigo-500/50 bg-indigo-500/5 dark:bg-indigo-500/10 shadow-lg shadow-indigo-500/5' 
                                            : 'border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-950/40 hover:bg-white dark:hover:bg-slate-900 hover:border-indigo-200 dark:hover:border-white/10'
                                        }
                                    `}
                                >
                                    <div className={`p-3 rounded-lg transition-all duration-700 ${isActive ? 'bg-indigo-500 text-white shadow-xl shadow-indigo-500/40' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:scale-110'}`}>
                                        <type.icon className="h-5 w-5" />
                                    </div>
                                    <span className={`text-[11px] font-black tracking-widest uppercase ${isActive ? 'text-indigo-400' : 'text-slate-500'}`}>
                                        {type.title}
                                    </span>
                                    
                                    {isActive && (
                                        <div className='absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]' />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Action Button */}
                <div className='pt-6'>
                    <Button 
                        variant="default"
                        size="lg"
                        className='w-full h-16 text-lg bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black shadow-2xl shadow-indigo-500/20 border-t border-white/10 transition-all active:scale-[0.98] group/btn flex items-center justify-center gap-3' 
                        onClick={() => GoToNext()}
                    >
                        Initialize Question Matrix
                        <ArrowRight className='w-5 h-5 group-hover/btn:translate-x-1.5 transition-transform' />
                    </Button>
                </div>

            </div>
        </div>
    )
}

export default FormContainer
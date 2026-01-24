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
        <div className='bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden'>
            
            {/* Header Section */}
            <div className='bg-emerald-50/50 p-6 border-b border-gray-100'>
                <div className='flex items-center gap-2 mb-1'>
                    <div className='p-2 bg-emerald-100 rounded-lg text-emerald-600'>
                        <Sparkles className='w-5 h-5' />
                    </div>
                    <h1 className='text-xl font-bold text-gray-800'>Interview Details</h1>
                </div>
                <p className='text-gray-500 text-sm ml-11'>
                    Configure the role and scope to generate the perfect AI questions.
                </p>
            </div>

            <div className='p-6 space-y-8'>
                
                {/* Job Details Section */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    
                    {/* Job Position */}
                    <div className='space-y-2'>
                        <label className='flex items-center gap-2 text-sm font-semibold text-gray-700'>
                            <Briefcase className='w-4 h-4 text-emerald-500' />
                            Job Role / Position
                        </label>
                        <Input
                            placeholder="Ex. Senior React Developer"
                            className="h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-emerald-500 focus:ring-emerald-500 transition-all"
                            onChange={(event) => onHandleInputChange('jobPosition', event.target.value)}
                        />
                    </div>

                    {/* Duration */}
                    <div className='space-y-2'>
                        <label className='flex items-center gap-2 text-sm font-semibold text-gray-700'>
                            <Clock className='w-4 h-4 text-emerald-500' />
                            Duration
                        </label>
                        <Select onValueChange={(value) => onHandleInputChange('duration', value)}>
                            <SelectTrigger className="h-11 bg-gray-50 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500">
                                <SelectValue placeholder="Select Duration" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5 Minutes (Short)</SelectItem>
                                <SelectItem value="15">15 Minutes (Standard)</SelectItem>
                                <SelectItem value="30">30 Minutes (Deep Dive)</SelectItem>
                                <SelectItem value="60">60 Minutes (Full Round)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Description */}
                <div className='space-y-2'>
                    <label className='flex items-center gap-2 text-sm font-semibold text-gray-700'>
                        <FileText className='w-4 h-4 text-emerald-500' />
                        Job Description & Requirements
                    </label>
                    <Textarea
                        placeholder="Paste the JD here. Include tech stack, years of experience, and key responsibilities..."
                        className="min-h-[150px] bg-gray-50 border-gray-200 focus:bg-white focus:border-emerald-500 focus:ring-emerald-500 transition-all resize-none"
                        onChange={(event) => onHandleInputChange('jobDescription', event.target.value)}
                    />
                </div>

                {/* Interview Type Selector (Grid Design) */}
                <div className='space-y-3'>
                    <label className='text-sm font-semibold text-gray-700'>
                        Focus Areas <span className='text-gray-400 font-normal ml-1'>(Select all that apply)</span>
                    </label>
                    
                    <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                        {InterviewType.map((type, index) => {
                            const isActive = selectedType.includes(type.title);
                            return (
                                <div
                                    key={index}
                                    onClick={() => addInterviewType(type.title)}
                                    className={`
                                        cursor-pointer relative p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 text-center group
                                        ${isActive 
                                            ? 'border-emerald-500 bg-emerald-50/50 shadow-sm' 
                                            : 'border-gray-100 bg-white hover:border-emerald-200 hover:bg-gray-50'
                                        }
                                    `}
                                >
                                    <div className={`p-2 rounded-full transition-colors ${isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500 group-hover:text-emerald-500'}`}>
                                        <type.icon className="h-5 w-5" />
                                    </div>
                                    <span className={`text-sm font-medium ${isActive ? 'text-emerald-900' : 'text-gray-600'}`}>
                                        {type.title}
                                    </span>
                                    
                                    {/* Active Checkmark Badge */}
                                    {isActive && (
                                        <div className='absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 animate-pulse' />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Action Button */}
                <div className='pt-4'>
                    <Button 
                        className='w-full h-12 text-lg bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all hover:scale-[1.01]' 
                        onClick={() => GoToNext()}
                    >
                        Start Generating Questions <ArrowRight className='ml-2 w-5 h-5' />
                    </Button>
                </div>

            </div>
        </div>
    )
}

export default FormContainer
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
import { ArrowRight } from 'lucide-react'

function FormContainer({ onHandleInputChange , GoToNext }) {
    // State to handle the selected Interview Type for demonstration
    const [selectedType, setSelectedType] = useState([]);

    useEffect(()=>{
        onHandleInputChange('type',selectedType);

    },[selectedType])

    const addInterviewType = (type)=>{
        if(!selectedType.includes(type)){
            // If not selected, add it
            setSelectedType(prev=>[...prev,type]);
        }
        else{
            // If already selected, remove it (toggle off)
            const result = selectedType.filter(item=>item !== type);
            setSelectedType(result);
        }
    }
    // Define the primary green color for reuse
    const primaryGreen = 'border-emerald-600 text-emerald-600 hover:bg-emerald-50';
    const activeGreen = 'bg-emerald-600 text-white';

    return (
        <div className='p-6 bg-white rounded-xl shadow-lg border border-gray-100'> {/* White background, subtle shadow and border */}
            <h1 className='text-2xl font-extrabold text-gray-800 mb-6'>Interview Configuration</h1>
            <div className='space-y-6'>
                {/* Job Position Input */}
                <div className=''>
                    <h2 className='font-bold font-sans text-sm text-gray-700 mb-2'>Job Position</h2>
                    <Input 
                        placeholder="Enter the Job Position (E.g. Software Engineer)" 
                        className={`p-3 border-gray-300 focus:border-emerald-600 focus:ring-emerald-600`} // Emerald focus
                        type={undefined}
                        onChange={(event)=>onHandleInputChange('jobPosition',event.target.value)}
                    />
                </div>

                {/* Job Description Textarea */}
                <div className=''>
                    <h2 className='font-bold font-sans text-sm text-gray-700 mb-2'>Job Description</h2>
                    <Textarea 
                        placeholder="Enter the Job Description" 
                        className={`p-3 h-[200px] border-gray-300 focus:border-emerald-600 focus:ring-emerald-600`} // Emerald focus
                        type={undefined}
                        onChange={(event)=>onHandleInputChange('jobDescription',event.target.value)}
                    />
                </div>

                {/* Interview Duration Select */}
                <div className=''>
                    <h2 className='font-bold font-sans text-sm text-gray-700 mb-2'>Interview Duration</h2>
                    <Select onValueChange={(value) => onHandleInputChange('duration', value)}>
                        <SelectTrigger className={`w-full p-3 border-gray-300 focus:border-emerald-600 focus:ring-emerald-600 [&>span]:text-gray-700`}>
                            <SelectValue placeholder="Select Duration" />
                        </SelectTrigger>
                        <SelectContent className='bg-white border-gray-300'>
                            <SelectItem value="5">5 Minutes</SelectItem>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="60">60 minutes</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Interview Type Selection (Green/White Contrast) */}
                <div className=''>
                    <h2 className='font-bold font-sans text-sm text-gray-700 mb-3'>Interview Type</h2>
                    <div className='flex gap-3 flex-wrap'>
                        {InterviewType.map((type, index) => {
                            const isActive = selectedType.includes(type.title);
                            return (
                                <div 
                                    key={index} 
                                    className={`flex items-center cursor-pointer gap-2 px-4 py-2 border rounded-full transition-all duration-200 
                                                ${isActive 
                                                    ? activeGreen // Deep Green background, White text
                                                    : primaryGreen // Green border, Green text, White background on hover
                                                }`}
                                    onClick={() => addInterviewType(type.title)} // Handle selection
                                >
                                    {/* Icon color changes based on active state */}
                                    <type.icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-emerald-600'}`}/>
                                    <span className='font-medium'>{type.title}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            
            {/* Example: A Call-to-Action button using the primary green */}
            <button className='w-full mt-8 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors duration-200 shadow-md shadow-emerald-200' onClick={()=>GoToNext()}>
                Generate Question 
            </button>
        </div>
    )
}

export default FormContainer
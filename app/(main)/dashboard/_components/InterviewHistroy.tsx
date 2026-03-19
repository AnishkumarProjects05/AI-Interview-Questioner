"use client"
import { Camera, Video, Clock, Calendar, Briefcase, ListTodo } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { supabase } from '@/services/supabaseClient';
import { useUser } from '@/app/provider';

function InterviewHistroy() {
    const { user } = useUser();
    const [interviewlist, setInterviewlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tableError, setTableError] = useState(false);

    useEffect(() => {
        if (user) {
            GetInterviewHistory();
        }
    }, [user]);

    const GetInterviewHistory = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('InterviewHistory')
                .select('*')
                .eq('userEmail', user?.email)
                .order('createdAt', { ascending: false });

            if (error) {
                console.error("Error fetching history:", error);
                if (error.code === 'PGRST116' || error.message?.includes('not found')) {
                    setTableError(true);
                }
            } else {
                setInterviewlist(data || []);
            }
        } catch (err) {
            console.error("Unexpected error:", err);
        } finally {
            setLoading(false);
        }
    }

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        if (mins === 0) return `${secs}s`;
        return `${mins}m ${secs}s`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className='my-10 px-4'>
            <h2 className='font-bold text-3xl text-emerald-600 mb-8'>Interview History</h2>

            {loading ? (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {[1, 2, 3].map(i => (
                        <div key={i} className='h-48 bg-gray-100 animate-pulse rounded-xl border border-gray-200'></div>
                    ))}
                </div>
            ) : tableError ? (
                <div className='flex flex-col gap-4 items-center mt-12 p-10 bg-amber-50 rounded-2xl border border-amber-200 text-amber-800 text-center max-w-2xl mx-auto'>
                    <h2 className='text-xl font-bold'>Database Table Missing</h2>
                    <p className='text-sm'>
                        To show your history, you need to create the <code>InterviewHistory</code> table in your Supabase project.
                    </p>
                    <div className='bg-black text-emerald-400 p-4 rounded-lg font-mono text-xs text-left w-full overflow-x-auto mt-2'>
                        <pre>{`CREATE TABLE "InterviewHistory" (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  "userEmail" text,
  "jobPosition" text,
  "questionList" jsonb,
  duration int4,
  "createdAt" timestamptz DEFAULT now()
);`}</pre>
                    </div>
                </div>
            ) : interviewlist?.length === 0 ? (
                <div className='flex flex-col gap-4 items-center mt-12 p-10 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300'>
                    <Video className='w-12 h-12 text-gray-400' />
                    <h2 className='text-gray-500 font-medium'>You have not attended any interviews yet.</h2>
                </div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {interviewlist.map((interview, index) => (
                        <div key={index} className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:border-emerald-300 group'>
                            <div className='flex justify-between items-start mb-4'>
                                <div className='p-2 bg-emerald-50 rounded-lg text-emerald-700 group-hover:bg-emerald-100 transition-colors'>
                                    <Briefcase className='w-5 h-5' />
                                </div>
                                <span className='text-xs font-medium text-gray-400 flex items-center gap-1'>
                                    <Calendar className='w-3 h-3' />
                                    {formatDate(interview.createdAt)}
                                </span>
                            </div>

                            <h3 className='font-bold text-xl text-gray-800 mb-2 truncate' title={interview.jobPosition}>
                                {interview.jobPosition}
                            </h3>

                            <div className='space-y-3 mt-4'>
                                <div className='flex items-center gap-2 text-sm text-gray-600'>
                                    <Clock className='w-4 h-4 text-emerald-500' />
                                    <span>Duration: <span className='font-semibold text-gray-800'>{formatDuration(interview.duration)}</span></span>
                                </div>
                                <div className='flex items-center gap-2 text-sm text-gray-600'>
                                    <ListTodo className='w-4 h-4 text-emerald-500' />
                                    <span>Questions: <span className='font-semibold text-gray-800'>{interview.questionList?.length || 0} items</span></span>
                                </div>
                            </div>
                            
                            <button className='mt-6 w-full py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-bold hover:bg-emerald-600 hover:text-white transition-all'>
                                View Details
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default InterviewHistroy

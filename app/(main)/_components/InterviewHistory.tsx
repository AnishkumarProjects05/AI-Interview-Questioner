"use client"
import React, { useEffect, useState } from 'react'
import { Camera, Video, Clock, Calendar, Briefcase, ListTodo, X, FileText, Sparkles } from 'lucide-react';
import { supabase } from '@/services/supabaseClient';
import { useUser } from '@/app/provider';
import { toast } from 'sonner';

function InterviewHistory() {
    const { user } = useUser();
    const [interviewlist, setInterviewlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tableError, setTableError] = useState(false);
    const [selectedInterview, setSelectedInterview] = useState(null);

    useEffect(() => {
        if (user) {
            GetInterviewHistory();
        }
    }, [user]);

    const GetInterviewHistory = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('Interviews')
                .select('*')
                .eq('userEmail', user?.email)
                .order('id', { ascending: false });

            if (error) {
                console.error("Error fetching history:", error);
            } else {
                setInterviewlist(data || []);
            }
        } catch (err) {
            console.error("Unexpected error:", err);
        } finally {
            setLoading(false);
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return "Recent";
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className='font-inter h-full flex flex-col'>
            <div className='flex items-center justify-between mb-8'>
                <h2 className='font-black text-2xl text-[#0f172a] dark:text-white tracking-tight flex items-center gap-3'>
                    <ListTodo className='w-6 h-6 text-indigo-600 dark:text-indigo-500' />
                    History
                </h2>
                {interviewlist.length > 0 && (
                    <span className='px-2.5 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black rounded-lg border border-indigo-100 dark:border-indigo-500/20 uppercase'>
                        {interviewlist.length} Sessions
                    </span>
                )}
            </div>

            {loading ? (
                <div className='space-y-4'>
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className='h-24 bg-white dark:bg-slate-900/50 animate-pulse rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm'></div>
                    ))}
                </div>
            ) : interviewlist?.length === 0 ? (
                <div className='flex flex-col gap-4 items-center justify-center h-full min-h-[300px] bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-8 text-center'>
                    <Video className='w-10 h-10 text-slate-300 dark:text-slate-700' />
                    <p className='text-slate-400 dark:text-slate-500 font-bold text-sm'>No interview history found.</p>
                </div>
            ) : (
                <div className='space-y-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar'>
                    {interviewlist.map((interview, index) => (
                        <div
                            key={index}
                            onClick={() => setSelectedInterview(interview)}
                            className='bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 p-5 rounded-xl hover:border-indigo-500/40 dark:hover:border-indigo-500/40 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer group relative overflow-hidden shadow-sm hover:shadow-md'
                        >
                            <div className='flex flex-col gap-3 relative z-10'>
                                <div className='flex justify-between items-start'>
                                    <h3 className='font-bold text-lg text-[#0f172a] dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate pr-4'>
                                        {interview.jobPosition}
                                    </h3>
                                    <Clock className='w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0' />
                                </div>
                                <div className='flex items-center justify-between mt-1'>
                                    <div className='flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider'>
                                        <Calendar className='w-3 h-3' />
                                        {formatDate(interview.createdAt)}
                                    </div>
                                    <span className='px-2 py-0.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black rounded border border-indigo-100 dark:border-indigo-500/10'>
                                        {interview.duration}m
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* View Details Modal */}
            {selectedInterview && (
                <div className='fixed inset-0 bg-slate-950/20 dark:bg-slate-950/90 backdrop-blur-lg z-50 flex items-center justify-center p-6 animate-in fade-in duration-300'>
                    <div className='bg-white dark:bg-slate-900 w-full max-w-3xl max-h-[85vh] rounded-2xl border border-slate-200 dark:border-white/5 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300'>
                        
                        {/* Modal Header */}
                        <div className='p-8 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50'>
                            <div>
                                <h2 className='text-3xl font-black text-slate-900 dark:text-white tracking-tight'>{selectedInterview.jobPosition}</h2>
                                <div className='flex items-center gap-3 mt-3'>
                                    <span className='px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg border border-indigo-100 dark:border-indigo-500/20 text-[10px] font-black uppercase tracking-widest flex items-center gap-2'>
                                        <Calendar className='w-3 h-3' /> {formatDate(selectedInterview.createdAt)}
                                    </span>
                                    <span className='px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg border border-slate-200 dark:border-white/5 text-[10px] font-black uppercase tracking-widest flex items-center gap-2'>
                                        <Clock className='w-3 h-3' /> {selectedInterview.duration} Min
                                    </span>
                                </div>
                            </div>
                            <button 
                                onClick={() => setSelectedInterview(null)}
                                className='p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-slate-900 dark:hover:text-white border border-transparent hover:border-slate-200 dark:hover:border-white/10'
                            >
                                <X className='w-6 h-6' />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className='flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar'>
                            
                            {/* Job Description */}
                            {selectedInterview.jobDescription && (
                                <section className='space-y-4'>
                                    <h3 className='flex items-center gap-3 font-black text-slate-900 dark:text-white text-lg'>
                                        <FileText className='w-5 h-5 text-indigo-600 dark:text-indigo-500' />
                                        Job Insights
                                    </h3>
                                    <div className='bg-slate-50 dark:bg-slate-950/50 p-6 rounded-xl text-slate-600 dark:text-slate-400 text-sm leading-relaxed border border-slate-100 dark:border-white/5 italic font-medium'>
                                        {selectedInterview.jobDescription}
                                    </div>
                                </section>
                            )}

                            {/* Questions Asked */}
                            <section className='space-y-6'>
                                <h3 className='flex items-center gap-3 font-black text-slate-900 dark:text-white text-lg'>
                                    <Sparkles className='w-5 h-5 text-indigo-600 dark:text-indigo-500 animate-pulse' />
                                    AI Curated Questions
                                </h3>
                                
                                <div className='space-y-4'>
                                    {selectedInterview.questionList && Array.isArray(selectedInterview.questionList) ? (
                                        selectedInterview.questionList.map((q, idx) => (
                                            <div key={idx} className='bg-slate-50 dark:bg-slate-950/50 p-6 rounded-xl border border-slate-100 dark:border-white/5 hover:border-indigo-500/20 hover:bg-white dark:hover:bg-slate-950 transition-all group/q'>
                                                <div className='flex items-start gap-4'>
                                                    <span className='flex-shrink-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center font-black text-xs group-hover/q:bg-indigo-600 group-hover/q:text-white transition-all'>
                                                        {idx + 1}
                                                    </span>
                                                    <div className='space-y-3 pt-1'>
                                                        <p className='text-slate-800 dark:text-slate-200 font-bold leading-snug text-lg'>{q.question}</p>
                                                        {q.type && (
                                                            <span className='inline-block px-2 py-1 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md text-[8px] font-black uppercase tracking-widest border border-slate-100 dark:border-white/5'>
                                                                {q.type}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className='text-slate-400 italic text-center py-20 bg-slate-50/50 dark:bg-slate-950/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800'>
                                            No question snapshots available.
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* Modal Footer */}
                        <div className='p-8 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/50 flex justify-end gap-4'>
                            <button 
                                onClick={() => setSelectedInterview(null)}
                                className='px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 rounded-xl font-bold hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm'
                            >
                                Close
                            </button>
                            <button 
                                onClick={() => {
                                    const text = selectedInterview.questionList.map((q, i) => `${i+1}. ${q.question}`).join('\n');
                                    navigator.clipboard.writeText(text);
                                    toast.success("Copied to clipboard!");
                                }}
                                className='px-6 py-3 bg-indigo-600 text-white rounded-xl font-black hover:bg-indigo-700 shadow-xl shadow-indigo-200 dark:shadow-indigo-500/20 transition-all active:scale-95'
                            >
                                Copy Questions
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default InterviewHistory

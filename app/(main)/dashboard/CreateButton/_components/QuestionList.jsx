import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2, Zap, LayoutList, Code, Cpu } from 'lucide-react'; // Added icons for question types
import { Button } from '@/components/ui/button';
import QuestionListContainer from './QuestionListContainer';
import { useUser } from '@/app/provider';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/services/supabaseClient';

// Helper function to get the appropriate icon and color based on question type
const getTypeDesign = (type) => {
    // Normalize type for consistent matching
    const normalizedType = (type || '').toLowerCase();

    if (normalizedType.includes('behavioral')) {
        return {
            icon: Zap,
            label: 'Behavioral',
            bgColor: 'bg-emerald-100',
            textColor: 'text-emerald-700',
            borderColor: 'border-emerald-300',
        };
    } else if (normalizedType.includes('technical')) {
        return {
            icon: Code,
            label: 'Technical',
            bgColor: 'bg-indigo-100',
            textColor: 'text-indigo-700',
            borderColor: 'border-indigo-300',
        };
    } else if (normalizedType.includes('problem solving')) {
        return {
            icon: Cpu,
            label: 'Problem Solving',
            bgColor: 'bg-amber-100',
            textColor: 'text-amber-700',
            borderColor: 'border-amber-300',
        };
    } else {
        return {
            icon: LayoutList,
            label: type || 'General',
            bgColor: 'bg-gray-100',
            textColor: 'text-gray-700',
            borderColor: 'border-gray-300',
        };
    }
};

function QuestionList({ formData, onCreateLink }) {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [questionList, setQuestionList] = useState([]);

    const { user } = useUser();
    useEffect(() => {
        if (formData) {
            GenerateQuestionsAndSave();
        }
    }, [formData]);

    const GenerateQuestionsAndSave = async () => {
        const questions = await GenerateQuestions();
        if (questions && questions.length > 0) {
            await onFinish(questions);
        }
    };

    const onFinish = async (questionsToSave) => {
        const questions = questionsToSave || questionList;
        if (!questions.length) {
            toast('No questions to save.');
            return;
        }
        setSaving(true);
        try {
            const interview_id = uuidv4();
            const payload = {
                ...formData,
                questionList: questions,
                userEmail: user?.email ?? null,
                interview_id,
            };
            
            const { error } = await supabase.from('Interviews').insert([payload]);
            if (error) {
                console.error(error);
                toast('Failed to save interview. Please try again.');
                return;
            }
            toast('Interview Ready!');
            onCreateLink(interview_id);
        } catch (error) {
            console.error(error);
            toast('Server Error: Failed to save interview.');
        } finally {
            setSaving(false);
        }
    };

    const GenerateQuestions = async () => {
        setLoading(true);
        try {
            console.log("Generating questions for:", formData);
            const result = await axios.post('/api/aimodel', {
                ...formData,
            });
            console.log("API Response:", result.data);

            const raw = result.data?.content ?? '';
            const cleaned = raw.replace(/```json|```/g, '').trim();

            const parseJsonLoose = (text) => {
                try { 
                    return JSON.parse(text); 
                } catch (e) { 
                    console.log("Direct JSON parse failed, trying regex...");
                }

                const matchList = text.match(/interviewQuestions\s*=\s*(\[[\s\S]*\])/i);
                if (matchList?.[1]) {
                    try {
                        return JSON.parse(matchList[1]);
                    } catch (e) {
                        console.log("Regex match parse failed, trying manual slice...");
                    }
                }

                const aStart = text.indexOf('[');
                const aEnd = text.lastIndexOf(']');
                if (aStart !== -1 && aEnd > aStart) {
                    const arrSlice = text.slice(aStart, aEnd + 1);
                    try { 
                        const sanitized = arrSlice.replace(/,\s*\]/g, ']');
                        return JSON.parse(sanitized); 
                    } catch (e) { 
                        console.log("Manual slice parse failed.");
                    }
                }
                return [];
            };

            const parsed = parseJsonLoose(cleaned);
            console.log("Parsed JSON Object:", parsed);

            const questions = parsed?.interviewQuestions ?? (Array.isArray(parsed) ? parsed : []);
            
            if (questions.length === 0) {
                console.warn("No questions found in parsed data.");
            }

            const formattedQuestions = questions.map(q => ({
                question: typeof q === 'string' ? q : (q.question || q.Question || ''),
                type: q.type || q.Type || 'General'
            }));

            console.log("Formatted Questions:", formattedQuestions);
            setQuestionList(formattedQuestions);
            return formattedQuestions;
        } catch (error) {
            console.error(error);
            toast('Error generating questions. Please try again.');
            return [];
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-16 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-2xl shadow-indigo-100 dark:shadow-black/50 space-y-10 animate-in fade-in zoom-in duration-700 font-inter relative overflow-hidden transition-colors duration-500">
            
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50 dark:bg-slate-800 rounded-full blur-3xl opacity-40 -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-50 dark:bg-slate-800 rounded-full blur-3xl opacity-40 -ml-10 -mb-10"></div>

            <div className="relative group">
                <div className="absolute inset-0 bg-indigo-400 rounded-full blur-2xl opacity-20 animate-pulse group-hover:opacity-40 transition-opacity"></div>
                <div className="w-32 h-32 bg-white dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center relative z-10 shadow-xl border border-slate-200 dark:border-white/10 border-t-indigo-600 border-t-4 animate-spin-slow">
                    <Zap className="w-12 h-12 text-indigo-600 animate-pulse" />
                </div>
            </div>

            <div className="text-center space-y-3 relative z-10">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    {saving ? 'Finalizing Your Session...' : 'AI is Crafting Questions...'}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium leading-relaxed">
                    Analyzing requirements for <span className="text-indigo-600 dark:text-indigo-400 font-black px-2 py-0.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">{formData?.jobPosition || 'the role'}</span>.
                </p>
            </div>

            <div className="w-full max-w-sm bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-200 dark:border-white/5 relative z-10">
                <div 
                    className={`h-full bg-indigo-600 transition-all duration-1000 ease-in-out shadow-lg shadow-indigo-200 dark:shadow-indigo-500/20 ${loading ? 'w-2/3' : 'w-full animate-pulse'}`}
                ></div>
            </div>

            <div className="flex flex-col items-center gap-2 relative z-10">
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-widest flex items-center gap-2">
                    <Loader2 className="w-3 h-3 animate-spin" /> 
                    Building Intelligent Context
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">This typically takes a few seconds</p>
            </div>
        </div>
    );
}

export default QuestionList;
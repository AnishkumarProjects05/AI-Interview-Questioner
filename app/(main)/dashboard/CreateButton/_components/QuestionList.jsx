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
            GenerateQuestions();
        }
    }, [formData]);

    const onFinish = async () => {
        if (!questionList.length) {
            toast('Generate questions before saving.');
            return;
        }
        setSaving(true);
        try {
            const interview_id = uuidv4();
            const payload = {
                ...formData,
                questionList,
                userEmail: user?.email ?? null,
                interview_id,
            };
            console.log(interview_id);

            const { error } = await supabase.from('Interviews').insert([payload]);
            if (error) {
                console.error(error);
                toast('Failed to save interview. Please try again.');
                return;
            }
            toast('Saved in Database Successfully');
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
            const result = await axios.post('/api/aimodel', {
                ...formData,
            });
            // API returns content as text; clean and parse defensively
            const raw = result.data?.content ?? '';
            const cleaned = raw.replace(/```json|```/g, '').trim();

            const parseJsonLoose = (text) => {
                // ... (your existing robust JSON parsing logic) ...
                try { return JSON.parse(text); } catch { }
                const matchList = text.match(/interviewQuestions\s*=\s*(\[[\s\S]*\])/i);
                if (matchList?.[1]) {
                    return JSON.parse(matchList[1]);
                }
                const aStart = text.indexOf('[');
                const aEnd = text.lastIndexOf(']');
                if (aStart !== -1 && aEnd > aStart) {
                    const arrSlice = text.slice(aStart, aEnd + 1);
                    try { return JSON.parse(arrSlice); } catch { }
                }
                const oStart = text.indexOf('{');
                const oEnd = text.lastIndexOf('}');
                if (oStart !== -1 && oEnd > oStart) {
                    const objSlice = text.slice(oStart, oEnd + 1);
                    try { return JSON.parse(objSlice); } catch { }
                }
                throw new Error('Unable to parse JSON response');
            };

            const parsed = parseJsonLoose(cleaned);
            const questions = parsed?.interviewQuestions ?? parsed ?? [];
            // Ensure question object structure is consistently { question: '...', type: '...' }
            const formattedQuestions = (Array.isArray(questions) ? questions : []).map(q => ({
                question: q.question || q, // Handle cases where the item might be just the question string
                type: q.type || 'General' // Default type if missing
            }));

            setQuestionList(formattedQuestions);
        } catch (error) {
            console.error(error);
            toast('Server Error: Failed to generate questions. Try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Loading State */}
            {loading && (
                <div className="p-6 bg-blue-50 rounded-2xl border border-blue-200 shadow-md flex gap-4 items-center">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    <div>
                        <h2 className="text-lg font-semibold text-blue-800">Generating Questions...</h2>
                        <p className="text-sm text-blue-600">Our AI is preparing your customized interview set.</p>
                    </div>
                </div>
            )}

            {/* Question List Display */}
            {!loading && questionList?.length > 0 && (
                <div>
                    <QuestionListContainer questionList={questionList} />
                    <div>
                        <Button onClick={onFinish} disabled={saving}>
                            {saving ? 'Saving...' : 'Generate Interview & Finish'}
                        </Button>
                    </div>
                </div>

            )}


            {/* Optional: Empty state if no questions were generated */}
            {!loading && questionList?.length === 0 && (
                <div className="p-6 bg-red-50 rounded-2xl border border-red-200 shadow-md flex gap-4 items-center">
                    <h2 className="text-lg font-semibold text-red-700">No Questions Generated</h2>
                    <p className="text-sm text-red-500">Please check your input data and try again.</p>
                </div>
            )}

        </div>
    );
}

export default QuestionList;
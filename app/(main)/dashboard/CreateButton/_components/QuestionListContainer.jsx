import React from 'react'
import { Zap, LayoutList, Code, Cpu } from 'lucide-react';

const getTypeDesign = (type = '') => {
  const normalizedType = type.toLowerCase();

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
  }

  return {
    icon: LayoutList,
    label: type || 'General',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-300',
  };
};

function QuestionListContainer({questionList}) {
  return (
    <div>
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-4 tracking-tight uppercase">Generated Interview Questions</h2>
        {questionList.map((item, index) => {
          const { icon: Icon, label, bgColor, textColor, borderColor } = getTypeDesign(item.type);

          return (
            <div 
              key={index} 
              className="p-6 bg-white dark:bg-slate-900/80 rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-black border border-slate-200 dark:border-white/5 transition-all duration-300 hover:scale-[1.01] hover:border-indigo-500/20"
            >
              {/* Question Text (Prominent) */}
              <div className="flex gap-4">
                <span className="font-black text-xl text-slate-300 dark:text-slate-600 shrink-0">{(index + 1).toString().padStart(2, '0')}</span>
                <p className="font-bold text-lg text-slate-800 dark:text-slate-100 leading-relaxed mb-3 flex-1">
                   {item.question}
                </p>
              </div>

              {/* Question Type Tag */}
              <div className="flex justify-end mt-4">
                <div 
                  className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-500/20 flex items-center`}
                >
                  <Icon className="w-3 h-3 mr-2" />
                  <span>{label} Node</span>
                </div>
              </div>   
              
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default QuestionListContainer

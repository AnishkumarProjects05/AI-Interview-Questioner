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
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">Generated Interview Questions</h2>
        {questionList.map((item, index) => {
          const { icon: Icon, label, bgColor, textColor, borderColor } = getTypeDesign(item.type);

          return (
            <div 
              key={index} 
              className="p-4 bg-white rounded-xl shadow-lg border border-gray-100 transition-shadow duration-300 hover:shadow-xl"
            >
              {/* Question Text (Prominent) */}
              <p className="font-medium text-lg text-gray-900 leading-relaxed mb-3">
                <span className="font-bold mr-2 text-gray-500">Q{index + 1}.</span> {item.question}
              </p>

              {/* Question Type Tag */}
              <div className="flex justify-end mt-2">
                <div 
                  className={`px-3 py-1 text-xs font-semibold rounded-full border ${bgColor} ${textColor} ${borderColor} flex items-center`}
                >
                  <Icon className="w-3 h-3 mr-1" />
                  <span>Type: {label}</span>
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

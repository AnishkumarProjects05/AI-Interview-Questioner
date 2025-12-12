import Link from 'next/link'
import { Phone, Plus, Video } from 'lucide-react'
import React from 'react'

function Options() {
    
 
  const cardStyle = 'flex flex-col items-start space-y-2 p-6 rounded-xl ' +
                    'shadow-md hover:shadow-xl transition-shadow duration-300 ' +
                    'cursor-pointer border border-gray-100 hover:border-emerald-500';

  
  const titleStyle = 'text-xl font-bold text-gray-800';
  const descriptionStyle = 'text-sm text-gray-500';
  const iconStyle = 'w-8 h-8 text-emerald-600 mb-2'; 

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 w-full'>

      <Link href="/dashboard/CreateButton" className={`${cardStyle} bg-white`}>
        <Video className={iconStyle} />

        <h4 className={titleStyle}>Video Interview</h4>

        <p className={descriptionStyle}>
          Experience a <span className='font-bold text-emerald-400'>Real-time video interview</span> simulation with the AI.
        </p>

        <div className='mt-3 flex items-center gap-2 text-sm font-semibold text-black'>
          <Plus />
          <span>Create a New Interview</span>
        </div>
      </Link>
      
      {/* --- Phone Interview Card --- */}
      <div className={`${cardStyle} bg-white`}>
        <Phone className={iconStyle} />
        
        <h4 className={titleStyle}>Phone Interview</h4>
        
        <p className={descriptionStyle}>
          Practice your responses in a <span className='font-bold text-emerald-400'>Real-time phone screening</span> format.
        </p>
        
        {/* Call to action button/link style */}
        <div className='mt-3 flex items-center gap-2 text-sm font-semibold text-black'>
        <Plus />
        <h5 className='font-bold'>Create an Phone Screening</h5>
        </div>
      </div>
      
    </div>
  )
}

export default Options
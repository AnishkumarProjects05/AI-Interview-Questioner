"use client"
import React from 'react'
import { useUser } from '@/app/provider';

function WelcomeContainer() {
  const {user} = useUser();
  
  // Define a professional, deep green color (e.g., emerald-700) and white.
  // Using a soft green for the background and a dark green for text/accents.

  return (
    <div className='w-full'>
      {/* Outer container with a subtle shadow for depth */}
      <div className='bg-white shadow-lg border border-gray-100 p-6 rounded-2xl'>
        
        {/* Header section with a clean green accent border */}
        <div className='border-l-4 border-emerald-600 pl-4 py-1'>
          
          {/* Main Greeting - Prominent and Professional Font */}
          <h2 className='text-3xl font-extrabold text-gray-800 tracking-tight'>
            Welcome, <span className='text-emerald-600'>{user?.name || 'User'}</span>
          </h2>
          
          {/* Sub-header - Clear and Informative */}
          <p className='mt-1 text-lg text-gray-500 font-medium'>
            To the Career Connect AI Interview Questioner
          </p>
          
        </div>
        
      </div>
    </div>
  )
}

export default WelcomeContainer
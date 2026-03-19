
import React from 'react'
import WelcomeContainer from './_components/WelcomeContainer'
import Options from './_components/Options'
import InterviewHistory from '../_components/InterviewHistory'

function Dashboard() {
  return (
    <div className='space-y-12 font-inter'>
      
      {/* Hero / Welcome Section */}
      <section className='animate-in fade-in slide-in-from-top-4 duration-1000'>
        <WelcomeContainer />
      </section>

      {/* Bento Grid Content */}
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
        
        {/* Main Action Area (Bento Left) */}
        <section className='lg:col-span-8 animate-in fade-in slide-in-from-left-4 duration-1000 delay-200'>
          <div className='flex items-center justify-between mb-8'>
            <h2 className='text-2xl font-black text-white tracking-tight flex items-center gap-3'>
              <div className='h-8 w-1.5 bg-indigo-600 rounded-full'></div>
              Available Paths
            </h2>
          </div>
          <Options />
        </section>

        {/* Side Info / Stats (Bento Right) - Interview History */}
        <section className='lg:col-span-4 animate-in fade-in slide-in-from-right-4 duration-1000 delay-300'>
          <div className='h-full flex flex-col gap-8'>
             <InterviewHistory />
          </div>
        </section>
      </div>

    </div>
  )
}

export default Dashboard

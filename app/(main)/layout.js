import React from 'react'
import DashboardProvider from './provider'
import WelcomeContainer from './dashboard/_components/WelcomeContainer';

function DashboardLayout({ children }) {
  return (
    <div>
        <DashboardProvider>
        
            <div className='p-0 sm:p-6 md:p-10'>
             
            
              {children}
            </div>
        </DashboardProvider>
    </div>
  )
}

export default DashboardLayout

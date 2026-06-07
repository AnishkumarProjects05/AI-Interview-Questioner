import React from 'react'
import DashboardProvider from './provider'
import WelcomeContainer from './dashboard/_components/WelcomeContainer';

function DashboardLayout({ children }) {
  return (
    <div>
        <DashboardProvider>
        
            <div className='p-10'>
             
            
              {children}
            </div>
        </DashboardProvider>
    </div>
  )
}

export default DashboardLayout

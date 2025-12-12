import React from 'react'
import DashboardProvider from './provider'
import { Poppins } from 'next/font/google'
import WelcomeContainer from './dashboard/_components/WelcomeContainer';

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // choose what you need
  variable: "--font-poppins",
});

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

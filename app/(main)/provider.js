import React from 'react'
import AppNavbar from './_components/AppNavbar'
 
function DashboardProvider({ children }) {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-indigo-600/10">
        <AppNavbar />
        <main className="max-w-7xl mx-auto px-6 py-10 animate-in fade-in duration-700">
            {children}
        </main>
        
        {/* Global Footer Decoration */}
        <div className="fixed bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800/50 to-transparent"></div>
    </div>
  )
}

export default DashboardProvider;

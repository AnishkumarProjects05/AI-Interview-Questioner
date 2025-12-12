import React from 'react'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import AppSideBar from './_components/AppSideBar'
 
function DashboardProvider({ children }) {
  return (
    <SidebarProvider>
        <AppSideBar />
        <div>
        <SidebarTrigger />
        {children}
        </div>
    </SidebarProvider>
  )
}

export default DashboardProvider;

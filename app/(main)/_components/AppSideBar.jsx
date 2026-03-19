"use client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react"; // Corrected import
import Link from "next/link"; // Corrected import
import { SideBarOptions } from "@/services/Constant";
import { toast } from "sonner";

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-blue-50 bg-white font-poppins">
      <SidebarHeader className="flex flex-col gap-6 px-6 py-8">
        <div className="hover:scale-105 transition-transform duration-300 cursor-pointer">
          <Image src={'/logo.png'} alt='logo' width={160} height={160} priority />
        </div>
        <Link href="/dashboard/CreateButton" className="w-full">
          <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-100 flex items-center justify-center gap-2 transition-all active:scale-95"> 
            <Plus className="w-5 h-5" /> 
            <span>New Interview</span> 
          </Button>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {SideBarOptions.map((option, index) => {
              const Icon = option.icon; 
              
              return ( 
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton 
                    asChild 
                    className="h-12 px-4 rounded-xl hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition-all group"
                    onClick={(e) => {
                      if (option.name === "Resume-JD Analyzer") {
                        e.preventDefault();
                        toast.info("Feature Coming Soon!", {
                          description: "We are working hard to bring the Resume-JD Analyzer to you. Stay tuned!",
                          className: "font-poppins bg-white border-blue-100 shadow-2xl",
                        });
                      }
                    }}
                  >
                    <Link href={option.path} className="flex items-center gap-3 w-full">
                      <div className="p-2 rounded-lg group-hover:bg-white shadow-sm transition-all">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-sm tracking-tight">
                        {option.name}
                        {option.name === "Resume-JD Analyzer" && (
                          <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-[8px] text-blue-600 rounded-md font-black uppercase">Soon</span>
                        )}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-6 border-t border-blue-50 bg-blue-50/30">
        <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <p className="text-[10px] font-black text-blue-900/60 uppercase tracking-widest">System Status: Optimal</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
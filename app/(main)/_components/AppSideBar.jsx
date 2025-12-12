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

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="flex items-center mt-7">
        <Image src={'/logo.png'} alt='logo' width={200} height={200} />
        <Button className="w-full p-2"> <Plus /> Create an New Interview </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarContent>
            <SidebarMenu>
              {SideBarOptions.map((option, index) => {
                // Assign to a PascalCase variable
                const Icon = option.icon; 
                
                // Add the return statement
                return ( 
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton asChild>
                      <Link href={option.path}>
                        <Icon className="w-5 h-5 mr-2" /> {/* Render Icon and add some style */}
                        <span className="font-medium">{option.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}

export default AppSidebar;
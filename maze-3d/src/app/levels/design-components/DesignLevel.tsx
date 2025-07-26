import { AppSidebar } from "@/components/app-sidebar"
import type { Step } from "../level-design"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

const DesignLevel = ({ currentStep }: { currentStep: Step }) => {
    return (
     <div>
      <SidebarProvider>
      <AppSidebar  />
      <main>
        
      </main>
      </SidebarProvider>
     </div>
    )
  }



  export default DesignLevel
import * as React from "react"
import {
  IconInnerShadowTop,
  IconMountain,
  IconWalk,
  IconFlag,
  IconSkull,
  IconCircle,
} from "@tabler/icons-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Label } from "./ui/label"
import { useMazeCellStore } from "@/store/mazeStore"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "./ui/separator"
import { TreesIcon } from "lucide-react"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { selectedCell, setSelectedCell } = useMazeCellStore()

  // Helper to determine the current path subtype from the state's boolean flags
  const getPathSubType = () => {
    if (selectedCell.isStart) return "start"
    if (selectedCell.isEnd) return "end"
    if (selectedCell.isHazard) return "hazard"
    if (selectedCell.isPortal) return "portal"
    if(selectedCell.props) return "prop"
    return "normal" // Default path type
  }

  // Helper to update the state when a path subtype is selected
  const handleSubTypeChange = (value: string) => {
    setSelectedCell({
      type: "path", // Ensure type is path
      isStart: value === "start",
      isEnd: value === "end",
      isHazard: value === "hazard",
      isPortal: value === "portal",
      props:value === "prop" ? {url:'/stylized_tree.glb'} : undefined
    })
  }
  
  // An array to easily render the path subtype options
  const pathSubTypes = [
    { value: "normal", label: "Normal", icon: IconCircle },
    { value: "start", label: "Start Point", icon: IconWalk },
    { value: "end", label: "End Point", icon: IconFlag },
    { value: "hazard", label: "Hazard", icon: IconSkull },
    { value: "portal", label: "Portal", icon: IconCircle },
    { value: "prop", label: "Prop", icon: TreesIcon },
  ]

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="border-b border-slate-800 p-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-3"
            >
              <a href="#" className="flex items-center gap-3">
                <IconInnerShadowTop className="size-6 text-slate-400" />
                <span className="text-base font-semibold">Maze Forge Tools</span>
                <SidebarTrigger className="ml-auto" />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="flex flex-col gap-6 p-4">
        {/* Main Cell Type Selection */}
        <div>
          <Label className="text-sm font-semibold text-slate-300">
            Cell Type
          </Label>
          <RadioGroup
            value={selectedCell.type}
            onValueChange={(val) => {
              // When switching to 'wall', reset all path-specific flags
              if (val === 'wall') {
                handleSubTypeChange('none'); // Resets all booleans to false
              }
              setSelectedCell({ type: val as "wall" | "path" })
            }}
            className="mt-2 space-y-1"
          >
            <Label htmlFor="wall" className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-800/50 cursor-pointer transition-colors">
              <IconMountain className="size-5 text-slate-400" />
              <RadioGroupItem value="wall" id="wall" />
              <span>Wall</span>
            </Label>
            <Label htmlFor="path" className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-800/50 cursor-pointer transition-colors">
              <IconWalk className="size-5 text-slate-400" />
              <RadioGroupItem value="path" id="path" />
              <span>Path</span>
            </Label>
          </RadioGroup>
        </div>

        <Separator className="bg-slate-800" />

        {/* Conditional Path Subtype Section */}
        {selectedCell.type === "path" && (
          <div className="flex flex-col gap-3 animate-in fade-in duration-300">
            <Label className="text-sm font-semibold text-slate-300">
              Path Properties
            </Label>
            <RadioGroup
              value={getPathSubType()}
              onValueChange={handleSubTypeChange}
              className="space-y-1 pl-2"
            >
              {pathSubTypes.map(({ value, label, icon: Icon }) => (
                 <Label key={value} htmlFor={value} className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-800/50 cursor-pointer transition-colors">
                    <Icon className="size-5 text-slate-400"/>
                    <RadioGroupItem value={value} id={value} />
                    <span>{label}</span>
                 </Label>
              ))}
            </RadioGroup>
          </div>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-800 text-xs text-slate-500">
        MazeForge v1.0
      </SidebarFooter>
    </Sidebar>
  )
}
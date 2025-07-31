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
import { HouseIcon, MountainIcon, TreesIcon } from "lucide-react"
import type { MazeCell } from "@/app/levels/maze"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { selectedCell, setSelectedCell } = useMazeCellStore()

  const getPropSubType=(value:string):MazeCell['type']=>{
   switch(value){
    case "rock-wall":
      return {
        type: "wall",
        props: {
          url: "/blocky_rocks.glb",
          positionY: 0.01,
          scale:0.001
        }
      }
    case "normal-path":
      return {
        type: "path",
        props: undefined
      }
    case "normal-wall":
      return {
        type: "wall",
        props: undefined
      }
    case "rock-wall-2":
      return {
        type: "wall",
        props: {
          url: "/stylized_rocks.glb",
          positionY: 0,
          scale:0.20
        }
      }
    case "prop":
      return {
        type: "prop",
        props: {
          url: "/stylized_tree.glb",
          positionY: 0.001,
          scale:0.1
        }
      }
    case "old-house":
      return {
        type: "prop",
        props: {
          url: "/well.glb",
          positionY: 0.001,
          scale:0.05
        }
      }
    default:
      return {
        type: "path",
        props: undefined
      }
   }
  }

 
  // Helper to update the state when a path subtype is selected
  const handleSubTypeChange = (value: string) => {
    const typeInheritance = getPropSubType(value)
    setSelectedCell({
      type: typeInheritance, // Ensure type is path
      isStart: value === "start",
      isEnd: value === "end",
      isHazard: value === "hazard",
      isPortal: value === "portal",
    })
  }

 
  
  // An array to easily render the path subtype options
  const pathSubTypes = [
    { value: "normal-path", label: "Normal", icon: IconCircle },
    { value: "start", label: "Start Point", icon: IconWalk },
    { value: "end", label: "End Point", icon: IconFlag },
    { value: "hazard", label: "Hazard", icon: IconSkull },
    { value: "portal", label: "Portal", icon: IconCircle },
  ]

  const WallSubTypes = [
    { value: "normal-wall", label: "Normal", icon: IconCircle },
    { value: "rock-wall", label: "Rock Wall", icon: MountainIcon },
    { value: "rock-wall-2", label: "Rock Wall 2", icon: MountainIcon },
  ]

  const PropSubTypes = [
    { value: "prop", label: "Prop", icon: TreesIcon },
    { value: "old-house", label: "Old House", icon: HouseIcon },
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
            value={selectedCell.type.type}
            onValueChange={(val: "wall" | "path" |"prop") => {
              console.log(val)
              setSelectedCell({
                type: {
                  type: val,
                  props: val==="prop"?{
                    url: "/stylized_tree.glb",
                    positionY: 0.001,
                    scale:0.1
                  }:undefined
                },
                isStart: false,
                isEnd: false,
                isHazard: false,
                isPortal: false,
              })
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
            <Label htmlFor="prop" className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-800/50 cursor-pointer transition-colors">
              <IconWalk className="size-5 text-slate-400" />
              <RadioGroupItem value="prop" id="prop" />
              <span>Prop</span>
            </Label>
          </RadioGroup>
        </div>

        <Separator className="bg-slate-800" />

        {/* Conditional Path Subtype Section */}
        {selectedCell.type.type === "path" && (
          <div className="flex flex-col gap-3 animate-in fade-in duration-300">
            <Label className="text-sm font-semibold text-slate-300">
              Path Properties
            </Label>
            <RadioGroup
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
        {selectedCell.type.type === "wall" && (
          <div className="flex flex-col gap-3 animate-in fade-in duration-300">
            <Label className="text-sm font-semibold text-slate-300">
              Wall Properties
            </Label>
            <RadioGroup
              onValueChange={handleSubTypeChange}
              className="space-y-1 pl-2"
            >
              {WallSubTypes.map(({ value, label, icon: Icon }) => (
                 <Label key={value} htmlFor={value} className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-800/50 cursor-pointer transition-colors">
                    <Icon className="size-5 text-slate-400"/>
                    <RadioGroupItem value={value} id={value} />
                    <span>{label}</span>
                 </Label>
              ))}
            </RadioGroup>
          </div>
        )}
         {selectedCell.type.type === "prop" && (
          <div className="flex flex-col gap-3 animate-in fade-in duration-300">
            <Label className="text-sm font-semibold text-slate-300">
              Prop Properties
            </Label>
            <RadioGroup
              onValueChange={handleSubTypeChange}
              className="space-y-1 pl-2"
            >
              {PropSubTypes.map(({ value, label, icon: Icon }) => (
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
        Maze
      </SidebarFooter>
    </Sidebar>
  )
}
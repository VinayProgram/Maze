import * as React from "react"
import {
  IconInnerShadowTop,
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
import { Checkbox } from "@/components/ui/checkbox"



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { selectedCell, setSelectedCell } = useMazeCellStore()
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Maze Level Design</span>
                <SidebarTrigger/>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="flex flex-col gap-4 p-4">
        <Label className="text-sm font-semibold">Maze Cell Type</Label>
        <RadioGroup
          value={selectedCell.type}
          onValueChange={(val) => setSelectedCell({type: val as "wall" | "path"})}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="wall" id="wall" />
            <Label htmlFor="wall">Wall</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="path" id="path" />
            <Label htmlFor="path">Path</Label>
          </div>
        </RadioGroup>

        <div className="flex flex-col gap-2 mt-4">
          {[
            { label: 'Start', key: 'isStart' },
            { label: 'End', key: 'isEnd' },
            { label: 'Hazard', key: 'isHazard' },
            { label: 'Portal', key: 'isPortal' },
          ].map(({ label, key }) => (
            <div className="flex items-center space-x-2" key={key}>
              <Checkbox
                id={key}
                checked={selectedCell[key as keyof typeof selectedCell] as boolean}
                onCheckedChange={(checked) =>
                  setSelectedCell({ [key]: checked as boolean })
                }
              />
              <Label htmlFor={key}>{label}</Label>
            </div>
          ))}
        </div>
      </SidebarContent>

      <SidebarFooter>
        Maze
      </SidebarFooter>
    </Sidebar>
  )
}

import React, { useState } from "react"
import DesignLevel from "./design-components/DesignLevel"

// Shadcn UI Components for the form
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AlertCircle, ArrowRight } from "lucide-react"

// Interface remains the same
export interface Step {
  activeStep: number
  1: {
    mazeName: string
    mazeSize: string
    customMazeSizeX?: string
    customMazeSizeY?: string
  }
}

// Main component to switch between steps
const LevelDesign = () => {
  const [currentStep, setStep] = useState<Step>({
    activeStep: 1,
    1: { mazeName: "", mazeSize: "", customMazeSizeX: "", customMazeSizeY: "" },
  })

  switch (currentStep.activeStep) {
    case 1:
      return <StepForm currentStep={currentStep} setStep={setStep} />
    case 2:
      // This will render the beautifully designed DesignLevel component from before
      return <DesignLevel currentStep={currentStep} />
    default:
      return (
        <div className="flex min-h-screen w-full items-center justify-center bg-slate-950 text-center text-red-500">
          Invalid step
        </div>
      )
  }
}

// The completely redesigned StepForm component
const StepForm = ({
  currentStep,
  setStep,
}: {
  currentStep: Step
  setStep: React.Dispatch<React.SetStateAction<Step>>
}) => {
  const [error, setError] = useState<string | null>(null)

  // Handler for standard text inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setStep((prev) => ({
      ...prev,
      1: {
        ...prev[1],
        [name]: value,
        // If user starts typing in custom fields, clear the predefined selection
        ...(name.startsWith("custom") ? { mazeSize: "" } : {}),
      },
    }))
  }

  // Dedicated handler for the shadcn/ui Select component
  const handleSelectChange = (value: string) => {
    setStep((prev) => ({
      ...prev,
      1: {
        ...prev[1],
        mazeSize: value,
        // If user selects a predefined size, clear the custom fields
        customMazeSizeX: "",
        customMazeSizeY: "",
      },
    }))
  }

  const handleNext = () => {
    const { mazeName, mazeSize, customMazeSizeX, customMazeSizeY } = currentStep[1]

    const finalMazeSize =
      mazeSize || (customMazeSizeX && customMazeSizeY ? `${customMazeSizeX}x${customMazeSizeY}` : "")

    if (mazeName.trim() && finalMazeSize) {
      setError(null) // Clear any previous errors
      setStep((prev) => ({
        ...prev,
        1: { ...prev[1], mazeSize: finalMazeSize },
        activeStep: 2,
      }))
    } else {
      // Set an inline error message instead of using alert()
      setError("Please provide a maze name and a valid size.")
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-950 p-4">
      <Card className="w-full max-w-md animate-in fade-in-90 slide-in-from-bottom-10 duration-500 bg-slate-900 border-slate-800 text-slate-50">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">Maze Setup</CardTitle>
          <CardDescription className="text-slate-400 pt-1">
            Configure the name and dimensions to begin.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          {/* Maze Name */}
          <div className="grid gap-2">
            <Label htmlFor="mazeName">Maze Name</Label>
            <Input
              id="mazeName"
              name="mazeName"
              value={currentStep[1].mazeName}
              onChange={handleChange}
              placeholder="e.g., The Dragon's Lair"
              className="bg-slate-950 border-slate-700 focus:ring-slate-500"
            />
          </div>

          {/* Predefined Maze Size */}
          <div className="grid gap-2">
            <Label htmlFor="mazeSize">Predefined Size</Label>
            <Select
              name="mazeSize"
              value={currentStep[1].mazeSize}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger className="w-full bg-slate-950 border-slate-700 focus:ring-slate-500">
                <SelectValue placeholder="Select a size" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700 text-slate-50">
                <SelectItem value="10x10">Small (10 x 10)</SelectItem>
                <SelectItem value="20x20">Medium (20 x 20)</SelectItem>
                <SelectItem value="30x30">Large (30 x 30)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-2 text-slate-400">Or</span>
            </div>
          </div>

          {/* Custom Size */}
          <div className="grid gap-2">
            <Label>Custom Size</Label>
            <div className="flex gap-4">
              <Input
                type="number"
                name="customMazeSizeX"
                min="5"
                max="50"
                value={currentStep[1].customMazeSizeX}
                onChange={handleChange}
                placeholder="Width"
                className="bg-slate-950 border-slate-700 focus:ring-slate-500"
              />
              <Input
                type="number"
                name="customMazeSizeY"
                min="5"
                max="50"
                value={currentStep[1].customMazeSizeY}
                onChange={handleChange}
                placeholder="Height"
                className="bg-slate-950 border-slate-700 focus:ring-slate-500"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          {error && (
            <div className="flex w-full items-center gap-2 rounded-md bg-red-900/50 p-3 text-sm text-red-300 animate-in fade-in-50">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <Button onClick={handleNext} className="w-full group">
            Build Maze
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default LevelDesign
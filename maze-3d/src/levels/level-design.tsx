import React, { useState } from "react"

interface Step {
  activeStep: number
  1: {
    mazeName: string
    mazeSize: string
  }
}

const LevelDesign = () => {
  const [currentStep, setStep] = useState<Step>({
    activeStep: 1,
    1: { mazeName: "", mazeSize: "" },
  })

  switch (currentStep.activeStep) {
    case 1:
      return <StepForm currentStep={currentStep} setStep={setStep} />
    case 2:
      return <DesignLevel currentStep={currentStep} />
    default:
      return <div className="text-center text-red-500">Invalid step</div>
  }
}

const StepForm = ({
  currentStep,
  setStep,
}: {
  currentStep: Step
  setStep: React.Dispatch<React.SetStateAction<Step>>
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setStep((prev) => ({
      ...prev,
      1: {
        ...prev[1],
        [name]: value,
      },
    }))
  }

  const handleNext = () => {
    if (currentStep[1].mazeName && currentStep[1].mazeSize) {
      setStep((prev) => ({ ...prev, activeStep: 2 }))
    } else {
      alert("Please fill in all fields.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-fuchsia-100 px-4">
      <div className="bg-white filter backdrop-blur-sm shadow-md rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Maze Setup</h1>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Maze Name</label>
          <input
            type="text"
            name="mazeName"
            value={currentStep[1].mazeName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter maze name"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-1">Maze Size</label>
          <select
            name="mazeSize"
            value={currentStep[1].mazeSize}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select size</option>
            <option value="10x10">10 x 10</option>
            <option value="20x20">20 x 20</option>
            <option value="30x30">30 x 30</option>
          </select>
        </div>

        <button
          onClick={handleNext}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Next
        </button>
      </div>
    </div>
  )
}

const DesignLevel = ({ currentStep }: { currentStep: Step }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-800 px-4">
      <h1 className="text-3xl font-bold mb-4">Design Your Maze</h1>
      <p className="text-lg mb-2">
        <strong>Name:</strong> {currentStep[1].mazeName}
      </p>
      <p className="text-lg mb-8">
        <strong>Size:</strong> {currentStep[1].mazeSize}
      </p>

      <div className="border border-dashed border-gray-400 rounded-xl p-10 text-center">
        <span className="text-gray-500">[ Maze designer canvas goes here 🧱 ]</span>
      </div>
    </div>
  )
}

export default LevelDesign

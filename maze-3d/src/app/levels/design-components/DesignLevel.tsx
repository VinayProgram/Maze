import type { Step } from "../level-design"

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

  const Navbar=()=>{
    
  }

  export default DesignLevel
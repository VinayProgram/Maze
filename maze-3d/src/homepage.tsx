import { Canvas } from "@react-three/fiber"
import { Physics } from "@react-three/rapier"
import MazeHomepage from "./components/maze-homepage"
import React from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

const Homepage = () => {
  const [scrollY, setScrollY] = React.useState(0)
  React.useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll)
  
  }, [])
  useGSAP(() => {
      gsap.to('.box', {
        top: scrollY,
        duration: 2,  
        ease: "elastic.inOut",
      })
  }, [scrollY])
  return (
    <main className="h-screen w-screen relative">
      <div className="h-full w-full bg-purple-400 relative z-10">
        <div className="absolute top-0 left-0 z-30 p-4">
          <h1 className="text-4xl text-white">Maze 3D</h1>
        </div>

        {/* Animated Canvas */}
        <Canvas className="box" style={{ position: "absolute" }}>
          <Physics>
            <MazeHomepage />
          </Physics>
          <ambientLight intensity={1} />
        </Canvas>
      </div>
      {/* Scrollable sections */}
      <div className="h-full w-full bg-amber-100" />
      <div className="h-full w-full bg-fuchsia-200" />
    </main>
  )
}

export default Homepage

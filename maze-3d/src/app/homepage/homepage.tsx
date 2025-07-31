import { Canvas } from "@react-three/fiber"
import { Physics } from "@react-three/rapier"
import React from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import MazeHomepage from "./components/maze-homepage"
import AboutMePage from "./components/developer-page"
import GameOptionsPage from "./components/secondHomePage"

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
        animation:"ease",
        transition:"ease",
        ease: "circ.inOut",
      })
  }, [scrollY])

  useGSAP(() => {
    // Gradient text animation
    gsap.fromTo('.gradient-text', 
      {
        backgroundPosition: '0% 50%'
      },
      {
        backgroundPosition: '100% 50%',
        duration: 3,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true
      }
    )

    // Text entrance animation
    gsap.fromTo('.main-title', 
      {
        opacity: 0,
        y: -50,
        scale: 0.8,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.5,
        ease: "back.out(1.7)",
        delay: 0.3
      }
    )

    // Subtitle animation
    gsap.fromTo('.subtitle', 
      {
        opacity: 0,
        x: -30,
      },
      {
        opacity: 1,
        x: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 1
      }
    )

    // Floating animation for title
    gsap.to('.main-title', {
      y: -10,
      duration: 2,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: 2
    })
  }, [])

  return (
    <main className="h-screen w-screen relative">
      <div className="h-full w-full bg-black relative z-10">
        <div className="absolute top-0 left-0 z-30 p-8 w-full">
          <h1 className="main-title text-6xl md:text-8xl font-bold gradient-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent bg-300% animate-gradient">
            Maze 3D
          </h1>
          <p className="subtitle text-xl md:text-2xl text-gray-300 mt-4 font-light tracking-wide">
            Navigate through infinite dimensions
          </p>
          <div className="mt-8 subtitle">
            <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          </div>
        </div>

        {/* Animated Canvas */}
        <Canvas className="box" style={{ position: "absolute" }}>
          <Physics>
            <MazeHomepage />
          </Physics>
          <ambientLight intensity={1} />
          <directionalLight position={[5, 10, 5]} />
        </Canvas>
      </div>
      {/* Scrollable sections */}
      {/* Decorative elements */}
      <div className="absolute bottom-10 left-8 z-30">
          <div className="flex items-center space-x-4 text-gray-400">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span className="text-sm tracking-widest">EXPLORE</span>
          </div>
        </div>

        <div className="absolute top-1/2 right-8 z-30 transform -translate-y-1/2">
          <div className="flex flex-col space-y-3">
            <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-transparent"></div>
            <div className="w-1 h-8 bg-gradient-to-b from-pink-500 to-transparent"></div>
            <div className="w-1 h-8 bg-gradient-to-b from-red-500 to-transparent"></div>
          </div>
        </div>
      
        <GameOptionsPage/>
        <AboutMePage/>
      </main>
  )
}

export default Homepage


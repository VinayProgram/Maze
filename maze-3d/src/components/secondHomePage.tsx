import React from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const GameOptionsPage = () => {
  useGSAP(() => {
    // Title animation
    gsap.fromTo('.play-title', 
      {
        opacity: 0,
        y: 50,
        scale: 0.9,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: '.play-title',
          start: 'top 80%'
        }
      }
    )

    // Subtitle animation
    gsap.fromTo('.play-subtitle', 
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power2.out",
        delay: 0.3,
        scrollTrigger: {
          trigger: '.play-subtitle',
          start: 'top 80%'
        }
      }
    )

    // Play card animation
    gsap.fromTo('.play-card', 
      {
        opacity: 0,
        x: -50,
        rotateY: -15,
      },
      {
        opacity: 1,
        x: 0,
        rotateY: 0,
        duration: 1.5,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: '.play-card',
          start: 'top 80%'
        }
      }
    )

    // Design card animation
    gsap.fromTo('.design-card', 
      {
        opacity: 0,
        x: 50,
        rotateY: 15,
      },
      {
        opacity: 1,
        x: 0,
        rotateY: 0,
        duration: 1.5,
        ease: "back.out(1.7)",
        delay: 0.2,
        scrollTrigger: {
          trigger: '.design-card',
          start: 'top 80%'
        }
      }
    )
  }, [])

  const handlePlayGame = () => {
    console.log("Navigate to Play Game")
    // Add your navigation logic here
  }

  const handleDesignLevel = () => {
    console.log("Navigate to Design Level")
    // Add your navigation logic here
  }

  return (
    <div className="h-full w-full bg-gradient-to-br from-gray-900 via-purple-900 to-black relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-purple-400 rotate-45"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border-2 border-pink-400 rotate-12"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 border-2 border-purple-300 -rotate-12"></div>
        <div className="absolute bottom-40 right-10 w-28 h-28 border-2 border-pink-300 rotate-45"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center px-8 mt-2">
        <div className="text-center mb-16">
          <h2 className="play-title text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-purple-400 bg-clip-text text-transparent mt-10">
            Choose Your Path
          </h2>
          <p className="play-subtitle text-xl text-gray-300 font-light tracking-wide">
            Every maze tells a different story
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
          {/* Play Game Card */}
          <div className="play-card flex-1 group cursor-pointer" onClick={handlePlayGame}>
            <div className="bg-gradient-to-br from-purple-800/30 to-pink-800/30 backdrop-blur-sm border border-purple-400/30 rounded-2xl p-8 h-80 flex flex-col justify-between hover:border-purple-400/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
              <div>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl mb-6 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
                  Play Game
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Dive into pre-built mazes with increasing difficulty. Master the art of navigation.
                </p>
              </div>
              <div className="flex items-center text-purple-400 group-hover:text-pink-400 transition-colors">
                <span className="font-semibold">Start Adventure</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Design Level Card */}
          <div className="design-card flex-1 group cursor-pointer" onClick={handleDesignLevel}>
            <div className="bg-gradient-to-br from-pink-800/30 to-purple-800/30 backdrop-blur-sm border border-pink-400/30 rounded-2xl p-8 h-80 flex flex-col justify-between hover:border-pink-400/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/20">
              <div>
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl mb-6 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010 2h1.586l-2.293 2.293a1 1 0 001.414 1.414L15 8.414V10a1 1 0 002 0V6a1 1 0 00-1-1h-4zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 011.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 011.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-pink-300 transition-colors">
                  Design Level
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Unleash your creativity. Build custom mazes and share them with the world.
                </p>
              </div>
              <div className="flex items-center text-pink-400 group-hover:text-purple-400 transition-colors">
                <span className="font-semibold">Create Magic</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom decorative element */}
        <div className="mt-16 flex items-center space-x-4">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
          <div className="w-20 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"></div>
          <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
        </div>
      </div>
    </div>
  )
}

export default GameOptionsPage
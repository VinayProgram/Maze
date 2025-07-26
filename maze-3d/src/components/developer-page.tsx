import React from "react"

const AboutMePage = () => {
  return (
    <div className="h-full w-full bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
  <div className="relative z-10 h-full flex flex-col justify-center items-center px-8 mt-2">
  <div className="bg-gradient-to-br from-purple-800/30 to-pink-800/30 backdrop-blur-sm border border-purple-400/30 rounded-2xl p-8 h-100 flex flex-col justify-between hover:border-purple-400/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
      <div className="text-center">
        
        {/* Profile Avatar */}
        <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-4xl font-bold text-white mb-8 mx-auto">
          VT
        </div>
        
        {/* Name */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Vinay Tandale
        </h1>
        
        {/* Title */}
        <p className="text-xl text-purple-300 mb-6">
          Software Engineer
        </p>
        
        {/* Tagline */}
        <p className="text-lg text-gray-300 mb-8">
          Build anything possibly
        </p>
        
        {/* Contact Info */}
        <div className="space-y-3">
          <div className="text-gray-300">
            7666949043
          </div>
          <div className="text-gray-300">
            vinaytandale@gmail.com
          </div>
        </div>
        
      </div>
      </div>
      </div>
    </div>
  )
}

export default AboutMePage
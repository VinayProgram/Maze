// src/components/JoystickControls.tsx

import { useStore } from '@/store/common.store'
import { Joystick } from 'react-joystick-component'
import type { IJoystickUpdateEvent } from 'react-joystick-component/build/lib/Joystick'

const MobileControls = () => {
  const setControl = useStore((state) => state.setControl)
  const controls = useStore((state) => state.controls)

  const handleJoystickMove = (event: IJoystickUpdateEvent) => {
    if(!event.x || !event.y) return
    const x = event.x*100
    // Threshold to avoid noise
    const threshold = 30

    setControl('forward', false)
    setControl('backward', false)
    setControl('left', false)
    setControl('right', false)
    if (event.direction) {
      if (event.direction.includes('FORWARD')) {
        setControl('left', x < -threshold)
        setControl('right', x > threshold)
        setControl('forward', true)
      }
      if (event.direction.includes('BACKWARD')) {
        setControl('left', x < -threshold)
        setControl('right', x > threshold)
        setControl('backward', true)
    }
    if (event.direction.includes('LEFT')) {
      setControl('left', true)
    }
    if (event.direction.includes('RIGHT')) {
      setControl('right', true)
    }
    
    }
  
  }

  const handleJoystickStop = () => {
    setControl('forward', false)
    setControl('backward', false)
    setControl('left', false)
    setControl('right', false)
  }

  const handleShiftPress = () => {
    setControl('shift', !controls.shift)
  }

  return (
    <>
      <div className="absolute bottom-8 right-8 z-50">
        <Joystick
          size={100}
          baseColor="rgba(17, 24, 39, 0.7)"
          stickColor="rgba(55, 65, 81, 0.9)"
          throttle={10}
          move={handleJoystickMove}
          stop={handleJoystickStop}
        />
      </div>

      <div className="absolute bottom-8 left-8 z-50">
        <button
          className="w-20 h-20 bg-gray-800/70 text-white rounded-full flex items-center justify-center active:scale-95 touch-manipulation"
          onClick={handleShiftPress}
        >
          <span className="text-3xl">{controls.shift ? '🏃' : '🚶‍♂️'}</span>
        </button>
      </div>
    </>
  )
}

export default MobileControls

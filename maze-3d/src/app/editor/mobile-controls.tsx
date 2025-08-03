// src/components/JoystickControls.tsx

import { useStore } from '@/store/common.store'
import { Joystick } from 'react-joystick-component'
import type { IJoystickUpdateEvent } from 'react-joystick-component/build/lib/Joystick'

const MobileControls = () => {
  const setControl = useStore((state) => state.setControl)
  const controls = useStore((state) => state.controls)
  const handleJoystickMove = (event: IJoystickUpdateEvent) => {
    setControl('forward', false)
    setControl('backward', false)
    setControl('left', false)
    setControl('right', false)
    if (event.direction) {
      if (event.direction.includes('FORWARD')) setControl('forward', true)
      if (event.direction.includes('BACKWARD')) setControl('backward', true)
      if (event.direction.includes('LEFT')) setControl('left', true)
      if (event.direction.includes('RIGHT')) setControl('right', true)
    }
  }

  const handleJoystickStop = () => {
    setControl('forward', false)
    setControl('backward', false)
    setControl('left', false)
    setControl('right', false)
  }
  
  const handleShiftPress = () => {
    setControl('shift', !controls.shift);
  }

  return (
    <>
      <div className="absolute bottom-8 left-8 z-50">
        <Joystick
          size={100}
          baseColor="rgba(17, 24, 39, 0.7)"
          stickColor="rgba(55, 65, 81, 0.9)"
          move={handleJoystickMove}
          stop={handleJoystickStop}
        />
      </div>

      <div className="absolute bottom-8 right-8 z-50">
        <button
          className="w-20 h-20 bg-gray-800/70 text-white rounded-full flex items-center justify-center active:scale-95 touch-manipulation"
          onClick={() => handleShiftPress()}
        >
           <span className="text-3xl">{controls.shift ? '🏃' : '🚶‍♂️'}</span>
        </button>
      </div>
    </>
  )
}
// src/components/MobileControls.tsx

// import { useStore } from '@/store/common.store'
// import { ControlsEnum } from '@/store/constants'
// import { Run } from 'lucide-react' // Optional: for a nice icon

// const MobileControls = () => {
//   const setControl = useStore((state) => state.setControl)

//   const handlePress = (key: ControlsEnum, isPressed: boolean) => {
//     const keyMap = {
//       [ControlsEnum.forward]: 'forward',
//       [ControlsEnum.back]: 'backward',
//       [ControlsEnum.left]: 'left',
//       [ControlsEnum.right]: 'right',
//       [ControlsEnum.jump]: 'jump',
//       [ControlsEnum.shift]: 'shift', // 'shift' is already in your map
//     } as const

//     const zustandKey = keyMap[key]
//     if (zustandKey) {
//       setControl(zustandKey, isPressed)
//     }
//   }

//   return (
//     <>
//       {/* Movement Controls (D-Pad) */}
//       <div className="absolute bottom-8 left-8 z-50 flex gap-4 items-end">
//         {/* Left */}
//         <button
//           className="w-16 h-16 bg-gray-800/70 text-white rounded-full flex items-center justify-center active:scale-95 touch-manipulation"
//           onTouchStart={() => handlePress(ControlsEnum.left, true)}
//           onTouchEnd={() => handlePress(ControlsEnum.left, false)}
//         >
//           ⬅️
//         </button>

//         <div className="flex flex-col gap-4">
//           {/* Up */}
//           <button
//             className="w-16 h-16 bg-gray-800/70 text-white rounded-full flex items-center justify-center active:scale-95 touch-manipulation"
//             onTouchStart={() => handlePress(ControlsEnum.forward, true)}
//             onTouchEnd={() => handlePress(ControlsEnum.forward, false)}
//           >
//             ⬆️
//           </button>

//           {/* Down */}
//           <button
//             className="w-16 h-16 bg-gray-800/70 text-white rounded-full flex items-center justify-center active:scale-95 touch-manipulation"
//             onTouchStart={() => handlePress(ControlsEnum.back, true)}
//             onTouchEnd={() => handlePress(ControlsEnum.back, false)}
//           >
//             ⬇️
//           </button>
//         </div>

//         {/* Right */}
//         <button
//           className="w-16 h-16 bg-gray-800/70 text-white rounded-full flex items-center justify-center active:scale-95 touch-manipulation"
//           onTouchStart={() => handlePress(ControlsEnum.right, true)}
//           onTouchEnd={() => handlePress(ControlsEnum.right, false)}
//         >
//           ➡️
//         </button>
//       </div>

//       {/* Action Controls (Shift/Run) */}
//       <div className="absolute bottom-8 right-8 z-50">
//         <button
//           className="w-20 h-20 bg-gray-800/70 text-white rounded-full flex items-center justify-center active:scale-95 touch-manipulation"
//           onTouchStart={() => handlePress(ControlsEnum.shift, true)}
//           onTouchEnd={() => handlePress(ControlsEnum.shift, false)}
//         >
//           <span className="text-3xl">🏃</span>
//           {/* Or use an icon: <Run size={32} /> */}
//         </button>
//       </div>
//     </>
//   )
// }

// export default MobileControls
export default MobileControls
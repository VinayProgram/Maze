import { useStore } from '../store/common.store'
import { ControlsEnum } from '../store/constants'

const MobileControls = () => {
  const setControl = useStore((state) => state.setControl)

  const handlePress = (key: ControlsEnum, isPressed: boolean) => {
    // map ControlsEnum to Zustand keys
    const keyMap = {
      [ControlsEnum.forward]: 'forward',
      [ControlsEnum.back]: 'backward',
      [ControlsEnum.left]: 'left',
      [ControlsEnum.right]: 'right',
      [ControlsEnum.jump]: 'jump',
    } as const

    const zustandKey = keyMap[key]
    if (zustandKey) {
      setControl(zustandKey, isPressed)
    }
  }

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-4">
      {/* Left */}
      <button
        className="w-16 h-16 bg-gray-800 text-white rounded-full flex items-center justify-center active:scale-95 touch-manipulation"
        onTouchStart={() => handlePress(ControlsEnum.left, true)}
        onTouchEnd={() => handlePress(ControlsEnum.left, false)}
      >
        ⬅️
      </button>

      <div className="flex flex-col gap-4">
        {/* Up */}
        <button
          className="w-16 h-16 bg-gray-800 text-white rounded-full flex items-center justify-center active:scale-95 touch-manipulation"
          onTouchStart={() => handlePress(ControlsEnum.forward, true)}
          onTouchEnd={() => handlePress(ControlsEnum.forward, false)}
        >
          ⬆️
        </button>

        {/* Down */}
        <button
          className="w-16 h-16 bg-gray-800 text-white rounded-full flex items-center justify-center active:scale-95 touch-manipulation"
          onTouchStart={() => handlePress(ControlsEnum.back, true)}
          onTouchEnd={() => handlePress(ControlsEnum.back, false)}
        >
          ⬇️
        </button>
      </div>

      {/* Right */}
      <button
        className="w-16 h-16 bg-gray-800 text-white rounded-full flex items-center justify-center active:scale-95 touch-manipulation"
        onTouchStart={() => handlePress(ControlsEnum.right, true)}
        onTouchEnd={() => handlePress(ControlsEnum.right, false)}
      >
        ➡️
      </button>
    </div>
  )
}

export default MobileControls

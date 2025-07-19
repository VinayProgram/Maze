import { useFrame, useLoader } from '@react-three/fiber'
import { FBXLoader } from 'three-stdlib'
import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import { PerspectiveCamera, useKeyboardControls } from '@react-three/drei'
import type { ControlsEnum } from '../store/constants'

const Player = () => {
  const fbx = useLoader(FBXLoader, '/Walking.fbx')
  const mixer = useRef<THREE.AnimationMixer>(null)
  const playerRef = useRef<THREE.Group>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)

  const forwardPressed = useKeyboardControls<ControlsEnum>(state => state.ArrowUp)
  const backwardPressed = useKeyboardControls<ControlsEnum>(state => state.ArrowDown)
  const leftPressed = useKeyboardControls<ControlsEnum>(state => state.ArrowLeft)
  const rightPressed = useKeyboardControls<ControlsEnum>(state => state.ArrowRight)
  const jumpPressed = useKeyboardControls<ControlsEnum>(state => state.Space)

  useEffect(() => {
    if (fbx.animations.length > 0) {
      mixer.current = new THREE.AnimationMixer(fbx)
      const action = mixer.current.clipAction(fbx.animations[0])
      if (forwardPressed || backwardPressed || leftPressed || rightPressed) {
        action.play()
      }
    }
  }, [fbx, forwardPressed, backwardPressed, leftPressed, rightPressed])

  useFrame((state, delta) => {
    const player = playerRef.current
    const cam = cameraRef.current
    if (player && cam) {
      // Set camera a little behind and above the player
      const offset = new THREE.Vector3(0, 2, -3).applyQuaternion(player.quaternion)
      cam.position.copy(player.position.clone().add(offset))
      cam.lookAt(player.position)
    }

    mixer.current?.update(delta)
  })

  return (
    <group ref={playerRef}>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        fov={60}
        near={0.1}
        far={1000}
        position={[0, 2, -3]} // starting offset; actual updated in useFrame
      />
      <primitive object={fbx} position={[0, 0, 0]} scale={0.001} />
    </group>
  )
}

export default Player

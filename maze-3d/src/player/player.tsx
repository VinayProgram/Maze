import { useFrame, useLoader } from '@react-three/fiber'
import { FBXLoader } from 'three-stdlib'
import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import { useKeyboardControls, PerspectiveCamera } from '@react-three/drei'
import type { ControlsEnum } from '../editor'

const Player = () => {
  const fbx = useLoader(FBXLoader, '/Walking.fbx')
  const mixer = useRef<THREE.AnimationMixer>(null)
  const playerRef = useRef<THREE.Group>(null)
  const forwardPressed = useKeyboardControls<ControlsEnum>(state=>state.ArrowUp)
  const backwardPressed = useKeyboardControls<ControlsEnum>(state=>state.ArrowDown)
  // const leftPressed = useKeyboardControls<ControlsEnum>(state=>state.ArrowLeft)
  // const rightPressed = useKeyboardControls<ControlsEnum>(state=>state.ArrowRight)
  // const jumpPressed = useKeyboardControls<ControlsEnum>(state=>state.Space)

  useEffect(() => {
    if (fbx.animations.length > 0) {
      mixer.current = new THREE.AnimationMixer(fbx)
      const action = mixer.current.clipAction(fbx.animations[0])
      if(forwardPressed||backwardPressed){
        action.play()
      }
    }
  }, [fbx,forwardPressed,backwardPressed])

  useFrame((state, delta) => {
    if(playerRef.current) state.camera.lookAt(playerRef.current.position)
    if((forwardPressed||backwardPressed)&&playerRef.current){
      if(forwardPressed){
        playerRef.current.position.z += 1
      }
      if(backwardPressed){
        playerRef.current.position.z -= 1
      }
    }
    mixer.current?.update(delta)
  })

  return (
    <group ref={playerRef}>
    <PerspectiveCamera makeDefault position={[0, 100, -10]} />
    <primitive object={fbx} position={[0, 0, 0]} scale={0.1} />
    </group>
  )
}

export default Player

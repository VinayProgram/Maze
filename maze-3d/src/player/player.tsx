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
  const forwardPressed = useKeyboardControls<ControlsEnum>(state=>state.ArrowUp)
  const backwardPressed = useKeyboardControls<ControlsEnum>(state=>state.ArrowDown)
  const leftPressed = useKeyboardControls<ControlsEnum>(state=>state.ArrowLeft)
  const rightPressed = useKeyboardControls<ControlsEnum>(state=>state.ArrowRight)
  // const jumpPressed = useKeyboardControls<ControlsEnum>(state=>state.Space)
  const direction = useRef(new THREE.Vector3())
  useEffect(() => {
    if (fbx.animations.length > 0) {
      mixer.current = new THREE.AnimationMixer(fbx)
      const action = mixer.current.clipAction(fbx.animations[0])
      if(forwardPressed||backwardPressed||leftPressed||rightPressed){
        action.play()
      }
    }
  }, [fbx,forwardPressed,backwardPressed,leftPressed,rightPressed])

  useFrame((state, delta) => {
    if(playerRef.current) {
      playerRef.current.getWorldDirection(direction.current)
      console.log(direction.current)
      state.camera.lookAt(playerRef.current.position)
      if(leftPressed){
        playerRef.current.rotation.y += 0.01
      }
      if(rightPressed){
        playerRef.current.rotation.y -= 0.01
      }
      if(forwardPressed){
        playerRef.current.position.add(direction.current.multiplyScalar(0.01))
      }
      if(backwardPressed){
        playerRef.current.position.sub(direction.current.multiplyScalar(0.01))
      }
     
    }
      mixer.current?.update(delta)
  })

  return (
    <group ref={playerRef}>
    <PerspectiveCamera makeDefault position={[0, 1, 2]} />
    <primitive object={fbx} position={[0, 0, 0]} scale={0.001} />
    <arrowHelper args={[direction.current, playerRef.current?.position, 100, 'orange']} />
    </group>
  )
}

export default Player

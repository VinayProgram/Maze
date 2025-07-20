import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { FBXLoader } from 'three-stdlib'
import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import { useKeyboardControls } from '@react-three/drei'
import type { ControlsEnum } from '../store/constants'
import { CuboidCollider, RigidBody, type RapierRigidBody } from '@react-three/rapier'

const Player = ({ RigidRef , playerRef}: { RigidRef: React.RefObject<RapierRigidBody>, playerRef: React.RefObject<THREE.Group> }) => {
  const fbx = useLoader(FBXLoader, '/Walking.fbx')
  const mixer = useRef<THREE.AnimationMixer>(null)
  const forwardPressed = useKeyboardControls<ControlsEnum>(s => s.ArrowUp)
  const backwardPressed = useKeyboardControls<ControlsEnum>(s => s.ArrowDown)
  const leftPressed = useKeyboardControls<ControlsEnum>(s => s.ArrowLeft)
  const rightPressed = useKeyboardControls<ControlsEnum>(s => s.ArrowRight)
  const direction = useRef(new THREE.Vector3())
  const scene = useThree((state) => state.scene)
 
  useEffect(() => {
    if (fbx.animations.length > 0) {
      mixer.current = new THREE.AnimationMixer(fbx)
    }
  }, [fbx])
 useFrame((_state,delta)=>{
  const rigid = RigidRef.current
  if(rigid){
    if(forwardPressed) {
      rigid.setLinvel({x:0,y:0,z:1},true)
    }
    if(backwardPressed) {
      rigid.setLinvel({x:0,y:0,z:-1},true)
    }
    if(leftPressed) {
      rigid.setLinvel({x:-1,y:0,z:0},true)
    }
    if(rightPressed) {
      rigid.setLinvel({x:1,y:0,z:0},true)
    }

    const anyKeyPressed = forwardPressed || backwardPressed || leftPressed || rightPressed
    if (mixer.current && fbx.animations.length > 0) {
      const action = mixer.current.clipAction(fbx.animations[0])
      if (anyKeyPressed) {
        if (!action.isRunning()) action.play()
      } else {
        action.stop()
      }
      mixer.current.update(delta)
    }
  }
 }) 

  return (
    <RigidBody ref={RigidRef} colliders={false} mass={1}>
    <CuboidCollider args={[0.10, 0.01, 0.10]} />
    <primitive ref={playerRef} object={fbx} position={[0, 0, 0]} scale={0.001} />
  </RigidBody>
  )
}





const ThirdPersonCamera = ({ playerRef, mazeRef }: {
  playerRef: React.RefObject<THREE.Group>,
  mazeRef: React.RefObject<THREE.Group>
}) => {
  const { camera } = useThree()
  const offset = new THREE.Vector3(0, 1, -2) // desired offset (can adjust)
  const desiredCameraPos = useRef(new THREE.Vector3())
  const safeCameraPos = useRef(new THREE.Vector3())
  const raycaster = new THREE.Raycaster()

  useFrame(() => {
    const player = playerRef.current
    const maze = mazeRef.current
    if (!player || !maze) return
    // Desired camera position behind the player
    const rotatedOffset = offset.clone().applyQuaternion(player.quaternion)
    desiredCameraPos.current.copy(player.position).add(rotatedOffset)

    // Direction from player to camera
    const direction = desiredCameraPos.current.clone().sub(player.position).normalize()

    // Set ray from player toward camera
    raycaster.set(player.position.clone(), direction)
    raycaster.far = offset.length()

    const intersects = raycaster.intersectObjects(maze.children, true)

    if (intersects.length > 0) {
    console.log(intersects)
      // If wall hit: move camera to hit point (but slightly closer to player)
      const hitPoint = intersects[0].point
      const buffer = 0.2
      safeCameraPos.current.copy(hitPoint).add(direction.clone().multiplyScalar(-buffer))
    } else {
      // No wall hit: use full desired position
      safeCameraPos.current.copy(desiredCameraPos.current)
    }

    // Smooth camera motion
    camera.position.lerp(safeCameraPos.current, 0.1)
    camera.lookAt(player.position)
  })

  return null
}



export {Player, ThirdPersonCamera}

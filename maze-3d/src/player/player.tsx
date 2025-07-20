import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { FBXLoader } from 'three-stdlib'
import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import { useKeyboardControls } from '@react-three/drei'
import type { ControlsEnum } from '../store/constants'
import { CuboidCollider, RigidBody, type RapierRigidBody } from '@react-three/rapier'

const Player = ({ RigidRef, playerRef }: { RigidRef: React.RefObject<RapierRigidBody>, playerRef: React.RefObject<THREE.Group> }) => {
  const fbx = useLoader(FBXLoader, '/Walking.fbx')
  const mixer = useRef<THREE.AnimationMixer>(null)
  const forwardPressed = useKeyboardControls<ControlsEnum>(s => s.ArrowUp)
  const backwardPressed = useKeyboardControls<ControlsEnum>(s => s.ArrowDown)
  const leftPressed = useKeyboardControls<ControlsEnum>(s => s.ArrowLeft)
  const rightPressed = useKeyboardControls<ControlsEnum>(s => s.ArrowRight)
  const direction = useRef(new THREE.Vector3())
  const angle = useRef(0) // Track Y-axis angle
  const quaternion = new THREE.Quaternion()
  const up = new THREE.Vector3(0, 1, 0)
  useEffect(() => {
    if (fbx.animations.length > 0) {
      mixer.current = new THREE.AnimationMixer(fbx)
    }
  }, [fbx])
  useFrame((_state,delta) => {
    const speed = 1
    const velocity = new THREE.Vector3()
    const rigid = RigidRef.current
    const player = playerRef.current
    
    if (!rigid || !player) return

    player.getWorldDirection(direction.current)
    direction.current.y = 0 
    direction.current.normalize()

    if (forwardPressed) {
      velocity.add(direction.current.clone().multiplyScalar(speed))
    }
    if (backwardPressed) {
      velocity.add(direction.current.clone().multiplyScalar(-speed))
    }
    if (leftPressed) angle.current += 0.05
    if (rightPressed) angle.current -= 0.05
  
    quaternion.setFromAxisAngle(up, angle.current)
    rigid.setRotation(quaternion, true)
    rigid.setLinvel({ x: velocity.x, y: 0, z: velocity.z }, true)    
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
  })

  return (
    <RigidBody ref={RigidRef} colliders={false} mass={1}>
      <CuboidCollider args={[0.10, 0.01, 0.10]} />
      <primitive ref={playerRef} object={fbx} position={[0, 0, 0]} scale={0.001} />
      <arrowHelper />
    </RigidBody>
  )
}





const ThirdPersonCamera = ({ rigidBody, mazeRef }: {
  rigidBody: React.RefObject<RapierRigidBody>,
  mazeRef: React.RefObject<THREE.Group>
}) => {
  const { camera } = useThree()
  const offset = new THREE.Vector3(0, 1, -2) // desired offset (can adjust)
  const desiredCameraPos = useRef(new THREE.Vector3())
  const safeCameraPos = useRef(new THREE.Vector3())
  const raycaster = new THREE.Raycaster()

  useFrame(() => {
    const player = rigidBody.current
    const maze = mazeRef.current
    if (!player || !maze) return

    // Convert Rapier data to THREE types
    const playerPos = new THREE.Vector3().copy(player.translation())
    const playerQuat = new THREE.Quaternion().copy(player.rotation())

    // Calculate desired camera offset based on player orientation
    const rotatedOffset = offset.clone().applyQuaternion(playerQuat)
    desiredCameraPos.current.copy(playerPos).add(rotatedOffset)

    // Direction from player to desired camera position
    const direction = desiredCameraPos.current.clone().sub(playerPos).normalize()

    // Raycast from player to desired camera
    raycaster.set(playerPos, direction)
    raycaster.far = offset.length()

    const intersects = raycaster.intersectObjects(maze.children, true)

    if (intersects.length > 0) {
      const hitPoint = intersects[0].point
      const buffer = 0.2
      safeCameraPos.current.copy(hitPoint).add(direction.clone().multiplyScalar(-buffer))
    } else {
      safeCameraPos.current.copy(desiredCameraPos.current)
    }

    // Smoothly update the camera
    camera.position.lerp(safeCameraPos.current, 0.1)
    camera.lookAt(playerPos)
  })

  return null
}



export { Player, ThirdPersonCamera }

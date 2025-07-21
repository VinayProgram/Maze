import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { FBXLoader } from 'three-stdlib'
import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import { useKeyboardControls } from '@react-three/drei'
import type { ControlsEnum } from '../store/constants'
import { CuboidCollider, RigidBody, type RapierRigidBody } from '@react-three/rapier'
import { Vector3 } from 'three'

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
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    if (fbx.animations.length > 0) {
      mixer.current = new THREE.AnimationMixer(fbx)
    }
    const start = scene.getObjectByName('start')
    if(start) {
      RigidRef.current.setTranslation({x:start.position.x,y:start.position.y+0.01,z:start.position.z},true)
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




const ThirdPersonCamera = ({
  rigidBody,
  mazeRef,
}: {
  rigidBody: React.RefObject<RapierRigidBody>
  mazeRef: React.RefObject<THREE.Group>
}) => {

  useFrame((state) => {
    const player = rigidBody.current
    const maze = mazeRef.current
    if (!player || !maze) return
    const offset = new Vector3(0, 0.60, -1).applyQuaternion(player.rotation());
    const cameraPosition =  new Vector3().copy(player.translation()).add(offset);
    state.camera.position.copy(cameraPosition);
    state.camera.lookAt(new Vector3().copy(player.translation()));
  })

  return null
}



export { Player, ThirdPersonCamera }

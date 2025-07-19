import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { FBXLoader } from 'three-stdlib'
import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import { useKeyboardControls } from '@react-three/drei'
import type { ControlsEnum } from '../store/constants'

const Player = ({ playerRef }: { playerRef: React.RefObject<THREE.Group> }) => {
  const fbx = useLoader(FBXLoader, '/Walking.fbx')
  const mixer = useRef<THREE.AnimationMixer>(null)
  const forwardPressed = useKeyboardControls<ControlsEnum>(s => s.ArrowUp)
  const backwardPressed = useKeyboardControls<ControlsEnum>(s => s.ArrowDown)
  const leftPressed = useKeyboardControls<ControlsEnum>(s => s.ArrowLeft)
  const rightPressed = useKeyboardControls<ControlsEnum>(s => s.ArrowRight)
  const direction = useRef(new THREE.Vector3())

  useEffect(() => {
    if (fbx.animations.length > 0) {
      mixer.current = new THREE.AnimationMixer(fbx)
    }
  }, [fbx])

  useFrame((state, delta) => {
    const player = playerRef.current
    if (!player) return

    player.getWorldDirection(direction.current)


    if (leftPressed) player.rotation.y += 0.03
    if (rightPressed) player.rotation.y -= 0.03

    const moveVector = direction.current.clone().normalize()
    if (forwardPressed) player.position.add(moveVector.multiplyScalar(0.05))
    if (backwardPressed) player.position.sub(moveVector.multiplyScalar(0.05))

    const anyKey = forwardPressed || backwardPressed || leftPressed || rightPressed

    if (mixer.current && fbx.animations.length > 0) {
      const action = mixer.current.clipAction(fbx.animations[0])
      if (anyKey) {
        if (!action.isRunning()) action.play()
      } else {
        action.stop()
      }
      mixer.current.update(delta)
    }
  })

  return (
    <group ref={playerRef}>
      <primitive object={fbx} position={[0, 0, 0]} scale={0.001} />
     {playerRef.current && direction.current && <arrowHelper  args={[direction.current, playerRef.current.position, 1, 'orange']}/>}
    </group>
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

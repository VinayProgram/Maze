import { useFrame, useLoader } from '@react-three/fiber'
import { FBXLoader } from 'three-stdlib'
import * as THREE from 'three'
import { useEffect, useRef } from 'react'

const Player = () => {
  const fbx = useLoader(FBXLoader, '/Walking.fbx')
  const mixer = useRef<THREE.AnimationMixer>(null)

  useEffect(() => {
    if (fbx.animations.length > 0) {
      mixer.current = new THREE.AnimationMixer(fbx)
      const action = mixer.current.clipAction(fbx.animations[0])
      action.play()
    }
  }, [fbx])

  useFrame((state, delta) => {
    mixer.current?.update(delta)
  })

  return (
    <primitive object={fbx} position={[0, 0, 0]} scale={[1, 1, 1]} />
  )
}

export default Player

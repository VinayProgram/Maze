import React from 'react'
import { Maze } from '../levels/maze'
import { Canvas, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
const MazeHomepage = () => {
    const mazeRef = React.useRef<THREE.Group>(null!)
   

    useGSAP(() => {
        if (!mazeRef.current) return
        gsap.to(mazeRef.current.position, {
            z: -10,
            y: 1,
            x: -5,
            duration: 3,
            ease: "power1.inOut"
        })
        gsap.to(mazeRef.current.rotation, {
            x: Math.PI / 2,
            duration: 3,
        })
        gsap.to(mazeRef.current.rotation, {
            y: Math.PI / 2,
            duration: 3,
            ease: "power1.inOut",
            repeat: -1,
            yoyo: true
        })
    })
    return (
        <>
            <Maze mazeRef={mazeRef} />
        </>
    )
}

export default MazeHomepage

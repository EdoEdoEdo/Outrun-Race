import { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import { GridFloorPurple } from './GridFloor.jsx'

const boxGeometry = new THREE.BoxGeometry(1, 1, 1)

export function BlockLaserGate({ position = [0, 0, 0] }) {
    const laserRefs = useRef([])
    const [openIndex, setOpenIndex] = useState(3) // Quale è spento (il passaggio)
    
    useFrame((state) => {
        const time = state.clock.elapsedTime
        
        // Cambia quale laser è spento ogni 2.5 secondi
        const newOpenIndex = Math.floor(time / 2.5) % 7
        
        if (newOpenIndex !== openIndex) {
            setOpenIndex(newOpenIndex)
        }
        
        // Sposta i laser: attivi in posizione, spenti fuori scena
        laserRefs.current.forEach((laser, index) => {
            if (laser) {
                const isActive = index !== openIndex
                const yPos = isActive ? 1 : -100 // Sposta giù quando spento
                const xPositions = [-1.8, -1.2, -0.6, 0, 0.6, 1.2, 1.8]
                
                laser.setNextKinematicTranslation({
                    x: position[0] + xPositions[index],
                    y: position[1] + yPos,
                    z: position[2]
                })
            }
        })
    })
    
    return (
        <group position={position}>
            {/* Grid floor viola */}
            <GridFloorPurple position={[0, 0, 0]} width={4} depth={4} divisions={16} />
            
            {/* Floor collider */}
            <RigidBody type="fixed" position={[0, -0.1, 0]}>
                <mesh visible={false}>
                    <boxGeometry args={[4, 0.2, 4]} />
                </mesh>
            </RigidBody>
            
            {/* 7 Laser beams ROSSI che coprono tutta la larghezza */}
            {[-1.8, -1.2, -0.6, 0, 0.6, 1.2, 1.8].map((x, index) => (
                <group key={index}>
                    {/* Laser con collisione - kinematicPosition */}
                    <RigidBody 
                        ref={(el) => laserRefs.current[index] = el}
                        type="kinematicPosition" 
                        position={[x, 1, 0]} 
                        restitution={0.2} 
                        friction={0}
                    >
                        <mesh 
                            geometry={boxGeometry}
                            scale={[0.15, 2, 0.15]}
                            castShadow
                            receiveShadow
                        >
                            <meshBasicMaterial
                                color="#ff0000"
                                transparent
                                opacity={0.8}
                                blending={THREE.AdditiveBlending}
                            />
                        </mesh>
                    </RigidBody>
                    
                    {/* Base glow (solo visivo) */}
                    <mesh position={[x, 0, 0]}>
                        <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
                        <meshStandardMaterial
                            color="#ff0000"
                            emissive="#ff0000"
                            emissiveIntensity={index !== openIndex ? 2 : 0.5}
                        />
                    </mesh>
                    
                    {/* Top glow (solo visivo) */}
                    <mesh position={[x, 2, 0]}>
                        <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
                        <meshStandardMaterial
                            color="#ff0000"
                            emissive="#ff0000"
                            emissiveIntensity={index !== openIndex ? 2 : 0.5}
                        />
                    </mesh>
                </group>
            ))}
        </group>
    )
}

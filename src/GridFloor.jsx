import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Componente per il pavimento grid wireframe
export function GridFloor({ position = [0, 0, 0], width = 4, depth = 4, color = '#ff006e', divisions = 20 }) {
    const gridRef = useRef()
    const glowRef = useRef()

    // Animazione pulsante del glow
    useFrame((state) => {
        const time = state.clock.getElapsedTime()
        if (glowRef.current) {
            glowRef.current.material.opacity = 0.3 + Math.sin(time * 2) * 0.2
        }
    })

    return (
        <group position={position}>
            {/* Piano invisibile per le collisioni */}
            <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[width, depth]} />
                <meshBasicMaterial transparent opacity={0} />
            </mesh>

            {/* Grid wireframe principale */}
            <gridHelper
                ref={gridRef}
                args={[width, divisions, color, color]}
                position={[0, -0.08, 0]}
                material-transparent
                material-opacity={1}
            />

            {/* Layer di glow sotto la griglia */}
            <mesh ref={glowRef} position={[0, -0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[width * 1.1, depth * 1.1]} />
                <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={0.3}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Bordi perimetrali con effetto neon */}
            <lineSegments>
                <edgesGeometry
                    attach="geometry"
                    args={[new THREE.BoxGeometry(width, 0.05, depth)]}
                />
                <lineBasicMaterial
                    attach="material"
                    color={color}
                    linewidth={2}
                    transparent
                    opacity={0.8}
                />
            </lineSegments>
        </group>
    )
}

// Varianti di colore per diversi tipi di floor
export function GridFloorPink(props) {
    return <GridFloor {...props} color="#ff006e" />
}

export function GridFloorPurple(props) {
    return <GridFloor {...props} color="#8338ec" />
}

export function GridFloorCyan(props) {
    return <GridFloor {...props} color="#00f5ff" />
}

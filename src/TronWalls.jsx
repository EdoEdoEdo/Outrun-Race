import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Singolo pannello muro TRON
export function TronWall({ 
    position = [0, 0, 0],
    width = 4,
    height = 1.5,
    depth = 0.1,
    rotation = [0, 0, 0],
    borderColor = '#00f5ff',     // cyan
    lineColor = '#ffa500'        // giallo-arancione
}) {
    const lineRef = useRef()
    
    // Animazione pulsante per la linea centrale
    useFrame((state) => {
        const time = state.clock.getElapsedTime()
        if (lineRef.current) {
            const pulse = 0.8 + Math.sin(time * 3) * 0.2
            lineRef.current.material.emissiveIntensity = 1.5 + pulse * 0.5
        }
    })
    
    // Posizione della linea - usiamo offset Y per farla sporgere dal muro
    // indipendentemente dalla rotazione
    const linePosition = [0, height / 2, depth / 2 + 0.06]
    
    return (
        <group position={position} rotation={rotation}>
            {/* Pannello trasparente scuro */}
            <mesh position={[0, height / 2, 0]}>
                <boxGeometry args={[width, height, depth]} />
                <meshStandardMaterial
                    color="#0a1929"
                    transparent
                    opacity={0.2}
                    metalness={0.9}
                    roughness={0.1}
                />
            </mesh>
            
            {/* Bordo superiore LED cyan */}
            <mesh position={[0, height, 0]}>
                <boxGeometry args={[width, 0.08, depth + 0.02]} />
                <meshStandardMaterial
                    color={borderColor}
                    emissive={borderColor}
                    emissiveIntensity={2.5}
                    toneMapped={false}
                />
            </mesh>
            
            {/* Bordo inferiore LED cyan */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[width, 0.08, depth + 0.02]} />
                <meshStandardMaterial
                    color={borderColor}
                    emissive={borderColor}
                    emissiveIntensity={2.5}
                    toneMapped={false}
                />
            </mesh>
            
            {/* Bordo sinistro LED cyan */}
            <mesh position={[-width / 2, height / 2, 0]}>
                <boxGeometry args={[0.08, height, depth + 0.02]} />
                <meshStandardMaterial
                    color={borderColor}
                    emissive={borderColor}
                    emissiveIntensity={2.5}
                    toneMapped={false}
                />
            </mesh>
            
            {/* Bordo destro LED cyan */}
            <mesh position={[width / 2, height / 2, 0]}>
                <boxGeometry args={[0.08, height, depth + 0.02]} />
                <meshStandardMaterial
                    color={borderColor}
                    emissive={borderColor}
                    emissiveIntensity={2.5}
                    toneMapped={false}
                />
            </mesh>
            
            {/* Linea orizzontale continua giallo-arancione a metà altezza */}
            <mesh 
                ref={lineRef}
                position={linePosition}
            >
                <boxGeometry args={[width - 0.16, 0.1, 0.05]} />
                <meshStandardMaterial
                    color={lineColor}
                    emissive={lineColor}
                    emissiveIntensity={2.5}
                    transparent
                    opacity={1}
                    toneMapped={false}
                />
            </mesh>
        </group>
    )
}

// Muri del tracciato in stile TRON - seguono il percorso come bordi
export function TronTrackWalls({ length = 40, height = 1.5 }) {
    // Calcola quanti segmenti servono (ogni 4 unità)
    const segments = Math.ceil(length / 4)
    
    return (
        <group>
            {/* Muro sinistro - segmenti continui con linea verso destra */}
            {Array.from({ length: segments }).map((_, index) => (
                <TronWallLeft
                    key={`left-${index}`}
                    position={[-2, 0, -index * 4]}
                    width={4}
                    height={height}
                />
            ))}
            
            {/* Muro destro - segmenti continui con linea verso sinistra */}
            {Array.from({ length: segments }).map((_, index) => (
                <TronWallRight
                    key={`right-${index}`}
                    position={[2, 0, -index * 4]}
                    width={4}
                    height={height}
                />
            ))}
            
            {/* Muro finale */}
            <TronWall
                position={[0, 0, -length + 2]}
                width={4}
                height={height}
                depth={0.1}
                rotation={[0, 0, 0]}
            />
        </group>
    )
}

// Muro sinistro - linea posizionata correttamente per la rotazione
function TronWallLeft({ position, width, height }) {
    const lineRef = useRef()
    
    useFrame((state) => {
        const time = state.clock.getElapsedTime()
        if (lineRef.current) {
            const pulse = 0.8 + Math.sin(time * 3) * 0.2
            lineRef.current.material.emissiveIntensity = 1.5 + pulse * 0.5
        }
    })
    
    const depth = 0.1
    const borderColor = '#00f5ff'
    const lineColor = '#ffa500'
    
    return (
        <group position={position} rotation={[0, Math.PI / 2, 0]}>
            {/* Pannello trasparente scuro */}
            <mesh position={[0, height / 2, 0]}>
                <boxGeometry args={[width, height, depth]} />
                <meshStandardMaterial
                    color="#0a1929"
                    transparent
                    opacity={0.2}
                    metalness={0.9}
                    roughness={0.1}
                />
            </mesh>
            
            {/* Bordi LED cyan */}
            <mesh position={[0, height, 0]}>
                <boxGeometry args={[width, 0.08, depth + 0.02]} />
                <meshStandardMaterial color={borderColor} emissive={borderColor} emissiveIntensity={2.5} toneMapped={false} />
            </mesh>
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[width, 0.08, depth + 0.02]} />
                <meshStandardMaterial color={borderColor} emissive={borderColor} emissiveIntensity={2.5} toneMapped={false} />
            </mesh>
            <mesh position={[-width / 2, height / 2, 0]}>
                <boxGeometry args={[0.08, height, depth + 0.02]} />
                <meshStandardMaterial color={borderColor} emissive={borderColor} emissiveIntensity={2.5} toneMapped={false} />
            </mesh>
            <mesh position={[width / 2, height / 2, 0]}>
                <boxGeometry args={[0.08, height, depth + 0.02]} />
                <meshStandardMaterial color={borderColor} emissive={borderColor} emissiveIntensity={2.5} toneMapped={false} />
            </mesh>
            
            {/* Linea gialla - posizione che funziona con questa rotazione */}
            <mesh ref={lineRef} position={[0, height / 2, depth / 2 + 0.06]}>
                <boxGeometry args={[width - 0.16, 0.1, 0.05]} />
                <meshStandardMaterial
                    color={lineColor}
                    emissive={lineColor}
                    emissiveIntensity={2.5}
                    toneMapped={false}
                />
            </mesh>
        </group>
    )
}

// Muro destro - linea posizionata nell'altro verso
function TronWallRight({ position, width, height }) {
    const lineRef = useRef()
    
    useFrame((state) => {
        const time = state.clock.getElapsedTime()
        if (lineRef.current) {
            const pulse = 0.8 + Math.sin(time * 3) * 0.2
            lineRef.current.material.emissiveIntensity = 1.5 + pulse * 0.5
        }
    })
    
    const depth = 0.1
    const borderColor = '#00f5ff'
    const lineColor = '#ffa500'
    
    return (
        <group position={position} rotation={[0, Math.PI / 2, 0]}>
            {/* Pannello trasparente scuro */}
            <mesh position={[0, height / 2, 0]}>
                <boxGeometry args={[width, height, depth]} />
                <meshStandardMaterial
                    color="#0a1929"
                    transparent
                    opacity={0.2}
                    metalness={0.9}
                    roughness={0.1}
                />
            </mesh>
            
            {/* Bordi LED cyan */}
            <mesh position={[0, height, 0]}>
                <boxGeometry args={[width, 0.08, depth + 0.02]} />
                <meshStandardMaterial color={borderColor} emissive={borderColor} emissiveIntensity={2.5} toneMapped={false} />
            </mesh>
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[width, 0.08, depth + 0.02]} />
                <meshStandardMaterial color={borderColor} emissive={borderColor} emissiveIntensity={2.5} toneMapped={false} />
            </mesh>
            <mesh position={[-width / 2, height / 2, 0]}>
                <boxGeometry args={[0.08, height, depth + 0.02]} />
                <meshStandardMaterial color={borderColor} emissive={borderColor} emissiveIntensity={2.5} toneMapped={false} />
            </mesh>
            <mesh position={[width / 2, height / 2, 0]}>
                <boxGeometry args={[0.08, height, depth + 0.02]} />
                <meshStandardMaterial color={borderColor} emissive={borderColor} emissiveIntensity={2.5} toneMapped={false} />
            </mesh>
            
            {/* Linea gialla - posizione invertita per il muro destro */}
            <mesh ref={lineRef} position={[0, height / 2, -(depth / 2 + 0.06)]}>
                <boxGeometry args={[width - 0.16, 0.1, 0.05]} />
                <meshStandardMaterial
                    color={lineColor}
                    emissive={lineColor}
                    emissiveIntensity={2.5}
                    toneMapped={false}
                />
            </mesh>
        </group>
    )
}

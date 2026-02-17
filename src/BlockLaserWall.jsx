import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { GridFloorPurple } from './GridFloor.jsx';

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

export function BlockLaserWall({ position = [0, 0, 0] }) {
    const wallRef = useRef();
    const [isActive, setIsActive] = useState(true);

    useFrame((state) => {
        const time = state.clock.elapsedTime;

        // Pattern on/off ogni 3 secondi
        const cycle = Math.floor(time / 3) % 2;
        const newActive = cycle === 0;

        if (newActive !== isActive) {
            setIsActive(newActive);
        }

        // Quando attivo: posizione normale
        // Quando spento: spostato lontano (fuori scena)
        if (wallRef.current) {
            const yPos = isActive ? 1 : -100; // Sposta giù quando spento
            wallRef.current.setNextKinematicTranslation({
                x: position[0],
                y: position[1] + yPos,
                z: position[2],
            });
        }
    });

    return (
        <group position={position}>
            {/* Grid floor viola */}
            <GridFloorPurple
                position={[0, 0, 0]}
                width={4}
                depth={4}
                divisions={16}
            />

            {/* Floor collider */}
            <RigidBody type="fixed" position={[0, -0.1, 0]}>
                <mesh visible={false}>
                    <boxGeometry args={[4, 0.2, 4]} />
                </mesh>
            </RigidBody>

            {/* Parete laser - kinematicPosition come gli altri ostacoli */}
            <RigidBody
                ref={wallRef}
                type="kinematicPosition"
                position={[0, 1, 0]}
                restitution={0.2}
                friction={0}
            >
                <mesh
                    geometry={boxGeometry}
                    scale={[3.5, 2.5, 0.3]}
                    castShadow
                    receiveShadow
                >
                    <meshBasicMaterial
                        color="#ff006e"
                        transparent
                        opacity={0.7}
                        blending={THREE.AdditiveBlending}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            </RigidBody>

            {/* Emitters laterali (solo visivi) */}
            <mesh position={[-1.8, 1.1, 0]}>
                <boxGeometry args={[0.15, 2.5, 0.15]} />
                <meshStandardMaterial
                    color="#ff006e"
                    emissive="#ff006e"
                    emissiveIntensity={isActive ? 3 : 0.5}
                />
            </mesh>

            <mesh position={[1.8, 1.1, 0]}>
                <boxGeometry args={[0.15, 2.5, 0.15]} />
                <meshStandardMaterial
                    color="#ff006e"
                    emissive="#ff006e"
                    emissiveIntensity={isActive ? 3 : 0.5}
                />
            </mesh>
        </group>
    );
}

import * as THREE from 'three';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { useMemo, useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import { GridFloorPink, GridFloorPurple } from './GridFloor.jsx';
import { TronTrackWalls } from './TronWalls.jsx';
import { BlockLaserGate } from './BlockLaserGate.jsx';
import { BlockLaserWall } from './BlockLaserWall.jsx';

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

// 🎨 VAPORWAVE COLOR PALETTE
const colors = {
    neonPink: '#ff006e',
    neonPurple: '#8338ec',
    neonBlue: '#3a86ff',
    neonOrange: '#fb5607',
    darkPurple: '#1a0033',
    hotPink: '#ff006e',
    cyan: '#00f5ff',
};

// Materiali per ostacoli (più cristallini e geometrici)
const obstacleMaterial = new THREE.MeshStandardMaterial({
    color: colors.neonOrange,
    emissive: colors.neonOrange,
    emissiveIntensity: 1.2,
    roughness: 0.1,
    metalness: 1,
    transparent: true,
    opacity: 0.9,
});

// Materiali per i muri - ora più trasparenti e wireframe-style
const wallMaterial = new THREE.MeshStandardMaterial({
    color: colors.neonBlue,
    emissive: colors.neonBlue,
    emissiveIntensity: 0.5,
    roughness: 0.3,
    metalness: 0.8,
    transparent: true,
    opacity: 0.4,
    wireframe: true,
});

export function BlockStart({ position = [0, 0, 0] }) {
    return (
        <group position={position}>
            <Float floatIntensity={0.25} rotationIntensity={0.25}>
                <Text
                    font="bebas-neue-v9-latin-regular.woff"
                    scale={0.5}
                    maxWidth={0.25}
                    lineHeight={0.75}
                    textAlign="right"
                    position={[0.75, 0.65, 0]}
                    rotation-y={-0.25}
                >
                    OUTRUN RACE
                    <meshBasicMaterial toneMapped={true} color={colors.white} />
                </Text>
            </Float>

            {/* Grid floor invece del blocco solido */}
            <GridFloorPink
                position={[0, 0, 0]}
                width={4}
                depth={4}
                divisions={16}
            />

            {/* Collider invisibile per la fisica */}
            <RigidBody type="fixed" position={[0, -0.1, 0]}>
                <mesh visible={false}>
                    <boxGeometry args={[4, 0.2, 4]} />
                </mesh>
            </RigidBody>
        </group>
    );
}

export function BlockEnd({ position = [0, 0, 0] }) {
    return (
        <group position={position}>
            <Text
                font="bebas-neue-v9-latin-regular.woff"
                scale={1}
                position={[0, 2.25, 2]}
            >
                FINISH
                <meshBasicMaterial toneMapped={false} color={colors.white} />
            </Text>

            {/* Grid floor */}
            <GridFloorPink
                position={[0, 0, 0]}
                width={4}
                depth={4}
                divisions={16}
            />

            {/* Collider */}
            <RigidBody type="fixed" position={[0, -0.1, 0]}>
                <mesh visible={false}>
                    <boxGeometry args={[4, 0.2, 4]} />
                </mesh>
            </RigidBody>
        </group>
    );
}

export function BlockSpinner({ position = [0, 0, 0] }) {
    const obstacle = useRef();
    const [speed] = useState(
        () => (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1),
    );

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const rotation = new THREE.Quaternion();
        rotation.setFromEuler(new THREE.Euler(0, time * speed, 0));
        obstacle.current.setNextKinematicRotation(rotation);
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

            {/* Collider */}
            <RigidBody type="fixed" position={[0, -0.1, 0]}>
                <mesh visible={false}>
                    <boxGeometry args={[4, 0.2, 4]} />
                </mesh>
            </RigidBody>

            {/* Ostacolo rotante - ora più geometrico */}
            <RigidBody
                ref={obstacle}
                type="kinematicPosition"
                position={[0, 0.3, 0]}
                restitution={0.2}
                friction={0}
            >
                <mesh
                    geometry={boxGeometry}
                    material={obstacleMaterial}
                    scale={[3.5, 0.3, 0.3]}
                    castShadow
                    receiveShadow
                />
            </RigidBody>
        </group>
    );
}

export function BlockLimbo({ position = [0, 0, 0] }) {
    const obstacle = useRef();
    const [timeOffset] = useState(() => Math.random() * Math.PI * 2);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const y = Math.sin(time + timeOffset) + 1.15;
        obstacle.current.setNextKinematicTranslation({
            x: position[0],
            y: position[1] + y,
            z: position[2],
        });
    });

    return (
        <group position={position}>
            <GridFloorPurple
                position={[0, 0, 0]}
                width={4}
                depth={4}
                divisions={16}
            />

            <RigidBody type="fixed" position={[0, -0.1, 0]}>
                <mesh visible={false}>
                    <boxGeometry args={[4, 0.2, 4]} />
                </mesh>
            </RigidBody>

            <RigidBody
                ref={obstacle}
                type="kinematicPosition"
                position={[0, 0.3, 0]}
                restitution={0.2}
                friction={0}
            >
                <mesh
                    geometry={boxGeometry}
                    material={obstacleMaterial}
                    scale={[3.5, 0.3, 0.3]}
                    castShadow
                    receiveShadow
                />
            </RigidBody>
        </group>
    );
}

export function BlockAxe({ position = [0, 0, 0] }) {
    const obstacle = useRef();
    const [timeOffset] = useState(() => Math.random() * Math.PI * 2);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const x = Math.sin(time + timeOffset) * 1.25;
        obstacle.current.setNextKinematicTranslation({
            x: position[0] + x,
            y: position[1] + 0.75,
            z: position[2],
        });
    });

    return (
        <group position={position}>
            <GridFloorPurple
                position={[0, 0, 0]}
                width={4}
                depth={4}
                divisions={16}
            />

            <RigidBody type="fixed" position={[0, -0.1, 0]}>
                <mesh visible={false}>
                    <boxGeometry args={[4, 0.2, 4]} />
                </mesh>
            </RigidBody>

            <RigidBody
                ref={obstacle}
                type="kinematicPosition"
                position={[0, 0.3, 0]}
                restitution={0.2}
                friction={0}
            >
                <mesh
                    geometry={boxGeometry}
                    material={obstacleMaterial}
                    scale={[1.5, 1.5, 0.3]}
                    castShadow
                    receiveShadow
                />
            </RigidBody>
        </group>
    );
}

function Bounds({ length = 1 }) {
    // Calcola quanti segmenti di muro ci sono
    const segments = Math.ceil((length * 4) / 4);

    return (
        <RigidBody type="fixed" restitution={0.2} friction={0}>
            {/* Collider floor invisibile */}
            <CuboidCollider
                args={[2, 0.1, 2 * length]}
                position={[0, -0.1, -(length * 2) + 2]}
                restitution={0.2}
                friction={1}
            />

            {/* Collider muro sinistro - segmenti per tutta la lunghezza */}
            {Array.from({ length: segments }).map((_, index) => (
                <CuboidCollider
                    key={`left-collider-${index}`}
                    args={[0.1, 0.75, 2]}
                    position={[-2, 0.75, -index * 4]}
                    restitution={0.2}
                    friction={0}
                />
            ))}

            {/* Collider muro destro - segmenti per tutta la lunghezza */}
            {Array.from({ length: segments }).map((_, index) => (
                <CuboidCollider
                    key={`right-collider-${index}`}
                    args={[0.1, 0.75, 2]}
                    position={[2, 0.75, -index * 4]}
                    restitution={0.2}
                    friction={0}
                />
            ))}

            {/* Collider muro finale */}
            <CuboidCollider
                args={[2, 0.75, 0.1]}
                position={[0, 0.75, -(length * 4) + 2]}
                restitution={0.2}
                friction={0}
            />
        </RigidBody>
    );
}

export function Level({
    count = 10,
    types = [
        BlockSpinner,
        BlockAxe,
        BlockLimbo,
        BlockLaserGate,
        BlockLaserWall,
    ],
    seed = 0,
}) {
    const blocks = useMemo(() => {
        const blocks = [];

        for (let i = 0; i < count; i++) {
            const type = types[Math.floor(Math.random() * types.length)];
            blocks.push(type);
        }

        return blocks;
    }, [count, types, seed]);

    // Calcola la lunghezza totale del tracciato
    const trackLength = (count + 2) * 4;

    return (
        <>
            <BlockStart position={[0, 0, 0]} />

            {blocks.map((Block, index) => (
                <Block key={index} position={[0, 0, -(index + 1) * 4]} />
            ))}

            <BlockEnd position={[0, 0, -(count + 1) * 4]} />

            <Bounds length={count + 2} />

            {/* Muri TRON-style con LED cyan e pattern arancioni */}
            <TronTrackWalls length={trackLength} height={1.5} />
        </>
    );
}

import { useRapier, RigidBody } from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'
import useGame from './stores/useGame.jsx'

// Holographic Shader
const holographicVertexShader = `
uniform float uTime;

varying vec3 vPosition;
varying vec3 vNormal;

// Random function
float random2D(vec2 value)
{
    return fract(sin(dot(value.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main()
{
    // Position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Glitch
    float glitchTime = uTime - modelPosition.y;
    float glitchStrength = sin(glitchTime) + sin(glitchTime * 3.45) + sin(glitchTime * 8.76);
    glitchStrength /= 3.0;
    glitchStrength = smoothstep(0.3, 1.0, glitchStrength);
    glitchStrength *= 0.25;
    modelPosition.x += (random2D(modelPosition.xz + uTime) - 0.5) * glitchStrength;
    modelPosition.z += (random2D(modelPosition.zx + uTime) - 0.5) * glitchStrength;

    // Final position
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    // Model normal
    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);

    // Varyings
    vPosition = modelPosition.xyz;
    vNormal = modelNormal.xyz;
}
`

const holographicFragmentShader = `
uniform vec3 uColor;
uniform float uTime;

varying vec3 vPosition;
varying vec3 vNormal;

void main()
{
    // Normal
    vec3 normal = normalize(vNormal);
    if(!gl_FrontFacing)
        normal *= - 1.0;

    // Stripes
    float stripes = mod((vPosition.y - uTime * 0.02) * 20.0, 1.0);
    stripes = pow(stripes, 3.0);

    // Fresnel
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    float fresnel = dot(viewDirection, normal) + 1.0;
    fresnel = pow(fresnel, 2.0);

    // Falloff
    float falloff = smoothstep(0.8, 0.2, fresnel);

    // Holographic
    float holographic = stripes * fresnel;
    holographic += fresnel * 1.25;
    holographic *= falloff;

    // Final color
    gl_FragColor = vec4(uColor, holographic);
}
`

export default function Player()
{
    const body = useRef()
    const materialRef = useRef()
    const [ subscribeKeys, getKeys ] = useKeyboardControls()
    const { rapier, world } = useRapier()
    const [ smoothedCameraPosition ] = useState(() => new THREE.Vector3(10, 10, 10))
    const [ smoothedCameraTarget ] = useState(() => new THREE.Vector3())
    const start = useGame((state) => state.start)
    const end = useGame((state) => state.end)
    const restart = useGame((state) => state.restart)
    const blocksCount = useGame((state) => state.blocksCount)
    const mobileControls = useGame((state) => state.mobileControls)
    const mobileJump = useGame((state) => state.mobileJump)
    
    // Speed boost state
    const [speedMultiplier, setSpeedMultiplier] = useState(1)
    const boostTimeoutRef = useRef(null)
    const lastJumpTimeRef = useRef(0)
    
    // Mobile detection for camera distance
    const [isMobile, setIsMobile] = useState(false)
    
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // Holographic material
    const holographicMaterial = new THREE.ShaderMaterial({
        vertexShader: holographicVertexShader,
        fragmentShader: holographicFragmentShader,
        uniforms: {
            uTime: { value: 0 },
            uColor: { value: new THREE.Color('#00d4ff') }
        },
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    })

    const jump = () =>
    {
        const origin = body.current.translation()
        origin.y -= 0.31
        const direction = { x: 0, y: - 1, z: 0 }
        const ray = new rapier.Ray(origin, direction)
        const hit = world.castRay(ray, 10, true)

        if(hit.timeOfImpact < 0.15)
        {
            body.current.applyImpulse({ x: 0, y: 0.5, z: 0 })
        }
    }
    
    const reset = () =>
    {
        body.current.setTranslation({ x: 0, y: 1, z: 0 })
        body.current.setLinvel({ x: 0, y: 0, z: 0 })
        body.current.setAngvel({ x: 0, y: 0, z: 0 })
        setSpeedMultiplier(1)
    }

    useEffect(() =>
    {
        const unsubscribeReset = useGame.subscribe(
            (state) => state.phase,
            (value) =>
            {
                if(value === 'ready')
                    reset()
            }
        )

        const unsubscribeJump = subscribeKeys(
            (state) => state.jump,
            (value) =>
            {
                if(value)
                    jump()
            }
        )

        const unsubscribeAny = subscribeKeys(
            () =>
            {
                start()
            }
        )
        
        // Listen for speed boost events from Energy Rings
        const handleSpeedBoost = (event) => {
            const { duration, multiplier } = event.detail
            
            setSpeedMultiplier(multiplier)
            
            // Clear existing timeout
            if (boostTimeoutRef.current) {
                clearTimeout(boostTimeoutRef.current)
            }
            
            // Reset after duration
            boostTimeoutRef.current = setTimeout(() => {
                setSpeedMultiplier(1)
            }, duration)
        }
        
        window.addEventListener('speedBoost', handleSpeedBoost)

        return () =>
        {
            unsubscribeReset()
            unsubscribeJump()
            unsubscribeAny()
            window.removeEventListener('speedBoost', handleSpeedBoost)
            if (boostTimeoutRef.current) {
                clearTimeout(boostTimeoutRef.current)
            }
        }
    }, [])

    useFrame((state, delta) =>
    {
        /**
         * Update holographic shader time
         */
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
            
            // Cambia colore quando boosted
            if (speedMultiplier > 1) {
                materialRef.current.uniforms.uColor.value.set('#00ff00') // Verde
            } else {
                materialRef.current.uniforms.uColor.value.set('#00d4ff') // Cyan
            }
        }

        /**
         * Controls - keyboard or mobile/gyroscope
         */
        const phase = useGame.getState().phase
        
        // Disabilita controlli al FINISH (phase='ended')
        if (phase === 'ended') {
            // Controlli disabilitati - la palla continua con fisica ma non puoi muoverla
            // La musica continua a suonare!
        } else {
            // Controlli attivi solo durante 'ready' e 'playing'
            const keyboardKeys = getKeys()
            
            // Merge keyboard (boolean) and mobile/gyroscope (analog 0-1) controls
            const forward = keyboardKeys.forward || (mobileControls?.forward || 0)
            const backward = keyboardKeys.backward || (mobileControls?.backward || 0)
            const leftward = keyboardKeys.leftward || (mobileControls?.leftward || 0)
            const rightward = keyboardKeys.rightward || (mobileControls?.rightward || 0)

            // Handle mobile jump with cooldown
            if (mobileJump) {
                const now = Date.now()
                if (now - lastJumpTimeRef.current > 300) { // 300ms cooldown
                    jump()
                    lastJumpTimeRef.current = now
                }
            }

            const impulse = { x: 0, y: 0, z: 0 }
            const torque = { x: 0, y: 0, z: 0 }

            // Apply speed multiplier
            const impulseStrength = 0.6 * delta * speedMultiplier
            const torqueStrength = 0.2 * delta * speedMultiplier

            // Support both boolean (keyboard) and analog (gyro) values
            const forwardValue = typeof forward === 'boolean' ? (forward ? 1 : 0) : forward
            const backwardValue = typeof backward === 'boolean' ? (backward ? 1 : 0) : backward
            const leftValue = typeof leftward === 'boolean' ? (leftward ? 1 : 0) : leftward
            const rightValue = typeof rightward === 'boolean' ? (rightward ? 1 : 0) : rightward

            if(forwardValue > 0)
            {
                impulse.z -= impulseStrength * forwardValue
                torque.x -= torqueStrength * forwardValue
            }

            if(rightValue > 0)
            {
                impulse.x += impulseStrength * rightValue
                torque.z -= torqueStrength * rightValue
            }

            if(backwardValue > 0)
            {
                impulse.z += impulseStrength * backwardValue
                torque.x += torqueStrength * backwardValue
            }
            
            if(leftValue > 0)
            {
                impulse.x -= impulseStrength * leftValue
                torque.z += torqueStrength * leftValue
            }

            body.current.applyImpulse(impulse)
            body.current.applyTorqueImpulse(torque)
        }

        /**
         * Camera
         */
        const bodyPosition = body.current.translation()
    
        const cameraPosition = new THREE.Vector3()
        cameraPosition.copy(bodyPosition)
        
        // Mobile: camera più lontana per view migliore
        // Desktop: camera normale
        if (isMobile) {
            cameraPosition.z += 3.5  // +1.25 rispetto a desktop (era 2.25)
            cameraPosition.y += 1.2  // +0.55 rispetto a desktop (era 0.65)
        } else {
            cameraPosition.z += 2.25
            cameraPosition.y += 0.65
        }

        const cameraTarget = new THREE.Vector3()
        cameraTarget.copy(bodyPosition)
        cameraTarget.y += 0.25

        smoothedCameraPosition.lerp(cameraPosition, 5 * delta)
        smoothedCameraTarget.lerp(cameraTarget, 5 * delta)

        state.camera.position.copy(smoothedCameraPosition)
        state.camera.lookAt(smoothedCameraTarget)

        /**
        * Phases
        */
        if(bodyPosition.z < - (blocksCount * 4 + 2))
            end()

        if(bodyPosition.y < - 4)
            restart()
    })

    return (
        <RigidBody
            ref={ body }
            canSleep={ false }
            colliders="ball"
            restitution={ 0.2 }
            friction={ 1 } 
            linearDamping={ 0.5 }
            angularDamping={ 0.5 }
            position={ [ 0, 1, 0 ] }
        >
            {/* Icosahedron olografico */}
            <mesh castShadow material={holographicMaterial}>
                <icosahedronGeometry args={ [ 0.3, 1 ] } />
                <primitive 
                    object={holographicMaterial} 
                    attach="material" 
                    ref={materialRef} 
                />
            </mesh>
        </RigidBody>
    )
}

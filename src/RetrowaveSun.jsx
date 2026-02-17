import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Shader semplificato per strisce più marcate
const stripedSunShader = {
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float stripeCount;
        varying vec2 vUv;
        
        void main() {
            // Gradient dall'alto verso il basso
            float gradientMix = vUv.y;
            vec3 gradientColor = mix(bottomColor, topColor, gradientMix);
            
            // Strisce solo nella parte inferiore (metà sotto)
            float stripeY = vUv.y;
            float alpha = 1.0;
            
            if (stripeY < 0.5) {
                // Strisce nella metà inferiore
                float stripePattern = step(0.5, fract(stripeY * stripeCount));
                alpha = stripePattern > 0.5 ? 1.0 : 0.0;
            }
            
            gl_FragColor = vec4(gradientColor, alpha);
        }
    `
}

export function RetrowaveSun({ 
    position = [0, 8, -30], 
    scale = 8,
    topColor = '#ffd60a',     // giallo/oro
    bottomColor = '#ff006e',  // rosa/magenta
    stripes = 8 
}) {
    const sunRef = useRef()

    return (
        <group position={position}>
            {/* Sole principale con strisce */}
            <mesh ref={sunRef}>
                <circleGeometry args={[scale, 64]} />
                <shaderMaterial
                    uniforms={{
                        topColor: { value: new THREE.Color(topColor) },
                        bottomColor: { value: new THREE.Color(bottomColor) },
                        stripeCount: { value: stripes }
                    }}
                    vertexShader={stripedSunShader.vertexShader}
                    fragmentShader={stripedSunShader.fragmentShader}
                    transparent
                    side={THREE.DoubleSide}
                />
            </mesh>
            
            {/* Glow grande attorno */}
            <mesh>
                <circleGeometry args={[scale * 1.2, 64]} />
                <meshBasicMaterial
                    color={topColor}
                    transparent
                    opacity={0.1}
                    blending={THREE.AdditiveBlending}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </group>
    )
}


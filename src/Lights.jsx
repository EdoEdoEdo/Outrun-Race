import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function Lights()
{
    const light = useRef()
    
    useFrame((state) =>
    {
        light.current.position.z = state.camera.position.z + 1 - 4
        light.current.target.position.z = state.camera.position.z - 4
        light.current.target.updateMatrixWorld()
    })

    return <>
        {/* Main directional light con tinta magenta */}
        <directionalLight
            ref={ light }
            castShadow
            position={ [ 4, 4, 1 ] }
            intensity={ 3 }
            color="#ff006e"
            shadow-mapSize={ [ 1024, 1024 ] }
            shadow-camera-near={ 1 }
            shadow-camera-far={ 10 }
            shadow-camera-top={ 10 }
            shadow-camera-right={ 10 }
            shadow-camera-bottom={ - 10 }
            shadow-camera-left={ - 10 }
        />
        
        {/* Ambient light con tinta viola per atmosfera */}
        <ambientLight intensity={ 0.8 } color="#8338ec" />
        
        {/* Punto luce cyan per highlight */}
        <pointLight position={[0, 5, 0]} intensity={2} color="#00f5ff" distance={20} />
    </>
}

import { Physics } from '@react-three/rapier'
import useGame from './stores/useGame.jsx'
import Lights from './Lights.jsx'
import { Level } from './Level.jsx'
import Player from './Player.jsx'
import { RetrowaveSun } from './RetrowaveSun.jsx'

export default function Experience()
{
    const blocksCount = useGame((state) => state.blocksCount)
    const blocksSeed = useGame(state => state.blocksSeed)

    return <>
        {/* Vaporwave gradient background */}
        <color args={ [ '#0a0015' ] } attach="background" />
        
        {/* Fog per profondità atmosferica */}
        <fog attach="fog" args={['#0a0015', 15, 60]} />

        {/* Sole retrowave a strisce - più alto e più lontano */}
        <RetrowaveSun 
            position={[0, 10, -60]} 
            scale={12} 
            topColor="#ffd60a" 
            bottomColor="#d90368"
            stripes={8}
        />

        <Physics debug={ false }>
            <Lights />
            <Level count={ blocksCount } seed={ blocksSeed } />
            <Player />
        </Physics>

    </>
}

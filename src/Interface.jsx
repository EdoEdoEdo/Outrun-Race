import { useKeyboardControls } from '@react-three/drei'
import useGame from './stores/useGame.jsx'
import { useEffect, useRef, useState } from 'react'
import { addEffect } from '@react-three/fiber'
import GyroscopeControls from './GyroscopeControls.jsx'

export default function Interface()
{
    const time = useRef()
    const [isMobile, setIsMobile] = useState(false)

    const restart = useGame((state) => state.restart)
    const phase = useGame((state) => state.phase)
    const start = useGame((state) => state.start)
    const jump = useGame((state) => state.jump)

    const forward = useKeyboardControls((state) => state.forward)
    const backward = useKeyboardControls((state) => state.backward)
    const leftward = useKeyboardControls((state) => state.leftward)
    const rightward = useKeyboardControls((state) => state.rightward)
    const jumpKey = useKeyboardControls((state) => state.jump)

    // Detect mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    useEffect(() =>
    {
        const unsubscribeEffect = addEffect(() =>
        {
            const state = useGame.getState()

            let elapsedTime = 0

            if(state.phase === 'playing')
                elapsedTime = Date.now() - state.startTime
            else if(state.phase === 'ended')
                elapsedTime = state.endTime - state.startTime

            elapsedTime /= 1000
            elapsedTime = elapsedTime.toFixed(2)

            if(time.current)
                time.current.textContent = elapsedTime
        })

        return () =>
        {
            unsubscribeEffect()
        }
    }, [])

    // Handle mobile/gyroscope controls (analog values 0-1)
    const handleMobileMove = (moveState) => {
        // Trigger game start on first move
        const hasMovement = moveState.forward > 0.1 || moveState.backward > 0.1 || 
                           moveState.leftward > 0.1 || moveState.rightward > 0.1
        
        if (phase === 'ready' && hasMovement) {
            start()
        }
        
        // Store move state for Player to read (analog values)
        useGame.setState({ mobileControls: moveState })
    }

    const handleMobileJump = () => {
        // Trigger game start
        if (phase === 'ready') {
            start()
        }
        
        // Trigger jump
        useGame.setState({ mobileJump: true })
        // Reset jump after a frame
        setTimeout(() => {
            useGame.setState({ mobileJump: false })
        }, 50)
    }

    return <>
        <div className="interface">
            {/* Time */}
            <div ref={ time } className="time">0.00</div>

            {/* Restart */}
            { phase === 'ended' && <div className="restart" onClick={ restart }>Restart</div> }

            {/* Desktop Controls - hidden on mobile */}
            {!isMobile && (
                <div className="controls">
                    <div className="raw">
                        <div className={ `key ${ forward ? 'active' : '' }` }></div>
                    </div>
                    <div className="raw">
                        <div className={ `key ${ leftward ? 'active' : '' }` }></div>
                        <div className={ `key ${ backward ? 'active' : '' }` }></div>
                        <div className={ `key ${ rightward ? 'active' : '' }` }></div>
                    </div>
                    <div className="raw">
                        <div className={ `key large ${ jumpKey ? 'active' : '' }` }></div>
                    </div>
                </div>
            )}
        </div>

        {/* Gyroscope Controls - shown only on mobile */}
        {isMobile && (
            <GyroscopeControls 
                onMove={handleMobileMove}
                onJump={handleMobileJump}
            />
        )}
    </>
}

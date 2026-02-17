import { useEffect, useRef, useState } from 'react'
import './GyroscopeControls.css'

export default function GyroscopeControls({ onMove, onJump }) {
    const [isGyroActive, setIsGyroActive] = useState(false)
    const [gyroSupported, setGyroSupported] = useState(false)
    const [needsPermission, setNeedsPermission] = useState(false)
    const moveState = useRef({ forward: 0, backward: 0, leftward: 0, rightward: 0 })
    const calibrationRef = useRef({ beta: 0, gamma: 0 })
    const jumpCooldownRef = useRef(false)

    useEffect(() => {
        // Check if DeviceOrientation is supported
        if (window.DeviceOrientationEvent) {
            setGyroSupported(true)
            
            // Check if permission is needed (iOS 13+)
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                setNeedsPermission(true)
            } else {
                // Android or older iOS - start directly
                startGyroscope()
            }
        }
    }, [])

    const requestPermission = async () => {
        try {
            const permission = await DeviceOrientationEvent.requestPermission()
            if (permission === 'granted') {
                setNeedsPermission(false)
                startGyroscope()
            }
        } catch (error) {
            console.error('Permission denied:', error)
        }
    }

    const startGyroscope = () => {
        setIsGyroActive(true)
        
        // Calibrate on first read
        let isCalibrated = false
        
        const handleOrientation = (event) => {
            // beta: front-to-back tilt (-180 to 180)
            // gamma: left-to-right tilt (-90 to 90)
            let beta = event.beta || 0  // Forward/backward
            let gamma = event.gamma || 0  // Left/right
            
            // Calibrate on first read (assume device is held upright)
            if (!isCalibrated) {
                calibrationRef.current = { beta, gamma }
                isCalibrated = true
                return
            }
            
            // Apply calibration offset
            beta -= calibrationRef.current.beta
            gamma -= calibrationRef.current.gamma
            
            // Threshold and sensitivity
            const threshold = 5  // degrees
            const maxTilt = 30   // max degrees for full speed
            
            // Calculate normalized values (-1 to 1)
            let forwardValue = 0
            let backwardValue = 0
            let leftValue = 0
            let rightValue = 0
            
            // Forward/Backward from beta
            if (beta < -threshold) {
                // Tilting forward
                forwardValue = Math.min(Math.abs(beta) / maxTilt, 1)
            } else if (beta > threshold) {
                // Tilting backward
                backwardValue = Math.min(Math.abs(beta) / maxTilt, 1)
            }
            
            // Left/Right from gamma
            if (gamma < -threshold) {
                // Tilting left
                leftValue = Math.min(Math.abs(gamma) / maxTilt, 1)
            } else if (gamma > threshold) {
                // Tilting right
                rightValue = Math.min(Math.abs(gamma) / maxTilt, 1)
            }
            
            // Update state with analog values
            const newState = {
                forward: forwardValue,
                backward: backwardValue,
                leftward: leftValue,
                rightward: rightValue
            }
            
            moveState.current = newState
            if (onMove) onMove(newState)
        }
        
        window.addEventListener('deviceorientation', handleOrientation)
        
        return () => {
            window.removeEventListener('deviceorientation', handleOrientation)
        }
    }

    const recalibrate = () => {
        calibrationRef.current = { beta: 0, gamma: 0 }
        setIsGyroActive(false)
        setTimeout(() => startGyroscope(), 100)
    }

    const handleJumpTouch = (e) => {
        // Non serve preventDefault per jump button
        
        // Prevent multiple jumps - 200ms cooldown
        if (jumpCooldownRef.current) return
        
        jumpCooldownRef.current = true
        if (onJump) onJump()
        
        setTimeout(() => {
            jumpCooldownRef.current = false
        }, 200)
    }

    if (!gyroSupported) {
        return (
            <div className="gyroscope-controls">
                <div className="gyro-message">
                    Gyroscope not supported on this device
                </div>
            </div>
        )
    }

    return (
        <div className="gyroscope-controls">
            {/* Permission request for iOS */}
            {needsPermission && (
                <div className="permission-overlay">
                    <button className="permission-button" onClick={requestPermission}>
                        Enable Gyroscope
                    </button>
                </div>
            )}
            
            {/* Gyroscope indicator */}
            <div className="gyro-indicator">
                <div className={`gyro-status ${isGyroActive ? 'active' : ''}`}>
                    {isGyroActive ? '📱 GYRO ACTIVE' : '📱 GYRO OFF'}
                </div>
                {isGyroActive && (
                    <button className="recalibrate-button" onClick={recalibrate}>
                        ⚙️ RECALIBRATE
                    </button>
                )}
            </div>
            
            {/* Jump Button */}
            <div className="jump-container">
                <button 
                    className="jump-button"
                    onTouchStart={handleJumpTouch}
                >
                    JUMP
                </button>
            </div>
            
            {/* Instructions */}
            <div className="gyro-instructions">
                🎮 Tilt device to move • Tap to jump
            </div>
        </div>
    )
}

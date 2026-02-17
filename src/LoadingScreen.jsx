import { useState, useEffect } from 'react';
import './LoadingScreen.css';

export default function LoadingScreen({ onStart }) {
    const [isStarting, setIsStarting] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);

    useEffect(() => {
        if (isStarting) {
            // Simula loading in 2 secondi
            const duration = 2000;
            const steps = 60;
            const increment = 100 / steps;
            let currentProgress = 0;

            const interval = setInterval(() => {
                currentProgress += increment;
                if (currentProgress >= 100) {
                    currentProgress = 100;
                    clearInterval(interval);
                    // Aspetta un attimo poi avvia il gioco
                    setTimeout(() => {
                        onStart();
                    }, 200);
                }
                setLoadingProgress(currentProgress);
            }, duration / steps);

            return () => clearInterval(interval);
        }
    }, [isStarting, onStart]);

    const handleStart = () => {
        setIsStarting(true);
    };

    return (
        <div
            className={`loading-screen ${loadingProgress >= 100 ? 'fade-out' : ''}`}
        >
            <div className="loading-content">
                {!isStarting ? (
                    <>
                        <button className="start-button" onClick={handleStart}>
                            START GAME
                        </button>
                        <p className="controls-hint">
                            Desktop: WASD / Arrows + Space
                            <br />
                            Mobile: Gyroscope + Jump Button
                        </p>
                    </>
                ) : (
                    <div className="loading-bar-container">
                        <div className="loading-bar">
                            <div
                                className="loading-bar-fill"
                                style={{ width: `${loadingProgress}%` }}
                            />
                        </div>
                        <p className="loading-text">
                            LOADING... {Math.floor(loadingProgress)}%
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

import { useEffect, useRef, useState } from 'react';
import useGame from './stores/useGame.jsx';

export default function BackgroundMusic({ gameStarted }) {
    const audioRef = useRef();
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.3);
    const phase = useGame((state) => state.phase);
    const hasStartedRef = useRef(false);

    useEffect(() => {
        audioRef.current = new Audio('music/soundtrack.mp3');
        audioRef.current.loop = true;
        audioRef.current.volume = volume;

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    // Play music quando viene premuto START
    useEffect(() => {
        if (gameStarted && audioRef.current && !hasStartedRef.current) {
            audioRef.current
                .play()
                .then(() => {
                    setIsPlaying(true);
                    hasStartedRef.current = true;
                })
                .catch((err) => {
                    console.log('Play prevented:', err);
                });
        }
    }, [gameStarted]);

    // useEffect(() => {
    //     if (!audioRef.current) return;

    //     // Reset quando torni al menu ready
    //     if (phase === 'ready') {
    //         audioRef.current.pause();
    //         audioRef.current.currentTime = 0;
    //         setIsPlaying(false);
    //         hasStartedRef.current = false;
    //     }
    // }, [phase]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current
                .play()
                .then(() => {
                    setIsPlaying(true);
                    hasStartedRef.current = true;
                })
                .catch((err) => {
                    console.log('Play prevented:', err);
                });
        }
    };

    const handleVolumeChange = (e) => {
        setVolume(parseFloat(e.target.value));
    };

    return (
        <div className="music-controls">
            <button
                onClick={togglePlay}
                className="music-toggle"
                title={isPlaying ? 'Pause Music' : 'Play Music'}
            >
                {isPlaying ? '🔊' : '🔇'}
            </button>

            <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="volume-slider"
                title="Volume"
            />
        </div>
    );
}

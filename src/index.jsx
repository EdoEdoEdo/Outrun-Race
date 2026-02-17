import './style-vaporwave.css';
import './GyroscopeControls.css';
import './BackgroundMusic.css';
import ReactDOM from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import Experience from './Experience-vaporwave.jsx';
import { KeyboardControls } from '@react-three/drei';
import Interface from './Interface.jsx';
import BackgroundMusic from './BackgroundMusic.jsx';
import LoadingScreen from './LoadingScreen.jsx';
import { useState } from 'react';

function App() {
    const [gameStarted, setGameStarted] = useState(false);

    return (
        <>
            {!gameStarted && (
                <LoadingScreen onStart={() => setGameStarted(true)} />
            )}

            <KeyboardControls
                map={[
                    { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
                    { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
                    { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
                    { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
                    { name: 'jump', keys: ['Space'] },
                ]}
            >
                <Canvas
                    shadows
                    camera={{
                        fov: 45,
                        near: 0.1,
                        far: 200,
                        position: [2.5, 4, 6],
                    }}
                >
                    <Experience />
                </Canvas>
                <Interface />
                <BackgroundMusic gameStarted={gameStarted} />
            </KeyboardControls>
        </>
    );
}

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<App />);

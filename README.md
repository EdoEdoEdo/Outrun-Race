# 🎮 Outrun Race

A retro-futuristic 3D obstacle course game built with React Three Fiber, featuring a vaporwave/TRON aesthetic, mobile gyroscope controls, and neon laser obstacles.

🕹️ **Live Demo**: [edoedoedo.it/experiments/outrun-race](https://www.edoedoedo.it/experiments/outrun-race/)

---

## 📸 Screenshots

![Outrun Race Desktop](public/loading-bg-desktop.png)

---

## 🚀 Features

- **3D Physics** - Ball rolling with Rapier physics engine
- **5 Obstacle Types** - Spinner, Axe, Limbo, Laser Gate, Laser Wall
- **Mobile Gyroscope Controls** - Tilt your phone to control the ball
- **Desktop Controls** - WASD / Arrow Keys + Space to jump
- **Holographic Player** - Custom GLSL shader with glitch effect
- **Vaporwave Aesthetic** - Neon grid, TRON walls, retrowave sun
- **Background Music** - Looping synthwave soundtrack
- **Loading Screen** - Animated loading bar with neon style
- **Speed Boost** - Ball glows green when boosted
- **Responsive** - Desktop and mobile optimized

---

## 🛠️ Tech Stack

- **React** + **React Three Fiber** - 3D rendering
- **@react-three/rapier** - Physics engine
- **@react-three/drei** - 3D helpers
- **Zustand** - State management
- **Vite** - Build tool
- **GLSL Shaders** - Custom holographic player material

---

## 🎮 Controls

### Desktop

| Key       | Action        |
| --------- | ------------- |
| `W` / `↑` | Move Forward  |
| `S` / `↓` | Move Backward |
| `A` / `←` | Move Left     |
| `D` / `→` | Move Right    |
| `Space`   | Jump          |

### Mobile

| Action      | Control                 |
| ----------- | ----------------------- |
| Move        | Tilt device (gyroscope) |
| Jump        | Tap jump button         |
| Mute/Unmute | 🔊 button               |

---

## 🧱 Obstacles

| Obstacle       | Description                                 |
| -------------- | ------------------------------------------- |
| **Spinner**    | Orange bar rotating horizontally            |
| **Axe**        | Orange block swinging left/right            |
| **Limbo**      | Orange bar moving up/down                   |
| **Laser Gate** | 7 red vertical lasers, 1 gap that cycles    |
| **Laser Wall** | Pink wall that turns on/off every 3 seconds |

---

## 📁 Project Structure

```
src/
├── index.jsx                   # Entry point + App wrapper
├── index.html                  # HTML template
├── Player.jsx                  # Hologram player + physics + controls
├── Interface.jsx               # UI overlay + mobile support
├── Level.jsx                   # Level generation + obstacles
├── BlockLaserGate.jsx          # Red laser gate obstacle
├── BlockLaserWall.jsx          # Pink laser wall obstacle
├── Experience-vaporwave.jsx    # Scene setup
├── Lights-vaporwave.jsx        # Lighting
├── GridFloor.jsx               # Purple grid floor
├── TronWalls.jsx               # TRON-style corridor walls
├── Mountains.jsx               # Background mountains
├── RetrowaveSun.jsx            # Retrowave sun
├── GyroscopeControls.jsx       # Mobile gyroscope + jump button
├── GyroscopeControls.css       # Mobile UI styles
├── BackgroundMusic.jsx         # Audio player + controls
├── BackgroundMusic.css         # Audio UI styles
├── LoadingScreen.jsx           # Loading screen + start button
├── LoadingScreen.css           # Loading screen styles
├── style-vaporwave.css         # Global styles
└── stores/
    └── useGame.jsx             # Zustand game state
```

---

## 🏃 Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
git clone https://github.com/yourusername/outrun-race.git
cd outrun-race
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Build

```bash
npm run build
```

---

## 🎵 Music

Add your own soundtrack:

1. Download free synthwave music from [Pixabay](https://pixabay.com/music/) (search "synthwave")
2. Rename to `soundtrack.mp3`
3. Place in `public/music/soundtrack.mp3`

---

## 📱 Mobile Notes

- **iOS**: Tap the gyroscope permission button on first load
- **Android**: Tilt controls work automatically
- Music starts on first tap
- Volume controlled via device buttons (slider hidden on mobile)

---

## 🚀 Deploy

1. Update `vite.config.js` with your base path:

```javascript
base: '/your/path/here/',
```

2. Add `<base>` tag to `index.html`:

```html
<base href="/your/path/here/" />
```

3. Build and upload:

```bash
npm run build
# Upload dist/ contents to your server
```

4. Add `.htaccess` for SPA routing (Apache):

```apache
RewriteEngine On
RewriteBase /your/path/here/
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
```

---

## 🎨 Customization

### Change number of obstacles

In `Level.jsx`:

```javascript
const count = 10; // ← Number of obstacle blocks
```

### Change obstacle types

In `Level.jsx`:

```javascript
const types = [
    BlockSpinner,
    BlockAxe,
    BlockLimbo,
    BlockLaserGate,
    BlockLaserWall,
];
```

### Change camera distance (mobile)

In `Player.jsx`:

```javascript
// Mobile
cameraPosition.z += 3.5;
cameraPosition.y += 1.2;

// Desktop
cameraPosition.z += 2.25;
cameraPosition.y += 0.65;
```

### Change laser timing

In `BlockLaserGate.jsx`:

```javascript
Math.floor(time / 2.5) % 7; // ← 2.5 sec cycle
```

In `BlockLaserWall.jsx`:

```javascript
Math.floor(time / 3) % 2; // ← 3 sec on/off
```

---

## 📄 License

MIT License - feel free to use and modify!

---

## 👨‍💻 Author

**Edoardo** - [edoedoedo.it](https://www.edoedoedo.it)

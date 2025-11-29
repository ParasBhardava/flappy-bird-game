// Game configuration constants

// Get responsive dimensions
const getGameDimensions = () => ({
    width: window.innerWidth,
    height: window.innerHeight,
});

const dims = getGameDimensions();

export const GAME_CONFIG = {
    // Canvas dimensions - now responsive
    width: dims.width,
    height: dims.height,

    // Bird physics
    gravity: 0.0008,           // Pixels per ms²
    jumpVelocity: -0.35,       // Pixels per ms (negative = upward)
    birdSize: 40,              // Pixels
    birdStartX: dims.width * 0.2,  // 20% from left
    birdStartY: dims.height * 0.5,  // Middle of screen

    // Obstacle configuration
    obstacleWidth: 80,         // Pixels
    obstacleGap: 180,          // Pixels (vertical gap height)
    obstacleSpeed: 0.3,        // Pixels per ms (slightly faster for larger screen)
    obstacleInterval: 2000,    // Milliseconds between obstacles
    minGapY: dims.height * 0.25,   // 25% from top
    maxGapY: dims.height * 0.75,   // 75% from top

    // Collision detection
    birdRadius: 18,            // Effective collision radius

    // Boundaries
    topBoundary: 0,
    bottomBoundary: dims.height,
} as const;

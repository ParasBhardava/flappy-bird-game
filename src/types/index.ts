// Core game types for Flappy Bird

export type GameStatus = 'ready' | 'playing' | 'gameOver';

export interface BirdState {
    y: number;        // Vertical position (0 = top)
    velocity: number; // Vertical velocity (positive = downward)
}

export interface Obstacle {
    id: string;
    x: number;        // Horizontal position
    gapY: number;     // Vertical position of gap center
    passed: boolean;  // Whether bird has passed this obstacle
}

export interface GameState {
    gameStatus: GameStatus;
    bird: BirdState;
    obstacles: Obstacle[];
    score: number;
    lastObstacleTime: number;
}

export interface GameTheme {
    background: string;
    bird: string;
    obstacle: string;
    score: string;
    gameOver: {
        background: string;
        text: string;
    };
}

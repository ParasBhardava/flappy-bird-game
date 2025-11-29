// Game state management functions

import type { GameState } from '../types';
import { GAME_CONFIG } from './constants';
import { applyGravity, applyJump, updateBirdPosition } from './physics';
import { generateObstacle, updateObstacles, removeOffscreenObstacles } from './obstacles';
import { checkCollisions } from './collision';
import { updateScore } from './score';

/**
 * Create the initial game state
 * @returns Fresh game state with default values
 */
export function createInitialGameState(): GameState {
    return {
        gameStatus: 'ready',
        bird: {
            y: GAME_CONFIG.birdStartY,
            velocity: 0,
        },
        obstacles: [],
        score: 0,
        lastObstacleTime: 0,
    };
}

/**
 * Restart the game by returning a fresh initial state
 * @returns Fresh game state identical to initial state
 */
export function restartGame(): GameState {
    return createInitialGameState();
}

/**
 * Update the game state based on elapsed time and player input
 * Handles state transitions: ready → playing → gameOver
 * Ensures game-over state is immutable
 * @param state - Current game state
 * @param deltaTime - Time elapsed in milliseconds
 * @param jumpPressed - Whether the jump action was triggered
 * @param currentTime - Current game time in milliseconds (for obstacle generation)
 * @returns New game state after update
 */
export function updateGameState(
    state: GameState,
    deltaTime: number,
    jumpPressed: boolean,
    currentTime: number = Date.now()
): GameState {
    // If game is over, state is immutable - return unchanged
    if (state.gameStatus === 'gameOver') {
        return state;
    }

    // If game is ready and jump is pressed, transition to playing
    if (state.gameStatus === 'ready' && jumpPressed) {
        return {
            ...state,
            gameStatus: 'playing',
            bird: applyJump(state.bird),
            lastObstacleTime: currentTime, // Initialize obstacle timer when game starts
        };
    }

    // If game is still in ready state, don't update anything
    if (state.gameStatus === 'ready') {
        return state;
    }

    // Game is playing - update all game elements
    let updatedBird = state.bird;

    // Apply jump if pressed
    if (jumpPressed) {
        updatedBird = applyJump(updatedBird);
    }

    // Apply physics
    updatedBird = applyGravity(updatedBird, deltaTime);
    updatedBird = updateBirdPosition(updatedBird, deltaTime);

    // Update obstacles
    let updatedObstacles = updateObstacles(state.obstacles, deltaTime);
    updatedObstacles = removeOffscreenObstacles(updatedObstacles);

    // Generate new obstacles if needed
    const timeSinceLastObstacle = currentTime - state.lastObstacleTime;
    let lastObstacleTime = state.lastObstacleTime;

    if (timeSinceLastObstacle >= GAME_CONFIG.obstacleInterval) {
        updatedObstacles = [...updatedObstacles, generateObstacle(currentTime)];
        lastObstacleTime = currentTime;
    }

    // Update score
    const { score: updatedScore, obstacles: obstaclesWithScore } = updateScore(
        updatedObstacles,
        state.score
    );

    // Check for collisions
    const hasCollision = checkCollisions(updatedBird, obstaclesWithScore);

    // If collision detected, transition to game over
    if (hasCollision) {
        return {
            ...state,
            gameStatus: 'gameOver',
            bird: updatedBird,
            obstacles: obstaclesWithScore,
            score: updatedScore,
            lastObstacleTime,
        };
    }

    // Return updated state
    return {
        gameStatus: 'playing',
        bird: updatedBird,
        obstacles: obstaclesWithScore,
        score: updatedScore,
        lastObstacleTime,
    };
}

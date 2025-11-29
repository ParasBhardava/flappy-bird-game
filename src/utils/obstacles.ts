// Obstacle management functions

import type { Obstacle } from '../types';
import { GAME_CONFIG } from './constants';

/**
 * Generate a new obstacle with random gap position
 * @param currentTime - Current game time in milliseconds
 * @returns New obstacle positioned at the right edge
 */
export function generateObstacle(currentTime: number): Obstacle {
    // Generate random gap position within valid bounds
    const gapY = GAME_CONFIG.minGapY +
        Math.random() * (GAME_CONFIG.maxGapY - GAME_CONFIG.minGapY);

    return {
        id: `obstacle-${currentTime}-${Math.random()}`,
        x: GAME_CONFIG.width,
        gapY,
        passed: false,
    };
}

/**
 * Update all obstacles' positions based on elapsed time
 * @param obstacles - Array of current obstacles
 * @param deltaTime - Time elapsed in milliseconds
 * @returns New array of obstacles with updated positions
 */
export function updateObstacles(obstacles: Obstacle[], deltaTime: number): Obstacle[] {
    return obstacles.map(obstacle => ({
        ...obstacle,
        x: obstacle.x - GAME_CONFIG.obstacleSpeed * deltaTime,
    }));
}

/**
 * Remove obstacles that have moved off-screen to the left
 * @param obstacles - Array of current obstacles
 * @returns New array with off-screen obstacles removed
 */
export function removeOffscreenObstacles(obstacles: Obstacle[]): Obstacle[] {
    return obstacles.filter(obstacle => obstacle.x > -GAME_CONFIG.obstacleWidth);
}

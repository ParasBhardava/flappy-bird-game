// Score management functions

import type { Obstacle } from '../types';
import { GAME_CONFIG } from './constants';

/**
 * Update score based on obstacles the bird has passed
 * @param obstacles - Array of current obstacles
 * @param currentScore - Current score value
 * @returns Object containing new score and updated obstacles array
 */
export function updateScore(
    obstacles: Obstacle[],
    currentScore: number
): { score: number; obstacles: Obstacle[] } {
    let newScore = currentScore;

    // Update obstacles and check for newly passed ones
    const updatedObstacles = obstacles.map(obstacle => {
        // Check if bird has passed this obstacle and it hasn't been marked as passed yet
        if (!obstacle.passed && GAME_CONFIG.birdStartX > obstacle.x + GAME_CONFIG.obstacleWidth) {
            newScore += 1;
            return { ...obstacle, passed: true };
        }
        return obstacle;
    });

    return {
        score: newScore,
        obstacles: updatedObstacles,
    };
}

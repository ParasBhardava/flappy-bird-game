// Collision detection functions for Flappy Bird game

import type { BirdState, Obstacle } from '../types';
import { GAME_CONFIG } from './constants';

/**
 * Check if the bird collides with an obstacle
 * Uses circular collision detection for the bird against rectangular pipes
 * @param bird - Current bird state
 * @param obstacle - Obstacle to check collision against
 * @returns true if collision detected, false otherwise
 */
export function checkBirdObstacleCollision(bird: BirdState, obstacle: Obstacle): boolean {
    const birdX = GAME_CONFIG.birdStartX;
    const birdY = bird.y;
    const birdRadius = GAME_CONFIG.birdRadius;

    // Check if bird is horizontally aligned with the obstacle
    const obstacleLeft = obstacle.x;
    const obstacleRight = obstacle.x + GAME_CONFIG.obstacleWidth;

    // Bird needs to be within the obstacle's horizontal bounds (with radius consideration)
    if (birdX + birdRadius < obstacleLeft || birdX - birdRadius > obstacleRight) {
        return false; // Bird is not horizontally aligned with obstacle
    }

    // Calculate gap boundaries
    const gapTop = obstacle.gapY - GAME_CONFIG.obstacleGap / 2;
    const gapBottom = obstacle.gapY + GAME_CONFIG.obstacleGap / 2;

    // Check if bird is within the gap (safe zone)
    if (birdY - birdRadius >= gapTop && birdY + birdRadius <= gapBottom) {
        return false; // Bird is safely within the gap
    }

    // Bird is horizontally aligned with obstacle and not in the gap = collision
    return true;
}

/**
 * Check if the bird collides with game boundaries (top or bottom)
 * @param bird - Current bird state
 * @returns true if collision detected, false otherwise
 */
export function checkBirdBoundaryCollision(bird: BirdState): boolean {
    const birdY = bird.y;
    const birdRadius = GAME_CONFIG.birdRadius;

    // Check top boundary
    if (birdY - birdRadius <= GAME_CONFIG.topBoundary) {
        return true;
    }

    // Check bottom boundary
    if (birdY + birdRadius >= GAME_CONFIG.bottomBoundary) {
        return true;
    }

    return false;
}

/**
 * Check all collisions for the bird (obstacles and boundaries)
 * @param bird - Current bird state
 * @param obstacles - Array of obstacles to check
 * @returns true if any collision detected, false otherwise
 */
export function checkCollisions(bird: BirdState, obstacles: Obstacle[]): boolean {
    // Check boundary collisions first
    if (checkBirdBoundaryCollision(bird)) {
        return true;
    }

    // Check collision with each obstacle
    for (const obstacle of obstacles) {
        if (checkBirdObstacleCollision(bird, obstacle)) {
            return true;
        }
    }

    return false;
}

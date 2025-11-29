// Physics calculation functions for bird movement

import type { BirdState } from '../types';
import { GAME_CONFIG } from './constants';

/**
 * Apply gravity to the bird's velocity
 * @param bird - Current bird state
 * @param deltaTime - Time elapsed in milliseconds
 * @returns New bird state with updated velocity
 */
export function applyGravity(bird: BirdState, deltaTime: number): BirdState {
    return {
        ...bird,
        velocity: bird.velocity + GAME_CONFIG.gravity * deltaTime,
    };
}

/**
 * Apply jump action to the bird (sets upward velocity)
 * @param bird - Current bird state
 * @returns New bird state with jump velocity
 */
export function applyJump(bird: BirdState): BirdState {
    return {
        ...bird,
        velocity: GAME_CONFIG.jumpVelocity,
    };
}

/**
 * Update bird's vertical position based on velocity
 * @param bird - Current bird state
 * @param deltaTime - Time elapsed in milliseconds
 * @returns New bird state with updated position
 */
export function updateBirdPosition(bird: BirdState, deltaTime: number): BirdState {
    return {
        ...bird,
        y: bird.y + bird.velocity * deltaTime,
    };
}

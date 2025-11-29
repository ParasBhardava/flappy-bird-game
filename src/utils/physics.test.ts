import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { applyGravity, applyJump, updateBirdPosition } from './physics';
import { GAME_CONFIG } from './constants';
import type { BirdState } from '../types';

describe('Physics Property Tests', () => {
    /**
     * Feature: flappy-bird-game, Property 1: Jump applies upward velocity
     * Validates: Requirements 1.2
     * 
     * For any bird state, when a jump action is applied, the bird's velocity 
     * should be set to the jump velocity constant (negative value indicating upward movement).
     */
    it('Property 1: Jump applies upward velocity', () => {
        fc.assert(
            fc.property(
                // Generate arbitrary bird states
                fc.record({
                    y: fc.double({ min: 0, max: GAME_CONFIG.height, noNaN: true }),
                    velocity: fc.double({ min: -2, max: 2, noNaN: true }),
                }),
                (bird: BirdState) => {
                    const result = applyJump(bird);

                    // After jump, velocity should be set to jumpVelocity constant
                    expect(result.velocity).toBe(GAME_CONFIG.jumpVelocity);

                    // Position should remain unchanged
                    expect(result.y).toBe(bird.y);
                }
            ),
            { numRuns: 100 }
        );
    });

    /**
     * Feature: flappy-bird-game, Property 2: Gravity increases downward velocity
     * Validates: Requirements 1.3
     * 
     * For any bird state and positive time delta, applying physics updates should 
     * increase the bird's velocity by gravity × deltaTime (making it more positive/downward).
     */
    it('Property 2: Gravity increases downward velocity', () => {
        fc.assert(
            fc.property(
                // Generate arbitrary bird states and positive time deltas
                fc.record({
                    y: fc.double({ min: 0, max: GAME_CONFIG.height, noNaN: true }),
                    velocity: fc.double({ min: -2, max: 2, noNaN: true }),
                }),
                fc.double({ min: 0.1, max: 100, noNaN: true }), // deltaTime in ms
                (bird: BirdState, deltaTime: number) => {
                    const result = applyGravity(bird, deltaTime);

                    // Velocity should increase by gravity * deltaTime
                    const expectedVelocity = bird.velocity + GAME_CONFIG.gravity * deltaTime;
                    expect(result.velocity).toBeCloseTo(expectedVelocity, 10);

                    // Position should remain unchanged
                    expect(result.y).toBe(bird.y);
                }
            ),
            { numRuns: 100 }
        );
    });

    /**
     * Feature: flappy-bird-game, Property 3: Position updates follow velocity
     * Validates: Requirements 1.4
     * 
     * For any bird state and time delta, updating the bird's position should result 
     * in a new y-position equal to the old y-position plus velocity × deltaTime.
     */
    it('Property 3: Position updates follow velocity', () => {
        fc.assert(
            fc.property(
                // Generate arbitrary bird states and time deltas
                fc.record({
                    y: fc.double({ min: 0, max: GAME_CONFIG.height, noNaN: true }),
                    velocity: fc.double({ min: -2, max: 2, noNaN: true }),
                }),
                fc.double({ min: 0.1, max: 100, noNaN: true }), // deltaTime in ms
                (bird: BirdState, deltaTime: number) => {
                    const result = updateBirdPosition(bird, deltaTime);

                    // Position should update by velocity * deltaTime
                    const expectedY = bird.y + bird.velocity * deltaTime;
                    expect(result.y).toBeCloseTo(expectedY, 10);

                    // Velocity should remain unchanged
                    expect(result.velocity).toBe(bird.velocity);
                }
            ),
            { numRuns: 100 }
        );
    });

    /**
     * Feature: flappy-bird-game, Property 14: Physics calculations use deltaTime correctly
     * Validates: Requirements 7.5
     * 
     * For any bird state and positive deltaTime, applying physics updates should scale 
     * changes proportionally to deltaTime. This verifies that deltaTime is used correctly
     * in calculations, ensuring smooth animation regardless of frame rate.
     * 
     * Note: This verifies deltaTime is used correctly, not perfect mathematical frame-rate 
     * independence (which Euler integration doesn't provide).
     */
    it('Property 14: Physics calculations use deltaTime correctly', () => {
        fc.assert(
            fc.property(
                // Generate arbitrary bird states and positive time deltas
                fc.record({
                    y: fc.double({ min: 0, max: GAME_CONFIG.height, noNaN: true }),
                    velocity: fc.double({ min: -2, max: 2, noNaN: true }),
                }),
                fc.double({ min: 1, max: 50, noNaN: true }), // deltaTime in ms
                (bird: BirdState, deltaTime: number) => {
                    // Test 1: Velocity changes scale linearly with deltaTime
                    const withGravity1 = applyGravity(bird, deltaTime);
                    const withGravity2 = applyGravity(bird, deltaTime * 2);

                    const velocityChange1 = withGravity1.velocity - bird.velocity;
                    const velocityChange2 = withGravity2.velocity - bird.velocity;

                    // Velocity change should be exactly proportional to deltaTime
                    expect(velocityChange2).toBeCloseTo(velocityChange1 * 2, 8);

                    // Test 2: Position updates use velocity correctly
                    const result1 = updateBirdPosition(bird, deltaTime);
                    const result2 = updateBirdPosition(bird, deltaTime * 2);

                    const positionChange1 = result1.y - bird.y;
                    const positionChange2 = result2.y - bird.y;

                    // Position change should be proportional to deltaTime
                    // (velocity * deltaTime scales linearly)
                    expect(positionChange2).toBeCloseTo(positionChange1 * 2, 8);
                }
            ),
            { numRuns: 100 }
        );
    });
});

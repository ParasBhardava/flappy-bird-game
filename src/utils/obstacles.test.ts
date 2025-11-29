// Property-based tests for obstacle management
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { generateObstacle, updateObstacles, removeOffscreenObstacles } from './obstacles';
import { GAME_CONFIG } from './constants';

describe('Obstacle Management Property Tests', () => {
    /**
     * Feature: flappy-bird-game, Property 5: Obstacles generate at intervals
     * Validates: Requirements 2.1
     */
    it('Property 5: Generated obstacles have valid structure', () => {
        fc.assert(
            fc.property(
                fc.integer({ min: 0, max: 1000000 }), // currentTime
                (currentTime) => {
                    const obstacle = generateObstacle(currentTime);

                    // Verify obstacle has all required properties
                    expect(obstacle).toHaveProperty('id');
                    expect(obstacle).toHaveProperty('x');
                    expect(obstacle).toHaveProperty('gapY');
                    expect(obstacle).toHaveProperty('passed');

                    // Verify types
                    expect(typeof obstacle.id).toBe('string');
                    expect(typeof obstacle.x).toBe('number');
                    expect(typeof obstacle.gapY).toBe('number');
                    expect(typeof obstacle.passed).toBe('boolean');

                    // Verify initial state
                    expect(obstacle.passed).toBe(false);
                }
            ),
            { numRuns: 100 }
        );
    });

    /**
     * Feature: flappy-bird-game, Property 6: Generated obstacles have valid gap positions
     * Validates: Requirements 2.2
     */
    it('Property 6: Generated obstacles have valid gap positions', () => {
        fc.assert(
            fc.property(
                fc.integer({ min: 0, max: 1000000 }), // currentTime
                (currentTime) => {
                    const obstacle = generateObstacle(currentTime);

                    // Gap position must be within configured bounds
                    expect(obstacle.gapY).toBeGreaterThanOrEqual(GAME_CONFIG.minGapY);
                    expect(obstacle.gapY).toBeLessThanOrEqual(GAME_CONFIG.maxGapY);
                }
            ),
            { numRuns: 100 }
        );
    });

    /**
     * Feature: flappy-bird-game, Property 7: New obstacles start at right edge
     * Validates: Requirements 2.3
     */
    it('Property 7: New obstacles start at right edge', () => {
        fc.assert(
            fc.property(
                fc.integer({ min: 0, max: 1000000 }), // currentTime
                (currentTime) => {
                    const obstacle = generateObstacle(currentTime);

                    // Obstacle must start at the right edge of the game area
                    expect(obstacle.x).toBe(GAME_CONFIG.width);
                }
            ),
            { numRuns: 100 }
        );
    });

    /**
     * Feature: flappy-bird-game, Property 8: Obstacles move left at constant speed
     * Validates: Requirements 2.4
     */
    it('Property 8: Obstacles move left at constant speed', () => {
        fc.assert(
            fc.property(
                fc.array(
                    fc.record({
                        id: fc.string(),
                        x: fc.float({ min: -100, max: 1000, noNaN: true }),
                        gapY: fc.float({ min: GAME_CONFIG.minGapY, max: GAME_CONFIG.maxGapY, noNaN: true }),
                        passed: fc.boolean(),
                    })
                ),
                fc.float({ min: 1, max: 100, noNaN: true }), // deltaTime (positive)
                (obstacles, deltaTime) => {
                    const updatedObstacles = updateObstacles(obstacles, deltaTime);

                    // Each obstacle should move left by obstacleSpeed * deltaTime
                    const expectedDistance = GAME_CONFIG.obstacleSpeed * deltaTime;

                    obstacles.forEach((original, index) => {
                        const updated = updatedObstacles[index];
                        const actualDistance = original.x - updated.x;

                        // Use approximate equality for floating point
                        expect(Math.abs(actualDistance - expectedDistance)).toBeLessThan(0.0001);

                        // Other properties should remain unchanged
                        expect(updated.id).toBe(original.id);
                        expect(updated.gapY).toBe(original.gapY);
                        expect(updated.passed).toBe(original.passed);
                    });
                }
            ),
            { numRuns: 100 }
        );
    });

    /**
     * Feature: flappy-bird-game, Property 9: Off-screen obstacles are removed
     * Validates: Requirements 2.5
     */
    it('Property 9: Off-screen obstacles are removed', () => {
        fc.assert(
            fc.property(
                fc.array(
                    fc.record({
                        id: fc.string(),
                        x: fc.float({ min: -200, max: 1000 }),
                        gapY: fc.float({ min: GAME_CONFIG.minGapY, max: GAME_CONFIG.maxGapY }),
                        passed: fc.boolean(),
                    })
                ),
                (obstacles) => {
                    const filteredObstacles = removeOffscreenObstacles(obstacles);

                    // No obstacle should have x-position less than -obstacleWidth
                    filteredObstacles.forEach(obstacle => {
                        expect(obstacle.x).toBeGreaterThan(-GAME_CONFIG.obstacleWidth);
                    });

                    // All obstacles with x > -obstacleWidth should be retained
                    const expectedCount = obstacles.filter(
                        o => o.x > -GAME_CONFIG.obstacleWidth
                    ).length;
                    expect(filteredObstacles.length).toBe(expectedCount);
                }
            ),
            { numRuns: 100 }
        );
    });
});

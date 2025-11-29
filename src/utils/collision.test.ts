// Property-based tests for collision detection
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { checkBirdObstacleCollision, checkBirdBoundaryCollision, checkCollisions } from './collision';
import type { BirdState, Obstacle } from '../types';
import { GAME_CONFIG } from './constants';

describe('Collision Detection Property Tests', () => {
    /**
     * Feature: flappy-bird-game, Property 10: Collision detection triggers game over
     * Validates: Requirements 3.1
     * 
     * For any bird position and obstacle, if the bird's bounding circle intersects 
     * with the obstacle's geometry (top or bottom pipe), collision detection should 
     * return true, which would trigger a game-over state.
     */
    it('Property 10: Collision detection correctly identifies collisions', () => {
        fc.assert(
            fc.property(
                // Generate arbitrary bird states
                fc.record({
                    y: fc.double({ min: 0, max: GAME_CONFIG.height, noNaN: true }),
                    velocity: fc.double({ min: -2, max: 2, noNaN: true }),
                }),
                // Generate arbitrary obstacles
                fc.record({
                    id: fc.string(),
                    x: fc.double({ min: 0, max: GAME_CONFIG.width, noNaN: true }),
                    gapY: fc.double({ min: GAME_CONFIG.minGapY, max: GAME_CONFIG.maxGapY, noNaN: true }),
                    passed: fc.boolean(),
                }),
                (bird: BirdState, obstacle: Obstacle) => {
                    const collision = checkBirdObstacleCollision(bird, obstacle);

                    const birdX = GAME_CONFIG.birdStartX;
                    const birdY = bird.y;
                    const birdRadius = GAME_CONFIG.birdRadius;

                    const obstacleLeft = obstacle.x;
                    const obstacleRight = obstacle.x + GAME_CONFIG.obstacleWidth;

                    const gapTop = obstacle.gapY - GAME_CONFIG.obstacleGap / 2;
                    const gapBottom = obstacle.gapY + GAME_CONFIG.obstacleGap / 2;

                    // Check if bird is horizontally aligned with obstacle
                    const horizontallyAligned =
                        birdX + birdRadius >= obstacleLeft &&
                        birdX - birdRadius <= obstacleRight;

                    // Check if bird is in the safe gap
                    const inGap =
                        birdY - birdRadius >= gapTop &&
                        birdY + birdRadius <= gapBottom;

                    // Collision should occur when horizontally aligned AND not in gap
                    const expectedCollision = horizontallyAligned && !inGap;

                    expect(collision).toBe(expectedCollision);
                }
            ),
            { numRuns: 100 }
        );
    });

    /**
     * Additional property: Boundary collisions are detected correctly
     * This verifies Requirements 3.2 and 3.3 (top and bottom boundary collisions)
     */
    it('Property: Boundary collision detection is correct', () => {
        fc.assert(
            fc.property(
                fc.record({
                    y: fc.double({ min: -50, max: GAME_CONFIG.height + 50, noNaN: true }),
                    velocity: fc.double({ min: -2, max: 2, noNaN: true }),
                }),
                (bird: BirdState) => {
                    const collision = checkBirdBoundaryCollision(bird);
                    const birdRadius = GAME_CONFIG.birdRadius;

                    // Collision should occur when bird touches top or bottom boundary
                    const hitsTop = bird.y - birdRadius <= GAME_CONFIG.topBoundary;
                    const hitsBottom = bird.y + birdRadius >= GAME_CONFIG.bottomBoundary;
                    const expectedCollision = hitsTop || hitsBottom;

                    expect(collision).toBe(expectedCollision);
                }
            ),
            { numRuns: 100 }
        );
    });

    /**
     * Additional property: checkCollisions aggregates all collision types
     * Verifies that the main collision function correctly combines obstacle and boundary checks
     */
    it('Property: checkCollisions aggregates all collision types correctly', () => {
        fc.assert(
            fc.property(
                fc.record({
                    y: fc.double({ min: -50, max: GAME_CONFIG.height + 50, noNaN: true }),
                    velocity: fc.double({ min: -2, max: 2, noNaN: true }),
                }),
                fc.array(
                    fc.record({
                        id: fc.string(),
                        x: fc.double({ min: 0, max: GAME_CONFIG.width, noNaN: true }),
                        gapY: fc.double({ min: GAME_CONFIG.minGapY, max: GAME_CONFIG.maxGapY, noNaN: true }),
                        passed: fc.boolean(),
                    }),
                    { maxLength: 5 }
                ),
                (bird: BirdState, obstacles: Obstacle[]) => {
                    const collision = checkCollisions(bird, obstacles);

                    // Check if there's a boundary collision
                    const boundaryCollision = checkBirdBoundaryCollision(bird);

                    // Check if there's any obstacle collision
                    const obstacleCollision = obstacles.some(obstacle =>
                        checkBirdObstacleCollision(bird, obstacle)
                    );

                    // checkCollisions should return true if ANY collision is detected
                    const expectedCollision = boundaryCollision || obstacleCollision;

                    expect(collision).toBe(expectedCollision);
                }
            ),
            { numRuns: 100 }
        );
    });
});

describe('Boundary Collision Edge Cases', () => {
    /**
     * Unit tests for boundary collision edge cases
     * Requirements: 3.2, 3.3
     */

    it('should detect collision when bird is at top boundary (y = 0)', () => {
        const bird: BirdState = {
            y: 0,
            velocity: 0,
        };

        const collision = checkBirdBoundaryCollision(bird);

        // Bird at y=0 with radius 18 means top of bird is at y=-18, which is beyond top boundary (0)
        expect(collision).toBe(true);
    });

    it('should detect collision when bird is at bottom boundary (y = 600)', () => {
        const bird: BirdState = {
            y: 600,
            velocity: 0,
        };

        const collision = checkBirdBoundaryCollision(bird);

        // Bird at y=600 with radius 18 means bottom of bird is at y=618, which is beyond bottom boundary (600)
        expect(collision).toBe(true);
    });

    it('should not detect collision when bird is just inside top boundary', () => {
        const bird: BirdState = {
            y: GAME_CONFIG.birdRadius + 1, // Just inside top boundary
            velocity: 0,
        };

        const collision = checkBirdBoundaryCollision(bird);

        // Bird at y=19 with radius 18 means top of bird is at y=1, which is inside the boundary
        expect(collision).toBe(false);
    });

    it('should not detect collision when bird is just inside bottom boundary', () => {
        const bird: BirdState = {
            y: GAME_CONFIG.bottomBoundary - GAME_CONFIG.birdRadius - 1, // Just inside bottom boundary
            velocity: 0,
        };

        const collision = checkBirdBoundaryCollision(bird);

        // Bird at y=581 with radius 18 means bottom of bird is at y=599, which is inside the boundary
        expect(collision).toBe(false);
    });

    it('should detect collision when bird touches top boundary exactly', () => {
        const bird: BirdState = {
            y: GAME_CONFIG.birdRadius, // Top of bird exactly at boundary
            velocity: 0,
        };

        const collision = checkBirdBoundaryCollision(bird);

        // Bird at y=18 with radius 18 means top of bird is at y=0, which is exactly at the boundary
        // The collision function uses <= so this should be detected as a collision
        expect(collision).toBe(true);
    });

    it('should detect collision when bird touches bottom boundary exactly', () => {
        const bird: BirdState = {
            y: GAME_CONFIG.bottomBoundary - GAME_CONFIG.birdRadius, // Bottom of bird exactly at boundary
            velocity: 0,
        };

        const collision = checkBirdBoundaryCollision(bird);

        // Bird at y=582 with radius 18 means bottom of bird is at y=600, which is exactly at the boundary
        // The collision function uses >= so this should be detected as a collision
        expect(collision).toBe(true);
    });
});

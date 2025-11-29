// Score management tests

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { updateScore } from './score';
import type { Obstacle } from '../types';
import { GAME_CONFIG } from './constants';

describe('Score Management', () => {
    it('should have initial score of 0 for new game state', () => {
        // Test that new game state has score = 0
        // Requirements: 4.1
        const initialScore = 0;
        const obstacles: Obstacle[] = [];

        const result = updateScore(obstacles, initialScore);

        expect(result.score).toBe(0);
        expect(result.obstacles).toEqual([]);
    });

    it('should not increment score when bird has not passed obstacle', () => {
        const obstacles: Obstacle[] = [
            {
                id: 'test-1',
                x: GAME_CONFIG.birdStartX + 100, // Obstacle ahead of bird
                gapY: 300,
                passed: false,
            },
        ];

        const result = updateScore(obstacles, 0);

        expect(result.score).toBe(0);
        expect(result.obstacles[0].passed).toBe(false);
    });

    it('should increment score when bird passes obstacle', () => {
        const obstacles: Obstacle[] = [
            {
                id: 'test-1',
                x: GAME_CONFIG.birdStartX - GAME_CONFIG.obstacleWidth - 10, // Obstacle behind bird
                gapY: 300,
                passed: false,
            },
        ];

        const result = updateScore(obstacles, 0);

        expect(result.score).toBe(1);
        expect(result.obstacles[0].passed).toBe(true);
    });

    it('should not increment score for already passed obstacles', () => {
        const obstacles: Obstacle[] = [
            {
                id: 'test-1',
                x: GAME_CONFIG.birdStartX - GAME_CONFIG.obstacleWidth - 10,
                gapY: 300,
                passed: true, // Already marked as passed
            },
        ];

        const result = updateScore(obstacles, 5);

        expect(result.score).toBe(5); // Score unchanged
        expect(result.obstacles[0].passed).toBe(true);
    });

    it('should handle multiple obstacles correctly', () => {
        const obstacles: Obstacle[] = [
            {
                id: 'test-1',
                x: GAME_CONFIG.birdStartX - GAME_CONFIG.obstacleWidth - 10,
                gapY: 300,
                passed: false, // Should be marked as passed
            },
            {
                id: 'test-2',
                x: GAME_CONFIG.birdStartX + 100,
                gapY: 350,
                passed: false, // Should remain unpassed
            },
            {
                id: 'test-3',
                x: GAME_CONFIG.birdStartX - GAME_CONFIG.obstacleWidth - 50,
                gapY: 250,
                passed: true, // Already passed
            },
        ];

        const result = updateScore(obstacles, 2);

        expect(result.score).toBe(3); // Only one new obstacle passed
        expect(result.obstacles[0].passed).toBe(true);
        expect(result.obstacles[1].passed).toBe(false);
        expect(result.obstacles[2].passed).toBe(true);
    });

    it('should maintain current score when no obstacles are passed', () => {
        const obstacles: Obstacle[] = [
            {
                id: 'test-1',
                x: GAME_CONFIG.birdStartX + 50,
                gapY: 300,
                passed: false,
            },
        ];

        const result = updateScore(obstacles, 10);

        expect(result.score).toBe(10);
    });
});

describe('Score Management - Property-Based Tests', () => {
    /**
     * Feature: flappy-bird-game, Property 12: Passing obstacles increments score
     * Validates: Requirements 4.2
     * 
     * For any obstacle that has not been marked as passed, when the bird's x-position 
     * exceeds the obstacle's x-position plus obstacle width, the score should increment 
     * by 1 and the obstacle should be marked as passed.
     */
    it('Property 12: Passing obstacles increments score', () => {
        fc.assert(
            fc.property(
                // Generate random obstacles with varying x positions and gap positions
                fc.array(
                    fc.record({
                        id: fc.string(),
                        x: fc.double({ min: -500, max: 1000 }),
                        gapY: fc.double({ min: GAME_CONFIG.minGapY, max: GAME_CONFIG.maxGapY }),
                        passed: fc.boolean(),
                    }),
                    { minLength: 0, maxLength: 10 }
                ),
                // Generate random initial score
                fc.nat({ max: 1000 }),
                (obstacles, initialScore) => {
                    // Count how many obstacles should be newly passed
                    const shouldBeNewlyPassed = obstacles.filter(
                        obs => !obs.passed && GAME_CONFIG.birdStartX > obs.x + GAME_CONFIG.obstacleWidth
                    ).length;

                    const result = updateScore(obstacles, initialScore);

                    // Score should increment by the number of newly passed obstacles
                    expect(result.score).toBe(initialScore + shouldBeNewlyPassed);

                    // Check that all obstacles that should be passed are marked as passed
                    result.obstacles.forEach((resultObs, index) => {
                        const originalObs = obstacles[index];
                        const shouldBePassed = GAME_CONFIG.birdStartX > originalObs.x + GAME_CONFIG.obstacleWidth;

                        if (shouldBePassed) {
                            // If bird has passed this obstacle, it should be marked as passed
                            expect(resultObs.passed).toBe(true);
                        } else {
                            // If bird hasn't passed, the passed status should remain unchanged
                            expect(resultObs.passed).toBe(originalObs.passed);
                        }
                    });

                    // Verify that obstacles already marked as passed don't increment score again
                    const alreadyPassedCount = obstacles.filter(obs => obs.passed).length;
                    const totalPassedAfter = result.obstacles.filter(obs => obs.passed).length;
                    expect(totalPassedAfter).toBe(alreadyPassedCount + shouldBeNewlyPassed);
                }
            ),
            { numRuns: 100 }
        );
    });
});

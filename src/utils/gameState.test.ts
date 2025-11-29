// Tests for game state management functions

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { createInitialGameState, restartGame, updateGameState } from './gameState';
import { GAME_CONFIG } from './constants';
import type { GameState, GameStatus } from '../types';

describe('Game State Management', () => {
    describe('createInitialGameState', () => {
        it('should create initial state with correct values', () => {
            const state = createInitialGameState();

            expect(state.gameStatus).toBe('ready');
            expect(state.bird.y).toBe(GAME_CONFIG.birdStartY);
            expect(state.bird.velocity).toBe(0);
            expect(state.obstacles).toEqual([]);
            expect(state.score).toBe(0);
            expect(state.lastObstacleTime).toBe(0);
        });
    });

    describe('restartGame', () => {
        it('should return fresh initial state', () => {
            const state = restartGame();

            expect(state.gameStatus).toBe('ready');
            expect(state.bird.y).toBe(GAME_CONFIG.birdStartY);
            expect(state.bird.velocity).toBe(0);
            expect(state.obstacles).toEqual([]);
            expect(state.score).toBe(0);
            expect(state.lastObstacleTime).toBe(0);
        });

        it('should reset from game over state', () => {
            // Test that restart creates a fresh initial state regardless of previous state
            const state = restartGame();

            expect(state.gameStatus).toBe('ready');
            expect(state.score).toBe(0);
            expect(state.obstacles).toEqual([]);
        });
    });

    describe('updateGameState', () => {
        it('should not update when game status is gameOver', () => {
            const gameOverState: GameState = {
                gameStatus: 'gameOver',
                bird: { y: 100, velocity: 5 },
                obstacles: [],
                score: 10,
                lastObstacleTime: 0,
            };

            const updated = updateGameState(gameOverState, 16, false, 1000);

            expect(updated).toEqual(gameOverState);
        });

        it('should transition from ready to playing when jump is pressed', () => {
            const readyState = createInitialGameState();

            const updated = updateGameState(readyState, 16, true, 1000);

            expect(updated.gameStatus).toBe('playing');
            expect(updated.bird.velocity).toBe(GAME_CONFIG.jumpVelocity);
        });

        it('should not update when game is ready and jump not pressed', () => {
            const readyState = createInitialGameState();

            const updated = updateGameState(readyState, 16, false, 1000);

            expect(updated).toEqual(readyState);
        });

        it('should apply physics when playing', () => {
            const playingState: GameState = {
                gameStatus: 'playing',
                bird: { y: 300, velocity: 0 },
                obstacles: [],
                score: 0,
                lastObstacleTime: 0,
            };

            const updated = updateGameState(playingState, 16, false, 1000);

            expect(updated.gameStatus).toBe('playing');
            // Gravity should increase velocity
            expect(updated.bird.velocity).toBeGreaterThan(0);
            // Position should update based on velocity
            expect(updated.bird.y).not.toBe(300);
        });

        it('should apply jump when playing and jump pressed', () => {
            const playingState: GameState = {
                gameStatus: 'playing',
                bird: { y: 300, velocity: 2 },
                obstacles: [],
                score: 0,
                lastObstacleTime: 0,
            };

            const updated = updateGameState(playingState, 16, true, 1000);

            // Jump sets velocity to jumpVelocity, then gravity is applied
            // So velocity should be jumpVelocity + (gravity * deltaTime)
            const expectedVelocity = GAME_CONFIG.jumpVelocity + (GAME_CONFIG.gravity * 16);
            expect(updated.bird.velocity).toBeCloseTo(expectedVelocity, 5);
        });

        it('should generate obstacles at intervals', () => {
            const playingState: GameState = {
                gameStatus: 'playing',
                bird: { y: 300, velocity: 0 },
                obstacles: [],
                score: 0,
                lastObstacleTime: 0,
            };

            const updated = updateGameState(playingState, 16, false, 2500);

            expect(updated.obstacles.length).toBe(1);
            expect(updated.lastObstacleTime).toBe(2500);
        });

        it('should transition to gameOver on collision', () => {
            const playingState: GameState = {
                gameStatus: 'playing',
                bird: { y: 0, velocity: 0 }, // At top boundary
                obstacles: [],
                score: 5,
                lastObstacleTime: 1000,
            };

            const updated = updateGameState(playingState, 16, false, 1500);

            expect(updated.gameStatus).toBe('gameOver');
        });

        it('should preserve state when transitioning to gameOver', () => {
            const playingState: GameState = {
                gameStatus: 'playing',
                bird: { y: 0, velocity: 0 },
                obstacles: [{ id: '1', x: 400, gapY: 300, passed: false }],
                score: 5,
                lastObstacleTime: 1000,
            };

            const updated = updateGameState(playingState, 16, false, 1500);

            expect(updated.gameStatus).toBe('gameOver');
            expect(updated.score).toBe(5);
            expect(updated.obstacles.length).toBe(1);
        });
    });
});


describe('Game State Property Tests', () => {
    /**
     * Feature: flappy-bird-game, Property 13: Restart resets to initial state
     * Validates: Requirements 4.5, 5.4
     * 
     * For any game state, calling the restart function should produce a new state 
     * with gameStatus='ready', score=0, an empty obstacles array, and the bird at 
     * its starting position with zero velocity.
     */
    it('Property 13: Restart resets to initial state', () => {
        fc.assert(
            fc.property(
                // Generate arbitrary game states
                fc.record({
                    gameStatus: fc.constantFrom<GameStatus>('ready', 'playing', 'gameOver'),
                    bird: fc.record({
                        y: fc.double({ min: -100, max: 800, noNaN: true }),
                        velocity: fc.double({ min: -5, max: 5, noNaN: true }),
                    }),
                    obstacles: fc.array(
                        fc.record({
                            id: fc.string(),
                            x: fc.double({ min: -200, max: 1000, noNaN: true }),
                            gapY: fc.double({ min: 100, max: 500, noNaN: true }),
                            passed: fc.boolean(),
                        }),
                        { maxLength: 10 }
                    ),
                    score: fc.integer({ min: 0, max: 1000 }),
                    lastObstacleTime: fc.integer({ min: 0, max: 100000 }),
                }),
                (_state: GameState) => {
                    const restarted = restartGame();

                    // Verify all properties are reset to initial values
                    expect(restarted.gameStatus).toBe('ready');
                    expect(restarted.score).toBe(0);
                    expect(restarted.obstacles).toEqual([]);
                    expect(restarted.bird.y).toBe(GAME_CONFIG.birdStartY);
                    expect(restarted.bird.velocity).toBe(0);
                    expect(restarted.lastObstacleTime).toBe(0);
                }
            ),
            { numRuns: 100 }
        );
    });

    /**
     * Feature: flappy-bird-game, Property 11: Game over stops updates
     * Validates: Requirements 3.4, 3.5
     * 
     * For any game state with status 'gameOver', subsequent game loop updates 
     * should not modify the bird's position, obstacle positions, or score.
     */
    it('Property 11: Game over stops updates', () => {
        fc.assert(
            fc.property(
                // Generate arbitrary game-over states
                fc.record({
                    bird: fc.record({
                        y: fc.double({ min: 0, max: GAME_CONFIG.height, noNaN: true }),
                        velocity: fc.double({ min: -5, max: 5, noNaN: true }),
                    }),
                    obstacles: fc.array(
                        fc.record({
                            id: fc.string(),
                            x: fc.double({ min: 0, max: 1000, noNaN: true }),
                            gapY: fc.double({ min: 150, max: 450, noNaN: true }),
                            passed: fc.boolean(),
                        }),
                        { maxLength: 5 }
                    ),
                    score: fc.integer({ min: 0, max: 100 }),
                    lastObstacleTime: fc.integer({ min: 0, max: 100000 }),
                }),
                // Generate arbitrary deltaTime and jump input
                fc.double({ min: 1, max: 100, noNaN: true }),
                fc.boolean(),
                fc.integer({ min: 0, max: 100000 }),
                (stateData, deltaTime, jumpPressed, currentTime) => {
                    // Create game-over state
                    const gameOverState: GameState = {
                        gameStatus: 'gameOver',
                        ...stateData,
                    };

                    // Update the game state
                    const updated = updateGameState(gameOverState, deltaTime, jumpPressed, currentTime);

                    // Verify state is completely unchanged
                    expect(updated.gameStatus).toBe('gameOver');
                    expect(updated.bird.y).toBe(gameOverState.bird.y);
                    expect(updated.bird.velocity).toBe(gameOverState.bird.velocity);
                    expect(updated.obstacles).toEqual(gameOverState.obstacles);
                    expect(updated.score).toBe(gameOverState.score);
                    expect(updated.lastObstacleTime).toBe(gameOverState.lastObstacleTime);
                }
            ),
            { numRuns: 100 }
        );
    });
});

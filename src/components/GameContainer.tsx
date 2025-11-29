import { useState, useRef, useEffect } from 'react';
import { Box, useTheme, IconButton, Typography } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import type { GameState } from '../types';
import { createInitialGameState, updateGameState, restartGame } from '../utils/gameState';
import { GAME_CONFIG } from '../utils/constants';
import { lightTheme, darkTheme } from '../utils/theme';
import { Bird } from './Bird';
import { Obstacle } from './Obstacle';
import { ScoreDisplay } from './ScoreDisplay';
import { GameOverScreen } from './GameOverScreen';

interface GameContainerProps {
    toggleTheme: () => void;
    isDark: boolean;
}

export const GameContainer = ({ toggleTheme, isDark }: GameContainerProps) => {
    // Game state
    const [gameState, setGameState] = useState<GameState>(() => createInitialGameState());
    
    // Refs for animation frame and timing
    const animationFrameRef = useRef<number | null>(null);
    const lastTimeRef = useRef<number>(0);
    const jumpPressedRef = useRef<boolean>(false);
    const gameStatusRef = useRef<string>(gameState.gameStatus);
    
    // Theme
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const gameTheme = isDarkMode ? darkTheme : lightTheme;

    // Game control functions
    const handleRestart = () => {
        const newState = restartGame();
        setGameState(newState);
        // Reset refs
        lastTimeRef.current = 0;
        jumpPressedRef.current = false;
    };

    // Input handling
    useEffect(() => {
        // Keyboard event listener
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code === 'Space') {
                event.preventDefault(); // Prevent page scroll
                
                if (gameState.gameStatus === 'ready') {
                    // Start game on first jump - use 0 as initial timestamp
                    const newState = updateGameState(gameState, 0, true, 0);
                    setGameState(newState);
                } else if (gameState.gameStatus === 'playing') {
                    // Set jump flag for next frame
                    jumpPressedRef.current = true;
                }
            }
        };

        // Mouse/touch click listener
        const handleClick = () => {
            if (gameState.gameStatus === 'ready') {
                // Start game on first jump - use 0 as initial timestamp
                const newState = updateGameState(gameState, 0, true, 0);
                setGameState(newState);
            } else if (gameState.gameStatus === 'playing') {
                // Set jump flag for next frame
                jumpPressedRef.current = true;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('click', handleClick);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('click', handleClick);
        };
    }, [gameState]); // Re-attach when game state changes

    // Update game status ref whenever it changes
    useEffect(() => {
        gameStatusRef.current = gameState.gameStatus;
    }, [gameState.gameStatus]);

    // Game loop
    useEffect(() => {
        const gameLoop = (timestamp: number) => {
            // Calculate deltaTime
            if (lastTimeRef.current === 0) {
                lastTimeRef.current = timestamp;
            }
            const deltaTime = timestamp - lastTimeRef.current;
            lastTimeRef.current = timestamp;

            // Update game state
            if (gameStatusRef.current === 'playing') {
                const jumpFlag = jumpPressedRef.current;
                
                setGameState(prevState => {
                    const newState = updateGameState(
                        prevState,
                        deltaTime,
                        jumpFlag,
                        timestamp
                    );
                    
                    return newState;
                });
                
                // Reset jump flag after processing
                jumpPressedRef.current = false;
            }

            // Request next frame if game is still playing
            if (gameStatusRef.current === 'playing') {
                animationFrameRef.current = requestAnimationFrame(gameLoop);
            }
        };

        // Start game loop if playing
        if (gameState.gameStatus === 'playing') {
            lastTimeRef.current = 0; // Reset timing on state change
            animationFrameRef.current = requestAnimationFrame(gameLoop);
        }

        // Cleanup on unmount or when game stops
        return () => {
            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
        };
    }, [gameState.gameStatus]); // Re-run when game status changes

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: gameTheme.background,
                overflow: 'hidden',
                transition: 'background-color 0.3s ease-in-out',
            }}
        >
            {/* Bird */}
            <Bird y={gameState.bird.y} size={GAME_CONFIG.birdSize} />

            {/* Obstacles */}
            {gameState.obstacles.map((obstacle) => (
                <Obstacle
                    key={obstacle.id}
                    x={obstacle.x}
                    gapY={obstacle.gapY}
                    gapHeight={GAME_CONFIG.obstacleGap}
                    width={GAME_CONFIG.obstacleWidth}
                />
            ))}

            {/* Score Display */}
            <ScoreDisplay score={gameState.score} />

            {/* Theme Toggle */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 80,
                    right: 20,
                    zIndex: 20,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                    borderRadius: 2,
                    padding: '4px',
                }}
            >
                {/* Light Mode */}
                <Box
                    onClick={toggleTheme}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        padding: '6px 12px',
                        borderRadius: 1.5,
                        cursor: 'pointer',
                        border: !isDark ? '2px solid' : '2px solid transparent',
                        borderColor: !isDark ? (isDark ? '#fff' : '#000') : 'transparent',
                        backgroundColor: !isDark ? (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)') : 'transparent',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                        },
                    }}
                >
                    <LightModeIcon 
                        fontSize="small" 
                        sx={{ 
                            color: !isDark ? '#FFA500' : (isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)'),
                        }} 
                    />
                    <Typography
                        variant="body2"
                        sx={{
                            color: isDark ? 'rgba(255, 255, 255, 0.4)' : '#000',
                            fontWeight: !isDark ? 600 : 400,
                            fontSize: '0.875rem',
                            userSelect: 'none',
                        }}
                    >
                        Light
                    </Typography>
                </Box>

                {/* Dark Mode */}
                <Box
                    onClick={toggleTheme}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        padding: '6px 12px',
                        borderRadius: 1.5,
                        cursor: 'pointer',
                        border: isDark ? '2px solid' : '2px solid transparent',
                        borderColor: isDark ? (isDark ? '#fff' : '#000') : 'transparent',
                        backgroundColor: isDark ? (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)') : 'transparent',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                        },
                    }}
                >
                    <DarkModeIcon 
                        fontSize="small" 
                        sx={{ 
                            color: isDark ? '#4A90E2' : (isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)'),
                        }} 
                    />
                    <Typography
                        variant="body2"
                        sx={{
                            color: isDark ? '#fff' : 'rgba(0, 0, 0, 0.4)',
                            fontWeight: isDark ? 600 : 400,
                            fontSize: '0.875rem',
                            userSelect: 'none',
                        }}
                    >
                        Dark
                    </Typography>
                </Box>
            </Box>

            {/* Start Instructions */}
            {gameState.gameStatus === 'ready' && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                        color: isDarkMode ? '#ffffff' : '#000000',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        pointerEvents: 'none',
                        zIndex: 10,
                    }}
                >
                    <Box sx={{ mb: 2 }}>Click or Press Space to Start</Box>
                    <Box sx={{ fontSize: '16px', fontWeight: 'normal' }}>
                        Keep clicking/pressing to fly!
                    </Box>
                </Box>
            )}

            {/* Game Over Screen */}
            {gameState.gameStatus === 'gameOver' && (
                <GameOverScreen score={gameState.score} onRestart={handleRestart} />
            )}
        </Box>
    );
};

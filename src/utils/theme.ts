import { createTheme, type Theme } from '@mui/material/styles';
import type { GameTheme } from '../types';

// Light theme colors
export const lightTheme: GameTheme = {
    background: '#FFFFFF',      // White
    bird: '#FFD700',            // Gold
    obstacle: '#228B22',        // Forest green
    score: '#000000',           // Black
    gameOver: {
        background: 'rgba(255, 255, 255, 0.95)',
        text: '#000000',
    },
};

// Dark theme colors
export const darkTheme: GameTheme = {
    background: '#0a0a0a',      // Very dark background
    bird: '#FFA500',            // Orange
    obstacle: '#1E90FF',        // Dodger blue
    score: '#ffffff',           // White
    gameOver: {
        background: 'rgba(0, 0, 0, 0.95)',
        text: '#ffffff',
    },
};

// Create MUI theme for light mode
export const createLightTheme = (): Theme => {
    return createTheme({
        palette: {
            mode: 'light',
            primary: {
                main: lightTheme.bird,
            },
            secondary: {
                main: lightTheme.obstacle,
            },
            background: {
                default: lightTheme.background,
                paper: lightTheme.gameOver.background,
            },
            text: {
                primary: lightTheme.score,
                secondary: lightTheme.gameOver.text,
            },
        },
        typography: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        },
    });
};

// Create MUI theme for dark mode
export const createDarkTheme = (): Theme => {
    return createTheme({
        palette: {
            mode: 'dark',
            primary: {
                main: darkTheme.bird,
            },
            secondary: {
                main: darkTheme.obstacle,
            },
            background: {
                default: darkTheme.background,
                paper: darkTheme.gameOver.background,
            },
            text: {
                primary: darkTheme.score,
                secondary: darkTheme.gameOver.text,
            },
        },
        typography: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        },
    });
};

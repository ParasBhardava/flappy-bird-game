import { Box, Typography, Button, useTheme } from '@mui/material';
import { lightTheme, darkTheme } from '../utils/theme';

interface GameOverScreenProps {
    score: number;
    onRestart: () => void;
}

export const GameOverScreen = ({ score, onRestart }: GameOverScreenProps) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const gameTheme = isDarkMode ? darkTheme : lightTheme;

    return (
        <Box
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: gameTheme.gameOver.background,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 100,
                backdropFilter: 'blur(4px)',
                transition: 'background-color 0.3s ease-in-out',
            }}
        >
            <Typography
                variant="h2"
                component="div"
                sx={{
                    color: gameTheme.gameOver.text,
                    fontWeight: 'bold',
                    marginBottom: 3,
                    userSelect: 'none',
                    transition: 'color 0.3s ease-in-out',
                    textShadow: isDarkMode 
                        ? '2px 2px 8px rgba(0, 0, 0, 0.8)' 
                        : '2px 2px 8px rgba(0, 0, 0, 0.2)',
                }}
            >
                Game Over
            </Typography>
            
            <Typography
                variant="h4"
                component="div"
                sx={{
                    color: gameTheme.gameOver.text,
                    marginBottom: 4,
                    userSelect: 'none',
                    transition: 'color 0.3s ease-in-out',
                }}
            >
                Final Score: {score}
            </Typography>
            
            <Button
                variant="contained"
                size="large"
                onClick={onRestart}
                sx={{
                    backgroundColor: isDarkMode ? '#4a5568' : '#2196f3',
                    color: '#ffffff',
                    fontWeight: 'bold',
                    padding: '12px 32px',
                    fontSize: '1.1rem',
                    borderRadius: 2,
                    boxShadow: isDarkMode 
                        ? '0 4px 12px rgba(0, 0, 0, 0.5)' 
                        : '0 4px 12px rgba(33, 150, 243, 0.4)',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        backgroundColor: isDarkMode ? '#5a6578' : '#1976d2',
                        transform: 'translateY(-2px)',
                        boxShadow: isDarkMode 
                            ? '0 6px 16px rgba(0, 0, 0, 0.6)' 
                            : '0 6px 16px rgba(33, 150, 243, 0.5)',
                    },
                    '&:active': {
                        transform: 'translateY(0)',
                        boxShadow: isDarkMode 
                            ? '0 2px 8px rgba(0, 0, 0, 0.4)' 
                            : '0 2px 8px rgba(33, 150, 243, 0.3)',
                    },
                }}
            >
                Restart Game
            </Button>
        </Box>
    );
};

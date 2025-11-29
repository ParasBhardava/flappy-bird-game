import { Box, Typography, useTheme } from '@mui/material';
import { lightTheme, darkTheme } from '../utils/theme';

interface ScoreDisplayProps {
    score: number;
}

export const ScoreDisplay = ({ score }: ScoreDisplayProps) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const gameTheme = isDarkMode ? darkTheme : lightTheme;

    return (
        <Box
            sx={{
                position: 'absolute',
                top: 20,
                right: 20,
                zIndex: 20,
            }}
        >
            <Typography
                variant="h4"
                component="div"
                sx={{
                    color: gameTheme.score,
                    fontWeight: 'bold',
                    textShadow: isDarkMode 
                        ? '2px 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(255, 255, 255, 0.3)' 
                        : '2px 2px 8px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 255, 255, 0.6)',
                    userSelect: 'none',
                    transition: 'color 0.3s ease-in-out, text-shadow 0.3s ease-in-out',
                }}
            >
                Score: {score}
            </Typography>
        </Box>
    );
};

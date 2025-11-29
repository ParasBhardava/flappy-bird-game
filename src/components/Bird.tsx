import { Box, useTheme } from '@mui/material';
import { GAME_CONFIG } from '../utils/constants';
import { lightTheme, darkTheme } from '../utils/theme';

interface BirdProps {
    y: number;
    size: number;
}

export const Bird = ({ y, size }: BirdProps) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const gameTheme = isDarkMode ? darkTheme : lightTheme;

    return (
        <Box
            sx={{
                position: 'absolute',
                left: GAME_CONFIG.birdStartX,
                top: y,
                width: size,
                height: size * 0.8,
                transform: 'translate(-50%, -50%)',
                transition: 'background-color 0.3s ease-in-out',
                zIndex: 10,
            }}
        >
            {/* Bird body */}
            <Box
                sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backgroundColor: gameTheme.bird,
                    borderRadius: '50% 50% 50% 40%',
                    boxShadow: isDarkMode 
                        ? '0 4px 12px rgba(255, 165, 0, 0.4)' 
                        : '0 4px 12px rgba(255, 215, 0, 0.4)',
                }}
            />
            {/* Wing */}
            <Box
                sx={{
                    position: 'absolute',
                    width: '60%',
                    height: '40%',
                    backgroundColor: isDarkMode ? '#FF8C00' : '#FFB700',
                    borderRadius: '50%',
                    top: '30%',
                    left: '20%',
                    opacity: 0.8,
                }}
            />
            {/* Eye */}
            <Box
                sx={{
                    position: 'absolute',
                    width: '20%',
                    height: '20%',
                    backgroundColor: '#000',
                    borderRadius: '50%',
                    top: '25%',
                    right: '15%',
                    border: '2px solid #fff',
                }}
            />
            {/* Beak */}
            <Box
                sx={{
                    position: 'absolute',
                    width: 0,
                    height: 0,
                    borderTop: `${size * 0.15}px solid transparent`,
                    borderBottom: `${size * 0.15}px solid transparent`,
                    borderLeft: `${size * 0.25}px solid ${isDarkMode ? '#FF6B00' : '#FF8C00'}`,
                    top: '35%',
                    right: '-15%',
                }}
            />
        </Box>
    );
};


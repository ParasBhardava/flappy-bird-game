import { Box, useTheme } from '@mui/material';
import { GAME_CONFIG } from '../utils/constants';
import { lightTheme, darkTheme } from '../utils/theme';

interface ObstacleProps {
    x: number;
    gapY: number;
    gapHeight: number;
    width: number;
}

export const Obstacle = ({ x, gapY, gapHeight, width }: ObstacleProps) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const gameTheme = isDarkMode ? darkTheme : lightTheme;

    // Calculate the top pipe height (from top of canvas to top of gap)
    const topPipeHeight = gapY - gapHeight / 2;
    
    // Calculate the bottom pipe height (from bottom of gap to bottom of canvas)
    const bottomPipeTop = gapY + gapHeight / 2;
    const bottomPipeHeight = GAME_CONFIG.height - bottomPipeTop;

    return (
        <>
            {/* Top pipe */}
            <Box
                sx={{
                    position: 'absolute',
                    left: x,
                    top: 0,
                    width: width,
                    height: topPipeHeight,
                    backgroundColor: gameTheme.obstacle,
                    transition: 'background-color 0.3s ease-in-out',
                    zIndex: 5,
                    borderRadius: '0 0 8px 8px',
                    boxShadow: isDarkMode 
                        ? '0 2px 8px rgba(0, 0, 0, 0.5)' 
                        : '0 2px 8px rgba(0, 0, 0, 0.3)',
                }}
            />
            
            {/* Bottom pipe */}
            <Box
                sx={{
                    position: 'absolute',
                    left: x,
                    top: bottomPipeTop,
                    width: width,
                    height: bottomPipeHeight,
                    backgroundColor: gameTheme.obstacle,
                    transition: 'background-color 0.3s ease-in-out',
                    zIndex: 5,
                    borderRadius: '8px 8px 0 0',
                    boxShadow: isDarkMode 
                        ? '0 -2px 8px rgba(0, 0, 0, 0.5)' 
                        : '0 -2px 8px rgba(0, 0, 0, 0.3)',
                }}
            />
        </>
    );
};

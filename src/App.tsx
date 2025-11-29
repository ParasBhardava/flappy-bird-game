import { useMemo, useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createLightTheme, createDarkTheme } from './utils/theme';
import { GameContainer } from './components/GameContainer';
import './App.css';

function App() {
  // State for theme - only light or dark, no auto
  const [isDark, setIsDark] = useState(false);

  // Create theme based on preference
  const theme = useMemo(
    () => (isDark ? createDarkTheme() : createLightTheme()),
    [isDark]
  );

  // Toggle theme
  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GameContainer toggleTheme={toggleTheme} isDark={isDark} />
    </ThemeProvider>
  );
}

export default App;

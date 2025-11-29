# Implementation Plan

- [x] 1. Set up project structure and dependencies





  - Initialize Vite + React + TypeScript project
  - Install Material-UI and its dependencies
  - Install Vitest and fast-check for testing
  - Configure Vitest in vite.config.ts
  - Create basic folder structure (components, hooks, utils, types)
  - _Requirements: 8.1, 8.2, 8.3, 8.5_

- [x] 2. Define core types and constants




  - Create types.ts with GameState, BirdState, Obstacle, and GameStatus interfaces
  - Create constants.ts with GAME_CONFIG object containing all game parameters
  - Create theme configuration with light and dark color schemes
  - _Requirements: 8.4_

- [x] 3. Implement core game logic functions





  - [x] 3.1 Create physics calculation functions


    - Implement applyGravity(bird, deltaTime) function
    - Implement applyJump(bird) function
    - Implement updateBirdPosition(bird, deltaTime) function
    - _Requirements: 1.2, 1.3, 1.4_
  
  - [x] 3.2 Write property test for physics calculations







    - **Property 1: Jump applies upward velocity**
    - **Property 2: Gravity increases downward velocity**
    - **Property 3: Position updates follow velocity**
    - **Property 14: Physics calculations are frame-rate independent**
    - **Validates: Requirements 1.2, 1.3, 1.4, 7.5**
  
  - [x] 3.3 Create obstacle management functions


    - Implement generateObstacle(currentTime) function
    - Implement updateObstacles(obstacles, deltaTime) function
    - Implement removeOffscreenObstacles(obstacles) function
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  
  - [x] 3.4 Write property tests for obstacle management






    - **Property 5: Obstacles generate at intervals**
    - **Property 6: Generated obstacles have valid gap positions**
    - **Property 7: New obstacles start at right edge**
    - **Property 8: Obstacles move left at constant speed**
    - **Property 9: Off-screen obstacles are removed**
    - **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5**
-

- [x] 4. Implement collision detection



  - [x] 4.1 Create collision detection functions

    - Implement checkBirdObstacleCollision(bird, obstacle) function
    - Implement checkBirdBoundaryCollision(bird) function
    - Implement checkCollisions(bird, obstacles) function that returns boolean
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [x] 4.2 Write property test for collision detection






    - **Property 10: Collision detection triggers game over**
    - **Validates: Requirements 3.1**
  
  - [x] 4.3 Write unit tests for boundary collision edge cases




    - Test bird at top boundary (y = 0)
    - Test bird at bottom boundary (y = 600)
    - Test bird just inside boundaries
    - _Requirements: 3.2, 3.3_

- [x] 5. Implement score tracking




  - [x] 5.1 Create score management functions

    - Implement updateScore(bird, obstacles, currentScore) function
    - Mark obstacles as passed when bird x exceeds obstacle x + width
    - Return new score and updated obstacles array
    - _Requirements: 4.1, 4.2, 4.5_
  -

  - [x] 5.2 Write property test for score tracking





    - **Property 12: Passing obstacles increments score**
    - **Validates: Requirements 4.2**
  
  - [x] 5.3 Write unit test for initial score




    - Test that new game state has score = 0
    - _Requirements: 4.1_

- [x] 6. Implement game state management




  - [x] 6.1 Create game state initialization and reset functions


    - Implement createInitialGameState() function
    - Implement restartGame() function that returns fresh initial state
    - _Requirements: 4.5, 5.4, 5.5_
  
  - [x] 6.2 Write property test for restart function








    - **Property 13: Restart resets to initial state**
    - **Validates: Requirements 4.5, 5.4**
  
  - [x] 6.3 Create game state update function


    - Implement updateGameState(state, deltaTime, jumpPressed) function
    - Handle state transitions (ready → playing → gameOver)
    - Ensure game-over state is immutable
    - _Requirements: 3.4, 3.5_
  

  - [x] 6.4 Write property test for game-over immutability















    - **Property 11: Game over stops updates**
    - **Validates: Requirements 3.4, 3.5**

- [x] 7. Set up MUI theme provider


  - Create theme configuration with light and dark modes
  - Implement custom theme with game-specific colors
  - Set up ThemeProvider in App component
  - Implement system theme preference detection
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_


- [x] 8. Create Bird component



  - Implement Bird component with position props
  - Style bird using MUI Box with theme-aware colors
  - Use absolute positioning and CSS transforms
  - Apply circular shape with appropriate size
  - _Requirements: 1.1, 1.5_

- [x] 9. Create Obstacle component





  - Implement Obstacle component with x, gapY, gapHeight, width props
  - Render top and bottom pipes with gap in between
  - Style obstacles using theme-aware colors
  - Use absolute positioning for placement
  - _Requirements: 2.1, 2.2, 2.3_


- [x] 10. Create ScoreDisplay component



  - Implement ScoreDisplay component with score prop
  - Position in top-right corner using MUI Box
  - Style with theme-aware colors and typography
  - Use MUI Typography component for text
  - _Requirements: 4.3_

- [x] 11. Create GameOverScreen component




  - Implement GameOverScreen component with score and onRestart props
  - Create overlay with semi-transparent background
  - Display final score prominently using MUI Typography
  - Add restart button using MUI Button
  - Center content using MUI Box with flexbox
  - Apply theme-aware styling
  - _Requirements: 5.1, 5.2, 5.3_
-

- [x] 12. Implement GameContainer component



  - [x] 12.1 Set up component structure and state


    - Create GameContainer component with game state using useState
    - Initialize with createInitialGameState()
    - Set up refs for animation frame and timing
    - _Requirements: 8.5_
  
  - [x] 12.2 Implement game loop with requestAnimationFrame


    - Create gameLoop function that calculates deltaTime
    - Call updateGameState with current state and deltaTime
    - Request next animation frame when game is playing
    - Handle cleanup on component unmount
    - _Requirements: 7.1, 7.2, 7.3, 7.5_
  
  - [x] 12.3 Implement input handling


    - Add keyboard event listener for spacebar
    - Add click event listener for mouse/touch input
    - Call handleJump function to set jump flag
    - Prevent default behavior for spacebar
    - _Requirements: 1.2_
  
  - [x] 12.4 Implement game control functions


    - Create startGame function to transition from ready to playing
    - Create handleRestart function that calls restartGame()
    - Ensure proper state transitions
    - _Requirements: 5.4_
  
  - [x] 12.5 Render game canvas and components


    - Create game canvas container with fixed dimensions
    - Render Bird component with current bird state
    - Map and render Obstacle components for each obstacle
    - Render ScoreDisplay with current score
    - Conditionally render GameOverScreen when game is over
    - Apply theme-aware background color
    - _Requirements: 1.1, 2.1, 4.3, 5.1_

- [x] 13. Write integration tests for GameContainer





  - Test complete game flow: start → play → collision → game over → restart
  - Test input handling triggers state changes
  - Test score increments as obstacles are passed
  - _Requirements: 1.2, 3.1, 4.2, 5.4_

- [x] 14. Create App component and entry point





  - Set up App component with MUI ThemeProvider
  - Wrap GameContainer in theme provider
  - Configure theme to use system preference
  - Create main.tsx entry point
  - Add basic global styles
  - _Requirements: 6.1, 8.1, 8.2, 8.3_

- [x] 15. Add visual polish and styling



  - Add smooth transitions for theme changes
  - Ensure proper z-index layering for game elements
  - Add hover effects to restart button
  - Ensure responsive layout within game canvas
  - Test visual appearance in both light and dark themes
  - _Requirements: 6.2, 6.3, 6.4, 6.5_

- [x] 16. Final checkpoint - Ensure all tests pass





  - Ensure all tests pass, ask the user if questions arise.

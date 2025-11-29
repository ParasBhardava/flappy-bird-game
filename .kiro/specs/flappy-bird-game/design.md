# Design Document

## Overview

The Flappy Bird game is a browser-based game built with React, TypeScript, Vite, and Material-UI. The architecture follows a component-based design with clear separation between game logic, rendering, and UI concerns. The game uses a requestAnimationFrame-based game loop for smooth 60fps animations, React state management for game state, and MUI's theming system for light/dark mode support.

The core gameplay involves a bird that automatically moves forward while gravity pulls it down. Players control the bird's vertical movement by pressing spacebar or clicking, causing the bird to jump upward. Obstacles scroll from right to left, and the player must navigate through gaps. The game tracks score and detects collisions to trigger game-over states.

## Architecture

### Component Structure

```
App
├── ThemeProvider (MUI)
│   └── GameContainer
│       ├── GameCanvas
│       │   ├── Bird
│       │   └── Obstacle (multiple instances)
│       ├── ScoreDisplay
│       └── GameOverScreen
```

### Key Architectural Decisions

1. **Game Loop**: Use `requestAnimationFrame` for the main game loop to ensure smooth 60fps rendering and consistent physics calculations
2. **State Management**: Use React's `useState` and `useReducer` for game state, avoiding external state management libraries for simplicity
3. **Rendering**: Use CSS transforms and absolute positioning for game elements to leverage GPU acceleration
4. **Physics**: Implement simple Euler integration for velocity and position updates
5. **Theme Integration**: Leverage MUI's `ThemeProvider` and `useTheme` hook for seamless light/dark mode support

## Components and Interfaces

### GameContainer Component

The main game component that manages game state and orchestrates the game loop.

**Props**: None (root game component)

**State**:
```typescript
interface GameState {
  gameStatus: 'ready' | 'playing' | 'gameOver';
  bird: BirdState;
  obstacles: Obstacle[];
  score: number;
  lastObstacleTime: number;
}

interface BirdState {
  y: number;        // Vertical position (0 = top)
  velocity: number; // Vertical velocity (positive = downward)
}

interface Obstacle {
  id: string;
  x: number;        // Horizontal position
  gapY: number;     // Vertical position of gap center
  passed: boolean;  // Whether bird has passed this obstacle
}
```

**Key Methods**:
- `startGame()`: Initialize game state and start the game loop
- `handleJump()`: Apply upward velocity to the bird
- `gameLoop(timestamp)`: Main game loop that updates physics and checks collisions
- `updateBird(deltaTime)`: Update bird position based on velocity and gravity
- `updateObstacles(deltaTime)`: Move obstacles and generate new ones
- `checkCollisions()`: Detect collisions between bird and obstacles/boundaries
- `restartGame()`: Reset game state to initial values

### Bird Component

Renders the bird character with appropriate styling based on theme.

**Props**:
```typescript
interface BirdProps {
  y: number;
  size: number;
}
```

### Obstacle Component

Renders a single obstacle (top and bottom pipes with a gap).

**Props**:
```typescript
interface ObstacleProps {
  x: number;
  gapY: number;
  gapHeight: number;
  width: number;
}
```

### ScoreDisplay Component

Displays the current score in the top-right corner.

**Props**:
```typescript
interface ScoreDisplayProps {
  score: number;
}
```

### GameOverScreen Component

Displays game-over overlay with final score and restart button.

**Props**:
```typescript
interface GameOverScreenProps {
  score: number;
  onRestart: () => void;
}
```

## Data Models

### Game Constants

```typescript
const GAME_CONFIG = {
  // Canvas dimensions
  width: 800,
  height: 600,
  
  // Bird physics
  gravity: 0.0008,           // Pixels per ms²
  jumpVelocity: -0.6,        // Pixels per ms (negative = upward)
  birdSize: 40,              // Pixels
  birdStartX: 150,           // Fixed horizontal position
  birdStartY: 300,           // Starting vertical position
  
  // Obstacle configuration
  obstacleWidth: 80,         // Pixels
  obstacleGap: 180,          // Pixels (vertical gap height)
  obstacleSpeed: 0.2,        // Pixels per ms
  obstacleInterval: 2000,    // Milliseconds between obstacles
  minGapY: 150,              // Minimum gap center position
  maxGapY: 450,              // Maximum gap center position
  
  // Collision detection
  birdRadius: 18,            // Effective collision radius
  
  // Boundaries
  topBoundary: 0,
  bottomBoundary: 600,
};
```

### Theme Colors

```typescript
interface GameTheme {
  background: string;
  bird: string;
  obstacle: string;
  score: string;
  gameOver: {
    background: string;
    text: string;
  };
}

// Light theme colors
const lightTheme: GameTheme = {
  background: '#87CEEB',      // Sky blue
  bird: '#FFD700',            // Gold
  obstacle: '#228B22',        // Forest green
  score: '#000000',           // Black
  gameOver: {
    background: 'rgba(255, 255, 255, 0.95)',
    text: '#000000',
  },
};

// Dark theme colors
const darkTheme: GameTheme = {
  background: '#1a1a2e',      // Dark blue
  bird: '#FFA500',            // Orange
  obstacle: '#16213e',        // Dark navy
  score: '#ffffff',           // White
  gameOver: {
    background: 'rgba(0, 0, 0, 0.95)',
    text: '#ffffff',
  },
};
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Jump applies upward velocity
*For any* bird state, when a jump action is applied, the bird's velocity should be set to the jump velocity constant (negative value indicating upward movement).
**Validates: Requirements 1.2**

### Property 2: Gravity increases downward velocity
*For any* bird state and positive time delta, applying physics updates should increase the bird's velocity by gravity × deltaTime (making it more positive/downward).
**Validates: Requirements 1.3**

### Property 3: Position updates follow velocity
*For any* bird state and time delta, updating the bird's position should result in a new y-position equal to the old y-position plus velocity × deltaTime.
**Validates: Requirements 1.4**

### Property 4: Bird horizontal position invariant
*For any* game state update during active gameplay, the bird's x-position should remain constant and equal to the configured starting x-position.
**Validates: Requirements 1.5**

### Property 5: Obstacles generate at intervals
*For any* game state where the time since the last obstacle exceeds the obstacle interval, updating the game should generate a new obstacle.
**Validates: Requirements 2.1**

### Property 6: Generated obstacles have valid gap positions
*For any* newly generated obstacle, its gap y-position should be within the configured minimum and maximum bounds (minGapY ≤ gapY ≤ maxGapY).
**Validates: Requirements 2.2**

### Property 7: New obstacles start at right edge
*For any* newly generated obstacle, its x-position should equal the game width.
**Validates: Requirements 2.3**

### Property 8: Obstacles move left at constant speed
*For any* obstacle and positive time delta, updating the obstacle's position should result in a new x-position equal to the old x-position minus obstacleSpeed × deltaTime.
**Validates: Requirements 2.4**

### Property 9: Off-screen obstacles are removed
*For any* obstacle list after an update, no obstacle should have an x-position less than negative obstacle width (fully off-screen to the left).
**Validates: Requirements 2.5**

### Property 10: Collision detection triggers game over
*For any* bird position and obstacle, if the bird's bounding circle intersects with the obstacle's geometry (top or bottom pipe), the game status should be 'gameOver'.
**Validates: Requirements 3.1**

### Property 11: Game over stops updates
*For any* game state with status 'gameOver', subsequent game loop updates should not modify the bird's position, obstacle positions, or score.
**Validates: Requirements 3.4, 3.5**

### Property 12: Passing obstacles increments score
*For any* obstacle that has not been marked as passed, when the bird's x-position exceeds the obstacle's x-position plus obstacle width, the score should increment by 1 and the obstacle should be marked as passed.
**Validates: Requirements 4.2**

### Property 13: Restart resets to initial state
*For any* game state, calling the restart function should produce a new state with gameStatus='ready', score=0, an empty obstacles array, and the bird at its starting position with zero velocity.
**Validates: Requirements 4.5, 5.4**

### Property 14: Physics calculations use deltaTime correctly
*For any* bird state and positive deltaTime, applying physics updates should scale changes proportionally to deltaTime (i.e., doubling deltaTime should approximately double the change in position and velocity, within reasonable tolerance for Euler integration).
**Validates: Requirements 7.5**

*Note: This property verifies that deltaTime is used correctly in calculations, ensuring smooth animation regardless of frame rate. It does not require perfect mathematical frame-rate independence, as Euler integration has acceptable error characteristics for game physics.*

## Error Handling

### Input Validation
- Validate that time deltas passed to physics calculations are positive and reasonable (< 100ms to prevent large jumps)
- Clamp bird velocity to prevent extreme values that could cause the bird to teleport through obstacles

### Boundary Conditions
- Handle edge case where bird spawns at boundary (should not immediately trigger game over)
- Handle rapid input (multiple jumps in quick succession should not stack velocity infinitely)

### State Consistency
- Ensure game state transitions are atomic (ready → playing → gameOver)
- Prevent game loop from running when game is not in 'playing' state
- Ensure restart properly cleans up any pending animation frames

### Theme Handling
- Provide fallback colors if theme detection fails
- Ensure all game elements have defined colors in both light and dark themes

## Testing Strategy

### Unit Testing

We will use **Vitest** as our testing framework, which integrates seamlessly with Vite and provides a Jest-compatible API.

Unit tests will cover:
- **Initial state creation**: Verify that new game states have correct initial values (score=0, bird at starting position, empty obstacles)
- **Restart function**: Verify that restart produces a valid initial state
- **Collision detection edge cases**: Test boundary collisions (top/bottom) and obstacle collisions with specific coordinates
- **Score increment logic**: Test that passing obstacles increments score correctly
- **Obstacle cleanup**: Test that off-screen obstacles are removed

### Property-Based Testing

We will use **fast-check** as our property-based testing library for TypeScript/JavaScript.

Property-based tests will verify the correctness properties defined above:
- Each property test will run a minimum of 100 iterations with randomly generated inputs
- Each test will be tagged with a comment referencing the specific correctness property from this design document
- Format: `// Feature: flappy-bird-game, Property X: [property description]`

Property tests will cover:
- **Physics calculations**: Generate random bird states and time deltas to verify velocity and position updates follow the correct formulas
- **Obstacle generation**: Generate random game states and verify obstacles are created with valid parameters
- **Obstacle movement**: Generate random obstacles and time deltas to verify movement calculations
- **Collision detection**: Generate random bird and obstacle positions to verify collision logic
- **Game state invariants**: Generate random game states and verify that certain properties hold (e.g., bird x-position constant, game-over state immutable)
- **Frame-rate independence**: Generate random time deltas and verify physics produces consistent results

### Integration Testing

Integration tests will verify:
- Complete game loop cycle (start → play → collision → game over → restart)
- Theme switching updates all visual elements
- Input handling triggers correct state changes
- Score tracking across multiple obstacles

### Test Organization

Tests will be co-located with source files using the `.test.ts` suffix:
- `gameLogic.test.ts`: Unit and property tests for core game logic
- `physics.test.ts`: Property tests for physics calculations
- `collision.test.ts`: Unit and property tests for collision detection
- `GameContainer.test.tsx`: Integration tests for the main game component

## Implementation Notes

### Performance Considerations
- Use CSS transforms for positioning to leverage GPU acceleration
- Minimize React re-renders by using proper memoization
- Use `requestAnimationFrame` for smooth 60fps updates
- Consider using `React.memo` for obstacle components since they render frequently

### Accessibility
- Provide keyboard controls (spacebar) in addition to mouse clicks
- Ensure sufficient color contrast in both themes
- Consider adding sound effects with mute option
- Provide clear visual feedback for game state changes

### Future Enhancements
- High score persistence using localStorage
- Difficulty progression (increasing speed over time)
- Sound effects and background music
- Mobile touch controls
- Particle effects for collisions
- Multiple bird character options

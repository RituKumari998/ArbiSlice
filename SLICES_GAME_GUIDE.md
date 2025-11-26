# Slices Game - Implementation Guide

## Overview

The **Slices** game is a puzzle game similar to popular mobile puzzle games, built with Phaser 3 and integrated into the ChainCrush Web3 gaming platform.

## Game Mechanics

### Core Rules
- **Multiple Circular Boards**: Start with 6 circular boards, each divided into equal slices
- **Piece Placement**: Players select pieces (1-3 slice segments) and place them on circles
- **Circle Clearing**: When a circle is fully filled, it clears and awards points
- **Game Over**: Game ends when no valid placement exists for the current piece

### Scoring System
- **Base Points**: +1 point per placed slice
- **Clear Bonus**: +10 points for full circle clears
- **Combo Multiplier**: Consecutive clears multiply the bonus
- **Level Progression**: New circles added as score increases

### Special Pieces
1. **Bomb Slice**: Clears random filled slots in a circle
2. **Rainbow Slice**: Wildcard that fits in any empty slot
3. **Locked Slice**: Cannot be cleared until 2 full clears are done on that circle

### Power-Ups
1. **Shuffle**: Reshuffle current piece (1 available)
2. **Skip**: Discard current piece (1 available)
3. **Auto-Fill**: Instantly complete one circle (0 available, earned via shop)

### Game Modes
- **Normal Mode**: Play until no moves left
- **Timed Mode**: 60 seconds, place pieces quickly
- **Daily Challenge**: Same piece sequence for all players

## Technical Implementation

### Architecture
- **Phaser 3**: Game engine for rendering and interaction
- **React Integration**: Wrapped in React component for UI consistency
- **Web3 Integration**: Score saving and blockchain transactions
- **MongoDB**: Game data persistence

### Key Components

#### SlicesGame.tsx
Main React component that handles:
- Game initialization
- Score management
- Blockchain transactions
- UI overlay
- Game state management

#### SlicesGameScene (Phaser Scene)
Core game logic including:
- Circle generation and management
- Piece generation and placement
- Collision detection
- Animation and effects
- Game state updates

### Data Structures

#### GameState
```typescript
interface GameState {
  score: number;
  level: number;
  combo: number;
  gameOver: boolean;
  circles: Circle[];
  currentPiece: Piece;
  nextPiece: Piece;
  powerUps: PowerUpInventory;
  gameMode: 'normal' | 'timed' | 'daily';
  timeLeft?: number;
}
```

#### Circle
```typescript
interface Circle {
  id: number;
  x: number;
  y: number;
  totalSlices: number;
  filled: boolean[];
  locked: boolean;
  clears: number;
}
```

#### Piece
```typescript
interface Piece {
  id: string;
  slices: number[];
  type: 'normal' | 'bomb' | 'rainbow' | 'locked';
  rotation: number;
}
```

## Visual Design

### Graphics
- **Placeholder Art**: Colorful gradient slices and circle outlines
- **Special Effects**: Smooth animations for piece placement and circle clearing
- **UI Elements**: Clean, modern interface with Web3 styling
- **Responsive Design**: Adapts to different screen sizes

### Color Scheme
- **Background**: Dark gradient (blue to purple to indigo)
- **Slices**: Colorful gradients (red, teal, blue)
- **UI**: Cyan and purple accents
- **Special Pieces**: Distinct colors (black bomb, rainbow, gray locked)

## Integration with Existing System

### Score Saving
- Integrates with existing `/api/submit-score` endpoint
- Maintains compatibility with leaderboard system
- Supports dual scoring (current season + all-time high)

### Blockchain Features
- **Game Start Transaction**: Required to begin playing
- **NFT Minting**: Based on final score
- **Token Rewards**: Gift box system for daily rewards
- **Power-Up Purchases**: Shop integration for boosters

### Reward System
- **Gift Box Integration**: Same daily reward system
- **Score-Based Rewards**: Higher scores = better NFT chances
- **Social Features**: Share rewards and leaderboard integration

## Game Flow

1. **Start Game**: User connects wallet and starts blockchain transaction
2. **Game Initialization**: Phaser scene loads with initial circles and pieces
3. **Gameplay Loop**:
   - Player selects piece placement
   - System validates move
   - Piece is placed, score updated
   - Circles checked for completion
   - New piece generated
   - Game over check
4. **Game End**: Final score saved, NFT minting option, gift box available

## Performance Optimizations

- **Efficient Rendering**: Only update changed elements
- **Memory Management**: Proper cleanup of Phaser objects
- **Smooth Animations**: 60fps target with optimized tweening
- **Responsive Updates**: Minimal re-renders during gameplay

## Future Enhancements

### Planned Features
- **More Game Modes**: Tournament mode, survival mode
- **Advanced Power-Ups**: Time freeze, piece rotation
- **Visual Improvements**: Better graphics, particle effects
- **Sound System**: Audio feedback and music
- **Multiplayer**: Competitive matches

### Technical Improvements
- **Performance**: WebGL optimizations
- **Accessibility**: Screen reader support
- **Mobile**: Touch gesture improvements
- **Analytics**: Detailed gameplay metrics

## Development Notes

### Code Structure
- **Modular Design**: Easy to add new features
- **Type Safety**: Full TypeScript implementation
- **Error Handling**: Comprehensive error management
- **Testing**: Unit tests for core logic

### Deployment
- **Next.js Integration**: Seamless with existing app
- **Dynamic Loading**: Game loads only when needed
- **Asset Optimization**: Compressed graphics and code
- **CDN Ready**: Static assets optimized for delivery

## Troubleshooting

### Common Issues
1. **Game Not Loading**: Check Phaser import and canvas container
2. **Performance Issues**: Monitor memory usage and frame rate
3. **Touch Issues**: Verify mobile event handling
4. **Score Not Saving**: Check API authentication and network

### Debug Tools
- **Phaser Inspector**: Built-in debugging tools
- **Console Logging**: Detailed game state logging
- **Performance Monitor**: Frame rate and memory tracking
- **Network Debug**: API call monitoring

## Conclusion

The Slices game successfully replaces the previous Candy Crush implementation while maintaining all existing Web3 features and infrastructure. The modular design allows for easy expansion and the Phaser 3 foundation provides excellent performance and visual capabilities.



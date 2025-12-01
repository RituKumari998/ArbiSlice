# 🍰 Slices Game

<div align="center">

**A Puzzle Game Built with Phaser 3 and Web3 Integration**

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Phaser 3](https://img.shields.io/badge/Phaser-3.90.0-green)
![Next.js](https://img.shields.io/badge/Next.js-14.2.6-black)

[Play Now](#getting-started) | [Documentation](#documentation) | [Features](#features)

</div>

---

## 🌟 Overview

**Slices** is an engaging puzzle game where players strategically place slice pieces onto circular boards arranged in a hexagonal pattern. Fill entire circles to clear them, build combos, and achieve high scores while earning blockchain rewards. Built with Phaser 3 for smooth gameplay and integrated with Web3 wallet connections via Reown AppKit.

### 🎯 Game Concept

Players place colorful slice pieces from a center display onto six surrounding circular boards. Match slice positions to fill circles completely, clear them for bonus points, and build combo multipliers. The game features progressive difficulty as circles gain more slices with each level.

---

## ✨ Features

### 🎮 Core Game Mechanics

- **Hexagonal Board Layout** - 1 center piece display + 6 surrounding playable circles
- **Strategic Piece Placement** - Tap surrounding circles to place the center piece
- **Circle Clearing** - Fill all slices in a circle to clear it and earn bonus points
- **Combo System** - Consecutive clears multiply your score significantly
- **Progressive Difficulty** - Circles increase from 6 to 12 slices as you level up
- **Piece Preview** - Hover over circles to see where your piece will be placed
- **Smooth Animations** - Beautiful slice movement animations from center to target

### 🎯 Gameplay Features

- **Real-Time Scoring** - Score updates instantly with visual feedback
- **Level Progression** - Level up based on score milestones (every 1000 points)
- **Power-Ups System**:
  - 🔀 **Shuffle** - Get a new current piece (1 available)
  - ⏭️ **Skip** - Discard current piece and get next one (1 available)
  - ✨ **Auto-Fill** - Instantly complete a circle (earned via shop)
- **Visual Feedback** - Particle effects, score popups, and clearing animations
- **Game Over Detection** - Automatic game end when no valid moves exist

### 🔗 Web3 Integration

- **Wallet Connection** - Reown AppKit integration for seamless wallet connections
- **Blockchain Transactions** - Start new games via smart contract transactions
- **Transaction Status** - Real-time transaction tracking with visual feedback
- **Score Submission** - Save game scores to backend with wallet address
- **Gift Box Rewards** - Claim rewards based on gameplay performance

### 📱 Farcaster Integration

- **Native Mini App** - Built for Farcaster ecosystem
- **Social Sharing** - Share achievements and scores on Farcaster
- **Profile Integration** - Automatic username and profile picture display
- **Farcaster ID (FID)** tracking for scores and leaderboards

---

## 🛠️ Tech Stack

### Frontend

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Phaser 3** (v3.90.0) - Game engine for puzzle mechanics, animations, and rendering
- **React Hooks** - State management and lifecycle handling
- **Tailwind CSS** - Utility-first styling
- **FontAwesome** - Icon library for UI elements

### Blockchain & Wallet

- **Wagmi v2** - React hooks for Ethereum interactions
- **Viem** - TypeScript interface for Ethereum operations
- **Reown AppKit** (v1.8.11) - Wallet connection and management
  - `@reown/appkit` - Core wallet connection library
  - `@reown/appkit-adapter-wagmi` - Wagmi adapter for AppKit
- **Ethers.js** - Additional Ethereum utilities

### Backend Integration

- **Next.js API Routes** - Serverless API endpoints
- **Authenticated Fetch** - Secure API communication
- **MongoDB** - Database for score storage (via API)
- **Enhanced Connection Pooling** - Optimized database connections with connection pooling
- **API Helper Utilities** - Standardized error handling and response formatting
- **Database Health Checks** - Built-in connection health monitoring

### Farcaster

- **@farcaster/miniapp-sdk** - Farcaster Mini App SDK
- **@farcaster/miniapp-core** - Core Farcaster functionality
- **useMiniAppContext** - React hook for Farcaster context

---

## 🎮 How to Play

### Basic Gameplay

1. **Start the Game**
   - Connect your wallet (MetaMask, Coinbase Wallet, or other supported wallets)
   - Click "Play Again" to start a new game session
   - A blockchain transaction is required to begin

2. **Understand the Layout**
   - **Center Circle**: Displays your current piece (display only, not playable)
   - **6 Surrounding Circles**: These are your playable game boards
   - **Next Piece Preview**: Shows the upcoming piece at the bottom

3. **Place Pieces**
   - Tap any of the 6 surrounding circles to place your piece
   - The piece will animate from center to the selected circle
   - Pieces can only be placed on empty slice positions
   - Invalid placements show error feedback

4. **Clear Circles**
   - Fill all slice positions in a circle to clear it
   - Cleared circles reset and become available again
   - Clearing awards bonus points based on combo multiplier

5. **Build Combos**
   - Clear multiple circles in quick succession
   - Each combo multiplies your clearing bonus
   - Watch for the combo indicator in the UI

6. **Level Up**
   - Reach score milestones (every 1000 points = new level)
   - Circles gain 1 additional slice per level (max 12 slices)
   - Visual feedback shows when difficulty increases

7. **Use Power-Ups**
   - Click power-up buttons at the bottom when stuck
   - Shuffle: Get a new piece if current one won't fit
   - Skip: Discard current piece for the next one
   - Auto-Fill: Instantly complete any incomplete circle

8. **Game Over**
   - Game ends automatically when no valid placement exists
   - Final score is displayed and saved
   - Share your achievement on Farcaster
   - Start a new game by clicking "Play Again"

### Scoring System

- **Base Points**: +1 point per slice placed
- **Clear Bonus**: +10 points per cleared circle
- **Combo Multiplier**: Clears × combo count × 10 bonus points
- **Level Scaling**: Difficulty increases with score milestones

### Tips & Strategies

- **Plan Ahead**: Check the next piece to plan your moves
- **Focus on Combos**: Clearing multiple circles in sequence maximizes points
- **Manage Space**: Keep circles balanced to maintain placement options
- **Use Power-Ups Wisely**: Save them for difficult situations
- **Watch Circle State**: Track which circles are close to clearing

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0.0 or later
- **pnpm** (recommended) or npm
- **Web3 Wallet** (MetaMask, Coinbase Wallet, etc.)
- **Blockchain Network** - Configured for your target network

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd arbislice
```

2. **Install dependencies**
```bash
pnpm install
# or
npm install
```

3. **Environment Setup**
Create a `.env.local` file with the following variables:

```bash
# Wallet Connection (Reown AppKit)
NEXT_PUBLIC_REOWN_PROJECT_ID=your-reown-project-id

# API Configuration
NEXT_PUBLIC_URL=http://localhost:3000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/chaincrush
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chaincrush

# Contract Addresses (update after deployment)
NEXT_PUBLIC_TOKEN_REWARD_ADDRESS=0x...

# Server Configuration (for NFT minting)
SERVER_PRIVATE_KEY=your_private_key_here
CHAINCRUSH_NFT_ADDRESS=0x...
DAILY_MINT_LIMIT=6
```

4. **Configure Reown AppKit**

Get your project ID from [Reown Cloud](https://cloud.reown.com) and add it to your environment variables.

5. **Start Development Server**
```bash
pnpm dev
# or
npm run dev
```

6. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000) and start playing!

---

## 📁 Project Structure

```
arbislice/
├── components/
│   └── Home/
│       └── SlicesGame.tsx      # Main game component (Phaser 3 + React)
├── hooks/
│   └── use-miniapp-context.tsx # Farcaster context hook
├── lib/
│   ├── contracts.ts            # Contract addresses and ABIs
│   ├── constants.ts            # Game constants
│   ├── auth.ts                 # Authentication utilities
│   ├── mongodb.ts              # MongoDB connection with connection pooling
│   ├── database.ts             # Database operations and queries
│   └── api-helpers.ts          # API response helpers and error handling
├── app/
│   └── api/                    # API routes with enhanced error handling
└── package.json                # Dependencies including Reown AppKit
```

---

## 🔧 Configuration

### Wallet Connection Setup

The game uses **Reown AppKit** for wallet connections:

```typescript
// In your app configuration
import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

const wagmiAdapter = new WagmiAdapter({
  chains: [yourChain],
  projectId: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID
})

createAppKit({
  adapters: [wagmiAdapter],
  projectId: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID
})
```

### Game Configuration

The game can be configured by modifying constants in the `SlicesGameScene` class:

```typescript
// Circle layout
const centerX = 200;      // Center circle X position
const centerY = 250;      // Center circle Y position
const radius = 100;       // Distance from center to surrounding circles

// Initial settings
INITIAL_SLICES = 6;       // Starting slices per circle
MAX_SLICES = 12;          // Maximum slices per circle
INITIAL_LEVEL = 1;        // Starting level
```

### Blockchain Integration

The game uses Wagmi hooks for blockchain interactions:

```typescript
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'

// Wallet connection state
const { isConnected, address } = useAccount()

// Contract writing
const { writeContract, data: hash, isPending } = useWriteContract()

// Transaction confirmation
const { isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
  hash,
})
```

---

## 🎯 Game Mechanics

### Circle Layout

- **1 Center Circle**: Display-only, shows current piece
- **6 Surrounding Circles**: Playable game boards in hexagonal pattern
- Each circle starts with 6 slices, increases up to 12 with levels

### Piece Generation

- Pieces are generated as single-slice segments
- Slice position index (0-5 for 6-slice circles, up to 11 for 12-slice)
- Pieces guaranteed to have at least one valid placement

### Placement Logic

1. Check if circle is locked (cannot place)
2. Verify slice positions are empty
3. Validate slice indices are within circle's slice count
4. Animate piece movement from center to target
5. Update circle state and check for clears

### Clearing Logic

1. Detect when all slices in a circle are filled
2. Clear the circle (reset all slices to empty)
3. Award bonus points with combo multiplier
4. Play clearing animation
5. Check for level up

### Difficulty Scaling

- Level increases every 1000 points
- Each level adds 1 slice to all playable circles
- Maximum of 12 slices per circle
- Visual feedback when difficulty increases

---

## 🔗 Web3 Integration Details

### Wallet Connection Flow

1. **User Clicks "Play Again"**
2. **Check Wallet Connection** - `useAccount()` hook
3. **Initiate Transaction** - `writeContract()` to start game
4. **Wait for Confirmation** - `useWaitForTransactionReceipt()`
5. **Start New Game** - Reset game state and begin

### Transaction Handling

```typescript
// Start new game function
const startNewGame = async () => {
  if (!isConnected) return;
  
  writeContract({
    address: CONTRACT_ADDRESSES.TOKEN_REWARD,
    abi: TOKEN_REWARD_ABI,
    functionName: 'startGame',
    args: []
  });
};

// Transaction status tracking
useEffect(() => {
  if (isPending) {
    setTransactionStatus('pending');
  } else if (isConfirmed) {
    setTransactionStatus('confirmed');
    // Restart game
  } else if (error) {
    setTransactionStatus('error');
  }
}, [isPending, isConfirming, isConfirmed, error]);
```

### Score Submission

Scores are saved via authenticated API endpoint:

```typescript
const saveGameData = async (finalScore: number, finalLevel: number) => {
  const gameData = {
    fid: context.user.fid,           // Farcaster ID
    username: context.user.username,
    score: finalScore,
    level: finalLevel,
    userAddress: address              // Wallet address
  };
  
  await authenticatedFetch('/api/submit-score', {
    method: 'POST',
    body: JSON.stringify(gameData)
  });
};
```

---

## 🎨 Visual Design

### Graphics

- **Canvas-based Textures** - All game graphics created programmatically
- **Watermelon Slice Theme** - Red slices with black seeds and green rind
- **Colorful Gradients** - Vibrant slice colors for visual appeal
- **Dark Theme** - Dark background (#2A2A2A) for contrast

### Animations

- **Slice Movement** - Smooth tweening from center to target circle
- **Particle Effects** - Burst effects on placement and clearing
- **Score Popups** - Animated score text that fades upward
- **Circle Clearing** - Explosion animation with multiple particles
- **Hover Previews** - Golden preview overlay on valid placements

### UI Elements

- **Score Display** - Top center with animated counting
- **Level Indicator** - Shows current level
- **Combo Counter** - Displays combo multiplier when active
- **Power-Up Buttons** - Bottom of screen with counts
- **Game Over Screen** - Modern overlay with final score and share button

---

## 🐛 Troubleshooting

### Common Issues

1. **Game doesn't load**
   - Check Phaser import: `import Phaser from 'phaser'`
   - Verify canvas container exists: `ref={gameRef}`
   - Check browser console for errors

2. **Wallet connection fails**
   - Verify Reown AppKit is configured correctly
   - Check `NEXT_PUBLIC_REOWN_PROJECT_ID` is set
   - Ensure wallet extension is installed

3. **Transaction fails**
   - Check wallet has sufficient balance for gas
   - Verify contract address is correct
   - Check network is properly configured

4. **Score not saving**
   - Verify API endpoint is accessible
   - Check authentication tokens
   - Verify MongoDB connection
   - Check database health: Use `checkDatabaseHealth()` function

5. **No valid moves error**
   - This is normal game behavior when no placements exist
   - Use power-ups to continue or start new game

### Debug Tools

- **Browser Console** - Check for JavaScript errors
- **React DevTools** - Inspect component state
- **Wagmi DevTools** - Monitor wallet connections
- **Phaser Debug** - Enable physics debug mode in game config

---

## 📚 Key Dependencies

### Core Game

```json
{
  "phaser": "^3.90.0",
  "react": "^18",
  "next": "14.2.6"
}
```

### Wallet Integration

```json
{
  "@reown/appkit": "^1.8.11",
  "@reown/appkit-adapter-wagmi": "^1.8.11",
  "wagmi": "^2.14.12",
  "viem": "^2.22.22"
}
```

### Backend & Database

```json
{
  "mongodb": "^6.x",
  "ethers": "^6.x"
}
```

### Farcaster

```json
{
  "@farcaster/miniapp-sdk": "^0.1.7",
  "@farcaster/miniapp-core": "^0.3.6"
}
```

---

## 🔧 Backend Architecture

### MongoDB Connection Management

The backend uses an optimized MongoDB connection setup with:

- **Connection Pooling**: Maintains 2-10 active connections for optimal performance
- **Automatic Retries**: Retries failed reads/writes automatically
- **Build-Time Safety**: Gracefully handles missing MongoDB URI during build
- **Health Monitoring**: Built-in `checkDatabaseHealth()` function for monitoring

**Connection Configuration:**
```typescript
// lib/mongodb.ts
- maxPoolSize: 10 connections
- minPoolSize: 2 connections
- maxIdleTimeMS: 30000 (30 seconds)
- serverSelectionTimeoutMS: 5000
- socketTimeoutMS: 45000
- retryWrites: true
- retryReads: true
```

### API Helper Utilities

Standardized API response handling via `lib/api-helpers.ts`:

**Available Helpers:**
- `successResponse(data, status)` - Standardized success responses
- `errorResponse(error, status, details)` - Error responses
- `serverErrorResponse(error, details)` - Server errors (500)
- `validationErrorResponse(message, details)` - Validation errors (400)
- `notFoundResponse(resource)` - Not found errors (404)
- `validateRequiredFields(body, fields)` - Request validation
- `withErrorHandling(handler)` - Async error wrapper

**Example Usage:**
```typescript
import { successResponse, validationErrorResponse } from '@/lib/api-helpers';

export async function POST(request: NextRequest) {
  const validation = validateRequiredFields(body, ['fid', 'score']);
  if (!validation.isValid) {
    return validationErrorResponse(
      `Missing fields: ${validation.missingFields.join(', ')}`
    );
  }
  return successResponse({ score, level });
}
```

### Enhanced Error Handling

All API routes now feature:
- ✅ Consistent error response format
- ✅ Detailed validation error messages
- ✅ Proper HTTP status codes
- ✅ Error logging for debugging
- ✅ Type-safe error handling

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use FontAwesome icons for UI elements
- Maintain Phaser 3 game performance (target 60fps)
- Test wallet connections on testnet first
- Update documentation for new features

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 🙏 Acknowledgments

- **Phaser** - Excellent game engine for web games
- **Reown** - Wallet connection infrastructure (formerly WalletConnect)
- **Wagmi** - React hooks for Ethereum
- **Farcaster** - Social protocol and mini app framework
- **MongoDB** - Database for score storage and game data

---

**Ready to slice and match your way to victory?** 🍰🎮

Play Slices and compete for high scores while earning blockchain rewards!

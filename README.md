# 🍰 Chain Crush - Slices Game

<div align="center">

**A Web3 Puzzle Game Built on Farcaster Mini Apps**

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Built on Arbitrum](https://img.shields.io/badge/Built%20on-Arbitrum-blue)
![Farcaster Mini App](https://img.shields.io/badge/Farcaster-Mini%20App-purple)

[Play Now](#getting-started) | [Documentation](#documentation) | [Features](#features)

</div>

---

## 🌟 Overview

**Chain Crush** (formerly known as **Slices**) is an addictive puzzle game that combines engaging gameplay mechanics with blockchain technology. Built as a Farcaster Mini App, players solve slice-matching puzzles, compete on leaderboards, and earn real token rewards and NFTs on the Arbitrum blockchain.

### 🎯 Game Concept

Place colorful slice pieces onto circular boards in a hexagonal pattern. Fill entire circles to clear them and earn points. The game features strategic piece placement, combo multipliers, power-ups, and progressive difficulty scaling as you level up!

---

## ✨ Features

### 🎮 Game Features

- **Hexagonal Board Layout** - 6 playable circles arranged around a central piece display
- **Strategic Piece Placement** - Match slice positions to fill circles efficiently
- **Circle Clearing Mechanics** - Fill entire circles to clear them and earn bonus points
- **Combo System** - Consecutive clears multiply your score
- **Progressive Difficulty** - Circles gain more slices as you level up (6-12 slices)
- **Power-Ups System**:
  - 🔀 **Shuffle** - Reshuffle your current piece
  - ⏭️ **Skip** - Discard the current piece
  - ✨ **Auto-Fill** - Instantly complete a circle (earned via shop)
- **Smooth Animations** - Phaser 3-powered visuals with particle effects
- **Responsive Design** - Optimized for mobile and desktop

### 🔗 Blockchain Integration

- **NFT Minting** - Mint unique NFTs based on your achievements
- **Token Reward System** - Earn tokens through gift boxes and daily challenges
- **On-Chain Score Tracking** - Blockchain-verified leaderboards
- **Smart Contract Integration** - Deploy and interact with ERC20 tokens and NFT contracts
- **Wallet Support** - MetaMask, Coinbase Wallet, Farcaster wallets

### 📱 Farcaster Integration

- **Native Mini App** - Built specifically for Farcaster ecosystem
- **Social Sharing** - Share achievements and scores on Farcaster
- **Profile Integration** - Automatic username and profile picture display
- **Farcaster ID (FID)** tracking for leaderboards and rewards

### 🎁 Reward System

- **Gift Box Rewards** - Daily token rewards based on performance
- **Score-Based Rewards** - Higher scores unlock better rewards
- **NFT Minting** - Mint collectible NFTs based on game achievements
- **Leaderboard Rankings** - Compete globally for top positions
- **Shop Integration** - Purchase power-ups and boosters with tokens

### 🏆 Leaderboard System

- **Dual Score Tracking**:
  - **Current Season Score** - Updates with every game
  - **All-Time High (ATH)** - Your personal best score ever
- **Real-Time Rankings** - Live leaderboard updates
- **Farcaster Integration** - Profile pictures and usernames
- **Global Competition** - Compete with players worldwide

---

## 🛠️ Tech Stack

### Frontend

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Phaser 3** - Game engine for puzzle mechanics and animations
- **Framer Motion** - UI animations and transitions
- **Tailwind CSS** - Utility-first styling
- **FontAwesome** - Icon library (Icons used throughout the UI)

### Blockchain

- **Arbitrum** - Layer 2 Ethereum network
- **Wagmi v2** - React hooks for Ethereum
- **Viem** - TypeScript interface for Ethereum
- **Reown AppKit** - Wallet connection and management
- **Hardhat** - Smart contract development and deployment

### Backend

- **MongoDB** - Database for game data and leaderboards
- **Next.js API Routes** - Serverless API endpoints
- **Ethers.js** - Ethereum library for smart contract interaction
- **Upstash Redis** - Caching and rate limiting

### Smart Contracts

- **ChainCrush.sol** - Main NFT contract for game achievements
- **TokenReward.sol** - Token distribution and reward claiming
- **BoosterShop.sol** - In-game shop for power-ups
- **MyToken.sol** - ERC20 token implementation

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0.0 or later
- **pnpm** (recommended) or npm
- **MongoDB** database instance
- **Arbitrum** wallet with test ETH for gas fees

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/chain-crush.git
cd chain-crush/arbislice
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
# Database
MONGODB_URI=mongodb://localhost:27017/chain-crush

# Authentication
API_SECRET_KEY=your-super-secret-key-here
NEXT_PUBLIC_API_SECRET_KEY=your-super-secret-key-here

# Blockchain
NEXT_PUBLIC_RPC_URL=https://arb1.arbitrum.io/rpc
SERVER_PRIVATE_KEY=your-private-key-for-contract-interactions

# Contract Addresses (update after deployment)
NEXT_PUBLIC_CHAINCRUSH_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_TOKEN_REWARD_ADDRESS=0x...
NEXT_PUBLIC_BOOSTER_SHOP_ADDRESS=0x...

# Farcaster
NEXT_PUBLIC_URL=https://your-app.vercel.app

# Reown (WalletConnect)
NEXT_PUBLIC_REOWN_PROJECT_ID=your-reown-project-id
```

4. **Database Setup**
Ensure MongoDB is running and the application will automatically create the necessary collections:
- `gameScores` - Player scores and statistics
- `giftBoxClaims` - Gift box reward claims
- `userGiftBoxStats` - User claim statistics
- `nftMints` - NFT minting records
- `usedAuthKeys` - Authentication key tracking

5. **Smart Contract Deployment**
```bash
# Navigate to contract directory
cd contract

# Deploy contracts to Arbitrum
npx hardhat run deploy.js --network arbitrum

# Deploy token contracts
npx hardhat run deploy-token.js --network arbitrum

# Deploy booster shop
npx hardhat run deploy-booster-shop.js --network arbitrum

# Fund the reward contract with tokens
npx hardhat run fund-reward-contract.js --network arbitrum
```

6. **Start Development Server**
```bash
pnpm dev
# or
npm run dev
```

7. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000) to start playing!

---

## 🎮 How to Play

### Basic Gameplay

1. **Understand the Layout**
   - Center circle displays your current piece
   - 6 surrounding circles are your playable boards
   - Tap a surrounding circle to place your piece

2. **Place Pieces**
   - Each piece shows which slice positions it will fill
   - Pieces can only be placed on empty slice positions
   - Invalid placements will show error feedback

3. **Clear Circles**
   - Fill all slices in a circle to clear it
   - Clearing circles awards bonus points
   - Cleared circles reset and become available again

4. **Build Combos**
   - Clearing multiple circles in quick succession creates combos
   - Combos multiply your score significantly
   - Watch for the combo indicator!

5. **Level Up**
   - As your score increases, circles gain more slices
   - More slices = more challenging gameplay
   - Difficulty scales from 6 to 12 slices per circle

6. **Game Over**
   - Game ends when no valid placement exists for the current piece
   - Your final score is saved and added to the leaderboard

### Power-Ups

- **Shuffle** (↻): Get a new current piece if stuck
- **Skip** (⏭): Discard current piece and get the next one
- **Auto-Fill** (✨): Instantly complete any incomplete circle

### Blockchain Features

1. **Connect your wallet** (MetaMask, Coinbase Wallet, or Farcaster)
2. **Play and achieve high scores** to unlock rewards
3. **Claim gift box rewards** based on your performance
4. **Mint NFTs** when you reach achievement milestones
5. **Share your achievements** on Farcaster for bonus rewards
6. **Compete on leaderboards** with other players worldwide

### Tips & Strategies

- **Plan Ahead**: Look at the next piece to plan your moves
- **Focus on Combos**: Clearing multiple circles in sequence maximizes points
- **Use Power-Ups Wisely**: Save them for difficult situations
- **Watch Circle State**: Track which circles are close to clearing
- **Manage Empty Space**: Keep boards balanced to maintain placement options

---

## 📁 Project Structure

```
arbislice/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── submit-score/  # Score submission
│   │   ├── mint-nft/      # NFT minting
│   │   ├── claim-gift-box/ # Gift box rewards
│   │   ├── leaderboard/   # Leaderboard data
│   │   ├── user-stats/    # User statistics
│   │   └── ...           # Additional endpoints
│   ├── .well-known/       # Farcaster configuration
│   └── page.tsx          # Main page
├── components/            # React components
│   ├── Home/
│   │   └── SlicesGame.tsx # Main game component
│   ├── GiftBox.tsx       # Reward claiming modal
│   ├── Leaderboard.tsx   # Score leaderboard
│   ├── Shop.tsx          # Power-up shop
│   ├── NFTManager.tsx    # NFT management
│   └── wallet-provider.tsx # Wallet connection
├── contract/             # Smart contracts
│   ├── chaincrush.sol   # Main NFT contract
│   ├── TokenReward.sol  # Token distribution
│   ├── BoosterShop.sol  # Shop contract
│   └── deploy.js        # Deployment scripts
├── docs/                 # Documentation
│   ├── lib/             # Database utilities
│   └── cron-setup.md    # Cron job setup
├── hooks/               # Custom React hooks
│   └── use-miniapp-context.tsx # Farcaster context
├── lib/                 # Shared utilities
│   ├── contracts.ts     # Contract addresses and ABIs
│   ├── constants.ts     # Game constants
│   ├── auth.ts          # Authentication utilities
│   └── leaderboard.ts   # Leaderboard functions
├── types/               # TypeScript definitions
├── public/              # Static assets
└── middleware.ts        # Authentication middleware
```

---

## 🔧 Configuration

### Game Configuration

Edit `lib/constants.ts` to customize game settings:

```typescript
export const GAME_CONFIG = {
  INITIAL_SLICES: 6,
  MAX_SLICES: 12,
  BASE_SCORE_PER_SLICE: 1,
  CLEAR_BONUS: 10,
  COMBO_MULTIPLIER: 1.5
};
```

### Reward Configuration

```typescript
export const REWARD_CONFIG = {
  GIFT_BOX_CLAIMS_PER_PERIOD: 3,
  CLAIM_PERIOD_HOURS: 12,
  MIN_SCORE_FOR_REWARD: 10,
  NFT_MINT_THRESHOLDS: [100, 500, 1000, 5000]
};
```

### Smart Contract Configuration

Update contract addresses in `lib/contracts.ts` after deployment:

```typescript
export const CONTRACT_ADDRESSES = {
  CHAINCRUSH: '0x...',
  TOKEN_REWARD: '0x...',
  BOOSTER_SHOP: '0x...'
};
```

---

## 🚀 Deployment

### Vercel Deployment

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Configure build settings**:
   - Build Command: `pnpm build`
   - Output Directory: `.next`
4. **Deploy** - Vercel will automatically build and deploy

### Smart Contract Deployment

```bash
# Deploy to Arbitrum mainnet
cd contract
npx hardhat run deploy.js --network arbitrum

# Verify contracts on Arbiscan
npx hardhat verify --network arbitrum <CONTRACT_ADDRESS>
```

### Farcaster Mini App Setup

1. **Update Farcaster Config**
   - Edit `app/.well-known/farcaster.json/route.ts`
   - Update app metadata, icons, and URLs

2. **Configure Account Association**
   - Follow Farcaster documentation for account association
   - Add header, payload, and signature to config

3. **Submit for Review**
   - Use Farcaster's Mini App submission process
   - Wait for approval before going live

---

## 🔒 Security Features

### Authentication & Security

- **Fused Key Authentication** - Prevents replay attacks
- **Database Validation** - Additional security layer beyond blockchain
- **Rate Limiting** - Prevents abuse of reward system
- **Signature Verification** - Blockchain-level security for token claims
- **Input Validation** - All API endpoints validate user inputs
- **Reentrancy Protection** - Smart contracts protected against reentrancy attacks

### Middleware Protection

All POST API routes are protected by authentication middleware:
- `/api/submit-score`
- `/api/mint-nft`
- `/api/claim-gift-box`
- `/api/purchase-booster`
- And more...

### Database Security

- **Used Key Tracking** - Prevents key reuse
- **Expiration Times** - Keys expire after use
- **Index Optimization** - Fast lookups with MongoDB indexes

---

## 📚 Documentation

### Additional Guides

- **[BACKEND_SETUP.md](./BACKEND_SETUP.md)** - MongoDB and backend configuration
- **[ENV_SETUP.md](./ENV_SETUP.md)** - Environment variable setup
- **[TOKEN_SETUP.md](./TOKEN_SETUP.md)** - Token contract deployment
- **[FAUCET_SETUP.md](./FAUCET_SETUP.md)** - Faucet configuration
- **[SLICES_GAME_GUIDE.md](./SLICES_GAME_GUIDE.md)** - Detailed game mechanics
- **[contract/README.md](./contract/README.md)** - Smart contract documentation

---

## 🎯 Game Mechanics Deep Dive

### Piece Generation

- Pieces are generated to ensure at least one valid placement exists
- Single-slice pieces are the current implementation
- Future versions may include multi-slice pieces

### Circle Clearing Logic

1. Check if all slices in a circle are filled
2. Clear the circle and reset all slices
3. Award clearing bonus points
4. Update combo counter
5. Play clearing animation

### Difficulty Scaling

- Starts with 6 slices per circle
- Increases by 1 slice every level
- Maximum of 12 slices per circle
- Visual feedback when difficulty increases

### Game Over Conditions

- No valid placement exists for current piece
- Player manually ends the game
- All circles are locked (future feature)

---

## 🐛 Troubleshooting

### Common Issues

1. **Game doesn't load**
   - Check Phaser import and canvas container
   - Verify Next.js is running correctly
   - Check browser console for errors

2. **Wallet connection fails**
   - Ensure wallet extension is installed
   - Check network is set to Arbitrum
   - Verify contract addresses are correct

3. **Score not saving**
   - Check MongoDB connection
   - Verify API authentication keys
   - Check network tab for API errors

4. **NFT minting fails**
   - Ensure wallet has enough ETH for gas
   - Verify contract addresses are correct
   - Check contract has minting permissions

5. **Gift box not appearing**
   - Check if claim limit is reached
   - Verify 12-hour period has passed
   - Check gift box API endpoint

### Debug Tools

- **Phaser Inspector** - Built-in game debugging
- **React DevTools** - Component state inspection
- **Wagmi DevTools** - Blockchain connection debugging
- **MongoDB Compass** - Database inspection

---

## 📊 API Endpoints

### Game Endpoints

- `POST /api/submit-score` - Submit game score
- `GET /api/leaderboard` - Get leaderboard data
- `GET /api/user-stats` - Get user statistics
- `GET /api/ath-leaderboard` - Get all-time high leaderboard

### NFT Endpoints

- `POST /api/mint-nft` - Mint an NFT
- `GET /api/nft-supply` - Get NFT supply stats
- `GET /api/check-nft-owner` - Check NFT ownership
- `GET /api/get-nft-trait` - Get NFT traits

### Reward Endpoints

- `POST /api/claim-gift-box` - Claim gift box rewards
- `POST /api/share-reward` - Claim share rewards
- `POST /api/purchase-booster` - Purchase power-ups

### Stats Endpoints

- `GET /api/players-total` - Get total player count
- `GET /api/active-players` - Get active player count
- `GET /api/faucet-stats` - Get faucet statistics

---

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use FontAwesome icons as specified in user preferences
- Write descriptive commit messages
- Test all blockchain interactions on testnet first
- Update documentation for new features

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Arbitrum** - For providing the Layer 2 infrastructure
- **Farcaster** - For the social protocol and mini app framework
- **Reown** - For wallet connection infrastructure
- **Phaser** - For the excellent game engine
- **OpenZeppelin** - For secure smart contract libraries

---

## 📞 Support

For support, please:
1. Check the [troubleshooting section](#-troubleshooting)
2. Review the [documentation](#-documentation)
3. Check existing [GitHub Issues](https://github.com/yourusername/chain-crush/issues)
4. Create a new issue with detailed information about your problem

---

## 🗺️ Roadmap

### Q1 2025
- [x] Core game mechanics
- [x] Farcaster Mini App integration
- [x] Blockchain reward system
- [x] Leaderboard system
- [ ] Multi-slice pieces
- [ ] Tournament mode

### Q2 2025
- [ ] NFT marketplace integration
- [ ] Character customization
- [ ] Advanced power-ups
- [ ] Seasonal events
- [ ] Mobile app (iOS/Android)

### Q3 2025
- [ ] Multiplayer mode
- [ ] Guild system
- [ ] Cross-chain support
- [ ] Creator tools
- [ ] API for third-party integrations

---

**Ready to slice and match your way to victory?** 🍰🎮

Play Chain Crush and compete with players worldwide while earning real rewards on Arbitrum!
# ArbiSlice

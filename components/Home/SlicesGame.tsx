'use client'

import { useEffect, useRef, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Phaser from 'phaser';
import { APP_URL } from '@/lib/constants';
import { useMiniAppContext } from '@/hooks/use-miniapp-context';
import { getPlayerData } from '@/lib/leaderboard';
import { incrementGamesPlayed, addGameScore } from '@/lib/game-counter';
import { useContractWrite, useContractRead, useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { parseEther } from 'viem';
import { CONTRACT_ADDRESSES, CHAINCRUSH_NFT_ABI, TOKEN_REWARD_ABI } from '@/lib/contracts';
import { authenticatedFetch } from '@/lib/auth';
import ConfirmEndGameModal from '../ConfirmEndGameModal';
import GiftBox from '../GiftBox';
import Shop from '../Shop';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCoins, 
  faCheckCircle, 
  faExclamationTriangle, 
  faSpinner,
  faTimes,
  faGift,
  faShuffle,
  faBurst,
  faFire,
  faTrophy,
  faBolt,
  faTimesCircle,
  faStore,
  faHome,
  faUndo,
  faForward as faSkipForward,
  faMagic
} from '@fortawesome/free-solid-svg-icons';

interface SlicesGameProps {
  onBack?: () => void;
}

// Game state interface
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

interface Circle {
  id: number;
  x: number;
  y: number;
  totalSlices: number;
  filled: boolean[];
  locked: boolean;
  clears: number;
  isCenterPiece?: boolean; // True for center piece display
}

interface Piece {
  id: string;
  slices: number[];
  type: 'normal' | 'bomb' | 'rainbow' | 'locked';
  rotation: number;
}

interface PowerUpInventory {
  shuffle: number;
  skip: number;
  autoFill: number;
}

// Phaser game scene
class SlicesGameScene extends Phaser.Scene {
  private gameState!: GameState;
  private circles: Phaser.GameObjects.Container[] = [];
  private currentPieceObj!: Phaser.GameObjects.Container;
  private nextPieceObj!: Phaser.GameObjects.Container;
  private scoreText!: Phaser.GameObjects.Text;
  private comboText!: Phaser.GameObjects.Text;
  private levelText!: Phaser.GameObjects.Text;
  private timeText?: Phaser.GameObjects.Text;
  private gameOverOverlay!: Phaser.GameObjects.Container;
  private powerUpButtons: Phaser.GameObjects.Container[] = [];
  private selectedCircle: number | null = null;
  private onGameEnd!: (score: number, level: number) => void;
  private timeLeft?: Phaser.Time.TimerEvent;

  constructor() {
    super({ key: 'SlicesGameScene' });
  }

  init(data: { onGameEnd: (score: number, level: number) => void }) {
    this.onGameEnd = data.onGameEnd;
  }

  preload() {
    // Create placeholder graphics
    this.load.image('slice', this.createSliceTexture());
    this.load.image('watermelon', this.createWatermelonSliceTexture());
    this.load.image('circle', this.createCircleTexture());
    this.load.image('bomb', this.createBombTexture());
    this.load.image('rainbow', this.createRainbowTexture());
    this.load.image('locked', this.createLockedTexture());
  }

  create() {
    this.initializeGameState();
    this.createUI();
    this.createCircles();
    this.createPieces();
    this.createPowerUpButtons();
    this.createGameOverOverlay();
    this.startGame();
  }

  private createSliceTexture(): string {
    const canvas = document.createElement('canvas');
    canvas.width = 30;
    canvas.height = 30;
    const ctx = canvas.getContext('2d')!;
    
    // Create a colorful slice
    const gradient = ctx.createLinearGradient(0, 0, 30, 30);
    gradient.addColorStop(0, '#FF6B6B');
    gradient.addColorStop(0.5, '#4ECDC4');
    gradient.addColorStop(1, '#45B7D1');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(15, 15);
    ctx.arc(15, 15, 14, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    return canvas.toDataURL();
  }

  private createWatermelonSliceTexture(): string {
    const canvas = document.createElement('canvas');
    canvas.width = 30;
    canvas.height = 30;
    const ctx = canvas.getContext('2d')!;
    
    // Create watermelon slice (red with seeds)
    ctx.fillStyle = '#FF6B6B';
    ctx.beginPath();
    ctx.moveTo(15, 15);
    ctx.arc(15, 15, 14, 0, Math.PI * 2);
    ctx.fill();
    
    // Add seeds (black ovals)
    const seeds = [
      { x: 12, y: 10, w: 3, h: 2 },
      { x: 18, y: 12, w: 3, h: 2 },
      { x: 14, y: 18, w: 3, h: 2 },
      { x: 20, y: 20, w: 3, h: 2 }
    ];
    
    ctx.fillStyle = '#2C3E50';
    seeds.forEach(seed => {
      ctx.beginPath();
      ctx.ellipse(seed.x, seed.y, seed.w, seed.h, 0, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Add green rind
    ctx.fillStyle = '#27AE60';
    ctx.beginPath();
    ctx.arc(15, 15, 14, 0, Math.PI * 2);
    ctx.stroke();
    
    return canvas.toDataURL();
  }

  private createCircleTexture(): string {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d')!;
    
    // Create dark gray circle background
    ctx.fillStyle = '#3A3A3A';
    ctx.beginPath();
    ctx.arc(50, 50, 45, 0, Math.PI * 2);
    ctx.fill();
    
    // Create slice dividers
    ctx.strokeStyle = '#5A5A5A';
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6;
      const x1 = 50 + Math.cos(angle) * 45;
      const y1 = 50 + Math.sin(angle) * 45;
      ctx.beginPath();
      ctx.moveTo(50, 50);
      ctx.lineTo(x1, y1);
      ctx.stroke();
    }
    
    // Outer border
    ctx.strokeStyle = '#2A2A2A';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(50, 50, 45, 0, Math.PI * 2);
    ctx.stroke();
    
    return canvas.toDataURL();
  }

  private createBombTexture(): string {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;
    
    ctx.fillStyle = '#2C3E50';
    ctx.beginPath();
    ctx.arc(16, 16, 12, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#E74C3C';
    ctx.beginPath();
    ctx.arc(16, 16, 8, 0, Math.PI * 2);
    ctx.fill();
    
    return canvas.toDataURL();
  }

  private createRainbowTexture(): string {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;
    
    const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];
    for (let i = 0; i < colors.length; i++) {
      ctx.fillStyle = colors[i];
      ctx.beginPath();
      ctx.arc(16, 16, 15 - i * 2, 0, Math.PI * 2);
      ctx.fill();
    }
    
    return canvas.toDataURL();
  }

  private createLockedTexture(): string {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;
    
    ctx.fillStyle = '#95A5A6';
    ctx.beginPath();
    ctx.arc(16, 16, 15, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#34495E';
    ctx.fillRect(12, 8, 8, 12);
    ctx.fillRect(10, 18, 12, 4);
    
    return canvas.toDataURL();
  }

  private initializeGameState() {
    // First initialize circles
    const circles = this.generateInitialCircles();
    
    // Initialize gameState with circles
    this.gameState = {
      score: 0,
      level: 1,
      combo: 0,
      gameOver: false,
      circles: circles,
      currentPiece: this.generatePieceWithCircles(circles),
      nextPiece: this.generatePieceWithCircles(circles),
      powerUps: { shuffle: 1, skip: 1, autoFill: 0 },
      gameMode: 'normal',
      timeLeft: undefined
    };
    
    // Check for initial game over (though unlikely with empty circles)
    if (!this.hasValidMoves()) {
      this.endGame();
    }
  }

  private generateInitialCircles(): Circle[] {
    const circles: Circle[] = [];
    
    // Hexagonal layout - center circle + 6 surrounding circles
    const centerX = 200; // Adjusted for mobile width
    const centerY = 250; // Adjusted for mobile height
    const radius = 100; // Increased radius for better spacing
    
    // Center circle - DISPLAY ONLY for current piece
    circles.push({
      id: 0,
      x: centerX,
      y: centerY,
      totalSlices: 6,
      filled: new Array(6).fill(false), // Empty - just shows current piece
      locked: false,
      clears: 0,
      isCenterPiece: true // Mark as center piece
    });
    
    // 6 surrounding circles in hexagonal pattern - ACTUAL GAME BOARDS
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6 - Math.PI / 2; // Start from top
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      circles.push({
        id: i + 1,
        x: x,
        y: y,
        totalSlices: 6,
        filled: new Array(6).fill(false), // Empty game boards
        locked: false,
        clears: 0,
        isCenterPiece: false
      });
    }

    return circles;
  }

  private generatePiece(): Piece {
    // Only 1 slice pieces for now, but adapt to circle slice counts
    const sliceCount = 1;
    const slices: number[] = [];
    
    // Find the minimum slice count among all playable circles to ensure piece can be placed somewhere
    const playableCircles = this.gameState.circles.filter(circle => !circle.isCenterPiece && !circle.locked);
    const minSlices = playableCircles.length > 0 ? Math.min(...playableCircles.map(c => c.totalSlices)) : 6;
    
    // Generate single slice index that will work on all circles
    const startSlice = Phaser.Math.Between(0, minSlices - 1);
    slices.push(startSlice);

    // Only normal pieces for now
    let type: Piece['type'] = 'normal';

    return {
      id: Phaser.Utils.String.UUID(),
      slices,
      type,
      rotation: 0
    };
  }

  private generatePieceWithCircles(circles: Circle[]): Piece {
    // Only 1 slice pieces for now, but adapt to circle slice counts
    const sliceCount = 1;
    const slices: number[] = [];
    
    // Find the minimum slice count among all playable circles to ensure piece can be placed somewhere
    const playableCircles = circles.filter(circle => !circle.isCenterPiece && !circle.locked);
    const minSlices = playableCircles.length > 0 ? Math.min(...playableCircles.map(c => c.totalSlices)) : 6;
    
    // Generate single slice index that will work on all circles
    const startSlice = Phaser.Math.Between(0, minSlices - 1);
    slices.push(startSlice);

    // Only normal pieces for now
    let type: Piece['type'] = 'normal';

    return {
      id: Phaser.Utils.String.UUID(),
      slices,
      type,
      rotation: 0
    };
  }

  private createUI() {
    // Score display - positioned at top for mobile
    this.scoreText = this.add.text(20, 20, 'Score: 0', {
      fontSize: '18px',
      color: '#FFFFFF',
      fontFamily: 'Arial'
    }).setScrollFactor(0);

    this.levelText = this.add.text(20, 45, 'Level: 1', {
      fontSize: '16px',
      color: '#FFFFFF',
      fontFamily: 'Arial'
    }).setScrollFactor(0);

    this.comboText = this.add.text(20, 70, '', {
      fontSize: '14px',
      color: '#FFD700',
      fontFamily: 'Arial'
    }).setScrollFactor(0);

    // Time display for timed mode
    if (this.gameState.gameMode === 'timed') {
      this.timeText = this.add.text(20, 95, 'Time: 60', {
        fontSize: '14px',
        color: '#FF6B6B',
        fontFamily: 'Arial'
      }).setScrollFactor(0);
    }

    // Instructions text
    this.add.text(20, 120, 'Tap surrounding pies to place the center piece', {
      fontSize: '12px',
      color: '#AAAAAA',
      fontFamily: 'Arial'
    }).setScrollFactor(0);
  }

  private createCircles() {
    this.circles = [];
    
    this.gameState.circles.forEach((circleData, index) => {
      const circleContainer = this.add.container(circleData.x, circleData.y);
      
      // Circle background
      const circleBg = this.add.image(0, 0, 'circle');
      circleContainer.add(circleBg);
      
      // Slice indicators
      const sliceIndicators: Phaser.GameObjects.Graphics[] = [];
      for (let i = 0; i < circleData.totalSlices; i++) {
        const indicator = this.add.graphics();
        this.drawSliceIndicator(indicator, i, circleData.totalSlices, false);
        circleContainer.add(indicator);
        sliceIndicators.push(indicator);
      }
      
      // Make circle interactive
      circleBg.setInteractive();
      circleBg.on('pointerdown', () => this.onCircleClick(index));
      circleBg.on('pointerover', () => this.onCircleHover(index, true));
      circleBg.on('pointerout', () => this.onCircleHover(index, false));
      
      circleContainer.setData('circleData', circleData);
      circleContainer.setData('sliceIndicators', sliceIndicators);
      this.circles.push(circleContainer);
    });
  }

  private drawSliceIndicator(graphics: Phaser.GameObjects.Graphics, sliceIndex: number, totalSlices: number, filled: boolean) {
    graphics.clear();
    
    const angle = (sliceIndex / totalSlices) * Math.PI * 2;
    const nextAngle = ((sliceIndex + 1) / totalSlices) * Math.PI * 2;
    const radius = 35; // Smaller radius for compact design
    
    if (filled) {
      // Use watermelon-like colors for filled slices
      graphics.fillStyle(0xFF6B6B); // Red
      graphics.lineStyle(1, 0x27AE60); // Green border
    } else {
      // Empty slices remain dark
      graphics.fillStyle(0x3A3A3A);
      graphics.lineStyle(1, 0x5A5A5A);
    }
    
    graphics.beginPath();
    graphics.moveTo(0, 0);
    graphics.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    graphics.arc(0, 0, radius, angle, nextAngle);
    graphics.lineTo(0, 0);
    graphics.fillPath();
    graphics.strokePath();
    
    // Add seeds for watermelon slices
    if (filled) {
      graphics.fillStyle(0x2C3E50);
      const seedPositions = [
        { x: Math.cos(angle + (nextAngle - angle) * 0.2) * (radius * 0.6), y: Math.sin(angle + (nextAngle - angle) * 0.2) * (radius * 0.6) },
        { x: Math.cos(angle + (nextAngle - angle) * 0.5) * (radius * 0.7), y: Math.sin(angle + (nextAngle - angle) * 0.5) * (radius * 0.7) },
        { x: Math.cos(angle + (nextAngle - angle) * 0.8) * (radius * 0.6), y: Math.sin(angle + (nextAngle - angle) * 0.8) * (radius * 0.6) }
      ];
      
      seedPositions.forEach(pos => {
        graphics.fillCircle(pos.x, pos.y, 1.5);
      });
    }
  }

  private createPieces() {
    // Current piece - positioned at bottom for mobile
    // Current piece is now displayed in center circle
    // Remove old bottom display
    
    // Next piece preview
   
    
    this.nextPieceObj = this.add.container(60, 450);
    this.updateNextPieceDisplay();
  }

  private updateCurrentPieceDisplay() {
    // Update the center circle to show current piece
    const centerCircleIndex = 0; // Center circle is always index 0
    this.updateCenterPieceDisplay();
  }

  private updateCenterPieceDisplay() {
    const centerCircleIndex = 0;
    const circleContainer = this.circles[centerCircleIndex];
    const sliceIndicators = circleContainer.getData('sliceIndicators') as Phaser.GameObjects.Graphics[];
    
    // Clear all slices first
    sliceIndicators.forEach((indicator, index) => {
      this.drawSliceIndicator(indicator, index, 6, false);
    });
    
    // Draw current piece slices
    const piece = this.gameState.currentPiece;
    piece.slices.forEach(sliceIndex => {
      this.drawSliceIndicator(sliceIndicators[sliceIndex], sliceIndex, 6, true);
    });
  }

  private updateNextPieceDisplay() {
    this.nextPieceObj.removeAll(true);
    
    const piece = this.gameState.nextPiece;
    piece.slices.forEach((sliceIndex, i) => {
      const x = i * 25;
      const y = 0;
      
      let texture = 'slice';
      if (piece.type === 'bomb') texture = 'bomb';
      else if (piece.type === 'rainbow') texture = 'rainbow';
      else if (piece.type === 'locked') texture = 'locked';
      
      const slice = this.add.image(x, y, texture).setScale(0.7);
      this.nextPieceObj.add(slice);
      
      // Add slice index text
      const text = this.add.text(x, y, sliceIndex.toString(), {
        fontSize: '10px',
        color: '#FFFFFF',
        fontFamily: 'Arial'
      }).setOrigin(0.5);
      this.nextPieceObj.add(text);
    });
  }

  private createPowerUpButtons() {
    const buttonY = 520;
    const buttonSpacing = 80;
    
    // Shuffle button
    const shuffleButton = this.createPowerUpButton(60, buttonY, 'shuffle', faShuffle);
    this.powerUpButtons.push(shuffleButton);
    
    // Skip button
    const skipButton = this.createPowerUpButton(140, buttonY, 'skip', faSkipForward);
    this.powerUpButtons.push(skipButton);
    
    // Auto-fill button
    const autoFillButton = this.createPowerUpButton(220, buttonY, 'autoFill', faMagic);
    this.powerUpButtons.push(autoFillButton);
  }

  private createPowerUpButton(x: number, y: number, type: keyof PowerUpInventory, icon: any) {
    const button = this.add.container(x, y);
    
    // Button background - smaller for mobile
    const bg = this.add.graphics();
    bg.fillStyle(0x4ECDC4);
    bg.fillRoundedRect(-25, -15, 50, 30, 8);
    bg.lineStyle(1, 0xFFFFFF);
    bg.strokeRoundedRect(-25, -15, 50, 30, 8);
    button.add(bg);
    
    // Icon (using text as placeholder)
    const iconText = this.add.text(0, -3, icon.iconName === 'shuffle' ? '↻' : 
                                         icon.iconName === 'skip-forward' ? '⏭' : '✨', {
      fontSize: '14px',
      color: '#FFFFFF',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
    button.add(iconText);
    
    // Count text
    const countText = this.add.text(0, 8, this.gameState.powerUps[type].toString(), {
      fontSize: '10px',
      color: '#FFFFFF',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
    button.add(countText);
    
    // Make interactive with proper hit area
    bg.setInteractive(new Phaser.Geom.Rectangle(-25, -15, 50, 30), Phaser.Geom.Rectangle.Contains);
    bg.on('pointerdown', () => {
      console.log(`Power-up clicked: ${type}`);
      this.usePowerUp(type);
    });
    
    // Add hover effects
    bg.on('pointerover', () => {
      bg.setAlpha(0.8);
    });
    bg.on('pointerout', () => {
      bg.setAlpha(1);
    });
    
    button.setData('type', type);
    button.setData('countText', countText);
    
    return button;
  }

  private createGameOverOverlay() {
    this.gameOverOverlay = this.add.container(200, 300); // Centered for mobile
    this.gameOverOverlay.setVisible(false);
    
    // Background
    const bg = this.add.graphics();
    bg.fillStyle(0x000000, 0.8);
    bg.fillRect(-200, -300, 400, 600); // Mobile-sized background
    this.gameOverOverlay.add(bg);
    
    // Game over text
    const gameOverText = this.add.text(0, -80, 'Game Over!', {
      fontSize: '32px',
      color: '#FF6B6B',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
    this.gameOverOverlay.add(gameOverText);
    
    // Final score
    const finalScoreText = this.add.text(0, -40, 'Final Score: 0', {
      fontSize: '18px',
      color: '#FFFFFF',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
    this.gameOverOverlay.add(finalScoreText);
    
    // Play again button
    const playAgainBg = this.add.graphics();
    playAgainBg.fillStyle(0x4ECDC4);
    playAgainBg.fillRoundedRect(-80, -15, 160, 30, 10);
    this.gameOverOverlay.add(playAgainBg);
    
    const playAgainText = this.add.text(0, 0, 'Play Again', {
      fontSize: '18px',
      color: '#FFFFFF',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
    this.gameOverOverlay.add(playAgainText);
    
    playAgainBg.setInteractive();
    playAgainBg.on('pointerdown', () => this.restartGame());
    
    this.gameOverOverlay.setData('finalScoreText', finalScoreText);
  }

  private startGame() {
    if (this.gameState.gameMode === 'timed') {
      this.gameState.timeLeft = 60;
      this.timeLeft = this.time.addEvent({
        delay: 1000,
        callback: this.updateTimer,
        callbackScope: this,
        loop: true
      });
    }
  }

  private updateTimer() {
    if (this.gameState.timeLeft && this.gameState.timeLeft > 0) {
      this.gameState.timeLeft--;
      if (this.timeText) {
        this.timeText.setText(`Time: ${this.gameState.timeLeft}`);
      }
      
      if (this.gameState.timeLeft === 0) {
        this.endGame();
      }
    }
  }

  private onCircleClick(circleIndex: number) {
    if (this.gameState.gameOver) return;
    
    const circle = this.gameState.circles[circleIndex];
    
    // Only allow clicking on surrounding pies (not center piece display)
    if (circle.isCenterPiece) {
      return; // Center pie is display only
    }
    
    const canPlace = this.canPlacePiece(this.gameState.currentPiece, circle);
    if (canPlace) {
      // Start the animation - new piece will be generated only after successful placement
      this.placePiece(this.gameState.currentPiece, circleIndex);
    } else {
      // Show invalid placement feedback
      this.tweens.add({
        targets: this.circles[circleIndex],
        alpha: 0.5,
        duration: 200,
        yoyo: true
      });
      
      // Show error feedback immediately for invalid clicks
      this.addErrorFeedback(circle.x, circle.y);
    }
  }

  private onCircleHover(circleIndex: number, isOver: boolean) {
    if (this.gameState.gameOver) return;
    
    const circle = this.circles[circleIndex];
    const circleData = this.gameState.circles[circleIndex];
    
    // Don't allow hovering on center piece
    if (circleData.isCenterPiece) return;
    
    const canPlace = this.canPlacePiece(this.gameState.currentPiece, circleData);
    
    if (isOver && canPlace) {
      circle.setAlpha(0.9);
      // Add a subtle glow effect for valid placements
      this.tweens.add({
        targets: circle,
        scaleX: 1.08,
        scaleY: 1.08,
        duration: 200,
        ease: 'Back.easeOut'
      });
      
      // Add a preview of where the piece will go
      this.showPiecePreview(circleIndex);
    } else if (isOver && !canPlace) {
      circle.setAlpha(0.7);
      // Shake effect for invalid placements
      this.tweens.add({
        targets: circle,
        x: circle.x + 8,
        duration: 60,
        yoyo: true,
        repeat: 4,
        ease: 'Power2.easeInOut',
        onComplete: () => {
          circle.setX(circleData.x);
        }
      });
    } else {
      circle.setAlpha(1);
      // Reset scale
      this.tweens.add({
        targets: circle,
        scaleX: 1,
        scaleY: 1,
        duration: 200,
        ease: 'Power2.easeOut'
      });
      
      // Hide piece preview
      this.hidePiecePreview(circleIndex);
    }
  }

  private showPiecePreview(circleIndex: number) {
    // Remove existing preview if any
    this.hidePiecePreview(circleIndex);
    
    const circleData = this.gameState.circles[circleIndex];
    const piece = this.gameState.currentPiece;
    
    // Create preview slices
    const previewContainer = this.add.container(circleData.x, circleData.y);
    previewContainer.setData('isPreview', true);
    
    piece.slices.forEach(sliceIndex => {
      const previewSlice = this.add.graphics();
      previewSlice.lineStyle(3, 0xFFD700, 0.8);
      previewSlice.fillStyle(0xFFD700, 0.3);
      
      // Calculate exact slice position (same as drawSliceIndicator)
      const sliceAngle = (sliceIndex / 6) * Math.PI * 2; // Same as drawSliceIndicator
      const startAngle = sliceAngle;
      const endAngle = sliceAngle + (Math.PI / 3); // 60 degrees per slice
      const radius = 35; // Same as drawSliceIndicator
      
      previewSlice.beginPath();
      previewSlice.moveTo(0, 0);
      previewSlice.arc(0, 0, radius, startAngle, endAngle);
      previewSlice.closePath();
      previewSlice.fillPath();
      previewSlice.strokePath();
      
      previewContainer.add(previewSlice);
    });
    
    // Store preview container reference
    this.circles[circleIndex].setData('previewContainer', previewContainer);
  }

  private hidePiecePreview(circleIndex: number) {
    const circle = this.circles[circleIndex];
    const previewContainer = circle.getData('previewContainer');
    if (previewContainer) {
      previewContainer.destroy();
      circle.setData('previewContainer', null);
    }
  }

  private canPlacePiece(piece: Piece, circle: Circle): boolean {
    if (circle.locked) return false;
    
    for (const sliceIndex of piece.slices) {
      // Check if slice index is within the circle's slice count
      if (sliceIndex >= circle.totalSlices) {
        return false;
      }
      // Check if the slice position is already filled
      if (circle.filled[sliceIndex]) {
        return false;
      }
    }
    return true;
  }

  private placePiece(piece: Piece, circleIndex: number) {
    const circleData = this.gameState.circles[circleIndex];
    
    // Create animated slice that moves from center to target
    this.animateSliceMovement(piece, circleIndex, () => {
      // This callback runs after animation completes successfully
      // Handle special pieces
      if (piece.type === 'bomb') {
        this.handleBombPiece(circleData);
      } else if (piece.type === 'rainbow') {
        this.handleRainbowPiece(circleData);
      } else if (piece.type === 'locked') {
        this.handleLockedPiece(circleData);
      } else {
        // Normal placement
        piece.slices.forEach(sliceIndex => {
          circleData.filled[sliceIndex] = true;
        });
      }
      
      // Update score
      this.gameState.score += piece.slices.length;
      
      // Add popup animation for successful placement
      this.addPlacementPopupAnimation(circleIndex);
      
      // Update visual representation
      this.updateCircleDisplay(circleIndex);
      
      // Generate new piece for center display ONLY after successful placement
      this.generateNextPiece();
      this.updateCenterPieceDisplay();
      
      // Check for clears and game over
      this.checkForClears();
      this.updateDisplay();
      
      if (!this.hasValidMoves()) {
        this.endGame();
      }
    });
  }

  private handleBombPiece(circle: Circle) {
    // Clear random filled slots
    const filledIndices = circle.filled.map((filled, index) => filled ? index : -1).filter(i => i !== -1);
    if (filledIndices.length > 0) {
      const randomIndex = Phaser.Utils.Array.GetRandom(filledIndices);
      circle.filled[randomIndex] = false;
    }
  }

  private handleRainbowPiece(circle: Circle) {
    // Fill any empty slot
    const emptyIndex = circle.filled.findIndex(filled => !filled);
    if (emptyIndex !== -1) {
      circle.filled[emptyIndex] = true;
    }
  }

  private handleLockedPiece(circle: Circle) {
    // Lock the circle
    circle.locked = true;
  }

  private animateSliceMovement(piece: Piece, targetCircleIndex: number, onComplete: () => void) {
    const centerCircle = this.gameState.circles[0]; // Center circle
    const targetCircle = this.gameState.circles[targetCircleIndex];
    
    // Create line indicator showing the path (will be removed when slice starts moving)
    const lineIndicator = this.add.graphics();
    lineIndicator.lineStyle(4, 0xFFD700, 0.8);
    lineIndicator.lineBetween(centerCircle.x, centerCircle.y, targetCircle.x, targetCircle.y);
    
    // Create temporary slice sprite that moves from center to target
    piece.slices.forEach((sliceIndex, i) => {
      const sliceSprite = this.add.image(centerCircle.x, centerCircle.y, 'watermelon');
      sliceSprite.setScale(0.8);
      
      // Add a glowing trail effect
      const trail = this.add.graphics();
      sliceSprite.setData('trail', trail);
      
      // Calculate exact target position - SAME position as in center pie
      // Use EXACT same calculation as drawSliceIndicator method
      const sliceAngle = (sliceIndex / 6) * Math.PI * 2; // Same as drawSliceIndicator - starts from right (0°)
      const sliceRadius = 35; // Same radius as drawSliceIndicator
      const exactTargetX = targetCircle.x + Math.cos(sliceAngle) * sliceRadius;
      const exactTargetY = targetCircle.y + Math.sin(sliceAngle) * sliceRadius;
      
      // Remove the line indicator when slice starts moving
      lineIndicator.destroy();
      
      // Animate the slice moving from center to exact target position
      this.tweens.add({
        targets: sliceSprite,
        x: exactTargetX,
        y: exactTargetY,
        scaleX: 1.2,
        scaleY: 1.2,
        duration: 800,
        ease: 'Power2.easeOut',
        onUpdate: () => {
          // Update trail effect
          trail.clear();
          trail.lineStyle(3, 0xFFD700, 0.6);
          trail.lineBetween(centerCircle.x, centerCircle.y, sliceSprite.x, sliceSprite.y);
          
          // Add glow effect around slice
          trail.fillStyle(0xFFD700, 0.2);
          trail.fillCircle(sliceSprite.x, sliceSprite.y, 15);
        },
        onComplete: () => {
          // Only place the piece when it reaches exact position
          if (this.canPlacePieceAtExactPosition(piece, targetCircle, sliceIndex)) {
            // Successful placement - pop effect
            this.tweens.add({
              targets: sliceSprite,
              scaleX: 1.5,
              scaleY: 1.5,
              alpha: 0.8,
              duration: 150,
              yoyo: true,
              onComplete: () => {
                sliceSprite.destroy();
                trail.destroy();
                
                // Call completion callback for the last slice
                if (i === piece.slices.length - 1) {
                  onComplete();
                }
              }
            });
          } else {
            // Invalid placement - bounce back to center
            this.tweens.add({
              targets: sliceSprite,
              x: centerCircle.x,
              y: centerCircle.y,
              scaleX: 0.5,
              scaleY: 0.5,
              alpha: 0.3,
              duration: 400,
              ease: 'Back.easeIn',
              onComplete: () => {
                sliceSprite.destroy();
                trail.destroy();
                
                // Show error feedback
                this.addErrorFeedback(targetCircle.x, targetCircle.y);
              }
            });
          }
        }
      });
      
      // Add rotation during movement
      this.tweens.add({
        targets: sliceSprite,
        rotation: Math.PI * 2,
        duration: 800,
        ease: 'Linear'
      });
    });
  }

  private canPlacePieceAtExactPosition(piece: Piece, targetCircle: Circle, sliceIndex: number): boolean {
    // Check if the exact same slice position is available on target pie
    // Same position as it was in center pie
    return !targetCircle.filled[sliceIndex] && !targetCircle.locked;
  }

  private addErrorFeedback(x: number, y: number) {
    // Create error X symbol
    const errorText = this.add.text(x, y, 'X', {
      fontSize: '32px',
      color: '#FF4444',
      fontFamily: 'Arial',
      stroke: '#FFFFFF',
      strokeThickness: 3
    }).setOrigin(0.5);
    
    // Animate error feedback
    this.tweens.add({
      targets: errorText,
      scaleX: 1.5,
      scaleY: 1.5,
      alpha: 0,
      duration: 500,
      ease: 'Power2.easeOut',
      onComplete: () => {
        errorText.destroy();
      }
    });
  }

  private addPlacementPopupAnimation(circleIndex: number) {
    const circleDisplay = this.circles[circleIndex];
    
    // Scale bounce animation
    this.tweens.add({
      targets: circleDisplay,
      scaleX: 1.15,
      scaleY: 1.15,
      duration: 150,
      ease: 'Back.easeOut',
      yoyo: true
    });
    
    // Add particle burst effect
    this.addParticleBurst(circleDisplay.x, circleDisplay.y);
    
    // Add score popup
    this.addScorePopup(circleDisplay.x, circleDisplay.y - 40, '+1');
  }

  private addParticleBurst(x: number, y: number) {
    // Create particle burst effect
    for (let i = 0; i < 8; i++) {
      const particle = this.add.circle(x, y, 3, 0xFFD700);
      particle.setAlpha(0.8);
      
      const angle = (i / 8) * Math.PI * 2;
      const distance = 30;
      const targetX = x + Math.cos(angle) * distance;
      const targetY = y + Math.sin(angle) * distance;
      
      this.tweens.add({
        targets: particle,
        x: targetX,
        y: targetY,
        alpha: 0,
        scaleX: 0,
        scaleY: 0,
        duration: 500,
        ease: 'Power2.easeOut',
        onComplete: () => {
          particle.destroy();
        }
      });
    }
  }

  private addScorePopup(x: number, y: number, text: string) {
    const scoreText = this.add.text(x, y, text, {
      fontSize: '20px',
      color: '#FFD700',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);
    
    // Animate score popup
    this.tweens.add({
      targets: scoreText,
      y: y - 30,
      alpha: 0,
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 800,
      ease: 'Power2.easeOut',
      onComplete: () => {
        scoreText.destroy();
      }
    });
  }

  private addClearingAnimation(circleIndex: number) {
    const circleDisplay = this.circles[circleIndex];
    
    // Explosion effect with multiple particles
    for (let i = 0; i < 12; i++) {
      const particle = this.add.circle(circleDisplay.x, circleDisplay.y, 4, 0xFF6B6B);
      particle.setAlpha(1);
      
      const angle = (i / 12) * Math.PI * 2;
      const distance = 50 + Math.random() * 20;
      const targetX = circleDisplay.x + Math.cos(angle) * distance;
      const targetY = circleDisplay.y + Math.sin(angle) * distance;
      
      this.tweens.add({
        targets: particle,
        x: targetX,
        y: targetY,
        alpha: 0,
        scaleX: 0,
        scaleY: 0,
        duration: 600,
        delay: Math.random() * 100,
        ease: 'Power2.easeOut',
        onComplete: () => {
          particle.destroy();
        }
      });
    }
    
    // Circle pulsing effect
    this.tweens.add({
      targets: circleDisplay,
      scaleX: 1.3,
      scaleY: 1.3,
      alpha: 0.7,
      duration: 200,
      yoyo: true,
      repeat: 2,
      onComplete: () => {
        circleDisplay.setAlpha(1);
        circleDisplay.setScale(1);
      }
    });
    
    // Add "CLEARED!" text popup
    const clearText = this.add.text(circleDisplay.x, circleDisplay.y - 60, 'CLEARED!', {
      fontSize: '24px',
      color: '#FFD700',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);
    
    this.tweens.add({
      targets: clearText,
      y: clearText.y - 40,
      alpha: 0,
      scaleX: 1.8,
      scaleY: 1.8,
      duration: 1000,
      ease: 'Power2.easeOut',
      onComplete: () => {
        clearText.destroy();
      }
    });
  }

  private checkForClears() {
    let clearedCount = 0;
    
    this.gameState.circles.forEach((circle, index) => {
      if (circle.filled.every(filled => filled) && !circle.locked) {
        this.clearCircle(circle);
        clearedCount++;
        this.updateCircleDisplay(index);
      }
    });
    
    if (clearedCount > 0) {
      this.gameState.combo++;
      const bonus = 10 * this.gameState.combo * clearedCount;
      this.gameState.score += bonus;
      
      // Check for level up
      if (this.gameState.score > this.gameState.level * 1000) {
        this.gameState.level++;
        this.increaseDifficulty();
      }
    } else {
      this.gameState.combo = 0;
    }
  }

  private clearCircle(circle: Circle) {
    circle.filled.fill(false);
    circle.clears++;
    
    // Add clearing animation
    const circleIndex = this.gameState.circles.indexOf(circle);
    if (circleIndex !== -1) {
      this.addClearingAnimation(circleIndex);
    }
    
    // Unlock circle after 2 clears
    if (circle.clears >= 2) {
      circle.locked = false;
    }
    
    // Add visual effect
    this.tweens.add({
      targets: this.circles[circle.id],
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 200,
      yoyo: true
    });
  }

  private increaseDifficulty() {
    // Increase slice count on all non-center circles
    this.gameState.circles.forEach((circle, index) => {
      if (!circle.isCenterPiece) {
        const newSliceCount = Math.min(6 + this.gameState.level, 12);
        
        // Only increase if we can add more slices
        if (newSliceCount > circle.totalSlices) {
          const oldSliceCount = circle.totalSlices;
          circle.totalSlices = newSliceCount;
          
          // Expand the filled array with false values for new slices
          const newFilled = [...circle.filled];
          for (let i = oldSliceCount; i < newSliceCount; i++) {
            newFilled[i] = false;
          }
          circle.filled = newFilled;
          
          // Update the visual display
          this.updateCircleSlices(circle, index);
          
          // Add visual feedback for difficulty increase
          this.addDifficultyIncreaseAnimation(circle);
        }
      }
    });
  }

  private updateCircleSlices(circle: Circle, circleIndex: number) {
    // Find the circle container
    const circleContainer = this.circles[circleIndex];
    if (!circleContainer) return;
    
    // Get existing slice indicators
    const sliceIndicators = circleContainer.getData('sliceIndicators') as Phaser.GameObjects.Graphics[];
    
    // Clear existing slice indicators
    sliceIndicators.forEach(indicator => indicator.destroy());
    
    // Create new slice indicators for the increased slice count
    const newSliceIndicators: Phaser.GameObjects.Graphics[] = [];
    for (let i = 0; i < circle.totalSlices; i++) {
      const indicator = this.add.graphics();
      circleContainer.add(indicator);
      this.drawSliceIndicator(indicator, i, circle.totalSlices, circle.filled[i]);
      newSliceIndicators.push(indicator);
    }
    
    // Update the stored slice indicators
    circleContainer.setData('sliceIndicators', newSliceIndicators);
  }

  private addDifficultyIncreaseAnimation(circle: Circle) {
    // Add pulsing effect to indicate difficulty increase
    const circleContainer = this.circles[circle.id];
    if (!circleContainer) return;
    
    // Pulsing animation
    this.tweens.add({
      targets: circleContainer,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 300,
      yoyo: true,
      ease: 'Power2'
    });
    
    // Add "LEVEL UP!" text above the circle
    const levelUpText = this.add.text(circle.x, circle.y - 80, `LEVEL UP!\n${circle.totalSlices} Slices`, {
      fontSize: '16px',
      color: '#FFD700',
      fontFamily: 'Arial',
      align: 'center'
    }).setOrigin(0.5);
    
    // Animate the text
    this.tweens.add({
      targets: levelUpText,
      alpha: 0,
      y: levelUpText.y - 50,
      duration: 2000,
      ease: 'Power2',
      onComplete: () => levelUpText.destroy()
    });
  }

  private createSingleCircle(circleData: Circle) {
    const circleContainer = this.add.container(circleData.x, circleData.y);
    
    // Circle background
    const circleBg = this.add.image(0, 0, 'circle');
    circleContainer.add(circleBg);
    
    // Slice indicators
    const sliceIndicators: Phaser.GameObjects.Graphics[] = [];
    for (let i = 0; i < circleData.totalSlices; i++) {
      const indicator = this.add.graphics();
      this.drawSliceIndicator(indicator, i, circleData.totalSlices, false);
      circleContainer.add(indicator);
      sliceIndicators.push(indicator);
    }
    
    // Make circle interactive
    circleBg.setInteractive();
    circleBg.on('pointerdown', () => this.onCircleClick(circleData.id));
    circleBg.on('pointerover', () => this.onCircleHover(circleData.id, true));
    circleBg.on('pointerout', () => this.onCircleHover(circleData.id, false));
    
    circleContainer.setData('circleData', circleData);
    circleContainer.setData('sliceIndicators', sliceIndicators);
    this.circles.push(circleContainer);
  }

  private generateNextPiece() {
    this.gameState.currentPiece = this.gameState.nextPiece;
    this.gameState.nextPiece = this.generatePiece();
    
    // Check for game over after generating new piece
    if (!this.hasValidMoves()) {
      this.endGame();
    }
  }

  private hasValidMoves(): boolean {
    let validMoves = 0;
    for (const circle of this.gameState.circles) {
      // Skip center piece - it's only for display, not playable
      if (circle.isCenterPiece) {
        continue;
      }
      
      if (this.canPlacePiece(this.gameState.currentPiece, circle)) {
        validMoves++;
        return true;
      }
    }
    
    console.log(`Game Over Check: ${validMoves} valid moves found for current piece:`, this.gameState.currentPiece);
    return false;
  }

  private usePowerUp(type: keyof PowerUpInventory) {
    if (this.gameState.powerUps[type] <= 0) return;
    
    this.gameState.powerUps[type]--;
    
    switch (type) {
      case 'shuffle':
        this.gameState.currentPiece = this.generatePiece();
        // Update center piece display after shuffle
        this.updateCenterPieceDisplay();
        // Check for game over after shuffle
        if (!this.hasValidMoves()) {
          this.endGame();
          return;
        }
        break;
      case 'skip':
        this.generateNextPiece();
        // generateNextPiece already checks for game over
        break;
      case 'autoFill':
        // Find first incomplete circle and fill it
        const incompleteCircle = this.gameState.circles.find(circle => 
          !circle.filled.every(filled => filled) && !circle.locked
        );
        if (incompleteCircle) {
          incompleteCircle.filled.fill(true);
          this.checkForClears();
        }
        break;
    }
    
    this.updateDisplay();
  }

  private updateDisplay() {
    this.scoreText.setText(`Score: ${this.gameState.score}`);
    this.levelText.setText(`Level: ${this.gameState.level}`);
    
    if (this.gameState.combo > 0) {
      this.comboText.setText(`Combo x${this.gameState.combo}!`);
    } else {
      this.comboText.setText('');
    }
    
    this.updateCurrentPieceDisplay();
    this.updateNextPieceDisplay();
    
    // Update power-up counts
    this.powerUpButtons.forEach(button => {
      const type = button.getData('type') as keyof PowerUpInventory;
      const countText = button.getData('countText');
      countText.setText(this.gameState.powerUps[type].toString());
    });
    
    // Update circle displays
    this.gameState.circles.forEach((circle, index) => {
      this.updateCircleDisplay(index);
    });
  }

  private updateCircleDisplay(circleIndex: number) {
    const circleContainer = this.circles[circleIndex];
    const circleData = this.gameState.circles[circleIndex];
    const sliceIndicators = circleContainer.getData('sliceIndicators') as Phaser.GameObjects.Graphics[];
    
    // Handle center piece display differently
    if (circleData.isCenterPiece) {
      this.updateCenterPieceDisplay();
      return;
    }
    
    // Handle surrounding game boards normally
    sliceIndicators.forEach((indicator, index) => {
      this.drawSliceIndicator(indicator, index, circleData.totalSlices, circleData.filled[index]);
    });
    
    // Visual feedback for locked circles
    if (circleData.locked) {
      circleContainer.setAlpha(0.6);
    } else {
      circleContainer.setAlpha(1);
    }
  }

  private endGame() {
    this.gameState.gameOver = true;
    
    // Show game over overlay
    this.gameOverOverlay.setVisible(true);
    const finalScoreText = this.gameOverOverlay.getData('finalScoreText');
    finalScoreText.setText(`Final Score: ${this.gameState.score}`);
    
    // Call the callback to save score
    this.onGameEnd(this.gameState.score, this.gameState.level);
  }

  private restartGame() {
    this.scene.restart();
  }
}

export default function SlicesGame({ onBack }: SlicesGameProps) {
  const { context, actions } = useMiniAppContext();
  const gameRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [gameInitialized, setGameInitialized] = useState(false);
  const [gameOverState, setGameOverState] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showGiftBox, setShowGiftBox] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [previousBestScore, setPreviousBestScore] = useState(() => parseInt(localStorage.getItem('slicesMaxScore') || '0'));
  const [gameKey, setGameKey] = useState<number>(0);
  
  // Internal loading state
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showInternalLoader, setShowInternalLoader] = useState(true);
  
  // Blockchain transaction state for Play Again
  const [showTransactionPopup, setShowTransactionPopup] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<'idle' | 'pending' | 'confirmed' | 'error'>('idle');
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  
  const [showConfirmEnd, setShowConfirmEnd] = useState(false);
  const [showShop, setShowShop] = useState(false);

  const { isConnected, address } = useAccount();
  const { writeContract, data: hash, error, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Initialize game when component mounts
  useEffect(() => {
    if (!gameRef.current || gameInitialized) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 400,
      height: 600,
      parent: gameRef.current,
      backgroundColor: '#2A2A2A',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false
        }
      },
      scene: SlicesGameScene,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        min: {
          width: 350,
          height: 500
        },
        max: {
          width: 450,
          height: 700
        }
      }
    };

    let game: Phaser.Game | null = null;
    
    try {
      game = new Phaser.Game(config);
      
      // Pass callback to scene
      game.scene.start('SlicesGameScene', {
        onGameEnd: handleGameEnd
      });
      
      setGameInitialized(true);
      setShowInternalLoader(false);
    } catch (error) {
      console.error('Failed to initialize Phaser game:', error);
      setShowInternalLoader(false);
    }

    return () => {
      if (game) {
        game.destroy(true);
      }
      setGameInitialized(false);
    };
  }, [gameKey]);

  // Handle game end
  const handleGameEnd = async (finalScore: number, finalLevel: number) => {
    setScore(finalScore);
    setLevel(finalLevel);
    setGameOver(true);
    setGameOverState(true);

    // Animate score
    animateScore(finalScore);

    // Save best score
    if (finalScore > previousBestScore) {
      setPreviousBestScore(finalScore);
      localStorage.setItem('slicesMaxScore', finalScore.toString());
    }

    // Save game data
    try {
      if ((context as any)?.user?.fid) {
        await saveGameData(finalScore, finalLevel);
      }
    } catch (error) {
      console.error('Error saving game data:', error);
    }
  };

  const saveGameData = async (finalScore: number, finalLevel: number) => {
    if (!(context as any)?.user?.fid) return;

    try {
      const gameData = {
        fid: (context as any).user.fid,
        pfpUrl: (context as any).user.pfpUrl,
        username: (context as any).user.username,
        score: finalScore,
        level: finalLevel,
        duration: Math.floor(Date.now() / 1000) - Math.floor(Date.now() / 1000), // Calculate actual duration
        userAddress: address || '',
        faucetClaimed: false
      };

      const response = await authenticatedFetch('/api/submit-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData),
      });

      if (response.ok) {
        console.log('Game data saved successfully');
      } else {
        console.error('Failed to save game data');
      }
    } catch (error) {
      console.error('Error saving game data:', error);
    }
  };

  const animateScore = (targetScore: number) => {
    const duration = 2000;
    const startTime = Date.now();
    const startScore = animatedScore;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      const currentScore = Math.floor(startScore + (targetScore - startScore) * easeOut);
      setAnimatedScore(currentScore);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  };

  // Start new game
  const startNewGame = async () => {
    if (!isConnected) {
      console.log('Wallet not connected');
      return;
    }

    try {
      setTransactionStatus('idle');
      setTransactionHash(null);
      
      const { CONTRACT_ADDRESSES, TOKEN_REWARD_ABI } = await import('@/lib/contracts');
      
      writeContract({
        address: CONTRACT_ADDRESSES.TOKEN_REWARD as `0x${string}`,
        abi: TOKEN_REWARD_ABI,
        functionName: 'startGame',
        args: []
      });
    } catch (err) {
      console.error('Failed to start game transaction:', err);
      setTransactionStatus('error');
      setShowTransactionPopup(true);
    }
  };

  // Handle transaction status updates
  useEffect(() => {
    if (isPending) {
      setTransactionStatus('pending');
      setShowTransactionPopup(true);
    } else if (isConfirming) {
      setTransactionStatus('pending');
    } else if (isConfirmed) {
      setTransactionStatus('confirmed');
      setTransactionHash(hash || null);
      // Auto-close popup after 2 seconds and start game
      setTimeout(() => {
        setShowTransactionPopup(false);
        setGameKey(prev => prev + 1); // Restart game
        setGameOver(false);
        setGameOverState(false);
        setScore(0);
        setLevel(1);
        setAnimatedScore(0);
        setTransactionStatus('idle');
      }, 2000);
    } else if (error) {
      setTransactionStatus('error');
      setShowTransactionPopup(true);
    }
  }, [isPending, isConfirming, isConfirmed, error, hash]);

  return (
    <div className="h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 overflow-hidden">
      {/* Game Container */}
      <div className="relative w-full h-full">
        {/* Loading Screen */}
        {showInternalLoader && (
          <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white text-lg">Loading Slices Game...</p>
              <div className="w-64 bg-gray-700 rounded-full h-2 mt-4">
                <div 
                  className="bg-cyan-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Game Canvas */}
        <div 
          ref={gameRef} 
          className="w-full h-full"
          style={{ 
            filter: gameOverState ? 'blur(3px)' : 'none',
            transition: 'filter 0.3s ease'
          }}
        />

        {/* UI Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top Controls */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-auto">
            {/* Back Button */}
            <button
              onClick={() => setShowConfirmEnd(true)}
              className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all duration-200"
            >
              <FontAwesomeIcon icon={faHome} className="text-xl" />
            </button>

            {/* Score Display */}
            <div className="bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">
                  {animatedScore.toLocaleString()}
                </div>
                {previousBestScore > 0 && (
                  <div className="text-sm text-gray-300">
                    Best: {previousBestScore.toLocaleString()}
                  </div>
                )}
              </div>
            </div>

            {/* Gift Box Button */}
            <button
              onClick={() => setShowGiftBox(true)}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white p-3 rounded-full transition-all duration-200 shadow-lg"
            >
              <FontAwesomeIcon icon={faGift} className="text-xl" />
            </button>
          </div>

          {/* Game Over Screen - Similar to CandyCrush */}
          {gameOver && (
            <>
              {/* Back to Games Button - Top Left */}
              <button
                onClick={onBack}
                className="fixed top-2 left-0 z-[2100] px-4 py-2 text-xl font-bold text-white border-none rounded-md cursor-pointer transition-all duration-200 pointer-events-auto hover:scale-105"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                ◀ Home
              </button>

              {/* Game Over Content */}
              <div className="fixed inset-0 flex flex-col items-center justify-center z-[2000] pointer-events-none">
                {/* Modern Game Over Text */}
                <div className="text-center mb-5">
                  <h1 className="text-4xl font-bold text-white m-0 text-center tracking-wide" style={{
                    textShadow: '0 4px 8px rgba(0,0,0,0.3)'
                  }}>
                    GAME OVER!
                  </h1>
                </div>

                {/* Modern Score Display */}
                <div className="flex flex-col items-center gap-4 mb-6">
                  {/* Score Card */}
                  <div className="bg-black bg-opacity-30 backdrop-blur-lg rounded-2xl p-6 text-center text-white min-w-[200px] shadow-2xl">
                    <div className="text-sm font-medium opacity-80 mb-2 uppercase tracking-wide">
                      Final Score
                    </div>
                    <div className="text-5xl font-bold leading-none mb-2">
                      {animatedScore.toLocaleString()}
                    </div>
                    {score > previousBestScore && previousBestScore > 0 && (
                      <div className="text-xs text-yellow-200 font-semibold bg-green-500 bg-opacity-10 px-2 py-1 rounded-xl border border-green-500 border-opacity-20">
                        🔥 +{Math.round(((score - previousBestScore) / previousBestScore) * 100)}% Personal Best
                      </div>
                    )}
                    <div className="text-sm opacity-70 mt-2">
                      Level {level}
                    </div>
                  </div>
                  
                  {/* Share Button */}
                  <button 
                    onClick={async () => {
                      try {
                        const improvementText = score > previousBestScore && previousBestScore > 0 
                          ? `\n\n🔥 That's +${Math.round(((score - previousBestScore) / previousBestScore) * 100)}% improvement from my Highest Score!`
                          : '';
                        
                        const shareText = `🍰 Sliced my way to ${score} points in Slices, reached level ${level} 🎯
Come challenge my spot or stay mid 😏🏆${improvementText}`;
                        
                        const shareUrl = `https://farcaster.xyz/miniapps/djk3nS-wYTQu/chain-crush`;
                        
                        if (actions && actions.composeCast) {
                          await actions.composeCast({
                            text: shareText,
                            embeds: [shareUrl],
                          });
                        } 
                      } catch (error) {
                        console.error('Error sharing score:', error);
                      }
                    }}
                    className="bg-gradient-to-r from-purple-600 to-purple-800 border-none rounded-2xl px-6 py-3 text-white text-base font-semibold cursor-pointer flex items-center gap-2 transition-all duration-300 shadow-lg hover:-translate-y-0.5 hover:shadow-xl pointer-events-auto"
                    style={{
                      background: 'linear-gradient(135deg, #664eea 0%, #764ba2 100%)',
                      boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)'
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" fill="none">
                      <rect width="256" height="256" rx="56" fill="#7C65C1"></rect>
                      <path d="M183.296 71.68H211.968L207.872 94.208H200.704V180.224L201.02 180.232C204.266 180.396 206.848 183.081 206.848 186.368V191.488L207.164 191.496C210.41 191.66 212.992 194.345 212.992 197.632V202.752H155.648V197.632C155.648 194.345 158.229 191.66 161.476 191.496L161.792 191.488V186.368C161.792 183.081 164.373 180.396 167.62 180.232L167.936 180.224V138.24C167.936 116.184 150.056 98.304 128 98.304C105.944 98.304 88.0638 116.184 88.0638 138.24V180.224L88.3798 180.232C91.6262 180.396 94.2078 183.081 94.2078 186.368V191.488L94.5238 191.496C97.7702 191.66 100.352 194.345 100.352 197.632V202.752H43.0078V197.632C43.0078 194.345 45.5894 191.66 48.8358 191.496L49.1518 191.488V186.368C49.1518 183.081 51.7334 180.396 54.9798 180.232L55.2958 180.224V94.208H48.1278L44.0318 71.68H72.7038V54.272H183.296V71.68Z" fill="white"></path>
                    </svg>
                    Share Achievement
                  </button>
                </div>

                {/* Play Again Button */}
                <button
                  onClick={startNewGame}
                  disabled={isPending || isConfirming}
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:-translate-y-0.5 pointer-events-auto"
                >
                  {isPending || isConfirming ? (
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                      Processing...
                    </div>
                  ) : (
                    '🎮 Play Again'
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Transaction Popup */}
        {showTransactionPopup && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg text-white p-8 rounded-2xl text-center max-w-md">
              <div className="text-4xl mb-4">
                {transactionStatus === 'pending' && (
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin text-cyan-400" />
                )}
                {transactionStatus === 'confirmed' && (
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-400" />
                )}
                {transactionStatus === 'error' && (
                  <FontAwesomeIcon icon={faTimesCircle} className="text-red-400" />
                )}
              </div>
              
              <div className="text-xl font-bold mb-2">
                {transactionStatus === 'pending' && 'Processing Transaction...'}
                {transactionStatus === 'confirmed' && 'Transaction Confirmed!'}
                {transactionStatus === 'error' && 'Transaction Failed'}
              </div>
              
              <div className="text-sm text-gray-300">
                {transactionStatus === 'pending' && 'Please wait while we process your game start transaction...'}
                {transactionStatus === 'confirmed' && 'Starting new game...'}
                {transactionStatus === 'error' && 'Something went wrong. Please try again.'}
              </div>
              
              {transactionHash && (
                <div className="mt-4 text-xs text-gray-400 break-all">
                  {transactionHash}
                </div>
              )}
              
              {transactionStatus === 'error' && (
                <button
                  onClick={() => setShowTransactionPopup(false)}
                  className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Confirm End Game Modal */}
      <ConfirmEndGameModal 
        open={showConfirmEnd} 
        message="Are you sure you want to end the game?"
        onClose={() => setShowConfirmEnd(false)} 
          onConfirm={() => {
            setShowConfirmEnd(false);
            setGameOver(true);
            setGameOverState(true);
          }}
      />

      {/* Gift Box Modal */}
      {showGiftBox && (
        <GiftBox 
          onClose={() => setShowGiftBox(false)}
          onClaimComplete={() => setShowGiftBox(false)}
        />
      )}

      {/* Shop Modal */}
      {showShop && (
        <Shop 
          onClose={() => setShowShop(false)}
          fid={(context as any)?.user?.fid}
        />
      )}
    </div>
  );
}

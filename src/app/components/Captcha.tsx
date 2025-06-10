// pages/index.tsx
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import 'animate.css';

const puzzleImages = [
  '/19ee8b51fcc935da37d2604ab0975cf19eff9263.jpg',
  '/85e294ef76fe7d3df00bfe9ed9d8335ff4b1bdde.png',
  '/f02ab4b2b4aeffe41f18ff4ece3c64bd20e9a0f4.png',
  '/3d77b13a07b3de61003c22d15543e99c9e08b69b.jpg',
  '/3f2d6accc75c110ef56133c925391f3490a2346f.jpg'
];

interface PuzzleShape {
  type: 'square' | 'triangle';
  topTab: boolean;
  rightTab: boolean;
  bottomTab: boolean;
  leftTab: boolean;
  tabSize: number;
}

// Add the onVerify prop interface
interface CaptchaProps {
  onVerify: () => void;
}

export default function Captcha({ onVerify }: CaptchaProps) {
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [sliderLeft, setSliderLeft] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [targetPosition, setTargetPosition] = useState(120);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [currentShape, setCurrentShape] = useState<PuzzleShape>({
    type: 'square',
    topTab: true,
    rightTab: true,
    bottomTab: false,
    leftTab: false,
    tabSize: 15
  });

  const trackRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const puzzlePieceRef = useRef<HTMLCanvasElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const maxSlide = useRef(0);
  const startX = useRef(0);
  const currentX = useRef(0);

  const puzzlePieceWidth = 80;
  const puzzlePieceHeight = 80;
  const tolerance = 15;

  const handleCaptchaSuccess = () => {
    setVerified(true);
    onVerify(); // Notify parent component
  };

  // Generate random puzzle shape (square or triangle type)
  const generateRandomShape = (): PuzzleShape => {
    const shapeType = Math.random() > 0.5 ? 'square' : 'triangle';
    
    return {
      type: shapeType,
      topTab: Math.random() > 0.5,
      rightTab: Math.random() > 0.5,
      bottomTab: Math.random() > 0.5,
      leftTab: Math.random() > 0.5,
      tabSize: 12 + Math.random() * 8 // 12-20px
    };
  };

  // Generate random target position
  const generateRandomPosition = () => {
    if (imageContainerRef.current) {
      const containerWidth = imageContainerRef.current.offsetWidth;
      const minPos = 50;
      const maxPos = containerWidth - puzzlePieceWidth - 50;
      const randomPos = Math.floor(Math.random() * (maxPos - minPos) + minPos);
      setTargetPosition(randomPos);
    }
  };

  // Handle clicking outside the modal to close it
  const handleModalClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setShowCaptcha(false);
      setSliderLeft(0);
      setCompleted(false);
      setImageLoaded(false);
    }
  };

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showCaptcha) {
        setShowCaptcha(false);
        setSliderLeft(0);
        setCompleted(false);
        setImageLoaded(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [showCaptcha]);

  useEffect(() => {
    if (trackRef.current && buttonRef.current) {
      maxSlide.current = trackRef.current.offsetWidth - buttonRef.current.offsetWidth;
    }
  }, [showCaptcha]);

  // Create puzzle piece and hole when image loads
  useEffect(() => {
    if (imageLoaded && showCaptcha) {
      createPuzzlePiece();
    }
  }, [imageLoaded, showCaptcha, targetPosition, currentImage, currentShape]);

  const drawSquareShape = (ctx: CanvasRenderingContext2D, x: number, y: number, shape: PuzzleShape) => {
    const { topTab, rightTab, bottomTab, leftTab, tabSize } = shape;
    
    ctx.beginPath();
    ctx.moveTo(x + 5, y); // Start with slight rounded corner
    
    // Top side with tabs
    if (topTab) {
      ctx.lineTo(x + puzzlePieceWidth * 0.35, y);
      ctx.quadraticCurveTo(x + puzzlePieceWidth * 0.4, y - tabSize, x + puzzlePieceWidth * 0.5, y - tabSize);
      ctx.quadraticCurveTo(x + puzzlePieceWidth * 0.6, y - tabSize, x + puzzlePieceWidth * 0.65, y);
      ctx.lineTo(x + puzzlePieceWidth - 5, y);
    } else {
      ctx.lineTo(x + puzzlePieceWidth * 0.35, y);
      ctx.quadraticCurveTo(x + puzzlePieceWidth * 0.4, y + tabSize * 0.6, x + puzzlePieceWidth * 0.5, y + tabSize * 0.6);
      ctx.quadraticCurveTo(x + puzzlePieceWidth * 0.6, y + tabSize * 0.6, x + puzzlePieceWidth * 0.65, y);
      ctx.lineTo(x + puzzlePieceWidth - 5, y);
    }
    
    // Top-right corner (slightly rounded)
    ctx.quadraticCurveTo(x + puzzlePieceWidth, y, x + puzzlePieceWidth, y + 5);
    
    // Right side with tabs
    if (rightTab) {
      ctx.lineTo(x + puzzlePieceWidth, y + puzzlePieceHeight * 0.35);
      ctx.quadraticCurveTo(x + puzzlePieceWidth + tabSize, y + puzzlePieceHeight * 0.4, x + puzzlePieceWidth + tabSize, y + puzzlePieceHeight * 0.5);
      ctx.quadraticCurveTo(x + puzzlePieceWidth + tabSize, y + puzzlePieceHeight * 0.6, x + puzzlePieceWidth, y + puzzlePieceHeight * 0.65);
      ctx.lineTo(x + puzzlePieceWidth, y + puzzlePieceHeight - 5);
    } else {
      ctx.lineTo(x + puzzlePieceWidth, y + puzzlePieceHeight * 0.35);
      ctx.quadraticCurveTo(x + puzzlePieceWidth - tabSize * 0.6, y + puzzlePieceHeight * 0.4, x + puzzlePieceWidth - tabSize * 0.6, y + puzzlePieceHeight * 0.5);
      ctx.quadraticCurveTo(x + puzzlePieceWidth - tabSize * 0.6, y + puzzlePieceHeight * 0.6, x + puzzlePieceWidth, y + puzzlePieceHeight * 0.65);
      ctx.lineTo(x + puzzlePieceWidth, y + puzzlePieceHeight - 5);
    }
    
    // Bottom-right corner
    ctx.quadraticCurveTo(x + puzzlePieceWidth, y + puzzlePieceHeight, x + puzzlePieceWidth - 5, y + puzzlePieceHeight);
    
    // Bottom side with tabs
    if (bottomTab) {
      ctx.lineTo(x + puzzlePieceWidth * 0.65, y + puzzlePieceHeight);
      ctx.quadraticCurveTo(x + puzzlePieceWidth * 0.6, y + puzzlePieceHeight + tabSize, x + puzzlePieceWidth * 0.5, y + puzzlePieceHeight + tabSize);
      ctx.quadraticCurveTo(x + puzzlePieceWidth * 0.4, y + puzzlePieceHeight + tabSize, x + puzzlePieceWidth * 0.35, y + puzzlePieceHeight);
      ctx.lineTo(x + 5, y + puzzlePieceHeight);
    } else {
      ctx.lineTo(x + puzzlePieceWidth * 0.65, y + puzzlePieceHeight);
      ctx.quadraticCurveTo(x + puzzlePieceWidth * 0.6, y + puzzlePieceHeight - tabSize * 0.6, x + puzzlePieceWidth * 0.5, y + puzzlePieceHeight - tabSize * 0.6);
      ctx.quadraticCurveTo(x + puzzlePieceWidth * 0.4, y + puzzlePieceHeight - tabSize * 0.6, x + puzzlePieceWidth * 0.35, y + puzzlePieceHeight);
      ctx.lineTo(x + 5, y + puzzlePieceHeight);
    }
    
    // Bottom-left corner
    ctx.quadraticCurveTo(x, y + puzzlePieceHeight, x, y + puzzlePieceHeight - 5);
    
    // Left side with tabs
    if (leftTab) {
      ctx.lineTo(x, y + puzzlePieceHeight * 0.65);
      ctx.quadraticCurveTo(x - tabSize, y + puzzlePieceHeight * 0.6, x - tabSize, y + puzzlePieceHeight * 0.5);
      ctx.quadraticCurveTo(x - tabSize, y + puzzlePieceHeight * 0.4, x, y + puzzlePieceHeight * 0.35);
      ctx.lineTo(x, y + 5);
    } else {
      ctx.lineTo(x, y + puzzlePieceHeight * 0.65);
      ctx.quadraticCurveTo(x + tabSize * 0.6, y + puzzlePieceHeight * 0.6, x + tabSize * 0.6, y + puzzlePieceHeight * 0.5);
      ctx.quadraticCurveTo(x + tabSize * 0.6, y + puzzlePieceHeight * 0.4, x, y + puzzlePieceHeight * 0.35);
      ctx.lineTo(x, y + 5);
    }
    
    // Top-left corner
    ctx.quadraticCurveTo(x, y, x + 5, y);
    
    ctx.closePath();
  };

  const drawTriangleShape = (ctx: CanvasRenderingContext2D, x: number, y: number, shape: PuzzleShape) => {
    const { topTab, rightTab, leftTab, tabSize } = shape;
    const centerX = x + puzzlePieceWidth / 2;
    const triangleHeight = puzzlePieceHeight * 0.85; // Make triangle slightly smaller to fit in bounds
    
    ctx.beginPath();
    
    // Start from bottom left
    ctx.moveTo(x + puzzlePieceWidth * 0.1, y + puzzlePieceHeight);
    
    // Left side (going up)
    if (leftTab) {
      ctx.lineTo(x + puzzlePieceWidth * 0.15, y + puzzlePieceHeight * 0.6);
      ctx.quadraticCurveTo(x - tabSize * 0.8, y + puzzlePieceHeight * 0.5, x - tabSize * 0.8, y + puzzlePieceHeight * 0.4);
      ctx.quadraticCurveTo(x - tabSize * 0.8, y + puzzlePieceHeight * 0.3, x + puzzlePieceWidth * 0.25, y + puzzlePieceHeight * 0.3);
      ctx.lineTo(centerX - 5, y + puzzlePieceHeight * 0.15);
    } else {
      ctx.lineTo(x + puzzlePieceWidth * 0.15, y + puzzlePieceHeight * 0.6);
      ctx.quadraticCurveTo(x + puzzlePieceWidth * 0.1, y + puzzlePieceHeight * 0.5, x + puzzlePieceWidth * 0.1, y + puzzlePieceHeight * 0.4);
      ctx.quadraticCurveTo(x + puzzlePieceWidth * 0.1, y + puzzlePieceHeight * 0.3, x + puzzlePieceWidth * 0.25, y + puzzlePieceHeight * 0.3);
      ctx.lineTo(centerX - 5, y + puzzlePieceHeight * 0.15);
    }
    
    // Top point
    if (topTab) {
      ctx.quadraticCurveTo(centerX - tabSize * 0.5, y - tabSize, centerX, y - tabSize);
      ctx.quadraticCurveTo(centerX + tabSize * 0.5, y - tabSize, centerX + 5, y + puzzlePieceHeight * 0.15);
    } else {
      ctx.quadraticCurveTo(centerX - tabSize * 0.3, y + tabSize * 0.5, centerX, y + tabSize * 0.5);
      ctx.quadraticCurveTo(centerX + tabSize * 0.3, y + tabSize * 0.5, centerX + 5, y + puzzlePieceHeight * 0.15);
    }
    
    // Right side (going down)
    if (rightTab) {
      ctx.lineTo(x + puzzlePieceWidth * 0.75, y + puzzlePieceHeight * 0.3);
      ctx.quadraticCurveTo(x + puzzlePieceWidth + tabSize * 0.8, y + puzzlePieceHeight * 0.3, x + puzzlePieceWidth + tabSize * 0.8, y + puzzlePieceHeight * 0.4);
      ctx.quadraticCurveTo(x + puzzlePieceWidth + tabSize * 0.8, y + puzzlePieceHeight * 0.5, x + puzzlePieceWidth * 0.85, y + puzzlePieceHeight * 0.6);
      ctx.lineTo(x + puzzlePieceWidth * 0.9, y + puzzlePieceHeight);
    } else {
      ctx.lineTo(x + puzzlePieceWidth * 0.75, y + puzzlePieceHeight * 0.3);
      ctx.quadraticCurveTo(x + puzzlePieceWidth * 0.9, y + puzzlePieceHeight * 0.3, x + puzzlePieceWidth * 0.9, y + puzzlePieceHeight * 0.4);
      ctx.quadraticCurveTo(x + puzzlePieceWidth * 0.9, y + puzzlePieceHeight * 0.5, x + puzzlePieceWidth * 0.85, y + puzzlePieceHeight * 0.6);
      ctx.lineTo(x + puzzlePieceWidth * 0.9, y + puzzlePieceHeight);
    }
    
    // Bottom side
    ctx.lineTo(x + puzzlePieceWidth * 0.1, y + puzzlePieceHeight);
    
    ctx.closePath();
  };

  const drawPuzzleShape = (ctx: CanvasRenderingContext2D, x: number, y: number, shape: PuzzleShape) => {
    if (shape.type === 'square') {
      drawSquareShape(ctx, x, y, shape);
    } else {
      drawTriangleShape(ctx, x, y, shape);
    }
  };

  const createPuzzlePiece = () => {
    const canvas = canvasRef.current;
    const puzzleCanvas = puzzlePieceRef.current;
    const container = imageContainerRef.current;
    
    if (!canvas || !puzzleCanvas || !container) return;

    const containerRect = container.getBoundingClientRect();
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    // Set canvas size
    canvas.width = containerWidth;
    canvas.height = containerHeight;
    puzzleCanvas.width = puzzlePieceWidth;
    puzzleCanvas.height = puzzlePieceHeight;

    const ctx = canvas.getContext('2d');
    const puzzleCtx = puzzleCanvas.getContext('2d');
    
    if (!ctx || !puzzleCtx) return;

    // Create image element
    const img = new window.Image();
    img.onload = () => {
      // Draw original image
      ctx.drawImage(img, 0, 0, containerWidth, containerHeight);
      
      // Calculate puzzle piece position (16px from top like in original)
      const pieceY = 64; // 16px * 4 for scaling
      
      // Extract puzzle piece using the same method as original
      const imageData = ctx.getImageData(targetPosition, pieceY, puzzlePieceWidth, puzzlePieceHeight);
      
      // Create puzzle piece with custom shape
      puzzleCtx.save();
      drawPuzzleShape(puzzleCtx, 0, 0, currentShape);
      puzzleCtx.clip();
      puzzleCtx.putImageData(imageData, 0, 0);
      puzzleCtx.restore();
      
      // Add border to puzzle piece with different colors for different shapes
      const borderColor = currentShape.type === 'square' ? 'rgba(255,255,255,0.8)' : 'rgba(255,215,0,0.8)'; // Gold for triangle
      puzzleCtx.strokeStyle = borderColor;
      puzzleCtx.lineWidth = 2;
      drawPuzzleShape(puzzleCtx, 0, 0, currentShape);
      puzzleCtx.stroke();
      
      // Create hole in main image with the same custom shape
      ctx.globalCompositeOperation = 'destination-out';
      drawPuzzleShape(ctx, targetPosition, pieceY, currentShape);
      ctx.fill();
      
      // Reset composite operation
      ctx.globalCompositeOperation = 'source-over';
      
      // Add shadow to hole
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.4)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.strokeStyle = 'rgba(0,0,0,0.3)';
      ctx.lineWidth = 1;
      drawPuzzleShape(ctx, targetPosition, pieceY, currentShape);
      ctx.stroke();
      ctx.restore();
    };
    
    img.src = puzzleImages[currentImage];
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (completed) return;
    setIsDragging(true);
    startX.current = 'touches' in e ? e.touches[0].clientX : e.clientX;
    currentX.current = sliderLeft;
  };

  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging || completed) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const deltaX = clientX - startX.current;
    let newX = currentX.current + deltaX;
    newX = Math.max(0, Math.min(newX, maxSlide.current));
    setSliderLeft(newX);
  };

  const handleMouseUp = () => {
    if (!isDragging || completed) return;
    setIsDragging(false);

    if (!imageContainerRef.current) return;
    const imageWidth = imageContainerRef.current.offsetWidth;
    const maxPuzzleLeft = imageWidth - puzzlePieceWidth;
    const puzzleLeft = (sliderLeft / maxSlide.current) * maxPuzzleLeft;

    if (Math.abs(puzzleLeft - targetPosition) <= tolerance) {
      setCompleted(true);
      const snappedSliderLeft = (targetPosition / maxPuzzleLeft) * maxSlide.current;
      setSliderLeft(snappedSliderLeft);

      // Call the success handler to notify the parent component
      setTimeout(() => {
        handleCaptchaSuccess();
      }, 1000); // Wait a bit for the success animation

      setTimeout(() => {
        setShowCaptcha(false);
        setSliderLeft(0);
        setImageLoaded(false);
        setTimeout(() => setCompleted(false), 1000);
      }, 3000);
    } else {
      // Smooth return to start
      setSliderLeft(0);
    }
  };

  const refreshCaptcha = () => {
    // Generate random image index and shape
    const randomIndex = Math.floor(Math.random() * puzzleImages.length);
    setCurrentImage(randomIndex);
    setCurrentShape(generateRandomShape());
    setSliderLeft(0);
    setCompleted(false);
    setImageLoaded(false);
    setTimeout(generateRandomPosition, 100);
  };

  const handleButtonClick = () => {
    setButtonClicked(true);
    setIsLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      setShowCaptcha(true);
      setCurrentShape(generateRandomShape());
      generateRandomPosition();
      refreshCaptcha();
    }, 800);

    // Reset click animation
    setTimeout(() => setButtonClicked(false), 600);
  };

  const closeModal = () => {
    setShowCaptcha(false);
    setSliderLeft(0);
    setCompleted(false);
    setImageLoaded(false);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleMouseMove);
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, sliderLeft, completed]);

  return (
    <>
      {/* Main button */}
      <button
        onClick={handleButtonClick}
        disabled={isLoading || verified}
        className={classNames(
          'relative w-60 h-12 flex items-center justify-between px-4 pr-10 text-white font-medium bg-[#2d2d2d] rounded-md shadow group overflow-hidden transform transition-all duration-200',
          {
            'animate__animated animate__bounceIn': completed || verified,
            'animate__animated animate__pulse': buttonClicked,
            'animate__animated animate__wobble': isLoading,
            'hover:scale-105 hover:shadow-lg active:scale-95': !isLoading && !verified,
            'cursor-not-allowed opacity-75': isLoading || verified,
            'cursor-pointer': !isLoading && !verified,
            'bg-green-600': verified,
          }
        )}
      >
        <span className="z-10 relative">
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Loading...</span>
            </div>
          ) : verified ? (
            <span className="animate__animated animate__fadeIn">✓ Verified!</span>
          ) : completed ? (
            <span className="animate__animated animate__fadeIn">Verified!</span>
          ) : (
            'Click to verify'
          )}
        </span>

        <span
          className={classNames(
            'absolute left-0 top-0 h-full w-1 transition-all duration-300 group-hover:scale-y-110 group-hover:w-2',
            {
              'bg-green-500 animate__animated animate__flash': completed || verified,
              'bg-yellow-500 animate-pulse': isLoading,
              'bg-blue-500': !completed && !isLoading && !verified,
            }
          )}
        ></span>

        <span 
          className={classNames(
            'absolute right-4 text-gray-400 group-hover:text-white transition-all duration-300 transform',
            {
              'text-green-400 animate__animated animate__rotateIn': completed || verified,
              'animate-spin text-yellow-400': isLoading,
              'group-hover:scale-110': !isLoading && !verified,
            }
          )}
        >
          {isLoading ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
              <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"/>
            </svg>
          ) : (completed || verified) ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        </span>

        {/* Ripple effect */}
        {buttonClicked && (
          <span className="absolute inset-0 rounded-md bg-white opacity-20 animate-ping"></span>
        )}

        {/* Success overlay */}
        {(completed || verified) && (
          <span className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 opacity-20 rounded-md animate__animated animate__fadeIn"></span>
        )}
      </button>

      {/* Modal Overlay */}
      {showCaptcha && !verified && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate__animated animate__fadeIn"
          onClick={handleModalClick}
        >
          {/* Modal Content */}
          <div 
            ref={modalRef}
            className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md mx-auto animate__animated animate__zoomIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Security Verification</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Captcha Content */}
            <div className="text-center text-gray-700 font-medium mb-4">
              Drag the puzzle piece to complete the image
              <div className="text-xs text-gray-500 mt-1">
                Shape: {currentShape.type === 'square' ? '⬜ Square' : '🔺 Triangle'}
              </div>
            </div>

            <div ref={imageContainerRef} className="relative w-full h-48 overflow-hidden rounded-lg bg-gray-200 mb-6">
              {/* Hidden image to detect loading */}
              <Image
                src={puzzleImages[currentImage]}
                alt="Puzzle"
                layout="fill"
                objectFit="cover"
                className="opacity-0"
                draggable={false}
                onLoad={() => setImageLoaded(true)}
              />
              
              {/* Canvas with hole */}
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full rounded"
                style={{ display: imageLoaded ? 'block' : 'none' }}
              />

              {/* Moving puzzle piece */}
              <div
                className="absolute top-16 shadow-lg"
                style={{
                  left: `${(sliderLeft / maxSlide.current) * (imageContainerRef.current?.offsetWidth! - puzzlePieceWidth)}px`,
                  transition: isDragging ? 'none' : 'left 0.3s ease',
                  width: `${puzzlePieceWidth}px`,
                  height: `${puzzlePieceHeight}px`,
                }}
              >
                <canvas
                  ref={puzzlePieceRef}
                  className="rounded border-2 border-white/50"
                  style={{ 
                    width: '100%', 
                    height: '100%',
                    filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
                  }}
                />
              </div>

              {/* Target indicator (subtle) */}
              {!completed && (
                <div
                  className="absolute top-16 w-20 h-20 border-2 border-dashed border-blue-400/50 rounded pointer-events-none animate-pulse"
                  style={{ left: `${targetPosition}px` }}
                />
              )}
            </div>

            {/* Slider track */}
            <div ref={trackRef} className="relative h-12 bg-gray-300 rounded-full mb-4">
              <div
                className="absolute top-0 left-0 h-full bg-blue-200 rounded-full transition-all duration-300"
                style={{ width: `${(sliderLeft / maxSlide.current) * 100}%` }}
              />
              <div
                ref={buttonRef}
                className={classNames(
                  'absolute w-12 h-12 bg-blue-500 text-white font-bold flex items-center justify-center rounded-full shadow cursor-pointer select-none transition-all duration-300 hover:scale-110',
                  { 
                    'bg-green-500 animate__animated animate__rubberBand': completed,
                    'hover:bg-blue-600': !completed
                  }
                )}
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
                style={{ left: `${sliderLeft}px`, transition: isDragging ? 'none' : 'left 0.3s ease' }}
              >
                {completed ? '✓' : '→'}
              </div>
            </div>

            {/* Progress text */}
            <div className="text-center text-sm text-gray-500 mb-4">
              {completed ? 'Verified!' : 'Slide to fit the piece'}
            </div>

            {/* Feedback */}
            {completed && (
              <div className="mb-4 text-green-600 font-medium text-center animate__animated animate__bounceIn">
                ✓ Verification successful!
              </div>
            )}
            {!completed && sliderLeft > 0 && !isDragging && (
              <div className="mb-4 text-red-500 font-medium text-center animate__animated animate__shakeX">
                ✗ Please try again
              </div>
            )}

            {/* Controls */}
            <div className="flex justify-center">
              <button 
                onClick={refreshCaptcha} 
                className="text-blue-500 hover:text-blue-700 transition-colors duration-200 hover:scale-105 transform flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
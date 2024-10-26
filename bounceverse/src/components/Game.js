import React, { useEffect, useRef, useState } from 'react';
import contractAddress from "../contracts/contractAddress.json"
import contractAbi from "../contracts/contractAbi.json"
import {BrowserProvider, ethers} from "ethers"

const Game = () => {
  const canvasRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const keysPressed = useRef({});
  const gameStateRef = useRef({
    platforms: [],
    particles: [],
    player: {
      x: 0,
      y: 0,
      width: 50,
      height: 50,
      velocityY: 0,
    }
  });
  
  const withdraw = async () =>{
    const {abi} = contractAbi;
    
    const provider = new BrowserProvider(window.ethereum);

    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const bounceContract = new ethers.Contract(contractAddress.address, abi, signer)

    await (await bounceContract.mint(address, ethers.parseUnits(score.toString(), 18))).wait();
  }
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Game constants
    const GRAVITY = 0.3;
    const JUMP_FORCE = -15;
    const PLATFORM_COUNT = 10;
    const MOVEMENT_SPEED = 5;

    // Create jump particle effect
    const createJumpParticles = (x, y) => {
      for (let i = 0; i < 8; i++) {
        gameStateRef.current.particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          life: 1,
          size: Math.random() * 4 + 2
        });
      }
    };

    // Update and draw particles
    const updateParticles = () => {
      gameStateRef.current.particles = gameStateRef.current.particles.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.02;
        
        ctx.fillStyle = `rgba(147, 51, 234, ${particle.life})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        return particle.life > 0;
      });
    };
    
    // Initialize platforms
    const initPlatforms = () => {
      gameStateRef.current.platforms = [];
      gameStateRef.current.particles = [];
      for (let i = 0; i < PLATFORM_COUNT; i++) {
        gameStateRef.current.platforms.push({
          x: Math.random() * (canvas.width - 100),
          y: i * (canvas.height / PLATFORM_COUNT),
          width: 100,
          height: 20,
        });
      }
    };

    const resetGame = () => {
      gameStateRef.current.player = {
        x: canvas.width / 2,
        y: canvas.height - 400,
        width: 50,
        height: 50,
        velocityY: 0,
      };
      gameStateRef.current.particles = [];
      setScore(0);
      setGameOver(false);
      initPlatforms();
    };
    
    // Game loop
    const gameLoop = () => {
      // Clear canvas with dark background
      ctx.fillStyle = '#1F2937'; // Dark gray background
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw background grid for depth
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let i = 0; i < canvas.width; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      if (!gameStarted) {
        // Draw instructions
        ctx.fillStyle = '#F3F4F6';
        ctx.font = 'bold 28px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Get High Score & Compete!!', canvas.width/2, canvas.height/2 - 100);
        
        ctx.font = '24px Arial';
        ctx.fillStyle = '#E5E7EB';
        ctx.fillText('Jump between platforms and climb as high as you can!', canvas.width/2, canvas.height/2 - 40);
        ctx.fillText('Use LEFT and RIGHT arrow keys to move', canvas.width/2, canvas.height/2 + 10);
        
        // Animated press space text
        const pulse = (Math.sin(Date.now() / 300) + 1) / 2;
        ctx.fillStyle = `rgba(167, 139, 250, ${0.5 + pulse * 0.5})`;
        ctx.fillText('Press SPACE to start', canvas.width/2, canvas.height/2 + 80);
        
        animationFrameId = requestAnimationFrame(gameLoop);
        return;
      }

      const { player, platforms } = gameStateRef.current;
      
      if (!gameOver) {
        // Handle continuous movement
        if (keysPressed.current.ArrowLeft) player.x -= MOVEMENT_SPEED;
        if (keysPressed.current.ArrowRight) player.x += MOVEMENT_SPEED;
        
        // Keep player within bounds
        if (player.x < 0) player.x = 0;
        if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
        
        // Update player
        player.velocityY += GRAVITY;
        player.y += player.velocityY;
        
        // Check platform collisions
        platforms.forEach(platform => {
          if (player.velocityY > 0 &&
              player.y + player.height > platform.y &&
              player.y + player.height < platform.y + platform.height &&
              player.x + player.width > platform.x &&
              player.x < platform.x + platform.width) {
            player.velocityY = JUMP_FORCE;
            createJumpParticles(player.x + player.width/2, player.y + player.height);
          }
        });
        
        // Move platforms down when player reaches upper half
        if (player.y < canvas.height / 2) {
          player.y = canvas.height / 2;
          platforms.forEach(platform => {
            platform.y += -player.velocityY;
            if (platform.y > canvas.height) {
              platform.y = 0;
              platform.x = Math.random() * (canvas.width - 100);
              setScore(prev => prev + 1);
            }
          });
        }
        
        // Game over condition
        if (player.y > canvas.height) {
          setGameOver(true);
        }
      }
      
      // Draw platforms with gradient
      platforms.forEach(platform => {
        const gradient = ctx.createLinearGradient(
          platform.x, platform.y,
          platform.x, platform.y + platform.height
        );
        gradient.addColorStop(0, '#8B5CF6');
        gradient.addColorStop(1, '#7C3AED');
        ctx.fillStyle = gradient;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        
        // Platform glow effect
        ctx.shadowColor = '#A78BFA';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      });

      // Reset shadow effects
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;

      // Update and draw particles
      updateParticles();

      // Draw player with gradient
      const playerGradient = ctx.createLinearGradient(
        player.x, player.y,
        player.x, player.y + player.height
      );
      playerGradient.addColorStop(0, '#EC4899');
      playerGradient.addColorStop(1, '#DB2777');
      ctx.fillStyle = playerGradient;
      ctx.fillRect(player.x, player.y, player.width, player.height);
      
      // Draw score
      ctx.fillStyle = '#F3F4F6';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Score: ${score}`, 20, 40);
      
      // Draw game over text
      if (gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#F3F4F6';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Game Over! Score: ${score}`, canvas.width/2, canvas.height/2 - 40);
        
        // Animated press space text
        const pulse = (Math.sin(Date.now() / 300) + 1) / 2;
        ctx.fillStyle = `rgba(167, 139, 250, ${0.5 + pulse * 0.5})`;
        ctx.font = '24px Arial';
        ctx.fillText('Press SPACE to restart', canvas.width/2, canvas.height/2 + 20);
      }
      
      animationFrameId = requestAnimationFrame(gameLoop);
    };
    
    // Handle keyboard input
    const handleKeyDown = (e) => {
      keysPressed.current[e.key] = true;
      
      if (e.key === ' ') {
        if (!gameStarted) {
          setGameStarted(true);
          resetGame();
        } else if (gameOver) {
          resetGame();
        }
        e.preventDefault();
      }
    };

    const handleKeyUp = (e) => {
      keysPressed.current[e.key] = false;
    };
    
    // Initialize game
    canvas.width = 800;
    canvas.height = 600;
    
    // Initial game state
    gameStateRef.current.player = {
      x: canvas.width / 2,
      y: canvas.height - 400,
      width: 50,
      height: 50,
      velocityY: 0,
    };
    
    initPlatforms();
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    gameLoop();
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameStarted]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 text-center">
        {/* <h1 className="text-4xl font-bold mb-8 text-purple-400">Platform Jumper</h1> */}
        <div className="relative inline-block">
          <canvas
            ref={canvasRef}
            className="rounded-lg shadow-lg border-2 border-purple-500"
          />
        </div>
        {gameOver && (
          <div className="mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-purple-300">Game Over! Score: {score}</h2>
            <button
              onClick={async () => {
                try {
                  withdraw();
                  alert(`Claimed tokens for score: ${score}`);
                } catch (error) {
                  console.error(error);
                }
              }}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Claim Tokens
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
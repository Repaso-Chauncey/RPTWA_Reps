import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import './BaseballGame.css';

const API_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');

function BaseballGame({ setAuth }) {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('ready'); // ready, playing, hit, miss, gameOver
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [ballPosition, setBallPosition] = useState(0);
  const [ballSpeed, setBallSpeed] = useState(20);
  const [hitZone, setHitZone] = useState({ start: 45, end: 55 });
  const [combo, setCombo] = useState(0);
  const [totalHits, setTotalHits] = useState(0);
  const [totalMisses, setTotalMisses] = useState(0);
  const [gameMessage, setGameMessage] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [isPaused, setIsPaused] = useState(false);
  const [bestCombo, setBestCombo] = useState(0);
  
  const gameLoopRef = useRef(null);
  const ballRef = useRef(null);
  const pausedPositionRef = useRef(0);

  useEffect(() => {
    loadHighScore();
    
    // Add keyboard support for desktop
    const handleKeyPress = (e) => {
      if (e.code === 'Space' && gameState === 'playing' && !isPaused) {
        e.preventDefault();
        handleSwing();
      }
      if (e.code === 'KeyP' && (gameState === 'playing' || gameState === 'hit' || gameState === 'miss')) {
        e.preventDefault();
        togglePause();
      }
      if (e.code === 'Escape' && gameState !== 'ready' && gameState !== 'gameOver') {
        e.preventDefault();
        confirmQuit();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameState]);

  const loadHighScore = () => {
    const saved = localStorage.getItem('baseballHighScore');
    if (saved) {
      setHighScore(parseInt(saved));
    }
  };

  const saveHighScore = (newScore) => {
    if (newScore > highScore) {
      setHighScore(newScore);
      localStorage.setItem('baseballHighScore', newScore.toString());
      return true;
    }
    return false;
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setCombo(0);
    setBestCombo(0);
    setTotalHits(0);
    setTotalMisses(0);
    setBallPosition(0);
    setGameMessage('');
    setIsPaused(false);
    
    // Set difficulty
    switch(difficulty) {
      case 'easy':
        setBallSpeed(15);
        setHitZone({ start: 40, end: 60 });
        break;
      case 'medium':
        setBallSpeed(20);
        setHitZone({ start: 45, end: 55 });
        break;
      case 'hard':
        setBallSpeed(30);
        setHitZone({ start: 47, end: 53 });
        break;
      default:
        setBallSpeed(20);
    }
    
    throwBall();
  };

  const togglePause = () => {
    if (isPaused) {
      // Resume game
      setIsPaused(false);
      throwBall(true); // Resume from paused position
    } else {
      // Pause game
      setIsPaused(true);
      pausedPositionRef.current = ballPosition;
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    }
  };

  const confirmQuit = () => {
    if (window.confirm('Are you sure you want to quit? Your progress will be lost.')) {
      resetGame();
    }
  };

  const throwBall = (resumeFromPause = false) => {
    // Stop any existing animation
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    
    if (!resumeFromPause) {
      setBallPosition(0);
    }
    setGameState('playing');
    setGameMessage('');
    animateBall(resumeFromPause ? pausedPositionRef.current : 0);
  };

  const animateBall = (startPosition = 0) => {
    let position = startPosition;
    let animationId = null;
    
    const animate = () => {
      if (isPaused) {
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
        return;
      }
      
      position += ballSpeed / 10;
      setBallPosition(position);
      
      if (position >= 100) {
        // Ball passed - missed!
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
        handleMiss();
        return;
      }
      
      animationId = requestAnimationFrame(animate);
      gameLoopRef.current = animationId;
    };
    
    animationId = requestAnimationFrame(animate);
    gameLoopRef.current = animationId;
  };

  const handleSwing = () => {
    if (gameState !== 'playing') return;
    
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
    
    // Check if ball is in hit zone
    if (ballPosition >= hitZone.start && ballPosition <= hitZone.end) {
      handleHit();
    } else {
      handleMiss();
    }
  };

  const handleHit = () => {
    const accuracy = 100 - Math.abs(ballPosition - 50) * 2;
    const newCombo = combo + 1;
    const points = Math.round(accuracy * (1 + combo * 0.1));
    
    setScore(prev => prev + points);
    setCombo(newCombo);
    setTotalHits(prev => prev + 1);
    setGameState('hit');
    
    // Track best combo
    if (newCombo > bestCombo) {
      setBestCombo(newCombo);
    }
    
    // Determine hit quality
    let message = '';
    if (accuracy >= 95) {
      message = '🔥 PERFECT HIT! +' + points;
    } else if (accuracy >= 85) {
      message = '⚡ GREAT HIT! +' + points;
    } else if (accuracy >= 70) {
      message = '✨ GOOD HIT! +' + points;
    } else {
      message = '👍 HIT! +' + points;
    }
    
    if (newCombo > 1) {
      message += ` (${newCombo}x COMBO!)`;
    }
    
    setGameMessage(message);
    
    // Continue game after short delay
    setTimeout(() => {
      if (gameState !== 'gameOver') {
        throwBall(false); // Start new ball from beginning
      }
    }, 800);
  };

  const handleMiss = () => {
    const newMissCount = totalMisses + 1;
    setGameState('miss');
    
    // Track best combo before reset
    if (combo > bestCombo) {
      setBestCombo(combo);
    }
    
    setCombo(0);
    setTotalMisses(newMissCount);
    setGameMessage('❌ MISS!');
    
    // Check if game over (3 misses)
    if (newMissCount >= 3) {
      setTimeout(() => {
        endGame();
      }, 500);
    } else {
      setTimeout(() => {
        if (newMissCount < 3) {
          throwBall(false); // Start new ball from beginning
        }
      }, 1000);
    }
  };

  const endGame = async () => {
    // Stop any ongoing animation
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    
    setGameState('gameOver');
    
    const isNewHighScore = saveHighScore(score);
    
    if (isNewHighScore) {
      setGameMessage('🏆 NEW HIGH SCORE! ' + score);
    } else {
      setGameMessage('Game Over! Score: ' + score);
    }
    
    // Save game stats as a task
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/tasks`, {
        title: `Baseball Game - Score: ${score}`,
        description: `Hits: ${totalHits}, Misses: ${totalMisses}, Combo: ${combo}`,
        category: 'game',
        priority: 'medium',
        status: 'completed'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Error saving game stats:', error);
    }
  };

  const resetGame = () => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    setGameState('ready');
    setScore(0);
    setCombo(0);
    setBestCombo(0);
    setTotalHits(0);
    setTotalMisses(0);
    setBallPosition(0);
    setGameMessage('');
    setIsPaused(false);
  };

  return (
    <div className="baseball-game-page">
      <Navbar setAuth={setAuth} />
      
      <div className="game-container">
        <div className="game-header">
          <h1>⚾ Baseball Batting Game</h1>
          <p>Hit the ball when it reaches the strike zone!</p>
        </div>

        <div className="game-stats">
          <div className="stat-box">
            <span className="stat-label">Score</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">High Score</span>
            <span className="stat-value">{highScore}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Combo</span>
            <span className="stat-value">{combo}x</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Hits</span>
            <span className="stat-value">{totalHits}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Misses</span>
            <span className="stat-value">{totalMisses}/3</span>
          </div>
        </div>

        {gameState === 'ready' && (
          <div className="game-menu">
            <h2>Select Difficulty</h2>
            <div className="difficulty-buttons">
              <button 
                className={`difficulty-btn ${difficulty === 'easy' ? 'active' : ''}`}
                onClick={() => setDifficulty('easy')}
              >
                🟢 Easy
              </button>
              <button 
                className={`difficulty-btn ${difficulty === 'medium' ? 'active' : ''}`}
                onClick={() => setDifficulty('medium')}
              >
                🟡 Medium
              </button>
              <button 
                className={`difficulty-btn ${difficulty === 'hard' ? 'active' : ''}`}
                onClick={() => setDifficulty('hard')}
              >
                🔴 Hard
              </button>
            </div>
            <button className="start-btn" onClick={startGame}>
              ⚾ Start Game
            </button>
            <button className="back-btn" onClick={() => navigate('/dashboard')}>
              ← Back to Dashboard
            </button>
          </div>
        )}

        {(gameState === 'playing' || gameState === 'hit' || gameState === 'miss') && (
          <div className="game-field">
            <div className="game-controls">
              <button className="pause-btn" onClick={togglePause}>
                {isPaused ? '▶️ Resume' : '⏸️ Pause'}
              </button>
              <button className="quit-btn" onClick={confirmQuit}>
                🚪 Quit
              </button>
              <div className="difficulty-indicator">
                {difficulty === 'easy' && '🟢 Easy Mode'}
                {difficulty === 'medium' && '🟡 Medium Mode'}
                {difficulty === 'hard' && '🔴 Hard Mode'}
              </div>
            </div>

            {isPaused && (
              <div className="pause-overlay">
                <h2>⏸️ PAUSED</h2>
                <p>Press P or click Resume to continue</p>
              </div>
            )}

            <div className="pitcher">
              <div className="pitcher-icon">🧑‍🦱</div>
              <div className="pitcher-label">Pitcher</div>
            </div>

            <div className="ball-path">
              <div 
                className="baseball" 
                ref={ballRef}
                style={{ left: `${ballPosition}%` }}
              >
                ⚾
              </div>
            </div>

            <div className="strike-zone">
              <div className="zone-indicator">
                <div className="zone-line left" style={{ left: `${hitZone.start}%` }}></div>
                <div className="zone-line right" style={{ left: `${hitZone.end}%` }}></div>
                <div className="zone-label">STRIKE ZONE</div>
              </div>
            </div>

            <div className="batter">
              <div className="batter-icon">🧍</div>
              <div className="batter-label">You</div>
            </div>

            <button 
              className="swing-btn" 
              onClick={handleSwing}
              disabled={gameState !== 'playing'}
            >
              🏏 SWING!
            </button>

            {gameMessage && (
              <div className={`game-message ${gameState}`}>
                {gameMessage}
              </div>
            )}
          </div>
        )}

        {gameState === 'gameOver' && (
          <div className="game-over">
            <h2>⚾ Game Over!</h2>
            <div className="final-stats">
              <div className="final-stat">
                <span className="final-label">Final Score</span>
                <span className="final-value">{score}</span>
              </div>
              <div className="final-stat">
                <span className="final-label">Total Hits</span>
                <span className="final-value">{totalHits}</span>
              </div>
              <div className="final-stat">
                <span className="final-label">Best Combo</span>
                <span className="final-value">{bestCombo}x</span>
              </div>
              <div className="final-stat">
                <span className="final-label">Total Misses</span>
                <span className="final-value">{totalMisses}</span>
              </div>
              <div className="final-stat">
                <span className="final-label">Accuracy</span>
                <span className="final-value">
                  {totalHits > 0 ? Math.round((totalHits / (totalHits + totalMisses)) * 100) : 0}%
                </span>
              </div>
            </div>
            {score > highScore && (
              <div className="new-high-score">
                🏆 NEW HIGH SCORE! 🏆
              </div>
            )}
            <div className="game-over-message">
              ✅ Game stats saved to your tasks!
            </div>
            <div className="game-over-buttons">
              <button className="play-again-btn" onClick={resetGame}>
                🔄 Play Again
              </button>
              <button className="dashboard-btn" onClick={() => navigate('/dashboard')}>
                📊 View Dashboard
              </button>
            </div>
          </div>
        )}

        <div className="game-instructions">
          <h3>📖 How to Play</h3>
          <ul>
            <li>⚾ Watch the ball move from left to right</li>
            <li>🎯 Click "SWING!" or press SPACEBAR when ball is in strike zone</li>
            <li>✨ Perfect timing = More points!</li>
            <li>🔥 Build combos for bonus points</li>
            <li>❌ 3 misses = Game Over</li>
            <li>⏸️ Press P to pause, ESC to quit</li>
            <li>🏆 Beat your high score!</li>
          </ul>
          <div className="difficulty-info">
            <h4>🎚️ Difficulty Levels:</h4>
            <p><strong>🟢 Easy:</strong> Slower ball, wider strike zone (20% width)</p>
            <p><strong>🟡 Medium:</strong> Normal speed, normal zone (10% width)</p>
            <p><strong>🔴 Hard:</strong> Fast ball, narrow zone (6% width)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BaseballGame;

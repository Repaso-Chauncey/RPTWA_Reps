import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import './CalisthenicsGame.css';

const API_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');

function CalisthenicsGame({ setAuth }) {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('ready'); // ready, playing, hit, miss, gameOver
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [repPosition, setRepPosition] = useState(0);
  const [repSpeed, setRepSpeed] = useState(20);
  const [perfectZone, setPerfectZone] = useState({ start: 45, end: 55 });
  const [combo, setCombo] = useState(0);
  const [totalReps, setTotalReps] = useState(0);
  const [totalMisses, setTotalMisses] = useState(0);
  const [gameMessage, setGameMessage] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [isPaused, setIsPaused] = useState(false);
  const [bestCombo, setBestCombo] = useState(0);
  
  const gameLoopRef = useRef(null);
  const repRef = useRef(null);
  const pausedPositionRef = useRef(0);

  useEffect(() => {
    loadHighScore();
    
    // Add keyboard support for desktop
    const handleKeyPress = (e) => {
      if (e.code === 'Space' && gameState === 'playing' && !isPaused) {
        e.preventDefault();
        handleRep();
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
    const saved = localStorage.getItem('calisthenicsHighScore');
    if (saved) {
      setHighScore(parseInt(saved));
    }
  };

  const saveHighScore = (newScore) => {
    if (newScore > highScore) {
      setHighScore(newScore);
      localStorage.setItem('calisthenicsHighScore', newScore.toString());
      return true;
    }
    return false;
  };


  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setCombo(0);
    setBestCombo(0);
    setTotalReps(0);
    setTotalMisses(0);
    setRepPosition(0);
    setGameMessage('');
    setIsPaused(false);
    
    // Set difficulty
    switch(difficulty) {
      case 'easy':
        setRepSpeed(15);
        setPerfectZone({ start: 40, end: 60 });
        break;
      case 'medium':
        setRepSpeed(20);
        setPerfectZone({ start: 45, end: 55 });
        break;
      case 'hard':
        setRepSpeed(30);
        setPerfectZone({ start: 47, end: 53 });
        break;
      default:
        setRepSpeed(20);
    }
    
    startRep();
  };

  const togglePause = () => {
    if (isPaused) {
      setIsPaused(false);
      startRep(true);
    } else {
      setIsPaused(true);
      pausedPositionRef.current = repPosition;
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

  const startRep = (resumeFromPause = false) => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    
    if (!resumeFromPause) {
      setRepPosition(0);
    }
    setGameState('playing');
    setGameMessage('');
    animateRep(resumeFromPause ? pausedPositionRef.current : 0);
  };

  const animateRep = (startPosition = 0) => {
    let position = startPosition;
    let animationId = null;
    
    const animate = () => {
      if (isPaused) {
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
        return;
      }
      
      position += repSpeed / 10;
      setRepPosition(position);
      
      if (position >= 100) {
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

  const handleRep = () => {
    if (gameState !== 'playing') return;
    
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
    
    if (repPosition >= perfectZone.start && repPosition <= perfectZone.end) {
      handleHit();
    } else {
      handleMiss();
    }
  };

  const handleHit = () => {
    const accuracy = 100 - Math.abs(repPosition - 50) * 2;
    const newCombo = combo + 1;
    const points = Math.round(accuracy * (1 + combo * 0.1));
    
    setScore(prev => prev + points);
    setCombo(newCombo);
    setTotalReps(prev => prev + 1);
    setGameState('hit');
    
    if (newCombo > bestCombo) {
      setBestCombo(newCombo);
    }
    
    let message = '';
    if (accuracy >= 95) {
      message = '🔥 PERFECT REP! +' + points;
    } else if (accuracy >= 85) {
      message = '⚡ GREAT REP! +' + points;
    } else if (accuracy >= 70) {
      message = '✨ GOOD REP! +' + points;
    } else {
      message = '💪 REP! +' + points;
    }
    
    if (newCombo > 1) {
      message += ` (${newCombo}x COMBO!)`;
    }
    
    setGameMessage(message);
    
    setTimeout(() => {
      if (gameState !== 'gameOver') {
        startRep(false);
      }
    }, 800);
  };

  const handleMiss = () => {
    const newMissCount = totalMisses + 1;
    setGameState('miss');
    
    if (combo > bestCombo) {
      setBestCombo(combo);
    }
    
    setCombo(0);
    setTotalMisses(newMissCount);
    setGameMessage('❌ BAD FORM!');
    
    if (newMissCount >= 3) {
      setTimeout(() => {
        endGame();
      }, 500);
    } else {
      setTimeout(() => {
        if (newMissCount < 3) {
          startRep(false);
        }
      }, 1000);
    }
  };

  const endGame = async () => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    
    setGameState('gameOver');
    
    const isNewHighScore = saveHighScore(score);
    
    if (isNewHighScore) {
      setGameMessage('🏆 NEW HIGH SCORE! ' + score);
    } else {
      setGameMessage('Workout Complete! Score: ' + score);
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/tasks`, {
        title: `Rep Challenge - Score: ${score}`,
        description: `Reps: ${totalReps}, Misses: ${totalMisses}, Best Combo: ${bestCombo}`,
        category: 'other',
        priority: 'medium',
        status: 'completed'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Error saving workout stats:', error);
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
    setTotalReps(0);
    setTotalMisses(0);
    setRepPosition(0);
    setGameMessage('');
    setIsPaused(false);
  };


  return (
    <div className="calisthenics-game-page">
      <Navbar setAuth={setAuth} />
      
      <div className="game-container">
        <div className="game-header">
          <h1>💪 Rep Challenge</h1>
          <p>Time your reps perfectly in the power zone!</p>
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
            <span className="stat-label">Reps</span>
            <span className="stat-value">{totalReps}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Misses</span>
            <span className="stat-value">{totalMisses}/3</span>
          </div>
        </div>

        {gameState === 'ready' && (
          <div className="game-menu">
            <h2>Select Intensity</h2>
            <div className="difficulty-buttons">
              <button 
                className={`difficulty-btn ${difficulty === 'easy' ? 'active' : ''}`}
                onClick={() => setDifficulty('easy')}
              >
                🟢 Beginner
              </button>
              <button 
                className={`difficulty-btn ${difficulty === 'medium' ? 'active' : ''}`}
                onClick={() => setDifficulty('medium')}
              >
                🟡 Intermediate
              </button>
              <button 
                className={`difficulty-btn ${difficulty === 'hard' ? 'active' : ''}`}
                onClick={() => setDifficulty('hard')}
              >
                🔴 Advanced
              </button>
            </div>
            <button className="start-btn" onClick={startGame}>
              💪 Start Workout
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
                {difficulty === 'easy' && '🟢 Beginner Mode'}
                {difficulty === 'medium' && '🟡 Intermediate Mode'}
                {difficulty === 'hard' && '🔴 Advanced Mode'}
              </div>
            </div>

            {isPaused && (
              <div className="pause-overlay">
                <h2>⏸️ PAUSED</h2>
                <p>Press P or click Resume to continue</p>
              </div>
            )}

            <div className="timer-section">
              <div className="timer-icon">⏱️</div>
              <div className="timer-label">Timer</div>
            </div>

            <div className="rep-path">
              <div 
                className="rep-indicator" 
                ref={repRef}
                style={{ left: `${repPosition}%` }}
              >
                💪
              </div>
            </div>

            <div className="power-zone">
              <div className="zone-indicator">
                <div className="zone-line left" style={{ left: `${perfectZone.start}%` }}></div>
                <div className="zone-line right" style={{ left: `${perfectZone.end}%` }}></div>
                <div className="zone-label">POWER ZONE</div>
              </div>
            </div>

            <div className="athlete">
              <div className="athlete-icon">🏋️</div>
              <div className="athlete-label">You</div>
            </div>

            <button 
              className="rep-btn" 
              onClick={handleRep}
              disabled={gameState !== 'playing'}
            >
              💪 DO REP!
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
            <h2>💪 Workout Complete!</h2>
            <div className="final-stats">
              <div className="final-stat">
                <span className="final-label">Final Score</span>
                <span className="final-value">{score}</span>
              </div>
              <div className="final-stat">
                <span className="final-label">Total Reps</span>
                <span className="final-value">{totalReps}</span>
              </div>
              <div className="final-stat">
                <span className="final-label">Best Combo</span>
                <span className="final-value">{bestCombo}x</span>
              </div>
              <div className="final-stat">
                <span className="final-label">Bad Form</span>
                <span className="final-value">{totalMisses}</span>
              </div>
              <div className="final-stat">
                <span className="final-label">Accuracy</span>
                <span className="final-value">
                  {totalReps > 0 ? Math.round((totalReps / (totalReps + totalMisses)) * 100) : 0}%
                </span>
              </div>
            </div>
            {score > highScore && (
              <div className="new-high-score">
                🏆 NEW HIGH SCORE! 🏆
              </div>
            )}
            <div className="game-over-message">
              ✅ Workout stats saved to your tasks!
            </div>
            <div className="game-over-buttons">
              <button className="play-again-btn" onClick={resetGame}>
                🔄 Train Again
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
            <li>💪 Watch the indicator move from left to right</li>
            <li>🎯 Click "DO REP!" or press SPACEBAR when in the power zone</li>
            <li>✨ Perfect timing = More points!</li>
            <li>🔥 Build combos for bonus points</li>
            <li>❌ 3 bad form reps = Workout Over</li>
            <li>⏸️ Press P to pause, ESC to quit</li>
            <li>🏆 Beat your high score!</li>
          </ul>
          <div className="difficulty-info">
            <h4>🎚️ Intensity Levels:</h4>
            <p><strong>🟢 Beginner:</strong> Slower pace, wider power zone (20% width)</p>
            <p><strong>🟡 Intermediate:</strong> Normal pace, normal zone (10% width)</p>
            <p><strong>🔴 Advanced:</strong> Fast pace, narrow zone (6% width)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalisthenicsGame;

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { trackEvent } from '../utils/analytics';
import {
  Gamepad2,
  X,
  RotateCcw,
  Trophy,
  Volume2,
  VolumeX,
  Code2,
  Copy,
  Check,
  Flame,
  Snowflake,
  ArrowUp,
  ArrowDown,
  Lightbulb,
  CheckCircle2,
  Target,
  FlameKindling,
  Info
} from 'lucide-react';

interface NumberGuessingGameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Difficulty = 'easy' | 'medium' | 'hard';

interface DifficultyConfig {
  label: string;
  min: number;
  max: number;
  maxAttempts: number;
  description: string;
}

const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: {
    label: 'Easy',
    min: 1,
    max: 50,
    maxAttempts: 10,
    description: '1 to 50 · 10 Attempts · Casual & Warm-up',
  },
  medium: {
    label: 'Medium',
    min: 1,
    max: 100,
    maxAttempts: 7,
    description: '1 to 100 · 7 Attempts · Classic O(log₂ 100) Binary Search',
  },
  hard: {
    label: 'Hard',
    min: 1,
    max: 500,
    maxAttempts: 9,
    description: '1 to 500 · 9 Attempts · High Deductive Challenge',
  },
};

interface GuessRecord {
  guess: number;
  result: 'too_low' | 'too_high' | 'correct';
  temperature: 'boiling' | 'hot' | 'warm' | 'cold' | 'freezing';
  diff: number;
  attemptNumber: number;
}

// Zero-dependency Web Audio API synthesizer for clean sound effects
function playSynthSound(type: 'win' | 'lose' | 'click' | 'hot' | 'cold', soundEnabled: boolean) {
  if (!soundEnabled) return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === 'win') {
      const notes = [440, 554.37, 659.25, 880]; // A major chord
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
        gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + idx * 0.1 + 0.35);
      });
    } else if (type === 'lose') {
      const notes = [320, 270, 210];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.15);
        gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.15 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.15);
        osc.stop(ctx.currentTime + idx * 0.15 + 0.25);
      });
    } else if (type === 'hot') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(850, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === 'cold') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    }
  } catch {
    // AudioContext might be blocked before user interaction; ignore silently
  }
}

export const NumberGuessingGameModal: React.FC<NumberGuessingGameModalProps> = ({ isOpen, onClose }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const config = DIFFICULTY_CONFIGS[difficulty];

  // Game state
  const [targetNumber, setTargetNumber] = useState<number>(() => Math.floor(Math.random() * (100 - 1 + 1)) + 1);
  const [currentGuessInput, setCurrentGuessInput] = useState<string>('');
  const [guesses, setGuesses] = useState<GuessRecord[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [message, setMessage] = useState<string>('Make your first guess to begin!');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showAdvisor, setShowAdvisor] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'game' | 'code' | 'rules'>('game');
  const [copiedCode, setCopiedCode] = useState(false);

  // Dynamic search bounds based on player's guesses
  const [minBound, setMinBound] = useState<number>(config.min);
  const [maxBound, setMaxBound] = useState<number>(config.max);

  // Persistent stats from localStorage
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('deepak_guessing_game_stats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return {
      wins: 0,
      totalGames: 0,
      bestAttempts: { easy: null, medium: null, hard: null },
    };
  });

  const inputRef = useRef<HTMLInputElement>(null);

  // Reset or start a new game
  const initNewGame = (diff: Difficulty = difficulty) => {
    const selectedConfig = DIFFICULTY_CONFIGS[diff];
    const newTarget = Math.floor(Math.random() * (selectedConfig.max - selectedConfig.min + 1)) + selectedConfig.min;
    setTargetNumber(newTarget);
    setGuesses([]);
    setGameState('playing');
    setCurrentGuessInput('');
    setMinBound(selectedConfig.min);
    setMaxBound(selectedConfig.max);
    setMessage(`I'm thinking of a number between ${selectedConfig.min} and ${selectedConfig.max}. You have ${selectedConfig.maxAttempts} attempts!`);
    playSynthSound('click', soundEnabled);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  // Change difficulty
  const handleDifficultyChange = (diff: Difficulty) => {
    setDifficulty(diff);
    initNewGame(diff);
    trackEvent('filter_change', `game_difficulty_${diff}`);
  };

  // Reset on modal open or difficulty change
  useEffect(() => {
    if (isOpen) {
      initNewGame(difficulty);
      trackEvent('page_view', 'open_number_guessing_game_modal');
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Optimal binary search midpoint
  const optimalMidpoint = useMemo(() => {
    return Math.floor((minBound + maxBound) / 2);
  }, [minBound, maxBound]);

  const attemptsLeft = config.maxAttempts - guesses.length;

  // Process guess
  const handleSubmitGuess = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (gameState !== 'playing') return;

    const num = parseInt(currentGuessInput.trim(), 10);
    if (isNaN(num)) {
      setMessage('Please enter a valid whole number!');
      return;
    }

    if (num < config.min || num > config.max) {
      setMessage(`Out of bounds! Please guess between ${config.min} and ${config.max}.`);
      return;
    }

    if (guesses.some((g) => g.guess === num)) {
      setMessage(`You already guessed ${num}! Try a different number.`);
      return;
    }

    const diff = Math.abs(num - targetNumber);
    let temp: 'boiling' | 'hot' | 'warm' | 'cold' | 'freezing';
    const rangeSpan = config.max - config.min;

    if (diff === 0) {
      temp = 'boiling';
    } else if (diff <= Math.max(3, Math.round(rangeSpan * 0.04))) {
      temp = 'boiling';
    } else if (diff <= Math.max(6, Math.round(rangeSpan * 0.08))) {
      temp = 'hot';
    } else if (diff <= Math.max(15, Math.round(rangeSpan * 0.18))) {
      temp = 'warm';
    } else if (diff <= Math.max(30, Math.round(rangeSpan * 0.35))) {
      temp = 'cold';
    } else {
      temp = 'freezing';
    }

    let result: 'too_low' | 'too_high' | 'correct';
    if (num === targetNumber) {
      result = 'correct';
    } else if (num < targetNumber) {
      result = 'too_low';
      setMinBound((prev) => Math.max(prev, num + 1));
    } else {
      result = 'too_high';
      setMaxBound((prev) => Math.min(prev, num - 1));
    }

    const newRecord: GuessRecord = {
      guess: num,
      result,
      temperature: temp,
      diff,
      attemptNumber: guesses.length + 1,
    };

    const nextGuesses = [...guesses, newRecord];
    setGuesses(nextGuesses);
    setCurrentGuessInput('');

    if (result === 'correct') {
      setGameState('won');
      setMessage(`🎉 Bullseye! You cracked it in ${nextGuesses.length} attempts!`);
      playSynthSound('win', soundEnabled);
      trackEvent('game_action', 'guess_game_win', {
        attempts: String(nextGuesses.length),
        difficulty,
      });

      // Update persistent stats
      const currentBest = stats.bestAttempts[difficulty];
      const newBest = currentBest === null ? nextGuesses.length : Math.min(currentBest, nextGuesses.length);
      const updatedStats = {
        ...stats,
        wins: stats.wins + 1,
        totalGames: stats.totalGames + 1,
        bestAttempts: {
          ...stats.bestAttempts,
          [difficulty]: newBest,
        },
      };
      setStats(updatedStats);
      localStorage.setItem('deepak_guessing_game_stats', JSON.stringify(updatedStats));
    } else if (nextGuesses.length >= config.maxAttempts) {
      setGameState('lost');
      setMessage(`Game over! The mystery number was ${targetNumber}. Give it another shot!`);
      playSynthSound('lose', soundEnabled);
      trackEvent('game_action', 'guess_game_loss', { difficulty });

      const updatedStats = {
        ...stats,
        totalGames: stats.totalGames + 1,
      };
      setStats(updatedStats);
      localStorage.setItem('deepak_guessing_game_stats', JSON.stringify(updatedStats));
    } else {
      if (result === 'too_low') {
        setMessage(`📈 ${num} is Too Low! ${temp === 'boiling' ? '🔥 But you are BOILING hot!' : temp === 'hot' ? '🔥 Getting very hot!' : temp === 'warm' ? '🌤️ Warm proximity!' : '❄️ Chilly!'}`);
      } else {
        setMessage(`📉 ${num} is Too High! ${temp === 'boiling' ? '🔥 But you are BOILING hot!' : temp === 'hot' ? '🔥 Getting very hot!' : temp === 'warm' ? '🌤️ Warm proximity!' : '❄️ Chilly!'}`);
      }
      playSynthSound(temp === 'boiling' || temp === 'hot' ? 'hot' : 'cold', soundEnabled);
    }
  };

  const sampleAlgorithmCode = `/**
 * Deepak Mewada - Interactive Number Guessing Game Core Engine
 * Implements dynamic range pruning, temperature heuristics, and O(log N) binary search analysis.
 */

class NumberGuessingGame {
  constructor(min = 1, max = 100, maxAttempts = 7) {
    this.min = min;
    this.max = max;
    this.maxAttempts = maxAttempts;
    this.target = Math.floor(Math.random() * (max - min + 1)) + min;
    this.currentMin = min;
    this.currentMax = max;
    this.attempts = [];
    this.isOver = false;
  }

  // Evaluates a player's guess with dynamic heuristics
  guess(number) {
    if (this.isOver) throw new Error("Game is already finished.");
    if (number < this.min || number > this.max) {
      return { error: "Out of bounds" };
    }

    const diff = Math.abs(number - this.target);
    const attemptCount = this.attempts.length + 1;

    let result = "correct";
    if (number < this.target) {
      result = "too_low";
      this.currentMin = Math.max(this.currentMin, number + 1);
    } else if (number > this.target) {
      result = "too_high";
      this.currentMax = Math.min(this.currentMax, number - 1);
    }

    // Algorithmic temperature calculation
    const temperature = this.calculateTemperature(diff);

    const record = {
      guess: number,
      result,
      temperature,
      diff,
      attempt: attemptCount,
      attemptsRemaining: this.maxAttempts - attemptCount,
      optimalMidpoint: Math.floor((this.currentMin + this.currentMax) / 2)
    };

    this.attempts.push(record);

    if (result === "correct") {
      this.isOver = true;
      return { status: "WIN", record };
    }

    if (attemptCount >= this.maxAttempts) {
      this.isOver = true;
      return { status: "LOSS", target: this.target, record };
    }

    return { status: "CONTINUE", record };
  }

  // O(1) temperature classification
  calculateTemperature(diff) {
    const span = this.max - this.min;
    if (diff === 0) return "boiling";
    if (diff <= Math.max(3, span * 0.04)) return "boiling";
    if (diff <= Math.max(6, span * 0.08)) return "hot";
    if (diff <= Math.max(15, span * 0.18)) return "warm";
    return "cold";
  }

  // O(1) Binary search advisor
  getOptimalNextGuess() {
    return Math.floor((this.currentMin + this.currentMax) / 2);
  }
}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(sampleAlgorithmCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#0c121e] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#0e1626] border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <h2 id="game-modal-title" className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Number Guessing Game</span>
                <span className="text-[11px] font-mono font-medium text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded-full">
                  Live Project
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Created by Deepak Mewada · Algorithmic Deductive Game
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Audio Toggle Button */}
            <button
              type="button"
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                playSynthSound('click', !soundEnabled);
              }}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
              aria-label={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Restart Button */}
            <button
              type="button"
              onClick={() => initNewGame()}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Reset & New Game"
              aria-label="Start new game"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              aria-label="Close game modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-slate-800/80 bg-[#0c121e]">
          <button
            type="button"
            onClick={() => setActiveTab('game')}
            className={`px-3 py-1.5 text-xs font-medium rounded-t-lg transition-colors border-b-2 cursor-pointer ${
              activeTab === 'game'
                ? 'border-emerald-500 text-white bg-slate-800/60 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            🎮 Play Game
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 text-xs font-medium rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'code'
                ? 'border-blue-500 text-white bg-slate-800/60 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Algorithm Source Code</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('rules')}
            className={`px-3 py-1.5 text-xs font-medium rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'rules'
                ? 'border-purple-500 text-white bg-slate-800/60 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>How to Play</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'game' && (
            <>
              {/* Difficulty Segmented Control */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
                <div className="flex items-center gap-1">
                  {(['easy', 'medium', 'hard'] as Difficulty[]).map((diffKey) => (
                    <button
                      key={diffKey}
                      type="button"
                      onClick={() => handleDifficultyChange(diffKey)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                        difficulty === diffKey
                          ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                      }`}
                    >
                      {DIFFICULTY_CONFIGS[diffKey].label}
                    </button>
                  ))}
                </div>

                {/* Score telemetry */}
                <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>Best: <strong className="text-white">{stats.bestAttempts[difficulty] ? `${stats.bestAttempts[difficulty]} tries` : 'None'}</strong></span>
                  </div>
                  <div>
                    Wins: <strong className="text-emerald-400">{stats.wins}</strong> / {stats.totalGames}
                  </div>
                </div>
              </div>

              {/* Game Card Center Stage */}
              <div className="relative p-5 bg-gradient-to-b from-[#111927] to-[#0a0f18] border border-slate-800 rounded-2xl flex flex-col items-center text-center space-y-4">
                {/* Glowing mystery box */}
                <div className="relative">
                  <div
                    className={`w-24 h-24 rounded-2xl flex items-center justify-center font-display font-black text-4xl shadow-xl transition-all duration-300 border ${
                      gameState === 'won'
                        ? 'bg-emerald-600/30 border-emerald-400 text-emerald-300 shadow-emerald-950/80 scale-105'
                        : gameState === 'lost'
                        ? 'bg-rose-900/30 border-rose-500 text-rose-300 shadow-rose-950/80'
                        : 'bg-slate-900 border-slate-700 text-blue-400 shadow-black/50'
                    }`}
                  >
                    {gameState === 'won' || gameState === 'lost' ? targetNumber : '?'}
                  </div>
                </div>

                {/* Dynamic Search Range Indicator */}
                <div className="space-y-1">
                  <div className="text-xs font-mono text-slate-400">
                    Active Search Space
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm font-mono font-bold text-white">
                    <span className="text-emerald-400">{minBound}</span>
                    <span className="text-slate-600">·······</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800/90 text-blue-300 border border-slate-700/80 text-xs">
                      [Target]
                    </span>
                    <span className="text-slate-600">·······</span>
                    <span className="text-emerald-400">{maxBound}</span>
                  </div>
                </div>

                {/* Feedback message banner */}
                <div
                  className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all max-w-md w-full ${
                    gameState === 'won'
                      ? 'bg-emerald-950/80 border-emerald-600/80 text-emerald-200'
                      : gameState === 'lost'
                      ? 'bg-rose-950/80 border-rose-600/80 text-rose-200'
                      : 'bg-slate-900/90 border-slate-800 text-slate-200'
                  }`}
                >
                  {message}
                </div>

                {/* Attempts bar */}
                <div className="w-full max-w-md space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Attempts: {guesses.length} of {config.maxAttempts}</span>
                    <span className={attemptsLeft <= 2 ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                      {attemptsLeft} remaining
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full transition-all duration-300 ${
                        attemptsLeft <= 2
                          ? 'bg-rose-500'
                          : attemptsLeft <= 4
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${(attemptsLeft / config.maxAttempts) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Guess input form */}
                {gameState === 'playing' ? (
                  <form onSubmit={handleSubmitGuess} className="w-full max-w-md flex gap-2">
                    <div className="relative flex-1">
                      <input
                        ref={inputRef}
                        type="number"
                        min={config.min}
                        max={config.max}
                        value={currentGuessInput}
                        onChange={(e) => setCurrentGuessInput(e.target.value)}
                        placeholder={`Enter guess (${minBound} – ${maxBound})`}
                        aria-label="Enter your number guess"
                        className="w-full px-4 py-2.5 text-sm bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 font-mono text-center"
                        autoFocus
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!currentGuessInput.trim()}
                      className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-md shadow-emerald-950/40 cursor-pointer flex items-center gap-1.5 shrink-0"
                    >
                      <Target className="w-4 h-4" />
                      <span>Guess</span>
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => initNewGame()}
                      className="px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-md shadow-emerald-950/40 cursor-pointer flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Play Another Round</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('code')}
                      className="px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Code2 className="w-4 h-4" />
                      <span>Inspect Code</span>
                    </button>
                  </div>
                )}

                {/* Binary search algorithmic hint advisor */}
                {gameState === 'playing' && (
                  <div className="w-full max-w-md pt-1">
                    {!showAdvisor ? (
                      <button
                        type="button"
                        onClick={() => setShowAdvisor(true)}
                        className="text-xs text-blue-400 hover:text-blue-300 flex items-center justify-center gap-1.5 mx-auto transition-colors cursor-pointer"
                      >
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>Need Algorithmic Hint? (Binary Search Advisor)</span>
                      </button>
                    ) : (
                      <div className="p-3 bg-blue-950/40 border border-blue-800/60 rounded-xl text-left space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-semibold text-blue-300 flex items-center gap-1.5">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                            <span>Binary Search Advisor:</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setShowAdvisor(false)}
                            className="text-[11px] text-slate-400 hover:text-slate-200"
                          >
                            Hide
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          In binary search, the mathematically optimal choice is the midpoint of the current search space:
                          <strong className="text-white font-mono ml-1">
                            Math.floor(({minBound} + {maxBound}) / 2) = {optimalMidpoint}
                          </strong>.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentGuessInput(String(optimalMidpoint));
                            inputRef.current?.focus();
                          }}
                          className="w-full py-1 text-xs font-semibold text-blue-200 bg-blue-900/60 hover:bg-blue-800/80 border border-blue-700/60 rounded-lg transition-colors cursor-pointer"
                        >
                          Use Optimal Midpoint: {optimalMidpoint}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Guess History List */}
              {guesses.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Guess Log ({guesses.length})</span>
                    <span>Proximity & Direction</span>
                  </div>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {guesses.slice().reverse().map((g) => (
                      <div
                        key={g.attemptNumber}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/70 border border-slate-800 text-xs font-mono"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 w-5">#{g.attemptNumber}</span>
                          <span className="text-white font-bold text-sm">{g.guess}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Direction badge */}
                          {g.result === 'correct' ? (
                            <span className="flex items-center gap-1 text-emerald-400 font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Correct!</span>
                            </span>
                          ) : g.result === 'too_low' ? (
                            <span className="flex items-center gap-1 text-blue-400">
                              <ArrowUp className="w-3.5 h-3.5" />
                              <span>Too Low</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-purple-400">
                              <ArrowDown className="w-3.5 h-3.5" />
                              <span>Too High</span>
                            </span>
                          )}

                          {/* Temperature badge */}
                          {g.temperature === 'boiling' && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-rose-950 border border-rose-800 text-rose-300 text-[10px]">
                              <FlameKindling className="w-3 h-3 text-rose-400" />
                              <span>Boiling!</span>
                            </span>
                          )}
                          {g.temperature === 'hot' && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-300 text-[10px]">
                              <Flame className="w-3 h-3 text-amber-400" />
                              <span>Hot</span>
                            </span>
                          )}
                          {g.temperature === 'warm' && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-yellow-950 border border-yellow-800 text-yellow-300 text-[10px]">
                              <span>🌤️ Warm</span>
                            </span>
                          )}
                          {g.temperature === 'cold' && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-sky-950 border border-sky-800 text-sky-300 text-[10px]">
                              <Snowflake className="w-3 h-3 text-sky-400" />
                              <span>Cold</span>
                            </span>
                          )}
                          {g.temperature === 'freezing' && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">
                              <span>🧊 Freezing</span>
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'code' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Game Algorithm Implementation & Logic</h3>
                  <p className="text-xs text-slate-400">Pure object-oriented engine with binary search calculation</p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>

              <div className="relative bg-slate-950 rounded-xl p-4 border border-slate-800 overflow-x-auto text-xs font-mono leading-relaxed text-slate-300">
                <pre>{sampleAlgorithmCode}</pre>
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
                <h4 className="font-bold text-white text-base">Game Rules & Objectives</h4>
                <p>
                  The computer randomly generates a secret integer between 1 and the upper bound of the selected difficulty mode.
                  Your goal is to deduce the mystery number within the allotted attempts!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1.5">
                  <h5 className="font-semibold text-white flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-emerald-400" />
                    <span>Dynamic Range Pruning</span>
                  </h5>
                  <p className="text-xs text-slate-400">
                    With each guess, the game automatically tightens the active bounds so you can visualize the shrinking search space.
                  </p>
                </div>

                <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1.5">
                  <h5 className="font-semibold text-white flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-amber-400" />
                    <span>Temperature Cues</span>
                  </h5>
                  <p className="text-xs text-slate-400">
                    Proximity feedback lets you know if you are boiling hot (within ~3% of the target) or freezing cold (far away).
                  </p>
                </div>
              </div>

              <div className="p-4 bg-blue-950/30 border border-blue-800/40 rounded-xl space-y-2">
                <h4 className="font-bold text-blue-200">The Computer Science Behind It</h4>
                <p className="text-xs text-slate-300">
                  This game is a real-world demonstration of <strong>Binary Search</strong>.
                  For 100 numbers, $\log_2(100) \approx 6.64$, meaning any number can be guaranteed in at most <strong>7 guesses</strong> if you always pick the midpoint!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer info strip */}
        <div className="px-5 py-3 bg-[#0a0f18] border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>Project: deepakmewada071-collab/number-guessing-game</span>
          <span>Web Audio API · React · LocalStorage</span>
        </div>
      </div>
    </div>
  );
};

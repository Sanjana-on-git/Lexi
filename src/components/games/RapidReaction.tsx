import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Cloud } from 'lucide-react';

interface Dot {
  id: number;
  x: number;
  y: number;
  isBlue: boolean;
}

const RapidReaction = () => {
  const [dots, setDots] = useState<Dot[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackColor, setFeedbackColor] = useState('');
  const [gameSpeed, setGameSpeed] = useState(2000);
  const [highScore, setHighScore] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const savedHighScore = localStorage.getItem('rapidReactionHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  const generateDot = useCallback(() => {
    const newDot: Dot = {
      id: Date.now(),
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      isBlue: Math.random() > 0.3,
    };

    setDots(prev => [...prev, newDot]);

    setTimeout(() => {
      setDots(prev => prev.filter(dot => dot.id !== newDot.id));
      if (newDot.isBlue && isPlaying) {
        setLives(prev => Math.max(0, prev - 1));
        showFeedback('Missed! 😢', 'text-red-500');
      }
    }, 3000);
  }, [isPlaying]);

  const showFeedback = (message: string, color: string) => {
    setFeedback(message);
    setFeedbackColor(color);
    setTimeout(() => {
      setFeedback('');
    }, 1000);
  };

  const handleDotClick = (dot: Dot) => {
    if (!isPlaying || lives === 0) return;
    setDots(prev => prev.filter(d => d.id !== dot.id));

    if (dot.isBlue) {
      setScore(prevScore => {
        const newScore = prevScore + 1;
        if (newScore % 5 === 0) {
          setGameSpeed(prev => Math.max(prev * 0.9, 800));
        }
        return newScore;
      });
      showFeedback('Yay! 🎉', 'text-green-500');
    } else {
      setLives(prev => Math.max(0, prev - 1));
      showFeedback('Oopsie! 🚫', 'text-red-500');
    }
  };

  const startGame = () => {
    setScore(0);
    setLives(3);
    setDots([]);
    setIsPlaying(true);
    setGameSpeed(2000);
    setFeedback('');
    setFeedbackColor('');
  };

  useEffect(() => {
    if (isPlaying && lives > 0) {
      intervalRef.current = window.setInterval(generateDot, gameSpeed);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, lives, gameSpeed, generateDot]);

  useEffect(() => {
    if (lives === 0) {
      setIsPlaying(false);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('rapidReactionHighScore', score.toString());
      }
    }
  }, [lives, score, highScore]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative max-w-4xl mx-auto py-12 px-6 bg-gradient-to-br from-sky-100 via-pink-100 to-yellow-100 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-4 border-pink-300"
    >
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-blue-200 opacity-60"
          initial={{ x: -100 }}
          animate={{ x: '100vw' }}
          transition={{ repeat: Infinity, duration: 60 + i * 20, ease: 'linear' }}
          style={{ top: `${i * 25 + 10}px`, left: '-10vw', zIndex: 0 }}
        >
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8 relative z-10"
      >
        <motion.h2
          className="text-6xl font-extrabold text-pink-600 dyslexic-friendly mb-2 drop-shadow"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          🎈 Rapid Reaction 🎈
        </motion.h2>
        <motion.p
          className="text-2xl text-purple-700 font-semibold dyslexic-friendly"
          animate={{ x: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          Tap the BLUE bubbles, avoid the RED ones! 🌈
        </motion.p>
      </motion.div>

      <motion.div
        className="bg-white p-6 rounded-3xl shadow-inner border-4 border-yellow-300 relative z-10"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-6">
          <div className="flex justify-center items-center space-x-6 text-2xl">
            <motion.p className="font-extrabold text-blue-600 flex items-center" animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
              <Sparkles className="mr-2" /> Score: {score}
            </motion.p>
            <motion.p className="font-extrabold text-red-500 flex items-center" animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
              <Heart className="mr-2" /> {'❤️'.repeat(lives)}
            </motion.p>
            <motion.p className="font-extrabold text-yellow-600 flex items-center" animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
              🏆 High Score: {highScore}
            </motion.p>
          </div>
          {feedback && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-xl font-bold mt-4 ${feedbackColor}`}
            >
              {feedback}
            </motion.p>
          )}
        </div>

        {!isPlaying ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <h3 className="text-3xl font-bold text-purple-700 mb-3">
              {lives === 0 ? 'Aww! Game Over 😢' : 'Let’s Begin the Fun! 🎉'}
            </h3>
            {lives === 0 && <p className="text-xl mb-4">Your Final Score: <span className="font-bold text-blue-600">{score}</span></p>}
            <motion.button
              onClick={startGame}
              className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-full text-lg transition duration-300 shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {lives === 0 ? 'Try Again 🔁' : 'Start Playing 🎮'}
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            className="relative w-full aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl overflow-hidden border-2 border-dashed border-pink-300"
            style={{ cursor: 'crosshair' }}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <AnimatePresence>
              {dots.map(dot => (
                <motion.div
                  key={dot.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={`absolute w-12 h-12 rounded-full cursor-pointer shadow-lg border-2 border-white ${
                    dot.isBlue ? 'bg-blue-400' : 'bg-red-400'
                  } animate-bounce`}
                  style={{
                    left: `${dot.x}%`,
                    top: `${dot.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  onClick={() => handleDotClick(dot)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default RapidReaction;

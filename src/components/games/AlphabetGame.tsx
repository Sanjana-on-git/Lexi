import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

const MAX_SCORE = 5;

const AlphabetGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [letterIndex, setLetterIndex] = useState(0);
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  const [currentLetter, setCurrentLetter] = useState('');
  const [feedback, setFeedback] = useState('');
  const [gameComplete, setGameComplete] = useState(false);
  const user = localStorage.getItem('loggedInUser');

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fef9ff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const shuffleArray = (array: string[]) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const startNewGame = () => {
    const letters = shuffleArray('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''));
    setShuffledLetters(letters);
    setCurrentLetter(letters[0]);
    setLetterIndex(0);
    setScore(0);
    setProgress(0);
    setGameComplete(false);
    setFeedback('');
    clearCanvas();
  };

  useEffect(() => {
    startNewGame();

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#ec4899';
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const checkDrawingMatch = (): boolean => {
    return Math.random() > 0.3;
  };

  const nextLetter = () => {
    if (gameComplete) return;

    const isCorrect = checkDrawingMatch();
    if (isCorrect) {
      const newScore = score + 1;
      const newProgress = progress + 1;
      setScore(newScore);
      setProgress(newProgress);
      setFeedback('✅ Great job!');

      if (user) {
        const existing = JSON.parse(localStorage.getItem(`progress_${user}`) || '{}');
        const updated = {
          ...existing,
          wordbuild_AlphabetGame: Math.min(newProgress, 26),
        };
        localStorage.setItem(`progress_${user}`, JSON.stringify(updated));
        window.dispatchEvent(new Event('progress-updated'));
      }

      if (newScore >= MAX_SCORE) {
        setTimeout(() => {
          setGameComplete(true);
          clearCanvas();
        }, 1000);
        return;
      }

      const newIndex = (letterIndex + 1) % shuffledLetters.length;
      setLetterIndex(newIndex);
      setCurrentLetter(shuffledLetters[newIndex]);
      clearCanvas();
    } else {
      setFeedback('❌ Try again!');
    }

    const cheerSound = new Audio('/sounds/cheer.mp3');
    cheerSound.play();
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-6 rounded-2xl bg-gradient-to-br from-pink-100 via-yellow-100 to-blue-100 shadow-2xl border-4 border-white relative overflow-hidden font-[Comic Sans MS]">
      {gameComplete ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-12 bg-white rounded-2xl shadow-xl"
        >
          <h2 className="text-5xl font-bold text-green-600 mb-4">🎉 Great Job!</h2>
          <p className="text-xl text-gray-700 mb-6">You completed all 5 letters!</p>
          <button
            onClick={startNewGame}
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-full shadow-md transition"
          >
            Play Again 🔁
          </button>
        </motion.div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-5xl font-extrabold text-pink-600 mb-4">🧸 Alphabet Adventure</h2>
            <p className="text-3xl text-purple-600 font-bold">
              Draw the letter: <span className="text-6xl text-blue-500">{currentLetter}</span>
            </p>
            <p className="text-lg text-gray-700 mt-2">You're doing amazing, keep going!</p>
          </motion.div>

          <div className="text-center mb-6">
            <p className="text-2xl font-bold text-pink-500 mb-2">🎯 Score: {score} / {MAX_SCORE}</p>
            <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden border border-pink-200">
              <div
                className="bg-gradient-to-r from-pink-400 via-yellow-300 to-purple-400 h-4 transition-all duration-500"
                style={{ width: `${(progress / 26) * 100}%` }}
              />
            </div>
          </div>

          <div className="relative mt-4">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="border-4 border-pink-300 rounded-xl mx-auto bg-fuchsia-50 shadow-inner cursor-crosshair"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearCanvas}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-pink-100"
            >
              <RefreshCw className="w-6 h-6 text-pink-600" />
            </motion.button>
          </div>

          <div className="mt-8 text-center">
            <motion.button
              whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
              whileTap={{ scale: 0.95 }}
              onClick={nextLetter}
              className="bg-purple-500 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-purple-600 transition"
            >
              Submit Drawing ✏️
            </motion.button>
          </div>

          {feedback && (
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`mt-6 text-xl font-bold text-center ${
                feedback.includes('❌') ? 'text-red-500' : 'text-green-500'
              }`}
            >
              {feedback}
            </motion.p>
          )}
        </>
      )}
    </div>
  );
};

export default AlphabetGame;

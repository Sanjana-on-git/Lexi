import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const rhymingPairs = [
  { word: 'cat', rhyme: 'hat' },
  { word: 'dog', rhyme: 'log' },
  { word: 'pat', rhyme: 'rat' },
  { word: 'bat', rhyme: 'rat' },
  { word: 'bun', rhyme: 'run' }
];

const decoyWords = ['tree', 'book', 'fish', 'cup', 'star', 'chair', 'pen', 'clock', 'box', 'lamp'];

const generateMaze = () => {
  const rows = 5;
  const cols = 5;
  const grid = Array.from({ length: rows }, () => Array(cols).fill(''));
  const path = [{ x: 0, y: 0 }];
  let x = 0, y = 0;

  while (x < cols - 1 || y < rows - 1) {
    if (x < cols - 1 && y < rows - 1) {
      Math.random() > 0.5 ? x++ : y++;
    } else if (x < cols - 1) {
      x++;
    } else {
      y++;
    }
    path.push({ x, y });
  }

  const pathSet = new Set(path.map(p => `${p.x},${p.y}`));
  const obstacles = new Set<string>();
  while (obstacles.size < 6) {
    const ox = Math.floor(Math.random() * cols);
    const oy = Math.floor(Math.random() * rows);
    const key = `${ox},${oy}`;
    if (!pathSet.has(key) && key !== '0,0' && key !== '4,4') {
      obstacles.add(key);
      grid[oy][ox] = '🧱';
    }
  }

  grid[4][4] = '🎯';
  return grid;
};

const PhonicsMaze: React.FC = () => {
  const [maze, setMaze] = useState(generateMaze());
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [pendingMove, setPendingMove] = useState<{ x: number; y: number } | null>(null);
  const [question, setQuestion] = useState<{ word: string; rhyme: string; options: string[] } | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const user = localStorage.getItem('loggedInUser');

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gameOver || question) return;
      const { x, y } = position;
      let newX = x, newY = y;

      if (e.key === 'ArrowRight') newX++;
      else if (e.key === 'ArrowLeft') newX--;
      else if (e.key === 'ArrowDown') newY++;
      else if (e.key === 'ArrowUp') newY--;
      else return;

      if (newX < 0 || newY < 0 || newX > 4 || newY > 4) return;
      if (maze[newY][newX] === '🧱') return;

      const pair = rhymingPairs[Math.floor(Math.random() * rhymingPairs.length)];
      const distractors = decoyWords.sort(() => 0.5 - Math.random()).slice(0, 2);
      const options = [pair.rhyme, ...distractors].sort(() => 0.5 - Math.random());

      setQuestion({ word: pair.word, rhyme: pair.rhyme, options });
      setPendingMove({ x: newX, y: newY });
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [position, gameOver, question, maze]);

  const handleOptionClick = (selected: string) => {
    if (!question || !pendingMove) return;

    if (selected === question.rhyme) {
      setPosition(pendingMove);

      if (pendingMove.x === 4 && pendingMove.y === 4) {
        setScore(prev => {
          const newScore = Math.min(prev + 1, 5);
          if (user) {
            const existing = JSON.parse(localStorage.getItem(`progress_${user}`) || '{}');
            const updated = { ...existing, phonics_PhonicsMaze: newScore };
            localStorage.setItem(`progress_${user}`, JSON.stringify(updated));
            window.dispatchEvent(new Event('progress-updated'));
          }
          return newScore;
        });
        setGameOver(true);
      }
    }

    setQuestion(null);
    setPendingMove(null);
  };

  const resetGame = () => {
    setMaze(generateMaze());
    setPosition({ x: 0, y: 0 });
    setPendingMove(null);
    setQuestion(null);
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-pink-200 to-purple-200">
      <h2 className="text-4xl font-bold mb-4 text-purple-800">🧩 Phonics Maze</h2>
      <p className="text-lg text-gray-700 mb-6">Use arrow keys to move. Pick the rhyming word to continue!</p>

      <div className="grid grid-cols-5 gap-3 mb-8 bg-white/40 p-5 rounded-2xl shadow-2xl border border-purple-200">
        {maze.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isPlayer = position.x === colIndex && position.y === rowIndex;
            const isObstacle = cell === '🧱';
            const isGoal = cell === '🎯';

            return (
              <motion.div
                key={`${rowIndex}-${colIndex}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={`
                  w-20 h-20 flex items-center justify-center 
                  text-2xl font-extrabold rounded-xl 
                  transition-all duration-200 border-2
                  ${
                    isPlayer
                      ? 'bg-yellow-300 text-white border-yellow-500 shadow-xl animate-bounce'
                      : isObstacle
                      ? 'bg-gray-700 text-white border-gray-600 shadow-inner'
                      : isGoal
                      ? 'bg-green-400 text-white border-green-600 shadow-lg animate-pulse'
                      : 'bg-white/60 hover:bg-purple-100 text-purple-700 border-white'
                  }
                `}
              >
                {isPlayer ? '🚶‍♂️' : isObstacle ? '🪨' : isGoal ? '🎯' : ''}
              </motion.div>
            );
          })
        )}
      </div>

      {question && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 bg-purple-100 p-6 rounded-lg shadow-lg text-center w-full max-w-md"
        >
          <p className="text-lg font-semibold mb-4">What rhymes with <span className="text-purple-700 font-bold">"{question.word}"</span>?</p>
          <div className="flex flex-wrap gap-4 justify-center">
            {question.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleOptionClick(opt)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                {opt}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {gameOver ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mt-6">
          <h3 className="text-3xl font-bold text-green-600 mb-4">🎉 Goal Reached!</h3>
          <p className="text-lg text-gray-700 mb-4">Score: {score}</p>
          <button
            onClick={resetGame}
            className="bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition"
          >
            Play Again
          </button>
        </motion.div>
      ) : (
        <p className="text-lg text-gray-600 mt-4">Current Score: {score}</p>
      )}
    </div>
  );
};

export default PhonicsMaze;

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const allPairs = [
  ['b', 'd'],
  ['p', 'q'],
  ['c', 'ↄ'],
  ['F', 'ꟻ'],
  ['s', 'ƨ'],
  ['N', 'ᴎ'],
  ['R', 'ᴙ'],
];

const speak = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  speechSynthesis.speak(utterance);
};

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

const FlipAFix: React.FC = () => {
  const [pairs, setPairs] = useState<{ options: string[]; answer: string }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const prevAnswerRef = useRef<string | null>(null);

  const generatePairs = () => {
    const chosenPairs = shuffle(allPairs).slice(0, 5);
    return chosenPairs.map(([a, b]) => {
      const pronounceable = /^[A-Za-z]$/.test(a) ? a : b;
      let answer = pronounceable;

      if (prevAnswerRef.current === answer) {
        answer = answer === a ? b : a;
      }

      prevAnswerRef.current = answer;
      const options = shuffle([a, b]);
      return { options, answer };
    });
  };

  useEffect(() => {
    setPairs(generatePairs());
  }, []);

  useEffect(() => {
    if (pairs.length && currentIndex < pairs.length) {
      speak(pairs[currentIndex].answer);
      setSelected(null);
    }
  }, [pairs, currentIndex]);

  const handleSelect = (choice: string) => {
    if (selected) return;
    setSelected(choice);
    const correct = pairs[currentIndex].answer;
    if (choice === correct) {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 800);
    } else {
      setGameOver(true);
    }
  };

  const restartGame = () => {
    setPairs(generatePairs());
    setCurrentIndex(0);
    setSelected(null);
    setGameOver(false);
  };

  const current = pairs[currentIndex];

  if (gameOver || !current) {
    return (
      <div className="text-center p-6">
        <h2 className="text-4xl font-bold text-red-600 mb-4">💥Great Job!</h2>
        <p className="text-xl text-gray-700 mb-6">
          {currentIndex === pairs.length ? 'You completed the game!' : 'Oops! Wrong letter.'}
        </p>
        <button
          onClick={restartGame}
          className="px-6 py-3 bg-purple-600 text-white text-lg rounded hover:bg-purple-700 transition-colors"
        >
          🔁 Restart Game
        </button>
      </div>
    );
  }

  return (
    <div className="text-center p-6">
      <h2 className="text-3xl font-bold text-purple-600 mb-4">🧠 Flip-a-Fix</h2>
      <p className="mb-2 text-lg text-gray-700">Listen and select the letter you heard</p>
      <div className="mb-4 text-sm text-gray-500">Progress: {currentIndex + 1} / 5</div>

      <button
        onClick={() => speak(current.answer)}
        className="mb-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        🔊 Hear Letter Again
      </button>

      <div className="flex justify-center gap-12 mb-6">
        {current.options.map((letter, idx) => (
          <motion.button
            key={idx}
            onClick={() => handleSelect(letter)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`text-6xl w-24 h-24 rounded-xl font-bold shadow-md transition-colors ${
              selected === letter
                ? letter === current.answer
                  ? 'bg-green-400 text-white'
                  : 'bg-red-400 text-white'
                : 'bg-white hover:bg-yellow-100'
            }`}
          >
            {letter}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default FlipAFix;

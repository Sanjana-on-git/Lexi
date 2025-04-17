import React, { useState } from 'react';
import { motion } from 'framer-motion';

const rhymingPairs: { word: string; rhymes: string[] }[] = [
  { word: "cat", rhymes: ["hat", "bat", "rat", "mat", "sat"] },
  { word: "dog", rhymes: ["fog", "log", "jog", "hog", "frog"] },
  { word: "sun", rhymes: ["fun", "run", "bun", "gun", "none"] },
  { word: "cake", rhymes: ["lake", "bake", "make", "rake", "snake"] },
  { word: "bell", rhymes: ["well", "sell", "tell", "yell", "smell"] },
  { word: "car", rhymes: ["bar", "far", "star", "jar", "guitar"] },
  { word: "bed", rhymes: ["red", "fed", "led", "head", "shed"] },
  { word: "book", rhymes: ["cook", "hook", "look", "took", "rook"] },
];

const allRhymingWords = rhymingPairs.flatMap(pair => pair.rhymes);

const getRandomRound = () => {
  const pair = rhymingPairs[Math.floor(Math.random() * rhymingPairs.length)];
  const correct = [...pair.rhymes].sort(() => 0.5 - Math.random()).slice(0, 3);

  const otherWords = allRhymingWords.filter(w => !correct.includes(w));
  const distractors = otherWords.sort(() => 0.5 - Math.random()).slice(0, 6);

  const options = [...correct, ...distractors].sort(() => 0.5 - Math.random());

  return { base: pair.word, correct, options };
};

const RhymingBingo: React.FC = () => {
  const [round, setRound] = useState(getRandomRound());
  const [selected, setSelected] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);

  const speakWord = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  const handleCall = () => {
    speakWord(round.base);
  };

  const handleClick = (word: string) => {
    if (selected.includes(word) || gameOver) return;

    const newSelected = [...selected, word];
    setSelected(newSelected);

    const correctSelections = newSelected.filter(w => round.correct.includes(w));
    if (correctSelections.length === round.correct.length) {
      setGameOver(true);

      const user = localStorage.getItem('loggedInUser');
      if (user) {
        const existing = JSON.parse(localStorage.getItem(`progress_${user}`) || '{}');
        const updated = { ...existing, phonics_RhymingBingo: 5 };
        localStorage.setItem(`progress_${user}`, JSON.stringify(updated));
        window.dispatchEvent(new Event('progress-updated'));
      }
    }
  };

  const restartGame = () => {
    setSelected([]);
    setGameOver(false);
    setRound(getRandomRound());
  };

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-purple-600 mb-4">🎵 Rhyming Word Bingo</h2>
      <p className="mb-4 text-lg">Click on the words that rhyme with:</p>
      <motion.button
        onClick={handleCall}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="bg-blue-500 text-white font-bold px-6 py-2 rounded-full mb-4 hover:bg-blue-600 shadow-md"
      >
        🔊 {round.base}
      </motion.button>

      <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mt-6">
        {round.options.map((word, idx) => {
          const isCorrect = round.correct.includes(word);
          const isSelected = selected.includes(word);
          const classNames = isSelected
            ? isCorrect
              ? 'bg-green-400 text-white'
              : 'bg-red-400 text-white'
            : 'bg-white hover:bg-yellow-100';

          return (
            <motion.button
              key={idx}
              onClick={() => handleClick(word)}
              whileHover={{ scale: 1.05 }}
              className={`text-xl font-bold py-4 px-2 rounded-lg shadow-md transition-colors ${classNames}`}
            >
              {word}
            </motion.button>
          );
        })}
      </div>

      {gameOver && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <h3 className="text-2xl font-semibold text-green-600 mb-4">🎉 You found all rhymes!</h3>
          <motion.button
            onClick={restartGame}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-pink-500 text-white font-semibold py-2 px-6 rounded-full shadow-md hover:bg-pink-600 transition-colors"
          >
            🔁 Play Again
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default RhymingBingo;

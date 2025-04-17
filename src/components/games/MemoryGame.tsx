import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Card {
  id: number;
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const emojis = [
  '🐶', '🐱', '🐰', '🐸',
  '🦁', '🐼', '🐷', '🐵',
];

const MemoryGame = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const initializeCards = () => {
    const cardPairs = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        content: emoji,
        isFlipped: false,
        isMatched: false,
      }));

    setCards(cardPairs);
    setFlippedCards([]);
    setMatches(0);
    setScore(0);
  };

  const handleCardClick = (id: number) => {
    if (isLocked || flippedCards.length === 2 || cards[id].isMatched || flippedCards.includes(id)) return;

    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);
    setFlippedCards([...flippedCards, id]);

    if (flippedCards.length === 1) {
      setIsLocked(true);
      const firstCard = cards[flippedCards[0]];
      const secondCard = cards[id];

      if (firstCard.content === secondCard.content) {
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[flippedCards[0]].isMatched = true;
          matchedCards[id].isMatched = true;
          setCards(matchedCards);
          setFlippedCards([]);
          setMatches((m) => m + 1);
          setScore((s) => s + 10);
          setIsLocked(false);
        }, 500);
      } else {
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[flippedCards[0]].isFlipped = false;
          resetCards[id].isFlipped = false;
          setCards(resetCards);
          setFlippedCards([]);
          setScore((s) => Math.max(0, s - 1));
          setIsLocked(false);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    initializeCards();
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-10 px-6 bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 rounded-3xl shadow-2xl border-4 border-pink-200">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-5xl font-extrabold text-pink-600 mb-3 drop-shadow-lg">🐾 Emoji Memory Game</h1>
        <p className="text-lg text-gray-700 italic">Test your memory with cute emoji friends!</p>
      </motion.div>

      <div className="text-center mb-8 bg-white p-4 rounded-xl shadow-md w-fit mx-auto">
        <p className="text-2xl font-bold text-indigo-700">Score: {score}</p>
        <p className="text-md text-gray-600">Matches: {matches} / {emojis.length}</p>
      </div>

      <div className="grid grid-cols-4 gap-6 md:gap-8">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            whileTap={{ scale: 0.9 }}
            className={`
              flex items-center justify-center rounded-3xl aspect-square text-5xl
              font-bold shadow-lg cursor-pointer transition-all duration-300 border-4
              ${card.isMatched ? 'bg-green-200 border-green-400 text-green-700' : 'bg-white border-blue-300 hover:bg-blue-100'}
            `}
          >
            {(card.isFlipped || card.isMatched) ? card.content : '❓'}
          </motion.div>
        ))}
      </div>

      {matches === emojis.length && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-10 text-center"
        >
          <p className="text-3xl font-bold text-green-600 mb-4 drop-shadow">🎉 You did it!</p>
          <button
            onClick={initializeCards}
            className="bg-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-pink-600 transition duration-300 shadow-lg"
          >
            Play Again 🔄
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default MemoryGame;

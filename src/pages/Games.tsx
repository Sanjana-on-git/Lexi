import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { XCircle } from 'lucide-react';
import LetterSoundMatch from '../components/games/LetterSoundMatch';
import WordRace from '../components/games/WordRace';
import AlphabetGame from '../components/games/AlphabetGame';
import SentenceBuilder from '../components/games/SentenceBuilder';
import PhonicsMaze from '../components/games/PhonicsMaze';
import MemoryGame from '../components/games/MemoryGame';
import RapidReaction from '../components/games/RapidReaction';
import Shinchan from '../assets/Shinchan.png';
import Doraemon from '../assets/Doraemon.png';
import Tom from '../assets/Tom.png';
import Mickey from '../assets/Mickey.png';
import Dorami from '../assets/Dorami.png';
import Dora from '../assets/Dora.png';
import Gian from '../assets/Gian.png';
import RhymingBingo from '../components/games/RhymingBingo';
import FlipAFix from '../components/games/FlipAFix';
const games = [
  { title: 'Letter Sound Match', component: LetterSoundMatch },
  { title: 'Phonics Maze', component: PhonicsMaze },
  { title: 'Rhyming Bingo', component: RhymingBingo },
  { title: 'Word Race', component: WordRace },
  { title: 'Alphabet Game', component: AlphabetGame },
  { title: 'Sentence Builder', component: SentenceBuilder },
  { title: 'Memory Game', component: MemoryGame },
  { title: 'Rapid Reaction', component: RapidReaction },
  { title: 'Flip A Fix', component: FlipAFix },
];

const playSound = () => {
  const sound = new Audio('/sounds/click-fun.mp3');
  sound.play();
};

const cartoonImages = [Shinchan, Doraemon, Tom, Mickey, Dorami, Dora, Gian,Shinchan, Doraemon];

const Games = () => {
  const [selectedGame, setSelectedGame] = useState(null);

  if (selectedGame) {
    const GameComponent = selectedGame.component;
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-200 via-yellow-100 to-pink-100 p-6 rounded-lg shadow-2xl"
      >
        <button 
          onClick={() => setSelectedGame(null)}
          className="absolute top-4 right-4 text-white hover:text-gray-200 bg-red-400 p-2 rounded-full shadow-md"
        >
          <XCircle size={32} />
        </button>
        <GameComponent />
      </motion.div>
    );
  }

  return (
    <div className="relative py-16 px-6 text-center bg-gradient-to-br from-pink-100 via-yellow-50 to-pink-200 min-h-screen flex flex-col items-center overflow-hidden font-[\'Comic Sans MS\',cursive]">
      {/* Header */}
      <motion.h1 
        className="text-5xl font-extrabold mb-4 text-pink-600 drop-shadow-md z-20"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        🌟 Super Cute Learning Games 🌟
      </motion.h1>

      <motion.p 
        className="text-xl text-pink-700 mb-12 font-semibold z-20"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Click a game and get ready for giggles & learning! 🎉
      </motion.p>

      {/* Game Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto relative z-20">
        {games.map((game, index) => (
          <motion.div
            key={game.title}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { playSound(); setSelectedGame(game); }}
            className="p-6 bg-white rounded-[2rem] shadow-xl border-4 border-pink-200 hover:bg-pink-50 cursor-pointer flex flex-col items-center transition-all duration-300 hover:shadow-2xl relative"
          >
            <img
              src={cartoonImages[index]}
              alt="Cartoon"
              className="w-24 h-24 object-contain -mt-16 mb-2 drop-shadow-md"
            />
            <h2 className="text-2xl font-bold mb-4 text-purple-600 drop-shadow-sm">{game.title}</h2>
            <button className="mt-4 bg-gradient-to-r from-yellow-300 to-pink-400 text-white px-6 py-2 rounded-full shadow-lg hover:scale-105 transition-transform font-semibold">
              🎈 Play 🎈
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Games;

import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, GamepadIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import mascotAnimation from '../assets/owl.json';

const playSound = () => {
  new Audio('/sounds/magic-click.mp3').play();
};

const Home = () => {
  return (
    <div className="relative min-h-[calc(100vh-6rem)] bg-gradient-to-b from-pink-100 to-yellow-100 flex flex-col items-center justify-center text-center px-4 py-10 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-10 left-10 animate-floatSlow">
          <img src="/cloud1.svg" alt="cloud" className="w-40 opacity-70" />
        </div>
        <div className="absolute top-20 right-10 animate-floatSlow">
          <img src="/cloud2.svg" alt="cloud" className="w-32 opacity-60" />
        </div>
        <div className="absolute bottom-10 left-1/3 animate-pulse">
          <img src="/stars.svg" alt="stars" className="w-24 opacity-80" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-4 mb-8"
      >
        <div className="w-40">
          <Lottie animationData={mascotAnimation} loop={true} />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-pink-700 font-[Comic Sans MS,cursive] drop-shadow-md">
          🌈 Learning Adventures
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="max-w-xl mx-auto space-y-6"
      >
        <p className="text-lg sm:text-xl text-pink-800 font-semibold font-[Comic Sans MS,cursive]">
          Welcome to your magical learning journey! ✨ Where every level unlocks fun, laughter,
          and knowledge.
        </p>
        <div className="flex justify-center">
          <Link
            to="/games"
            onClick={playSound}
            className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-pink-400 text-white font-bold rounded-full shadow-md hover:scale-105 transition-transform duration-300 flex items-center space-x-2"
          >
            <GamepadIcon className="w-6 h-6" />
            <span>Start Playing!</span>
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-12 px-4 max-w-6xl"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white p-6 rounded-3xl shadow-lg border-4 border-pink-200"
        >
          <Brain className="w-12 h-12 text-purple-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-purple-700 mb-2 font-[Comic Sans MS,cursive]">Learn at Your Pace</h3>
          <p className="text-gray-600">Every journey is special—just like you! 🧠</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white p-6 rounded-3xl shadow-lg border-4 border-green-200"
        >
          <GamepadIcon className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-green-700 mb-2 font-[Comic Sans MS,cursive]">Fun & Games</h3>
          <p className="text-gray-600">Play, laugh, and learn with cool challenges 🎮</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white p-6 rounded-3xl shadow-lg border-4 border-yellow-200"
        >
          <Sparkles className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-yellow-700 mb-2 font-[Comic Sans MS,cursive]">Watch Yourself Grow</h3>
          <p className="text-gray-600">Celebrate every win with sparkles! ✨</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;

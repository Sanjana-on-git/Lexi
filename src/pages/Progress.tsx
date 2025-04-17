import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, BookOpen, Puzzle } from 'lucide-react';

interface ProgressBarProps {
  value: number;
  color: string;
  label: string;
  icon: React.ReactNode;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, color, label, icon }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center mb-4">
        {icon}
        <h3 className="text-xl font-bold ml-3 dyslexic-friendly">{label}</h3>
      </div>
      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8 }}
          className={`h-4 ${color} rounded-full`}
        />
      </div>
      <p className="mt-2 text-gray-600 font-semibold">{value}% Complete</p>
    </div>
  );
};

const Progress = () => {
  const [progressData, setProgressData] = useState([
    {
      label: 'Phonics Progress',
      value: 0,
      color: 'bg-blue-500',
      icon: <Brain className="w-8 h-8 text-blue-500" />,
    },
    {
      label: 'Word Building',
      value: 0,
      color: 'bg-green-500',
      icon: <BookOpen className="w-8 h-8 text-green-500" />,
    },
    {
      label: 'Logic Skills',
      value: 0,
      color: 'bg-purple-500',
      icon: <Puzzle className="w-8 h-8 text-purple-500" />,
    },
  ]);

  const loadProgress = () => {
    const user = localStorage.getItem('loggedInUser');
    if (!user) return;

    const data = JSON.parse(localStorage.getItem(`progress_${user}`) || '{}');

    const phonics1 = data.phonics_LetterSoundMatch || 0;
    const phonics2 = data.phonics_PhonicsMaze || 0;
    const phonics3 = data.phonics_RhymingBingo || 0;
    const totalPhonicsPercent = Math.round(Math.min(((phonics1 + phonics2 + phonics3) / 15) * 100, 100));

    const wordRace = data.wordbuild_WordRace || 0;
    const alphabet = data.wordbuild_AlphabetGame || 0;
    const sentence = data.wordbuild_SentenceBuilder || 0;
    const totalWordBuildPercent = Math.round(Math.min(((wordRace + alphabet + sentence) / 36) * 100, 100));

    const flipFix = data.logic_FlipAFix || 0; // max 5
    const memory = data.logic_MemoryGame || 0; // max 8
    const rapid = parseInt(localStorage.getItem('rapidReactionHighScore') || '0'); // max 10
    const logicTotal = Math.min(flipFix + memory + Math.min(rapid, 10), 23);
    const totalLogicPercent = Math.round((logicTotal / 23) * 100);

    setProgressData([
      {
        label: 'Phonics Progress',
        value: totalPhonicsPercent,
        color: 'bg-blue-500',
        icon: <Brain className="w-8 h-8 text-blue-500" />,
      },
      {
        label: 'Word Building',
        value: totalWordBuildPercent,
        color: 'bg-green-500',
        icon: <BookOpen className="w-8 h-8 text-green-500" />,
      },
      {
        label: 'Logic Skills',
        value: totalLogicPercent,
        color: 'bg-purple-500',
        icon: <Puzzle className="w-8 h-8 text-purple-500" />,
      },
    ]);
  };

  useEffect(() => {
    loadProgress();
    const handleStorageChange = () => loadProgress();
    const handleCustomUpdate = () => loadProgress();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('progress-updated', handleCustomUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('progress-updated', handleCustomUpdate);
    };
  }, []);

  return (
    <div className="py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold dyslexic-friendly mb-4">Your Learning Journey</h1>
        <p className="text-xl text-gray-600 dyslexic-friendly">
          Keep track of your amazing progress! 🌟
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        {progressData.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ProgressBar {...item} />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center"
      >
        <p className="text-lg text-gray-600 dyslexic-friendly">
          Keep playing games to improve your skills and watch these bars grow! 🚀
        </p>
        <button
          onClick={loadProgress}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Refresh Progress
        </button>
      </motion.div>
    </div>
  );
};

export default Progress;

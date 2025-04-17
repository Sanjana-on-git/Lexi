import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';

interface Letter {
  letter: string;
  sound: string;
}

const letters: Letter[] = [
  { letter: 'A', sound: 'ah' },
  { letter: 'B', sound: 'bah' },
  { letter: 'C', sound: 'ka' },
  { letter: 'D', sound: 'duh' },
  { letter: 'E', sound: 'eh' },
  { letter: 'F', sound: 'fah' },
];

const MAX_SCORE = 5;

const LetterSoundMatch: React.FC = () => {
  const [currentLetter, setCurrentLetter] = useState<Letter | null>(null);
  const [options, setOptions] = useState<Letter[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [canPlay, setCanPlay] = useState(true);
  const correctSoundRef = useRef<HTMLAudioElement | null>(null);
  const wrongSoundRef = useRef<HTMLAudioElement | null>(null);
  const user = localStorage.getItem('loggedInUser');

  useEffect(() => {
    const loadVoices = () => {
      const loadedVoices = window.speechSynthesis.getVoices();
      setVoices(loadedVoices);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    } else {
      loadVoices();
    }

    correctSoundRef.current = new Audio('https://cdn.pixabay.com/download/audio/2022/03/15/audio_eab2b5c1b6.mp3?filename=correct-1-46134.mp3');
    wrongSoundRef.current = new Audio('https://cdn.pixabay.com/download/audio/2022/03/15/audio_c9f77c116b.mp3?filename=wrong-2-46133.mp3');
  }, []);

  const speakSound = (sound: string) => {
    if (!sound || !canPlay) return;
    setCanPlay(false);
    const utterance = new SpeechSynthesisUtterance(sound);
    utterance.rate = 0.8;
    utterance.voice = voices.find(v => v.lang.includes('en') && v.name.toLowerCase().includes('female')) || voices[0];
    window.speechSynthesis.cancel(); // stop any previous utterances
    window.speechSynthesis.speak(utterance);
    setTimeout(() => setCanPlay(true), 1500); // debounce delay
  };

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    nextRound();
  };

  const nextRound = () => {
    const newLetter = letters[Math.floor(Math.random() * letters.length)];
    const otherLetters = letters.filter(l => l.letter !== newLetter.letter).sort(() => 0.5 - Math.random()).slice(0, 2);
    const allOptions = [...otherLetters, newLetter].sort(() => 0.5 - Math.random());
    setCurrentLetter(newLetter);
    setOptions(allOptions);
    setFeedback(null);
    setTimeout(() => speakSound(newLetter.sound), 300);
  };

  const handleLetterClick = (letter: Letter) => {
    if (letter.letter === currentLetter?.letter) {
      const newScore = score + 1;
      setScore(newScore);
      setFeedback('correct');
      correctSoundRef.current?.play();

      if (user) {
        const existing = JSON.parse(localStorage.getItem(`progress_${user}`) || '{}');
        const updated = { ...existing, phonics_LetterSoundMatch: Math.min(newScore, MAX_SCORE) };
        localStorage.setItem(`progress_${user}`, JSON.stringify(updated));
        window.dispatchEvent(new Event('progress-updated'));
      }

      if (newScore >= MAX_SCORE) {
        setTimeout(() => setGameOver(true), 1000);
      } else {
        setTimeout(() => nextRound(), 1000);
      }
    } else {
      setFeedback('incorrect');
      wrongSoundRef.current?.play();
      setTimeout(() => nextRound(), 1000);
    }
  };

  return (
    <div className="min-h-[500px] flex flex-col items-center justify-center p-8">
      <motion.img
        src="https://i.pinimg.com/originals/d7/d2/cd/d7d2cd60810a40afc13351e53717a7ba.gif"
        alt="Mascot"
        className="w-48 h-40 mb-4"
        animate={feedback === 'correct' ? { scale: [1, 1.2, 1] } : feedback === 'incorrect' ? { rotate: [0, -10, 10, 0] } : {}}
        transition={{ duration: 0.5 }}
      />

      {!gameStarted && !gameOver && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold mb-4 dyslexic-friendly">Letter Sound Match</h2>
          <p className="mb-6 text-gray-600">Listen to the sound and match it with the correct letter!</p>
          <button
            onClick={startGame}
            className="bg-pink-500 text-white font-semibold py-2 px-6 rounded-full shadow-md hover:bg-pink-600 transition-colors"
          >
            Start Game
          </button>
        </motion.div>
      )}

      {gameStarted && !gameOver && (
        <>
          <div className="text-2xl font-bold mb-6">Score: {score}</div>
          <motion.button
            onClick={() => speakSound(currentLetter?.sound || '')}
            whileHover={{ scale: 1.1 }}
            className="bg-blue-500 text-white p-4 rounded-full shadow-md mb-6"
          >
            <Volume2 size={28} />
          </motion.button>

          <div className="grid grid-cols-3 gap-4">
            {options.map((opt, idx) => (
              <motion.button
                key={idx}
                onClick={() => handleLetterClick(opt)}
                whileHover={{ scale: 1.1 }}
                className="text-3xl font-bold bg-white hover:bg-blue-100 rounded-xl shadow-lg w-24 h-24 flex items-center justify-center"
              >
                {opt.letter}
              </motion.button>
            ))}
          </div>

          {feedback && (
            <div className={`mt-6 text-2xl font-semibold ${feedback === 'correct' ? 'text-green-600' : 'text-red-500'}`}>
              {feedback === 'correct' ? '✅ Correct!' : '❌ Try again!'}
            </div>
          )}
        </>
      )}

      {gameOver && (
        <div className="text-center mt-10">
          <h2 className="text-3xl font-bold text-green-600 mb-4">🎉 You did it!</h2>
          <button
            onClick={startGame}
            className="bg-pink-500 text-white py-2 px-6 rounded-full hover:bg-pink-600 shadow-md"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default LetterSoundMatch;

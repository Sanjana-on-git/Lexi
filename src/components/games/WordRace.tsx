import React, { useEffect, useState } from 'react';

const words = ['SHIP', 'DOG', 'BALL', 'FISH', 'TREE', 'SUN', 'JUMP', 'BOOK', 'CUP'];

const WordRace: React.FC = () => {
  const [word, setWord] = useState('');
  const [shuffled, setShuffled] = useState<string[]>([]);
  const [userInput, setUserInput] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const user = localStorage.getItem('loggedInUser');

  useEffect(() => {
    startNewRound();
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [timer]);

  const startNewRound = () => {
    const newWord = words[Math.floor(Math.random() * words.length)];
    setWord(newWord);
    setShuffled(shuffleArray(newWord.split('')));
    setUserInput([]);
    setTimer(30);
  };

  const shuffleArray = (array: string[]) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const handleLetterClick = (letter: string, index: number) => {
    const newInput = [...userInput, letter];
    setUserInput(newInput);

    const newShuffled = [...shuffled];
    newShuffled.splice(index, 1);
    setShuffled(newShuffled);
  };

  const handleSubmit = () => {
    const userWord = userInput.join('');
    if (userWord === word) {
      const newScore = score + 1;
      setScore(newScore);

      if (user) {
        const existing = JSON.parse(localStorage.getItem(`progress_${user}`) || '{}');
        const updated = {
          ...existing,
          wordbuild_WordRace: Math.min(newScore, 5), // cap at 5
        };
        localStorage.setItem(`progress_${user}`, JSON.stringify(updated));
        window.dispatchEvent(new Event('progress-updated'));
      }

      startNewRound();
    } else {
      setUserInput([]);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 to-pink-100 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border-4 border-yellow-300 text-center">
        <h1 className="text-3xl font-bold text-pink-600 mb-2">
          🐾 Word Race 🐾
        </h1>
        <p className="text-lg text-gray-700 mb-4">Rearrange the letters to form the word!</p>

        <div className="flex justify-between items-center text-lg mb-4 px-2">
          <span className="text-blue-700 font-semibold">Score: {score}</span>
          <span className="text-orange-500 font-semibold">⏱ {timer}s</span>
        </div>

        <div className="min-h-[60px] bg-blue-100 rounded-lg flex items-center justify-center text-2xl font-bold text-blue-700 mb-4">
          {userInput.join('')}
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {shuffled.map((letter, index) => (
            <button
              key={index}
              onClick={() => handleLetterClick(letter, index)}
              className="bg-yellow-400 text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-yellow-500 transition duration-150"
            >
              {letter}
            </button>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="mt-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-2 rounded-full transition duration-200"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default WordRace;

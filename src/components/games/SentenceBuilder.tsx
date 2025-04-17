import React, { useState, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import { Shuffle } from 'lucide-react';

const sentences = [
  'The cat sleeps on the mat',
  'I like to read books',
  'The sun is very bright',
  'Birds fly in the sky',
  'She plays with her dog',
  'He runs in the park',
  'The fish swims in water',
  'We eat lunch together'
];

const SentenceBuilder = () => {
  const [currentSentence, setCurrentSentence] = useState('');
  const [words, setWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showOriginal, setShowOriginal] = useState(true);

  const generateNewSentence = () => {
    const sentence = sentences[Math.floor(Math.random() * sentences.length)];
    setCurrentSentence(sentence);
    setWords(sentence.split(' ').sort(() => Math.random() - 0.5));
    setShowOriginal(true);
    setFeedback('');

    setTimeout(() => {
      setShowOriginal(false);
    }, 3000);
  };

  const checkSentence = () => {
    const attempt = words.join(' ');
    if (attempt === currentSentence) {
      setScore(prev => prev + 1);
      setFeedback('Correct! 🎉');
      setTimeout(generateNewSentence, 2000);
    } else {
      setFeedback('Try again! 💪');
    }
  };

  useEffect(() => {
    generateNewSentence();
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold dyslexic-friendly mb-4">Sentence Builder</h2>
        <p className="text-xl text-gray-600 dyslexic-friendly">
          Remember and rebuild the sentence! 📝
        </p>
      </motion.div>

      <div className="bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <p className="text-2xl font-bold mb-4">Score: {score}</p>
          
          {showOriginal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-blue-50 p-4 rounded-xl mb-4"
            >
              <p className="text-xl font-bold text-blue-800">{currentSentence}</p>
              <p className="text-sm text-blue-600 mt-2">Remember this sentence!</p>
            </motion.div>
          )}
        </div>

        <Reorder.Group
          axis="y"
          values={words}
          onReorder={setWords}
          className="space-y-2"
        >
          {words.map((word) => (
            <Reorder.Item
              key={word}
              value={word}
              className="bg-purple-100 p-4 rounded-lg cursor-move text-center text-xl font-bold text-purple-800 hover:bg-purple-200 transition-colors"
            >
              {word}
            </Reorder.Item>
          ))}
        </Reorder.Group>

        <div className="mt-8 flex justify-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setWords([...words].sort(() => Math.random() - 0.5))}
            className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          >
            <Shuffle className="w-6 h-6 text-gray-600" />
          </motion.button>
          
          <button
            onClick={checkSentence}
            className="btn-primary"
          >
            Check Answer ✨
          </button>
        </div>

        {feedback && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mt-4 text-xl font-bold text-center ${
              feedback.includes('Correct') ? 'text-green-500' : 'text-orange-500'
            }`}
          >
            {feedback}
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default SentenceBuilder;
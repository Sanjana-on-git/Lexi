import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const AuthCard = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const nav = document.querySelector('nav');
    if (nav) nav.style.display = 'none';
    return () => {
      if (nav) nav.style.display = '';
    };
  }, []);

  const handleSubmit = () => {
    if (isLogin) {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (storedUser.email === email && storedUser.password === password) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('loggedInUser', storedUser.username || 'User');
        setTimeout(() => navigate('/home'), 500);
      } else {
        alert('Invalid credentials!');
      }
    } else {
      if (!username.trim()) {
        alert('Please enter a username');
        return;
      }

      const user = { email, password, username };
      localStorage.setItem('user', JSON.stringify(user));
      alert('Account created!');
      setIsLogin(true);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 to-pink-200 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-10"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? 'login' : 'signup'}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={formVariants}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-4xl font-extrabold text-center text-pink-600 font-[Comic Sans MS,cursive] mb-6">
              {isLogin ? '🚀 Log In to unlock confidence!' : '🎉 Create Your Account'}
            </h2>

            <div className="space-y-6">
              {!isLogin && (
                <input
                  className="w-full p-3 rounded-lg border-2 border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
              )}
              <input
                className="w-full p-3 rounded-lg border-2 border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <input
                className="w-full p-3 rounded-lg border-2 border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />

              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-pink-400 to-purple-500 text-white py-3 rounded-lg text-lg font-semibold hover:scale-105 transition-transform"
              >
                {isLogin ? 'Log In' : 'Sign Up'}
              </button>

              <p className="text-center text-gray-600">
                {isLogin ? 'Don’t have an account?' : 'Already have an account?'}{' '}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-pink-600 font-bold underline"
                >
                  {isLogin ? 'Sign Up' : 'Log In'}
                </button>
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AuthCard;

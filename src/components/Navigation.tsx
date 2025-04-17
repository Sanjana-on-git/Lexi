import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Brain, GamepadIcon, LineChart } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('loggedInUser');
    if (name) setUsername(name);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('isLoggedIn');
    navigate('/login', { replace: true });
    window.location.reload(); 
  };

  const isActive = (path: string) => {
    return location.pathname === path
      ? 'bg-pink-200 text-pink-800 shadow-md scale-105'
      : 'text-purple-600 hover:bg-yellow-100 hover:shadow-lg hover:scale-105';
  };

  return (
    <nav className="bg-gradient-to-r from-pink-100 via-yellow-100 to-purple-100 py-5 shadow-xl rounded-b-3xl">
      <div className="container mx-auto px-4 flex justify-between items-center">
        
        <div className="flex justify-center space-x-6">
          <Link
            to="/"
            className={`flex items-center space-x-2 px-6 py-3 rounded-full font-bold text-lg transition-all duration-300 ease-in-out transform ${isActive('/')}`}
          >
            <span className="animate-bounce">🏡</span>
            <span className="font-cursive">Home</span>
          </Link>
          <Link
            to="/games"
            className={`flex items-center space-x-2 px-6 py-3 rounded-full font-bold text-lg transition-all duration-300 ease-in-out transform ${isActive('/games')}`}
          >
            <span className="animate-bounce">🎮</span>
            <span className="font-cursive">Games</span>
          </Link>
          <Link
            to="/progress"
            className={`flex items-center space-x-2 px-6 py-3 rounded-full font-bold text-lg transition-all duration-300 ease-in-out transform ${isActive('/progress')}`}
          >
            <span className="animate-bounce">📈</span>
            <span className="font-cursive">Progress</span>
          </Link>
          <Link
            to="/BlogPage"
            className={`flex items-center space-x-2 px-6 py-3 rounded-full font-bold text-lg transition-all duration-300 ease-in-out transform ${isActive('/progress')}`}
          >
            <span className="animate-bounce">📝</span>
            <span className="font-cursive">Blog</span>
          </Link>
        </div>

        {username && (
          <div className="flex items-center space-x-4 text-sm font-semibold text-purple-700">
            <span className="font-cursive">👋 {username}</span>
            <button
              onClick={handleLogout}
              className="bg-pink-500 text-white px-3 py-1 rounded-full hover:bg-pink-600 transition"
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;

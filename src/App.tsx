import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import {HeartHandshake} from 'lucide-react';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Games from './pages/Games';
import Progress from './pages/Progress';
import BlogPage from './pages/BlogPage';
import AuthCard from './pages/AuthCard';
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
        <Navigation />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-8"
        >
          <Routes>            
            <Route path="/" element={<AuthCard />} />
            <Route path="/home" element={<Home />} />
            <Route path="/games" element={<Games />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/BlogPage" element={<BlogPage />} />    
            <Route path="/login" element={<AuthCard />} />
  
             </Routes>
        </motion.div>
      </div>
    </Router>
  );
}

export default App;
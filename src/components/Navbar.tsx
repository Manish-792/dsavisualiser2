import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Braces } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const html = document.querySelector('html');
    html?.classList.add('dark');
    localStorage.setItem('hs_theme', 'dark');
    setIsDark(true);
  }, []);

  const toggleDarkMode = () => {
    const html = document.querySelector('html');
    if (html?.classList.contains('dark')) {
      html.classList.remove('dark');
      html.classList.add('light');
      localStorage.setItem('hs_theme', 'light');
      setIsDark(false);
    } else {
      html?.classList.remove('light');
      html?.classList.add('dark');
      localStorage.setItem('hs_theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <nav className={`${isDark 
      ? 'bg-transparent backdrop-blur-lg border-b border-white/10 text-white' 
      : 'bg-indigo-100/70 backdrop-blur-lg border-b border-indigo-200 text-indigo-900 shadow-md'} z-20`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full">
              <Braces size={20} className="text-white" />
            </div>
            <span className="font-bold text-xl hidden sm:inline bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">DSA Visualizer</span>
            <span className="font-bold text-xl sm:hidden bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">DSA</span>
          </Link>

          {/* Nav Links & Dark Mode Toggle */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            {location.pathname !== '/' && (
              <Link
                to="/"
                className="px-4 py-2 text-base font-medium transition-all duration-300 hover:text-purple-300"
              >
                Home
              </Link>
            )}

            <Link
              to="/sorting"
              className="px-5 py-2 text-base font-medium rounded-full transition-all duration-300 hover:text-purple-300"
            >
              Sorting
            </Link>

            <Link
              to="/searching"
              className="px-5 py-2 text-base font-medium rounded-full transition-all duration-300 hover:text-purple-300"
            >
              Searching
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

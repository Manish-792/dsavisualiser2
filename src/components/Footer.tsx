import React from 'react';
import { Twitter, Linkedin, Github } from 'lucide-react';

// Discord logo as a custom component
const DiscordLogo: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.73 4.87c-1.53-.69-3.17-1.2-4.89-1.48c-.21.37-.4.77-.57 1.17c-1.82-.27-3.67-.27-5.49 0c-.17-.4-.36-.8-.57-1.17c-1.72.28-3.36.79-4.89 1.48C.97 8.89.14 12.84.7 16.72c1.71 1.26 3.65 2.25 5.71 2.92c.46-.62.87-1.28 1.22-1.98c-.67-.25-1.32-.56-1.94-.92c.16-.12.32-.24.47-.37c3.69 1.7 7.69 1.7 11.34 0c.15.13.31.25.47.37c-.62.36-1.27.67-1.94.92c.36.7.76 1.35 1.22 1.98c2.07-.67 4.01-1.66 5.71-2.92c.64-4.46-.39-8.38-2.52-11.85zM8.08 14.16c-1.11 0-2.03-1.03-2.03-2.28c0-1.25.91-2.28 2.03-2.28c1.12 0 2.04 1.02 2.03 2.28c0 1.25-.9 2.28-2.03 2.28zm7.5 0c-1.11 0-2.03-1.03-2.03-2.28c0-1.25.91-2.28 2.03-2.28c1.12 0 2.04 1.02 2.03 2.28c0 1.25-.9 2.28-2.03 2.28z" />
  </svg>
);

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const isDark = document.documentElement.classList.contains('dark');

  return (
    <footer className={`${isDark 
      ? 'bg-white/5 backdrop-blur-lg border-t border-white/10 text-gray-300' 
      : 'bg-indigo-100/70 backdrop-blur-lg border-t border-indigo-200 text-indigo-900 shadow-lg'} py-6`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <div className={`text-sm text-gray-700 dark:text-gray-400`}>
            © {currentYear} DSA Visualizer. All rights reserved.
          </div>

          {/* Social Media Links */}
          <div className="flex items-center space-x-6">
            <a 
              href="https://www.linkedin.com/in/manish-singh-a8446227b/?trk=public-profile-join-page" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`${isDark ? 'text-gray-700 dark:text-gray-400' : 'text-gray-700'} transform transition-all duration-300 hover:text-purple-600 dark:hover:text-purple-400 hover:scale-110`}
              aria-label="LinkedIn - Manish Singh"
            >
              <Linkedin size={20} />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`${isDark ? 'text-gray-700 dark:text-gray-400' : 'text-gray-700'} transform transition-all duration-300 hover:text-purple-600 dark:hover:text-purple-400 hover:scale-110`}
              aria-label="Twitter"
            >
              <Twitter size={20} />
            </a>
            <a 
              href="https://discordapp.com/users/noone5258" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`${isDark ? 'text-gray-700 dark:text-gray-400' : 'text-gray-700'} transform transition-all duration-300 hover:text-purple-600 dark:hover:text-purple-400 hover:scale-110`}
              aria-label="Discord - noone5258"
            >
              <DiscordLogo size={20} />
            </a>
            <a 
              href="https://github.com/Manish-792" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`${isDark ? 'text-gray-700 dark:text-gray-400' : 'text-gray-700'} transform transition-all duration-300 hover:text-purple-600 dark:hover:text-purple-400 hover:scale-110`}
              aria-label="GitHub - Manish-792"
            >
              <Github size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
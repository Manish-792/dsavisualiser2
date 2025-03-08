import React, { Suspense, useState, useEffect, ReactNode, ErrorInfo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SortingPage from './pages/SortingPage';
import SearchingPage from './pages/SearchingPage';

// Define error boundary props and state types
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// ErrorBoundary component for catching rendering errors
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("Error in component:", error, info);
  }
  
  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-100 text-red-700 rounded">
          <h2>Something went wrong.</h2>
          <p>{this.state.error?.message || "Unknown error"}</p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// Lazy load the Footer component to avoid blocking rendering
const Footer = React.lazy(() => import('./components/Footer'));

function App() {
  const [isFooterEnabled, setIsFooterEnabled] = useState(false);
  
  // Delay loading Footer to ensure main content renders first
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFooterEnabled(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Create a memoized isDark value for consistent rendering
  const isDark = document.documentElement.classList.contains('dark');

  useEffect(() => {
    const html = document.querySelector('html');
    html?.classList.add('dark');
    localStorage.setItem('hs_theme', 'dark');
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <div className="relative flex flex-col min-h-screen bg-indigo-50 dark:bg-[#0a0118] dark:text-white overflow-hidden">
          {/* Blurred gradient backgrounds */}
          <div className={`absolute top-[-10%] right-[20%] w-[300px] h-[300px] rounded-full ${isDark ? 'bg-purple-700/30' : 'bg-purple-200/60'} blur-[120px]`} />
          <div className={`absolute top-[40%] left-[10%] w-[350px] h-[350px] rounded-full ${isDark ? 'bg-indigo-700/20' : 'bg-indigo-200/60'} blur-[150px]`} />
          <div className={`absolute bottom-[5%] right-[15%] w-[250px] h-[250px] rounded-full ${isDark ? 'bg-purple-600/20' : 'bg-purple-100/50'} blur-[100px]`} />
          <div className={`absolute top-[10%] left-[35%] w-[200px] h-[200px] rounded-full ${isDark ? 'bg-indigo-600/20' : 'bg-indigo-100/50'} blur-[80px]`} />
          
          {/* Content wrapper */}
          <div className="relative z-10 flex flex-col min-h-screen">
            <ErrorBoundary>
              <Navbar />
            </ErrorBoundary>
            
            <div className="flex-grow mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-2 sm:py-4">
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/sorting" element={<SortingPage />} />
                  <Route path="/searching" element={<SearchingPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </ErrorBoundary>
            </div>
            
            {isFooterEnabled && (
              <Suspense fallback={<div className="h-16 bg-indigo-800"></div>}>
                <ErrorBoundary>
                  <Footer />
                </ErrorBoundary>
              </Suspense>
            )}
          </div>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
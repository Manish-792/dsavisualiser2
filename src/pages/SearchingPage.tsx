import React from 'react';
import ControlPanel from '../components/ControlPanel';
import { useVisualizerStore } from '../store/visualizerStore';
import SearchingVisualizer from '../components/SearchingVisualizer';

const SearchingPage: React.FC = () => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          <span className="bg-gradient-to-r from-purple-500 to-indigo-400 bg-clip-text text-transparent">
            Searching
          </span>{' '}
          Algorithms
        </h1>
        <p className="text-sm sm:text-base text-gray-400 mt-2">
          Visualize how different searching algorithms find elements in an array.
        </p>
      </header>
      
      <main className="space-y-4 sm:space-y-6">
        <SearchingVisualizer />
        <ControlPanel showOnlySearching={true} />
      </main>
    </div>
  );
}

export default SearchingPage;
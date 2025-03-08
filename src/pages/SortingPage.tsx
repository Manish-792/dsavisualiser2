import React from 'react';
import Visualizer from '../components/Visualizer';
import ControlPanel from '../components/ControlPanel';
import RaceMode from '../components/RaceMode';
import { useVisualizerStore } from '../store/visualizerStore';

const SortingPage: React.FC = () => {
  const { isRaceMode } = useVisualizerStore();

  return (
    <div className="space-y-4 sm:space-y-6">
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          <span className="bg-gradient-to-r from-purple-500 to-indigo-400 bg-clip-text text-transparent">
            Sorting
          </span>{' '}
          Algorithms
        </h1>
        <p className="text-sm sm:text-base text-gray-400 mt-2">
          Visualize and compare different sorting algorithms in action.
        </p>
      </header>
      
      <main className="space-y-4 sm:space-y-6">
        <Visualizer />
        <ControlPanel showOnlySorting={true} />
        {isRaceMode && <RaceMode />}
      </main>
    </div>
  );
}

export default SortingPage;
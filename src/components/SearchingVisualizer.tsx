import React, { useState, useEffect } from 'react';
import ArrayBar from './ArrayBar';
import { useVisualizerStore } from '../store/visualizerStore';

const SearchingVisualizer: React.FC = () => {
  const { 
    array,
    searchTarget,
    foundIndex,
    selectedAlgorithm,
    isPlaying,
    activeIndices,
    comparingIndices,
    sortedIndices
  } = useVisualizerStore();

  const [displayActiveIndices, setDisplayActiveIndices] = useState<number[]>([]);
  const [hasVisualizationRun, setHasVisualizationRun] = useState(false);

  // Track when visualization runs
  useEffect(() => {
    if (isPlaying) {
      setHasVisualizationRun(true);
    }
  }, [isPlaying]);

  // Reset the visualization run flag when search target changes
  useEffect(() => {
    setHasVisualizationRun(false);
  }, [searchTarget]);

  // Whenever activeIndices change, update displayActiveIndices only if there's a non-empty valid array,
  // or if the algorithm has finished playing, then clear it.
  useEffect(() => {
    const cleanActive = activeIndices.filter(idx => typeof idx === 'number');
    if (cleanActive.length > 0) {
      setDisplayActiveIndices(cleanActive);
    } else if (!isPlaying) {
      // When not playing, clear the displayed active indices.
      setDisplayActiveIndices([]);
    }
    // Otherwise, keep the previous value.
  }, [activeIndices, isPlaying]);

  const maxValue = Math.max(...array, 1);
  const barWidth = Math.max(8, Math.min(24, Math.floor(800 / array.length)));
  const isDark = document.documentElement.classList.contains('dark');

  const renderSearchStatus = () => {
    if (selectedAlgorithm?.type !== 'searching' || searchTarget === null) return null;

    // When not playing and target is found.
    if (!isPlaying && foundIndex !== -1 && searchTarget !== null) {
      return (
        <div className={`absolute top-4 left-4 z-20 ${isDark 
          ? 'bg-green-500/20 text-green-300 border-green-500/30' 
          : 'bg-green-100 text-green-700 border-green-200'} backdrop-blur-md border px-4 py-2 rounded-md shadow-[0_0_15px_rgba(34,197,94,0.3)]`}>
          🎉 Target {searchTarget} found at index {foundIndex}
        </div>
      );
    }
    
    // When not playing and target is not found - only after visualization has run
    if (!isPlaying && foundIndex === -1 && searchTarget !== null && hasVisualizationRun) {
      return (
        <div className={`absolute top-4 left-4 z-20 ${isDark 
          ? 'bg-red-500/20 text-red-300 border-red-500/30' 
          : 'bg-red-100 text-red-700 border-red-200'} backdrop-blur-md border px-4 py-2 rounded-md shadow-[0_0_15px_rgba(239,68,68,0.3)]`}>
          🔍 Target {searchTarget} not found in array
        </div>
      );
    }

    if (isPlaying) {
      if (selectedAlgorithm.id === 'binary-search') {
        const rangeStart = comparingIndices[0] !== undefined ? comparingIndices[0] : 0;
        const rangeEnd = comparingIndices[1] !== undefined ? comparingIndices[1] : array.length - 1;
        return (
          <div className={`absolute top-4 left-4 z-20 ${isDark 
            ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' 
            : 'bg-indigo-100 text-indigo-700 border-indigo-200'} backdrop-blur-md border px-4 py-2 rounded-md shadow-[0_0_15px_rgba(99,102,241,0.3)]`}>
            {`Searching in range [${rangeStart}, ${rangeEnd}]`}
          </div>
        );
      } else {
        return (
          <div className={`absolute top-4 left-4 z-20 ${isDark 
            ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' 
            : 'bg-indigo-100 text-indigo-700 border-indigo-200'} backdrop-blur-md border px-4 py-2 rounded-md shadow-[0_0_15px_rgba(99,102,241,0.3)]`}>
            {`Checking index ${displayActiveIndices.length > 0 ? displayActiveIndices.join(', ') : 'N/A'}`}
          </div>
        );
      }
    }

    return null;
  };

  return (
    <div className={`flex-1 ${isDark 
      ? 'bg-white/5' 
      : 'bg-indigo-100/70'} backdrop-blur-lg border ${isDark 
      ? 'border-white/10' 
      : 'border-indigo-200'} rounded-lg shadow-md min-h-[400px] relative`}>
      {renderSearchStatus()}
      <div className="flex items-end justify-center gap-1 p-4 h-full overflow-x-auto">
        <div className="flex items-end justify-center gap-1 min-h-[300px]">
          {array.map((value, index) => (
            <ArrayBar
              key={index}
              value={value}
              height={Math.max(20, (value / maxValue) * 280)}
              width={barWidth}
              isActive={activeIndices.includes(index)}
              isComparing={comparingIndices.includes(index)}
              isSorted={sortedIndices.has(index)}
              isTarget={value === searchTarget}
              isFound={index === foundIndex}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchingVisualizer;

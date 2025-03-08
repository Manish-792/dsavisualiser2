import React from 'react';
import ArrayBar from './ArrayBar';
import { useVisualizerStore } from '../store/visualizerStore';

const Visualizer: React.FC = () => {
  const { 
    array, 
    activeIndices, 
    comparingIndices, 
    sortedIndices,
    selectedAlgorithm,
    isPlaying
  } = useVisualizerStore();
  
  const maxValue = Math.max(...array, 1);
  const barWidth = Math.max(8, Math.min(24, Math.floor(800 / array.length)));
  const isDark = document.documentElement.classList.contains('dark');

  return (
    <div className={`flex-1 ${isDark 
      ? 'bg-white/5' 
      : 'bg-indigo-100/70'} backdrop-blur-lg border ${isDark 
      ? 'border-white/10' 
      : 'border-indigo-200'} rounded-lg shadow-md min-h-[400px] relative`}>
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
              isTarget={false}
              isFound={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Visualizer;
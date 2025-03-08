import React, { useEffect, useState } from 'react';
import { useVisualizerStore } from '../store/visualizerStore';
import { Trophy, Timer, Crown } from 'lucide-react';
import { ALGORITHMS } from '../types';


const RaceVisualizer: React.FC<{ 
  array: number[], 
  activeIndices: number[], 
  comparingIndices: number[], 
  sortedIndices: number[],
  algorithmId: string,
  progress: number
}> = ({ array, activeIndices, comparingIndices, sortedIndices, algorithmId, progress }) => {
  const maxValue = Math.max(...array, 1);
  const algorithm = ALGORITHMS.find(a => a.id === algorithmId);
  const barWidth = Math.max(4, Math.min(12, Math.floor(400 / array.length)));
  const isDark = document.documentElement.classList.contains('dark');

  return (
    <div className={`${isDark 
      ? 'bg-white/5' 
      : 'bg-indigo-100/70'} backdrop-blur-lg border ${isDark 
      ? 'border-white/10' 
      : 'border-indigo-200'} p-4 rounded-lg shadow-md mb-4 relative overflow-hidden`}>
      {/* Algorithm name with animated pulse effect when active */}
      <h3 className={`text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-indigo-900'} flex items-center gap-2`}>
        {algorithm?.name}
        {progress > 0 && progress < 100 && (
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
          </span>
        )}
      </h3>

      {/* Progress indicator with enhanced styling */}
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-indigo-900'}`}>
            {algorithm?.name}
          </span>
          <span className={`text-sm font-semibold ${
            progress >= 100 
              ? 'text-green-500 dark:text-green-400' 
              : isDark ? 'text-gray-400' : 'text-indigo-700'
          }`}>
            {progress.toFixed(1)}%
          </span>
        </div>
        <div className={`h-4 ${isDark ? 'bg-gray-800' : 'bg-indigo-200'} rounded-full overflow-hidden mt-1 shadow-inner relative`}>
          {/* Pulsing effect to show active sorting */}
          {progress > 0 && progress < 100 && (
            <div className="absolute inset-0 opacity-30 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse"></div>
          )}
          
          {/* Main progress bar */}
          <div
            className={`h-full transition-all duration-300 ${
              progress >= 100 
                ? 'bg-gradient-to-r from-green-500 to-green-400' 
                : 'bg-gradient-to-r from-purple-600 to-indigo-500'
            }`}
            style={{ width: `${progress}%` }}
          >
            {/* Add a small moving highlight for better visual feedback */}
            {progress > 0 && progress < 100 && (
              <div className="absolute h-full w-20 bg-white/20 -skew-x-[30deg] animate-shimmer"></div>
            )}
          </div>
        </div>
        
        {/* Performance metrics */}
        <div className="mt-2 text-xs flex justify-between items-center">
          <span className={isDark ? 'text-gray-400' : 'text-indigo-700'}>
            Elements: {array.length}
          </span>
          <span className={isDark ? 'text-gray-400' : 'text-indigo-700'}>
            Complexity: {algorithm?.timeComplexity || 'O(n log n)'}
          </span>
        </div>
      </div>
    </div>
  );
};

const RaceMode: React.FC = () => {
  const { 
    raceParticipants, 
    raceHistory, 
    isPlaying,
    array: originalArray
  } = useVisualizerStore();
  
  const [raceArrays, setRaceArrays] = useState<{
    [key: string]: {
      array: number[],
      activeIndices: number[],
      comparingIndices: number[],
      sortedIndices: number[]
    }
  }>({});
  const isDark = document.documentElement.classList.contains('dark');

  // Initialize race arrays
  useEffect(() => {
    if (raceParticipants.length > 0) {
      const initialRaceArrays: any = {};
      raceParticipants.slice(0, 2).forEach(participant => {
        initialRaceArrays[participant.algorithm.id] = {
          array: [...originalArray],
          activeIndices: [],
          comparingIndices: [],
          sortedIndices: []
        };
      });
      setRaceArrays(initialRaceArrays);
    }
  }, [raceParticipants, originalArray]);

  // Update race arrays based on progress
  useEffect(() => {
    if (raceParticipants.length > 0) {
      const updatedRaceArrays = { ...raceArrays };
      
      raceParticipants.slice(0, 2).forEach(participant => {
        // Initialize if not already done
        if (!updatedRaceArrays[participant.algorithm.id]) {
          updatedRaceArrays[participant.algorithm.id] = {
            array: [...originalArray],
            activeIndices: participant.activeIndices || [],
            comparingIndices: participant.comparingIndices || [],
            sortedIndices: participant.sortedIndices || []
          };
        } else {
          // Update with latest data from store
          updatedRaceArrays[participant.algorithm.id] = {
            array: updatedRaceArrays[participant.algorithm.id].array,  // Keep the current array
            activeIndices: participant.activeIndices || [],
            comparingIndices: participant.comparingIndices || [],
            sortedIndices: participant.sortedIndices || []
          };
        }

        // For completed algorithms, ensure array is fully sorted
        if (participant.progress >= 100) {
          const sortedArray = [...originalArray].sort((a, b) => a - b);
          updatedRaceArrays[participant.algorithm.id].array = sortedArray;
          updatedRaceArrays[participant.algorithm.id].sortedIndices = 
            Array.from({ length: sortedArray.length }, (_, i) => i);
        }
      });
      
      setRaceArrays(updatedRaceArrays);
    }
  }, [raceParticipants, originalArray]);

  return (
    <div className="space-y-6">
      <div className={`${isDark 
        ? 'bg-white/5' 
        : 'bg-indigo-100/70'} backdrop-blur-lg border ${isDark 
        ? 'border-white/10' 
        : 'border-indigo-200'} p-6 rounded-lg shadow-md`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-indigo-900'} flex items-center gap-2`}>
            <Trophy className="text-yellow-500" />
            Algorithm Race
          </h2>
          <div className="flex items-center gap-2">
            <Timer size={20} className={isDark ? 'text-gray-400' : 'text-indigo-700'} />
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-indigo-700'}`}>Real-time Progress</span>
          </div>
        </div>

        {/* Display information about real-time visualization */}
        {isPlaying && raceParticipants.length > 0 && (
          <div className={`mb-4 p-3 rounded-md ${isDark ? 'bg-indigo-600/10' : 'bg-indigo-100'} border ${isDark ? 'border-indigo-500/30' : 'border-indigo-200'}`}>
            <div className="flex items-center gap-2 text-sm">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
              </span>
              <span className={isDark ? 'text-indigo-300' : 'text-indigo-700'}>
                Visualizing algorithms in real-time. Watch as each algorithm sorts the array with its unique approach.
              </span>
            </div>
          </div>
        )}

        {/* Race Visualizers with head-to-head comparison */}
        <div className="mb-6">
          {raceParticipants.slice(0, 2).map((participant) => (
            <RaceVisualizer
              key={participant.algorithm.id}
              array={raceArrays[participant.algorithm.id]?.array || [...originalArray]}
              activeIndices={raceArrays[participant.algorithm.id]?.activeIndices || []}
              comparingIndices={raceArrays[participant.algorithm.id]?.comparingIndices || []}
              sortedIndices={raceArrays[participant.algorithm.id]?.sortedIndices || []}
              algorithmId={participant.algorithm.id}
              progress={participant.progress}
            />
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      {raceHistory.length > 0 && (
        <div className={`${isDark 
          ? 'bg-white/5' 
          : 'bg-indigo-100/70'} backdrop-blur-lg border ${isDark 
          ? 'border-white/10' 
          : 'border-indigo-200'} p-6 rounded-lg shadow-md`}>
          <div className="flex items-center gap-2 mb-4">
            <Crown className="text-yellow-500" />
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-indigo-900'}`}>Leaderboard</h2>
          </div>

          <div className="space-y-4">
            {raceHistory.map((race, index) => (
              <div key={index} className={`border-b ${isDark ? 'border-white/10' : 'border-indigo-200'} pb-4`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-indigo-700'}`}>
                    {new Date(race.date).toLocaleDateString()} - Array Size: {race.arraySize}
                  </span>
                </div>
                <div className="space-y-2">
                  {race.results.map((result) => {
                    const algorithm = ALGORITHMS.find(a => a.id === result.algorithmId);
                    return algorithm ? (
                      <div key={result.algorithmId} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {result.rank === 1 && (
                            <Trophy size={16} className="text-yellow-500" />
                          )}
                          <span className={`${
                            result.rank === 1 
                              ? `font-semibold ${isDark ? 'text-white' : 'text-indigo-900'}` 
                              : isDark ? 'text-gray-300' : 'text-indigo-700'
                          }`}>
                            {algorithm.name}
                          </span>
                        </div>
                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-indigo-700'}`}>
                          {result.executionTime.toFixed(2)}ms
                        </span>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RaceMode;

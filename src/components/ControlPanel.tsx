import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Settings, Zap, AlertCircle, Square, Upload } from 'lucide-react';
import {
  useVisualizerStore,
  addAlgorithmToRace,
  removeAlgorithmFromRace,
} from '../store/visualizerStore';
import { ALGORITHMS } from '../types';

interface ControlPanelProps {
  showOnlySorting?: boolean;
  showOnlySearching?: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  showOnlySorting = false,
  showOnlySearching = false,
}) => {
  const {
    isPlaying,
    isPaused,
    speed,
    selectedAlgorithm,
    isRaceMode,
    raceParticipants,
    error,
    array,
    startRace,
    startSorting,
    togglePause,
    setSpeed,
    setSearchTarget,
    resetState,
    stopVisualization,
    setCustomArray,
    setArraySize,
  } = useVisualizerStore();

  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [customArrayInput, setCustomArrayInput] = useState('');
  const [showCustomArrayInput, setShowCustomArrayInput] = useState(false);
  const [arraySize, setArraySizeLocal] = useState(20);
  
  const isDark = document.documentElement.classList.contains('dark');

  useEffect(() => {
    if (inputValue) {
      setSearchTarget?.(Number(inputValue));
    }
  }, [inputValue]);

  const toggleRaceMode = () => {
    if (!showOnlySearching) {
      useVisualizerStore.setState((state) => ({ 
        isRaceMode: !state.isRaceMode,
        error: null,
        // Clear race participants when toggling race mode off
        raceParticipants: !state.isRaceMode ? [] : state.raceParticipants
      }));
    }
  };

  const handlePlayPause = () => {
    if (!isPlaying) {
      const { array } = useVisualizerStore.getState();
      
      if (isRaceMode && selectedAlgorithm?.type === 'searching') {
        useVisualizerStore.setState({ error: 'Disable race mode first to visualize searching algorithms' });
        return;
      }
      
      if (selectedAlgorithm?.type === 'searching') {
        if (!inputValue) {
          useVisualizerStore.setState({ error: 'Please enter a search target value' });
          return;
        }
        if (array.length === 0) {
          useVisualizerStore.setState({ error: 'Generate an array first' });
          return;
        }
        if (selectedAlgorithm.id === 'binary-search') {
          const isSorted = array.every((val, i, arr) => 
            i === 0 || val >= arr[i - 1]
          );
          if (!isSorted) {
            useVisualizerStore.setState({ error: 'Array must be sorted for Binary Search' });
            return;
          }
        }
      }
      
      if (isRaceMode) {
        if (raceParticipants.length < 2) {
          useVisualizerStore.setState({ error: 'Select exactly two algorithms for the race' });
          return;
        }
        startRace?.();
      } else {
        startSorting?.();
      }
    } else {
      togglePause?.();
    }
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSpeed = Number(e.target.value);
    setSpeed?.(newSpeed);
  };

  const handleArraySizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = Number(e.target.value);
    setArraySizeLocal(newSize);
    setArraySize?.(newSize);
  };

  const filteredAlgorithms = ALGORITHMS.filter(algo => {
    if (showOnlySorting) return algo.type === 'sorting';
    if (showOnlySearching) return algo.type === 'searching';
    return true;
  });

  const handleAlgorithmClick = (algorithm: typeof ALGORITHMS[0]) => {
    if (isRaceMode && !showOnlySearching) {
      const isParticipant = raceParticipants.some(
        (p) => p.algorithm.id === algorithm.id
      );
      if (isParticipant) {
        removeAlgorithmFromRace(algorithm.id);
      } else {
        addAlgorithmToRace(algorithm);
      }
    } else {
      useVisualizerStore.setState({ 
        selectedAlgorithm: algorithm,
        error: null
      });
      if (algorithm.type === 'searching') {
        setInputVisible(true);
      } else {
        setInputVisible(false);
        setInputValue('');
        setSearchTarget?.(null);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    useVisualizerStore.setState({ error: null });
  };

  const handleCustomArrayInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomArrayInput(e.target.value);
    useVisualizerStore.setState({ error: null });
  };

  const applyCustomArray = () => {
    try {
      // Parse the input - accept comma-separated or space-separated values
      const parsedInput = customArrayInput
        .replace(/\s+/g, ',') // Replace any whitespace with commas
        .split(',')
        .filter(item => item.trim() !== '')
        .map(item => {
          const num = Number(item.trim());
          if (isNaN(num)) {
            throw new Error(`Invalid number: ${item}`);
          }
          return num;
        });
      
      if (parsedInput.length === 0) {
        useVisualizerStore.setState({ error: 'Please enter at least one number' });
        return;
      }

      if (parsedInput.length > 50) {
        useVisualizerStore.setState({ error: 'Maximum array size is 50 elements' });
        return;
      }

      setCustomArray?.(parsedInput);
      setShowCustomArrayInput(false);
      useVisualizerStore.setState({ error: null });
    } catch (error) {
      useVisualizerStore.setState({ 
        error: error instanceof Error ? error.message : 'Invalid input format' 
      });
    }
  };

  return (
    <div className={`flex flex-col gap-4 ${isDark 
      ? 'bg-white/5 text-white' 
      : 'bg-indigo-100/80 text-indigo-900'} backdrop-blur-lg border ${isDark 
      ? 'border-white/10' 
      : 'border-indigo-200'} p-6 rounded-lg shadow-md`}>
      {error && (
        <div className="bg-red-500/10 backdrop-blur-md border border-red-500/30 rounded-md p-3 flex items-center gap-2 text-red-300">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Controls Section */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Play/Pause Button */}
        <button
          onClick={handlePlayPause}
          disabled={!isPlaying && !selectedAlgorithm && !isRaceMode}
          className={`
            flex items-center gap-2 py-2 px-4 rounded-md 
            ${
              isPlaying
                ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-200
          `}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          {isPlaying ? 'Pause' : 'Play'}
        </button>

        {/* Reset Button */}
        <button
          onClick={() => {
            resetState?.();
            stopVisualization?.();
          }}
          disabled={isPlaying}
          className="
            flex items-center gap-2 py-2 px-4 rounded-md
            bg-white/10 hover:bg-white/20
            text-white
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-200
          "
        >
          <RotateCcw size={18} />
          Reset
        </button>

        {/* Stop Button - Only visible during playing */}
        {isPlaying && (
          <button
            onClick={stopVisualization}
            className="
              flex items-center gap-2 py-2 px-4 rounded-md
              bg-red-500/80 hover:bg-red-600/80
              text-white
              transition-colors duration-200
            "
          >
            <Square size={18} />
            Stop
          </button>
        )}

        {!showOnlySearching && (
          <button
            onClick={toggleRaceMode}
            disabled={isPlaying}
            className={`
              flex items-center gap-2 py-2 px-4 rounded-md
              ${
                isRaceMode
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200
            `}
          >
            <Zap size={18} />
            {isRaceMode ? 'Disable Race Mode' : 'Enable Race Mode'}
          </button>
        )}
      </div>

      {/* Settings Section */}
      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
        {/* Search Target Input - Only for Searching Algorithms */}
        {selectedAlgorithm?.type === 'searching' && (
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-300 mb-1">
              Search Target
            </label>
            <div className="relative">
              <input
                type="number"
                value={inputValue}
                onChange={handleInputChange}
                disabled={isPlaying}
                placeholder="Enter number to search"
                className="
                  w-full py-2 px-3 rounded-md
                  bg-white/5 border border-white/10
                  text-white placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-purple-500
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              />
            </div>
          </div>
        )}

        {/* Speed Control */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-300 mb-1 flex items-center">
            <span className="mr-1">Speed: {speed}x</span>
            {isPlaying && (
              <span className="text-xs bg-purple-500/30 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30 animate-pulse">
                Adjustable in real-time
              </span>
            )}
          </label>
          <input
            type="range"
            min="1"
            max="200"
            value={speed}
            onChange={handleSpeedChange}
            className={`
              w-full h-2
              bg-white/10
              rounded-lg
              appearance-none
              cursor-pointer
              accent-purple-500
              ${isPlaying ? 'ring-2 ring-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.3)]' : ''}
              transition-all duration-200
            `}
          />
          <div className="flex justify-between mt-1 text-xs text-gray-400">
            <span>Slower</span>
            <span>Faster</span>
          </div>
        </div>

        {/* Array Size Control - Not for Race Mode */}
        {!isRaceMode && (
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-300 mb-1">
              Array Size: {arraySize}
            </label>
            <input
              type="range"
              min="5"
              max="50"
              value={arraySize}
              onChange={handleArraySizeChange}
              disabled={isPlaying}
              className="
                w-full h-2
                bg-white/10
                rounded-lg
                appearance-none
                cursor-pointer
                accent-purple-500
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            />
          </div>
        )}

        {/* Custom Array Input Toggle */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-300 mb-1">
            Custom Array
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowCustomArrayInput(!showCustomArrayInput);
                useVisualizerStore.setState({ error: null });
              }}
              disabled={isPlaying}
              className="
                flex-1 flex items-center justify-center gap-2 
                py-2 px-4 rounded-md
                bg-white/10 hover:bg-white/20
                text-white
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-200
              "
            >
              <Upload size={16} />
              {showCustomArrayInput ? 'Cancel' : 'Create Custom Array'}
            </button>
          </div>
        </div>
      </div>

      {/* Custom Array Input */}
      {showCustomArrayInput && (
        <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-md">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Enter custom array values (comma or space separated)
          </label>
          <textarea
            value={customArrayInput}
            onChange={handleCustomArrayInputChange}
            disabled={isPlaying}
            rows={3}
            className="
              w-full p-3 rounded-md 
              bg-white/5 border border-white/10
              text-white
              focus:outline-none focus:ring-2 focus:ring-purple-500
              disabled:opacity-50 disabled:cursor-not-allowed
            "
            placeholder="e.g. 5, 3, 9, 1, 7"
          />
          <div className="mt-2 flex justify-end">
            <button
              onClick={applyCustomArray}
              disabled={isPlaying}
              className="
                py-2 px-4 rounded-md
                bg-gradient-to-r from-purple-600 to-indigo-600 
                hover:from-purple-700 hover:to-indigo-700
                text-white
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-200
              "
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Algorithm Selection */}
      <div className="mt-2">
        <h3 className="text-lg font-semibold text-white mb-2">
          Select Algorithm
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {ALGORITHMS.filter(
            algo =>
              (!showOnlySorting && !showOnlySearching) ||
              (showOnlySorting && algo.type === 'sorting') ||
              (showOnlySearching && algo.type === 'searching')
          ).map(algorithm => (
            <button
              key={algorithm.id}
              onClick={() => handleAlgorithmClick(algorithm)}
              disabled={isPlaying && !isRaceMode}
              className={`
                py-2 px-3 rounded-md text-left text-sm
                ${
                  selectedAlgorithm?.id === algorithm.id
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }
                ${
                  isRaceMode && raceParticipants.some(p => p.algorithm.id === algorithm.id)
                    ? 'border-2 border-yellow-500'
                    : ''
                }
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-200
              `}
            >
              {algorithm.name}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Algorithm Info */}
      {selectedAlgorithm && !isRaceMode && (
        <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-md">
          <h4 className="font-semibold text-white">
            {selectedAlgorithm.name}
          </h4>
          <p className="text-sm text-gray-300 mt-1">
            {selectedAlgorithm.description}
          </p>
          <div className="mt-2 flex gap-4 text-sm text-gray-400">
            <span>Time: {selectedAlgorithm.timeComplexity}</span>
            <span>Space: {selectedAlgorithm.spaceComplexity}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlPanel;
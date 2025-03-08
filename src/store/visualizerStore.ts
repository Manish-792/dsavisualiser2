import { create } from 'zustand';
import { VisualizerState, ALGORITHMS } from '../types';
import * as algorithms from '../algorithms';

const generateRandomArray = (length: number, sorted: boolean = false): number[] => {
  const arr = Array.from({ length }, () => Math.floor(Math.random() * 100) + 1);
  return sorted ? arr.sort((a, b) => a - b) : arr;
};

const store = create<VisualizerState>((set, get) => ({
  array: generateRandomArray(20),
  currentStep: 0,
  isPlaying: false,
  isPaused: false,
  speed: 100,
  selectedAlgorithm: null,
  isRaceMode: false,
  raceParticipants: [],
  raceHistory: [],
  activeIndices: [],
  comparingIndices: [],
  sortedIndices: new Set<number>(),
  searchTarget: null,
  foundIndex: -1,
  error: null,
  currentIndex: -1,
  searchRange: null,

  setSearchTarget: (target: number | null) => {
    set({ searchTarget: target });
  },

  togglePause: () => {
    set((state) => ({ isPaused: !state.isPaused }));
  },

  setSpeed: (speed: number) => {
    set({ speed });
  },

  setArraySize: (size: number) => {
    const shouldBeSorted = get().selectedAlgorithm?.id === 'binary-search';
    set({
      array: generateRandomArray(size, shouldBeSorted),
      activeIndices: [],
      comparingIndices: [],
      sortedIndices: new Set(),
      foundIndex: -1,
      currentIndex: -1,
      searchRange: null,
      error: null
    });
  },

  setCustomArray: (customArray: number[]) => {
    const shouldBeSorted = get().selectedAlgorithm?.id === 'binary-search';
    set({
      array: shouldBeSorted ? [...customArray].sort((a, b) => a - b) : customArray,
      activeIndices: [],
      comparingIndices: [],
      sortedIndices: new Set(),
      foundIndex: -1,
      currentIndex: -1,
      searchRange: null,
      error: null
    });
  },

  stopVisualization: () => {
    set({
      isPlaying: false,
      isPaused: false,
      activeIndices: [],
      comparingIndices: [],
      sortedIndices: new Set(),
      foundIndex: -1,
      currentIndex: -1,
      searchRange: null,
      error: null
    });
  },

  resetState: () => {
    const shouldBeSorted = get().selectedAlgorithm?.id === 'binary-search';
    const currentArraySize = get().array.length;
    set({
      array: generateRandomArray(currentArraySize, shouldBeSorted),
      isPlaying: false,
      isPaused: false,
      activeIndices: [],
      comparingIndices: [],
      sortedIndices: new Set(),
      foundIndex: -1,
      currentIndex: -1,
      searchRange: null,
      error: null
    });
  },

  startSorting: async () => {
    const state = get();
    if (!state.selectedAlgorithm) {
      set({ error: 'No algorithm selected' });
      return;
    }

    // Check if race mode is active and trying to run a search algorithm
    if (state.isRaceMode && state.selectedAlgorithm.type === 'searching') {
      set({ error: 'Disable race mode first to visualize searching algorithms' });
      return;
    }


    // Reset state before starting
    set({ 
      isPlaying: true, 
      isPaused: false,
      activeIndices: [], 
      comparingIndices: [], 
      sortedIndices: new Set(),
      foundIndex: -1,
      currentIndex: -1,
      searchRange: null,
      error: null
    });

    // Create a new array copy for visualization
    const arrayCopy = [...state.array];
    // Store the current visualization ID to prevent overlapping
    const currentVisualizationId = Date.now();
    let isCurrentVisualization = true;

    // Function to check if this visualization should continue
    const shouldContinueVisualization = () => {
      const currentState = get();
      return currentState.isPlaying && isCurrentVisualization;
    };

    if (state.selectedAlgorithm.type === 'searching') {
      if (state.searchTarget === null) {
        set({ error: 'Please enter a search target value' });
        return;
      }
      
      if (state.selectedAlgorithm.id === 'binary-search') {
        const isSorted = arrayCopy.every((val, i, arr) => 
          i === 0 || val >= arr[i - 1]
        );
        
        if (!isSorted) {
          set({ error: 'Array must be sorted for binary search. Use the reset button to sort the array' });
          return;
        }
      }
    }

    const waitForResume = async () => {
      while (get().isPaused && shouldContinueVisualization()) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return shouldContinueVisualization();
    };

    try {
      const algorithmId = state.selectedAlgorithm.id.replace(/-/g, '');
      const algorithmFunction = (algorithms as any)[algorithmId];

      if (!algorithmFunction) {
        set({ error: `Algorithm ${state.selectedAlgorithm.id} not implemented` });
        return;
      }

      // Update the store's unsubscribe function
      const unsubscribe = store.subscribe((newState) => {
        if (!newState.isPlaying) {
          isCurrentVisualization = false;
        }
      });

      if (state.selectedAlgorithm.type === 'searching') {
        const foundIndex = await algorithmFunction(
          arrayCopy,
          state.searchTarget,
          async (progress: number, activeIdx: number[] = [], comparingIdx: number[] = [], sortedIdx: number[] = []) => {
            if (!shouldContinueVisualization()) return false;
            const shouldContinue = await waitForResume();
            if (!shouldContinue) return false;
            
            // Update search-specific visualization states
            set({
              activeIndices: activeIdx,
              comparingIndices: comparingIdx,
              sortedIndices: new Set(sortedIdx),
              currentIndex: activeIdx[0] !== undefined ? activeIdx[0] : -1,
              searchRange: comparingIdx.length === 2 ? { start: comparingIdx[0], end: comparingIdx[1] } : null
            });
            
            return true;
          },
          () => get().speed
        );

        unsubscribe();

        if (shouldContinueVisualization()) {
          set({ 
            foundIndex,
            isPlaying: false,
            isPaused: false,
            activeIndices: foundIndex !== -1 ? [foundIndex] : [],
            comparingIndices: [],
            sortedIndices: new Set(),
            currentIndex: foundIndex,
            searchRange: null,
            error: null
          });
        }
      } else {
        await algorithmFunction(
          arrayCopy,
          async (progress: number, activeIdx: number[] = [], comparingIdx: number[] = [], sortedIdx: number[] = []) => {
            if (!shouldContinueVisualization()) return false;
            const shouldContinue = await waitForResume();
            if (!shouldContinue) return false;
            set({
              array: [...arrayCopy],
              activeIndices: activeIdx,
              comparingIndices: comparingIdx,
              sortedIndices: new Set(sortedIdx)
            });
            return true;
          },
          () => get().speed
        );
        
        unsubscribe();

        if (shouldContinueVisualization()) {
          set({
            array: arrayCopy,
            isPlaying: false,
            isPaused: false,
            activeIndices: [],
            comparingIndices: [],
            sortedIndices: new Set(Array.from({ length: arrayCopy.length }, (_, i) => i)),
            error: null
          });
        }
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during algorithm execution';
      console.error('Error during algorithm execution:', errorMessage);
      set({ 
        isPlaying: false, 
        isPaused: false,
        foundIndex: -1,
        activeIndices: [],
        comparingIndices: [],
        sortedIndices: new Set(),
        currentIndex: -1,
        searchRange: null,
        error: errorMessage
      });
    }
  },

  startRace: async () => {
    const { array, raceParticipants } = get();

    // Limit race to only 2 algorithms
    const limitedParticipants = raceParticipants.slice(0, 2);
    
    if (limitedParticipants.length !== 2) {
      set({ error: 'Select exactly two algorithms for the race' });
      return;
    }

    // Check if any race participants are search algorithms
    if (limitedParticipants.some(p => p.algorithm.type === 'searching')) {
      set({ error: 'Race mode only supports sorting algorithms' });
      return;
    }
    
    // Start the race
    set({ 
      isPlaying: true,
      isPaused: false,
      error: null,
      raceParticipants: limitedParticipants.map(p => ({ 
        ...p, 
        progress: 0, 
        completed: false,
        activeIndices: [],
        comparingIndices: [],
        sortedIndices: []
      }))
    });

    const currentRaceId = Date.now();
    let isCurrentRace = true;
    
    const shouldContinueRace = () => {
      const currentState = get();
      return currentState.isPlaying && isCurrentRace;
    };

    // Create a separate copy of the array for each algorithm
    const raceArrays = {};
    limitedParticipants.forEach(participant => {
      raceArrays[participant.algorithm.id] = [...array];
    });

    // Run each algorithm in parallel with detailed tracking
    const races = limitedParticipants.map(async (participant) => {
      const startTime = performance.now();
      const algorithmId = participant.algorithm.id.replace(/-/g, '');
      const algorithmFunction = (algorithms as any)[algorithmId];
      
      if (!algorithmFunction) {
        return {
          algorithmId: participant.algorithm.id,
          completed: false,
          error: `Algorithm ${participant.algorithm.id} not implemented`
        };
      }

      // Track active and comparing indices for visualization
      let activeIndices: number[] = [];
      let comparingIndices: number[] = [];
      let sortedIndices: number[] = [];
      let currentProgress = 0;

      try {
        await algorithmFunction(
          raceArrays[participant.algorithm.id],
          async (progress: number, activeIdx: number[] = [], comparingIdx: number[] = [], sortedIdx: number[] = []) => {
            if (!shouldContinueRace()) return false;
            
            // Store the current algorithm state for visualization
            activeIndices = activeIdx;
            comparingIndices = comparingIdx;
            sortedIndices = sortedIdx;
            currentProgress = progress;
            
            // Update race participant progress with the current state of sorting
            set({
              raceParticipants: get().raceParticipants.map((p) =>
                p.algorithm.id === participant.algorithm.id
                  ? { 
                      ...p, 
                      progress, 
                      activeIndices, 
                      comparingIndices, 
                      sortedIndices,
                      completed: progress >= 100
                    }
                  : p
              )
            });
            
            // Add a small delay to ensure UI updates and algorithms don't run too fast
            await new Promise(resolve => setTimeout(resolve, 15));
            return shouldContinueRace();
          },
          () => get().speed // Pass the current speed setting
        );

        const endTime = performance.now();
        
        return {
          algorithmId: participant.algorithm.id,
          executionTime: endTime - startTime,
          completed: true,
          rank: 0 // Will be set after all algorithms complete
        };
      } catch (error) {
        console.error(`Error in ${participant.algorithm.id}:`, error);
        return {
          algorithmId: participant.algorithm.id,
          completed: false,
          error: error instanceof Error ? error.message : String(error)
        };
      }
    });

    try {
      const completedRaces = await Promise.all(races);
      completedRaces.sort((a, b) => (a.executionTime || 0) - (b.executionTime || 0));
      
      if (shouldContinueRace()) {
        set((state) => ({
          isPlaying: false,
          raceHistory: [
            {
              date: new Date().toISOString(),
              arraySize: array.length,
              results: completedRaces.map((r, index) => ({
                algorithmId: r.algorithmId,
                executionTime: r.executionTime || 0,
                rank: index + 1,
              })),
            },
            ...state.raceHistory,
          ],
          error: null
        }));
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during race execution';
      console.error('Error during race execution:', errorMessage);
      set({ 
        isPlaying: false,
        error: errorMessage 
      });
    }
  },
}));

export const useVisualizerStore = store;

export const addAlgorithmToRace = (algorithm: typeof ALGORITHMS[0]) => {
  // Don't allow adding search algorithms to race
  if (algorithm.type === 'searching') {
    store.setState({ error: 'Race mode only supports sorting algorithms' });
    return;
  }

  store.setState((state) => {
    // Only allow up to 2 algorithms in race mode
    if (state.raceParticipants.length >= 2) {
      return {
        raceParticipants: [
          ...state.raceParticipants.slice(0, 1),
          { 
            algorithm, 
            progress: 0, 
            completed: false,
            activeIndices: [],
            comparingIndices: [],
            sortedIndices: []
          }
        ],
        error: null
      };
    }
    
    return {
      raceParticipants: [
        ...state.raceParticipants,
        { 
          algorithm, 
          progress: 0, 
          completed: false,
          activeIndices: [],
          comparingIndices: [],
          sortedIndices: []
        }
      ],
      error: null
    };
  });
};

export const removeAlgorithmFromRace = (algorithmId: string) => {
  store.setState((state) => ({
    raceParticipants: state.raceParticipants.filter(
      (p) => p.algorithm.id !== algorithmId
    ),
    error: null
  }));
};

export const updateRaceProgress = (algorithmId: string, progress: number) => {
  store.setState((state) => ({
    raceParticipants: state.raceParticipants.map((p) =>
      p.algorithm.id === algorithmId ? { ...p, progress } : p
    )
  }));
};

export interface RaceParticipant {
  algorithm: typeof ALGORITHMS[0];
  progress: number;
  completed: boolean;
  activeIndices?: number[];
  comparingIndices?: number[];
  sortedIndices?: number[];
}
export type AlgorithmType = 'sorting' | 'searching';

export interface Algorithm {
  id: string;
  name: string;
  type: AlgorithmType;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
}

export interface RaceParticipant {
  algorithm: Algorithm;
  progress: number;
  completed: boolean;
  executionTime?: number;
  activeIndices?: number[];
  comparingIndices?: number[];
  sortedIndices?: number[];
}

export interface VisualizerState {
  array: number[];
  currentStep: number;
  isPlaying: boolean;
  isPaused: boolean;
  speed: number;
  selectedAlgorithm: Algorithm | null;
  isRaceMode: boolean;
  raceParticipants: RaceParticipant[];
  raceHistory: {
    date: string;
    arraySize: number;
    results: {
      algorithmId: string;
      executionTime: number;
      rank: number;
    }[];
  }[];
  activeIndices: number[];
  comparingIndices: number[];
  sortedIndices: Set<number>;
  searchTarget: number | null;
  foundIndex: number;
  error: string | null;
  // Search-specific visualization states
  currentIndex: number;
  searchRange: { start: number, end: number } | null;
  startSorting?: () => Promise<void>;
  startRace?: () => Promise<void>;
  togglePause?: () => void;
  setSpeed?: (speed: number) => void;
  setSearchTarget?: (target: number | null) => void;
  resetState?: () => void;
  stopVisualization?: () => void;
  setArraySize?: (size: number) => void;
  setCustomArray?: (customArray: number[]) => void;
}

export interface ArrayBarProps {
  value: number;
  height: number;
  width?: number;
  isActive: boolean;
  isComparing: boolean;
  isSorted: boolean;
  isTarget?: boolean;
  isFound?: boolean;
}

export const ALGORITHMS: Algorithm[] = [
  // Sorting Algorithms
  {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    type: 'sorting',
    description: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'selection-sort',
    name: 'Selection Sort',
    type: 'sorting',
    description: 'Divides the input list into a sorted and an unsorted region, and repeatedly selects the smallest element from the unsorted region to add to the sorted region.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'insertion-sort',
    name: 'Insertion Sort',
    type: 'sorting',
    description: 'Builds the final sorted array one item at a time , by repeatedly inserting a new element into the sorted portion of the array.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'merge-sort',
    name: 'Merge Sort',
    type: 'sorting',
    description: 'Divides the array into two halves, recursively sorts them, and then merges the sorted halves.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'quick-sort',
    name: 'Quick Sort',
    type: 'sorting',
    description: 'Selects a pivot element and partitions the array around it, recursively sorting the sub-arrays.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(log n)'
  },
  // Searching Algorithms
  {
    id: 'linear-search',
    name: 'Linear Search',
    type: 'searching',
    description: 'Sequentially checks each element in the list until a match is found or the whole list has been searched.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    type: 'searching',
    description: 'Repeatedly divides the search interval in half to find the target value in a sorted array.',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)'
  }
];
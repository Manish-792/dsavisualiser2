// Helper functions
const sleep = async (speed: number) => {
  // Convert speed slider value (1-200) to milliseconds (200-1)
  // Higher speed value = shorter delay
  const delay = Math.max(1, Math.floor(201 - speed));
  await new Promise(resolve => setTimeout(resolve, delay));
};

const swap = (arr: number[], i: number, j: number) => {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
};

// Progress callback type
type ProgressCallback = (progress: number, activeIndices?: number[], comparingIndices?: number[], sortedIndices?: number[]) => Promise<boolean>;

// Bubble Sort
export async function bubblesort(arr: number[], onProgress: ProgressCallback, getSpeed: () => number) {
  const n = arr.length;
  const totalSteps = n * (n - 1) / 2;
  let currentStep = 0;
  const sortedIndices: number[] = [];

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // First show comparison
      const shouldContinue1 = await onProgress(
        (currentStep / totalSteps) * 100,
        [],
        [j, j + 1],
        sortedIndices
      );
      if (!shouldContinue1) return arr;
      await sleep(getSpeed());

      if (arr[j] > arr[j + 1]) {
        // Then show active bars that will be swapped
        const shouldContinue2 = await onProgress(
          (currentStep / totalSteps) * 100,
          [j, j + 1],
          [],
          sortedIndices
        );
        if (!shouldContinue2) return arr;
        await sleep(getSpeed());

        // Perform the swap
        swap(arr, j, j + 1);
        
        // Show the swap result with a small delay
        const shouldContinue3 = await onProgress(
          (currentStep / totalSteps) * 100,
          [],
          [],
          sortedIndices
        );
        if (!shouldContinue3) return arr;
        await sleep(getSpeed() * 1.5); // Slightly longer pause after swap
      }
      currentStep++;
    }
    sortedIndices.unshift(n - i - 1);
    const shouldContinue = await onProgress(
      (currentStep / totalSteps) * 100,
      [],
      [],
      sortedIndices
    );
    if (!shouldContinue) return arr;
    await sleep(getSpeed());
  }
  sortedIndices.unshift(0);
  await onProgress(100, [], [], sortedIndices);
  return arr;
}

// Selection Sort
export async function selectionsort(arr: number[], onProgress: ProgressCallback, getSpeed: () => number) {
  const n = arr.length;
  const sortedIndices: number[] = [];

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    
    for (let j = i + 1; j < n; j++) {
      const shouldContinue = await onProgress(
        (i / (n - 1)) * 100,
        [minIdx],
        [j],
        sortedIndices
      );
      if (!shouldContinue) return arr;
      await sleep(getSpeed());
      
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }

    if (minIdx !== i) {
      // Show the elements to be swapped
      const shouldContinue1 = await onProgress(
        (i / (n - 1)) * 100,
        [i, minIdx],
        [],
        sortedIndices
      );
      if (!shouldContinue1) return arr;
      await sleep(getSpeed());

      swap(arr, i, minIdx);
      
      // Show the result after swap
      const shouldContinue2 = await onProgress(
        (i / (n - 1)) * 100,
        [],
        [],
        sortedIndices
      );
      if (!shouldContinue2) return arr;
      await sleep(getSpeed() * 1.5); // Slightly longer pause after swap
    }
    
    sortedIndices.push(i);
    const shouldContinue = await onProgress(
      (i / (n - 1)) * 100,
      [],
      [],
      sortedIndices
    );
    if (!shouldContinue) return arr;
    await sleep(getSpeed());
  }
  
  sortedIndices.push(n - 1);
  await onProgress(100, [], [], sortedIndices);
  return arr;
}

// Insertion Sort
export async function insertionsort(arr: number[], onProgress: ProgressCallback, getSpeed: () => number) {
  const n = arr.length;
  const sortedIndices: number[] = [0];

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    
    // Show current element being inserted
    const shouldContinue1 = await onProgress(
      (i / (n - 1)) * 100,
      [i],
      [],
      sortedIndices
    );
    if (!shouldContinue1) return arr;
    await sleep(getSpeed());

    while (j >= 0 && arr[j] > key) {
      // Show comparison
      const shouldContinue2 = await onProgress(
        (i / (n - 1)) * 100,
        [],
        [j, j + 1],
        sortedIndices
      );
      if (!shouldContinue2) return arr;
      await sleep(getSpeed());

      // Show movement
      arr[j + 1] = arr[j];
      const shouldContinue3 = await onProgress(
        (i / (n - 1)) * 100,
        [j + 1],
        [],
        sortedIndices
      );
      if (!shouldContinue3) return arr;
      await sleep(getSpeed());
      
      j--;
    }
    
    arr[j + 1] = key;
    sortedIndices.push(i);
    const shouldContinue4 = await onProgress(
      (i / (n - 1)) * 100,
      [],
      [],
      sortedIndices
    );
    if (!shouldContinue4) return arr;
    await sleep(getSpeed() * 1.5); // Slightly longer pause after insertion
  }

  await onProgress(100, [], [], sortedIndices);
  return arr;
}

// Quick Sort
export async function quicksort(arr: number[], onProgress: ProgressCallback, getSpeed: () => number) {
  const sortedIndices = new Set<number>();
  
  async function partition(low: number, high: number): Promise<number> {
    const pivot = arr[high];
    let i = low - 1;
    
    // Show pivot
    const shouldContinue0 = await onProgress(
      (sortedIndices.size / arr.length) * 100,
      [high],
      [],
      Array.from(sortedIndices)
    );
    if (!shouldContinue0) return i + 1;
    await sleep(getSpeed());
    
    for (let j = low; j < high; j++) {
      // Show comparison
      const shouldContinue1 = await onProgress(
        (sortedIndices.size / arr.length) * 100,
        [],
        [j, high],
        Array.from(sortedIndices)
      );
      if (!shouldContinue1) return i + 1;
      await sleep(getSpeed());
      
      if (arr[j] <= pivot) {
        i++;
        // Show swap
        const shouldContinue2 = await onProgress(
          (sortedIndices.size / arr.length) * 100,
          [i, j],
          [],
          Array.from(sortedIndices)
        );
        if (!shouldContinue2) return i + 1;
        await sleep(getSpeed());
        
        swap(arr, i, j);
        
        // Show result
        const shouldContinue3 = await onProgress(
          (sortedIndices.size / arr.length) * 100,
          [],
          [],
          Array.from(sortedIndices)
        );
        if (!shouldContinue3) return i + 1;
        await sleep(getSpeed() * 1.5); // Slightly longer pause after swap
      }
    }
    
    // Show final pivot swap
    const shouldContinue4 = await onProgress(
      (sortedIndices.size / arr.length) * 100,
      [i + 1, high],
      [],
      Array.from(sortedIndices)
    );
    if (!shouldContinue4) return i + 1;
    await sleep(getSpeed());
    
    swap(arr, i + 1, high);
    return i + 1;
  }
  
  async function quickSortHelper(low: number, high: number) {
    if (low < high) {
      const pi = await partition(low, high);
      sortedIndices.add(pi);
      
      const shouldContinue = await onProgress(
        (sortedIndices.size / arr.length) * 100,
        [],
        [],
        Array.from(sortedIndices)
      );
      if (!shouldContinue) return;
      
      await quickSortHelper(low, pi - 1);
      await quickSortHelper(pi + 1, high);
    } else if (low === high) {
      sortedIndices.add(low);
      const shouldContinue = await onProgress(
        (sortedIndices.size / arr.length) * 100,
        [],
        [],
        Array.from(sortedIndices)
      );
      if (!shouldContinue) return;
    }
  }
  
  await quickSortHelper(0, arr.length - 1);
  await onProgress(100, [], [], Array.from(sortedIndices));
  return arr;
}

// Merge Sort
export async function mergesort(arr: number[], onProgress: ProgressCallback, getSpeed: () => number) {
  const sortedIndices = new Set<number>();
  const n = arr.length;
  
  async function merge(left: number, middle: number, right: number) {
    const leftArray = arr.slice(left, middle + 1);
    const rightArray = arr.slice(middle + 1, right + 1);
    let i = 0, j = 0, k = left;
    
    while (i < leftArray.length && j < rightArray.length) {
      // Show comparison
      const shouldContinue1 = await onProgress(
        (sortedIndices.size / n) * 100,
        [],
        [left + i, middle + 1 + j],
        Array.from(sortedIndices)
      );
      if (!shouldContinue1) return;
      await sleep(getSpeed());
      
      // Show movement
      const shouldContinue2 = await onProgress(
        (sortedIndices.size / n) * 100,
        [k],
        [],
        Array.from(sortedIndices)
      );
      if (!shouldContinue2) return;
      await sleep(getSpeed());
      
      if (leftArray[i] <= rightArray[j]) {
        arr[k] = leftArray[i];
        i++;
      } else {
        arr[k] = rightArray[j];
        j++;
      }
      k++;
    }
    
    while (i < leftArray.length) {
      arr[k] = leftArray[i];
      const shouldContinue = await onProgress(
        (sortedIndices.size / n) * 100,
        [k],
        [left + i],
        Array.from(sortedIndices)
      );
      if (!shouldContinue) return;
      await sleep(getSpeed());
      i++;
      k++;
    }
    
    while (j < rightArray.length) {
      arr[k] = rightArray[j];
      const shouldContinue = await onProgress(
        (sortedIndices.size / n) * 100,
        [k],
        [middle + 1 + j],
        Array.from(sortedIndices)
      );
      if (!shouldContinue) return;
      await sleep(getSpeed());
      j++;
      k++;
    }
    
    for (let idx = left; idx <= right; idx++) {
      sortedIndices.add(idx);
    }
    
    const shouldContinue = await onProgress(
      (sortedIndices.size / n) * 100,
      [],
      [],
      Array.from(sortedIndices)
    );
    if (!shouldContinue) return;
    await sleep(getSpeed() * 1.5); // Slightly longer pause after merge
  }
  
  async function mergeSortHelper(left: number, right: number) {
    if (left < right) {
      const middle = Math.floor((left + right) / 2);
      await mergeSortHelper(left, middle);
      await mergeSortHelper(middle + 1, right);
      await merge(left, middle, right);
    } else if (left === right) {
      sortedIndices.add(left);
      const shouldContinue = await onProgress(
        (sortedIndices.size / n) * 100,
        [left],
        [],
        Array.from(sortedIndices)
      );
      if (!shouldContinue) return;
      await sleep(getSpeed());
    }
  }
  
  await mergeSortHelper(0, arr.length - 1);
  await onProgress(100, [], [], Array.from(sortedIndices));
  return arr;
}

// Linear Search
export async function linearsearch(arr: number[], target: number, onProgress: ProgressCallback, getSpeed: () => number): Promise<number> {
  const n = arr.length;
  const checkedIndices: number[] = [];
  
  for (let i = 0; i < n; i++) {
    // Highlight current element being checked
    const shouldContinue1 = await onProgress(
      ((i + 1) / n) * 100,
      [i],
      [],
      checkedIndices
    );
    if (!shouldContinue1) return -1;
    await sleep(getSpeed());

    // Compare with target
    const shouldContinue2 = await onProgress(
      ((i + 1) / n) * 100,
      [i],
      [],
      checkedIndices
    );
    if (!shouldContinue2) return -1;
    await sleep(getSpeed());

    if (arr[i] === target) {
      // Found the target
      await onProgress(
        100,
        [i],
        [],
        checkedIndices
      );
      return i;
    }

    // Mark as checked
    checkedIndices.push(i);
    const shouldContinue3 = await onProgress(
      ((i + 1) / n) * 100,
      [],
      [],
      checkedIndices
    );
    if (!shouldContinue3) return -1;
    await sleep(getSpeed());
  }

  await onProgress(100, [], [], checkedIndices);
  return -1;
}

// Binary Search
export async function binarysearch(arr: number[], target: number, onProgress: ProgressCallback, getSpeed: () => number): Promise<number> {
  let left = 0;
  let right = arr.length - 1;
  const checkedIndices: number[] = [];
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    // Show the current range
    const shouldContinue1 = await onProgress(
      ((arr.length - (right - left)) / arr.length) * 100,
      [],
      [left, right],
      checkedIndices
    );
    if (!shouldContinue1) return -1;
    await sleep(getSpeed());

    // Show the middle element being checked
    const shouldContinue2 = await onProgress(
      ((arr.length - (right - left)) / arr.length) * 100,
      [mid],
      [],
      checkedIndices
    );
    if (!shouldContinue2) return -1;
    await sleep(getSpeed());

    if (arr[mid] === target) {
      await onProgress(100, [mid], [], [...checkedIndices, mid]);
      return mid;
    }

    if (arr[mid] < target) {
      // Add all elements from left to mid to checked indices
      for (let i = left; i <= mid; i++) {
        if (!checkedIndices.includes(i)) {
          checkedIndices.push(i);
        }
      }
      left = mid + 1;
    } else {
      // Add all elements from mid to right to checked indices
      for (let i = mid; i <= right; i++) {
        if (!checkedIndices.includes(i)) {
          checkedIndices.push(i);
        }
      }
      right = mid - 1;
    }

    const shouldContinue3 = await onProgress(
      ((arr.length - (right - left)) / arr.length) * 100,
      [],
      [],
      checkedIndices
    );
    if (!shouldContinue3) return -1;
    await sleep(getSpeed() * 1.5); // Slightly longer pause after narrowing search range
  }

  await onProgress(100, [], [], checkedIndices);
  return -1;
}
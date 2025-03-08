import React from 'react';

const RaceVisualizer = ({ 
  array, 
  activeIndices, 
  comparingIndices, 
  sortedIndices, 
  algorithmId 
}) => {
  // Get algorithm name from ID (convert camelCase to Title Case)
  const algorithmName = algorithmId
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());

  // Find the max value in the array for scaling
  const maxValue = Math.max(...array);

  return (
    <div className="mb-4">
      <h3 className="text-lg font-medium mb-2">{algorithmName}</h3>
      <div className="bg-gray-100 p-3 rounded-lg">
        <div className="flex h-10 items-end space-x-1">
          {array.map((value, index) => {
            // Determine the color of the bar based on its state
            let barColor = "bg-blue-400";
            
            if (sortedIndices.includes(index)) {
              barColor = "bg-green-500"; // Sorted
            } else if (activeIndices.includes(index)) {
              barColor = "bg-red-500"; // Currently being moved
            } else if (comparingIndices.includes(index)) {
              barColor = "bg-yellow-400"; // Being compared
            }
            
            // Calculate height as percentage of max value
            const heightPercentage = (value / maxValue) * 100;
            
            return (
              <div
                key={index}
                className={`${barColor} rounded-t flex-1`}
                style={{ 
                  height: `${heightPercentage}%`,
                  transition: 'height 0.2s ease-in-out'
                }}
                title={`Value: ${value}`}
              />
            );
          })}
        </div>
        
        {/* Progress indicator */}
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full" 
            style={{ 
              width: `${(sortedIndices.length / array.length) * 100}%`,
              transition: 'width 0.2s ease-in-out'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default RaceVisualizer;
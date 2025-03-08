import React from 'react';
import { ArrayBarProps } from '../types';

const ArrayBar: React.FC<ArrayBarProps> = ({
  value,
  height,
  width = 8,
  isActive,
  isComparing,
  isSorted,
  isTarget,
  isFound,
}) => {
  const getBarColor = () => {
    if (isFound) return 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]';
    if (isTarget) return 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]';
    if (isActive) return 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]';
    if (isComparing) return 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]';
    if (isSorted) return 'bg-green-400 shadow-[0_0_5px_rgba(74,222,128,0.3)]';
    return 'bg-purple-400 shadow-[0_0_5px_rgba(192,132,252,0.2)]';
  };

  return (
    <div className="flex flex-col items-center group">
      <div
        className={`${getBarColor()} transition-colors rounded-t-md relative`}
        style={{ 
          height: `${height}px`,
          width: `${width}px`,
          transition: 'height 0.3s ease-in-out'
        }}
      >
        {isTarget && (
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-purple-400">
            Target
          </div>
        )}
      </div>
      <span className="text-xs mt-1 opacity-70 group-hover:opacity-100 transition-opacity text-gray-300" style={{ fontSize: width < 12 ? '8px' : '10px' }}>
        {value}
      </span>
    </div>
  );
};

export default ArrayBar;
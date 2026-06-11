import React from 'react';

export function ProgressBar({ progress, color }) {
  return (
    <div className="progress-bar">
      <div 
        className="progress-fill" 
        style={{ width: `${progress}%`, background: color }}
      ></div>
    </div>
  );
}

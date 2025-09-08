import React, { useState, useRef } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

interface DiceRotation {
  x: number;
  y: number;
}

const rotations: Record<number, DiceRotation> = {
  1: { x: 0, y: 0 },
  2: { x: 0, y: 180 },
  3: { x: 0, y: 90 },
  4: { x: 0, y: -90 },
  5: { x: 90, y: 0 },
  6: { x: -90, y: 0 }
};

function App() {
  const [isRolling, setIsRolling] = useState(false);
  const [currentValue, setCurrentValue] = useState(1);
  const diceRef = useRef<HTMLDivElement>(null);

  const rollDice = () => {
    if (isRolling) return;

    setIsRolling(true);
    
    const randomValue = Math.floor(Math.random() * 6) + 1;

    setTimeout(() => {
      setCurrentValue(randomValue);
      setIsRolling(false);
    }, 1500);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // Left mouse button
      invoke('start_drag');
    }
  };

  const getDiceTransform = () => {
    const rotation = rotations[currentValue];
    return `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`;
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-transparent">
      <div 
        className="relative perspective-1000 w-24 h-24 cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div
          ref={diceRef}
          className={`w-full h-full relative transform-gpu transition-transform duration-1500 ease-out cursor-pointer ${
            isRolling ? 'animate-spin' : ''
          }`}
          style={{
            transformStyle: 'preserve-3d',
            transform: isRolling ? 'rotateX(720deg) rotateY(720deg)' : getDiceTransform()
          }}
          onClick={rollDice}
        >
          {/* Face 1 */}
          <div className="absolute w-24 h-24 bg-white border-2 border-blue-400 rounded-sm flex items-center justify-center shadow-lg"
               style={{ transform: 'translateZ(48px)' }}>
            <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
          </div>

          {/* Face 2 */}
          <div className="absolute w-24 h-24 bg-white border-2 border-blue-400 rounded-sm flex items-center justify-center shadow-lg"
               style={{ transform: 'rotateY(180deg) translateZ(48px)' }}>
            <div className="relative w-full h-full">
              <div className="absolute top-3 left-3 w-4 h-4 bg-blue-400 rounded-full"></div>
              <div className="absolute bottom-3 right-3 w-4 h-4 bg-blue-400 rounded-full"></div>
            </div>
          </div>

          {/* Face 3 */}
          <div className="absolute w-24 h-24 bg-white border-2 border-blue-400 rounded-sm flex items-center justify-center shadow-lg"
               style={{ transform: 'rotateY(90deg) translateZ(48px)' }}>
            <div className="relative w-full h-full">
              <div className="absolute top-3 left-3 w-4 h-4 bg-blue-400 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-400 rounded-full"></div>
              <div className="absolute bottom-3 right-3 w-4 h-4 bg-blue-400 rounded-full"></div>
            </div>
          </div>

          {/* Face 4 */}
          <div className="absolute w-24 h-24 bg-white border-2 border-blue-400 rounded-sm flex items-center justify-center shadow-lg"
               style={{ transform: 'rotateY(-90deg) translateZ(48px)' }}>
            <div className="relative w-full h-full">
              <div className="absolute top-3 left-3 w-4 h-4 bg-blue-400 rounded-full"></div>
              <div className="absolute top-3 right-3 w-4 h-4 bg-blue-400 rounded-full"></div>
              <div className="absolute bottom-3 left-3 w-4 h-4 bg-blue-400 rounded-full"></div>
              <div className="absolute bottom-3 right-3 w-4 h-4 bg-blue-400 rounded-full"></div>
            </div>
          </div>

          {/* Face 5 */}
          <div className="absolute w-24 h-24 bg-white border-2 border-blue-400 rounded-sm flex items-center justify-center shadow-lg"
               style={{ transform: 'rotateX(90deg) translateZ(48px)' }}>
            <div className="relative w-full h-full">
              <div className="absolute top-3 left-3 w-4 h-4 bg-blue-400 rounded-full"></div>
              <div className="absolute top-3 right-3 w-4 h-4 bg-blue-400 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-400 rounded-full"></div>
              <div className="absolute bottom-3 left-3 w-4 h-4 bg-blue-400 rounded-full"></div>
              <div className="absolute bottom-3 right-3 w-4 h-4 bg-blue-400 rounded-full"></div>
            </div>
          </div>

          {/* Face 6 */}
          <div className="absolute w-24 h-24 bg-white border-2 border-blue-400 rounded-sm flex items-center justify-center shadow-lg"
               style={{ transform: 'rotateX(-90deg) translateZ(48px)' }}>
            <div className="relative w-full h-full">
              <div className="absolute top-3 left-3 w-4 h-4 bg-blue-400 rounded-full"></div>
              <div className="absolute top-3 right-3 w-4 h-4 bg-blue-400 rounded-full"></div>
              <div className="absolute top-1/2 left-3 transform -translate-y-1/2 w-4 h-4 bg-blue-400 rounded-full"></div>
              <div className="absolute top-1/2 right-3 transform -translate-y-1/2 w-4 h-4 bg-blue-400 rounded-full"></div>
              <div className="absolute bottom-3 left-3 w-4 h-4 bg-blue-400 rounded-full"></div>
              <div className="absolute bottom-3 right-3 w-4 h-4 bg-blue-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
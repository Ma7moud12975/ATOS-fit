import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WaterMonitoringCard = () => {
  const [waterIntake, setWaterIntake] = useState(0);
  const [goal, setGoal] = useState('recommended');
  const [lastDrink, setLastDrink] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('atos_water_intake');
    if (saved) {
      const data = JSON.parse(saved);
      setWaterIntake(data.intake || 0);
      setGoal(data.goal || 'recommended');
      setLastDrink(data.lastDrink ? new Date(data.lastDrink) : null);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem('atos_water_intake', JSON.stringify({
      intake: waterIntake,
      goal,
      lastDrink: lastDrink?.toISOString()
    }));
  }, [waterIntake, goal, lastDrink]);
  const goalLevels = {
    minimum: { amount: 2000, label: 'Minimum', color: 'text-orange-500', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
    recommended: { amount: 2500, label: 'Recommended', color: 'text-blue-500', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
    advanced: { amount: 3000, label: 'Advanced', color: 'text-green-500', bgColor: 'bg-green-50', borderColor: 'border-green-200' }
  };
  const currentGoal = goalLevels[goal];
  const percentage = Math.min(100, (waterIntake / currentGoal.amount) * 100);
  const remaining = Math.max(0, currentGoal.amount - waterIntake);
  const addWater = (amount) => {
    if (waterIntake + amount <= currentGoal.amount) {
      setWaterIntake(prev => Math.min(prev + amount, currentGoal.amount));
      setLastDrink(new Date());
    }
  };
  const resetDaily = () => {
    setWaterIntake(0);
    setLastDrink(null);
  };
  const getMotivationMessage = () => {
    if (percentage >= 100) return "🚰 Goal achieved! Excellent hydration!";
    if (percentage >= 75) return "💪 Almost there! Keep it up!";
    if (percentage >= 50) return "👍 Good progress! Halfway there!";
    if (percentage >= 25) return "💧 Getting started! Every drop counts!";
    return "🚰 Time to hydrate! Your body needs water!";
  };
  // Water-wave SVG animation settings
  const fillPercent = Math.min(1, waterIntake / currentGoal.amount);
  const circleSize = 180; // px (bigger)
  const waveHeight = 16; // taller for better animation
  // Simple wave generator for demo (1 wave)
  const wavePath = (fill) => {
    // Wave y control
    const h = circleSize;
    const w = circleSize;
    const baseY = h - (h * fill);
    // One sine wave across circle
    // Can stack multiple for wavy effect
    const points = [];
    const amplitude = waveHeight;
    for (let x = 0; x <= w; x += 3) {
      const y = baseY + Math.sin((x / w) * 2 * Math.PI + Date.now() / 1200) * amplitude * 0.7;
      points.push(`${x},${y}`);
    }
    // Bottom part of path to close circle
    points.push(`${w},${h}`);
    points.push(`0,${h}`);
    return `M0,${points[0].split(',')[1]} L${points.join(' ')} Z`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon name="Droplets" size={22} className="text-blue-500" />
          <h3 className="text-xl font-semibold text-card-foreground">Water Intake</h3>
        </div>
      </div>
      <div className="mb-3">
        <div className="flex flex-wrap gap-1 justify-center">
          {Object.entries(goalLevels).map(([key, level]) => (
            <button
              key={key}
              onClick={() => setGoal(key)}
              className={`px-2 py-1 text-xs rounded-full transition-colors font-medium border ${goal === key 
                ? `${level.bgColor} ${level.color} ${level.borderColor}` 
                : 'text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80'}`}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center mb-5 relative select-none" style={{ minHeight: `${circleSize}px` }}>
        <svg width={circleSize} height={circleSize} viewBox={`0 0 ${circleSize} ${circleSize}`} className="block">
          {/* Circle boundary */}
          <circle cx={circleSize/2} cy={circleSize/2} r={(circleSize-10)/2} fill="#e0e7ef" opacity="0.09" stroke="#90cdf4" strokeWidth="7" />
          {/* Blue water fill with wave */}
          <path d={wavePath(fillPercent)} fill="url(#water-gradient)" style={{ transition: 'd 0.5s' }}>
            <animate attributeName="d" dur="1s" repeatCount="indefinite" values={`${wavePath(fillPercent)};${wavePath(fillPercent)}`} />
          </path>
          <defs>
            <linearGradient id="water-gradient" x1="0" y1="0" x2="0" y2={circleSize} gradientUnits="userSpaceOnUse">
              <stop stopColor="#60a5fa"/>
              <stop offset="1" stopColor="#2563eb"/>
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ fontSize: '1.25em' }}>
          <div className={`text-3xl font-extrabold text-blue-600 drop-shadow-[0_1px_3px_rgba(0,34,255,0.23)]`}>
            {Math.round(percentage)}%
          </div>
          <div className="text-sm font-semibold text-[#388bfd] mb-1">
            {waterIntake}ml
            <span className="mx-1 text-neutral-400 font-normal">/</span>
            {currentGoal.amount}ml
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => addWater(250)}
          className="text-xs py-1 focus:ring-2 focus:ring-blue-300"
          disabled={waterIntake >= currentGoal.amount}
        >
          +250ml
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addWater(500)}
          className="text-xs py-1 focus:ring-2 focus:ring-blue-300"
          disabled={waterIntake >= currentGoal.amount}
        >
          +500ml
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addWater(750)}
          className="text-xs py-1 focus:ring-2 focus:ring-blue-300"
          disabled={waterIntake >= currentGoal.amount}
        >
          +750ml
        </Button>
      </div>
      <div className="text-center mb-3">
        <div className="font-medium text-blue-600">{getMotivationMessage()}</div>
        {remaining > 0 && (
          <div className="text-xs text-muted-foreground">{remaining}ml remaining</div>
        )}
      </div>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={resetDaily}
          className="flex-1 text-xs py-1"
        >
          Reset
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => addWater(200)}
          className="flex-1 text-xs py-1"
          disabled={waterIntake >= currentGoal.amount}
        >
          Quick Sip
        </Button>
      </div>
    </div>
  );
};

export default WaterMonitoringCard;

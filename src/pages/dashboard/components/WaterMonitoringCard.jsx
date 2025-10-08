import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WaterMonitoringCard = () => {
  const [waterIntake, setWaterIntake] = useState(0);
  const [goal, setGoal] = useState('recommended'); // minimum, recommended, advanced
  const [lastDrink, setLastDrink] = useState(null);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('atos_water_intake');
    if (saved) {
      const data = JSON.parse(saved);
      setWaterIntake(data.intake || 0);
      setGoal(data.goal || 'recommended');
      setLastDrink(data.lastDrink ? new Date(data.lastDrink) : null);
    }
  }, []);

  // Save to localStorage
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
    setWaterIntake(prev => prev + amount);
    setLastDrink(new Date());
  };

  const resetDaily = () => {
    setWaterIntake(0);
    setLastDrink(null);
  };

  const getMotivationMessage = () => {
    if (percentage >= 100) return "🎉 Excellent! You've reached your daily goal!";
    if (percentage >= 75) return "💪 Almost there! Keep it up!";
    if (percentage >= 50) return "👍 Good progress! Halfway there!";
    if (percentage >= 25) return "💧 Getting started! Every drop counts!";
    return "🚰 Time to hydrate! Your body needs water!";
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon name="Droplets" size={18} className="text-blue-500" />
          <h3 className="text-lg font-semibold text-card-foreground">Water Intake</h3>
        </div>
      </div>

      {/* Goal Level Buttons */}
      <div className="mb-3">
        <div className="flex flex-wrap gap-1 justify-center">
          {Object.entries(goalLevels).map(([key, level]) => (
            <button
              key={key}
              onClick={() => setGoal(key)}
              className={`px-2 py-1 text-xs rounded-full transition-colors ${
                goal === key 
                  ? `${level.bgColor} ${level.color} ${level.borderColor} border` 
                  : 'text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80'
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Circle */}
      <div className="flex items-center justify-center mb-3">
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-muted"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray={`${percentage}, 100`}
              className={currentGoal.color}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={`text-lg font-bold ${currentGoal.color}`}>
                {Math.round(percentage)}%
              </div>
              <div className="text-xs text-muted-foreground">
                {waterIntake}ml / {currentGoal.amount}ml
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Add Buttons */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => addWater(250)}
          className="text-xs py-1"
        >
          +250ml
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addWater(500)}
          className="text-xs py-1"
        >
          +500ml
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addWater(750)}
          className="text-xs py-1"
        >
          +750ml
        </Button>
      </div>

      {/* Status */}
      <div className="text-center mb-3">
        <p className="text-xs text-muted-foreground mb-1">
          {getMotivationMessage()}
        </p>
        {remaining > 0 && (
          <p className="text-xs text-muted-foreground">
            {remaining}ml remaining
          </p>
        )}
      </div>

      {/* Actions */}
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
        >
          Quick Sip
        </Button>
      </div>
    </div>
  );
};

export default WaterMonitoringCard;

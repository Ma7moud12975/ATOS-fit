import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ExerciseCard = ({ exercise }) => {
  const navigate = useNavigate();
  const isTimeBased = useMemo(() => {
    const timeNames = new Set([
      'Mountain Climbers',
      'Jumping Jacks',
      'High Knees',
      'Plank',
      'Side Plank',
      'Wall Sit'
    ]);
    return timeNames.has(exercise?.name) || typeof exercise?.reps === 'string';
  }, [exercise]);

  const [formState, setFormState] = useState({
    sets: exercise?.sets || 3,
    reps: typeof exercise?.reps === 'number' ? exercise?.reps : '',
    durationSeconds: typeof exercise?.reps === 'string' ? parseInt(String(exercise?.reps).replace(/\D/g, ''), 10) || 30 : 30,
    notes: ''
  });

  const updateField = (field, value) => setFormState(prev => ({ ...prev, [field]: value }));

  const handleStartWorkout = () => {
    navigate('/exercise-workout-screen', { state: { selectedExercise: exercise } });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-success/10 text-success border-success/20';
      case 'Intermediate': return 'bg-warning/10 text-warning border-warning/20';
      case 'Advanced': return 'bg-error/10 text-error border-error/20';
      default: return 'bg-muted/10 text-muted-foreground border-border';
    }
  };

  // icon helper kept for other UI, but not used in simplified card

  // Determine photo for display
  const photoMap = {
    'Push-ups': 'https://i.pinimg.com/originals/47/0d/31/470d318a551421e46c3891fb1f04dd50.gif',
    'Push Ups': 'https://i.pinimg.com/originals/47/0d/31/470d318a551421e46c3891fb1f04dd50.gif',
    'Squats': 'https://i.pinimg.com/originals/27/30/c2/2730c2da52a5f9200caa7e5d8705efde.gif',
    'Lunges': 'https://i.pinimg.com/originals/66/78/58/6678589817d6026fab7bd23838a8e3eb.gif',
    'Burpees': 'https://i.pinimg.com/originals/f0/a3/da/f0a3da2890f6edf4c7b45845fa14e39c.gif',
    'Mountain Climbers': 'https://i.pinimg.com/originals/bd/f2/a3/bdf2a3ec9beb4f231033af0d744057bb.gif',
    'Jumping Jacks': 'https://i.pinimg.com/originals/b4/b5/b9/b4b5b94c119dde698d138b8fe0b8d521.gif',
    'High Knees': 'https://i.pinimg.com/originals/95/db/ae/95dbae82f51c67fc0f5aa30a57da663c.gif',
    'Plank': 'https://i.pinimg.com/736x/83/84/65/83846529c8c33a1d03b493c82bb23570.jpg',
    'Side Plank': 'https://i.pinimg.com/736x/bd/cf/9a/bdcf9a908f66c3f28a47adc08a6c8448.jpg',
    'Wall Sit': 'https://i.pinimg.com/originals/50/bb/fa/50bbfa9d11ce94feff442ad0c1a3e250.gif'
  };
  // Normalize lookup: lowercase and strip non-alphanumeric so "Push-ups", "Push Ups" both match
  const normalize = (s) => (s || '').toString().toLowerCase().replace(/[^a-z0-9]/g, '');
  const normalized = normalize(exercise?.name);
  // build normalized photo map once
  const normalizedPhotoMap = Object.keys(photoMap).reduce((acc, key) => {
    acc[normalize(key)] = photoMap[key];
    return acc;
  }, {});
  const photoFile = normalizedPhotoMap[normalized] || null;

  return (
    <div className="bg-card border border-border rounded-[20px] p-5 shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-300 group">
      <div className="mb-4">
        <div className="rounded-lg overflow-hidden bg-white">
          <img
            src={
              // prefer external URL from map when present
              photoFile && (photoFile.startsWith('http') ? photoFile : `/assets/photos/${photoFile}`)
              || '/assets/images/no_image.png'
            }
            alt={exercise?.name}
            className="w-full h-44 object-contain bg-white"
            loading="lazy"
          />
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-card-foreground text-xl">
          {exercise?.name}
        </h3>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(exercise?.difficulty)}`}>
          {exercise?.difficulty}
        </span>
      </div>

      <div className="mb-4">
        <p className="text-sm text-muted-foreground">{exercise?.targetMuscles}</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <Button
          variant="primary"
          onClick={handleStartWorkout}
          className="w-full text-black"
          style={{ backgroundColor: '#ffa500', borderColor: '#ffa500' }}
          iconName="Play"
          iconPosition="left"
          size="lg"
        >
          Start
        </Button>
      </div>
    </div>
  );
};

export default ExerciseCard;

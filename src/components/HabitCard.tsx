import React from 'react';
import { Check, Trash2, Flame } from 'lucide-react';
import { Habit } from '../App';

interface HabitCardProps {
  habit: Habit;
  onToggle: (habitId: string, date: string) => void;
  onDelete: (habitId: string) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onToggle, onDelete }) => {
  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = habit.completedDates.includes(today);

  // Generate last 7 days for mini calendar
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const handleToggle = () => {
    onToggle(habit.id, today);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      onDelete(habit.id);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: habit.color }}
            />
            <h3 className="font-semibold text-gray-900">{habit.name}</h3>
          </div>
          {habit.description && (
            <p className="text-sm text-gray-600">{habit.description}</p>
          )}
        </div>
        <button
          onClick={handleDelete}
          className="text-gray-400 hover:text-red-500 transition-colors p-1"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Streak */}
      <div className="flex items-center gap-2 mb-4">
        <Flame className="w-4 h-4 text-orange-500" />
        <span className="text-sm font-medium text-gray-700">
          {habit.streak} day streak
        </span>
      </div>

      {/* Mini Calendar */}
      <div className="flex gap-1 mb-4">
        {last7Days.map((date, index) => {
          const isCompleted = habit.completedDates.includes(date);
          const isToday = date === today;
          
          return (
            <div
              key={date}
              className={`w-6 h-6 rounded text-xs flex items-center justify-center font-medium ${
                isCompleted
                  ? 'bg-green-100 text-green-700'
                  : isToday
                  ? 'bg-gray-100 text-gray-600 border-2 border-gray-300'
                  : 'bg-gray-50 text-gray-400'
              }`}
            >
              {new Date(date).getDate()}
            </div>
          );
        })}
      </div>

      {/* Complete Button */}
      <button
        onClick={handleToggle}
        className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
          isCompletedToday
            ? 'bg-green-100 text-green-700 border border-green-200'
            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
        }`}
      >
        <Check className={`w-4 h-4 ${isCompletedToday ? 'text-green-600' : 'text-gray-400'}`} />
        {isCompletedToday ? 'Completed Today' : 'Mark Complete'}
      </button>
    </div>
  );
};

export default HabitCard;
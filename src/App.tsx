import React, { useState, useEffect } from 'react';
import { Plus, Calendar, TrendingUp, Settings } from 'lucide-react';
import HabitCard from './components/HabitCard';
import AddHabitModal from './components/AddHabitModal';
import StatsView from './components/StatsView';

export interface Habit {
  id: string;
  name: string;
  description?: string;
  color: string;
  streak: number;
  completedDates: string[];
  createdAt: string;
}

function App() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeView, setActiveView] = useState<'habits' | 'stats'>('habits');

  // Load habits from localStorage on mount
  useEffect(() => {
    const savedHabits = localStorage.getItem('habits');
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
  }, []);

  // Save habits to localStorage whenever habits change
  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const addHabit = (habitData: Omit<Habit, 'id' | 'streak' | 'completedDates' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: Date.now().toString(),
      streak: 0,
      completedDates: [],
      createdAt: new Date().toISOString(),
    };
    setHabits(prev => [...prev, newHabit]);
    setShowAddModal(false);
  };

  const toggleHabit = (habitId: string, date: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const isCompleted = habit.completedDates.includes(date);
        const updatedDates = isCompleted
          ? habit.completedDates.filter(d => d !== date)
          : [...habit.completedDates, date].sort();
        
        // Calculate streak
        const today = new Date();
        let streak = 0;
        for (let i = 0; i < 365; i++) {
          const checkDate = new Date(today);
          checkDate.setDate(today.getDate() - i);
          const dateStr = checkDate.toISOString().split('T')[0];
          
          if (updatedDates.includes(dateStr)) {
            streak++;
          } else {
            break;
          }
        }
        
        return {
          ...habit,
          completedDates: updatedDates,
          streak
        };
      }
      return habit;
    }));
  };

  const deleteHabit = (habitId: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== habitId));
  };

  const today = new Date().toISOString().split('T')[0];
  const completedToday = habits.filter(habit => habit.completedDates.includes(today)).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Habit Tracker</h1>
              <p className="text-sm text-gray-600 mt-1">
                {completedToday} of {habits.length} habits completed today
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveView('habits')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeView === 'habits'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Calendar className="w-4 h-4 inline mr-1" />
                Habits
              </button>
              <button
                onClick={() => setActiveView('stats')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeView === 'stats'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <TrendingUp className="w-4 h-4 inline mr-1" />
                Stats
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {activeView === 'habits' ? (
          <div>
            {/* Add Habit Button */}
            <div className="mb-8">
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                Add New Habit
              </button>
            </div>

            {/* Habits Grid */}
            {habits.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No habits yet</h3>
                <p className="text-gray-600 mb-4">Start building better habits by adding your first one.</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Your First Habit
                </button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {habits.map(habit => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    onToggle={toggleHabit}
                    onDelete={deleteHabit}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <StatsView habits={habits} />
        )}
      </main>

      {/* Add Habit Modal */}
      {showAddModal && (
        <AddHabitModal
          onAdd={addHabit}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}

export default App;
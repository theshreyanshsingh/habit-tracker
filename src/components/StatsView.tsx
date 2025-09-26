import React from 'react';
import { TrendingUp, Calendar, Target, Award } from 'lucide-react';
import { Habit } from '../App';

interface StatsViewProps {
  habits: Habit[];
}

const StatsView: React.FC<StatsViewProps> = ({ habits }) => {
  const today = new Date().toISOString().split('T')[0];
  const completedToday = habits.filter(habit => habit.completedDates.includes(today)).length;
  const totalHabits = habits.length;
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
  
  // Calculate total completed habits across all time
  const totalCompletions = habits.reduce((sum, habit) => sum + habit.completedDates.length, 0);
  
  // Find longest streak
  const longestStreak = habits.reduce((max, habit) => Math.max(max, habit.streak), 0);
  
  // Calculate this week's completion rate
  const thisWeekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  });
  
  const thisWeekCompletions = thisWeekDates.reduce((sum, date) => {
    return sum + habits.filter(habit => habit.completedDates.includes(date)).length;
  }, 0);
  
  const thisWeekPossible = totalHabits * 7;
  const weeklyRate = thisWeekPossible > 0 ? Math.round((thisWeekCompletions / thisWeekPossible) * 100) : 0;

  const stats = [
    {
      icon: Target,
      label: 'Today\'s Progress',
      value: `${completedToday}/${totalHabits}`,
      percentage: completionRate,
      color: 'blue',
    },
    {
      icon: TrendingUp,
      label: 'Weekly Rate',
      value: `${weeklyRate}%`,
      percentage: weeklyRate,
      color: 'green',
    },
    {
      icon: Award,
      label: 'Longest Streak',
      value: `${longestStreak} days`,
      percentage: Math.min(longestStreak * 2, 100),
      color: 'orange',
    },
    {
      icon: Calendar,
      label: 'Total Completions',
      value: totalCompletions.toString(),
      percentage: Math.min(totalCompletions, 100),
      color: 'purple',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      green: 'bg-green-100 text-green-700 border-green-200',
      orange: 'bg-orange-100 text-orange-700 border-orange-200',
      purple: 'bg-purple-100 text-purple-700 border-purple-200',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getProgressColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      orange: 'bg-orange-500',
      purple: 'bg-purple-500',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Progress</h2>
        <p className="text-gray-600">Track your habit-building journey</p>
      </div>

      {totalHabits === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No data yet</h3>
          <p className="text-gray-600">Add some habits to see your progress statistics.</p>
        </div>
      ) : (
        <div>
          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg ${getColorClasses(stat.color)}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(stat.color)}`}
                      style={{ width: `${stat.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Habits Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Habits Overview</h3>
            <div className="space-y-4">
              {habits.map((habit) => {
                const completionRate = habit.completedDates.length > 0 
                  ? Math.round((habit.completedDates.length / Math.max(1, Math.ceil((new Date().getTime() - new Date(habit.createdAt).getTime()) / (1000 * 60 * 60 * 24)))) * 100)
                  : 0;
                
                return (
                  <div key={habit.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: habit.color }}
                      />
                      <div>
                        <div className="font-medium text-gray-900">{habit.name}</div>
                        <div className="text-sm text-gray-600">
                          {habit.streak} day streak • {habit.completedDates.length} total completions
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{Math.min(completionRate, 100)}%</div>
                      <div className="text-xs text-gray-500">completion rate</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsView;
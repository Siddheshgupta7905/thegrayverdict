import React from 'react';
import { ArrowLeft, Trophy, Star, Target, Calendar, TrendingUp, Award, Flame } from 'lucide-react';
import { UserProgress } from '../types/game';

interface ProfileDashboardProps {
  userProgress: UserProgress;
  onBack: () => void;
}

const ProfileDashboard: React.FC<ProfileDashboardProps> = ({ userProgress, onBack }) => {
  const achievements = [
    {
      id: 'first-win',
      title: 'First Victory',
      description: 'Complete your first debate challenge',
      icon: '🎯',
      unlocked: userProgress.gamesCompleted > 0,
      category: 'milestone'
    },
    {
      id: 'fallacy-hunter',
      title: 'Fallacy Hunter',
      description: 'Spot 10 logical fallacies correctly',
      icon: '🔍',
      unlocked: userProgress.gamesCompleted >= 3,
      category: 'skill'
    },
    {
      id: 'argumentation-master',
      title: 'Argumentation Master',
      description: 'Build 5 high-quality arguments',
      icon: '🏗️',
      unlocked: userProgress.gamesCompleted >= 5,
      category: 'skill'
    },
    {
      id: 'streak-warrior',
      title: 'Streak Warrior',
      description: 'Maintain a 7-day learning streak',
      icon: '🔥',
      unlocked: userProgress.streakDays >= 7,
      category: 'dedication'
    },
    {
      id: 'debate-scholar',
      title: 'Debate Scholar',
      description: 'Reach Level 10',
      icon: '🎓',
      unlocked: userProgress.level >= 10,
      category: 'progression'
    },
    {
      id: 'logic-champion',
      title: 'Logic Champion',
      description: 'Complete all game modes',
      icon: '👑',
      unlocked: userProgress.gamesCompleted >= 15,
      category: 'mastery'
    }
  ];

  const stats = [
    {
      label: 'Current Level',
      value: userProgress.level,
      icon: <Trophy className="h-6 w-6 text-yellow-400" />,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      label: 'Total XP',
      value: userProgress.xp.toLocaleString(),
      icon: <Star className="h-6 w-6 text-blue-400" />,
      color: 'from-blue-500 to-purple-500'
    },
    {
      label: 'Games Won',
      value: userProgress.gamesCompleted,
      icon: <Target className="h-6 w-6 text-green-400" />,
      color: 'from-green-500 to-teal-500'
    },
    {
      label: 'Learning Streak',
      value: userProgress.streakDays,
      icon: <Flame className="h-6 w-6 text-red-400" />,
      color: 'from-red-500 to-pink-500'
    }
  ];

  const getProgressToNextLevel = () => {
    return userProgress.xp % 100;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'milestone': return 'from-blue-600 to-blue-400';
      case 'skill': return 'from-green-600 to-green-400';
      case 'dedication': return 'from-red-600 to-red-400';
      case 'progression': return 'from-purple-600 to-purple-400';
      case 'mastery': return 'from-yellow-600 to-yellow-400';
      default: return 'from-gray-600 to-gray-400';
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Menu</span>
          </button>
          
          <h1 className="text-3xl font-bold text-white">Debate Profile</h1>
          
          <div className="flex items-center space-x-2 bg-gray-800/50 rounded-full px-4 py-2">
            <Trophy className="h-5 w-5 text-yellow-400" />
            <span className="text-white font-medium">Level {userProgress.level}</span>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-gray-900/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`bg-gradient-to-r ${stat.color} p-2 rounded-lg`}>
                  {stat.icon}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Level Progress */}
        <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-8 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Level Progress</h2>
            <div className="flex items-center space-x-3">
              <span className="text-gray-400">Level {userProgress.level}</span>
              <TrendingUp className="h-5 w-5 text-green-400" />
              <span className="text-gray-400">Level {userProgress.level + 1}</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-400">
              <span>{getProgressToNextLevel()} / 100 XP</span>
              <span>{100 - getProgressToNextLevel()} XP to next level</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                style={{ width: `${getProgressToNextLevel()}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-pulse"></div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="text-center bg-gray-800/50 rounded-lg p-4">
                <div className="text-lg font-bold text-white mb-1">
                  {Math.round((getProgressToNextLevel() / 100) * 100)}% Complete
                </div>
                <div className="text-sm text-gray-400">
                  Keep playing to level up and unlock new challenges!
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-8">
          <div className="flex items-center space-x-3 mb-8">
            <Award className="h-8 w-8 text-yellow-400" />
            <h2 className="text-2xl font-bold text-white">Achievements</h2>
            <div className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
              {achievements.filter(a => a.unlocked).length} / {achievements.length}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`relative p-6 rounded-xl border transition-all duration-300 ${
                  achievement.unlocked
                    ? `bg-gradient-to-br ${getCategoryColor(achievement.category)} border-transparent`
                    : 'bg-gray-800/30 border-gray-700'
                } ${achievement.unlocked ? 'hover:scale-105' : 'opacity-60'}`}
              >
                {achievement.unlocked && (
                  <div className="absolute top-2 right-2">
                    <div className="bg-green-500 rounded-full p-1">
                      <Trophy className="h-4 w-4 text-white" />
                    </div>
                  </div>
                )}
                
                <div className="text-center">
                  <div className="text-4xl mb-3">{achievement.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{achievement.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{achievement.description}</p>
                  
                  <div className={`mt-4 text-xs uppercase tracking-wider font-medium ${
                    achievement.unlocked ? 'text-white/80' : 'text-gray-500'
                  }`}>
                    {achievement.category}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Achievement Tips */}
          <div className="mt-12 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 text-center">
              🎯 How to Unlock More Achievements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-300">
              <div className="text-center">
                <div className="text-2xl mb-2">🎮</div>
                <p><strong>Play Daily:</strong> Maintain your learning streak to unlock dedication badges</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🎯</div>
                <p><strong>Try All Modes:</strong> Each game mode has unique achievement opportunities</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">📈</div>
                <p><strong>Keep Improving:</strong> Higher scores unlock mastery-level achievements</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
import React from 'react';
import { Sword, Search, Flame, Scale, Gavel, Star, Lock, ArrowRight } from 'lucide-react';
import { UserProgress } from '../types/game';

interface GameModeSelectionProps {
  onSelectMode: (mode: string) => void;
  userProgress: UserProgress;
}

const GameModeSelection: React.FC<GameModeSelectionProps> = ({ onSelectMode, userProgress }) => {
  const gameModes = [
    {
      id: 'arena',
      title: 'The Arena',
      subtitle: 'Debate Battle Simulator',
      description: 'Face off in intense debate battles. Choose your arguments wisely and counter your opponents with logic and evidence.',
      icon: <Sword className="h-8 w-8" />,
      difficulty: 'Medium',
      estimatedTime: '15-20 min',
      xpReward: '50-100 XP',
      unlockLevel: 1,
      gradient: 'from-red-900 via-red-800 to-red-700',
      hoverGradient: 'hover:from-red-800 hover:via-red-700 hover:to-red-600'
    },
    {
      id: 'fallacy-hunt',
      title: 'Fallacy Hunt',
      subtitle: 'Spot the Logic Errors',
      description: 'Identify logical fallacies in arguments at lightning speed. Train your critical thinking with fast-paced challenges.',
      icon: <Search className="h-8 w-8" />,
      difficulty: 'Easy',
      estimatedTime: '10-15 min',
      xpReward: '30-60 XP',
      unlockLevel: 1,
      gradient: 'from-blue-900 via-blue-800 to-blue-700',
      hoverGradient: 'hover:from-blue-800 hover:via-blue-700 hover:to-blue-600'
    },
    {
      id: 'frame-flame',
      title: 'Frame the Flame',
      subtitle: 'Argument Construction',
      description: 'Build compelling arguments using evidence cards. Master the art of persuasion through strategic card play.',
      icon: <Flame className="h-8 w-8" />,
      difficulty: 'Hard',
      estimatedTime: '20-25 min',
      xpReward: '75-150 XP',
      unlockLevel: 3,
      gradient: 'from-orange-900 via-orange-800 to-orange-700',
      hoverGradient: 'hover:from-orange-800 hover:via-orange-700 hover:to-orange-600'
    },
    {
      id: 'burden-brawl',
      title: 'Burden Brawl',
      subtitle: 'Proof Assignment',
      description: 'Navigate complex scenarios by correctly assigning the burden of proof. Learn who needs to prove what.',
      icon: <Scale className="h-8 w-8" />,
      difficulty: 'Medium',
      estimatedTime: '12-18 min',
      xpReward: '40-80 XP',
      unlockLevel: 2,
      gradient: 'from-green-900 via-green-800 to-green-700',
      hoverGradient: 'hover:from-green-800 hover:via-green-700 hover:to-green-600'
    },
    {
      id: 'verdict-room',
      title: 'The Verdict Room',
      subtitle: 'Mock Jury Trial',
      description: 'Serve as judge and jury in complex cases. Weigh evidence, evaluate arguments, and deliver justice.',
      icon: <Gavel className="h-8 w-8" />,
      difficulty: 'Expert',
      estimatedTime: '25-35 min',
      xpReward: '100-200 XP',
      unlockLevel: 5,
      gradient: 'from-purple-900 via-purple-800 to-purple-700',
      hoverGradient: 'hover:from-purple-800 hover:via-purple-700 hover:to-purple-600'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Hard': return 'text-orange-400';
      case 'Expert': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
            Choose Your Challenge
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Each game mode targets different debate skills. Master them all to become a true advocate of reason.
          </p>
        </div>

        {/* Progress Overview */}
        <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-6 mb-12 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{userProgress.level}</div>
                <div className="text-sm text-gray-400">Level</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{userProgress.xp}</div>
                <div className="text-sm text-gray-400">Total XP</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{userProgress.gamesCompleted}</div>
                <div className="text-sm text-gray-400">Games Won</div>
              </div>
            </div>
            
            <div className="flex-1 max-w-md">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Progress to Level {userProgress.level + 1}</span>
                <span>{userProgress.xp % 100}/100</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-white to-gray-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(userProgress.xp % 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Game Modes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {gameModes.map((mode) => {
            const isLocked = userProgress.level < mode.unlockLevel;
            
            return (
              <div
                key={mode.id}
                className={`relative group ${isLocked ? 'opacity-60' : 'opacity-100'} transition-all duration-300`}
              >
                <div className={`bg-gradient-to-br ${mode.gradient} p-8 rounded-2xl border border-gray-700 h-full transform transition-all duration-300 ${!isLocked ? `${mode.hoverGradient} hover:scale-105 hover:shadow-2xl cursor-pointer` : 'cursor-not-allowed'}`}>
                  {isLocked && (
                    <div className="absolute top-4 right-4">
                      <Lock className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-white">{mode.icon}</div>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3].map((star) => (
                        <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">{mode.title}</h3>
                  <p className="text-gray-200 text-sm mb-4 font-medium">{mode.subtitle}</p>
                  <p className="text-gray-300 text-sm mb-6 leading-relaxed">{mode.description}</p>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Difficulty:</span>
                      <span className={`font-medium ${getDifficultyColor(mode.difficulty)}`}>
                        {mode.difficulty}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Duration:</span>
                      <span className="text-white">{mode.estimatedTime}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">XP Reward:</span>
                      <span className="text-green-400 font-medium">{mode.xpReward}</span>
                    </div>
                  </div>

                  {isLocked ? (
                    <div className="text-center">
                      <p className="text-gray-400 text-sm mb-3">
                        Unlock at Level {mode.unlockLevel}
                      </p>
                      <div className="bg-gray-800 text-gray-500 py-3 px-6 rounded-xl font-medium">
                        Locked
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => onSelectMode(mode.id)}
                      className="w-full bg-white/10 backdrop-blur-lg text-white py-3 px-6 rounded-xl font-medium hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-2 group"
                    >
                      <span>Start Challenge</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Tips Section */}
        <div className="mt-16 bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-lg border border-gray-700 rounded-2xl p-8 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">💡 Pro Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <h4 className="text-lg font-semibold text-white mb-2">Start with Fallacy Hunt</h4>
              <p className="text-gray-300 text-sm">Build your foundation by learning to spot common logical errors.</p>
            </div>
            <div className="text-center">
              <h4 className="text-lg font-semibold text-white mb-2">Practice Daily</h4>
              <p className="text-gray-300 text-sm">Consistency is key to mastering debate skills and maintaining your streak.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameModeSelection;
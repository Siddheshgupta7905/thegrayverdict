import React, { useState, useEffect } from 'react';
import { Trophy, User, Settings, BookOpen, Target, Scale, Gavel, Brain, Zap } from 'lucide-react';
import LandingPage from './components/LandingPage';
import GameModeSelection from './components/GameModeSelection';
import TheArena from './components/games/TheArena';
import FallacyHunt from './components/games/FallacyHunt';
import FrameTheFlame from './components/games/FrameTheFlame';
import BurdenBrawl from './components/games/BurdenBrawl';
import TheVerdictRoom from './components/games/TheVerdictRoom';
import ProfileDashboard from './components/ProfileDashboard';
import { GameState, UserProgress } from './types/game';

function App() {
  const [currentScreen, setCurrentScreen] = useState<string>('landing');
  const [userProgress, setUserProgress] = useState<UserProgress>({
    level: 1,
    xp: 0,
    badges: [],
    gamesCompleted: 0,
    streakDays: 0,
    totalPoints: 0
  });

  const [gameState, setGameState] = useState<GameState>({
    currentGame: null,
    score: 0,
    lives: 3,
    timeLeft: 60,
    hints: 3
  });

  useEffect(() => {
    // Load user progress from localStorage
    const savedProgress = localStorage.getItem('grayVerdictProgress');
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
  }, []);

  useEffect(() => {
    // Save progress to localStorage
    localStorage.setItem('grayVerdictProgress', JSON.stringify(userProgress));
  }, [userProgress]);

  const updateProgress = (xpGain: number, pointsGain: number) => {
    setUserProgress(prev => {
      const newXP = prev.xp + xpGain;
      const newLevel = Math.floor(newXP / 100) + 1;
      const newPoints = prev.totalPoints + pointsGain;
      
      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        totalPoints: newPoints,
        gamesCompleted: prev.gamesCompleted + 1
      };
    });
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'landing':
        return <LandingPage onStart={() => setCurrentScreen('menu')} />;
      case 'menu':
        return <GameModeSelection 
          onSelectMode={(mode) => setCurrentScreen(mode)} 
          userProgress={userProgress}
        />;
      case 'arena':
        return <TheArena 
          gameState={gameState}
          setGameState={setGameState}
          onComplete={(xp, points) => updateProgress(xp, points)}
          onBack={() => setCurrentScreen('menu')}
        />;
      case 'fallacy-hunt':
        return <FallacyHunt 
          gameState={gameState}
          setGameState={setGameState}
          onComplete={(xp, points) => updateProgress(xp, points)}
          onBack={() => setCurrentScreen('menu')}
        />;
      case 'frame-flame':
        return <FrameTheFlame 
          gameState={gameState}
          setGameState={setGameState}
          onComplete={(xp, points) => updateProgress(xp, points)}
          onBack={() => setCurrentScreen('menu')}
        />;
      case 'burden-brawl':
        return <BurdenBrawl 
          gameState={gameState}
          setGameState={setGameState}
          onComplete={(xp, points) => updateProgress(xp, points)}
          onBack={() => setCurrentScreen('menu')}
        />;
      case 'verdict-room':
        return <TheVerdictRoom 
          gameState={gameState}
          setGameState={setGameState}
          onComplete={(xp, points) => updateProgress(xp, points)}
          onBack={() => setCurrentScreen('menu')}
        />;
      case 'profile':
        return <ProfileDashboard 
          userProgress={userProgress}
          onBack={() => setCurrentScreen('menu')}
        />;
      default:
        return <GameModeSelection 
          onSelectMode={(mode) => setCurrentScreen(mode)} 
          userProgress={userProgress}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      {currentScreen !== 'landing' && (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-lg border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div 
                className="flex items-center space-x-2 cursor-pointer hover:text-gray-300 transition-colors"
                onClick={() => setCurrentScreen('menu')}
              >
                <Scale className="h-8 w-8" />
                <span className="font-bold text-xl">The Gray Verdict</span>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 bg-gray-800/50 rounded-full px-4 py-2">
                  <Trophy className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm font-medium">Level {userProgress.level}</span>
                </div>
                
                <div className="flex items-center space-x-2 bg-gray-800/50 rounded-full px-4 py-2">
                  <Zap className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-medium">{userProgress.xp} XP</span>
                </div>
                
                <button
                  onClick={() => setCurrentScreen('profile')}
                  className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                >
                  <User className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}
      
      <main className={currentScreen !== 'landing' ? 'pt-16' : ''}>
        {renderScreen()}
      </main>
    </div>
  );
}

export default App;
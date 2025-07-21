import React, { useState, useEffect } from 'react';
import { Scale, Play, Brain, Trophy, Users, Zap } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [currentFeature, setCurrentFeature] = useState(0);
  
  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Master Critical Thinking",
      description: "Learn to construct bulletproof arguments and spot logical fallacies"
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: "Gamified Learning",
      description: "Earn XP, unlock badges, and climb the leaderboards"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Real Scenarios",
      description: "Practice with courtroom trials, debates, and ethical dilemmas"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gray-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gray-600 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Logo and Title */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-white to-gray-400 p-4 rounded-full">
              <Scale className="h-16 w-16 text-black" />
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
            The Gray Verdict
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Where nothing is black or white, and every side is heard.
            Master the art of debate through engaging, interactive gameplay.
          </p>
        </div>

        {/* Features Carousel */}
        <div className="mb-12 h-32">
          <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-8 max-w-2xl mx-auto transform transition-all duration-500 hover:scale-105">
            <div className="flex items-center justify-center mb-4 text-gray-300">
              {features[currentFeature].icon}
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">
              {features[currentFeature].title}
            </h3>
            <p className="text-gray-300 text-lg">
              {features[currentFeature].description}
            </p>
          </div>
          
          {/* Feature dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentFeature(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentFeature ? 'bg-white scale-125' : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Game Modes Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
          {[
            { name: "The Arena", icon: "⚔️", color: "from-red-900 to-red-700" },
            { name: "Fallacy Hunt", icon: "🔍", color: "from-blue-900 to-blue-700" },
            { name: "Frame the Flame", icon: "🃏", color: "from-purple-900 to-purple-700" },
            { name: "Burden Brawl", icon: "⚖️", color: "from-green-900 to-green-700" },
            { name: "Verdict Room", icon: "🏛️", color: "from-yellow-900 to-yellow-700" }
          ].map((mode, index) => (
            <div
              key={mode.name}
              className={`bg-gradient-to-br ${mode.color} p-4 rounded-xl border border-gray-700 transform hover:scale-105 transition-all duration-300 opacity-80 hover:opacity-100`}
            >
              <div className="text-3xl mb-2">{mode.icon}</div>
              <div className="text-sm font-medium text-white">{mode.name}</div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="space-y-6">
          <button
            onClick={onStart}
            className="group bg-gradient-to-r from-white to-gray-300 text-black px-12 py-4 rounded-full text-xl font-bold hover:from-gray-200 hover:to-gray-400 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-white/20 flex items-center space-x-3 mx-auto"
          >
            <Play className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
            <span>Begin Your Journey</span>
          </button>
          
          <p className="text-gray-400 text-sm">
            Join thousands of students mastering debate skills
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-16 max-w-md mx-auto">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">50K+</div>
            <div className="text-sm text-gray-400">Students</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">1M+</div>
            <div className="text-sm text-gray-400">Arguments</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">95%</div>
            <div className="text-sm text-gray-400">Success Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
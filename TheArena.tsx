import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Heart, Lightbulb, Zap, Check, X } from 'lucide-react';
import { GameState } from '../../types/game';

interface TheArenaProps {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  onComplete: (xp: number, points: number) => void;
  onBack: () => void;
}

const TheArena: React.FC<TheArenaProps> = ({ gameState, setGameState, onComplete, onBack }) => {
  const [currentRound, setCurrentRound] = useState(1);
  const [selectedArgument, setSelectedArgument] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [roundScore, setRoundScore] = useState(0);

  const scenarios = [
    {
      topic: "School Uniforms",
      context: "The debate is whether schools should require uniforms. You're arguing FOR uniforms.",
      opponent: "Uniforms stifle creativity and self-expression. Students should have the freedom to dress as they choose.",
      options: [
        {
          id: 'a',
          text: "Uniforms eliminate economic differences and reduce bullying based on clothing.",
          strength: 85,
          feedback: "Excellent! This addresses both equality and bullying prevention - two strong pillars of the pro-uniform argument."
        },
        {
          id: 'b',
          text: "Students can still express themselves through hairstyles and accessories.",
          strength: 60,
          feedback: "Good point, but this somewhat concedes the opponent's argument about self-expression rather than challenging it directly."
        },
        {
          id: 'c',
          text: "Creativity should come from academic work, not clothing choices.",
          strength: 45,
          feedback: "Weak response. This dismisses the importance of self-expression entirely, which could alienate judges."
        }
      ]
    },
    {
      topic: "Social Media Age Limits",
      context: "Debating whether social media platforms should have stricter age verification. You're arguing AGAINST strict limits.",
      opponent: "Teens are vulnerable to cyberbullying, addiction, and mental health issues from social media use.",
      options: [
        {
          id: 'a',
          text: "Education about responsible use is better than blanket restrictions that teens will circumvent anyway.",
          strength: 80,
          feedback: "Strong argument! You acknowledge the problem while proposing a more practical solution."
        },
        {
          id: 'b',
          text: "Social media helps teens connect with others and find communities, especially marginalized groups.",
          strength: 90,
          feedback: "Powerful counter-argument! You've reframed social media as a tool for inclusion and support."
        },
        {
          id: 'c',
          text: "Parents should monitor their children, not the government or companies.",
          strength: 65,
          feedback: "Reasonable point about parental responsibility, but doesn't fully address the scale of the problem."
        }
      ]
    },
    {
      topic: "AI in Education",
      context: "The debate is about using AI tutoring systems in schools. You're arguing FOR AI integration.",
      opponent: "AI tutors cannot replace human teachers' emotional intelligence and adaptability to individual student needs.",
      options: [
        {
          id: 'a',
          text: "AI doesn't replace teachers but enhances their ability to provide personalized learning at scale.",
          strength: 95,
          feedback: "Brilliant reframe! You've positioned AI as a tool that empowers teachers rather than threatens them."
        },
        {
          id: 'b',
          text: "AI can provide 24/7 availability for student questions and practice.",
          strength: 70,
          feedback: "Good practical benefit, though it doesn't directly address the emotional intelligence concern."
        },
        {
          id: 'c',
          text: "Human teachers are expensive and there's a shortage in many areas.",
          strength: 40,
          feedback: "This sounds callous and reduces teachers to mere cost centers. Avoid arguments that devalue human worth."
        }
      ]
    }
  ];

  const currentScenario = scenarios[currentRound - 1];

  useEffect(() => {
    setGameState({
      ...gameState,
      currentGame: 'arena',
      timeLeft: 30,
      score: roundScore
    });
  }, [roundScore]);

  const handleArgumentSelect = (argumentId: string) => {
    if (selectedArgument || showFeedback) return;
    
    setSelectedArgument(argumentId);
    const selected = currentScenario.options.find(opt => opt.id === argumentId);
    
    if (selected) {
      const points = Math.round(selected.strength * 0.8);
      setRoundScore(prev => prev + points);
      setTimeout(() => {
        setShowFeedback(true);
      }, 500);
    }
  };

  const handleNextRound = () => {
    if (currentRound < scenarios.length) {
      setCurrentRound(prev => prev + 1);
      setSelectedArgument(null);
      setShowFeedback(false);
    } else {
      // Game complete
      const totalXP = Math.round(roundScore * 1.2);
      onComplete(totalXP, roundScore);
    }
  };

  const getStrengthColor = (strength: number) => {
    if (strength >= 80) return 'text-green-400 bg-green-900/30';
    if (strength >= 60) return 'text-yellow-400 bg-yellow-900/30';
    return 'text-red-400 bg-red-900/30';
  };

  const getStrengthLabel = (strength: number) => {
    if (strength >= 80) return 'Strong';
    if (strength >= 60) return 'Good';
    return 'Weak';
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Menu</span>
          </button>
          
          <div className="text-2xl font-bold text-white">The Arena</div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-800/50 rounded-full px-3 py-1">
              <Heart className="h-4 w-4 text-red-400" />
              <span className="text-sm">{gameState.lives}</span>
            </div>
            <div className="flex items-center space-x-2 bg-gray-800/50 rounded-full px-3 py-1">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span className="text-sm">{roundScore}</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Round {currentRound} of {scenarios.length}</span>
            <span>{Math.round((currentRound / scenarios.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentRound / scenarios.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Scenario */}
        <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">{currentScenario.topic}</h2>
            <p className="text-gray-300 text-lg">{currentScenario.context}</p>
          </div>

          {/* Opponent's Argument */}
          <div className="bg-red-900/20 border border-red-700/50 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-4">
              <div className="bg-red-600 rounded-full p-2 flex-shrink-0">
                <div className="w-6 h-6 bg-white rounded-full"></div>
              </div>
              <div>
                <div className="text-red-400 font-medium mb-2">Opponent argues:</div>
                <p className="text-white text-lg">{currentScenario.opponent}</p>
              </div>
            </div>
          </div>

          {/* Your Response Options */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4">Choose your response:</h3>
            
            {currentScenario.options.map((option, index) => {
              const isSelected = selectedArgument === option.id;
              const showResult = showFeedback && isSelected;
              
              return (
                <div
                  key={option.id}
                  className={`relative p-6 rounded-xl border cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-900/30'
                      : 'border-gray-700 bg-gray-800/30 hover:border-gray-600 hover:bg-gray-800/50'
                  }`}
                  onClick={() => handleArgumentSelect(option.id)}
                >
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-600 rounded-full p-2 flex-shrink-0">
                      <span className="text-white font-bold">{String.fromCharCode(65 + index)}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-lg leading-relaxed">{option.text}</p>
                      
                      {showResult && (
                        <div className="mt-4 space-y-3">
                          <div className="flex items-center space-x-3">
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStrengthColor(option.strength)}`}>
                              {getStrengthLabel(option.strength)} ({option.strength}/100)
                            </div>
                            {option.strength >= 80 ? (
                              <Check className="h-5 w-5 text-green-400" />
                            ) : option.strength >= 60 ? (
                              <Lightbulb className="h-5 w-5 text-yellow-400" />
                            ) : (
                              <X className="h-5 w-5 text-red-400" />
                            )}
                          </div>
                          <div className="bg-gray-800/50 rounded-lg p-4">
                            <p className="text-gray-300 text-sm italic">{option.feedback}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {showFeedback && (
            <div className="mt-8 text-center">
              <button
                onClick={handleNextRound}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
              >
                {currentRound < scenarios.length ? 'Next Round' : 'Complete Challenge'}
              </button>
            </div>
          )}
        </div>

        {/* Tips */}
        {!showFeedback && (
          <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-lg border border-gray-700 rounded-xl p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Lightbulb className="h-5 w-5 text-yellow-400" />
              <span className="text-yellow-400 font-medium">Strategy Tip</span>
            </div>
            <p className="text-gray-300 text-sm">
              Look for arguments that directly address your opponent's concerns while reinforcing your position. 
              The strongest rebuttals often reframe the issue entirely.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TheArena;
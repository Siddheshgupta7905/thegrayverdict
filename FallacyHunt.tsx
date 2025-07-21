import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Target, Zap, CheckCircle, XCircle, Timer } from 'lucide-react';
import { GameState } from '../../types/game';

interface FallacyHuntProps {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  onComplete: (xp: number, points: number) => void;
  onBack: () => void;
}

const FallacyHunt: React.FC<FallacyHuntProps> = ({ gameState, setGameState, onComplete, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedFallacy, setSelectedFallacy] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [streak, setStreak] = useState(0);

  const fallacyQuestions = [
    {
      statement: "You can't trust John's opinion on climate change because he drives an SUV.",
      options: [
        { id: 'ad-hominem', name: 'Ad Hominem', description: 'Attacking the person rather than their argument' },
        { id: 'straw-man', name: 'Straw Man', description: 'Misrepresenting someone\'s argument' },
        { id: 'appeal-authority', name: 'Appeal to Authority', description: 'Citing irrelevant authority' },
        { id: 'no-fallacy', name: 'No Fallacy', description: 'The argument is logically sound' }
      ],
      correct: 'ad-hominem',
      explanation: "This is Ad Hominem because it attacks John's personal choices rather than addressing his climate change argument directly."
    },
    {
      statement: "Everyone I know uses iPhone, so Android phones must be inferior.",
      options: [
        { id: 'bandwagon', name: 'Bandwagon', description: 'Assuming something is true because it\'s popular' },
        { id: 'false-cause', name: 'False Cause', description: 'Assuming correlation implies causation' },
        { id: 'hasty-generalization', name: 'Hasty Generalization', description: 'Drawing conclusions from insufficient evidence' },
        { id: 'no-fallacy', name: 'No Fallacy', description: 'The argument is logically sound' }
      ],
      correct: 'bandwagon',
      explanation: "This is the Bandwagon fallacy - assuming Android is inferior just because iPhone is popular in their social circle."
    },
    {
      statement: "We shouldn't ban plastic bags because next they'll ban all packaging materials.",
      options: [
        { id: 'slippery-slope', name: 'Slippery Slope', description: 'Assuming one action will lead to extreme consequences' },
        { id: 'false-dilemma', name: 'False Dilemma', description: 'Presenting only two options when more exist' },
        { id: 'red-herring', name: 'Red Herring', description: 'Introducing irrelevant information' },
        { id: 'no-fallacy', name: 'No Fallacy', description: 'The argument is logically sound' }
      ],
      correct: 'slippery-slope',
      explanation: "This is Slippery Slope - assuming that banning plastic bags will inevitably lead to banning all packaging."
    },
    {
      statement: "The new medication is safe because the pharmaceutical company says it has no side effects.",
      options: [
        { id: 'appeal-authority', name: 'Appeal to Authority', description: 'Citing authority with potential bias' },
        { id: 'circular-reasoning', name: 'Circular Reasoning', description: 'The conclusion is assumed in the premise' },
        { id: 'ad-hominem', name: 'Ad Hominem', description: 'Attacking the person making the argument' },
        { id: 'no-fallacy', name: 'No Fallacy', description: 'The argument is logically sound' }
      ],
      correct: 'appeal-authority',
      explanation: "This is Appeal to Authority because the pharmaceutical company has a clear financial interest in claiming their product is safe."
    },
    {
      statement: "You're either with us in this fight against corruption, or you're part of the problem.",
      options: [
        { id: 'false-dilemma', name: 'False Dilemma', description: 'Presenting only two options when more exist' },
        { id: 'appeal-emotion', name: 'Appeal to Emotion', description: 'Using emotions rather than logic' },
        { id: 'bandwagon', name: 'Bandwagon', description: 'Assuming popularity equals correctness' },
        { id: 'no-fallacy', name: 'No Fallacy', description: 'The argument is logically sound' }
      ],
      correct: 'false-dilemma',
      explanation: "This is False Dilemma - it presents only two extreme positions when there are many nuanced stances on fighting corruption."
    }
  ];

  const currentQ = fallacyQuestions[currentQuestion];

  useEffect(() => {
    if (timeLeft > 0 && !showAnswer) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showAnswer) {
      // Time's up - show as incorrect
      setShowAnswer(true);
      setStreak(0);
    }
  }, [timeLeft, showAnswer]);

  useEffect(() => {
    setGameState({
      ...gameState,
      currentGame: 'fallacy-hunt',
      score: score,
      timeLeft: timeLeft
    });
  }, [score, timeLeft]);

  const handleFallacySelect = (fallacyId: string) => {
    if (showAnswer) return;
    
    setSelectedFallacy(fallacyId);
    setShowAnswer(true);
    
    if (fallacyId === currentQ.correct) {
      const timeBonus = Math.max(0, timeLeft * 5);
      const streakBonus = streak * 10;
      const points = 50 + timeBonus + streakBonus;
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentQuestion < fallacyQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedFallacy(null);
      setShowAnswer(false);
      setTimeLeft(15);
    } else {
      // Game complete
      const totalXP = Math.round(score * 0.8);
      onComplete(totalXP, score);
    }
  };

  const getTimeColor = () => {
    if (timeLeft > 10) return 'text-green-400';
    if (timeLeft > 5) return 'text-yellow-400';
    return 'text-red-400';
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
          
          <div className="text-2xl font-bold text-white">Fallacy Hunt</div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-800/50 rounded-full px-3 py-1">
              <Target className="h-4 w-4 text-blue-400" />
              <span className="text-sm">{streak} streak</span>
            </div>
            <div className="flex items-center space-x-2 bg-gray-800/50 rounded-full px-3 py-1">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span className="text-sm">{score}</span>
            </div>
          </div>
        </div>

        {/* Timer */}
        <div className="mb-8 flex justify-center">
          <div className={`flex items-center space-x-3 bg-gray-900/50 backdrop-blur-lg border border-gray-700 rounded-full px-6 py-3 ${getTimeColor()}`}>
            <Timer className="h-6 w-6" />
            <span className="text-2xl font-bold">{timeLeft}s</span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Question {currentQuestion + 1} of {fallacyQuestions.length}</span>
            <span>{Math.round(((currentQuestion + 1) / fallacyQuestions.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / fallacyQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Identify the Logical Fallacy</h2>
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-600">
              <p className="text-xl text-gray-100 leading-relaxed italic">
                "{currentQ.statement}"
              </p>
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQ.options.map((option) => {
              const isSelected = selectedFallacy === option.id;
              const isCorrect = option.id === currentQ.correct;
              const showResult = showAnswer && isSelected;
              
              let bgClass = 'bg-gray-800/30 border-gray-700 hover:border-gray-600';
              if (showAnswer) {
                if (isCorrect) {
                  bgClass = 'bg-green-900/30 border-green-500';
                } else if (isSelected && !isCorrect) {
                  bgClass = 'bg-red-900/30 border-red-500';
                }
              } else if (isSelected) {
                bgClass = 'bg-blue-900/30 border-blue-500';
              }

              return (
                <div
                  key={option.id}
                  className={`p-6 rounded-xl border cursor-pointer transition-all duration-300 ${bgClass} ${!showAnswer ? 'hover:bg-gray-800/50' : ''}`}
                  onClick={() => handleFallacySelect(option.id)}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 pt-1">
                      {showAnswer && isCorrect && <CheckCircle className="h-6 w-6 text-green-400" />}
                      {showAnswer && isSelected && !isCorrect && <XCircle className="h-6 w-6 text-red-400" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">{option.name}</h3>
                      <p className="text-gray-300 text-sm">{option.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Explanation */}
          {showAnswer && (
            <div className="mt-8 bg-gray-800/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">
                {selectedFallacy === currentQ.correct ? '🎉 Correct!' : '❌ Not quite...'}
              </h3>
              <p className="text-gray-300 leading-relaxed">{currentQ.explanation}</p>
              
              <div className="mt-6 text-center">
                <button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-8 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-green-600 transition-all duration-300 transform hover:scale-105"
                >
                  {currentQuestion < fallacyQuestions.length - 1 ? 'Next Question' : 'Complete Hunt'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Performance */}
        {streak > 0 && !showAnswer && (
          <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-600 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center space-x-2 text-yellow-400">
              <Target className="h-5 w-5" />
              <span className="font-medium">
                {streak} question streak! +{streak * 10} bonus points on correct answers!
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FallacyHunt;
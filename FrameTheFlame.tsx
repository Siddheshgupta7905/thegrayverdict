import React, { useState, useEffect } from 'react';
import { ArrowLeft, Flame, Star, Plus, ArrowRight, Check } from 'lucide-react';
import { GameState } from '../../types/game';

interface FrameTheFlameProps {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  onComplete: (xp: number, points: number) => void;
  onBack: () => void;
}

interface ArgumentCard {
  id: string;
  text: string;
  type: 'claim' | 'evidence' | 'reasoning' | 'counterpoint';
  strength: number;
  category: string;
}

const FrameTheFlame: React.FC<FrameTheFlameProps> = ({ gameState, setGameState, onComplete, onBack }) => {
  const [currentTopic, setCurrentTopic] = useState(0);
  const [selectedCards, setSelectedCards] = useState<ArgumentCard[]>([]);
  const [availableCards, setAvailableCards] = useState<ArgumentCard[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const topics = [
    {
      title: "Should Schools Ban Homework?",
      description: "Build a compelling argument for either side of this educational debate.",
      cards: [
        { id: '1', text: 'Homework reinforces classroom learning', type: 'claim' as const, strength: 80, category: 'pro' },
        { id: '2', text: 'Studies show students in Finland excel without traditional homework', type: 'evidence' as const, strength: 90, category: 'con' },
        { id: '3', text: 'Family time is crucial for child development', type: 'reasoning' as const, strength: 75, category: 'con' },
        { id: '4', text: 'Practice makes perfect in academic subjects', type: 'reasoning' as const, strength: 70, category: 'pro' },
        { id: '5', text: 'Homework creates stress and mental health issues', type: 'evidence' as const, strength: 85, category: 'con' },
        { id: '6', text: 'Not all students have equal support at home', type: 'counterpoint' as const, strength: 95, category: 'con' },
        { id: '7', text: 'Homework teaches time management skills', type: 'claim' as const, strength: 65, category: 'pro' },
        { id: '8', text: 'Quality classroom instruction eliminates need for repetition', type: 'reasoning' as const, strength: 80, category: 'con' }
      ]
    }
  ];

  const currentTopicData = topics[currentTopic];

  useEffect(() => {
    setAvailableCards([...currentTopicData.cards].sort(() => Math.random() - 0.5));
  }, [currentTopic]);

  const getCardTypeColor = (type: string) => {
    switch (type) {
      case 'claim': return 'from-blue-900 to-blue-700 border-blue-600';
      case 'evidence': return 'from-green-900 to-green-700 border-green-600';
      case 'reasoning': return 'from-purple-900 to-purple-700 border-purple-600';
      case 'counterpoint': return 'from-red-900 to-red-700 border-red-600';
      default: return 'from-gray-900 to-gray-700 border-gray-600';
    }
  };

  const getCardTypeIcon = (type: string) => {
    switch (type) {
      case 'claim': return '🎯';
      case 'evidence': return '📊';
      case 'reasoning': return '🧠';
      case 'counterpoint': return '⚡';
      default: return '📝';
    }
  };

  const addCard = (card: ArgumentCard) => {
    if (selectedCards.length < 4) {
      setSelectedCards([...selectedCards, card]);
      setAvailableCards(availableCards.filter(c => c.id !== card.id));
    }
  };

  const removeCard = (cardId: string) => {
    const card = selectedCards.find(c => c.id === cardId);
    if (card) {
      setSelectedCards(selectedCards.filter(c => c.id !== cardId));
      setAvailableCards([...availableCards, card].sort(() => Math.random() - 0.5));
    }
  };

  const evaluateArgument = () => {
    if (selectedCards.length < 3) return;

    // Calculate argument strength
    const baseScore = selectedCards.reduce((sum, card) => sum + card.strength, 0);
    
    // Check for argument structure
    const hasClaim = selectedCards.some(card => card.type === 'claim');
    const hasEvidence = selectedCards.some(card => card.type === 'evidence');
    const hasReasoning = selectedCards.some(card => card.type === 'reasoning');
    
    let structureBonus = 0;
    if (hasClaim && hasEvidence && hasReasoning) structureBonus = 50;
    else if ((hasClaim && hasEvidence) || (hasClaim && hasReasoning)) structureBonus = 25;

    // Check for coherence (same category)
    const categories = selectedCards.map(card => card.category);
    const isCoherent = categories.every(cat => cat === categories[0]);
    const coherenceBonus = isCoherent ? 30 : 0;

    const totalScore = Math.round((baseScore + structureBonus + coherenceBonus) / selectedCards.length);
    setScore(totalScore);
    setShowResult(true);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 85) return 'Excellent Argument!';
    if (score >= 70) return 'Good Argument';
    return 'Needs Improvement';
  };

  const completeChallenge = () => {
    const xpGain = Math.round(score * 1.5);
    onComplete(xpGain, score);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Menu</span>
          </button>
          
          <div className="flex items-center space-x-2 text-2xl font-bold text-white">
            <Flame className="h-8 w-8 text-orange-400" />
            <span>Frame the Flame</span>
          </div>
          
          <div className="flex items-center space-x-2 bg-gray-800/50 rounded-full px-4 py-2">
            <Star className="h-4 w-4 text-yellow-400" />
            <span className="text-sm">{score} points</span>
          </div>
        </div>

        {/* Topic */}
        <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-8 mb-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">{currentTopicData.title}</h2>
            <p className="text-gray-300 text-lg">{currentTopicData.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Available Cards */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <span>Available Cards</span>
              <div className="text-sm text-gray-400">({availableCards.length} remaining)</div>
            </h3>
            
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {availableCards.map((card) => (
                <div
                  key={card.id}
                  className={`bg-gradient-to-r ${getCardTypeColor(card.type)} p-4 rounded-xl border cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg`}
                  onClick={() => addCard(card)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getCardTypeIcon(card.type)}</span>
                      <span className="text-sm font-medium text-white uppercase tracking-wider">
                        {card.type}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-yellow-400">{card.strength}</span>
                    </div>
                  </div>
                  <p className="text-white text-sm leading-relaxed">{card.text}</p>
                  <div className="mt-3 flex justify-center">
                    <Plus className="h-5 w-5 text-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Argument Builder */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <span>Your Argument</span>
              <div className="text-sm text-gray-400">({selectedCards.length}/4 cards)</div>
            </h3>

            {selectedCards.length === 0 ? (
              <div className="bg-gray-800/30 border-2 border-dashed border-gray-600 rounded-xl p-12 text-center">
                <Flame className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-2">Build your argument here</p>
                <p className="text-gray-500 text-sm">Select cards from the left to start building</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedCards.map((card, index) => (
                  <div
                    key={`${card.id}-selected`}
                    className={`bg-gradient-to-r ${getCardTypeColor(card.type)} p-4 rounded-xl border relative group`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="bg-white text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                        <span className="text-lg">{getCardTypeIcon(card.type)}</span>
                        <span className="text-sm font-medium text-white uppercase tracking-wider">
                          {card.type}
                        </span>
                      </div>
                      <button
                        onClick={() => removeCard(card.id)}
                        className="opacity-0 group-hover:opacity-100 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm transition-all duration-200"
                      >
                        ×
                      </button>
                    </div>
                    <p className="text-white text-sm leading-relaxed">{card.text}</p>
                  </div>
                ))}

                {selectedCards.length >= 3 && (
                  <div className="pt-4">
                    <button
                      onClick={evaluateArgument}
                      disabled={showResult}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-6 rounded-xl font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      <ArrowRight className="h-5 w-5" />
                      <span>Evaluate Argument</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Results */}
            {showResult && (
              <div className="mt-8 bg-gray-900/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
                <div className="text-center mb-6">
                  <div className={`text-4xl font-bold mb-2 ${getScoreColor(score)}`}>
                    {score}/100
                  </div>
                  <div className={`text-xl font-medium mb-4 ${getScoreColor(score)}`}>
                    {getScoreLabel(score)}
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Structure:</span>
                    <span className="text-white">
                      {selectedCards.some(c => c.type === 'claim') && 
                       selectedCards.some(c => c.type === 'evidence') && 
                       selectedCards.some(c => c.type === 'reasoning') ? (
                        <Check className="h-4 w-4 text-green-400 inline" />
                      ) : '⚠️'}
                      {' '}Complete
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Coherence:</span>
                    <span className="text-white">
                      {selectedCards.every(card => card.category === selectedCards[0]?.category) ? (
                        <Check className="h-4 w-4 text-green-400 inline" />
                      ) : '⚠️'}
                      {' '}Consistent Position
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Average Strength:</span>
                    <span className="text-white">
                      {Math.round(selectedCards.reduce((sum, card) => sum + card.strength, 0) / selectedCards.length)}/100
                    </span>
                  </div>
                </div>

                <button
                  onClick={completeChallenge}
                  className="w-full mt-6 bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-6 rounded-xl font-medium hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
                >
                  Complete Challenge (+{Math.round(score * 1.5)} XP)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tips */}
        <div className="mt-12 bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 text-center">💡 Argument Building Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
            <div className="text-center">
              <div className="text-2xl mb-2">🎯</div>
              <p><strong>Start with a Claim:</strong> Make your position clear from the beginning</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">📊</div>
              <p><strong>Support with Evidence:</strong> Use data, studies, or examples to back up your claims</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🧠</div>
              <p><strong>Connect with Reasoning:</strong> Explain why your evidence supports your claim</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrameTheFlame;
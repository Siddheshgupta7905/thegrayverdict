import React, { useState, useEffect } from 'react';
import { ArrowLeft, Scale, CheckCircle, XCircle, Lightbulb, Award } from 'lucide-react';
import { GameState } from '../../types/game';

interface BurdenBrawlProps {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  onComplete: (xp: number, points: number) => void;
  onBack: () => void;
}

interface BurdenScenario {
  id: string;
  title: string;
  scenario: string;
  claim: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  correctAnswer: string;
  reasoning: string;
}

const BurdenBrawl: React.FC<BurdenBrawlProps> = ({ gameState, setGameState, onComplete, onBack }) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const scenarios: BurdenScenario[] = [
    {
      id: '1',
      title: 'Medical Claims',
      scenario: 'Dr. Smith claims that a new herbal supplement can cure diabetes.',
      claim: 'The herbal supplement cures diabetes',
      options: [
        {
          id: 'patient',
          text: 'Patients must prove it doesn\'t work',
          isCorrect: false,
          explanation: 'Patients are not making the claim, so they don\'t bear the burden of proof.'
        },
        {
          id: 'doctor',
          text: 'Dr. Smith must prove it works',
          isCorrect: true,
          explanation: 'The person making the positive claim bears the burden of proof. Dr. Smith must provide evidence.'
        },
        {
          id: 'government',
          text: 'The government must investigate',
          isCorrect: false,
          explanation: 'While the government may regulate, the burden of proof for the claim lies with Dr. Smith.'
        },
        {
          id: 'equal',
          text: 'Both sides must prove their case',
          isCorrect: false,
          explanation: 'The burden lies primarily with the claimant, not equally distributed.'
        }
      ],
      correctAnswer: 'doctor',
      reasoning: 'In logic and law, the burden of proof lies with the person making the claim. Dr. Smith must provide evidence that the supplement works.'
    },
    {
      id: '2',
      title: 'Supernatural Claims',
      scenario: 'Alex argues that ghosts exist and are responsible for strange noises in their house.',
      claim: 'Ghosts exist and are causing the noises',
      options: [
        {
          id: 'alex',
          text: 'Alex must prove ghosts exist',
          isCorrect: true,
          explanation: 'Alex is making the extraordinary claim and must provide extraordinary evidence.'
        },
        {
          id: 'skeptics',
          text: 'Skeptics must prove ghosts don\'t exist',
          isCorrect: false,
          explanation: 'You cannot prove a negative. The burden lies with the person making the positive claim.'
        },
        {
          id: 'scientists',
          text: 'Scientists must investigate all possibilities',
          isCorrect: false,
          explanation: 'While scientists may investigate, the burden of proof for the specific claim lies with Alex.'
        },
        {
          id: 'shared',
          text: 'The burden should be shared equally',
          isCorrect: false,
          explanation: 'The burden of proof is not typically shared equally - it lies with the claimant.'
        }
      ],
      correctAnswer: 'alex',
      reasoning: 'Extraordinary claims require extraordinary evidence. The person claiming supernatural activity must provide proof.'
    },
    {
      id: '3',
      title: 'Criminal Justice',
      scenario: 'In a criminal trial, the prosecutor claims the defendant committed murder.',
      claim: 'The defendant is guilty of murder',
      options: [
        {
          id: 'defendant',
          text: 'The defendant must prove innocence',
          isCorrect: false,
          explanation: 'In criminal law, the defendant is presumed innocent. They don\'t need to prove innocence.'
        },
        {
          id: 'prosecutor',
          text: 'The prosecutor must prove guilt',
          isCorrect: true,
          explanation: 'The prosecution bears the burden of proving guilt beyond reasonable doubt.'
        },
        {
          id: 'jury',
          text: 'The jury must decide who to believe',
          isCorrect: false,
          explanation: 'The jury evaluates evidence, but the burden of proof lies with the prosecution.'
        },
        {
          id: 'judge',
          text: 'The judge determines burden distribution',
          isCorrect: false,
          explanation: 'Legal principles, not judicial discretion, determine that prosecution bears the burden.'
        }
      ],
      correctAnswer: 'prosecutor',
      reasoning: 'In criminal cases, the prosecution must prove guilt beyond reasonable doubt. The defendant is presumed innocent.'
    },
    {
      id: '4',
      title: 'Product Safety',
      scenario: 'A company launches a new cleaning product and claims it\'s completely safe for children.',
      claim: 'The cleaning product is completely safe for children',
      options: [
        {
          id: 'company',
          text: 'The company must prove it\'s safe',
          isCorrect: true,
          explanation: 'Companies making safety claims about their products must provide evidence to support those claims.'
        },
        {
          id: 'customers',
          text: 'Customers must prove it\'s unsafe',
          isCorrect: false,
          explanation: 'Customers aren\'t making the safety claim, so they don\'t bear the initial burden of proof.'
        },
        {
          id: 'regulators',
          text: 'Government regulators must test it',
          isCorrect: false,
          explanation: 'While regulators may test, the burden of proof for safety claims lies with the company.'
        },
        {
          id: 'independent',
          text: 'Independent labs must verify',
          isCorrect: false,
          explanation: 'The company making the claim bears the burden, though they may use independent verification.'
        }
      ],
      correctAnswer: 'company',
      reasoning: 'Companies making specific claims about their products must provide evidence to support those claims, especially regarding safety.'
    }
  ];

  const currentScenarioData = scenarios[currentScenario];

  useEffect(() => {
    setGameState({
      ...gameState,
      currentGame: 'burden-brawl',
      score: score
    });
  }, [score]);

  const handleOptionSelect = (optionId: string) => {
    if (showFeedback) return;
    
    setSelectedOption(optionId);
    setShowFeedback(true);
    
    const isCorrect = currentScenarioData.options.find(opt => opt.id === optionId)?.isCorrect;
    
    if (isCorrect) {
      setScore(prev => prev + 100);
      setCorrectAnswers(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(prev => prev + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      // Game complete
      const totalXP = Math.round(score * 1.0);
      onComplete(totalXP, score);
    }
  };

  const getOptionClass = (option: any) => {
    if (!showFeedback) {
      return selectedOption === option.id 
        ? 'border-blue-500 bg-blue-900/30' 
        : 'border-gray-700 bg-gray-800/30 hover:border-gray-600 hover:bg-gray-800/50';
    }
    
    if (option.isCorrect) {
      return 'border-green-500 bg-green-900/30';
    } else if (selectedOption === option.id && !option.isCorrect) {
      return 'border-red-500 bg-red-900/30';
    } else {
      return 'border-gray-700 bg-gray-800/30';
    }
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
          
          <div className="flex items-center space-x-2 text-2xl font-bold text-white">
            <Scale className="h-8 w-8 text-green-400" />
            <span>Burden Brawl</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-800/50 rounded-full px-3 py-1">
              <Award className="h-4 w-4 text-green-400" />
              <span className="text-sm">{correctAnswers}/{scenarios.length}</span>
            </div>
            <div className="flex items-center space-x-2 bg-gray-800/50 rounded-full px-3 py-1">
              <span className="text-sm">{score} pts</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Scenario {currentScenario + 1} of {scenarios.length}</span>
            <span>{Math.round(((currentScenario + 1) / scenarios.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentScenario + 1) / scenarios.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Scenario */}
        <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">{currentScenarioData.title}</h2>
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-600 mb-6">
              <p className="text-xl text-gray-100 leading-relaxed">
                {currentScenarioData.scenario}
              </p>
            </div>
            <div className="bg-blue-900/30 border border-blue-600 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-blue-400 mb-2">Question:</h3>
              <p className="text-white">Who bears the burden of proof for this claim?</p>
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {currentScenarioData.options.map((option, index) => (
              <div
                key={option.id}
                className={`p-6 rounded-xl border cursor-pointer transition-all duration-300 ${getOptionClass(option)}`}
                onClick={() => handleOptionSelect(option.id)}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 pt-1">
                    <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center font-bold text-sm">
                      {String.fromCharCode(65 + index)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-lg leading-relaxed">{option.text}</p>
                    
                    {showFeedback && selectedOption === option.id && (
                      <div className="mt-4 flex items-start space-x-3">
                        {option.isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-400 mt-1 flex-shrink-0" />
                        )}
                        <p className="text-gray-300 text-sm">{option.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-600">
              <div className="flex items-start space-x-3 mb-4">
                <Lightbulb className="h-6 w-6 text-yellow-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Legal Principle:</h3>
                  <p className="text-gray-300 leading-relaxed">{currentScenarioData.reasoning}</p>
                </div>
              </div>
              
              <div className="text-center pt-6">
                <button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-xl font-medium hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
                >
                  {currentScenario < scenarios.length - 1 ? 'Next Scenario' : 'Complete Brawl'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Key Concepts */}
        {!showFeedback && (
          <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 text-center flex items-center justify-center space-x-2">
              <Scale className="h-5 w-5 text-green-400" />
              <span>Burden of Proof Principles</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
              <div className="text-center">
                <div className="text-2xl mb-2">⚖️</div>
                <p><strong>Claimant's Responsibility:</strong> The person making the claim must provide evidence</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🚫</div>
                <p><strong>Proving Negatives:</strong> Generally impossible to prove something doesn't exist</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">📊</div>
                <p><strong>Extraordinary Claims:</strong> Require extraordinary evidence</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BurdenBrawl;
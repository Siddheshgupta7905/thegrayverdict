import React, { useState, useEffect } from 'react';
import { ArrowLeft, Gavel, Users, Clock, CheckCircle2, AlertCircle, Scale } from 'lucide-react';
import { GameState } from '../../types/game';

interface TheVerdictRoomProps {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  onComplete: (xp: number, points: number) => void;
  onBack: () => void;
}

interface Evidence {
  id: string;
  type: 'witness' | 'physical' | 'expert' | 'document';
  title: string;
  description: string;
  credibility: number;
  relevance: number;
  side: 'prosecution' | 'defense';
}

interface TrialCase {
  id: string;
  title: string;
  description: string;
  charge: string;
  evidence: Evidence[];
  verdict: 'guilty' | 'not-guilty';
  reasoning: string;
}

const TheVerdictRoom: React.FC<TheVerdictRoomProps> = ({ gameState, setGameState, onComplete, onBack }) => {
  const [currentPhase, setCurrentPhase] = useState<'briefing' | 'evidence' | 'deliberation' | 'verdict'>('briefing');
  const [selectedEvidence, setSelectedEvidence] = useState<string[]>([]);
  const [playerVerdict, setPlayerVerdict] = useState<'guilty' | 'not-guilty' | null>(null);
  const [evidenceScores, setEvidenceScores] = useState<{[key: string]: number}>({});
  const [timeRemaining, setTimeRemaining] = useState(180);
  const [showResult, setShowResult] = useState(false);

  const trialCase: TrialCase = {
    id: '1',
    title: 'The Case of the Missing Algorithm',
    description: 'TechCorp accuses former employee Sarah Chen of stealing proprietary AI algorithms worth $2 million before joining competitor InnovateLabs.',
    charge: 'Corporate Espionage and Trade Secret Theft',
    evidence: [
      {
        id: 'e1',
        type: 'witness',
        title: 'Former Colleague Testimony',
        description: 'Alex Kumar testifies that Sarah frequently worked late and accessed sensitive files in her final weeks.',
        credibility: 70,
        relevance: 85,
        side: 'prosecution'
      },
      {
        id: 'e2',
        type: 'physical',
        title: 'USB Drive Found',
        description: 'Security found a USB drive in Sarah\'s desk containing some proprietary code fragments.',
        credibility: 90,
        relevance: 95,
        side: 'prosecution'
      },
      {
        id: 'e3',
        type: 'document',
        title: 'Email Communications',
        description: 'Emails between Sarah and InnovateLabs discussing her new role and projects.',
        credibility: 85,
        relevance: 60,
        side: 'prosecution'
      },
      {
        id: 'e4',
        type: 'expert',
        title: 'Digital Forensics Report',
        description: 'Expert analysis shows no evidence of unauthorized file transfers from Sarah\'s work computer.',
        credibility: 95,
        relevance: 90,
        side: 'defense'
      },
      {
        id: 'e5',
        type: 'witness',
        title: 'Sarah\'s Testimony',
        description: 'Sarah explains the USB contained her personal learning projects, not TechCorp property.',
        credibility: 65,
        relevance: 80,
        side: 'defense'
      },
      {
        id: 'e6',
        type: 'document',
        title: 'Employment Contract',
        description: 'Sarah\'s contract clearly defines what constitutes proprietary information vs. general knowledge.',
        credibility: 100,
        relevance: 85,
        side: 'defense'
      },
      {
        id: 'e7',
        type: 'expert',
        title: 'Industry Expert Opinion',
        description: 'AI expert testifies that the algorithms in question are based on publicly available research.',
        credibility: 80,
        relevance: 75,
        side: 'defense'
      }
    ],
    verdict: 'not-guilty',
    reasoning: 'While suspicious circumstances exist, the digital forensics report and employment contract create reasonable doubt about intent and actual theft.'
  };

  useEffect(() => {
    if (currentPhase === 'deliberation' && timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [currentPhase, timeRemaining]);

  const getEvidenceTypeColor = (type: string) => {
    switch (type) {
      case 'witness': return 'from-blue-900 to-blue-700 border-blue-600';
      case 'physical': return 'from-purple-900 to-purple-700 border-purple-600';
      case 'expert': return 'from-green-900 to-green-700 border-green-600';
      case 'document': return 'from-yellow-900 to-yellow-700 border-yellow-600';
      default: return 'from-gray-900 to-gray-700 border-gray-600';
    }
  };

  const getEvidenceTypeIcon = (type: string) => {
    switch (type) {
      case 'witness': return '👤';
      case 'physical': return '🔍';
      case 'expert': return '🎓';
      case 'document': return '📄';
      default: return '📋';
    }
  };

  const getSideColor = (side: string) => {
    return side === 'prosecution' ? 'text-red-400' : 'text-blue-400';
  };

  const handleEvidenceToggle = (evidenceId: string) => {
    setSelectedEvidence(prev => 
      prev.includes(evidenceId) 
        ? prev.filter(id => id !== evidenceId)
        : [...prev, evidenceId]
    );
  };

  const scoreEvidence = (evidenceId: string, score: number) => {
    setEvidenceScores(prev => ({
      ...prev,
      [evidenceId]: score
    }));
  };

  const calculateFinalScore = () => {
    const selectedEvidenceData = trialCase.evidence.filter(e => selectedEvidence.includes(e.id));
    
    // Base score for evidence selection
    let evidenceScore = 0;
    selectedEvidenceData.forEach(evidence => {
      const weight = (evidence.credibility + evidence.relevance) / 200;
      const playerScore = evidenceScores[evidence.id] || 50;
      const accuracy = 100 - Math.abs(playerScore - ((evidence.credibility + evidence.relevance) / 2));
      evidenceScore += weight * accuracy;
    });

    // Verdict accuracy bonus
    const verdictBonus = playerVerdict === trialCase.verdict ? 200 : 0;
    
    // Completeness factor
    const completenessRatio = selectedEvidence.length / trialCase.evidence.length;
    const completenessScore = completenessRatio > 0.5 ? completenessRatio * 100 : completenessRatio * 50;

    return Math.round(evidenceScore + verdictBonus + completenessScore);
  };

  const submitVerdict = () => {
    const finalScore = calculateFinalScore();
    setShowResult(true);
    
    setTimeout(() => {
      const xpGain = Math.round(finalScore * 2);
      onComplete(xpGain, finalScore);
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderBriefing = () => (
    <div className="space-y-8">
      <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">{trialCase.title}</h2>
          <div className="bg-red-900/30 border border-red-600 rounded-xl p-4 mb-6">
            <h3 className="text-lg font-semibold text-red-400 mb-2">Charge:</h3>
            <p className="text-white text-lg">{trialCase.charge}</p>
          </div>
          <p className="text-gray-300 text-lg leading-relaxed">{trialCase.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-red-900/20 border border-red-600 rounded-xl p-6">
            <h3 className="text-red-400 font-semibold mb-3 flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Prosecution Claims</span>
            </h3>
            <ul className="text-gray-300 space-y-2 text-sm">
              <li>• Sarah accessed sensitive files inappropriately</li>
              <li>• Physical evidence found on her workstation</li>
              <li>• Suspicious timing with job change</li>
              <li>• Significant financial damage to TechCorp</li>
            </ul>
          </div>

          <div className="bg-blue-900/20 border border-blue-600 rounded-xl p-6">
            <h3 className="text-blue-400 font-semibold mb-3 flex items-center space-x-2">
              <Scale className="h-5 w-5" />
              <span>Defense Arguments</span>
            </h3>
            <ul className="text-gray-300 space-y-2 text-sm">
              <li>• No unauthorized digital transfers detected</li>
              <li>• Personal projects misidentified as theft</li>
              <li>• Algorithms based on public research</li>
              <li>• Contract clearly defines what's proprietary</li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => setCurrentPhase('evidence')}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-xl font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
          >
            Begin Evidence Review
          </button>
        </div>
      </div>
    </div>
  );

  const renderEvidence = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Review the Evidence</h2>
        <p className="text-gray-300">Select evidence pieces that are most relevant to your decision</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {trialCase.evidence.map((evidence) => {
          const isSelected = selectedEvidence.includes(evidence.id);
          
          return (
            <div
              key={evidence.id}
              className={`bg-gradient-to-r ${getEvidenceTypeColor(evidence.type)} p-6 rounded-xl border transition-all duration-300 cursor-pointer ${
                isSelected ? 'ring-2 ring-white scale-105' : 'hover:scale-102'
              }`}
              onClick={() => handleEvidenceToggle(evidence.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getEvidenceTypeIcon(evidence.type)}</span>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-gray-300 font-medium">
                      {evidence.type}
                    </div>
                    <div className={`text-xs font-medium ${getSideColor(evidence.side)}`}>
                      {evidence.side}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {isSelected && <CheckCircle2 className="h-6 w-6 text-green-400" />}
                </div>
              </div>

              <h3 className="text-lg font-semibold text-white mb-3">{evidence.title}</h3>
              <p className="text-gray-200 text-sm mb-4 leading-relaxed">{evidence.description}</p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-400 mb-1">Credibility</div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-400 h-2 rounded-full"
                        style={{ width: `${evidence.credibility}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-300">{evidence.credibility}%</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Relevance</div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-400 h-2 rounded-full"
                        style={{ width: `${evidence.relevance}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-300">{evidence.relevance}%</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center">
        <button
          onClick={() => setCurrentPhase('deliberation')}
          disabled={selectedEvidence.length === 0}
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-xl font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Proceed to Deliberation ({selectedEvidence.length} evidence selected)
        </button>
      </div>
    </div>
  );

  const renderDeliberation = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Jury Deliberation</h2>
        <div className="flex items-center justify-center space-x-2 text-lg">
          <Clock className="h-5 w-5 text-yellow-400" />
          <span className="text-yellow-400 font-medium">
            Time Remaining: {formatTime(timeRemaining)}
          </span>
        </div>
      </div>

      <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-8">
        <h3 className="text-xl font-semibold text-white mb-6 text-center">Your Selected Evidence</h3>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {selectedEvidence.map(evidenceId => {
            const evidence = trialCase.evidence.find(e => e.id === evidenceId)!;
            return (
              <div key={evidenceId} className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span>{getEvidenceTypeIcon(evidence.type)}</span>
                      <span className="font-medium text-white">{evidence.title}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getSideColor(evidence.side)}`}>
                        {evidence.side}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">{evidence.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-lg border border-gray-700 rounded-xl p-8">
        <h3 className="text-xl font-semibold text-white mb-6 text-center">Your Verdict</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => setPlayerVerdict('guilty')}
            className={`p-6 rounded-xl border-2 transition-all duration-300 ${
              playerVerdict === 'guilty' 
                ? 'border-red-500 bg-red-900/30 text-white' 
                : 'border-red-700 bg-red-900/10 text-red-300 hover:bg-red-900/20'
            }`}
          >
            <div className="text-center">
              <div className="text-3xl mb-2">⚖️</div>
              <div className="text-xl font-bold mb-2">GUILTY</div>
              <div className="text-sm">
                The evidence proves beyond reasonable doubt that Sarah committed corporate espionage.
              </div>
            </div>
          </button>

          <button
            onClick={() => setPlayerVerdict('not-guilty')}
            className={`p-6 rounded-xl border-2 transition-all duration-300 ${
              playerVerdict === 'not-guilty' 
                ? 'border-blue-500 bg-blue-900/30 text-white' 
                : 'border-blue-700 bg-blue-900/10 text-blue-300 hover:bg-blue-900/20'
            }`}
          >
            <div className="text-center">
              <div className="text-3xl mb-2">🛡️</div>
              <div className="text-xl font-bold mb-2">NOT GUILTY</div>
              <div className="text-sm">
                There is reasonable doubt about Sarah's guilt based on the available evidence.
              </div>
            </div>
          </button>
        </div>

        {playerVerdict && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setCurrentPhase('verdict')}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-xl font-medium hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
            >
              Submit Final Verdict
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderVerdict = () => (
    <div className="space-y-8">
      {!showResult ? (
        <div className="text-center">
          <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-12">
            <Gavel className="h-24 w-24 text-yellow-400 mx-auto mb-6 animate-bounce" />
            <h2 className="text-3xl font-bold text-white mb-4">Verdict Submitted</h2>
            <p className="text-gray-300 text-lg">Calculating your performance...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Trial Complete</h2>
              <div className={`text-6xl font-bold mb-4 ${
                playerVerdict === trialCase.verdict ? 'text-green-400' : 'text-yellow-400'
              }`}>
                {calculateFinalScore()}/100
              </div>
              <div className={`text-xl font-medium ${
                playerVerdict === trialCase.verdict ? 'text-green-400' : 'text-yellow-400'
              }`}>
                {playerVerdict === trialCase.verdict ? 'Correct Verdict!' : 'Different Verdict'}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Your Decision</h3>
                <div className={`p-4 rounded-lg border ${
                  playerVerdict === 'guilty' ? 'border-red-600 bg-red-900/30' : 'border-blue-600 bg-blue-900/30'
                }`}>
                  <div className="text-lg font-bold text-white">
                    {playerVerdict?.toUpperCase()}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Expert Analysis</h3>
                <div className={`p-4 rounded-lg border ${
                  trialCase.verdict === 'guilty' ? 'border-red-600 bg-red-900/30' : 'border-blue-600 bg-blue-900/30'
                }`}>
                  <div className="text-lg font-bold text-white mb-2">
                    {trialCase.verdict.toUpperCase()}
                  </div>
                  <p className="text-gray-300 text-sm">{trialCase.reasoning}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={() => onComplete(calculateFinalScore() * 2, calculateFinalScore())}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-xl font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
              >
                Return to Menu (+{calculateFinalScore() * 2} XP)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

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
          
          <div className="flex items-center space-x-2 text-2xl font-bold text-white">
            <Gavel className="h-8 w-8 text-purple-400" />
            <span>The Verdict Room</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            Phase: <span className="text-white capitalize">{currentPhase}</span>
          </div>
        </div>

        {/* Content */}
        {currentPhase === 'briefing' && renderBriefing()}
        {currentPhase === 'evidence' && renderEvidence()}
        {currentPhase === 'deliberation' && renderDeliberation()}
        {currentPhase === 'verdict' && renderVerdict()}
      </div>
    </div>
  );
};

export default TheVerdictRoom;
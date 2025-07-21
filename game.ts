export interface UserProgress {
  level: number;
  xp: number;
  badges: string[];
  gamesCompleted: number;
  streakDays: number;
  totalPoints: number;
}

export interface GameState {
  currentGame: string | null;
  score: number;
  lives: number;
  timeLeft: number;
  hints: number;
}

export interface DebateScenario {
  id: string;
  title: string;
  description: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  arguments: {
    pro: string[];
    con: string[];
  };
  correctAnswer?: string;
  explanation?: string;
}

export interface LogicalFallacy {
  id: string;
  name: string;
  description: string;
  example: string;
  category: string;
}

export interface ArgumentCard {
  id: string;
  text: string;
  type: 'evidence' | 'reasoning' | 'claim' | 'counterpoint';
  strength: number;
  fallacy?: string;
}
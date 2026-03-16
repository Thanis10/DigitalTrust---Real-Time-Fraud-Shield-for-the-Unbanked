import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Badge = {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
};

export type Lesson = {
  id: string;
  title: string;
  type: 'quiz' | 'simulation' | 'tip';
  category: 'scams' | 'passwords' | 'transactions' | 'phishing' | 'otp';
  completed: boolean;
  points: number;
};

export type Reward = {
  id: string;
  threshold: number;
  label: string;
  claimed: boolean;
  type: 'cashback' | 'topup' | 'bonus';
  value: number;
};

interface AcademyState {
  lessons: Lesson[];
  badges: Badge[];
  rewards: Reward[];
  totalPoints: number;
  completeLesson: (lessonId: string) => void;
  claimReward: (rewardId: string) => void;
}

export const useAcademyStore = create<AcademyState>()(
  persist(
    (set) => ({
      lessons: [
        { id: 'scam-1', title: 'Spot the Fake SMS', type: 'quiz', category: 'scams', completed: false, points: 50 },
        { id: 'pass-1', title: 'Strong PIN Power', type: 'quiz', category: 'passwords', completed: false, points: 50 },
        { id: 'phish-1', title: 'The WhatsApp "Official"', type: 'simulation', category: 'phishing', completed: false, points: 100 },
        { id: 'otp-1', title: 'OTP Bodyguard', type: 'tip', category: 'otp', completed: false, points: 30 },
        { id: 'tx-1', title: 'Safe Market Transfer', type: 'simulation', category: 'transactions', completed: false, points: 100 },
        { id: 'apk-1', title: 'The "Update" Trap', type: 'quiz', category: 'phishing', completed: false, points: 50 },
        { id: 'social-1', title: 'ID Photo Safety', type: 'tip', category: 'scams', completed: false, points: 30 },
      ],
      badges: [
        { id: 'b1', name: 'Scam Spotter', icon: '🔍', description: 'Mastered the art of detecting fake messages.', unlocked: false },
        { id: 'b2', name: 'Password Protector', icon: '🛡️', description: 'Created a vault-strength security entry.', unlocked: false },
        { id: 'b3', name: 'Fraud Detective', icon: '🕵️', description: 'Spotted a fraudster in a simulation.', unlocked: false },
        { id: 'b4', name: 'OTP Guardian', icon: '🔑', description: 'Never shared a secret code.', unlocked: false },
        { id: 'b5', name: 'Smart Sender', icon: '💸', description: 'Verified every recipient properly.', unlocked: false },
      ],
      rewards: [
        { id: 'r1', threshold: 3, label: 'RM2 Cashback', claimed: false, type: 'cashback', value: 2 },
        { id: 'r2', threshold: 5, label: 'RM5 Top-Up Pin', claimed: false, type: 'topup', value: 5 },
        { id: 'r3', threshold: 7, label: 'RM10 Wallet Bonus', claimed: false, type: 'bonus', value: 10 },
      ],
      totalPoints: 0,
      completeLesson: (id) => set((state) => {
        const newLessons = state.lessons.map(l => l.id === id ? { ...l, completed: true } : l);
        const completedCount = newLessons.filter(l => l.completed).length;
        
        // Auto-unlock badges based on logic (simplified)
        const newBadges = state.badges.map((b, idx) => {
           if (idx < Math.floor(completedCount / 1.5)) return { ...b, unlocked: true };
           return b;
        });

        const lesson = state.lessons.find(l => l.id === id);
        return { 
          lessons: newLessons, 
          badges: newBadges,
          totalPoints: state.totalPoints + (lesson && !lesson.completed ? lesson.points : 0)
        };
      }),
      claimReward: (id) => set((state) => ({
        rewards: state.rewards.map(r => r.id === id ? { ...r, claimed: true } : r)
      })),
    }),
    { name: 'academy-storage' }
  )
);

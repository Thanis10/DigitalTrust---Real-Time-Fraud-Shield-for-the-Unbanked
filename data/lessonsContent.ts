export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface QuizContent {
  question: string;
  options: QuizOption[];
}

export interface SimulationStep {
  id: string;
  type: 'message' | 'action' | 'input';
  sender?: string;
  content: string;
  options: {
    text: string;
    isCorrect: boolean;
    result: string;
    nextStep?: string;
  }[];
}

export interface SimulationContent {
  steps: SimulationStep[];
}

export const LESSON_CONTENT: Record<string, QuizContent | SimulationContent> = {
  'scam-1': {
    question: 'You receive an SMS: "URGENT: Your account is locked. Click here to verify: bit.ly/trust-verify". What do you do?',
    options: [
      { id: '1', text: 'Click the link immediately', isCorrect: false, explanation: 'Never click suspicious links. Official banks use their official apps or websites.' },
      { id: '2', text: 'Ignore and delete the message', isCorrect: true, explanation: 'Great! This is a classic phishing attempt to steal your login details.' },
      { id: '3', text: 'Reply "STOP" to the message', isCorrect: false, explanation: 'Replying confirms your number is active, which might lead to more spam.' },
    ],
  },
  'pass-1': {
    question: 'Which of these is the SAFEST password for your wallet?',
    options: [
      { id: '1', text: '123456', isCorrect: false, explanation: 'Too easy to guess! Avoid sequential numbers.' },
      { id: '2', text: 'Password2024', isCorrect: false, explanation: 'The word "Password" is the first thing hackers try.' },
      { id: '3', text: 'Kopi#Susu@99', isCorrect: true, explanation: 'Strong! It uses mixed case, symbols, and is easy for you to remember but hard for others.' },
    ],
  },
  'phish-1': {
    steps: [
      {
        id: 'start',
        type: 'message',
        sender: 'Unknown (WhatsApp)',
        content: 'Hi! I am from DigitalTrust Support. We found a suspicious transaction. Can you share the 6-digit code we just sent you via SMS to cancel it?',
        options: [
          { text: 'Sure, here is the code', isCorrect: false, result: 'OH NO! You just gave away your OTP. The hacker now has access to your money.' },
          { text: 'I never share codes. Who is this?', isCorrect: true, result: 'SMART! DigitalTrust will NEVER ask for your OTP over WhatsApp or phone calls.', nextStep: 'followup' },
        ],
      },
      {
        id: 'followup',
        type: 'message',
        sender: 'Unknown (WhatsApp)',
        content: 'If you dont send it now, your account will be DELETED in 5 minutes! HURRY!',
        options: [
          { text: 'Okay, okay! Sending now!', isCorrect: false, result: 'The hacker used "urgency" to scare you. Always stay calm and verify through the official app.' },
          { text: 'Block and Report', isCorrect: true, result: 'EXCELLENT! Threatening language is a major red flag for scams.' },
        ],
      },
    ],
  } as SimulationContent,
  'tx-1': {
    steps: [
      {
        id: 'start',
        type: 'action',
        content: 'You are buying a new phone from an unknown seller on Facebook. They want you to "Send Money" directly to their personal account before they ship it.',
        options: [
          { text: 'Send the money now', isCorrect: false, result: 'RISKY! This is "Non-delivery fraud". You might never get the phone or see your money again.' },
          { text: 'Ask for Cash on Delivery (COD)', isCorrect: true, result: 'BETTER! For unknown sellers, always use payment methods that protect the buyer or meet in person.', nextStep: 'verify' },
        ],
      },
      {
        id: 'verify',
        type: 'message',
        sender: 'Seller',
        content: 'I cant do COD. But trust me, I have 100 positive reviews (sent as a screenshot). Just pay half first?',
        options: [
          { text: 'Half seems fair. Sending...', isCorrect: false, result: 'Even "half" is a win for a scammer. Screenshots of reviews are easily faked.' },
          { text: 'Walk away from the deal', isCorrect: true, result: 'MASTERFUL! If a deal feels suspicious or the seller refuses safe payment, it is better to be safe.' },
        ],
      },
    ],
  } as SimulationContent,
  'apk-1': {
    question: 'A message says: "New Security Update! Download DigitalTrust_Secure.apk to stay protected." What do you do?',
    options: [
      { id: '1', text: 'Install it immediately', isCorrect: false, explanation: 'APK files from messages often contain malware that steals your data.' },
      { id: '2', text: 'Check the Play Store/App Store', isCorrect: true, explanation: 'Correct! Only update apps through official app stores.' },
      { id: '3', text: 'Share with friends to help them', isCorrect: false, explanation: 'Don\'t spread the risk! Warn them instead.' },
    ],
  },
};

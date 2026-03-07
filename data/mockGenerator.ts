import { Transaction } from '@/store';

const LOCATIONS = ['Singapore', 'Kuala Lumpur', 'Jakarta', 'Bangkok', 'Manila', 'Ho Chi Minh', 'London (VPN)', 'Lagos', 'Moscow'];
const DEVICES = ['iPhone 14 Pro', 'Samsung Galaxy S23', 'Web Browser (Chrome)', 'Unknown Device', 'Android Emulator'];
const REASONS = [
  'Unusual transaction amount for this user',
  'New device detected for first time',
  'High-risk IP address associated with fraud network',
  'Suspicious location mismatch (Impossible travel)',
  'Rapid transaction frequency (Velocity check failed)',
  'Known fraudulent wallet address recipient'
];

export const generateMockTransaction = (): Transaction => {
  const isFraud = Math.random() > 0.85;
  const isFlagged = !isFraud && Math.random() > 0.7;
  
  const score = isFraud ? Math.floor(Math.random() * 20) + 80 : isFlagged ? Math.floor(Math.random() * 30) + 50 : Math.floor(Math.random() * 40);
  
  let decision: 'APPROVE' | 'FLAG' | 'BLOCK' = 'APPROVE';
  if (score >= 80) decision = 'BLOCK';
  else if (score >= 50) decision = 'FLAG';

  const reason = decision !== 'APPROVE' ? REASONS[Math.floor(Math.random() * REASONS.length)] : undefined;
  
  return {
    id: `TXN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    user_id: `USR-${Math.floor(Math.random() * 10000)}`,
    amount: parseFloat((Math.random() * (isFraud ? 5000 : 500)).toFixed(2)),
    location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
    device_id: DEVICES[Math.floor(Math.random() * DEVICES.length)],
    timestamp: new Date().toISOString(),
    risk_score: score,
    decision,
    reason,
    confidence: parseFloat((Math.random() * 10 + 90).toFixed(1)),
  };
};

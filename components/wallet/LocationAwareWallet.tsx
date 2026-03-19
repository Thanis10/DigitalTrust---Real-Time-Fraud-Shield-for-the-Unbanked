"use client";
import { useEffect } from 'react';
import { useWalletStore } from '@/store';

const LOCATIONS = [
  {
    country: 'Philippines',
    currency: { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
    language: 'en-PH'
  },
  {
    country: 'Thailand',
    currency: { code: 'THB', symbol: '฿', name: 'Thai Baht' },
    language: 'th-TH'
  },
  {
    country: 'Malaysia',
    currency: { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
    language: 'en-PH'
  }
];

export default function LocationAwareWallet() {
  const { setLocationInfo } = useWalletStore();

  useEffect(() => {
    // In a real app, we would use geolocation or IP-based detection
    // For this simulator, we'll default to Philippines or simulate a change
    const defaultLocation = LOCATIONS[2];
    setLocationInfo(defaultLocation.currency, defaultLocation.language);
  }, [setLocationInfo]);

  return null; // This component handles state logic
}
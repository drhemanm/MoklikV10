// src/config/paypal.ts
export const PAYPAL_CONFIG = {
  // PayPal Client ID (you'll get this from PayPal Developer Dashboard)
  clientId: process.env.REACT_APP_PAYPAL_CLIENT_ID || 'test',
  
  // Currency - PayPal works better with USD, we'll show MUR prices in UI
  currency: 'USD',
  
  // MUR to USD conversion (approximate - you should use real-time rates in production)
  MUR_TO_USD_RATE: 0.022, // 1 MUR ≈ 0.022 USD (adjust based on current rates)
  
  // Subscription Plans (you'll create these in PayPal Dashboard)
  plans: {
    monthly: {
      id: process.env.REACT_APP_PAYPAL_MONTHLY_PLAN_ID || 'P-MONTHLY-PLAN-ID',
      name: 'Moklik Monthly Subscription',
      priceUSD: '4.40', // 200 MUR converted to USD
      priceMUR: 200,
      interval: 'month'
    },
    yearly: {
      id: process.env.REACT_APP_PAYPAL_YEARLY_PLAN_ID || 'P-YEARLY-PLAN-ID',
      name: 'Moklik Yearly Subscription',
      priceUSD: '44.00', // 2000 MUR converted to USD
      priceMUR: 2000,
      interval: 'year',
      savings: 'Save 400 MUR'
    }
  },
  
  // PayPal SDK options
  options: {
    vault: true,
    intent: 'subscription'
  }
};

// Helper functions
export const convertMURToUSD = (murAmount: number): string => {
  return (murAmount * PAYPAL_CONFIG.MUR_TO_USD_RATE).toFixed(2);
};

export const convertUSDToMUR = (usdAmount: number): number => {
  return Math.round(usdAmount / PAYPAL_CONFIG.MUR_TO_USD_RATE);
};

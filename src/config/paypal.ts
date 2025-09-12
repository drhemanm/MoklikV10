// src/config/paypal.ts
export const PAYPAL_CONFIG = {
  // PayPal Client ID (now using the real one from previous setup)
  clientId: process.env.REACT_APP_PAYPAL_CLIENT_ID || 'AVHVhJC69XD8uQy7PNQhESQnexKc1WjK0i689dwDmTObz7MXy0CJBpkOhAX_Crwtl4D6Jrtrjn-g0iZF',
  
  // Currency - PayPal works better with USD, we'll show MUR prices in UI
  currency: 'USD',
  
  // MUR to USD conversion (approximate - you should use real-time rates in production)
  MUR_TO_USD_RATE: 0.022, // 1 MUR ≈ 0.022 USD (adjust based on current rates)
  
  // Subscription Plans (using the real plan IDs we created before)
  plans: {
    monthly: {
      id: process.env.REACT_APP_PAYPAL_MONTHLY_PLAN_ID || 'P-05886238FS610105WNDBHCWQ',
      name: 'Moklik Monthly Subscription',
      priceUSD: '4.40', // 200 MUR converted to USD
      priceMUR: 200,
      interval: 'month'
    },
    yearly: {
      id: process.env.REACT_APP_PAYPAL_YEARLY_PLAN_ID || 'P-3CH8376604712611WNDBHDTA',
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

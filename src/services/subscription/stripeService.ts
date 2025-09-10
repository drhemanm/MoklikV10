// @ts-ignore
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  trialDays?: number;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'trial',
    name: '7-Day Free Trial',
    description: 'Experience all premium features',
    price: 0,
    currency: 'MUR',
    interval: 'month',
    trialDays: 7
  },
  {
    id: 'premium',
    name: 'Premium Access',
    description: 'Unlimited learning support',
    price: 100,
    currency: 'MUR',
    interval: 'month'
  }
];

export const stripeService = {
  async createSubscription(planId: string, customerId: string): Promise<{ subscriptionId: string }> {
    try {
      // In a real implementation, this would be a server call
      // For demo purposes, we're simulating the response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        subscriptionId: `sub_${Math.random().toString(36).substring(2, 15)}`
      };
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  },

  async createPaymentMethod(cardElement: any, billingDetails: any): Promise<{ paymentMethodId: string }> {
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      // In a real implementation, this would create a payment method
      // For demo purposes, we're simulating the response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        paymentMethodId: `pm_${Math.random().toString(36).substring(2, 15)}`
      };
    } catch (error) {
      console.error('Error creating payment method:', error);
      throw error;
    }
  },

  async startTrial(userId: string): Promise<{ trialEndDate: Date }> {
    try {
      // In a real implementation, this would be a server call
      // For demo purposes, we're simulating the response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 7);
      
      return { trialEndDate };
    } catch (error) {
      console.error('Error starting trial:', error);
      throw error;
    }
  },

  async cancelSubscription(subscriptionId: string): Promise<{ success: boolean }> {
    try {
      // In a real implementation, this would be a server call
      // For demo purposes, we're simulating the response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { success: true };
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  },

  async getSubscriptionStatus(userId: string): Promise<{
    active: boolean;
    plan?: string;
    trialEnd?: Date;
    renewalDate?: Date;
  }> {
    try {
      // In a real implementation, this would be a server call
      // For demo purposes, we're simulating the response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Randomly return active or inactive for demo
      const active = Math.random() > 0.5;
      
      if (active) {
        const isTrialActive = Math.random() > 0.5;
        
        if (isTrialActive) {
          const trialEnd = new Date();
          trialEnd.setDate(trialEnd.getDate() + Math.floor(Math.random() * 7) + 1);
          
          return {
            active: true,
            plan: 'trial',
            trialEnd
          };
        } else {
          const renewalDate = new Date();
          renewalDate.setDate(renewalDate.getDate() + Math.floor(Math.random() * 30) + 1);
          
          return {
            active: true,
            plan: 'premium',
            renewalDate
          };
        }
      }
      
      return { active: false };
    } catch (error) {
      console.error('Error getting subscription status:', error);
      throw error;
    }
  }
};
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Types
export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  category: 'discount' | 'service' | 'gift' | 'exclusive';
  image: string;
  available: boolean;
  expiresAt?: string;
  terms?: string;
}

export interface UserReward {
  id: string;
  reward_id: string;
  redeemed_at: string;
  used: boolean;
  expires_at: string;
  reward?: Reward;
}

export interface PointsTransaction {
  id: string;
  user_id: string;
  points: number;
  type: 'earn' | 'redeem' | 'bonus' | 'referral' | 'expired';
  description: string;
  created_at: string;
  reference_id?: string;
}

export interface UserRewardsData {
  totalPoints: number;
  lifetimePoints: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  tierProgress: number;
  nextTierPoints: number;
  transactions: PointsTransaction[];
  redeemedRewards: UserReward[];
  referralCode: string;
  referralCount: number;
}

interface RewardsContextType {
  userRewards: UserRewardsData | null;
  availableRewards: Reward[];
  loading: boolean;
  error: string | null;
  isRewardsPopupOpen: boolean;
  openRewardsPopup: () => void;
  closeRewardsPopup: () => void;
  redeemReward: (rewardId: string) => Promise<boolean>;
  earnPoints: (points: number, description: string, referenceId?: string) => Promise<boolean>;
  refreshRewards: () => Promise<void>;
  getTierColor: (tier: string) => string;
  getTierIcon: (tier: string) => string;
}

const RewardsContext = createContext<RewardsContextType | undefined>(undefined);

// Tier thresholds
const TIER_THRESHOLDS = {
  bronze: 0,
  silver: 500,
  gold: 1500,
  platinum: 5000,
};

// Sample rewards catalog
const REWARDS_CATALOG: Reward[] = [
  {
    id: 'r1',
    name: '10% Off Next Service',
    description: 'Get 10% off your next service appointment at Sunny Auto.',
    pointsCost: 200,
    category: 'discount',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    available: true,
    terms: 'Valid for 90 days. Cannot be combined with other offers.',
  },
  {
    id: 'r2',
    name: 'Free Oil Change',
    description: 'Complimentary full synthetic oil change with premium filter.',
    pointsCost: 500,
    category: 'service',
    image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=400',
    available: true,
    terms: 'Valid for 60 days. Includes up to 5 quarts of synthetic oil.',
  },
  {
    id: 'r3',
    name: '25% Off Brake Service',
    description: 'Major discount on complete brake service including pads and rotors.',
    pointsCost: 750,
    category: 'discount',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400',
    available: true,
    terms: 'Valid for 90 days. Parts and labor included.',
  },
  {
    id: 'r4',
    name: 'Free Car Wash & Detail',
    description: 'Premium interior and exterior detailing service.',
    pointsCost: 300,
    category: 'service',
    image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=400',
    available: true,
    terms: 'Valid for 30 days. Includes interior vacuum and exterior wash.',
  },
  {
    id: 'r5',
    name: 'Sunny Auto Merchandise Pack',
    description: 'Exclusive branded merchandise including t-shirt, cap, and keychain.',
    pointsCost: 400,
    category: 'gift',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    available: true,
    terms: 'While supplies last. Sizes subject to availability.',
  },
  {
    id: 'r6',
    name: 'VIP Priority Scheduling',
    description: 'Skip the line! Get priority scheduling for 6 months.',
    pointsCost: 1000,
    category: 'exclusive',
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400',
    available: true,
    terms: 'Activate within 30 days. Valid for 6 months after activation.',
  },
  {
    id: 'r7',
    name: 'Free Tire Rotation & Balance',
    description: 'Complete tire rotation and balancing service.',
    pointsCost: 250,
    category: 'service',
    image: 'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=400',
    available: true,
    terms: 'Valid for 60 days.',
  },
  {
    id: 'r8',
    name: '$50 Service Credit',
    description: 'Apply $50 credit toward any service at Sunny Auto.',
    pointsCost: 600,
    category: 'discount',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400',
    available: true,
    terms: 'Valid for 90 days. Cannot be combined with other discounts.',
  },
  {
    id: 'r9',
    name: 'Annual Inspection Package',
    description: 'Comprehensive 50-point vehicle inspection.',
    pointsCost: 350,
    category: 'service',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400',
    available: true,
    terms: 'Valid for 120 days. Includes detailed report.',
  },
  {
    id: 'r10',
    name: 'Platinum Member Upgrade',
    description: 'Instant upgrade to Platinum tier for 3 months!',
    pointsCost: 2000,
    category: 'exclusive',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400',
    available: true,
    terms: 'Activate within 14 days. Includes all Platinum benefits.',
  },
];

export const RewardsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const supabase = createClientComponentClient();
  const [userRewards, setUserRewards] = useState<UserRewardsData | null>(null);
  const [availableRewards] = useState<Reward[]>(REWARDS_CATALOG);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRewardsPopupOpen, setIsRewardsPopupOpen] = useState(false);

  // Calculate tier based on lifetime points
  const calculateTier = (lifetimePoints: number): { tier: 'bronze' | 'silver' | 'gold' | 'platinum'; progress: number; nextTierPoints: number } => {
    if (lifetimePoints >= TIER_THRESHOLDS.platinum) {
      return { tier: 'platinum', progress: 100, nextTierPoints: 0 };
    } else if (lifetimePoints >= TIER_THRESHOLDS.gold) {
      const progress = ((lifetimePoints - TIER_THRESHOLDS.gold) / (TIER_THRESHOLDS.platinum - TIER_THRESHOLDS.gold)) * 100;
      return { tier: 'gold', progress, nextTierPoints: TIER_THRESHOLDS.platinum - lifetimePoints };
    } else if (lifetimePoints >= TIER_THRESHOLDS.silver) {
      const progress = ((lifetimePoints - TIER_THRESHOLDS.silver) / (TIER_THRESHOLDS.gold - TIER_THRESHOLDS.silver)) * 100;
      return { tier: 'silver', progress, nextTierPoints: TIER_THRESHOLDS.gold - lifetimePoints };
    } else {
      const progress = (lifetimePoints / TIER_THRESHOLDS.silver) * 100;
      return { tier: 'bronze', progress, nextTierPoints: TIER_THRESHOLDS.silver - lifetimePoints };
    }
  };

  // Generate referral code from user ID
  const generateReferralCode = (userId: string): string => {
    return `SUNNY${userId.substring(0, 6).toUpperCase()}`;
  };

  // Fetch user rewards data
  const fetchUserRewards = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setUserRewards(null);
        return;
      }

      // Fetch user's rewards data from Supabase
      const { data: rewardsData, error: rewardsError } = await supabase
        .from('user_rewards')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Fetch transactions
      const { data: transactionsData } = await supabase
        .from('points_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      // Fetch redeemed rewards
      const { data: redeemedData } = await supabase
        .from('redeemed_rewards')
        .select('*')
        .eq('user_id', user.id)
        .order('redeemed_at', { ascending: false });

      if (rewardsError && rewardsError.code !== 'PGRST116') {
        // If table doesn't exist, use demo data
        console.log('Using demo rewards data');
      }

      // Use fetched data or demo data
      const totalPoints = rewardsData?.total_points ?? 850;
      const lifetimePoints = rewardsData?.lifetime_points ?? 1250;
      const { tier, progress, nextTierPoints } = calculateTier(lifetimePoints);

      setUserRewards({
        totalPoints,
        lifetimePoints,
        tier,
        tierProgress: progress,
        nextTierPoints,
        transactions: transactionsData || generateDemoTransactions(),
        redeemedRewards: redeemedData || [],
        referralCode: generateReferralCode(user.id),
        referralCount: rewardsData?.referral_count ?? 3,
      });

    } catch (err: any) {
      console.error('Error fetching rewards:', err);
      // Fallback to demo data
      setUserRewards({
        totalPoints: 850,
        lifetimePoints: 1250,
        tier: 'silver',
        tierProgress: 75,
        nextTierPoints: 250,
        transactions: generateDemoTransactions(),
        redeemedRewards: [],
        referralCode: 'SUNNYDEMO01',
        referralCount: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate demo transactions for preview
  const generateDemoTransactions = (): PointsTransaction[] => {
    const now = new Date();
    return [
      {
        id: 't1',
        user_id: 'demo',
        points: 150,
        type: 'earn',
        description: 'Oil Change Service',
        created_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 't2',
        user_id: 'demo',
        points: 100,
        type: 'bonus',
        description: 'Welcome Bonus',
        created_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 't3',
        user_id: 'demo',
        points: 250,
        type: 'referral',
        description: 'Friend Referral Bonus',
        created_at: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 't4',
        user_id: 'demo',
        points: -200,
        type: 'redeem',
        description: 'Redeemed: 10% Off Next Service',
        created_at: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 't5',
        user_id: 'demo',
        points: 300,
        type: 'earn',
        description: 'Brake Service',
        created_at: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
  };

  // Redeem a reward
  const redeemReward = async (rewardId: string): Promise<boolean> => {
    try {
      const reward = availableRewards.find(r => r.id === rewardId);
      if (!reward || !userRewards) return false;

      if (userRewards.totalPoints < reward.pointsCost) {
        setError('Not enough points to redeem this reward');
        return false;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // Update points in database
      const newTotalPoints = userRewards.totalPoints - reward.pointsCost;

      await supabase
        .from('user_rewards')
        .upsert({
          user_id: user.id,
          total_points: newTotalPoints,
          lifetime_points: userRewards.lifetimePoints,
          updated_at: new Date().toISOString(),
        });

      // Record transaction
      await supabase
        .from('points_transactions')
        .insert({
          user_id: user.id,
          points: -reward.pointsCost,
          type: 'redeem',
          description: `Redeemed: ${reward.name}`,
          reference_id: rewardId,
        });

      // Record redeemed reward
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 90);

      await supabase
        .from('redeemed_rewards')
        .insert({
          user_id: user.id,
          reward_id: rewardId,
          expires_at: expiresAt.toISOString(),
        });

      // Update local state
      setUserRewards(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          totalPoints: newTotalPoints,
          transactions: [
            {
              id: `t${Date.now()}`,
              user_id: user.id,
              points: -reward.pointsCost,
              type: 'redeem',
              description: `Redeemed: ${reward.name}`,
              created_at: new Date().toISOString(),
            },
            ...prev.transactions,
          ],
        };
      });

      return true;
    } catch (err) {
      console.error('Error redeeming reward:', err);
      setError('Failed to redeem reward');
      return false;
    }
  };

  // Earn points
  const earnPoints = async (points: number, description: string, referenceId?: string): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !userRewards) return false;

      const newTotalPoints = userRewards.totalPoints + points;
      const newLifetimePoints = userRewards.lifetimePoints + points;

      // Update database
      await supabase
        .from('user_rewards')
        .upsert({
          user_id: user.id,
          total_points: newTotalPoints,
          lifetime_points: newLifetimePoints,
          updated_at: new Date().toISOString(),
        });

      // Record transaction
      await supabase
        .from('points_transactions')
        .insert({
          user_id: user.id,
          points,
          type: 'earn',
          description,
          reference_id: referenceId,
        });

      // Update local state
      const { tier, progress, nextTierPoints } = calculateTier(newLifetimePoints);
      
      setUserRewards(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          totalPoints: newTotalPoints,
          lifetimePoints: newLifetimePoints,
          tier,
          tierProgress: progress,
          nextTierPoints,
          transactions: [
            {
              id: `t${Date.now()}`,
              user_id: user.id,
              points,
              type: 'earn',
              description,
              created_at: new Date().toISOString(),
            },
            ...prev.transactions,
          ],
        };
      });

      return true;
    } catch (err) {
      console.error('Error earning points:', err);
      return false;
    }
  };

  // Get tier color
  const getTierColor = (tier: string): string => {
    switch (tier) {
      case 'bronze': return '#CD7F32';
      case 'silver': return '#C0C0C0';
      case 'gold': return '#FFD700';
      case 'platinum': return '#E5E4E2';
      default: return '#CD7F32';
    }
  };

  // Get tier icon
  const getTierIcon = (tier: string): string => {
    switch (tier) {
      case 'bronze': return '🥉';
      case 'silver': return '🥈';
      case 'gold': return '🥇';
      case 'platinum': return '💎';
      default: return '🥉';
    }
  };

  useEffect(() => {
    fetchUserRewards();
  }, []);

  const value = {
    userRewards,
    availableRewards,
    loading,
    error,
    isRewardsPopupOpen,
    openRewardsPopup: () => setIsRewardsPopupOpen(true),
    closeRewardsPopup: () => setIsRewardsPopupOpen(false),
    redeemReward,
    earnPoints,
    refreshRewards: fetchUserRewards,
    getTierColor,
    getTierIcon,
  };

  return (
    <RewardsContext.Provider value={value}>
      {children}
    </RewardsContext.Provider>
  );
};

export const useRewards = (): RewardsContextType => {
  const context = useContext(RewardsContext);
  if (!context) {
    throw new Error('useRewards must be used within a RewardsProvider');
  }
  return context;
};

export default RewardsContext;
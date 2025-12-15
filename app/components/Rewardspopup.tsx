"use client";

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useRewards, Reward } from './RewardsContext';

const ORANGE = '#FF8C00';
const ORANGE_LIGHT = '#FFA500';
const ORANGE_DARK = '#CC7000';

type TabType = 'overview' | 'rewards' | 'history' | 'referral';

const RewardsPopup: React.FC = () => {
  const {
    userRewards,
    availableRewards,
    loading,
    isRewardsPopupOpen,
    closeRewardsPopup,
    redeemReward,
    getTierColor,
    getTierIcon,
  } = useRewards();

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [redeeming, setRedeeming] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const popupRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isRewardsPopupOpen) {
      document.body.style.overflow = 'hidden';
      
      // Animate in
      gsap.fromTo(overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );
      
      gsap.fromTo(popupRef.current,
        { scale: 0.9, opacity: 0, y: 50 },
        { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" }
      );

      gsap.fromTo(contentRef.current?.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, delay: 0.2 }
      );
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isRewardsPopupOpen]);

  const handleClose = () => {
    gsap.to(popupRef.current, {
      scale: 0.9,
      opacity: 0,
      y: 50,
      duration: 0.3,
      ease: "power2.in",
      onComplete: closeRewardsPopup
    });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.3 });
  };

  const handleRedeemReward = async (reward: Reward) => {
    if (!userRewards || userRewards.totalPoints < reward.pointsCost) return;
    
    setRedeeming(true);
    const success = await redeemReward(reward.id);
    setRedeeming(false);

    if (success) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setSelectedReward(null);
      }, 3000);
    }
  };

  const handleCopyReferral = () => {
    if (userRewards?.referralCode) {
      navigator.clipboard.writeText(userRewards.referralCode);
      setCopiedReferral(true);
      setTimeout(() => setCopiedReferral(false), 2000);
    }
  };

  const filteredRewards = filterCategory === 'all' 
    ? availableRewards 
    : availableRewards.filter(r => r.category === filterCategory);

  if (!isRewardsPopupOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={handleClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 9998,
        }}
      />

      {/* Popup */}
      <div
        ref={popupRef}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '95%',
          maxWidth: '1000px',
          maxHeight: '80vh',
          backgroundColor: '#0a0a0a',
          borderRadius: '24px',
          border: `2px solid ${ORANGE}40`,
          boxShadow: `0 0 60px ${ORANGE}20, 0 25px 50px rgba(0, 0, 0, 0.8)`,
          zIndex: 9999,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header with Gradient */}
        <div style={{
          background: `linear-gradient(135deg, ${ORANGE}20 0%, transparent 50%, ${ORANGE}10 100%)`,
          padding: '1.5rem 2rem',
          borderBottom: `1px solid ${ORANGE}30`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${ORANGE}, ${ORANGE_DARK})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              boxShadow: `0 4px 20px ${ORANGE}50`,
            }}>
              🏆
            </div>
            <div>
              <h2 style={{
                margin: 0,
                fontSize: '1.75rem',
                fontWeight: '800',
                background: `linear-gradient(135deg, #fff, ${ORANGE_LIGHT})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px',
              }}>
                Sunny Rewards
              </h2>
              <p style={{
                margin: 0,
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '0.9rem',
              }}>
                Earn points, unlock exclusive perks
              </p>
            </div>
          </div>

          {/* Points Display */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{
              textAlign: 'right',
              padding: '0.75rem 1.5rem',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              border: `1px solid ${ORANGE}30`,
            }}>
              <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Available Points
              </div>
              <div style={{
                fontSize: '1.75rem',
                fontWeight: '800',
                color: ORANGE,
              }}>
                {loading ? '...' : userRewards?.totalPoints.toLocaleString()}
              </div>
            </div>

            <button
              onClick={handleClose}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                border: `1px solid ${ORANGE}40`,
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = ORANGE;
                e.currentTarget.style.transform = 'rotate(90deg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.transform = 'rotate(0deg)';
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: `1px solid ${ORANGE}20`,
          background: 'rgba(255, 255, 255, 0.02)',
        }}>
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'rewards', label: 'Rewards', icon: '🎁' },
            { id: 'history', label: 'History', icon: '📜' },
            { id: 'referral', label: 'Refer & Earn', icon: '👥' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              style={{
                flex: 1,
                padding: '1rem 1.5rem',
                background: activeTab === tab.id 
                  ? `linear-gradient(180deg, ${ORANGE}20 0%, transparent 100%)`
                  : 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? `3px solid ${ORANGE}` : '3px solid transparent',
                color: activeTab === tab.id ? 'white' : 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div
          ref={contentRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '2rem',
          }}
        >
          {loading ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '300px',
              gap: '1rem',
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                border: `3px solid ${ORANGE}30`,
                borderTop: `3px solid ${ORANGE}`,
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }} />
              <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Loading your rewards...</p>
            </div>
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === 'overview' && userRewards && (
                <div style={{ display: 'grid', gap: '2rem' }}>
                  {/* Tier Card */}
                  <div style={{
                    background: `linear-gradient(135deg, ${getTierColor(userRewards.tier)}15, transparent 60%)`,
                    border: `1px solid ${getTierColor(userRewards.tier)}40`,
                    borderRadius: '20px',
                    padding: '2rem',
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '-50px',
                      right: '-50px',
                      fontSize: '150px',
                      opacity: 0.1,
                    }}>
                      {getTierIcon(userRewards.tier)}
                    </div>
                    
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <span style={{ fontSize: '3rem' }}>{getTierIcon(userRewards.tier)}</span>
                        <div>
                          <div style={{
                            fontSize: '1.75rem',
                            fontWeight: '800',
                            color: getTierColor(userRewards.tier),
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                          }}>
                            {userRewards.tier} Member
                          </div>
                          <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
                            {userRewards.lifetimePoints.toLocaleString()} lifetime points earned
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {userRewards.tier !== 'platinum' && (
                        <div>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '0.5rem',
                            fontSize: '0.85rem',
                          }}>
                            <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                              Progress to next tier
                            </span>
                            <span style={{ color: getTierColor(userRewards.tier) }}>
                              {userRewards.nextTierPoints} points needed
                            </span>
                          </div>
                          <div style={{
                            height: '10px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '5px',
                            overflow: 'hidden',
                          }}>
                            <div style={{
                              height: '100%',
                              width: `${userRewards.tierProgress}%`,
                              background: `linear-gradient(90deg, ${getTierColor(userRewards.tier)}, ${ORANGE})`,
                              borderRadius: '5px',
                              transition: 'width 1s ease',
                            }} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                  }}>
                    {[
                      { label: 'Available Points', value: userRewards.totalPoints.toLocaleString(), icon: '💰', color: ORANGE },
                      { label: 'Lifetime Points', value: userRewards.lifetimePoints.toLocaleString(), icon: '⭐', color: '#FFD700' },
                      { label: 'Referrals Made', value: userRewards.referralCount.toString(), icon: '👥', color: '#10b981' },
                      { label: 'Rewards Redeemed', value: userRewards.redeemedRewards.length.toString(), icon: '🎁', color: '#8b5cf6' },
                    ].map((stat, index) => (
                      <div
                        key={index}
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: `1px solid ${stat.color}30`,
                          borderRadius: '16px',
                          padding: '1.5rem',
                          textAlign: 'center',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-5px)';
                          e.currentTarget.style.boxShadow = `0 10px 30px ${stat.color}20`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
                        <div style={{
                          fontSize: '2rem',
                          fontWeight: '800',
                          color: stat.color,
                          marginBottom: '0.25rem',
                        }}>
                          {stat.value}
                        </div>
                        <div style={{
                          color: 'rgba(255, 255, 255, 0.5)',
                          fontSize: '0.85rem',
                        }}>
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* How to Earn Section */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${ORANGE}20`,
                    borderRadius: '16px',
                    padding: '1.5rem',
                  }}>
                    <h3 style={{
                      margin: '0 0 1rem 0',
                      color: 'white',
                      fontSize: '1.25rem',
                      fontWeight: '700',
                    }}>
                      How to Earn Points
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                      {[
                        { action: 'Book a service', points: '10 pts per $1 spent', icon: '🔧' },
                        { action: 'Complete a service', points: '50 bonus pts', icon: '✅' },
                        { action: 'Refer a friend', points: '250 pts', icon: '👥' },
                        { action: 'Leave a review', points: '100 pts', icon: '⭐' },
                        { action: 'Birthday bonus', points: '100 pts', icon: '🎂' },
                        { action: 'Monthly check-in', points: '25 pts', icon: '📅' },
                      ].map((item, index) => (
                        <div
                          key={index}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '0.75rem',
                            background: 'rgba(255, 255, 255, 0.02)',
                            borderRadius: '8px',
                          }}
                        >
                          <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                          <div>
                            <div style={{ color: 'white', fontWeight: '600', fontSize: '0.9rem' }}>{item.action}</div>
                            <div style={{ color: ORANGE, fontSize: '0.85rem' }}>{item.points}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Rewards Tab */}
              {activeTab === 'rewards' && (
                <div>
                  {/* Category Filter */}
                  <div style={{
                    display: 'flex',
                    gap: '0.75rem',
                    marginBottom: '1.5rem',
                    flexWrap: 'wrap',
                  }}>
                    {[
                      { id: 'all', label: 'All Rewards' },
                      { id: 'discount', label: 'Discounts' },
                      { id: 'service', label: 'Free Services' },
                      { id: 'gift', label: 'Gifts' },
                      { id: 'exclusive', label: 'Exclusive' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setFilterCategory(cat.id)}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '20px',
                          border: `1px solid ${filterCategory === cat.id ? ORANGE : 'rgba(255, 255, 255, 0.2)'}`,
                          background: filterCategory === cat.id ? `${ORANGE}20` : 'transparent',
                          color: filterCategory === cat.id ? ORANGE : 'rgba(255, 255, 255, 0.7)',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Rewards Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '1.5rem',
                  }}>
                    {filteredRewards.map((reward) => {
                      const canAfford = userRewards && userRewards.totalPoints >= reward.pointsCost;
                      
                      return (
                        <div
                          key={reward.id}
                          style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: `1px solid ${canAfford ? ORANGE + '40' : 'rgba(255, 255, 255, 0.1)'}`,
                            borderRadius: '16px',
                            overflow: 'hidden',
                            opacity: canAfford ? 1 : 0.6,
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                          }}
                          onClick={() => setSelectedReward(reward)}
                          onMouseEnter={(e) => {
                            if (canAfford) {
                              e.currentTarget.style.transform = 'translateY(-5px)';
                              e.currentTarget.style.boxShadow = `0 15px 40px ${ORANGE}20`;
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          {/* Image */}
                          <div style={{
                            height: '140px',
                            backgroundImage: `url(${reward.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            position: 'relative',
                          }}>
                            <div style={{
                              position: 'absolute',
                              top: '10px',
                              right: '10px',
                              background: ORANGE,
                              color: 'white',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '12px',
                              fontSize: '0.8rem',
                              fontWeight: '700',
                            }}>
                              {reward.pointsCost} pts
                            </div>
                            <div style={{
                              position: 'absolute',
                              top: '10px',
                              left: '10px',
                              background: 'rgba(0, 0, 0, 0.6)',
                              color: 'white',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '8px',
                              fontSize: '0.7rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                            }}>
                              {reward.category}
                            </div>
                          </div>

                          {/* Content */}
                          <div style={{ padding: '1.25rem' }}>
                            <h4 style={{
                              margin: '0 0 0.5rem 0',
                              color: 'white',
                              fontSize: '1rem',
                              fontWeight: '700',
                            }}>
                              {reward.name}
                            </h4>
                            <p style={{
                              margin: 0,
                              color: 'rgba(255, 255, 255, 0.6)',
                              fontSize: '0.85rem',
                              lineHeight: '1.4',
                            }}>
                              {reward.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* History Tab */}
              {activeTab === 'history' && userRewards && (
                <div>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                  }}>
                    {userRewards.transactions.length === 0 ? (
                      <div style={{
                        textAlign: 'center',
                        padding: '3rem',
                        color: 'rgba(255, 255, 255, 0.5)',
                      }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
                        <p>No transactions yet. Start earning points!</p>
                      </div>
                    ) : (
                      userRewards.transactions.map((transaction, index) => {
                        const isPositive = transaction.points > 0;
                        const typeColors: Record<string, string> = {
                          earn: '#10b981',
                          bonus: '#8b5cf6',
                          referral: '#3b82f6',
                          redeem: '#ef4444',
                          expired: '#6b7280',
                        };
                        
                        return (
                          <div
                            key={transaction.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '1rem 1.5rem',
                              background: 'rgba(255, 255, 255, 0.03)',
                              border: `1px solid ${typeColors[transaction.type]}30`,
                              borderRadius: '12px',
                              transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: `${typeColors[transaction.type]}20`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.25rem',
                              }}>
                                {transaction.type === 'earn' && '💰'}
                                {transaction.type === 'bonus' && '🎁'}
                                {transaction.type === 'referral' && '👥'}
                                {transaction.type === 'redeem' && '🎟️'}
                                {transaction.type === 'expired' && '⏰'}
                              </div>
                              <div>
                                <div style={{ color: 'white', fontWeight: '600', fontSize: '0.95rem' }}>
                                  {transaction.description}
                                </div>
                                <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.8rem' }}>
                                  {new Date(transaction.created_at).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })}
                                </div>
                              </div>
                            </div>
                            <div style={{
                              fontSize: '1.25rem',
                              fontWeight: '700',
                              color: isPositive ? '#10b981' : '#ef4444',
                            }}>
                              {isPositive ? '+' : ''}{transaction.points}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* Referral Tab */}
              {activeTab === 'referral' && userRewards && (
                <div style={{
                  display: 'grid',
                  gap: '2rem',
                }}>
                  {/* Referral Code Card */}
                  <div style={{
                    background: `linear-gradient(135deg, ${ORANGE}15, transparent 60%)`,
                    border: `2px dashed ${ORANGE}50`,
                    borderRadius: '20px',
                    padding: '2.5rem',
                    textAlign: 'center',
                  }}>
                    <h3 style={{
                      margin: '0 0 0.5rem 0',
                      color: 'white',
                      fontSize: '1.5rem',
                      fontWeight: '700',
                    }}>
                      Your Referral Code
                    </h3>
                    <p style={{
                      margin: '0 0 1.5rem 0',
                      color: 'rgba(255, 255, 255, 0.6)',
                    }}>
                      Share this code and both you and your friend get 250 bonus points!
                    </p>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '1rem',
                      marginBottom: '1.5rem',
                    }}>
                      <div style={{
                        background: 'rgba(0, 0, 0, 0.4)',
                        padding: '1rem 2rem',
                        borderRadius: '12px',
                        border: `1px solid ${ORANGE}40`,
                      }}>
                        <span style={{
                          fontSize: '2rem',
                          fontWeight: '800',
                          color: ORANGE,
                          letterSpacing: '4px',
                          fontFamily: 'monospace',
                        }}>
                          {userRewards.referralCode}
                        </span>
                      </div>
                      <button
                        onClick={handleCopyReferral}
                        style={{
                          padding: '1rem 1.5rem',
                          background: copiedReferral ? '#10b981' : ORANGE,
                          border: 'none',
                          borderRadius: '12px',
                          color: 'white',
                          cursor: 'pointer',
                          fontWeight: '700',
                          fontSize: '0.9rem',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {copiedReferral ? '✓ Copied!' : 'Copy Code'}
                      </button>
                    </div>

                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: 'rgba(16, 185, 129, 0.2)',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      color: '#10b981',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                    }}>
                      👥 {userRewards.referralCount} friends referred
                    </div>
                  </div>

                  {/* How it Works */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${ORANGE}20`,
                    borderRadius: '16px',
                    padding: '2rem',
                  }}>
                    <h3 style={{
                      margin: '0 0 1.5rem 0',
                      color: 'white',
                      fontSize: '1.25rem',
                      fontWeight: '700',
                    }}>
                      How Referrals Work
                    </h3>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '1.5rem',
                    }}>
                      {[
                        { step: '1', title: 'Share Your Code', desc: 'Send your unique code to friends', icon: '📤' },
                        { step: '2', title: 'Friend Signs Up', desc: 'They create an account using your code', icon: '✍️' },
                        { step: '3', title: 'First Service', desc: 'Your friend books their first service', icon: '🔧' },
                        { step: '4', title: 'Both Get Points!', desc: 'You both receive 250 bonus points', icon: '🎉' },
                      ].map((item, index) => (
                        <div
                          key={index}
                          style={{
                            textAlign: 'center',
                            padding: '1.5rem 1rem',
                            background: 'rgba(255, 255, 255, 0.02)',
                            borderRadius: '12px',
                          }}
                        >
                          <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            background: `${ORANGE}20`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1rem',
                            fontSize: '1.75rem',
                          }}>
                            {item.icon}
                          </div>
                          <div style={{
                            color: ORANGE,
                            fontSize: '0.8rem',
                            fontWeight: '700',
                            marginBottom: '0.25rem',
                          }}>
                            STEP {item.step}
                          </div>
                          <h4 style={{
                            margin: '0 0 0.25rem 0',
                            color: 'white',
                            fontSize: '1rem',
                          }}>
                            {item.title}
                          </h4>
                          <p style={{
                            margin: 0,
                            color: 'rgba(255, 255, 255, 0.5)',
                            fontSize: '0.85rem',
                          }}>
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Share Buttons */}
                  <div style={{
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                  }}>
                    {[
                      { label: 'Share via Email', icon: '📧', color: '#ea4335' },
                      { label: 'Share on Facebook', icon: '📘', color: '#1877f2' },
                      { label: 'Share on Twitter', icon: '🐦', color: '#1da1f2' },
                      { label: 'Share on WhatsApp', icon: '💬', color: '#25d366' },
                    ].map((btn, index) => (
                      <button
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.75rem 1.25rem',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: `1px solid ${btn.color}40`,
                          borderRadius: '10px',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = `${btn.color}20`;
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <span>{btn.icon}</span>
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Reward Detail Modal */}
      {selectedReward && (
        <>
          <div
            onClick={() => !redeeming && setSelectedReward(null)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              zIndex: 10000,
            }}
          />
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '500px',
            backgroundColor: '#111',
            borderRadius: '20px',
            border: `2px solid ${ORANGE}50`,
            zIndex: 10001,
            overflow: 'hidden',
          }}>
            {showSuccess ? (
              <div style={{
                padding: '3rem',
                textAlign: 'center',
              }}>
                <div style={{
                  fontSize: '4rem',
                  marginBottom: '1rem',
                  animation: 'bounce 0.5s ease',
                }}>
                  🎉
                </div>
                <h3 style={{
                  margin: '0 0 0.5rem 0',
                  color: '#10b981',
                  fontSize: '1.5rem',
                }}>
                  Reward Redeemed!
                </h3>
                <p style={{
                  margin: 0,
                  color: 'rgba(255, 255, 255, 0.6)',
                }}>
                  Check your email for redemption details.
                </p>
              </div>
            ) : (
              <>
                <div style={{
                  height: '180px',
                  backgroundImage: `url(${selectedReward.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }} />
                <div style={{ padding: '2rem' }}>
                  <h3 style={{
                    margin: '0 0 0.5rem 0',
                    color: 'white',
                    fontSize: '1.5rem',
                  }}>
                    {selectedReward.name}
                  </h3>
                  <p style={{
                    margin: '0 0 1rem 0',
                    color: 'rgba(255, 255, 255, 0.6)',
                  }}>
                    {selectedReward.description}
                  </p>
                  
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '1rem',
                    borderRadius: '10px',
                    marginBottom: '1.5rem',
                  }}>
                    <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                      Terms & Conditions
                    </div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
                      {selectedReward.terms}
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.8rem' }}>Required Points</div>
                      <div style={{ color: ORANGE, fontSize: '1.5rem', fontWeight: '800' }}>
                        {selectedReward.pointsCost} pts
                      </div>
                    </div>
                    <button
                      onClick={() => handleRedeemReward(selectedReward)}
                      disabled={redeeming || !userRewards || userRewards.totalPoints < selectedReward.pointsCost}
                      style={{
                        padding: '1rem 2rem',
                        background: userRewards && userRewards.totalPoints >= selectedReward.pointsCost
                          ? `linear-gradient(135deg, ${ORANGE}, ${ORANGE_DARK})`
                          : 'rgba(255, 255, 255, 0.1)',
                        border: 'none',
                        borderRadius: '12px',
                        color: 'white',
                        cursor: userRewards && userRewards.totalPoints >= selectedReward.pointsCost ? 'pointer' : 'not-allowed',
                        fontWeight: '700',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {redeeming ? 'Redeeming...' : 
                       userRewards && userRewards.totalPoints >= selectedReward.pointsCost 
                         ? 'Redeem Now' 
                         : 'Not Enough Points'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
      `}</style>
    </>
  );
};

export default RewardsPopup;
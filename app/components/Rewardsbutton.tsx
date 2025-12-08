"use client";

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useRewards } from './RewardsContext';

const ORANGE = '#FF8C00';
const ORANGE_LIGHT = '#FFA500';

const RewardsButton: React.FC = () => {
  const { userRewards, openRewardsPopup, loading, getTierColor, getTierIcon } = useRewards();
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial entrance animation
    if (buttonRef.current) {
      gsap.fromTo(buttonRef.current,
        { scale: 0, opacity: 0, rotation: -180 },
        { 
          scale: 1, 
          opacity: 1, 
          rotation: 0, 
          duration: 0.8, 
          delay: 1.5,
          ease: "elastic.out(1, 0.5)" 
        }
      );
    }

    // Continuous pulse animation
    if (pulseRef.current) {
      gsap.to(pulseRef.current, {
        scale: 1.5,
        opacity: 0,
        duration: 2,
        repeat: -1,
        ease: "power2.out"
      });
    }

    // Subtle floating animation
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        y: -5,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setShowTooltip(true);
    
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 1.1,
        duration: 0.3,
        ease: "back.out(1.5)"
      });
    }

    // Create particles
    if (particlesRef.current) {
      for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
          position: absolute;
          width: 6px;
          height: 6px;
          background: ${ORANGE};
          border-radius: 50%;
          pointer-events: none;
        `;
        particlesRef.current.appendChild(particle);

        const angle = (i / 8) * Math.PI * 2;
        const distance = 40;

        gsap.fromTo(particle,
          { x: 0, y: 0, opacity: 1, scale: 1 },
          {
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance,
            opacity: 0,
            scale: 0,
            duration: 0.6,
            ease: "power2.out",
            onComplete: () => particle.remove()
          }
        );
      }
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowTooltip(false);
    
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  const handleClick = () => {
    // Click animation
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 0.9,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
        onComplete: openRewardsPopup
      });
    }
  };

  return (
    <div style={{
      position: 'fixed',
      right: '25px',
      bottom: '40px',
      zIndex: 1000,
    }}>
      {/* Pulse Effect */}
      <div
        ref={pulseRef}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '65px',
          height: '65px',
          borderRadius: '50%',
          border: `2px solid ${ORANGE}`,
          pointerEvents: 'none',
        }}
      />

      {/* Particles Container */}
      <div
        ref={particlesRef}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      />

      {/* Main Button */}
      <button
        ref={buttonRef}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          width: '65px',
          height: '65px',
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${ORANGE} 0%, ${ORANGE_LIGHT} 50%, ${ORANGE} 100%)`,
          backgroundSize: '200% 200%',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `
            0 4px 20px rgba(255, 140, 0, 0.5),
            0 0 40px rgba(255, 140, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.3)
          `,
          transition: 'box-shadow 0.3s ease',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Shine Effect */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)',
          transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)',
          transition: 'transform 0.6s ease',
          pointerEvents: 'none',
        }} />

        {/* Icon */}
        <span style={{
          fontSize: '1.75rem',
          lineHeight: 1,
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.3s ease',
        }}>
          🏆
        </span>
      </button>

      {/* Points Badge */}
      {userRewards && !loading && (
        <div style={{
          position: 'absolute',
          top: '-5px',
          right: '-5px',
          background: `linear-gradient(135deg, ${getTierColor(userRewards.tier)}, ${getTierColor(userRewards.tier)}dd)`,
          color: userRewards.tier === 'silver' || userRewards.tier === 'platinum' ? '#1a1a1a' : 'white',
          padding: '0.25rem 0.5rem',
          borderRadius: '10px',
          fontSize: '0.7rem',
          fontWeight: '800',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          border: '2px solid #0a0a0a',
          minWidth: '40px',
          textAlign: 'center',
        }}>
          {userRewards.totalPoints > 999 
            ? `${(userRewards.totalPoints / 1000).toFixed(1)}k` 
            : userRewards.totalPoints}
        </div>
      )}

      {/* Tier Icon Badge */}
      {userRewards && !loading && (
        <div style={{
          position: 'absolute',
          bottom: '-3px',
          left: '-3px',
          fontSize: '1.25rem',
          background: '#0a0a0a',
          borderRadius: '50%',
          width: '28px',
          height: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          border: `2px solid ${getTierColor(userRewards.tier)}`,
        }}>
          {getTierIcon(userRewards.tier)}
        </div>
      )}

      {/* Tooltip */}
      {showTooltip && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          right: '0',
          marginBottom: '15px',
          background: 'rgba(10, 10, 10, 0.95)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${ORANGE}40`,
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          minWidth: '200px',
          boxShadow: `0 10px 40px rgba(0, 0, 0, 0.5), 0 0 20px ${ORANGE}10`,
          animation: 'fadeSlideIn 0.3s ease',
          transformOrigin: 'bottom right',
        }}>
          {/* Arrow */}
          <div style={{
            position: 'absolute',
            bottom: '-8px',
            right: '25px',
            width: '16px',
            height: '16px',
            background: 'rgba(10, 10, 10, 0.95)',
            border: `1px solid ${ORANGE}40`,
            borderTop: 'none',
            borderLeft: 'none',
            transform: 'rotate(45deg)',
          }} />

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '0.75rem',
          }}>
            <span style={{ fontSize: '1.5rem' }}>🏆</span>
            <div>
              <div style={{
                color: 'white',
                fontWeight: '700',
                fontSize: '1rem',
              }}>
                Sunny Rewards
              </div>
              <div style={{
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '0.75rem',
              }}>
                Click to view your rewards
              </div>
            </div>
          </div>

          {userRewards && (
            <>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                marginBottom: '0.5rem',
              }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.85rem' }}>
                  Available Points
                </span>
                <span style={{
                  color: ORANGE,
                  fontWeight: '800',
                  fontSize: '1.1rem',
                }}>
                  {userRewards.totalPoints.toLocaleString()}
                </span>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.75rem',
                background: `${getTierColor(userRewards.tier)}15`,
                borderRadius: '6px',
                border: `1px solid ${getTierColor(userRewards.tier)}30`,
              }}>
                <span style={{ fontSize: '1rem' }}>{getTierIcon(userRewards.tier)}</span>
                <span style={{
                  color: getTierColor(userRewards.tier),
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  {userRewards.tier} Member
                </span>
              </div>
            </>
          )}

          {loading && (
            <div style={{
              textAlign: 'center',
              padding: '0.5rem',
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '0.85rem',
            }}>
              Loading...
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default RewardsButton;
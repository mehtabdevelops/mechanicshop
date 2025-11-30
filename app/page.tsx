"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';

const ORANGE = '#FF8C00';          // primary accent
const ORANGE_LIGHT = '#FFA500';
const ORANGE_DARK = '#CC5500';
const ORANGE_DEEP = '#7F3F00';
const ORANGE_RGBA = (alpha: number) => `rgba(255, 140, 0, ${alpha})`;
const ORANGE_LIGHT_RGBA = (alpha: number) => `rgba(255, 165, 0, ${alpha})`;

const HomePage = () => {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();
  
  // Refs for GSAP animations
  const heroImageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentCardRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const accentLineRef = useRef<HTMLDivElement>(null);
  const floatingAnimationRef = useRef<gsap.core.Tween | null>(null);
  const backgroundPatternRef = useRef<HTMLDivElement>(null);

  const handleSignIn = () => router.push('/signin');
  const handleSignUp = () => router.push('/signup');

  const carImages = [
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1619405399517-d7fce0f13302?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
  ];

  useEffect(() => {
    // Master timeline with smoother sequencing
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Enhanced initial states
    gsap.set(heroImageRef.current, { 
      scale: 1.3,
      opacity: 0,
      rotation: 0.5
    });
    
    gsap.set(backgroundPatternRef.current, {
      scale: 1.1,
      opacity: 0
    });

    gsap.set(contentCardRef.current, { 
      opacity: 0, 
      y: 100,
      scale: 0.9,
      rotationX: 5
    });

    gsap.set(titleRef.current, { 
      opacity: 0, 
      y: 40,
      scale: 1.1
    });

    gsap.set(subtitleRef.current, { 
      opacity: 0, 
      y: 30
    });

    gsap.set(accentLineRef.current, {
      scaleX: 0,
      opacity: 0
    });

    gsap.set(buttonsRef.current, { 
      opacity: 0, 
      y: 40,
      scale: 0.9
    });

    // Enhanced entrance sequence with staggered effects
    tl.to(backgroundPatternRef.current, {
      opacity: 0.8,
      scale: 1,
      duration: 2,
      ease: "power2.out"
    })
    .to(heroImageRef.current, {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 2.2,
      ease: "power4.out"
    }, "-=1.8")
    .to(overlayRef.current, {
      opacity: 1,
      duration: 1.5
    }, "-=1.5")
    .to(contentCardRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      rotationX: 0,
      duration: 1.2,
      ease: "back.out(1.4)"
    }, "-=0.8")
    .to(titleRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.9,
      ease: "elastic.out(1, 0.5)"
    }, "-=0.6")
    .to(accentLineRef.current, {
      scaleX: 1,
      opacity: 1,
      duration: 1,
      ease: "power2.out"
    }, "-=0.5")
    .to(subtitleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.4")
    .to(buttonsRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: "back.out(1.5)"
    }, "-=0.3");

    // Enhanced floating animation with rotation
    floatingAnimationRef.current = gsap.to(contentCardRef.current, {
      y: "+=15",
      rotationZ: 0.5,
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Enhanced parallax with depth perception
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 30;
      const yPos = (clientY / window.innerHeight - 0.5) * 30;

      gsap.to(heroImageRef.current, {
        x: xPos * 0.8,
        y: yPos * 0.8,
        rotation: xPos * 0.02,
        duration: 2,
        ease: "power2.out"
      });

      gsap.to(contentCardRef.current, {
        x: -xPos * 0.3,
        y: -yPos * 0.1,
        rotationY: xPos * 0.5,
        rotationX: -yPos * 0.3,
        duration: 1.2,
        ease: "power2.out",
        overwrite: 'auto'
      });

      // Subtle background pattern movement
      gsap.to(backgroundPatternRef.current, {
        x: xPos * 0.1,
        y: yPos * 0.1,
        duration: 2,
        ease: "power2.out"
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Enhanced image carousel with crossfade effect
    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carImages.length);
      
      const tl = gsap.timeline();
      
      tl.to(heroImageRef.current, {
        opacity: 0.3,
        scale: 1.1,
        rotation: -0.5,
        duration: 1.2,
        ease: "power2.inOut"
      })
      .to(heroImageRef.current, {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 1.8,
        ease: "power2.out"
      });
    }, 7000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(imageInterval);
      tl.kill();
    };
  }, []);

  const handleButtonHover = (index: number, isHovering: boolean) => {
    if (isHovering && floatingAnimationRef.current) {
      floatingAnimationRef.current.pause();
    } else if (!isHovering && floatingAnimationRef.current) {
      floatingAnimationRef.current.play();
    }

    gsap.to(buttonsRef.current[index], {
      scale: isHovering ? 1.08 : 1,
      y: isHovering ? -6 : 0,
      rotationZ: isHovering ? 1 : 0,
      duration: 0.5,
      ease: "back.out(1.7)"
    });

    // Add glow effect to content card when any button is hovered
    gsap.to(contentCardRef.current, {
      boxShadow: isHovering 
        ? `0 15px 40px ${ORANGE_RGBA(0.28)}, 0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08)`
        : '0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
      duration: 0.4,
      ease: "power2.out"
    });
  };

  return (
    <div style={{
      // Brighter background gradient
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #333333 100%)',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      textAlign: 'center',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Enhanced Animated Pattern Background - Brighter */}
      <div 
        ref={backgroundPatternRef}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at 25% 25%, ${ORANGE_LIGHT_RGBA(0.15)} 2px, transparent 0),
            radial-gradient(circle at 75% 75%, ${ORANGE_LIGHT_RGBA(0.1)} 1px, transparent 0),
            linear-gradient(45deg, rgba(255,165,0,0.05) 0%, transparent 50%),
            linear-gradient(135deg, rgba(255,140,0,0.03) 0%, transparent 50%)
          `,
          backgroundSize: '60px 60px, 40px 40px, 100% 100%, 100% 100%',
          zIndex: 1,
          opacity: 0
        }} 
      />

      {/* Hero Image with Brighter Filters */}
      <div
        ref={heroImageRef}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${carImages[currentImageIndex]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 2,
          opacity: 0,
          // Increased brightness and reduced darkening
          filter: 'brightness(0.75) contrast(1.15) saturate(1.1)',
          transition: 'background-image 0.8s ease'
        }}
      />

      {/* Brighter Gradient Overlay */}
      <div
        ref={overlayRef}
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            linear-gradient(135deg, rgba(25, 25, 25, 0.75) 0%, rgba(35, 35, 35, 0.7) 50%, rgba(20, 20, 20, 0.85) 100%),
            linear-gradient(45deg, ${ORANGE_RGBA(0.25)} 0%, transparent 65%),
            radial-gradient(ellipse at 30% 50%, transparent 0%, rgba(30, 30, 30, 0.5) 50%, rgba(15, 15, 15, 0.8) 100%)
          `,
          zIndex: 4,
          opacity: 0
        }}
      />

      {/* Enhanced Content Card with Brighter Background */}
      <div
        ref={contentCardRef}
        style={{
          position: 'relative',
          zIndex: 10,
          // Brighter card background
          background: 'rgba(30, 30, 30, 0.85)',
          backdropFilter: 'blur(25px) saturate(180%)',
          WebkitBackdropFilter: 'blur(25px) saturate(180%)',
          padding: '4rem 3.5rem',
          borderRadius: '20px',
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.12)
          `,
          border: `1px solid ${ORANGE_RGBA(0.45)}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: '90%',
          width: '500px',
          opacity: 0,
          transform: 'perspective(1000px)',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Enhanced Top Accent Line */}
        <div 
          ref={accentLineRef}
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80%',
            height: '3px',
            background: `linear-gradient(90deg, transparent, ${ORANGE}, ${ORANGE_LIGHT}, ${ORANGE}, transparent)`,
            opacity: 0,
            filter: 'blur(0.5px)'
          }} 
        />

        <h1
          ref={titleRef}
          style={{
            fontSize: '3.75rem',
            fontWeight: '800',
            marginBottom: '24px',
            background: `linear-gradient(135deg, #ffffff 0%, ${ORANGE_LIGHT} 45%, ${ORANGE} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            backgroundSize: '200% 200%',
            width: '100%',
            opacity: 0,
            letterSpacing: '4px',
            textShadow: `0 4px 30px ${ORANGE_RGBA(0.45)}`,
            fontFamily: 'Georgia, serif'
          }}
        >
          SUNNY AUTOS
        </h1>

        <p
          ref={subtitleRef}
          style={{
            fontSize: '1.15rem',
            marginBottom: '45px',
            fontWeight: '300',
            // Brighter text color
            color: 'rgba(245, 247, 250, 0.9)',
            width: '100%',
            opacity: 0,
            letterSpacing: '1.5px',
            lineHeight: '1.7',
            fontStyle: 'italic'
          }}
        >
          Where Timeless Craftsmanship<br/>Meets Modern Excellence
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
          width: '100%'
        }}>
          {[
            { text: 'Sign in', action: handleSignIn, isPrimary: true },
            { text: 'Sign Up', action: handleSignUp, isPrimary: true }
          ].map((button, index) => (
            <button
              key={index}
              ref={(el) => { buttonsRef.current[index] = el; }}
              style={{
                background: button.isPrimary 
                  ? (hoveredButton === button.text 
              ? `linear-gradient(135deg, ${ORANGE_LIGHT} 0%, ${ORANGE} 55%, ${ORANGE_DARK} 100%)` 
                : `linear-gradient(135deg, ${ORANGE} 0%, ${ORANGE_DARK} 50%, ${ORANGE_DEEP} 100%)`)
                  : 'rgba(255, 255, 255, 0.12)',
                color: button.isPrimary ? '#ffffff' : ORANGE_LIGHT,
                padding: '18px 36px',
                border: button.isPrimary ? 'none' : `1px solid ${ORANGE_LIGHT_RGBA(0.6)}`,
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '1.05rem',
                fontWeight: '700',
                width: '100%',
                transition: 'all 0.3s ease',
                textAlign: 'center',
                letterSpacing: '0.8px',
                boxShadow: button.isPrimary && hoveredButton === button.text
                  ? `0 8px 30px ${ORANGE_RGBA(0.55)}, 0 2px 12px rgba(0, 0, 0, 0.45)`
                  : button.isPrimary 
                    ? `0 6px 22px ${ORANGE_RGBA(0.35)}`
                    : `0 4px 18px ${ORANGE_LIGHT_RGBA(0.25)}`,
                opacity: 0,
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={() => {
                setHoveredButton(button.text);
                handleButtonHover(index, true);
              }}
              onMouseLeave={() => {
                setHoveredButton(null);
                handleButtonHover(index, false);
              }}
              onClick={button.action}
            >
              {/* Button shine effect */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                transition: 'left 0.6s ease'
              }} 
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  left: '100%',
                  duration: 0.6,
                  ease: "power2.out"
                });
              }}
              />
              {button.text}
            </button>
          ))}
        </div>

        {/* Enhanced bottom decorative element */}
        <div style={{
          marginTop: '35px',
          width: '60%',
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${ORANGE_RGBA(0.45)}, ${ORANGE_RGBA(0.65)}, ${ORANGE_RGBA(0.45)}, transparent)`,
          borderRadius: '2px'
        }} />

        <p style={{
          marginTop: '24px',
          fontSize: '0.9rem',
          // Brighter footer text
          color: 'rgba(245, 247, 250, 0.7)',
          letterSpacing: '1.5px',
          fontWeight: '300',
          fontStyle: 'italic'
        }}>
          EST. 2009
        </p>
      </div>
    </div>
  );
};

export default HomePage;
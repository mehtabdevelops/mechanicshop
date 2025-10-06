"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';

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
  const handleAdminSignIn = () => router.push('/AdminSignIn');

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
      opacity: 0.7,
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
        ? '0 15px 40px rgba(212, 175, 55, 0.25), 0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        : '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      duration: 0.4,
      ease: "power2.out"
    });
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0a1628 0%, #162849 50%, #0d1b2a 100%)',
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
      {/* Enhanced Animated Pattern Background */}
      <div 
        ref={backgroundPatternRef}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(212, 175, 55, 0.08) 2px, transparent 0),
            radial-gradient(circle at 75% 75%, rgba(212, 175, 55, 0.05) 1px, transparent 0)
          `,
          backgroundSize: '60px 60px, 40px 40px',
          zIndex: 1,
          opacity: 0
        }} 
      />

      {/* Hero Image with Enhanced Filters */}
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
          filter: 'brightness(0.7) contrast(1.2) saturate(1.1)',
          transition: 'background-image 0.8s ease'
        }}
      />

      {/* Enhanced Gradient Overlay */}
      <div
        ref={overlayRef}
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse at 30% 50%, transparent 0%, rgba(10, 22, 40, 0.6) 50%, rgba(10, 22, 40, 0.95) 100%),
            linear-gradient(135deg, rgba(10, 22, 40, 0.85) 0%, rgba(22, 40, 73, 0.8) 50%, rgba(13, 27, 42, 0.9) 100%)
          `,
          zIndex: 4,
          opacity: 0
        }}
      />

      {/* Enhanced Content Card */}
      <div
        ref={contentCardRef}
        style={{
          position: 'relative',
          zIndex: 10,
          background: 'rgba(255, 255, 255, 0.04)',
          backdropFilter: 'blur(25px) saturate(200%)',
          WebkitBackdropFilter: 'blur(25px) saturate(200%)',
          padding: '4rem 3.5rem',
          borderRadius: '20px',
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `,
          border: '1px solid rgba(212, 175, 55, 0.3)',
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
            background: 'linear-gradient(90deg, transparent, #d4af37, #f4e5b8, #d4af37, transparent)',
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
            background: 'linear-gradient(135deg, #d4af37 0%, #f4e5b8 30%, #ffedc2 50%, #f4e5b8 70%, #d4af37 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            backgroundSize: '200% 200%',
            width: '100%',
            opacity: 0,
            letterSpacing: '4px',
            textShadow: '0 4px 30px rgba(212, 175, 55, 0.4)',
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
            color: 'rgba(245, 245, 245, 0.9)',
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
            { text: 'Sign Up', action: handleSignUp, isPrimary: true },
            { text: 'Admin Access', action: handleAdminSignIn, isPrimary: false }
          ].map((button, index) => (
            <button
              key={index}
              ref={(el) => { buttonsRef.current[index] = el; }}
              style={{
                background: button.isPrimary 
                  ? (hoveredButton === button.text 
                      ? 'linear-gradient(135deg, #f8ecc2 0%, #d4af37 50%, #c9a961 100%)' 
                      : 'linear-gradient(135deg, #d4af37 0%, #c9a961 50%, #b89434 100%)')
                  : 'rgba(255, 255, 255, 0.06)',
                color: button.isPrimary ? '#0a1628' : '#d4af37',
                padding: '18px 36px',
                border: button.isPrimary ? 'none' : '1px solid rgba(212, 175, 55, 0.5)',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '1.05rem',
                fontWeight: '700',
                width: '100%',
                transition: 'all 0.3s ease',
                textAlign: 'center',
                letterSpacing: '0.8px',
                boxShadow: button.isPrimary && hoveredButton === button.text
                  ? '0 8px 30px rgba(212, 175, 55, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3)'
                  : button.isPrimary 
                    ? '0 6px 20px rgba(212, 175, 55, 0.3)'
                    : '0 4px 15px rgba(0, 0, 0, 0.2)',
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
          background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.4), rgba(212, 175, 55, 0.6), rgba(212, 175, 55, 0.4), transparent)',
          borderRadius: '2px'
        }} />

        <p style={{
          marginTop: '24px',
          fontSize: '0.9rem',
          color: 'rgba(245, 245, 245, 0.6)',
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
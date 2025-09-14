"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const router = useRouter();
  const [animationStage, setAnimationStage] = useState(0);

  const buttonStyle = (buttonName: string) => ({
    backgroundColor: hoveredButton === buttonName ? '#f59e0b' : '#fbbf24',
    color: '#172554',
    padding: '15px 25px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    width: '100%',
    transition: 'all 0.2s ease',
    textAlign: 'center' as const,
  });

  const handleSignIn = () => {
    router.push('/signin');
  };

  const handleSignUp = () => {
    router.push('/signup');
  };

  const handleAdminSignIn = () => {
    router.push('/AdminSignIn');
  };

  // Sample car images
  const carImages = [
    "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    "https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    "https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1175&q=80"
  ];

  useEffect(() => {
    // Animation sequence
    const timer1 = setTimeout(() => setAnimationStage(1), 300);
    const timer2 = setTimeout(() => setAnimationStage(2), 600);
    const timer3 = setTimeout(() => setAnimationStage(3), 900);
    const timer4 = setTimeout(() => setAnimationStage(4), 1200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  return (
    <div style={{ 
      backgroundColor: '#172554',
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
      {/* Layer 1 - Top image */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '25%',
        opacity: animationStage >= 1 ? 1 : 0,
        transform: animationStage >= 1 ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'all 0.8s ease-in-out',
        backgroundImage: `url(${carImages[0]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: 1,
        borderBottom: '2px solid #fbbf24'
      }}></div>

      {/* Layer 2 - Second image */}
      <div style={{
        position: 'absolute',
        top: '25%',
        left: 0,
        width: '100%',
        height: '25%',
        opacity: animationStage >= 2 ? 1 : 0,
        transform: animationStage >= 2 ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'all 0.8s ease-in-out',
        backgroundImage: `url(${carImages[1]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: 2,
        borderBottom: '2px solid #fbbf24'
      }}></div>

      {/* Layer 3 - Third image */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: 0,
        width: '100%',
        height: '25%',
        opacity: animationStage >= 3 ? 1 : 0,
        transform: animationStage >= 3 ? 'translateY(0)' : 'translateY(100%)',
        transition: 'all 0.8s ease-in-out',
        backgroundImage: `url(${carImages[2]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: 3,
        borderBottom: '2px solid #fbbf24'
      }}></div>

      {/* Layer 4 - Bottom image */}
      <div style={{
        position: 'absolute',
        top: '75%',
        left: 0,
        width: '100%',
        height: '25%',
        opacity: animationStage >= 4 ? 1 : 0,
        transform: animationStage >= 4 ? 'translateY(0)' : 'translateY(100%)',
        transition: 'all 0.8s ease-in-out',
        backgroundImage: `url(${carImages[3]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: 4
      }}></div>

      {/* Overlay to darken images for better text visibility */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(23, 37, 84, 0.7)',
        zIndex: 5
      }}></div>

      {/* Content - Centered properly */}
      <div style={{ 
        position: 'relative', 
        zIndex: 10,
        backgroundColor: 'rgba(23, 37, 84, 0.85)',
        padding: '2.5rem',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
        border: '2px solid #fbbf24',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '90%',
        width: '400px'
      }}>
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: 'bold', 
          marginBottom: '15px',
          color: '#fbbf24',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          width: '100%'
        }}>
          SUNNY AUTOS
        </h1>
        
        <p style={{ 
          fontSize: '1.2rem', 
          marginBottom: '30px',
          fontWeight: 'bold',
          textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
          width: '100%'
        }}>
          Premium Auto Repair & Service
        </p>
        
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: '15px',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <button 
            style={buttonStyle('signin')}
            onMouseEnter={() => setHoveredButton('signin')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={handleSignIn}
          >
            Sign in
          </button>
          
          <button 
            style={buttonStyle('signup')}
            onMouseEnter={() => setHoveredButton('signup')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={handleSignUp}
          >
            Sign Up
          </button>
          
          <button 
            style={buttonStyle('admin')}
            onMouseEnter={() => setHoveredButton('admin')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={handleAdminSignIn}
          >
            Sign in as admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
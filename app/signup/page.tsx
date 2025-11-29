"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { gsap } from 'gsap';

const ORANGE = '#FF8C00';
const ORANGE_LIGHT = '#FFA500';

const Signup = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);

  // Refs for animations
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const formCardRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const inputRefs = useRef<(HTMLDivElement | null)[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const backgroundPatternRef = useRef<HTMLDivElement>(null);
  const floatingAnimationRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    // Enhanced entrance animations
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Enhanced initial states
    gsap.set(backgroundPatternRef.current, {
      scale: 1.1,
      opacity: 0
    });

    gsap.set([leftPanelRef.current, rightPanelRef.current], {
      opacity: 0,
      scale: 0.9,
      rotationY: -5
    });

    gsap.set(formCardRef.current, {
      opacity: 0,
      y: 80,
      scale: 0.9,
      rotationX: 5
    });

    gsap.set(titleRef.current, {
      opacity: 0,
      y: -30,
      scale: 1.1
    });

    gsap.set(inputRefs.current, {
      opacity: 0,
      x: -30
    });

    gsap.set(buttonRef.current, {
      opacity: 0,
      scale: 0.85
    });

    // Enhanced entrance sequence
    tl.to(backgroundPatternRef.current, {
      opacity: 0.6,
      scale: 1,
      duration: 1.5,
      ease: "power2.out"
    })
    .to([leftPanelRef.current, rightPanelRef.current], {
      opacity: 1,
      scale: 1,
      rotationY: 0,
      duration: 1.2,
      stagger: 0.2,
      ease: "power3.out"
    }, "-=1.2")
    .to(formCardRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      rotationX: 0,
      duration: 1,
      ease: "back.out(1.4)"
    }, "-=0.8")
    .to(titleRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: "elastic.out(1, 0.5)"
    }, "-=0.6")
    .to(inputRefs.current, {
      opacity: 1,
      x: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: "power2.out"
    }, "-=0.4")
    .to(buttonRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: "back.out(1.5)"
    }, "-=0.3");

    // Enhanced floating animation with rotation
    floatingAnimationRef.current = gsap.to(formCardRef.current, {
      y: "+=10",
      rotationZ: 0.3,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Enhanced parallax effect with multiple elements
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 25;
      const yPos = (clientY / window.innerHeight - 0.5) * 25;

      gsap.to(rightPanelRef.current, {
        x: xPos * 0.5,
        y: yPos * 0.5,
        rotation: xPos * 0.01,
        duration: 1.5,
        ease: "power2.out"
      });

      gsap.to(formCardRef.current, {
        x: -xPos * 0.2,
        rotationY: xPos * 0.4,
        rotationX: -yPos * 0.2,
        duration: 1,
        ease: "power2.out",
        overwrite: 'auto'
      });

      // Background pattern movement
      gsap.to(backgroundPatternRef.current, {
        x: xPos * 0.1,
        y: yPos * 0.1,
        duration: 2,
        ease: "power2.out"
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      tl.kill();
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else {
      if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
      else if (!/[A-Z]/.test(formData.password)) newErrors.password = 'Password must contain at least one uppercase letter';
      else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) newErrors.password = 'Password must contain at least one special character';
    }
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      // Step 1: Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { 
            first_name: formData.firstName,
            last_name: formData.lastName,
            full_name: `${formData.firstName} ${formData.lastName}`,
            phone: formData.phone 
          },
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        console.log('User created, now creating profile...');

        // Step 2: Create profile in profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              email: formData.email,
              first_name: formData.firstName,
              last_name: formData.lastName,
              full_name: `${formData.firstName} ${formData.lastName}`,
              phone: formData.phone,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ])
          .select();

        if (profileError) {
          console.error('Profile creation error:', profileError);
          
          if (profileError.code === '42501') {
            throw new Error('Permission denied. Please contact support.');
          } else if (profileError.code === '23505') {
            throw new Error('Profile already exists for this user.');
          } else {
            throw new Error(`Failed to create profile: ${profileError.message}`);
          }
        }

        console.log('Profile created successfully:', profileData);

        // Enhanced success animation
        gsap.to(formCardRef.current, {
          scale: 1.05,
          boxShadow: '0 20px 50px rgba(255, 140, 0, 0.4)',
          duration: 0.5,
          ease: "power2.out",
          onComplete: () => {
            alert('Sign up successful! Please check your email for verification.');
            router.push('/signin');
          }
        });
      }
    } catch (error: unknown) {
      console.error('Signup error:', error);
      // Error shake animation
      gsap.to(formCardRef.current, {
        x: 10,
        duration: 0.1,
        repeat: 5,
        yoyo: true,
        ease: "power1.inOut",
        onComplete: () => {
          gsap.to(formCardRef.current, { x: 0, duration: 0.2 });
        }
      });
      
      if (error instanceof Error) {
        alert(error.message || 'An error occurred during sign up');
      } else {
        alert('An unexpected error occurred during sign up');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    gsap.to(formCardRef.current, {
      opacity: 0,
      scale: 0.9,
      y: 50,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => router.push('/')
    });
  };

  const handleTermsClick = () => {
    gsap.to(formCardRef.current, {
      opacity: 0,
      scale: 0.9,
      x: -50,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => router.push('/Tearmscondition')
    });
  };

  const handleSignInClick = () => {
    gsap.to(formCardRef.current, {
      opacity: 0,
      scale: 0.9,
      x: 50,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => router.push('/signin')
    });
  };

  return (
    <div ref={containerRef} style={{ 
      minHeight: '120vh', // Increased height for more scroll
      display: 'flex', 
      flexDirection: 'column',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: 'linear-gradient(135deg, #050505 0%, #0f0f0f 50%, #181818 100%)',
      position: 'relative',
      overflow: 'auto' // Changed to auto for scrolling
    }}>
      
      {/* Enhanced Animated Pattern Background */}
      <div 
        ref={backgroundPatternRef}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(255, 140, 0, 0.08) 2px, transparent 0),
            radial-gradient(circle at 80% 80%, rgba(255, 165, 0, 0.05) 1px, transparent 0)
          `,
          backgroundSize: '60px 60px, 40px 40px',
          zIndex: 1,
          opacity: 0,
          minHeight: '120vh' // Match container height
        }} 
      />

      {/* Enhanced Header */}
      <header style={{
        padding: '1.5rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '1px solid rgba(255, 140, 0, 0.25)',
        backdropFilter: 'blur(15px)',
        position: 'relative',
        zIndex: 10,
        background: 'rgba(12, 12, 12, 0.6)'
      }}>
        <h1 style={{
          fontSize: '2.75rem',
          fontWeight: '800',
          background: `linear-gradient(135deg, #ffffff 0%, ${ORANGE_LIGHT} 45%, ${ORANGE} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          backgroundSize: '200% 200%',
          cursor: 'pointer',
          letterSpacing: '3px',
          textShadow: '0 2px 20px rgba(255, 140, 0, 0.35)',
          fontFamily: 'Georgia, serif',
          transition: 'all 0.3s ease'
        }} 
        onClick={handleBackToHome}
        onMouseEnter={(e) => {
          gsap.to(e.currentTarget, {
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out"
          });
        }}
        onMouseLeave={(e) => {
          gsap.to(e.currentTarget, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
          });
        }}>
          SUNNY AUTO
        </h1>
      </header>

      {/* Main Content */}
      <div style={{
        display: 'flex',
        flex: 1,
        minHeight: 'calc(120vh - 80px)', // Adjusted for increased height
        position: 'relative',
        zIndex: 3,
        paddingBottom: '3rem' // Added padding at bottom
      }}>
        {/* Left Panel - Form */}
        <div ref={leftPanelRef} style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start', // Changed to flex-start for scroll
          alignItems: 'center',
          padding: '3rem',
          position: 'relative',
          paddingTop: '2rem', // Added top padding
          paddingBottom: '4rem' // Added bottom padding for more space
        }}>
          <div ref={formCardRef} style={{
            width: '100%',
            maxWidth: '520px',
            background: 'rgba(17, 17, 17, 0.78)',
            backdropFilter: 'blur(25px) saturate(180%)',
            WebkitBackdropFilter: 'blur(25px) saturate(180%)',
            padding: '3.5rem 3rem',
            borderRadius: '20px',
            boxShadow: `
              0 15px 40px rgba(0, 0, 0, 0.6),
              inset 0 1px 0 rgba(255, 255, 255, 0.08)
            `,
            border: '1px solid rgba(255, 140, 0, 0.35)',
            position: 'relative',
            transform: 'perspective(1000px)',
            transformStyle: 'preserve-3d',
            color: '#f3f4f6',
            marginTop: '1rem', // Added margin
            marginBottom: '3rem' // Added margin for scroll space
          }}>
            {/* Enhanced Top Accent */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '70%',
              height: '3px',
              background: `linear-gradient(90deg, transparent, ${ORANGE}, ${ORANGE_LIGHT}, ${ORANGE}, transparent)`,
              opacity: 0.8,
              filter: 'blur(0.5px)',
              borderRadius: '2px'
            }} />

            <h2 ref={titleRef} style={{
              fontSize: '2.25rem',
              fontWeight: '700',
              marginBottom: '0.75rem',
              background: `linear-gradient(135deg, #ffffff 0%, ${ORANGE_LIGHT} 45%, ${ORANGE} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '1px',
              textAlign: 'center'
            }}>
              Create Your Account
            </h2>
            
            <p style={{
              color: 'rgba(229, 231, 235, 0.7)',
              marginBottom: '2.5rem',
              fontSize: '1rem',
              textAlign: 'center',
              letterSpacing: '0.5px',
              lineHeight: '1.6',
              fontStyle: 'italic'
            }}>
              Join Sunny Auto to access premium automotive services
            </p>

            <form onSubmit={handleSignUp}>
              {/* First Name */}
              <div ref={(el) => { inputRefs.current[0] = el; }} style={{ marginBottom: '1.75rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.75rem', 
                  fontWeight: '600',
                  color: ORANGE_LIGHT,
                  fontSize: '0.95rem',
                  letterSpacing: '0.5px'
                }}>
                  First Name
                </label>
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter your first name" 
                  style={{
                    padding: '1rem 1.25rem',
                    borderRadius: '12px',
                    border: `1px solid ${errors.firstName ? ORANGE_LIGHT : 'rgba(255, 165, 0, 0.45)'}`,
                    backgroundColor: 'rgba(24, 24, 27, 0.6)',
                    color: '#e5e7eb',
                    fontSize: '1rem',
                    width: '100%',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = ORANGE;
                    e.target.style.backgroundColor = 'rgba(38, 38, 38, 0.85)';
                    e.target.style.boxShadow = '0 0 0 4px rgba(255, 140, 0, 0.2)';
                    gsap.to(e.target, { 
                      scale: 1.02, 
                      duration: 0.3,
                      ease: "back.out(1.2)"
                    });
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.firstName ? ORANGE_LIGHT : 'rgba(255, 165, 0, 0.45)';
                    e.target.style.backgroundColor = 'rgba(24, 24, 27, 0.6)';
                    e.target.style.boxShadow = 'none';
                    gsap.to(e.target, { 
                      scale: 1, 
                      duration: 0.3,
                      ease: "power2.out"
                    });
                  }}
                />
                {errors.firstName && (
                  <p style={{ 
                    color: ORANGE_LIGHT, 
                    fontSize: '0.85rem', 
                    marginTop: '0.5rem',
                    fontWeight: '500'
                  }}>
                    {errors.firstName}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div ref={(el) => { inputRefs.current[1] = el; }} style={{ marginBottom: '1.75rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.75rem', 
                  fontWeight: '600',
                  color: ORANGE_LIGHT,
                  fontSize: '0.95rem',
                  letterSpacing: '0.5px'
                }}>
                  Last Name
                </label>
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter your last name" 
                  style={{
                    padding: '1rem 1.25rem',
                    borderRadius: '12px',
                    border: `1px solid ${errors.lastName ? ORANGE_LIGHT : 'rgba(255, 165, 0, 0.45)'}`,
                    backgroundColor: 'rgba(24, 24, 27, 0.6)',
                    color: '#e5e7eb',
                    fontSize: '1rem',
                    width: '100%',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = ORANGE;
                    e.target.style.backgroundColor = 'rgba(38, 38, 38, 0.85)';
                    e.target.style.boxShadow = '0 0 0 4px rgba(255, 140, 0, 0.2)';
                    gsap.to(e.target, { 
                      scale: 1.02, 
                      duration: 0.3,
                      ease: "back.out(1.2)"
                    });
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.lastName ? ORANGE_LIGHT : 'rgba(255, 165, 0, 0.45)';
                    e.target.style.backgroundColor = 'rgba(24, 24, 27, 0.6)';
                    e.target.style.boxShadow = 'none';
                    gsap.to(e.target, { 
                      scale: 1, 
                      duration: 0.3,
                      ease: "power2.out"
                    });
                  }}
                />
                {errors.lastName && (
                  <p style={{ 
                    color: ORANGE_LIGHT, 
                    fontSize: '0.85rem', 
                    marginTop: '0.5rem',
                    fontWeight: '500'
                  }}>
                    {errors.lastName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div ref={(el) => { inputRefs.current[2] = el; }} style={{ marginBottom: '1.75rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.75rem', 
                  fontWeight: '600',
                  color: ORANGE_LIGHT,
                  fontSize: '0.95rem',
                  letterSpacing: '0.5px'
                }}>
                  Email Address
                </label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com" 
                  style={{
                    padding: '1rem 1.25rem',
                    borderRadius: '12px',
                    border: `1px solid ${errors.email ? ORANGE_LIGHT : 'rgba(255, 165, 0, 0.45)'}`,
                    backgroundColor: 'rgba(24, 24, 27, 0.6)',
                    color: '#e5e7eb',
                    fontSize: '1rem',
                    width: '100%',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = ORANGE;
                    e.target.style.backgroundColor = 'rgba(38, 38, 38, 0.85)';
                    e.target.style.boxShadow = '0 0 0 4px rgba(255, 140, 0, 0.2)';
                    gsap.to(e.target, { 
                      scale: 1.02, 
                      duration: 0.3,
                      ease: "back.out(1.2)"
                    });
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.email ? ORANGE_LIGHT : 'rgba(255, 165, 0, 0.45)';
                    e.target.style.backgroundColor = 'rgba(24, 24, 27, 0.6)';
                    e.target.style.boxShadow = 'none';
                    gsap.to(e.target, { 
                      scale: 1, 
                      duration: 0.3,
                      ease: "power2.out"
                    });
                  }}
                />
                {errors.email && (
                  <p style={{ 
                    color: ORANGE_LIGHT, 
                    fontSize: '0.85rem', 
                    marginTop: '0.5rem',
                    fontWeight: '500'
                  }}>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div ref={(el) => { inputRefs.current[3] = el; }} style={{ marginBottom: '1.75rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.75rem', 
                  fontWeight: '600',
                  color: ORANGE_LIGHT,
                  fontSize: '0.95rem',
                  letterSpacing: '0.5px'
                }}>
                  Phone Number
                </label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number" 
                  style={{
                    padding: '1rem 1.25rem',
                    borderRadius: '12px',
                    border: `1px solid ${errors.phone ? ORANGE_LIGHT : 'rgba(255, 165, 0, 0.45)'}`,
                    backgroundColor: 'rgba(24, 24, 27, 0.6)',
                    color: '#e5e7eb',
                    fontSize: '1rem',
                    width: '100%',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = ORANGE;
                    e.target.style.backgroundColor = 'rgba(38, 38, 38, 0.85)';
                    e.target.style.boxShadow = '0 0 0 4px rgba(255, 140, 0, 0.2)';
                    gsap.to(e.target, { 
                      scale: 1.02, 
                      duration: 0.3,
                      ease: "back.out(1.2)"
                    });
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.phone ? ORANGE_LIGHT : 'rgba(255, 165, 0, 0.45)';
                    e.target.style.backgroundColor = 'rgba(24, 24, 27, 0.6)';
                    e.target.style.boxShadow = 'none';
                    gsap.to(e.target, { 
                      scale: 1, 
                      duration: 0.3,
                      ease: "power2.out"
                    });
                  }}
                />
                {errors.phone && (
                  <p style={{ 
                    color: ORANGE_LIGHT, 
                    fontSize: '0.85rem', 
                    marginTop: '0.5rem',
                    fontWeight: '500'
                  }}>
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Password */}
              <div ref={(el) => { inputRefs.current[4] = el; }} style={{ marginBottom: '1.75rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.75rem', 
                  fontWeight: '600',
                  color: ORANGE_LIGHT,
                  fontSize: '0.95rem',
                  letterSpacing: '0.5px'
                }}>
                  Password
                </label>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a strong password" 
                  style={{
                    padding: '1rem 1.25rem',
                    borderRadius: '12px',
                    border: `1px solid ${errors.password ? ORANGE_LIGHT : 'rgba(255, 165, 0, 0.45)'}`,
                    backgroundColor: 'rgba(24, 24, 27, 0.6)',
                    color: '#e5e7eb',
                    fontSize: '1rem',
                    width: '100%',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = ORANGE;
                    e.target.style.backgroundColor = 'rgba(38, 38, 38, 0.85)';
                    e.target.style.boxShadow = '0 0 0 4px rgba(255, 140, 0, 0.2)';
                    gsap.to(e.target, { 
                      scale: 1.02, 
                      duration: 0.3,
                      ease: "back.out(1.2)"
                    });
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.password ? ORANGE_LIGHT : 'rgba(255, 165, 0, 0.45)';
                    e.target.style.backgroundColor = 'rgba(24, 24, 27, 0.6)';
                    e.target.style.boxShadow = 'none';
                    gsap.to(e.target, { 
                      scale: 1, 
                      duration: 0.3,
                      ease: "power2.out"
                    });
                  }}
                />
                {errors.password && (
                  <p style={{ 
                    color: ORANGE_LIGHT, 
                    fontSize: '0.85rem', 
                    marginTop: '0.5rem',
                    fontWeight: '500'
                  }}>
                    {errors.password}
                  </p>
                )}
                
                {/* Password Requirements */}
                <div style={{ 
                  color: 'rgba(229, 231, 235, 0.8)', 
                  fontSize: '0.8rem', 
                  marginTop: '0.8rem',
                  padding: '0.8rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  lineHeight: '1.5',
                  border: '1px solid rgba(255, 165, 0, 0.2)'
                }}>
                  <div style={{ fontWeight: '600', marginBottom: '0.3rem', color: ORANGE_LIGHT }}>
                    Password must contain:
                  </div>
                  <ul style={{ margin: '0', paddingLeft: '1rem' }}>
                    <li style={{ opacity: formData.password.length >= 8 ? 1 : 0.5 }}>At least 8 characters</li>
                    <li style={{ opacity: /[A-Z]/.test(formData.password) ? 1 : 0.5 }}>One uppercase letter</li>
                    <li style={{ opacity: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 1 : 0.5 }}>One special character</li>
                  </ul>
                </div>
              </div>

              {/* Confirm Password */}
              <div ref={(el) => { inputRefs.current[5] = el; }} style={{ marginBottom: '2.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.75rem', 
                  fontWeight: '600',
                  color: ORANGE_LIGHT,
                  fontSize: '0.95rem',
                  letterSpacing: '0.5px'
                }}>
                  Confirm Password
                </label>
                <input 
                  type="password" 
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password" 
                  style={{
                    padding: '1rem 1.25rem',
                    borderRadius: '12px',
                    border: `1px solid ${errors.confirmPassword ? ORANGE_LIGHT : 'rgba(255, 165, 0, 0.45)'}`,
                    backgroundColor: 'rgba(24, 24, 27, 0.6)',
                    color: '#e5e7eb',
                    fontSize: '1rem',
                    width: '100%',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = ORANGE;
                    e.target.style.backgroundColor = 'rgba(38, 38, 38, 0.85)';
                    e.target.style.boxShadow = '0 0 0 4px rgba(255, 140, 0, 0.2)';
                    gsap.to(e.target, { 
                      scale: 1.02, 
                      duration: 0.3,
                      ease: "back.out(1.2)"
                    });
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.confirmPassword ? ORANGE_LIGHT : 'rgba(255, 165, 0, 0.45)';
                    e.target.style.backgroundColor = 'rgba(24, 24, 27, 0.6)';
                    e.target.style.boxShadow = 'none';
                    gsap.to(e.target, { 
                      scale: 1, 
                      duration: 0.3,
                      ease: "power2.out"
                    });
                  }}
                />
                {errors.confirmPassword && (
                  <p style={{ 
                    color: ORANGE_LIGHT, 
                    fontSize: '0.85rem', 
                    marginTop: '0.5rem',
                    fontWeight: '500'
                  }}>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div style={{ 
                marginBottom: '2.5rem', 
                fontSize: '0.9rem',
                color: 'rgba(229, 231, 235, 0.7)',
                textAlign: 'center',
                lineHeight: '1.6'
              }}>
                By creating an account, you agree to our{' '}
                <span 
                  style={{ 
                    color: ORANGE_LIGHT, 
                    cursor: 'pointer', 
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '6px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#f9fafb';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 140, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = ORANGE_LIGHT;
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  onClick={handleTermsClick}
                >
                  Terms and Conditions
                </span>
              </div>

              {/* Enhanced Sign Up Button */}
              <button 
                ref={buttonRef}
                type="submit"
                disabled={loading}
                style={{
                  background: loading 
                    ? 'rgba(75, 85, 99, 0.4)' 
                    : `linear-gradient(135deg, ${ORANGE_LIGHT} 0%, ${ORANGE} 60%, ${ORANGE} 100%)`,
                  color: loading ? '#9ca3af' : '#f9fafb',
                  padding: '1.25rem',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '1.05rem',
                  fontWeight: '700',
                  width: '100%',
                  marginBottom: '2.5rem',
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.8px',
                  boxShadow: loading 
                    ? 'none' 
                    : '0 6px 25px rgba(255, 140, 0, 0.45)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    gsap.to(e.currentTarget, {
                      scale: 1.03,
                      boxShadow: '0 10px 35px rgba(255, 140, 0, 0.6)',
                      duration: 0.3,
                      ease: "power2.out"
                    });
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    gsap.to(e.currentTarget, {
                      scale: 1,
                      boxShadow: '0 6px 25px rgba(255, 140, 0, 0.45)',
                      duration: 0.3,
                      ease: "power2.out"
                    });
                  }
                }}
              >
                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: '18px',
                      height: '18px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>

              {/* Sign In Link - Made more prominent */}
              <div style={{ 
                textAlign: 'center', 
                color: 'rgba(229, 231, 235, 0.7)',
                fontSize: '1rem',
                marginBottom: '1rem',
                padding: '1rem',
                background: 'rgba(255, 165, 0, 0.05)',
                borderRadius: '10px',
                border: '1px solid rgba(255, 165, 0, 0.2)'
              }}>
                Already have an account?{' '}
                <span 
                  style={{ 
                    color: ORANGE_LIGHT, 
                    cursor: 'pointer', 
                    fontWeight: '700',
                    transition: 'all 0.3s ease',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    fontSize: '1.05rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#f9fafb';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 140, 0, 0.15)';
                    gsap.to(e.currentTarget, {
                      scale: 1.05,
                      duration: 0.2
                    });
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = ORANGE_LIGHT;
                    e.currentTarget.style.backgroundColor = 'transparent';
                    gsap.to(e.currentTarget, {
                      scale: 1,
                      duration: 0.2
                    });
                  }}
                  onClick={handleSignInClick}
                >
                  Sign In
                </span>
              </div>
            </form>
          </div>

          {/* Extra Space at Bottom for Scrolling */}
          <div style={{ height: '100px' }}></div>
        </div>

        {/* Right Panel - Visual Enhancement */}
        <div ref={rightPanelRef} style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '3rem',
          position: 'relative',
          overflow: 'hidden',
          paddingBottom: '4rem' // Added padding
        }}>
          {/* Enhanced Visual Elements */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '400px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {/* Animated Geometric Shapes */}
            <div style={{
              position: 'absolute',
              width: '200px',
              height: '200px',
              border: `3px solid ${ORANGE}`,
              borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
              opacity: 0.4,
              filter: 'blur(1px)',
              animation: 'morph 8s ease-in-out infinite'
            }} />
            
            <div style={{
              position: 'absolute',
              width: '150px',
              height: '150px',
              background: `linear-gradient(135deg, ${ORANGE}, ${ORANGE_LIGHT})`,
              borderRadius: '50%',
              opacity: 0.3,
              filter: 'blur(15px)',
              animation: 'pulse 4s ease-in-out infinite alternate'
            }} />

            <div style={{
              position: 'absolute',
              width: '100px',
              height: '100px',
              border: `2px solid ${ORANGE_LIGHT}`,
              borderRadius: '20px',
              opacity: 0.5,
              transform: 'rotate(45deg)',
              animation: 'rotate 10s linear infinite'
            }} />

            {/* Enhanced Welcome Text */}
            <div style={{
              position: 'relative',
              zIndex: 2,
              textAlign: 'center',
              maxWidth: '500px'
            }}>
              <h3 style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                background: `linear-gradient(135deg, #ffffff 0%, ${ORANGE_LIGHT} 45%, ${ORANGE} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '1.5rem',
                letterSpacing: '1.5px'
              }}>
                Welcome to Sunny Auto
              </h3>
              
              <p style={{
                color: 'rgba(229, 231, 235, 0.8)',
                fontSize: '1.1rem',
                lineHeight: '1.7',
                marginBottom: '2rem',
                fontStyle: 'italic'
              }}>
                Experience premium automotive services with cutting-edge technology and exceptional customer care.
              </p>

              {/* Feature List */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginTop: '2rem'
              }}>
                {[
                  '24/7 Roadside Assistance',
                  'Premium Vehicle Services',
                  'Expert Technicians',
                  'Competitive Pricing'
                ].map((feature, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: ORANGE_LIGHT,
                    fontSize: '0.9rem'
                  }}>
                    <div style={{
                      width: '6px',
                      height: '6px',
                      backgroundColor: ORANGE,
                      borderRadius: '50%'
                    }} />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Extra Space at Bottom for Scrolling */}
          <div style={{ height: '100px' }}></div>
        </div>
      </div>

      {/* Enhanced CSS Animations */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes morph {
          0% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
          50% { border-radius: 70% 30% 30% 70% / 70% 70% 30% 30%; }
          100% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.3; }
          100% { transform: scale(1.2); opacity: 0.5; }
        }
        
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(1deg); }
        }
      `}</style>
    </div>
  );
};

export default Signup;
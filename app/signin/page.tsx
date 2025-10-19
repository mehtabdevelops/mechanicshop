"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { gsap } from 'gsap';

const Signin = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      if (data.user) {
        // Check if user exists in admin_signin table
        const { data: adminData, error: adminError } = await supabase
          .from('admin_signin')
          .select('admin_id')
          .eq('admin_id', data.user.id)
          .single();

        if (adminError && adminError.code !== 'PGRST116') {
          // PGRST116 is "not found" error, which is expected for non-admin users
          console.error('Error checking admin status:', adminError);
        }

        // Enhanced success animation
        gsap.to(formCardRef.current, {
          scale: 1.05,
          boxShadow: '0 20px 50px rgba(220, 38, 38, 0.4)',
          duration: 0.5,
          ease: "power2.out",
          onComplete: () => {
            alert('Sign in successful! Welcome back.');
            
            // Store user data in sessionStorage
            sessionStorage.setItem('userData', JSON.stringify({
              id: data.user.id,
              email: data.user.email,
              isAdmin: !!adminData // true if adminData exists
            }));

            // Redirect based on admin status
            if (adminData) {
              // User is admin - redirect to admin home
              router.push('/AdminHome');
            } else {
              // Regular user - redirect to user home
              router.push('/UserHome');
            }
          }
        });
      }  
    } catch (error) {
      console.error('Signin error:', error);
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
        alert(error.message || 'Invalid email or password');
      } else {
        alert('An unexpected error occurred');
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

  const handleSignUpClick = () => {
    gsap.to(formCardRef.current, {
      opacity: 0,
      scale: 0.9,
      x: -50,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => router.push('/signup')
    });
  };

  const handleForgotPassword = () => {
    gsap.to(formCardRef.current, {
      opacity: 0,
      scale: 0.9,
      y: -50,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => router.push('/forgot-password')
    });
  };

  return (
    <div ref={containerRef} style={{ 
      minHeight: '100vh',
      display: 'flex', 
      flexDirection: 'column',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: 'linear-gradient(135deg, #050505 0%, #0f0f0f 50%, #181818 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Enhanced Animated Pattern Background */}
      <div 
        ref={backgroundPatternRef}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(220, 38, 38, 0.08) 2px, transparent 0),
            radial-gradient(circle at 80% 80%, rgba(220, 38, 38, 0.05) 1px, transparent 0)
          `,
          backgroundSize: '60px 60px, 40px 40px',
          zIndex: 1,
          opacity: 0
        }} 
      />

      {/* Enhanced Header */}
      <header style={{
        padding: '1.5rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '1px solid rgba(220, 38, 38, 0.25)',
        backdropFilter: 'blur(15px)',
        position: 'relative',
        zIndex: 10,
        background: 'rgba(12, 12, 12, 0.6)'
      }}>
        <h1 style={{
          fontSize: '2.75rem',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #ffffff 0%, #f87171 45%, #dc2626 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          backgroundSize: '200% 200%',
          cursor: 'pointer',
          letterSpacing: '3px',
          textShadow: '0 2px 20px rgba(220, 38, 38, 0.35)',
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
        minHeight: 'calc(100vh - 80px)',
        position: 'relative',
        zIndex: 3
      }}>
        {/* Left Panel - Form */}
        <div ref={leftPanelRef} style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '3rem',
          position: 'relative'
        }}>
          <div ref={formCardRef} style={{
            width: '100%',
            maxWidth: '480px',
            background: 'rgba(17, 17, 17, 0.78)',
            backdropFilter: 'blur(25px) saturate(180%)',
            WebkitBackdropFilter: 'blur(25px) saturate(180%)',
            padding: '3.5rem 3rem',
            borderRadius: '20px',
            boxShadow: `
              0 15px 40px rgba(0, 0, 0, 0.6),
              inset 0 1px 0 rgba(255, 255, 255, 0.08)
            `,
            border: '1px solid rgba(220, 38, 38, 0.35)',
            position: 'relative',
            transform: 'perspective(1000px)',
            transformStyle: 'preserve-3d',
            color: '#f3f4f6'
          }}>
            {/* Enhanced Top Accent */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '70%',
              height: '3px',
              background: 'linear-gradient(90deg, transparent, #dc2626, #f87171, #dc2626, transparent)',
              opacity: 0.8,
              filter: 'blur(0.5px)',
              borderRadius: '2px'
            }} />

            <h2 ref={titleRef} style={{
              fontSize: '2.25rem',
              fontWeight: '700',
              marginBottom: '0.75rem',
              background: 'linear-gradient(135deg, #ffffff 0%, #f87171 45%, #dc2626 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '1px',
              textAlign: 'center'
            }}>
              Welcome Back
            </h2>
            
            <p style={{
              color: 'rgba(229, 231, 235, 0.7)',
              marginBottom: '3rem',
              fontSize: '1rem',
              textAlign: 'center',
              letterSpacing: '0.5px',
              lineHeight: '1.6',
              fontStyle: 'italic'
            }}>
              Sign in to continue your journey with excellence
            </p>

            <form onSubmit={handleSignIn}>
              {/* Email */}
              <div ref={(el) => { inputRefs.current[0] = el; }} style={{ marginBottom: '2rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.75rem', 
                  fontWeight: '600',
                  color: '#fca5a5',
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
                    border: `1px solid ${errors.email ? '#f87171' : 'rgba(248, 113, 113, 0.45)'}`,
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
                    e.target.style.borderColor = '#dc2626';
                    e.target.style.backgroundColor = 'rgba(38, 38, 38, 0.85)';
                    e.target.style.boxShadow = '0 0 0 4px rgba(220, 38, 38, 0.2)';
                    gsap.to(e.target, { 
                      scale: 1.02, 
                      duration: 0.3,
                      ease: "back.out(1.2)"
                    });
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.email ? '#f87171' : 'rgba(248, 113, 113, 0.45)';
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
                    color: '#ff6b6b', 
                    fontSize: '0.85rem', 
                    marginTop: '0.5rem',
                    fontWeight: '500'
                  }}>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div ref={(el) => { inputRefs.current[1] = el; }} style={{ marginBottom: '2rem' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '0.75rem'
                }}>
                  <label style={{ 
                    fontWeight: '600',
                    color: '#fca5a5',
                    fontSize: '0.95rem',
                    letterSpacing: '0.5px'
                  }}>
                    Password
                  </label>
                  <span 
                    style={{ 
                      color: 'rgba(229, 231, 235, 0.6)', 
                      cursor: 'pointer', 
                      fontSize: '0.85rem',
                      textDecoration: 'none',
                      fontWeight: '500',
                      transition: 'all 0.3s ease',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '6px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#f87171';
                      e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(229, 231, 235, 0.6)';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    onClick={handleForgotPassword}
                  >
                    Forgot password?
                  </span>
                </div>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password" 
                  style={{
                    padding: '1rem 1.25rem',
                    borderRadius: '12px',
                    border: `1px solid ${errors.password ? '#f87171' : 'rgba(248, 113, 113, 0.45)'}`,
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
                    e.target.style.borderColor = '#dc2626';
                    e.target.style.backgroundColor = 'rgba(38, 38, 38, 0.85)';
                    e.target.style.boxShadow = '0 0 0 4px rgba(220, 38, 38, 0.2)';
                    gsap.to(e.target, { 
                      scale: 1.02, 
                      duration: 0.3,
                      ease: "back.out(1.2)"
                    });
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.password ? '#f87171' : 'rgba(248, 113, 113, 0.45)';
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
                    color: '#ff6b6b', 
                    fontSize: '0.85rem', 
                    marginTop: '0.5rem',
                    fontWeight: '500'
                  }}>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Enhanced Sign In Button */}
              <button 
                ref={buttonRef}
                type="submit"
                disabled={loading}
                style={{
                  background: loading 
                    ? 'rgba(75, 85, 99, 0.4)' 
                    : 'linear-gradient(135deg, #dc2626 0%, #b91c1c 60%, #7f1d1d 100%)',
                  color: loading ? '#9ca3af' : '#f9fafb',
                  padding: '1.25rem',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '1.05rem',
                  fontWeight: '700',
                  width: '100%',
                  marginBottom: '2rem',
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.8px',
                  boxShadow: loading 
                    ? 'none' 
                    : '0 6px 25px rgba(220, 38, 38, 0.45)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    gsap.to(e.currentTarget, { 
                      scale: 1.03,
                      boxShadow: '0 8px 35px rgba(220, 38, 38, 0.6)',
                      duration: 0.4,
                      ease: "back.out(1.5)"
                    });
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    gsap.to(e.currentTarget, { 
                      scale: 1,
                      boxShadow: '0 6px 25px rgba(220, 38, 38, 0.45)',
                      duration: 0.4,
                      ease: "power2.out"
                    });
                  }
                }}
              >
                {/* Button shine effect */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(248,113,113,0.4), transparent)',
                  transition: 'left 0.6s ease'
                }} 
                onMouseEnter={(e) => {
                  if (!loading) {
                    gsap.to(e.currentTarget, {
                      left: '100%',
                      duration: 0.6,
                      ease: "power2.out"
                    });
                  }
                }}
                />
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Enhanced Sign Up Link */}
            <div style={{ 
              textAlign: 'center', 
              color: 'rgba(229, 231, 235, 0.6)',
              fontSize: '0.95rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid rgba(220, 38, 38, 0.2)'
            }}>
              <span>Don&apos;t have an account? </span>
              <span 
                style={{ 
                  color: '#f87171', 
                  cursor: 'pointer', 
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  marginLeft: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#f9fafb';
                  e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.1)';
                  gsap.to(e.currentTarget, { scale: 1.05, duration: 0.3 });
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#f87171';
                  e.currentTarget.style.backgroundColor = 'transparent';
                  gsap.to(e.currentTarget, { scale: 1, duration: 0.3 });
                }}
                onClick={handleSignUpClick}
              >
                Sign up
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced Right Panel - Image */}
        <div ref={rightPanelRef} style={{
          flex: 1,
          backgroundImage: `linear-gradient(rgba(15, 15, 15, 0.6), rgba(15, 15, 15, 0.85)), url('https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'flex-end',
          padding: '4rem',
          color: '#f3f4f6',
          position: 'relative',
          filter: 'brightness(0.7) contrast(1.1) saturate(1.05)'
        }}>
          {/* Enhanced vignette */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.75) 70%, rgba(0, 0, 0, 0.95) 100%)'
          }} />
          
          <div style={{
            background: 'rgba(17, 17, 17, 0.78)',
            backdropFilter: 'blur(18px) saturate(180%)',
            WebkitBackdropFilter: 'blur(18px) saturate(180%)',
            padding: '2.5rem',
            borderRadius: '16px',
            border: '1px solid rgba(220, 38, 38, 0.35)',
            position: 'relative',
            zIndex: 1,
            transform: 'perspective(1000px)',
            transformStyle: 'preserve-3d'
          }}>
            <h3 style={{
              fontSize: '2rem',
              fontWeight: '700',
              marginBottom: '1.25rem',
              background: 'linear-gradient(135deg, #ffffff 0%, #f87171 45%, #dc2626 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '0.5px'
            }}>
              Timeless Service, Modern Excellence
            </h3>
            <p style={{
              fontSize: '1.1rem',
              opacity: 0.9,
              maxWidth: '500px',
              lineHeight: '1.7',
              color: 'rgba(229, 231, 235, 0.75)',
              fontStyle: 'italic'
            }}>
              Experience automotive care that combines classic craftsmanship with contemporary innovation. Your journey to premium service starts here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
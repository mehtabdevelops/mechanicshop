"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const Signin = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);

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

      if (data) {
        alert('Sign in successful! Welcome back.');
        router.push('/UserHome');
      }
    } catch (error: unknown) {
      console.error('Signin error:', error);
      if (error instanceof Error) {
        alert(error.message || 'Invalid email or password');
      } else {
        alert('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => router.push('/');
  const handleSignUpClick = () => router.push('/signup');
  const handleForgotPassword = () => router.push('/forgot-password');

  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex', 
      flexDirection: 'column',
      fontFamily: 'UberMove, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#172554'
    }}>
      
      {/* Header */}
      <header style={{
        padding: '1.5rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '1px solid #e5e5e5'
      }}>
        <h1 style={{
          fontSize: '3.0rem',
          fontWeight: '700',
          color: '#fbbf24',
          cursor: 'pointer',
          
        }} onClick={handleBackToHome}>
          SUNNY AUTO
        </h1>
      </header>

      {/* Main Content */}
      <div style={{
        display: 'flex',
        flex: 1,
        minHeight: 'calc(100vh - 80px)'
      }}>
        {/* Left Panel - Form */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
          backgroundColor: '#172554'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '400px'
          }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '700',
              marginBottom: '0.5rem',
              color: '#fbbf24'
            }}>
              Sign in to your account
            </h2>
            
            <p style={{
              color: '#fbbf24',
              marginBottom: '2.5rem',
              fontSize: '1rem'
            }}>
              Welcome back! Please enter your details.
            </p>

            <form onSubmit={handleSignIn}>
              {/* Email */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500',
                  color: '#fbbf24',
                  fontSize: '0.95rem',
                }}>
                  Email Address
                </label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email" 
                  style={{
                    padding: '0.875rem 1rem',
                    borderRadius: '8px',
                    border: `1px solid ${errors.email ? '#e53e3e' : '#d1d5db'}`,
                    backgroundColor: 'white',
                    color: 'black',
                    fontSize: '1rem',
                    width: '100%',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.email ? '#e53e3e' : '#d1d5db';
                  }}
                />
                {errors.email && (
                  <p style={{ 
                    color: '#fbbf24', 
                    fontSize: '0.875rem', 
                    marginTop: '0.5rem',
                  }}>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }}>
                  <label style={{ 
                    fontWeight: '500',
                    color: '#fbbf24',
                    fontSize: '0.95rem',
                  }}>
                    Password
                  </label>
                  <span 
                    style={{ 
                      color: '#fbbf24', 
                      cursor: 'pointer', 
                      fontSize: '0.875rem',
                      textDecoration: 'none',
                      fontWeight: '500'
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
                    padding: '0.875rem 1rem',
                    borderRadius: '8px',
                    border: `1px solid ${errors.password ? '#e53e3e' : '#d1d5db'}`,
                    backgroundColor: 'white',
                    color: 'black',
                    fontSize: '1rem',
                    width: '100%',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.password ? '#e53e3e' : '#d1d5db';
                  }}
                />
                {errors.password && (
                  <p style={{ 
                    color: '#e53e3e', 
                    fontSize: '0.875rem', 
                    marginTop: '0.5rem',
                  }}>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Sign In Button */}
              <button 
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: loading ? '#9ca3af' : '#0f172a',
                  color: '#fbbf24',
                  padding: '1rem',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  width: '100%',
                  marginBottom: '1.5rem',
                  transition: 'background-color 0.2s ease',
                }}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            {/* Sign Up Link */}
            <div style={{ 
              textAlign: 'center', 
              color: '#6b7280',
              fontSize: '0.95rem',
            }}>
              <span>Don't have an account? </span>
              <span 
                style={{ 
                  color: '#fbbf24', 
                  cursor: 'pointer', 
                  fontWeight: '500',
                }}
                onClick={handleSignUpClick}
              >
                Sign up
              </span>
            </div>
          </div>
        </div>

        {/* Right Panel - Image */}
        <div style={{
          flex: 1,
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'flex-end',
          padding: '3rem',
          color: 'white',

        }}>
          <div>
            <h3 style={{
              fontSize: '2rem',
              fontWeight: '700',
              marginBottom: '1rem'
            }}>
              Premium Automotive Experience
            </h3>
            <p style={{
              fontSize: '1.1rem',
              opacity: 0.9,
              maxWidth: '500px'
            }}>
              Discover the finest vehicles and exceptional service with Sunny Auto.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
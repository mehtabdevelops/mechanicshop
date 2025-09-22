"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

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
      const { data, error } = await supabase.auth.signUp({
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
      if (error) throw error;
      if (data) {
        alert('Sign up successful! Please check your email for verification.');
        router.push('/signin');
      }
    } catch (error: unknown) {
      console.error('Signup error:', error);
      if (error instanceof Error) {
        alert(error.message || 'An error occurred during sign up');
      } else {
        alert('An unexpected error occurred during sign up');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => router.push('/');
  const handleTermsClick = () => router.push('/Tearmscondition');
  const handleSignInClick = () => router.push('/signin');

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
            maxWidth: '450px'
          }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '700',
              marginBottom: '0.5rem',
              color: '#fbbf24'
            }}>
              Create your account
            </h2>
            
            <p style={{
              color: '#fbbf24',
              marginBottom: '2.5rem',
              fontSize: '1rem'
            }}>
              Join Sunny Auto to access premium automotive services.
            </p>

            <form onSubmit={handleSignUp}>
              {/* First Name */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500',
                  color: '#fbbf24',
                  fontSize: '0.95rem',
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
                    padding: '0.875rem 1rem',
                    borderRadius: '8px',
                    border: `1px solid ${errors.firstName ? '#e53e3e' : '#d1d5db'}`,
                    backgroundColor: 'white',
                    color: '#1f2937',
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
                    e.target.style.borderColor = errors.firstName ? '#e53e3e' : '#d1d5db';
                  }}
                />
                {errors.firstName && (
                  <p style={{ 
                    color: '#e53e3e', 
                    fontSize: '0.875rem', 
                    marginTop: '0.5rem',
                  }}>
                    {errors.firstName}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500',
                  color: '#fbbf24',
                  fontSize: '0.95rem',
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
                    padding: '0.875rem 1rem',
                    borderRadius: '8px',
                    border: `1px solid ${errors.lastName ? '#e53e3e' : '#d1d5db'}`,
                    backgroundColor: 'white',
                    color: '#1f2937',
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
                    e.target.style.borderColor = errors.lastName ? '#e53e3e' : '#d1d5db';
                  }}
                />
                {errors.lastName && (
                  <p style={{ 
                    color: '#e53e3e', 
                    fontSize: '0.875rem', 
                    marginTop: '0.5rem',
                  }}>
                    {errors.lastName}
                  </p>
                )}
              </div>

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
                    color: '#1f2937',
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
                    color: '#e53e3e', 
                    fontSize: '0.875rem', 
                    marginTop: '0.5rem',
                  }}>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500',
                  color: '#fbbf24',
                  fontSize: '0.95rem',
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
                    padding: '0.875rem 1rem',
                    borderRadius: '8px',
                    border: `1px solid ${errors.phone ? '#e53e3e' : '#d1d5db'}`,
                    backgroundColor: 'white',
                    color: '#1f2937',
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
                    e.target.style.borderColor = errors.phone ? '#e53e3e' : '#d1d5db';
                  }}
                />
                {errors.phone && (
                  <p style={{ 
                    color: '#e53e3e', 
                    fontSize: '0.875rem', 
                    marginTop: '0.5rem',
                  }}>
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Password */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500',
                  color: '#fbbf24',
                  fontSize: '0.95rem',
                }}>
                  Password
                </label>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a password" 
                  style={{
                    padding: '0.875rem 1rem',
                    borderRadius: '8px',
                    border: `1px solid ${errors.password ? '#e53e3e' : '#d1d5db'}`,
                    backgroundColor: 'white',
                    color: '#1f2937',
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
                
                {/* Password Requirements */}
                <div style={{ 
                  color: 'black', 
                  fontSize: '0.8rem', 
                  marginTop: '0.8rem',
                  padding: '0.8rem',
                  background: '#f9fafb',
                  borderRadius: '6px',
                  lineHeight: '1.5',
                }}>
                  <div style={{ fontWeight: '500', marginBottom: '0.3rem', color: '#4b5563' }}>
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
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500',
                  color: '#fbbf24',
                  fontSize: '0.95rem',
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
                    padding: '0.875rem 1rem',
                    borderRadius: '8px',
                    border: `1px solid ${errors.confirmPassword ? '#e53e3e' : '#d1d5db'}`,
                    backgroundColor: 'white',
                    color: '#1f2937',
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
                    e.target.style.borderColor = errors.confirmPassword ? '#e53e3e' : '#d1d5db';
                  }}
                />
                {errors.confirmPassword && (
                  <p style={{ 
                    color: '#e53e3e', 
                    fontSize: '0.875rem', 
                    marginTop: '0.5rem',
                  }}>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div style={{ 
                marginBottom: '1.5rem', 
                fontSize: '0.9rem',
                color: '#6b7280',
              }}>
                By creating an account, you agree to our{' '}
                <span 
                  style={{ 
                    color: '#fbbf24', 
                    cursor: 'pointer', 
                    fontWeight: '500'
                  }}
                  onClick={handleTermsClick}
                >
                  Terms and Conditions
                </span>
              </div>

              {/* Sign Up Button */}
              <button 
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: loading ? '#9ca3af' : '#0f172a',
                  color: 'white',
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
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            {/* Sign In Link */}
            <div style={{ 
              textAlign: 'center', 
              color: 'white',
              fontSize: '0.95rem',
            }}>
              <span>Already have an account? </span>
              <span 
                style={{ 
                  color: '#fbbf24', 
                  cursor: 'pointer', 
                  fontWeight: '500',
                }}
                onClick={handleSignInClick}
              >
                Sign in
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
          color: 'white'
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

export default Signup;
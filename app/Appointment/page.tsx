"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const Appointment = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    vehicleType: '',
    serviceType: '',
    preferredDate: '',
    preferredTime: '',
    message: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);

  // Orange color scheme matching About page
  const colors = {
    primary: '#FF8C00',
    primaryLight: '#FFA500',
    primaryDark: '#cc7000',
    background: '#000000',
    surface: 'rgba(255, 255, 255, 0.05)',
    surfaceLight: 'rgba(255, 255, 255, 0.08)',
    text: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    textMuted: 'rgba(255, 255, 255, 0.5)',
    border: 'rgba(255, 255, 255, 0.1)',
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!formData.vehicleType) newErrors.vehicleType = 'Vehicle type is required';
    if (!formData.serviceType) newErrors.serviceType = 'Service type is required';
    if (!formData.preferredDate) newErrors.preferredDate = 'Preferred date is required';
    if (!formData.preferredTime) newErrors.preferredTime = 'Preferred time is required';

    // Date validation - cannot book in the past
    const selectedDate = new Date(formData.preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (formData.preferredDate && selectedDate < today) {
      newErrors.preferredDate = 'Cannot book appointments in the past';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      
      // Insert appointment into Supabase
      const { data, error } = await supabase
        .from('appointments')
        .insert([
          {
            user_id: session?.user?.id || null,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            vehicle_type: formData.vehicleType,
            service_type: formData.serviceType,
            preferred_date: formData.preferredDate,
            preferred_time: formData.preferredTime,
            message: formData.message,
            status: 'pending',
            created_at: new Date().toISOString(),
          }
        ])
        .select();

      if (error) throw error;

      if (data) {
        alert('Appointment booked successfully! We will contact you to confirm.');
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          vehicleType: '',
          serviceType: '',
          preferredDate: '',
          preferredTime: '',
          message: ''
        });
        router.push('/UserHome');
      }
    } catch (error: unknown) {
      console.error('Appointment booking error:', error);
      if (error instanceof Error) {
        alert(error.message || 'An error occurred while booking the appointment');
      } else {
        alert('An unexpected error occurred while booking the appointment');
      }
    } finally {
      setLoading(false);
    }
  };

  const serviceOptions = [
    'Oil Change',
    'Brake Service',
    'Tire Rotation',
    'Basic Service',
    'Full Service',
    'AC Repair',
    'Battery Replacement',
    'General Maintenance'
  ];

  const vehicleTypes = [
    'Sedan',
    'SUV',
    'Truck',
    'Hatchback',
    'Coupe',
    'Minivan',
    'Luxury',
    'Electric'
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.background,
      color: colors.text,
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.1
      }}>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: `${100 + i * 40}px`,
              height: `${100 + i * 40}px`,
              borderRadius: '50%',
              border: `2px solid ${colors.primary}`,
              top: `${15 + i * 15}%`,
              right: `${5 + i * 10}%`,
              animation: `float ${8 + i * 2}s ease-in-out infinite`
            }}
          />
        ))}
        {[...Array(3)].map((_, i) => (
          <div
            key={i + 5}
            style={{
              position: 'absolute',
              width: `${60 + i * 30}px`,
              height: `${60 + i * 30}px`,
              borderRadius: '50%',
              border: `1px solid ${colors.primaryLight}`,
              bottom: `${20 + i * 10}%`,
              left: `${10 + i * 8}%`,
              animation: `float ${6 + i * 1.5}s ease-in-out infinite ${i * 0.5}s`
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav style={{
        background: 'rgba(0, 0, 0, 0.95)',
        padding: '1.5rem 3rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(20px)',
        marginBottom: '2rem',
        borderBottom: `1px solid ${colors.primary}20`
      }}>
        <div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '900',
            background: `linear-gradient(135deg, #FFFFFF, ${colors.primary})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            cursor: 'pointer',
            letterSpacing: '1px',
            margin: 0
          }} onClick={() => router.push('/UserHome')}>
            SUNNY AUTO
          </h1>
        </div>
        
        <button style={{
          background: 'transparent',
          color: colors.primary,
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          fontSize: '0.9rem',
          border: `1px solid ${colors.primary}50`,
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }} 
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = colors.primary;
          e.currentTarget.style.color = colors.background;
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = colors.primary;
          e.currentTarget.style.transform = 'translateY(0)';
        }}
        onClick={() => router.push('/UserHome')}>
          Back to Home
        </button>
      </nav>

      {/* Main Content */}
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '0 2rem 3rem',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem',
          padding: '4rem 2rem',
          background: colors.surface,
          borderRadius: '20px',
          border: `1px solid ${colors.primary}30`,
          backdropFilter: 'blur(20px)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-10%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${colors.primary}15, transparent)`,
            filter: 'blur(40px)'
          }} />
          
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: '900',
            marginBottom: '1.5rem',
            background: `linear-gradient(135deg, #FFFFFF, ${colors.primary})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-1px',
            position: 'relative',
            zIndex: 1
          }}>
            Book Your Appointment
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: colors.textSecondary,
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6',
            fontWeight: '300',
            position: 'relative',
            zIndex: 1
          }}>
            Schedule your vehicle service with our expert technicians. We'll get you back on the road quickly and safely.
          </p>
        </div>

        {/* Appointment Form */}
        <div style={{
          background: colors.surface,
          padding: '3.5rem',
          borderRadius: '20px',
          border: `1px solid ${colors.primary}30`,
          marginBottom: '3rem',
          backdropFilter: 'blur(20px)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-30%',
            left: '-10%',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${colors.primaryLight}10, transparent)`,
            filter: 'blur(30px)'
          }} />
          
          <form onSubmit={handleSubmit} style={{
            display: 'grid',
            gap: '2.5rem',
            position: 'relative',
            zIndex: 1
          }}>
            {/* Personal Information */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.75rem',
                  fontWeight: '600',
                  color: colors.primary,
                  fontSize: '1.1rem'
                }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '1.25rem 1.5rem',
                    borderRadius: '12px',
                    border: `1px solid ${errors.name ? colors.primaryLight : `${colors.primary}30`}`,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    color: colors.text,
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    fontWeight: '500',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = colors.primary;
                    e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                    e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.name ? colors.primaryLight : `${colors.primary}30`;
                    e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p style={{ 
                    color: colors.primaryLight, 
                    fontSize: '0.9rem', 
                    marginTop: '0.5rem',
                    fontWeight: '500'
                  }}>
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.75rem',
                  fontWeight: '600',
                  color: colors.primary,
                  fontSize: '1.1rem'
                }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '1.25rem 1.5rem',
                    borderRadius: '12px',
                    border: `1px solid ${errors.email ? colors.primaryLight : `${colors.primary}30`}`,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    color: colors.text,
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    fontWeight: '500',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = colors.primary;
                    e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                    e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.email ? colors.primaryLight : `${colors.primary}30`;
                    e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <p style={{ 
                    color: colors.primaryLight, 
                    fontSize: '0.9rem', 
                    marginTop: '0.5rem',
                    fontWeight: '500'
                  }}>
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.75rem',
                  fontWeight: '600',
                  color: colors.primary,
                  fontSize: '1.1rem'
                }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '1.25rem 1.5rem',
                    borderRadius: '12px',
                    border: `1px solid ${errors.phone ? colors.primaryLight : `${colors.primary}30`}`,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    color: colors.text,
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    fontWeight: '500',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = colors.primary;
                    e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                    e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.phone ? colors.primaryLight : `${colors.primary}30`;
                    e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="(555) 123-4567"
                />
                {errors.phone && (
                  <p style={{ 
                    color: colors.primaryLight, 
                    fontSize: '0.9rem', 
                    marginTop: '0.5rem',
                    fontWeight: '500'
                  }}>
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.75rem',
                  fontWeight: '600',
                  color: colors.primary,
                  fontSize: '1.1rem'
                }}>
                  Vehicle Type *
                </label>
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '1.25rem 1.5rem',
                    borderRadius: '12px',
                    border: `1px solid ${errors.vehicleType ? colors.primaryLight : `${colors.primary}30`}`,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    color: colors.text,
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    appearance: 'none',
                    fontWeight: '500',
                    fontFamily: 'inherit',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23FF8C00'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1.5rem center',
                    backgroundSize: '1.25rem'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = colors.primary;
                    e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                    e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.vehicleType ? colors.primaryLight : `${colors.primary}30`;
                    e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="">Select Vehicle Type</option>
                  {vehicleTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.vehicleType && (
                  <p style={{ 
                    color: colors.primaryLight, 
                    fontSize: '0.9rem', 
                    marginTop: '0.5rem',
                    fontWeight: '500'
                  }}>
                    {errors.vehicleType}
                  </p>
                )}
              </div>
            </div>

            {/* Service Information */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.75rem',
                  fontWeight: '600',
                  color: colors.primary,
                  fontSize: '1.1rem'
                }}>
                  Service Type *
                </label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '1.25rem 1.5rem',
                    borderRadius: '12px',
                    border: `1px solid ${errors.serviceType ? colors.primaryLight : `${colors.primary}30`}`,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    color: colors.text,
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    appearance: 'none',
                    fontWeight: '500',
                    fontFamily: 'inherit',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23FF8C00'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1.5rem center',
                    backgroundSize: '1.25rem'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = colors.primary;
                    e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                    e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.serviceType ? colors.primaryLight : `${colors.primary}30`;
                    e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="">Select Service</option>
                  {serviceOptions.map(service => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
                {errors.serviceType && (
                  <p style={{ 
                    color: colors.primaryLight, 
                    fontSize: '0.9rem', 
                    marginTop: '0.5rem',
                    fontWeight: '500'
                  }}>
                    {errors.serviceType}
                  </p>
                )}
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.75rem',
                  fontWeight: '600',
                  color: colors.primary,
                  fontSize: '1.1rem'
                }}>
                  Preferred Date *
                </label>
                <input
                  type="date"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  style={{
                    width: '100%',
                    padding: '1.25rem 1.5rem',
                    borderRadius: '12px',
                    border: `1px solid ${errors.preferredDate ? colors.primaryLight : `${colors.primary}30`}`,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    color: colors.text,
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    fontWeight: '500',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = colors.primary;
                    e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                    e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.preferredDate ? colors.primaryLight : `${colors.primary}30`;
                    e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                {errors.preferredDate && (
                  <p style={{ 
                    color: colors.primaryLight, 
                    fontSize: '0.9rem', 
                    marginTop: '0.5rem',
                    fontWeight: '500'
                  }}>
                    {errors.preferredDate}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.75rem',
                fontWeight: '600',
                color: colors.primary,
                fontSize: '1.1rem'
              }}>
                Preferred Time *
              </label>
              <input
                type="time"
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '1.25rem 1.5rem',
                  borderRadius: '12px',
                  border: `1px solid ${errors.preferredTime ? colors.primaryLight : `${colors.primary}30`}`,
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  color: colors.text,
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  fontWeight: '500',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.primary;
                  e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                  e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.preferredTime ? colors.primaryLight : `${colors.primary}30`;
                  e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {errors.preferredTime && (
                <p style={{ 
                  color: colors.primaryLight, 
                  fontSize: '0.9rem', 
                  marginTop: '0.5rem',
                  fontWeight: '500'
                }}>
                  {errors.preferredTime}
                </p>
              )}
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.75rem',
                fontWeight: '600',
                color: colors.primary,
                fontSize: '1.1rem'
              }}>
                Additional Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                style={{
                  width: '100%',
                  padding: '1.25rem 1.5rem',
                  borderRadius: '12px',
                  border: `1px solid ${colors.primary}30`,
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  color: colors.text,
                  fontSize: '1rem',
                  resize: 'vertical',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  fontWeight: '500',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.primary;
                  e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                  e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = `${colors.primary}30`;
                  e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                  e.target.style.boxShadow = 'none';
                }}
                placeholder="Tell us about any specific issues or concerns..."
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{
                background: loading 
                  ? 'rgba(75, 85, 99, 0.4)' 
                  : `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`,
                color: loading ? colors.textMuted : colors.background,
                padding: '1.5rem 3rem',
                borderRadius: '12px',
                fontWeight: '700',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '1.1rem',
                transition: 'all 0.3s ease',
                marginTop: '1rem',
                boxShadow: loading 
                  ? 'none' 
                  : `0 8px 30px ${colors.primary}30`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = `0 15px 40px ${colors.primary}40`;
                }
              }}
              onMouseOut={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 8px 30px ${colors.primary}30`;
                }
              }}
            >
              {loading && (
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid transparent',
                  borderTop: '2px solid currentColor',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
              )}
              {loading ? 'Booking Appointment...' : 'Schedule Appointment'}
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          background: colors.surface,
          borderRadius: '20px',
          border: `1px solid ${colors.primary}30`,
          backdropFilter: 'blur(20px)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            bottom: '-30%',
            right: '-10%',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${colors.primary}10, transparent)`,
            filter: 'blur(30px)'
          }} />
          
          <h3 style={{
            background: `linear-gradient(135deg, #FFFFFF, ${colors.primary})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
            marginBottom: '2rem',
            fontWeight: '900',
            letterSpacing: '-0.5px',
            position: 'relative',
            zIndex: 1
          }}>
            Need Immediate Assistance?
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            maxWidth: '800px',
            margin: '0 auto',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{
              padding: '2rem',
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '15px',
              border: `1px solid ${colors.primary}30`,
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.borderColor = colors.primary;
              e.currentTarget.style.boxShadow = `0 15px 30px ${colors.primary}20`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = `${colors.primary}30`;
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', color: colors.primary }}>📞</div>
              <p style={{ color: colors.primary, margin: '0.5rem 0', fontWeight: '600', fontSize: '1.1rem' }}>Call Us</p>
              <p style={{ color: colors.text, margin: 0, fontWeight: '700', fontSize: '1.2rem' }}>(555) 123-4567</p>
            </div>
            <div style={{
              padding: '2rem',
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '15px',
              border: `1px solid ${colors.primary}30`,
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.borderColor = colors.primary;
              e.currentTarget.style.boxShadow = `0 15px 30px ${colors.primary}20`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = `${colors.primary}30`;
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', color: colors.primary }}>✉️</div>
              <p style={{ color: colors.primary, margin: '0.5rem 0', fontWeight: '600', fontSize: '1.1rem' }}>Email</p>
              <p style={{ color: colors.text, margin: 0, fontWeight: '700', fontSize: '1.2rem' }}>service@sunnyauto.com</p>
            </div>
            <div style={{
              padding: '2rem',
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '15px',
              border: `1px solid ${colors.primary}30`,
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.borderColor = colors.primary;
              e.currentTarget.style.boxShadow = `0 15px 30px ${colors.primary}20`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = `${colors.primary}30`;
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', color: colors.primary }}>🕒</div>
              <p style={{ color: colors.primary, margin: '0.5rem 0', fontWeight: '600', fontSize: '1.1rem' }}>Business Hours</p>
              <p style={{ color: colors.text, margin: '0.25rem 0', fontWeight: '700', fontSize: '1.1rem' }}>Mon-Fri 8AM-6PM</p>
              <p style={{ color: colors.text, margin: 0, fontWeight: '700', fontSize: '1.1rem' }}>Sat 9AM-4PM</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
};

export default Appointment;
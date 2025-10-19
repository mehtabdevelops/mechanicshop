"use client";

import React, { useState } from 'react';
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
      background: 'linear-gradient(135deg, #050505 0%, #0f0f0f 50%, #181818 100%)',
      color: 'white',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '0'
    }}>
      {/* Navigation */}
      <nav style={{
        background: 'rgba(0, 0, 0, 0.95)',
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        boxShadow: '0 2px 20px rgba(0, 0, 0, 0.3)',
        marginBottom: '2rem',
        borderBottom: '1px solid rgba(220, 38, 38, 0.3)',
        backdropFilter: 'blur(10px)'
      }}>
        <div>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #ffffff 0%, #f87171 45%, #dc2626 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            cursor: 'pointer',
            margin: 0,
            letterSpacing: '2px',
            fontFamily: 'Georgia, serif'
          }} onClick={() => router.push('/UserHome')}>
            SUNNY AUTO
          </h1>
        </div>
        
        <button style={{
          background: 'transparent',
          color: '#dc2626',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          fontSize: '1rem',
          border: '1px solid rgba(220, 38, 38, 0.5)'
        }} 
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#dc2626';
          e.currentTarget.style.color = 'white';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = '#dc2626';
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
        padding: '0 2rem 3rem'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem',
          padding: '4rem 2rem',
          background: 'rgba(17, 17, 17, 0.78)',
          borderRadius: '20px',
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(25px) saturate(180%)',
          border: '1px solid rgba(220, 38, 38, 0.35)',
          position: 'relative'
        }}>
          {/* Top Accent Line */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80%',
            height: '3px',
            background: 'linear-gradient(90deg, transparent, #dc2626, #f87171, #dc2626, transparent)',
            filter: 'blur(0.5px)'
          }} />
          
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '800',
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, #ffffff 0%, #f87171 45%, #dc2626 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 4px 30px rgba(220, 38, 38, 0.45)',
            fontFamily: 'Georgia, serif'
          }}>
            Book Your Appointment
          </h1>
          <p style={{
            fontSize: '1.3rem',
            color: 'rgba(229, 231, 235, 0.85)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.7',
            fontWeight: '300',
            fontStyle: 'italic'
          }}>
            Schedule your vehicle service with our expert technicians. We'll get you back on the road quickly and safely.
          </p>
        </div>

        {/* Appointment Form */}
        <div style={{
          background: 'rgba(17, 17, 17, 0.78)',
          padding: '3.5rem',
          borderRadius: '20px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
          marginBottom: '3rem',
          border: '1px solid rgba(220, 38, 38, 0.35)',
          backdropFilter: 'blur(25px) saturate(180%)',
          position: 'relative'
        }}>
          {/* Top Accent Line */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80%',
            height: '3px',
            background: 'linear-gradient(90deg, transparent, #dc2626, #f87171, #dc2626, transparent)',
            filter: 'blur(0.5px)'
          }} />
          
          <form onSubmit={handleSubmit} style={{
            display: 'grid',
            gap: '2.5rem'
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
                  color: '#fca5a5',
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
                    border: `1px solid ${errors.name ? '#f87171' : 'rgba(248, 113, 113, 0.45)'}`,
                    backgroundColor: 'rgba(24, 24, 27, 0.6)',
                    color: '#e5e7eb',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    fontWeight: '500'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#dc2626';
                    e.target.style.backgroundColor = 'rgba(38, 38, 38, 0.85)';
                    e.target.style.boxShadow = '0 0 0 4px rgba(220, 38, 38, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.name ? '#f87171' : 'rgba(248, 113, 113, 0.45)';
                    e.target.style.backgroundColor = 'rgba(24, 24, 27, 0.6)';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p style={{ 
                    color: '#ff6b6b', 
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
                  color: '#fca5a5',
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
                    border: `1px solid ${errors.email ? '#f87171' : 'rgba(248, 113, 113, 0.45)'}`,
                    backgroundColor: 'rgba(24, 24, 27, 0.6)',
                    color: '#e5e7eb',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    fontWeight: '500'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#dc2626';
                    e.target.style.backgroundColor = 'rgba(38, 38, 38, 0.85)';
                    e.target.style.boxShadow = '0 0 0 4px rgba(220, 38, 38, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.email ? '#f87171' : 'rgba(248, 113, 113, 0.45)';
                    e.target.style.backgroundColor = 'rgba(24, 24, 27, 0.6)';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <p style={{ 
                    color: '#ff6b6b', 
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
                  color: '#fca5a5',
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
                    border: `1px solid ${errors.phone ? '#f87171' : 'rgba(248, 113, 113, 0.45)'}`,
                    backgroundColor: 'rgba(24, 24, 27, 0.6)',
                    color: '#e5e7eb',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    fontWeight: '500'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#dc2626';
                    e.target.style.backgroundColor = 'rgba(38, 38, 38, 0.85)';
                    e.target.style.boxShadow = '0 0 0 4px rgba(220, 38, 38, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.phone ? '#f87171' : 'rgba(248, 113, 113, 0.45)';
                    e.target.style.backgroundColor = 'rgba(24, 24, 27, 0.6)';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="(555) 123-4567"
                />
                {errors.phone && (
                  <p style={{ 
                    color: '#ff6b6b', 
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
                  color: '#fca5a5',
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
                    border: `1px solid ${errors.vehicleType ? '#f87171' : 'rgba(248, 113, 113, 0.45)'}`,
                    backgroundColor: 'rgba(24, 24, 27, 0.6)',
                    color: '#e5e7eb',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    appearance: 'none',
                    fontWeight: '500',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23dc2626'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1.5rem center',
                    backgroundSize: '1.25rem'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#dc2626';
                    e.target.style.backgroundColor = 'rgba(38, 38, 38, 0.85)';
                    e.target.style.boxShadow = '0 0 0 4px rgba(220, 38, 38, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.vehicleType ? '#f87171' : 'rgba(248, 113, 113, 0.45)';
                    e.target.style.backgroundColor = 'rgba(24, 24, 27, 0.6)';
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
                    color: '#ff6b6b', 
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
                  color: '#fca5a5',
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
                    border: `1px solid ${errors.serviceType ? '#f87171' : 'rgba(248, 113, 113, 0.45)'}`,
                    backgroundColor: 'rgba(24, 24, 27, 0.6)',
                    color: '#e5e7eb',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    appearance: 'none',
                    fontWeight: '500',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23dc2626'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1.5rem center',
                    backgroundSize: '1.25rem'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#dc2626';
                    e.target.style.backgroundColor = 'rgba(38, 38, 38, 0.85)';
                    e.target.style.boxShadow = '0 0 0 4px rgba(220, 38, 38, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.serviceType ? '#f87171' : 'rgba(248, 113, 113, 0.45)';
                    e.target.style.backgroundColor = 'rgba(24, 24, 27, 0.6)';
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
                    color: '#ff6b6b', 
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
                  color: '#fca5a5',
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
                    border: `1px solid ${errors.preferredDate ? '#f87171' : 'rgba(248, 113, 113, 0.45)'}`,
                    backgroundColor: 'rgba(24, 24, 27, 0.6)',
                    color: '#e5e7eb',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    fontWeight: '500'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#dc2626';
                    e.target.style.backgroundColor = 'rgba(38, 38, 38, 0.85)';
                    e.target.style.boxShadow = '0 0 0 4px rgba(220, 38, 38, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.preferredDate ? '#f87171' : 'rgba(248, 113, 113, 0.45)';
                    e.target.style.backgroundColor = 'rgba(24, 24, 27, 0.6)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                {errors.preferredDate && (
                  <p style={{ 
                    color: '#ff6b6b', 
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
                color: '#fca5a5',
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
                  border: `1px solid ${errors.preferredTime ? '#f87171' : 'rgba(248, 113, 113, 0.45)'}`,
                  backgroundColor: 'rgba(24, 24, 27, 0.6)',
                  color: '#e5e7eb',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  fontWeight: '500'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#dc2626';
                  e.target.style.backgroundColor = 'rgba(38, 38, 38, 0.85)';
                  e.target.style.boxShadow = '0 0 0 4px rgba(220, 38, 38, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.preferredTime ? '#f87171' : 'rgba(248, 113, 113, 0.45)';
                  e.target.style.backgroundColor = 'rgba(24, 24, 27, 0.6)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {errors.preferredTime && (
                <p style={{ 
                  color: '#ff6b6b', 
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
                color: '#fca5a5',
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
                  border: '1px solid rgba(248, 113, 113, 0.45)',
                  backgroundColor: 'rgba(24, 24, 27, 0.6)',
                  color: '#e5e7eb',
                  fontSize: '1rem',
                  resize: 'vertical',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  fontWeight: '500',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#dc2626';
                  e.target.style.backgroundColor = 'rgba(38, 38, 38, 0.85)';
                  e.target.style.boxShadow = '0 0 0 4px rgba(220, 38, 38, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(248, 113, 113, 0.45)';
                  e.target.style.backgroundColor = 'rgba(24, 24, 27, 0.6)';
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
                  : 'linear-gradient(135deg, #dc2626 0%, #b91c1c 60%, #7f1d1d 100%)',
                color: loading ? '#9ca3af' : '#f9fafb',
                padding: '1.5rem 3rem',
                borderRadius: '12px',
                fontWeight: '700',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '1.2rem',
                transition: 'all 0.3s ease',
                marginTop: '1rem',
                boxShadow: loading 
                  ? 'none' 
                  : '0 6px 25px rgba(220, 38, 38, 0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem'
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 12px 35px rgba(220, 38, 38, 0.6)';
                }
              }}
              onMouseOut={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 25px rgba(220, 38, 38, 0.45)';
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
          background: 'rgba(17, 17, 17, 0.78)',
          borderRadius: '20px',
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6)',
          border: '1px solid rgba(220, 38, 38, 0.35)',
          backdropFilter: 'blur(25px) saturate(180%)',
          position: 'relative'
        }}>
          {/* Top Accent Line */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80%',
            height: '3px',
            background: 'linear-gradient(90deg, transparent, #dc2626, #f87171, #dc2626, transparent)',
            filter: 'blur(0.5px)'
          }} />
          
          <h3 style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f87171 45%, #dc2626 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: '2rem',
            marginBottom: '2rem',
            fontWeight: '700',
            fontFamily: 'Georgia, serif'
          }}>
            Need Immediate Assistance?
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            <div style={{
              padding: '2rem',
              background: 'rgba(24, 24, 27, 0.6)',
              borderRadius: '15px',
              boxShadow: '0 5px 20px rgba(0, 0, 0, 0.3)',
              transition: 'all 0.3s ease',
              border: '1px solid rgba(220, 38, 38, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(220, 38, 38, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📞</div>
              <p style={{ color: '#fca5a5', margin: '0.5rem 0', fontWeight: '600', fontSize: '1.1rem' }}>Call Us</p>
              <p style={{ color: '#dc2626', margin: 0, fontWeight: '700', fontSize: '1.2rem' }}>(555) 123-4567</p>
            </div>
            <div style={{
              padding: '2rem',
              background: 'rgba(24, 24, 27, 0.6)',
              borderRadius: '15px',
              boxShadow: '0 5px 20px rgba(0, 0, 0, 0.3)',
              transition: 'all 0.3s ease',
              border: '1px solid rgba(220, 38, 38, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(220, 38, 38, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✉️</div>
              <p style={{ color: '#fca5a5', margin: '0.5rem 0', fontWeight: '600', fontSize: '1.1rem' }}>Email</p>
              <p style={{ color: '#dc2626', margin: 0, fontWeight: '700', fontSize: '1.2rem' }}>service@sunnyauto.com</p>
            </div>
            <div style={{
              padding: '2rem',
              background: 'rgba(24, 24, 27, 0.6)',
              borderRadius: '15px',
              boxShadow: '0 5px 20px rgba(0, 0, 0, 0.3)',
              transition: 'all 0.3s ease',
              border: '1px solid rgba(220, 38, 38, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(220, 38, 38, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🕒</div>
              <p style={{ color: '#fca5a5', margin: '0.5rem 0', fontWeight: '600', fontSize: '1.1rem' }}>Business Hours</p>
              <p style={{ color: '#dc2626', margin: '0.25rem 0', fontWeight: '700', fontSize: '1.1rem' }}>Mon-Fri 8AM-6PM</p>
              <p style={{ color: '#dc2626', margin: 0, fontWeight: '700', fontSize: '1.1rem' }}>Sat 9AM-4PM</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Appointment;
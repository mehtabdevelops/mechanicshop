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
      background: 'white',
      color: '#333',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '0'
    }}>
      {/* Navigation */}
      <nav style={{
        background: 'white',
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        marginBottom: '2rem',
        borderBottom: '2px solid #C7613C'
      }}>
        <div>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#C7613C',
            cursor: 'pointer',
            margin: 0
          }} onClick={() => router.push('/UserHome')}>
            SUNNY AUTO
          </h1>
        </div>
        
        <button style={{
          background: 'transparent',
          color: '#C7613C',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          fontSize: '1rem',
          border: '2px solid #C7613C'
        }} 
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#C7613C';
          e.currentTarget.style.color = 'white';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = '#C7613C';
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
          padding: '3rem 2rem',
          background: 'linear-gradient(135deg, #C7613C 0%, #e07a4f 100%)',
          borderRadius: '15px',
          boxShadow: '0 10px 30px rgba(199, 97, 60, 0.2)'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '800',
            marginBottom: '1rem',
            color: 'white',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            Book Your Appointment
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: 'white',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6',
            opacity: 0.9
          }}>
            Schedule your vehicle service with our expert technicians. We'll get you back on the road quickly and safely.
          </p>
        </div>

        {/* Appointment Form */}
        <div style={{
          background: 'white',
          padding: '3rem',
          borderRadius: '15px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
          marginBottom: '3rem',
          border: '1px solid #f0f0f0'
        }}>
          <form onSubmit={handleSubmit} style={{
            display: 'grid',
            gap: '2rem'
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
                  color: '#333',
                  fontSize: '1rem'
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
                    padding: '1rem 1.25rem',
                    borderRadius: '10px',
                    border: `2px solid ${errors.name ? '#e53e3e' : '#e0e0e0'}`,
                    backgroundColor: 'white',
                    color: '#333',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    fontWeight: '500'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#C7613C';
                    e.target.style.boxShadow = '0 0 0 3px rgba(199, 97, 60, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.name ? '#e53e3e' : '#e0e0e0';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p style={{ 
                    color: '#e53e3e', 
                    fontSize: '0.875rem', 
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
                  color: '#333',
                  fontSize: '1rem'
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
                    padding: '1rem 1.25rem',
                    borderRadius: '10px',
                    border: `2px solid ${errors.email ? '#e53e3e' : '#e0e0e0'}`,
                    backgroundColor: 'white',
                    color: '#333',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    fontWeight: '500'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#C7613C';
                    e.target.style.boxShadow = '0 0 0 3px rgba(199, 97, 60, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.email ? '#e53e3e' : '#e0e0e0';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <p style={{ 
                    color: '#e53e3e', 
                    fontSize: '0.875rem', 
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
                  color: '#333',
                  fontSize: '1rem'
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
                    padding: '1rem 1.25rem',
                    borderRadius: '10px',
                    border: `2px solid ${errors.phone ? '#e53e3e' : '#e0e0e0'}`,
                    backgroundColor: 'white',
                    color: '#333',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    fontWeight: '500'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#C7613C';
                    e.target.style.boxShadow = '0 0 0 3px rgba(199, 97, 60, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.phone ? '#e53e3e' : '#e0e0e0';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="(555) 123-4567"
                />
                {errors.phone && (
                  <p style={{ 
                    color: '#e53e3e', 
                    fontSize: '0.875rem', 
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
                  color: '#333',
                  fontSize: '1rem'
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
                    padding: '1rem 1.25rem',
                    borderRadius: '10px',
                    border: `2px solid ${errors.vehicleType ? '#e53e3e' : '#e0e0e0'}`,
                    backgroundColor: 'white',
                    color: '#333',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    appearance: 'none',
                    fontWeight: '500',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23C7613C'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '1.25rem'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#C7613C';
                    e.target.style.boxShadow = '0 0 0 3px rgba(199, 97, 60, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.vehicleType ? '#e53e3e' : '#e0e0e0';
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
                    color: '#e53e3e', 
                    fontSize: '0.875rem', 
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
                  color: '#333',
                  fontSize: '1rem'
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
                    padding: '1rem 1.25rem',
                    borderRadius: '10px',
                    border: `2px solid ${errors.serviceType ? '#e53e3e' : '#e0e0e0'}`,
                    backgroundColor: 'white',
                    color: '#333',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    appearance: 'none',
                    fontWeight: '500',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23C7613C'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '1.25rem'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#C7613C';
                    e.target.style.boxShadow = '0 0 0 3px rgba(199, 97, 60, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.serviceType ? '#e53e3e' : '#e0e0e0';
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
                    color: '#e53e3e', 
                    fontSize: '0.875rem', 
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
                  color: '#333',
                  fontSize: '1rem'
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
                    padding: '1rem 1.25rem',
                    borderRadius: '10px',
                    border: `2px solid ${errors.preferredDate ? '#e53e3e' : '#e0e0e0'}`,
                    backgroundColor: 'white',
                    color: '#333',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    fontWeight: '500'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#C7613C';
                    e.target.style.boxShadow = '0 0 0 3px rgba(199, 97, 60, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.preferredDate ? '#e53e3e' : '#e0e0e0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                {errors.preferredDate && (
                  <p style={{ 
                    color: '#e53e3e', 
                    fontSize: '0.875rem', 
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
                color: '#333',
                fontSize: '1rem'
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
                  padding: '1rem 1.25rem',
                  borderRadius: '10px',
                  border: `2px solid ${errors.preferredTime ? '#e53e3e' : '#e0e0e0'}`,
                  backgroundColor: 'white',
                  color: '#333',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  fontWeight: '500'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#C7613C';
                  e.target.style.boxShadow = '0 0 0 3px rgba(199, 97, 60, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.preferredTime ? '#e53e3e' : '#e0e0e0';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {errors.preferredTime && (
                <p style={{ 
                  color: '#e53e3e', 
                  fontSize: '0.875rem', 
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
                color: '#333',
                fontSize: '1rem'
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
                  padding: '1rem 1.25rem',
                  borderRadius: '10px',
                  border: '2px solid #e0e0e0',
                  backgroundColor: 'white',
                  color: '#333',
                  fontSize: '1rem',
                  resize: 'vertical',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  fontWeight: '500',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#C7613C';
                  e.target.style.boxShadow = '0 0 0 3px rgba(199, 97, 60, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e0e0e0';
                  e.target.style.boxShadow = 'none';
                }}
                placeholder="Tell us about any specific issues or concerns..."
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{
                background: loading ? '#cccccc' : '#C7613C',
                color: 'white',
                padding: '1.25rem 2.5rem',
                borderRadius: '10px',
                fontWeight: '700',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '1.1rem',
                transition: 'all 0.3s ease',
                marginTop: '1rem',
                boxShadow: '0 4px 15px rgba(199, 97, 60, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem'
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = '#b55536';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(199, 97, 60, 0.4)';
                }
              }}
              onMouseOut={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = '#C7613C';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(199, 97, 60, 0.3)';
                }
              }}
            >
              {loading && (
                <div style={{
                  width: '18px',
                  height: '18px',
                  border: '2px solid transparent',
                  borderTop: '2px solid white',
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
          padding: '3rem 2rem',
          background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
          borderRadius: '15px',
          boxShadow: '0 5px 20px rgba(0, 0, 0, 0.05)',
          border: '1px solid #f0f0f0'
        }}>
          <h3 style={{
            color: '#C7613C',
            fontSize: '1.75rem',
            marginBottom: '1.5rem',
            fontWeight: '700'
          }}>
            Need Immediate Assistance?
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <div style={{
              padding: '1.5rem',
              background: 'white',
              borderRadius: '10px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📞</div>
              <p style={{ color: '#333', margin: '0.5rem 0', fontWeight: '600' }}>Call Us</p>
              <p style={{ color: '#C7613C', margin: 0, fontWeight: '700', fontSize: '1.1rem' }}>(555) 123-4567</p>
            </div>
            <div style={{
              padding: '1.5rem',
              background: 'white',
              borderRadius: '10px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✉️</div>
              <p style={{ color: '#333', margin: '0.5rem 0', fontWeight: '600' }}>Email</p>
              <p style={{ color: '#C7613C', margin: 0, fontWeight: '700', fontSize: '1.1rem' }}>service@sunnyauto.com</p>
            </div>
            <div style={{
              padding: '1.5rem',
              background: 'white',
              borderRadius: '10px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🕒</div>
              <p style={{ color: '#333', margin: '0.5rem 0', fontWeight: '600' }}>Business Hours</p>
              <p style={{ color: '#C7613C', margin: 0, fontWeight: '700', fontSize: '1rem' }}>Mon-Fri 8AM-6PM</p>
              <p style={{ color: '#C7613C', margin: 0, fontWeight: '700', fontSize: '1rem' }}>Sat 9AM-4PM</p>
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
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Appointment = () => {
  const router = useRouter();
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    alert('Appointment booked successfully!');
    router.push('/Payment');
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
      background: '#172554',
      color: '#1e293b',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '0'
    }}>
      {/* Navigation */}
      <nav style={{
        background: '#172554',
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#fbbf24',
            cursor: 'pointer'
          }} onClick={() => router.push('/UserHome')}>
            SUNNY AUTO
          </h1>
        </div>
        
        <button style={{
          background: 'transparent',
          color: '#fbbf24',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          fontWeight: '500',
          border: '1px solid #cbd5e1',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          fontSize: '1rem'
        }} 
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#f1f5f9';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
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
        border: '2px solid #fbbf24',
        borderRadius: '12px'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem',
          padding: '2rem',
          background: '#172554',
          backdropFilter: 'blur(10px)'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '1rem',
            color: '#fbbf24'
          }}>
            Book Your Appointment
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#fbbf24',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Schedule your vehicle service with our expert technicians. We'll get you back on the road quickly and safely.
          </p>
        </div>

        {/* Appointment Form */}
        <div style={{
          background: '#172554',
          backdropFilter: 'blur(10px)',
          padding: '2.5rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
          marginBottom: '2rem'
        }}>
          <form onSubmit={handleSubmit} style={{
            display: 'grid',
            gap: '1.5rem'
          }}>
            {/* Personal Information */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#fbbf24'
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
                    padding: '0.875rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    color: 'black',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'black';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#fbbf24'
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
                    padding: '0.875rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    color: 'black',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem'
              
            }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#fbbf24'
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
                    padding: '0.875rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    color: '#1f2937',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#fbbf24'
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
                    padding: '0.875rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    color: '#1f2937',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box',
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234b5563'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '1rem'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="">Select Vehicle Type</option>
                  {vehicleTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Service Information */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#fbbf24'
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
                    padding: '0.875rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    color: '#1f2937',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box',
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234b5563'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '1rem'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
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
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#fbbf24'
                }}>
                  Preferred Date *
                </label>
                <input
                  type="date"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid ',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    color: '#1f2937',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#fbbf24'
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
                  padding: '0.875rem 1rem',
                  borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  color: '#1f2937',
                  fontSize: '1rem',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#fbbf24'
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
                  padding: '0.875rem 1rem',
                  borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  color: '#1f2937',
                  fontSize: '1rem',
                  resize: 'vertical',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
                placeholder="Tell us about any specific issues or concerns..."
              />
            </div>

            <button type="submit" style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              color: '#fbbf24',
              padding: '1rem 2rem',
              borderRadius: '8px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.1rem',
              transition: 'all 0.2s ease',
              marginTop: '1rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #1e293b 0%, #334155 100%)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }}>
              Schedule Appointment
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          background: '#172554',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)'
        }}>
          <h3 style={{
            color: '#fbbf24',
            fontSize: '1.5rem',
            marginBottom: '1rem',
            fontWeight: '600'
          }}>
            Need Immediate Assistance?
          </h3>
          <p style={{ color: '#fbbf24', marginBottom: '0.5rem' }}>
            📞 Call us: <strong>(555) 123-4567</strong>
          </p>
          <p style={{ color: '#fbbf24', marginBottom: '0.5rem' }}>
            ✉️ Email: <strong>service@sunnyauto.com</strong>
          </p>
          <p style={{ color: '#fbbf24' }}>
            🕒 Business Hours: Mon-Fri 8AM-6PM, Sat 9AM-4PM
          </p>
        </div>
      </div>
    </div>
  );
};

export default Appointment;
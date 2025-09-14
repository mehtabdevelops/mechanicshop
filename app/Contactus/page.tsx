"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const ContactUs = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
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
    alert('Thank you for contacting us! We will get back to you soon.');
    router.push('/UserHome');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#172554',
      color: '#172554',
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
        marginBottom: '2rem',
        borderBottom: '3px solid #fbbf24'
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
          border: '1px solid #fbbf24',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          fontSize: '1rem'
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
          padding: '2rem',
          background: '#172554',
          borderRadius: '16px',
          border: '2px solid #fbbf24',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '1rem',
            color: '#fbbf24'
          }}>
            Contact Us
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#475569',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Have questions or need assistance? Our team is here to help you with all your automotive needs.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem',
          alignItems: 'start',

        }}>
          {/* Contact Form */}
          <div style={{
            background: '#172554',
            borderRadius: '16px',
            padding: '2.5rem',
            border: '2px solid #fbbf24',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            height: 'fit-content'
          }}>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              marginBottom: '2rem',
              color: '#fbbf24',
              textAlign: 'center'
            }}>
              Send Us a Message
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
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
                    backgroundColor: '#ffffff',
                    color: '#1f2937',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#fbbf24';
                    e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
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
                    backgroundColor: '#ffffff',
                    color: '#1f2937',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#fbbf24';
                    e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#fbbf24'
                }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    backgroundColor: '#ffffff',
                    color: '#1f2937',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#fbbf24';
                    e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.1)';
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
                  fontWeight: '600',
                  color: '#fbbf24'
                }}>
                  Subject *
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    backgroundColor: '#ffffff',
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
                    e.target.style.borderColor = '#fbbf24';
                    e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="service">Service Questions</option>
                  <option value="appointment">Appointment Request</option>
                  <option value="complaint">Complaint</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#fbbf24'
                }}>
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    backgroundColor: '#ffffff',
                    color: '#1f2937',
                    fontSize: '1rem',
                    resize: 'vertical',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#fbbf24';
                    e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="How can we help you?"
                />
              </div>

              <button type="submit" style={{
                background: '#172554',
                color: '#ffffff',
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
                e.currentTarget.style.background = '#fbbf24';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#172554';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
              }}>
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div style={{
            background: '#172554',
            borderRadius: '16px',
            padding: '2.5rem',
            border: '2px solid #fbbf24',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            height: 'fit-content'
          }}>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              marginBottom: '2rem',
              color: '#fbbf24',
              textAlign: 'center'
            }}>
              Contact Information
            </h2>

            <div style={{ marginBottom: '2.5rem' }}>
              <h3 style={{
                color: '#fbbf24',
                fontSize: '1.3rem',
                marginBottom: '1rem',
                fontWeight: '600'
              }}>
                Company Name
              </h3>
              <p style={{ color: '#fbbf24', lineHeight: '1.6' }}>
                Sunny Auto Services
              </p>
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
              <h3 style={{
                color: '#fbbf24',
                fontSize: '1.3rem',
                marginBottom: '1rem',
                fontWeight: '600'
              }}>
                Email
              </h3>
              <p style={{ color: '#fbbf24', lineHeight: '1.6' }}>
                contact@sunnyauto.com
              </p>
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
              <h3 style={{
                color: '#fbbf24',
                fontSize: '1.3rem',
                marginBottom: '1rem',
                fontWeight: '600'
              }}>
                Phone
              </h3>
              <p style={{ color: '#fbbf24', lineHeight: '1.6' }}>
                (368) 999-8074
              </p>
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
              <h3 style={{
                color: '#fbbf24',
                fontSize: '1.3rem',
                marginBottom: '1rem',
                fontWeight: '600'
              }}>
                Additional Phone
              </h3>
              <p style={{ color: '#fbbf24', lineHeight: '1.6' }}>
                (368) 555-1234
              </p>
            </div>

            <div>
              <h3 style={{
                color: '#fbbf24',
                fontSize: '1.3rem',
                marginBottom: '1rem',
                fontWeight: '600'
              }}>
                Business Hours
              </h3>
              <p style={{ color: '#fbbf24', lineHeight: '1.6' }}>
                Monday - Friday: 8:00 AM - 6:00 PM<br />
                Saturday: 9:00 AM - 4:00 PM<br />
                Sunday: Closed
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const OrderSummary = () => {
  const router = useRouter();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('credit');
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    email: '',
    phone: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle payment processing here
    alert('Payment processed successfully! Thank you for your business.');
    router.push('/UserHome');
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '').substring(0, 4);
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2)}`;
    }
    return v;
  };

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
        marginBottom: '2rem',

      }}>
        <div>
          <h1 style={{
            fontSize: '2.0rem',
            fontWeight: '700',
            color: '#fbbf24',
            cursor: 'pointer'
          }} onClick={() => router.push('/')}>
            SUNNY AUTO
          </h1>
        </div>
        
        <button style={{
          background: 'transparent',
          color: '#fbbf24',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          fontWeight: '500',
          border: '1px solid #white',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          fontSize: '1rem'
        }} 
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = 'black';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
        onClick={() => router.push('/Appointment')}>
          Back to Appointment
        </button>
      </nav>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem 3rem'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem',
          padding: '2rem',
          background: '#172554',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          border: '1px solid #fbbf24',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '1rem',
            color: '#fbbf24'
          }}>
            Order Summary
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#fbbf24',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Review your order details and complete your payment
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem',
          alignItems: 'start'
        }}>
          {/* Order Details */}
          <div style={{
            background: '#172554',
            backdropFilter: 'blur(10px)',
            padding: '2.5rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
            borderRadius: '12px',
            border: '1px solid #fbbf24',
          }}>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              marginBottom: '2rem',
              color: '#fbbf24',
              textAlign: 'center',

              
            }}>
              Service Details
            </h2>

            <div style={{ marginBottom: '2rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.2rem 0',
                borderBottom: '1px solid #e2e8f0',
                border: '1px solid #white',
              }}>
                <div>
                  <div style={{ color: '#fbbf24', fontWeight: '600', marginBottom: '0.3rem' }}>Premium Oil Change</div>
                  <div style={{ color: '#fbbf24', fontSize: '0.9rem' }}>Full synthetic oil replacement</div>
                </div>
                <span style={{ color: '#fbbf24', fontWeight: '600' }}>$49.99</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.2rem 0',
                borderBottom: '1px solid #e2e8f0'
              }}>
                <div>
                  <div style={{ color: '#fbbf24', fontWeight: '600', marginBottom: '0.3rem' }}>Brake Inspection</div>
                  <div style={{ color: '#fbbf24', fontSize: '0.9rem' }}>Complete brake system check</div>
                </div>
                <span style={{ color: '#fbbf24', fontWeight: '600' }}>$79.99</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.2rem 0',
                borderBottom: '1px solid #e2e8f0'
              }}>
                <div style={{ color: '#fbbf24' }}>Tax (8%)</div>
                <span style={{ color: '#fbbf24', fontWeight: '600' }}>$10.40</span>
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.5rem 0',
              borderTop: '2px solid #e2e8f0',
              marginBottom: '2rem'
            }}>
              <span style={{ color: '#fbbf24', fontWeight: '700', fontSize: '1.3rem' }}>Total</span>
              <span style={{ color: '#fbbf24', fontWeight: '700', fontSize: '1.5rem' }}>$140.38</span>
            </div>

            <div style={{
              background: '#172554',
              padding: '1.5rem',
              borderRadius: '12px',
              border: '1px solid #fbbf24',
              marginBottom: '2rem'
            }}>
              <h4 style={{ color: '#fbbf24', marginBottom: '1rem', fontWeight: '600' }}>📅 Appointment Details</h4>
              <div style={{ color: '#fbbf24', lineHeight: '1.6' }}>
                <div><strong>Date:</strong> October 15, 2023</div>
                <div><strong>Time:</strong> 2:00 PM</div>
                <div><strong>Vehicle:</strong> Toyota Camry</div>
                <div><strong>Location:</strong> Sunny Auto Main Branch</div>
              </div>
            </div>

            <div style={{
              background: '#fffbeb',
              padding: '1.5rem',
              borderRadius: '12px',
              border: '1px solid #fef3c7'
            }}>
              <h4 style={{ color: '#92400e', marginBottom: '1rem', fontWeight: '600' }}>⏰ Estimated Completion</h4>
              <p style={{ color: '#92400e', fontSize: '0.95rem', lineHeight: '1.5' }}>
                Your service will be completed in approximately 2 hours. We'll notify you when your vehicle is ready.
              </p>
            </div>
          </div>

          {/* Payment Section */}
          <div style={{
            background: '#172554',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '2.5rem',
            border: '1px solid #fbbf24',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
            height: 'fit-content'
          }}>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              marginBottom: '2rem',
              color: '#fbbf24',
              textAlign: 'center'
            }}>
              Payment Information
            </h2>

            {/* Payment Methods */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '1rem',
                fontWeight: '600',
                color: '#fbbf24'
              }}>
                Select Payment Method
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                marginBottom: '2rem'
              }}>
                {['credit', 'debit', 'paypal'].map((method) => (
                  <div
                    key={method}
                    style={{
                      padding: '1.2rem',
                      borderRadius: '12px',
                      border: `2px solid ${selectedPaymentMethod === method ? '#3b82f6' : '#e2e8f0'}`,
                      background: selectedPaymentMethod === method ? '#eff6ff' : '#ffffff',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={() => setSelectedPaymentMethod(method)}
                  >
                    <div style={{
                      fontSize: '1.8rem',
                      marginBottom: '0.5rem'
                    }}>
                      {method === 'credit' ? '💳' : method === 'debit' ? '🏦' : '🔵'}
                    </div>
                    <span style={{
                      color: selectedPaymentMethod === method ? '#3b82f6' : '#374151',
                      fontWeight: '500',
                      textTransform: 'capitalize',
                      fontSize: '0.9rem'
                    }}>
                      {method === 'paypal' ? 'PayPal' : method + ' Card'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#fbbf24'
                }}>
                  Card Number *
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formatCardNumber(formData.cardNumber)}
                  onChange={handleInputChange}
                  required
                  maxLength={19}
                  placeholder="1234 5678 9012 3456"
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
                  fontWeight: '600',
                  color: '#fbbf24'
                }}>
                  Card Holder Name *
                </label>
                <input
                  type="text"
                  name="cardHolder"
                  value={formData.cardHolder}
                  onChange={handleInputChange}
                  required
                  placeholder="John Doe"
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    backgroundColor: '#ffffff',
                    color: '1f2937',
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: '#fbbf24'
                  }}>
                    Expiry Date *
                  </label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={formatExpiryDate(formData.expiryDate)}
                    onChange={handleInputChange}
                    required
                    maxLength={5}
                    placeholder="MM/YY"
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
                    fontWeight: '600',
                    color: '#fbbf24'
                  }}>
                    CVV 
                  </label>
                  <input
                    type="password"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    required
                    maxLength={4}
                    placeholder="123"
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
                  />
                </div>
              </div>

              <button type="submit" style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                color: 'white',
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
                e.currentTarget.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.15)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                Complete Payment - $140.38
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
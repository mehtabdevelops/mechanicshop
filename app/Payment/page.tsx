"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Define the service prices with a type
interface ServicePrices {
  [key: string]: number;
  'Oil Change': number;
  'Brake Service': number;
  'Tire Rotation': number;
  'Basic Service': number;
  'Full Service': number;
  'AC Repair': number;
  'Battery Replacement': number;
  'General Maintenance': number;
}

const OrderSummary = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Service prices mapping with proper typing
  const servicePrices: ServicePrices = {
    'Oil Change': 49.99,
    'Brake Service': 89.99,
    'Tire Rotation': 39.99,
    'Basic Service': 79.99,
    'Full Service': 149.99,
    'AC Repair': 129.99,
    'Battery Replacement': 199.99,
    'General Maintenance': 69.99
  };

  // Get appointment data from URL params or localStorage
  const [appointmentData, setAppointmentData] = useState({
    serviceType: '',
    vehicleType: '',
    preferredDate: '',
    preferredTime: '',
    name: '',
    email: '',
    phone: ''
  });

  const [servicePrice, setServicePrice] = useState(0);
  const taxRate = 0.08; // 8% tax
  const taxAmount = servicePrice * taxRate;
  const totalAmount = servicePrice + taxAmount;

  useEffect(() => {
    // Try to get data from URL parameters first
    const serviceType = searchParams.get('serviceType') || '';
    const vehicleType = searchParams.get('vehicleType') || '';
    const preferredDate = searchParams.get('preferredDate') || '';
    const preferredTime = searchParams.get('preferredTime') || '';
    const name = searchParams.get('name') || '';
    const email = searchParams.get('email') || '';
    const phone = searchParams.get('phone') || '';

    if (serviceType) {
      setAppointmentData({
        serviceType,
        vehicleType,
        preferredDate,
        preferredTime,
        name,
        email,
        phone
      });
      
      // Set the price based on service type with proper type checking
      if (serviceType in servicePrices) {
        setServicePrice(servicePrices[serviceType]);
      }
    } else {
      // Fallback to localStorage if no URL params
      const storedData = localStorage.getItem('appointmentData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setAppointmentData(parsedData);
        
        // Set the price based on service type with proper type checking
        if (parsedData.serviceType && parsedData.serviceType in servicePrices) {
          setServicePrice(servicePrices[parsedData.serviceType]);
        }
      }
    }
  }, [searchParams]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not specified';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return 'Not specified';
    
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    
    return `${formattedHour}:${minutes} ${period}`;
  };

  const handleConfirm = () => {
    // In a real application, you would send this data to your backend
    alert('Appointment confirmed successfully! You will receive a confirmation email shortly.');
    router.push('/UserHome');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      color: '#FF8C00',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '0'
    }}>
      {/* Navigation */}
      <nav style={{
        background: '#000000',
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
            color: '#FF8C00',
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
          border: '1px solid #fbbf24',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          fontSize: '1rem'
        }} 
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(251, 191, 36, 0.1)';
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
          borderRadius: '12px',
          border: '1px solid #fbbf24',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
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
            Review your appointment details before confirmation
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '2rem',
          alignItems: 'start',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {/* Order Details */}
          <div style={{
            background: '#172554',
            padding: '2.5rem',
            borderRadius: '12px',
            border: '1px solid #fbbf24',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              marginBottom: '2rem',
              color: '#fbbf24',
              textAlign: 'center',
            }}>
              Service Summary
            </h2>

            <div style={{ marginBottom: '2rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.2rem 0',
                borderBottom: '1px solid rgba(251, 191, 36, 0.3)',
              }}>
                <div>
                  <div style={{ color: '#fbbf24', fontWeight: '600', marginBottom: '0.3rem' }}>
                    {appointmentData.serviceType || 'Service Not Selected'}
                  </div>
                  <div style={{ color: '#fbbf24', fontSize: '0.9rem' }}>
                    {appointmentData.vehicleType || 'Vehicle Not Specified'}
                  </div>
                </div>
                <span style={{ color: '#fbbf24', fontWeight: '600' }}>
                  ${servicePrice.toFixed(2)}
                </span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.2rem 0',
                borderBottom: '1px solid rgba(251, 191, 36, 0.3)'
              }}>
                <div style={{ color: '#fbbf24' }}>Tax (8%)</div>
                <span style={{ color: '#fbbf24', fontWeight: '600' }}>${taxAmount.toFixed(2)}</span>
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.5rem 0',
              borderTop: '2px solid rgba(251, 191, 36, 0.3)',
              marginBottom: '2rem'
            }}>
              <span style={{ color: '#fbbf24', fontWeight: '700', fontSize: '1.3rem' }}>Total</span>
              <span style={{ color: '#fbbf24', fontWeight: '700', fontSize: '1.5rem' }}>${totalAmount.toFixed(2)}</span>
            </div>

            <div style={{
              background: 'rgba(251, 191, 36, 0.1)',
              padding: '1.5rem',
              borderRadius: '12px',
              border: '1px solid #fbbf24',
              marginBottom: '2rem'
            }}>
              <h4 style={{ color: '#fbbf24', marginBottom: '1rem', fontWeight: '600' }}>📅 Appointment Details</h4>
              <div style={{ color: '#fbbf24', lineHeight: '1.6' }}>
                <div><strong>Date:</strong> {formatDate(appointmentData.preferredDate)}</div>
                <div><strong>Time:</strong> {formatTime(appointmentData.preferredTime)}</div>
                <div><strong>Vehicle:</strong> {appointmentData.vehicleType || 'Not specified'}</div>
                <div><strong>Service:</strong> {appointmentData.serviceType || 'Not specified'}</div>
              </div>
            </div>

            <div style={{
              background: 'rgba(251, 191, 36, 0.1)',
              padding: '1.5rem',
              borderRadius: '12px',
              border: '1px solid #fbbf24',
              marginBottom: '2rem'
            }}>
              <h4 style={{ color: '#fbbf24', marginBottom: '1rem', fontWeight: '600' }}>👤 Customer Information</h4>
              <div style={{ color: '#fbbf24', lineHeight: '1.6' }}>
                <div><strong>Name:</strong> {appointmentData.name || 'Not provided'}</div>
                <div><strong>Email:</strong> {appointmentData.email || 'Not provided'}</div>
                <div><strong>Phone:</strong> {appointmentData.phone || 'Not provided'}</div>
              </div>
            </div>

            <div style={{
              background: 'rgba(251, 191, 36, 0.1)',
              padding: '1.5rem',
              borderRadius: '12px',
              border: '1px solid #fbbf24'
            }}>
              <h4 style={{ color: '#fbbf24', marginBottom: '1rem', fontWeight: '600' }}>⏰ Payment Information</h4>
              <p style={{ color: '#fbbf24', fontSize: '0.95rem', lineHeight: '1.5' }}>
                Payment will be collected at the service center after your appointment is completed.
                You'll receive an invoice via email after the service.
              </p>
            </div>
          </div>

          {/* Confirmation Button */}
          <button 
            onClick={handleConfirm}
            style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              color: '#fbbf24',
              padding: '1rem 2rem',
              borderRadius: '8px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.1rem',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              width: '100%'
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
            }}
          >
            Confirm Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

const TermsConditions = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div style={{ 
      backgroundColor: '#172554',
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      color: 'white',
      padding: '20px'
    }}>
      <div style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        padding: '40px',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '800px',
        maxHeight: '80vh',
        overflowY: 'auto',
        border: '1px solid rgba(251, 191, 36, 0.2)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          marginBottom: '20px',
          color: '#fbbf24',
          textAlign: 'center',
          fontFamily: 'Arial, sans-serif',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
        }}>
          TERMS AND CONDITIONS
        </h1>

        <div style={{ textAlign: 'left', lineHeight: '1.6' }}>
          <h2 style={{ color: '#fbbf24', margin: '20px 0 10px 0', fontWeight: 'bold' }}>1. Acceptance of Terms</h2>
          <p>By accessing and using Sunny Auto services, you accept and agree to be bound by these Terms and Conditions.</p>

          <h2 style={{ color: '#fbbf24', margin: '20px 0 10px 0', fontWeight: 'bold' }}>2. Services Provided</h2>
          <p>Sunny Auto provides automotive repair, maintenance, and related services as described on our website and in our service offerings.</p>

          <h2 style={{ color: '#fbbf24', margin: '20px 0 10px 0', fontWeight: 'bold' }}>3. User Accounts</h2>
          <p>When you create an account with us, you must provide accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials.</p>

          <h2 style={{ color: '#fbbf24', margin: '20px 0 10px 0', fontWeight: 'bold' }}>4. Service Appointments</h2>
          <p>Appointments may be scheduled through our website. We reserve the right to reschedule or cancel appointments due to unforeseen circumstances.</p>

          <h2 style={{ color: '#fbbf24', margin: '20px 0 10px 0', fontWeight: 'bold' }}>5. Payment Terms</h2>
          <p>Payment is due upon completion of services. We accept various payment methods as indicated at our facility.</p>

          <h2 style={{ color: '#fbbf24', margin: '20px 0 10px 0', fontWeight: 'bold' }}>6. Limitation of Liability</h2>
          <p>Sunny Auto shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.</p>

          <h2 style={{ color: '#fbbf24', margin: '20px 0 10px 0', fontWeight: 'bold' }}>7. Changes to Terms</h2>
          <p>We reserve the right to modify these terms at any time. Continued use of our services constitutes acceptance of the modified terms.</p>

          <h2 style={{ color: '#fbbf24', margin: '20px 0 10px 0', fontWeight: 'bold' }}>8. Contact Information</h2>
          <p>For questions about these Terms and Conditions, please contact us at support@sunnyauto.com</p>
        </div>

        <button 
          onClick={handleBack}
          style={{
            backgroundColor: '#fbbf24',
            color: '#172554',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
            marginTop: '30px',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f59e0b';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#fbbf24';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Back to Sign Up
        </button>
      </div>
    </div>
  );
};

export default TermsConditions;
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface Appointment {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicle_type: string;
  service_type: string;
  preferred_date: string;
  preferred_time: string;
  message: string;
  status: string;
  created_at: string;
  amount?: number;
  payment_status?: string;
  invoice_number?: string;
  payment_date?: string;
  payment_method?: string;
}

interface PaymentReport {
  period: string;
  totalRevenue: number;
  totalServices: number;
  averageTicket: number;
  payments: Appointment[];
}

const AdminFinances = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState<'weekly' | 'biweekly' | 'monthly'>('weekly');
  const [paymentData, setPaymentData] = useState({
    amount: 0,
    payment_method: 'credit_card',
    notes: ''
  });
  const [reportData, setReportData] = useState<PaymentReport | null>(null);

  // Color scheme - Orange dominant (60%) with white (40%)
  const colors = {
    primary: '#FF6B35',
    primaryLight: '#FF8C42',
    primaryDark: '#E55A2B',
    primaryExtraLight: '#FFE4D6',
    background: '#FFFFFF',
    surface: '#FFF5F0',
    surfaceLight: '#FFECE6',
    surfaceDark: '#FFD9CC',
    text: '#1E293B',
    textSecondary: '#475569',
    textMuted: '#64748B',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6'
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      
      const { data: appointmentsData, error } = await supabase
        .from('appointments')
        .select('*')
        .order('preferred_date', { ascending: false });

      if (error) {
        console.error('Error fetching appointments:', error);
        return;
      }

      // Add payment data to appointments
      const appointmentsWithPayments = (appointmentsData || []).map(appointment => ({
        ...appointment,
        amount: calculateServiceAmount(appointment.service_type),
        payment_status: appointment.status === 'completed' ? 'paid' : 'pending',
        invoice_number: `INV-${appointment.id.slice(0, 8).toUpperCase()}`,
        payment_method: appointment.status === 'completed' ? 'credit_card' : undefined,
        payment_date: appointment.status === 'completed' ? appointment.preferred_date : undefined
      }));

      setAppointments(appointmentsWithPayments);
      setFilteredAppointments(appointmentsWithPayments.filter(a => a.status === 'completed'));
      
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateServiceAmount = (serviceType: string): number => {
    const prices: { [key: string]: number } = {
      'oil change': 89.99,
      'tire rotation': 49.99,
      'brake service': 199.99,
      'engine diagnostic': 79.99,
      'transmission service': 149.99,
      'battery replacement': 129.99,
      'ac service': 119.99,
      'full service': 299.99,
      'wheel alignment': 89.99,
      'filter replacement': 39.99
    };
    
    return prices[serviceType.toLowerCase()] || 99.99;
  };

  const handleBackToDashboard = () => {
    router.push('/AdminHome');
  };

  const handleProcessPayment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setPaymentData({
      amount: appointment.amount || calculateServiceAmount(appointment.service_type),
      payment_method: 'credit_card',
      notes: ''
    });
    setShowPaymentModal(true);
  };

  const handleSubmitPayment = async () => {
    if (!selectedAppointment) return;

    try {
      // Update appointment in Supabase
      const { error } = await supabase
        .from('appointments')
        .update({
          status: 'completed',
          payment_status: 'paid',
          payment_method: paymentData.payment_method,
          payment_date: new Date().toISOString().split('T')[0]
        })
        .eq('id', selectedAppointment.id);

      if (error) {
        console.error('Error updating payment:', error);
        alert('Failed to process payment. Please try again.');
        return;
      }

      alert('Payment processed successfully!');
      setShowPaymentModal(false);
      setSelectedAppointment(null);
      fetchAppointments(); // Refresh data
      
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Failed to process payment. Please try again.');
    }
  };

  const generatePaymentReport = () => {
    const completedPayments = appointments.filter(a => a.status === 'completed');
    
    let periodPayments: Appointment[] = [];
    const now = new Date();
    
    switch (reportType) {
      case 'weekly':
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        periodPayments = completedPayments.filter(p => 
          new Date(p.payment_date || p.preferred_date) >= weekAgo
        );
        break;
        
      case 'biweekly':
        const twoWeeksAgo = new Date(now);
        twoWeeksAgo.setDate(now.getDate() - 14);
        periodPayments = completedPayments.filter(p => 
          new Date(p.payment_date || p.preferred_date) >= twoWeeksAgo
        );
        break;
        
      case 'monthly':
        const monthAgo = new Date(now);
        monthAgo.setMonth(now.getMonth() - 1);
        periodPayments = completedPayments.filter(p => 
          new Date(p.payment_date || p.preferred_date) >= monthAgo
        );
        break;
    }

    const totalRevenue = periodPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const totalServices = periodPayments.length;
    const averageTicket = totalServices > 0 ? totalRevenue / totalServices : 0;

    setReportData({
      period: reportType,
      totalRevenue,
      totalServices,
      averageTicket,
      payments: periodPayments
    });
    setShowReportModal(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'credit_card': return '💳';
      case 'cash': return '💵';
      case 'debit_card': return '🏦';
      case 'digital_wallet': return '📱';
      default: return '💰';
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'credit_card': return 'Credit Card';
      case 'cash': return 'Cash';
      case 'debit_card': return 'Debit Card';
      case 'digital_wallet': return 'Digital Wallet';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div style={{ 
        background: colors.background,
        minHeight: '100vh', 
        color: colors.text,
        fontFamily: 'Inter, sans-serif',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: `3px solid ${colors.surfaceLight}`,
            borderTop: `3px solid ${colors.primary}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p style={{ color: colors.primary, fontSize: '1.1rem' }}>Loading Payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      background: colors.background,
      minHeight: '100vh', 
      color: colors.text,
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.primary,
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h1 style={{ 
            fontSize: '1.8rem', 
            fontWeight: '800',
            color: colors.background,
            margin: 0,
            cursor: 'pointer'
          }} onClick={handleBackToDashboard}>
            CODE GARAGE
          </h1>
          <div style={{ 
            color: colors.primary, 
            fontSize: '0.9rem',
            fontWeight: '500',
            padding: '0.25rem 0.75rem',
            backgroundColor: colors.background,
            borderRadius: '20px'
          }}>
            FINANCE & PAYMENTS
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button 
            onClick={generatePaymentReport}
            style={{
              backgroundColor: colors.background,
              color: colors.primary,
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.primaryLight;
              e.currentTarget.style.color = colors.background;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.background;
              e.currentTarget.style.color = colors.primary;
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/>
              <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2"/>
              <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2"/>
              <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2"/>
              <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Generate Report
          </button>
          
          <button 
            onClick={handleBackToDashboard}
            style={{
              backgroundColor: 'transparent',
              color: colors.background,
              padding: '0.75rem 1.5rem',
              border: `1px solid ${colors.background}`,
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.background;
              e.currentTarget.style.color = colors.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = colors.background;
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ 
        padding: '2rem',
        minHeight: 'calc(100vh - 100px)'
      }}>
        <div style={{ 
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          {/* Header Section */}
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '2rem'
          }}>
            <div>
              <h2 style={{ 
                fontSize: '2rem', 
                fontWeight: '800',
                color: colors.primary,
                margin: '0 0 0.5rem 0'
              }}>
                Payment Management
              </h2>
              <p style={{ 
                color: colors.textSecondary,
                margin: 0,
                fontSize: '1rem'
              }}>
                Process customer payments and generate financial reports
              </p>
            </div>
            
            {/* Quick Stats */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{
                backgroundColor: colors.surface,
                padding: '1rem 1.5rem',
                borderRadius: '12px',
                border: `2px solid ${colors.primary}`,
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: colors.primary }}>
                  {formatCurrency(appointments.filter(a => a.status === 'completed').reduce((sum, a) => sum + (a.amount || 0), 0))}
                </div>
                <div style={{ fontSize: '0.8rem', color: colors.textSecondary }}>
                  Total Revenue
                </div>
              </div>
              
              <div style={{
                backgroundColor: colors.surface,
                padding: '1rem 1.5rem',
                borderRadius: '12px',
                border: `2px solid ${colors.success}`,
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: colors.success }}>
                  {appointments.filter(a => a.status === 'completed').length}
                </div>
                <div style={{ fontSize: '0.8rem', color: colors.textSecondary }}>
                  Paid Services
                </div>
              </div>
              
              <div style={{
                backgroundColor: colors.surface,
                padding: '1rem 1.5rem',
                borderRadius: '12px',
                border: `2px solid ${colors.warning}`,
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: colors.warning }}>
                  {appointments.filter(a => a.status === 'pending').length}
                </div>
                <div style={{ fontSize: '0.8rem', color: colors.textSecondary }}>
                  Pending Payments
                </div>
              </div>
            </div>
          </div>

          {/* Pending Payments Section */}
          <div style={{
            backgroundColor: colors.surface,
            padding: '2rem',
            borderRadius: '16px',
            border: `2px solid ${colors.primaryLight}`,
            marginBottom: '2rem'
          }}>
            <h3 style={{ 
              color: colors.primary,
              margin: '0 0 1.5rem 0',
              fontSize: '1.5rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              💰 Pending Payments
            </h3>
            
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {appointments.filter(a => a.status === 'pending').length === 0 ? (
                <div style={{
                  padding: '3rem',
                  textAlign: 'center',
                  color: colors.textSecondary
                }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                  <h4 style={{ color: colors.text, marginBottom: '0.5rem' }}>No Pending Payments</h4>
                  <p style={{ margin: 0 }}>All appointments are paid and completed</p>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gap: '1rem'
                }}>
                  {appointments.filter(a => a.status === 'pending').map(appointment => (
                    <div
                      key={appointment.id}
                      style={{
                        backgroundColor: colors.background,
                        padding: '1.5rem',
                        borderRadius: '12px',
                        border: `2px solid ${colors.warning}`,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          marginBottom: '0.5rem'
                        }}>
                          <h4 style={{
                            color: colors.text,
                            margin: 0,
                            fontSize: '1.1rem',
                            fontWeight: '700'
                          }}>
                            {appointment.name}
                          </h4>
                          <span style={{
                            backgroundColor: colors.warning,
                            color: colors.background,
                            padding: '0.25rem 0.75rem',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                          }}>
                            PENDING PAYMENT
                          </span>
                        </div>
                        
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                          gap: '0.5rem',
                          color: colors.textSecondary,
                          fontSize: '0.9rem'
                        }}>
                          <div>📧 {appointment.email}</div>
                          <div>📞 {appointment.phone}</div>
                          <div>🚗 {appointment.vehicle_type}</div>
                          <div>🔧 {appointment.service_type}</div>
                        </div>
                        
                        <div style={{
                          marginTop: '0.5rem',
                          color: colors.textMuted,
                          fontSize: '0.8rem'
                        }}>
                          📅 {formatDate(appointment.preferred_date)} • ⏰ {appointment.preferred_time}
                        </div>
                      </div>
                      
                      <div style={{ textAlign: 'right' }}>
                        <div style={{
                          fontSize: '1.5rem',
                          fontWeight: '800',
                          color: colors.primary,
                          marginBottom: '0.5rem'
                        }}>
                          {formatCurrency(appointment.amount || 0)}
                        </div>
                        <button
                          onClick={() => handleProcessPayment(appointment)}
                          style={{
                            backgroundColor: colors.primary,
                            color: colors.background,
                            border: 'none',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            transition: 'background-color 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = colors.primaryDark;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = colors.primary;
                          }}
                        >
                          Process Payment
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Payment History Section */}
          <div style={{
            backgroundColor: colors.surface,
            padding: '2rem',
            borderRadius: '16px',
            border: `2px solid ${colors.primaryLight}`
          }}>
            <h3 style={{ 
              color: colors.primary,
              margin: '0 0 1.5rem 0',
              fontSize: '1.5rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              📋 Payment History
            </h3>
            
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {filteredAppointments.length === 0 ? (
                <div style={{
                  padding: '3rem',
                  textAlign: 'center',
                  color: colors.textSecondary
                }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💳</div>
                  <h4 style={{ color: colors.text, marginBottom: '0.5rem' }}>No Payment History</h4>
                  <p style={{ margin: 0 }}>Process payments to see history here</p>
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${colors.primaryLight}` }}>
                      <th style={{ padding: '1rem', textAlign: 'left', color: colors.primary, fontWeight: '600' }}>Invoice #</th>
                      <th style={{ padding: '1rem', textAlign: 'left', color: colors.primary, fontWeight: '600' }}>Customer</th>
                      <th style={{ padding: '1rem', textAlign: 'left', color: colors.primary, fontWeight: '600' }}>Service</th>
                      <th style={{ padding: '1rem', textAlign: 'left', color: colors.primary, fontWeight: '600' }}>Date</th>
                      <th style={{ padding: '1rem', textAlign: 'left', color: colors.primary, fontWeight: '600' }}>Amount</th>
                      <th style={{ padding: '1rem', textAlign: 'left', color: colors.primary, fontWeight: '600' }}>Method</th>
                      <th style={{ padding: '1rem', textAlign: 'left', color: colors.primary, fontWeight: '600' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.map(appointment => (
                      <tr key={appointment.id} style={{ borderBottom: `1px solid ${colors.surfaceDark}` }}>
                        <td style={{ padding: '1rem', color: colors.text, fontWeight: '600' }}>
                          {appointment.invoice_number}
                        </td>
                        <td style={{ padding: '1rem', color: colors.text }}>
                          {appointment.name}
                        </td>
                        <td style={{ padding: '1rem', color: colors.text }}>
                          {appointment.service_type}
                        </td>
                        <td style={{ padding: '1rem', color: colors.text }}>
                          {formatDate(appointment.payment_date || appointment.preferred_date)}
                        </td>
                        <td style={{ padding: '1rem', color: colors.text, fontWeight: '600' }}>
                          {formatCurrency(appointment.amount || 0)}
                        </td>
                        <td style={{ padding: '1rem', color: colors.text }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {getPaymentMethodIcon(appointment.payment_method || '')}
                            {getPaymentMethodText(appointment.payment_method || '')}
                          </span>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{
                            backgroundColor: colors.success,
                            color: colors.background,
                            padding: '0.25rem 0.75rem',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                          }}>
                            PAID
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Processing Modal */}
      {showPaymentModal && selectedAppointment && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}>
          <div style={{
            backgroundColor: colors.background,
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '500px',
            width: '100%'
          }}>
            <h3 style={{ 
              color: colors.primary,
              margin: '0 0 1.5rem 0',
              fontSize: '1.5rem',
              fontWeight: '700'
            }}>
              Process Payment
            </h3>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ 
                backgroundColor: colors.surface,
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}>
                <h4 style={{ color: colors.text, margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: '600' }}>
                  Customer: {selectedAppointment.name}
                </h4>
                <p style={{ color: colors.textSecondary, margin: '0 0 0.25rem 0' }}>
                  Service: {selectedAppointment.service_type}
                </p>
                <p style={{ color: colors.textSecondary, margin: 0 }}>
                  Vehicle: {selectedAppointment.vehicle_type}
                </p>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ 
                  display: 'block', 
                  color: colors.text,
                  marginBottom: '0.5rem',
                  fontWeight: '600'
                }}>
                  Amount
                </label>
                <input
                  type="number"
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: `2px solid ${colors.primaryLight}`,
                    backgroundColor: colors.background,
                    color: colors.text,
                    fontSize: '1.1rem',
                    fontWeight: '600'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ 
                  display: 'block', 
                  color: colors.text,
                  marginBottom: '0.5rem',
                  fontWeight: '600'
                }}>
                  Payment Method
                </label>
                <select
                  value={paymentData.payment_method}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, payment_method: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: `2px solid ${colors.primaryLight}`,
                    backgroundColor: colors.background,
                    color: colors.text
                  }}
                >
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="cash">Cash</option>
                  <option value="digital_wallet">Digital Wallet</option>
                </select>
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  color: colors.text,
                  marginBottom: '0.5rem',
                  fontWeight: '600'
                }}>
                  Notes (Optional)
                </label>
                <textarea
                  value={paymentData.notes}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: `2px solid ${colors.primaryLight}`,
                    backgroundColor: colors.background,
                    color: colors.text,
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setShowPaymentModal(false)}
                style={{
                  backgroundColor: 'transparent',
                  color: colors.textSecondary,
                  padding: '0.75rem 1.5rem',
                  border: `1px solid ${colors.textSecondary}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitPayment}
                style={{
                  backgroundColor: colors.primary,
                  color: colors.background,
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Process Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Generation Modal */}
      {showReportModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}>
          <div style={{
            backgroundColor: colors.background,
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '2rem'
            }}>
              <h3 style={{ 
                color: colors.primary,
                margin: 0,
                fontSize: '1.5rem',
                fontWeight: '700'
              }}>
                Payment Report - {reportType.charAt(0).toUpperCase() + reportType.slice(1)}
              </h3>
              <button
                onClick={() => setShowReportModal(false)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: colors.textMuted,
                  cursor: 'pointer',
                  fontSize: '1.2rem'
                }}
              >
                ✕
              </button>
            </div>

            {/* Report Type Selection */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ 
                display: 'block', 
                color: colors.text,
                marginBottom: '0.5rem',
                fontWeight: '600'
              }}>
                Report Period
              </label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {['weekly', 'biweekly', 'monthly'].map(period => (
                  <button
                    key={period}
                    onClick={() => setReportType(period as any)}
                    style={{
                      backgroundColor: reportType === period ? colors.primary : colors.surface,
                      color: reportType === period ? colors.background : colors.text,
                      padding: '0.75rem 1.5rem',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      flex: 1
                    }}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {reportData && (
              <>
                {/* Report Summary */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  marginBottom: '2rem'
                }}>
                  <div style={{
                    backgroundColor: colors.surface,
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: `2px solid ${colors.primary}`,
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '800', color: colors.primary }}>
                      {formatCurrency(reportData.totalRevenue)}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: colors.textSecondary }}>
                      Total Revenue
                    </div>
                  </div>
                  
                  <div style={{
                    backgroundColor: colors.surface,
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: `2px solid ${colors.success}`,
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '800', color: colors.success }}>
                      {reportData.totalServices}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: colors.textSecondary }}>
                      Total Services
                    </div>
                  </div>
                  
                  <div style={{
                    backgroundColor: colors.surface,
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: `2px solid ${colors.info}`,
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '800', color: colors.info }}>
                      {formatCurrency(reportData.averageTicket)}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: colors.textSecondary }}>
                      Average Ticket
                    </div>
                  </div>
                </div>

                {/* Detailed Payments */}
                <div>
                  <h4 style={{ 
                    color: colors.text,
                    margin: '0 0 1rem 0',
                    fontSize: '1.2rem',
                    fontWeight: '600'
                  }}>
                    Payment Details ({reportData.payments.length} payments)
                  </h4>
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {reportData.payments.map(payment => (
                      <div
                        key={payment.id}
                        style={{
                          backgroundColor: colors.surface,
                          padding: '1rem',
                          borderRadius: '8px',
                          marginBottom: '0.75rem',
                          border: `1px solid ${colors.primaryLight}`
                        }}
                      >
                        <div style={{ 
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div>
                            <div style={{ fontWeight: '600', color: colors.text }}>
                              {payment.name} - {payment.service_type}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: colors.textSecondary }}>
                              {payment.invoice_number} • {formatDate(payment.payment_date || payment.preferred_date)}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: '700', color: colors.primary, fontSize: '1.1rem' }}>
                              {formatCurrency(payment.amount || 0)}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: colors.textMuted }}>
                              {getPaymentMethodText(payment.payment_method || '')}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AdminFinances;
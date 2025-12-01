"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Your exact color scheme
const ORANGE = '#FF8C00';
const ORANGE_LIGHT = '#FFA500';
const ORANGE_DARK = '#CC5500';
const ORANGE_DEEP = '#7F3F00';
const ORANGE_RGBA = (alpha: number) => `rgba(255, 140, 0, ${alpha})`;
const ORANGE_LIGHT_RGBA = (alpha: number) => `rgba(255, 165, 0, ${alpha})`;

// Combined interface for payments with appointment info
interface PaymentWithAppointment {
  // Payment fields
  id: string;
  created_at: string;
  profile_id: string;
  invoice_number: string;
  payment_method: string;
  amount: number;
  currency: string;
  client_email: string;
  client_name: string;
  payment_intent_id: string;
  receipt_url: string;
  updated_at: string;
  payment_status: string;
  
  // Appointment fields (joined data)
  appointment_id?: string;
  service_type: string;
  vehicle_type: string;
  preferred_date: string;
  preferred_time: string;
  phone: string;
  status: string;
}

interface ReportData {
  totalRevenue: number;
  completedPayments: number;
  pendingPayments: number;
  averagePaymentValue: number;
  monthlyRevenue: { month: string; revenue: number }[];
  popularServices: { service: string; count: number; revenue: number }[];
  customerStats: {
    totalCustomers: number;
    newCustomers: number;
    returningCustomers: number;
  };
}

const AdminReports = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [payments, setPayments] = useState<PaymentWithAppointment[]>([]);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [selectedReport, setSelectedReport] = useState<'financial' | 'service' | 'customer'>('financial');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentWithAppointment | null>(null);

  // Updated color scheme with your exact orange colors
  const colors = {
    primary: ORANGE,
    primaryLight: ORANGE_LIGHT,
    primaryDark: ORANGE_DARK,
    primaryDeep: ORANGE_DEEP,
    background: '#FFFFFF',
    surface: '#F8F9FA',
    surfaceLight: '#F1F3F5',
    surfaceDark: '#E9ECEF',
    text: '#000000',
    textSecondary: '#2D3748',
    textMuted: '#4A5568',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    border: '#E2E8F0'
  };

  useEffect(() => {
    fetchCombinedData();
  }, []);

  const fetchCombinedData = async () => {
    try {
      setLoading(true);
      
      // Fetch payments with appointment information
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select(`
          *,
          appointments (
            id,
            service_type,
            vehicle_type,
            preferred_date,
            preferred_time,
            phone,
            status,
            name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (paymentsError) {
        console.error('Error fetching payments:', paymentsError);
        return;
      }

      // Transform the data to combine payments with appointment info
      const combinedData: PaymentWithAppointment[] = (paymentsData || []).map(payment => {
        const appointment = payment.appointments?.[0] || payment.appointments; // Handle array or object
        return {
          // Payment fields
          id: payment.id,
          created_at: payment.created_at,
          profile_id: payment.profile_id,
          invoice_number: payment.invoice_number,
          payment_method: payment.payment_method,
          amount: payment.amount,
          currency: payment.currency,
          client_email: payment.client_email,
          client_name: payment.client_name,
          payment_intent_id: payment.payment_intent_id,
          receipt_url: payment.receipt_url,
          updated_at: payment.updated_at,
          payment_status: payment.payment_status,
          
          // Appointment fields
          appointment_id: appointment?.id,
          service_type: appointment?.service_type || 'General Service',
          vehicle_type: appointment?.vehicle_type || 'Not specified',
          preferred_date: appointment?.preferred_date || payment.created_at,
          preferred_time: appointment?.preferred_time || '',
          phone: appointment?.phone || '',
          status: appointment?.status || 'completed'
        };
      });

      setPayments(combinedData);
      generateReportData(combinedData);
      
    } catch (error) {
      console.error('Error fetching combined data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReportData = (paymentsData: PaymentWithAppointment[]) => {
    // Filter completed payments
    const completedPayments = paymentsData.filter(p => 
      p.payment_status === 'completed' || p.payment_status === 'paid'
    );
    
    const totalRevenue = completedPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
    
    // Monthly revenue data (last 6 months)
    const monthlyRevenue = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      const monthPayments = completedPayments.filter(payment => {
        const paymentDate = new Date(payment.created_at);
        return paymentDate.getMonth() === date.getMonth() && paymentDate.getFullYear() === date.getFullYear();
      });
      
      const revenue = monthPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
      
      return { month, revenue };
    }).reverse();

    // Popular services
    const serviceCounts: { [key: string]: { count: number; revenue: number } } = {};
    completedPayments.forEach(payment => {
      const service = payment.service_type;
      if (!serviceCounts[service]) {
        serviceCounts[service] = { count: 0, revenue: 0 };
      }
      serviceCounts[service].count++;
      serviceCounts[service].revenue += payment.amount || 0;
    });

    const popularServices = Object.entries(serviceCounts)
      .map(([service, data]) => ({
        service,
        count: data.count,
        revenue: data.revenue
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Customer stats
    const customerEmails = new Set(completedPayments.map(p => p.client_email));
    const newCustomers = paymentsData.filter(p => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return new Date(p.created_at) >= thirtyDaysAgo;
    }).length;

    const data: ReportData = {
      totalRevenue,
      completedPayments: completedPayments.length,
      pendingPayments: paymentsData.filter(p => p.payment_status === 'pending').length,
      averagePaymentValue: completedPayments.length > 0 ? totalRevenue / completedPayments.length : 0,
      monthlyRevenue,
      popularServices,
      customerStats: {
        totalCustomers: customerEmails.size,
        newCustomers,
        returningCustomers: customerEmails.size - newCustomers
      }
    };

    setReportData(data);
  };

  const handleGenerateReport = () => {
    setGeneratingReport(true);
    setTimeout(() => {
      generateReportData(payments);
      setGeneratingReport(false);
    }, 1500);
  };

  const handleBackToDashboard = () => {
    router.push('/AdminHome');
  };

  const handleCreateInvoice = (payment: PaymentWithAppointment) => {
    setSelectedPayment(payment);
    setShowInvoiceModal(true);
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    alert('PDF download functionality would be implemented here with a PDF generation library');
  };

  const handleSendInvoice = () => {
    alert(`Invoice would be sent to ${selectedPayment?.client_email}`);
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
      month: 'long',
      day: 'numeric'
    });
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
          <p style={{ color: colors.primary, fontSize: '1.1rem', fontWeight: '600' }}>Loading Reports...</p>
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
        backgroundColor: colors.background,
        borderBottom: `2px solid ${colors.primary}`,
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h1 style={{ 
            fontSize: '1.8rem', 
            fontWeight: '800',
            color: colors.primary,
            margin: 0,
            cursor: 'pointer',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
          }} onClick={handleBackToDashboard}>
            SUNNY AUTO
          </h1>
          <div style={{ 
            color: colors.text, 
            fontSize: '0.9rem',
            fontWeight: '700',
            padding: '0.5rem 1rem',
            backgroundColor: ORANGE_RGBA(0.1),
            borderRadius: '8px',
            border: `1px solid ${ORANGE_RGBA(0.3)}`
          }}>
            📊 REPORTS & ANALYTICS
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button 
            onClick={handleGenerateReport}
            disabled={generatingReport}
            style={{
              backgroundColor: generatingReport ? colors.textMuted : colors.primary,
              color: colors.background,
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '8px',
              cursor: generatingReport ? 'not-allowed' : 'pointer',
              fontWeight: '700',
              fontSize: '0.9rem',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 2px 4px rgba(255, 140, 0, 0.3)'
            }}
            onMouseEnter={(e) => {
              if (!generatingReport) {
                e.currentTarget.style.backgroundColor = colors.primaryDark;
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(255, 140, 0, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!generatingReport) {
                e.currentTarget.style.backgroundColor = colors.primary;
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(255, 140, 0, 0.3)';
              }
            }}
          >
            {generatingReport ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: `2px solid transparent`,
                  borderTop: `2px solid ${colors.background}`,
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Generating...
              </>
            ) : (
              <>
                📈 Generate Report
              </>
            )}
          </button>
          
          <button 
            onClick={handleBackToDashboard}
            style={{
              backgroundColor: 'transparent',
              color: colors.primary,
              padding: '0.75rem 1.5rem',
              border: `2px solid ${colors.primary}`,
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '0.9rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.primary;
              e.currentTarget.style.color = colors.background;
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = colors.primary;
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            ← Dashboard
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ 
        padding: '2rem',
        minHeight: 'calc(100vh - 100px)',
        backgroundColor: colors.surfaceLight
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
                fontSize: '2.2rem', 
                fontWeight: '800',
                color: colors.text,
                margin: '0 0 0.5rem 0',
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Business Intelligence Dashboard
              </h2>
              <p style={{ 
                color: colors.textSecondary,
                margin: 0,
                fontSize: '1.1rem',
                fontWeight: '500'
              }}>
                Comprehensive analytics and financial reporting
              </p>
            </div>
            
            {/* Date Range Selector */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.8rem', 
                  color: colors.text,
                  marginBottom: '0.25rem',
                  fontWeight: '700'
                }}>
                  From Date
                </label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  style={{
                    padding: '0.6rem',
                    borderRadius: '6px',
                    border: `2px solid ${colors.border}`,
                    backgroundColor: colors.background,
                    color: colors.text,
                    fontWeight: '500'
                  }}
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.8rem', 
                  color: colors.text,
                  marginBottom: '0.25rem',
                  fontWeight: '700'
                }}>
                  To Date
                </label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  style={{
                    padding: '0.6rem',
                    borderRadius: '6px',
                    border: `2px solid ${colors.border}`,
                    backgroundColor: colors.background,
                    color: colors.text,
                    fontWeight: '500'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Report Type Tabs */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '2rem',
            backgroundColor: colors.background,
            padding: '0.5rem',
            borderRadius: '10px',
            border: `2px solid ${colors.border}`,
            width: 'fit-content',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            {[
              { key: 'financial', label: 'Financial Reports', icon: '💰' },
              { key: 'service', label: 'Service Analytics', icon: '🔧' },
              { key: 'customer', label: 'Customer Insights', icon: '👥' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setSelectedReport(tab.key as any)}
                style={{
                  backgroundColor: selectedReport === tab.key ? colors.primary : 'transparent',
                  color: selectedReport === tab.key ? colors.background : colors.text,
                  padding: '0.8rem 1.8rem',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: selectedReport === tab.key ? `0 2px 8px ${ORANGE_RGBA(0.4)}` : 'none'
                }}
                onMouseEnter={(e) => {
                  if (selectedReport !== tab.key) {
                    e.currentTarget.style.backgroundColor = ORANGE_RGBA(0.1);
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedReport !== tab.key) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Financial Reports */}
          {selectedReport === 'financial' && reportData && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: '2rem',
              marginBottom: '2rem'
            }}>
              {/* Main Financial Metrics */}
              <div style={{
                backgroundColor: colors.background,
                padding: '2rem',
                borderRadius: '12px',
                border: `2px solid ${colors.border}`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ 
                  color: colors.text,
                  margin: '0 0 1.5rem 0',
                  fontSize: '1.4rem',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  💰 Financial Overview
                </h3>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '1.5rem',
                  marginBottom: '2rem'
                }}>
                  <div style={{
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                    padding: '1.8rem',
                    borderRadius: '10px',
                    textAlign: 'center',
                    color: colors.background,
                    boxShadow: `0 4px 12px ${ORANGE_RGBA(0.3)}`
                  }}>
                    <div style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                      {formatCurrency(reportData.totalRevenue)}
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600', opacity: 0.9 }}>
                      Total Revenue
                    </div>
                  </div>
                  
                  <div style={{
                    backgroundColor: colors.success,
                    padding: '1.8rem',
                    borderRadius: '10px',
                    textAlign: 'center',
                    color: colors.background,
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                  }}>
                    <div style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                      {reportData.completedPayments}
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600', opacity: 0.9 }}>
                      Completed Payments
                    </div>
                  </div>
                  
                  <div style={{
                    backgroundColor: colors.info,
                    padding: '1.8rem',
                    borderRadius: '10px',
                    textAlign: 'center',
                    color: colors.background,
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                  }}>
                    <div style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                      {formatCurrency(reportData.averagePaymentValue)}
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600', opacity: 0.9 }}>
                      Average Payment Value
                    </div>
                  </div>
                  
                  <div style={{
                    backgroundColor: colors.warning,
                    padding: '1.8rem',
                    borderRadius: '10px',
                    textAlign: 'center',
                    color: colors.background,
                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                  }}>
                    <div style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                      {reportData.pendingPayments}
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600', opacity: 0.9 }}>
                      Pending Payments
                    </div>
                  </div>
                </div>

                {/* Revenue Chart */}
                <div>
                  <h4 style={{ 
                    color: colors.text,
                    margin: '0 0 1rem 0',
                    fontSize: '1.2rem',
                    fontWeight: '700'
                  }}>
                    📈 Monthly Revenue Trend
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'end', gap: '1rem', height: '200px', padding: '1rem', backgroundColor: colors.surface, borderRadius: '8px' }}>
                    {reportData.monthlyRevenue.map((month, index) => (
                      <div key={month.month} style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ 
                          height: `${(month.revenue / Math.max(...reportData.monthlyRevenue.map(m => m.revenue))) * 150}px`,
                          background: `linear-gradient(to top, ${colors.primary}, ${colors.primaryLight})`,
                          borderRadius: '6px',
                          marginBottom: '0.5rem',
                          position: 'relative',
                          boxShadow: `0 2px 6px ${ORANGE_RGBA(0.3)}`
                        }} />
                        <div style={{ fontSize: '0.8rem', color: colors.text, fontWeight: '600' }}>
                          {month.month}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: colors.primary, fontWeight: '700' }}>
                          {formatCurrency(month.revenue)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Popular Services */}
              <div style={{
                backgroundColor: colors.background,
                padding: '2rem',
                borderRadius: '12px',
                border: `2px solid ${colors.border}`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ 
                  color: colors.text,
                  margin: '0 0 1.5rem 0',
                  fontSize: '1.4rem',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  🏆 Top Services
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {reportData.popularServices.map((service, index) => (
                    <div key={service.service} style={{
                      backgroundColor: colors.surface,
                      padding: '1.2rem',
                      borderRadius: '8px',
                      border: `1px solid ${colors.border}`,
                      transition: 'all 0.2s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    >
                      <div style={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.5rem'
                      }}>
                        <span style={{ fontWeight: '700', color: colors.text, fontSize: '0.95rem' }}>
                          {service.service}
                        </span>
                        <span style={{ 
                          backgroundColor: colors.primary,
                          color: colors.background,
                          padding: '0.3rem 0.7rem',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: '800'
                        }}>
                          {service.count} services
                        </span>
                      </div>
                      <div style={{ fontSize: '0.9rem', color: colors.primary, fontWeight: '600' }}>
                        Revenue: {formatCurrency(service.revenue)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Service Analytics */}
          {selectedReport === 'service' && reportData && (
            <div style={{
              backgroundColor: colors.background,
              padding: '2rem',
              borderRadius: '12px',
              border: `2px solid ${colors.border}`,
              marginBottom: '2rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ 
                color: colors.text,
                margin: '0 0 1.5rem 0',
                fontSize: '1.4rem',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                🔧 Service Performance Analytics
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem'
              }}>
                <div style={{
                  background: `linear-gradient(135deg, ${colors.success}, #059669)`,
                  padding: '2rem',
                  borderRadius: '10px',
                  color: colors.background,
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                }}>
                  <h4 style={{ color: 'inherit', margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '600' }}>
                    Payment Completion Rate
                  </h4>
                  <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                    {((reportData.completedPayments / payments.length) * 100).toFixed(1)}%
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.9, fontWeight: '500' }}>
                    {reportData.completedPayments} of {payments.length} payments completed
                  </div>
                </div>
                
                <div style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                  padding: '2rem',
                  borderRadius: '10px',
                  color: colors.background,
                  boxShadow: `0 4px 12px ${ORANGE_RGBA(0.3)}`
                }}>
                  <h4 style={{ color: 'inherit', margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '600' }}>
                    Revenue per Payment
                  </h4>
                  <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                    {formatCurrency(reportData.averagePaymentValue)}
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.9, fontWeight: '500' }}>
                    Average revenue per completed payment
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Customer Insights */}
          {selectedReport === 'customer' && reportData && (
            <div style={{
              backgroundColor: colors.background,
              padding: '2rem',
              borderRadius: '12px',
              border: `2px solid ${colors.border}`,
              marginBottom: '2rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ 
                color: colors.text,
                margin: '0 0 1.5rem 0',
                fontSize: '1.4rem',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                👥 Customer Insights
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem'
              }}>
                <div style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                  padding: '2rem',
                  borderRadius: '10px',
                  color: colors.background,
                  textAlign: 'center',
                  boxShadow: `0 4px 12px ${ORANGE_RGBA(0.3)}`
                }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                    {reportData.customerStats.totalCustomers}
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: '600', opacity: 0.9 }}>
                    Total Customers
                  </div>
                </div>
                
                <div style={{
                  background: `linear-gradient(135deg, ${colors.success}, #059669)`,
                  padding: '2rem',
                  borderRadius: '10px',
                  color: colors.background,
                  textAlign: 'center',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                    {reportData.customerStats.newCustomers}
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: '600', opacity: 0.9 }}>
                    New Customers (30 days)
                  </div>
                </div>
                
                <div style={{
                  background: `linear-gradient(135deg, ${colors.info}, #1D4ED8)`,
                  padding: '2rem',
                  borderRadius: '10px',
                  color: colors.background,
                  textAlign: 'center',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                    {reportData.customerStats.returningCustomers}
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: '600', opacity: 0.9 }}>
                    Returning Customers
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Billing and Invoices Section */}
          <div style={{
            backgroundColor: colors.background,
            padding: '2rem',
            borderRadius: '12px',
            border: `2px solid ${colors.border}`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ 
              color: colors.text,
              margin: '0 0 1.5rem 0',
              fontSize: '1.4rem',
              fontWeight: '800',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              💳 Payments & Invoices
            </h3>
            
            <div style={{ maxHeight: '400px', overflowY: 'auto', borderRadius: '8px', border: `1px solid ${colors.border}` }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ 
                    backgroundColor: colors.primary,
                    color: colors.background
                  }}>
                    <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', fontSize: '0.9rem' }}>Invoice #</th>
                    <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', fontSize: '0.9rem' }}>Customer</th>
                    <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', fontSize: '0.9rem' }}>Service</th>
                    <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', fontSize: '0.9rem' }}>Date</th>
                    <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', fontSize: '0.9rem' }}>Amount</th>
                    <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', fontSize: '0.9rem' }}>Status</th>
                    <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: '700', fontSize: '0.9rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment, index) => (
                    <tr 
                      key={payment.id} 
                      style={{ 
                        borderBottom: `1px solid ${colors.border}`,
                        backgroundColor: index % 2 === 0 ? colors.background : colors.surface,
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.surfaceLight;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = index % 2 === 0 ? colors.background : colors.surface;
                      }}
                    >
                      <td style={{ padding: '1.2rem', color: colors.text, fontWeight: '600' }}>{payment.invoice_number}</td>
                      <td style={{ padding: '1.2rem', color: colors.text, fontWeight: '500' }}>{payment.client_name}</td>
                      <td style={{ padding: '1.2rem', color: colors.text, fontWeight: '500' }}>{payment.service_type}</td>
                      <td style={{ padding: '1.2rem', color: colors.text, fontWeight: '500' }}>{formatDate(payment.created_at)}</td>
                      <td style={{ padding: '1.2rem', color: colors.primary, fontWeight: '700', fontSize: '1rem' }}>
                        {formatCurrency(payment.amount || 0)}
                      </td>
                      <td style={{ padding: '1.2rem' }}>
                        <span style={{
                          backgroundColor: payment.payment_status === 'paid' || payment.payment_status === 'completed' ? '#10B981' : 
                                         payment.payment_status === 'pending' ? '#F59E0B' : '#EF4444',
                          color: colors.background,
                          padding: '0.4rem 1rem',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: '800',
                          textTransform: 'uppercase'
                        }}>
                          {payment.payment_status}
                        </span>
                      </td>
                      <td style={{ padding: '1.2rem' }}>
                        <button
                          onClick={() => handleCreateInvoice(payment)}
                          style={{
                            background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                            color: colors.background,
                            border: 'none',
                            padding: '0.6rem 1.2rem',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: '700',
                            transition: 'all 0.2s ease',
                            boxShadow: `0 2px 6px ${ORANGE_RGBA(0.3)}`
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = `0 4px 12px ${ORANGE_RGBA(0.4)}`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = `0 2px 6px ${ORANGE_RGBA(0.3)}`;
                          }}
                        >
                          View Invoice
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoiceModal && selectedPayment && (
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
            borderRadius: '12px',
            padding: '2.5rem',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            border: `3px solid ${colors.primary}`,
            boxShadow: `0 10px 30px rgba(0,0,0,0.3)`
          }}>
            {/* Invoice Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '2rem',
              paddingBottom: '1.5rem',
              borderBottom: `3px solid ${colors.primary}`
            }}>
              <div>
                <h2 style={{ 
                  color: colors.primary, 
                  margin: '0 0 0.5rem 0', 
                  fontSize: '2rem', 
                  fontWeight: '800',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                }}>
                  SUNNY AUTO
                </h2>
                <p style={{ color: colors.textSecondary, margin: 0, fontWeight: '500' }}>
                  123 Automotive Drive<br />
                  Service City, SC 12345<br />
                  (555) 123-4567<br />
                  billing@sunnyauto.com
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h3 style={{ 
                  color: colors.text, 
                  margin: '0 0 1rem 0', 
                  fontSize: '1.8rem', 
                  fontWeight: '800',
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  INVOICE
                </h3>
                <p style={{ color: colors.text, margin: '0 0 0.25rem 0', fontWeight: '600' }}>
                  <strong style={{ color: colors.primary }}>Invoice #:</strong> {selectedPayment.invoice_number}
                </p>
                <p style={{ color: colors.text, margin: '0 0 0.25rem 0', fontWeight: '600' }}>
                  <strong style={{ color: colors.primary }}>Date:</strong> {formatDate(selectedPayment.created_at)}
                </p>
                <p style={{ color: colors.text, margin: 0, fontWeight: '600' }}>
                  <strong style={{ color: colors.primary }}>Due Date:</strong> {formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString())}
                </p>
              </div>
            </div>

            {/* Bill To */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ 
                   fontSize: '1.2rem',
                   fontWeight: '700',
                   color: colors.primary,
                   marginBottom: '1rem' 
              }}>
                Bill To:
              </h4>
              <div style={{ 
                backgroundColor: ORANGE_RGBA(0.05), 
                padding: '1.2rem', 
                borderRadius: '8px',
                border: `1px solid ${ORANGE_RGBA(0.2)}`
              }}>
                <p style={{ color: colors.text, margin: '0 0 0.5rem 0', fontWeight: '700', fontSize: '1.1rem' }}>
                  {selectedPayment.client_name}
                </p>
                <p style={{ color: colors.textSecondary, margin: '0 0 0.25rem 0', fontWeight: '500' }}>
                  {selectedPayment.client_email}
                </p>
                <p style={{ color: colors.textSecondary, margin: 0, fontWeight: '500' }}>
                  {selectedPayment.phone}
                </p>
              </div>
            </div>

            {/* Service Details */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ 
                margin: '0 0 1rem 0', 
                fontSize: '1.2rem', 
                fontWeight: '700',
                color: colors.primary
              }}>
                Service Details:
              </h4>
              <div style={{
                backgroundColor: ORANGE_RGBA(0.05),
                padding: '1.2rem',
                borderRadius: '8px',
                border: `1px solid ${ORANGE_RGBA(0.2)}`
              }}>
                <p style={{ color: colors.text, margin: '0 0 0.5rem 0', fontWeight: '600' }}>
                  <strong style={{ color: colors.primary }}>Service Type:</strong> {selectedPayment.service_type}
                </p>
                <p style={{ color: colors.text, margin: '0 0 0.5rem 0', fontWeight: '600' }}>
                  <strong style={{ color: colors.primary }}>Vehicle:</strong> {selectedPayment.vehicle_type}
                </p>
                <p style={{ color: colors.text, margin: '0 0 0.5rem 0', fontWeight: '600' }}>
                  <strong style={{ color: colors.primary }}>Service Date:</strong> {formatDate(selectedPayment.preferred_date)}
                </p>
                <p style={{ color: colors.text, margin: 0, fontWeight: '600' }}>
                  <strong style={{ color: colors.primary }}>Payment Method:</strong> {selectedPayment.payment_method}
                </p>
              </div>
            </div>

            {/* Payment Summary */}
            <div style={{
              backgroundColor: ORANGE_RGBA(0.05),
              padding: '1.8rem',
              borderRadius: '8px',
              marginBottom: '2rem',
              border: `1px solid ${ORANGE_RGBA(0.2)}`
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <span style={{ color: colors.text, fontWeight: '600' }}>Subtotal:</span>
                <span style={{ color: colors.text, fontWeight: '600' }}>
                  {formatCurrency(selectedPayment.amount || 0)}
                </span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <span style={{ color: colors.text, fontWeight: '600' }}>Tax (8.5%):</span>
                <span style={{ color: colors.text, fontWeight: '600' }}>
                  {formatCurrency((selectedPayment.amount || 0) * 0.085)}
                </span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '1rem',
                borderTop: `2px solid ${colors.primary}`
              }}>
                <span style={{ color: colors.text, fontSize: '1.3rem', fontWeight: '800' }}>Total:</span>
                <span style={{ 
                  color: colors.primary, 
                  fontSize: '1.5rem', 
                  fontWeight: '800',
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  {formatCurrency((selectedPayment.amount || 0) * 1.085)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => setShowInvoiceModal(false)}
                style={{
                  backgroundColor: 'transparent',
                  color: colors.textSecondary,
                  padding: '0.8rem 1.6rem',
                  border: `2px solid ${colors.textSecondary}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.textSecondary;
                  e.currentTarget.style.color = colors.background;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = colors.textSecondary;
                }}
              >
                Cancel
              </button>
              <button
                onClick={handlePrintInvoice}
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                  color: colors.background,
                  padding: '0.8rem 1.6rem',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease',
                  boxShadow: `0 2px 6px ${ORANGE_RGBA(0.3)}`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = `0 4px 12px ${ORANGE_RGBA(0.4)}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 2px 6px ${ORANGE_RGBA(0.3)}`;
                }}
              >
                🖨️ Print Invoice
              </button>
              <button
                onClick={handleDownloadPDF}
                style={{
                  background: `linear-gradient(135deg, ${colors.success}, #059669)`,
                  color: colors.background,
                  padding: '0.8rem 1.6rem',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 6px rgba(16, 185, 129, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 6px rgba(16, 185, 129, 0.3)';
                }}
              >
                📥 Download PDF
              </button>
              <button
                onClick={handleSendInvoice}
                style={{
                  background: `linear-gradient(135deg, ${colors.info}, #1D4ED8)`,
                  color: colors.background,
                  padding: '0.8rem 1.6rem',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 6px rgba(59, 130, 246, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 6px rgba(59, 130, 246, 0.3)';
                }}
              >
                ✉️ Send to Customer
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media print {
          body * {
            visibility: hidden;
          }
          .invoice-modal, .invoice-modal * {
            visibility: visible;
          }
          .invoice-modal {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminReports;
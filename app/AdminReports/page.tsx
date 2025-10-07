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
}

interface ReportData {
  totalRevenue: number;
  completedServices: number;
  pendingServices: number;
  averageServiceValue: number;
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
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [selectedReport, setSelectedReport] = useState<'financial' | 'service' | 'customer'>('financial');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Color scheme - Professional White and Orange
  const colors = {
    primary: '#FF6B35',
    primaryLight: '#FF8C42',
    primaryDark: '#E55A2B',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    surfaceLight: '#F1F5F9',
    surfaceDark: '#E2E8F0',
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

      // Add mock financial data for demonstration
      const appointmentsWithFinancials = (appointmentsData || []).map(appointment => ({
        ...appointment,
        amount: calculateServiceAmount(appointment.service_type),
        payment_status: appointment.status === 'completed' ? 'paid' : 'pending',
        invoice_number: `INV-${appointment.id.slice(0, 8).toUpperCase()}`
      }));

      setAppointments(appointmentsWithFinancials);
      generateReportData(appointmentsWithFinancials);
      
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
      'full service': 299.99
    };
    
    return prices[serviceType.toLowerCase()] || 99.99;
  };

  const generateReportData = (appointmentsData: Appointment[]) => {
    const completedAppointments = appointmentsData.filter(a => a.status === 'completed');
    const totalRevenue = completedAppointments.reduce((sum, appt) => sum + (appt.amount || 0), 0);
    
    // Monthly revenue data (last 6 months)
    const monthlyRevenue = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      const monthAppointments = completedAppointments.filter(appt => {
        const apptDate = new Date(appt.preferred_date);
        return apptDate.getMonth() === date.getMonth() && apptDate.getFullYear() === date.getFullYear();
      });
      
      const revenue = monthAppointments.reduce((sum, appt) => sum + (appt.amount || 0), 0);
      
      return { month, revenue };
    }).reverse();

    // Popular services
    const serviceCounts: { [key: string]: { count: number; revenue: number } } = {};
    completedAppointments.forEach(appt => {
      const service = appt.service_type;
      if (!serviceCounts[service]) {
        serviceCounts[service] = { count: 0, revenue: 0 };
      }
      serviceCounts[service].count++;
      serviceCounts[service].revenue += appt.amount || 0;
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
    const customerEmails = new Set(completedAppointments.map(a => a.email));
    const newCustomers = appointmentsData.filter(a => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return new Date(a.created_at) >= thirtyDaysAgo;
    }).length;

    const data: ReportData = {
      totalRevenue,
      completedServices: completedAppointments.length,
      pendingServices: appointmentsData.filter(a => a.status === 'pending').length,
      averageServiceValue: completedAppointments.length > 0 ? totalRevenue / completedAppointments.length : 0,
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
      generateReportData(appointments);
      setGeneratingReport(false);
    }, 1500);
  };

  const handleBackToDashboard = () => {
    router.push('/AdminHome');
  };

  const handleCreateInvoice = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowInvoiceModal(true);
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    alert('PDF download functionality would be implemented here with a PDF generation library');
  };

  const handleSendInvoice = () => {
    alert(`Invoice would be sent to ${selectedAppointment?.email}`);
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
          <p style={{ color: colors.primary, fontSize: '1.1rem' }}>Loading Reports...</p>
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
        borderBottom: `1px solid ${colors.surfaceDark}`,
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h1 style={{ 
            fontSize: '1.8rem', 
            fontWeight: '800',
            color: colors.primary,
            margin: 0,
            cursor: 'pointer'
          }} onClick={handleBackToDashboard}>
            SUNNY AUTO
          </h1>
          <div style={{ 
            color: colors.textSecondary, 
            fontSize: '0.9rem',
            fontWeight: '500',
            padding: '0.25rem 0.75rem',
            backgroundColor: colors.surfaceLight,
            borderRadius: '20px'
          }}>
            REPORTS & ANALYTICS
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
              borderRadius: '12px',
              cursor: generatingReport ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              if (!generatingReport) {
                e.currentTarget.style.backgroundColor = colors.primaryDark;
              }
            }}
            onMouseLeave={(e) => {
              if (!generatingReport) {
                e.currentTarget.style.backgroundColor = colors.primary;
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/>
                  <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2"/>
                  <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2"/>
                  <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2"/>
                  <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Generate Report
              </>
            )}
          </button>
          
          <button 
            onClick={handleBackToDashboard}
            style={{
              backgroundColor: 'transparent',
              color: colors.primary,
              padding: '0.75rem 1.5rem',
              border: `1px solid ${colors.primary}`,
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.primary;
              e.currentTarget.style.color = colors.background;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = colors.primary;
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
                color: colors.text,
                margin: '0 0 0.5rem 0'
              }}>
                Business Reports & Analytics
              </h2>
              <p style={{ 
                color: colors.textSecondary,
                margin: 0,
                fontSize: '1rem'
              }}>
                Generate financial reports, service analytics, and customer insights
              </p>
            </div>
            
            {/* Date Range Selector */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.8rem', 
                  color: colors.textSecondary,
                  marginBottom: '0.25rem',
                  fontWeight: '600'
                }}>
                  From Date
                </label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '8px',
                    border: `1px solid ${colors.surfaceDark}`,
                    backgroundColor: colors.background,
                    color: colors.text
                  }}
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.8rem', 
                  color: colors.textSecondary,
                  marginBottom: '0.25rem',
                  fontWeight: '600'
                }}>
                  To Date
                </label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '8px',
                    border: `1px solid ${colors.surfaceDark}`,
                    backgroundColor: colors.background,
                    color: colors.text
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
            backgroundColor: colors.surface,
            padding: '0.5rem',
            borderRadius: '12px',
            border: `1px solid ${colors.surfaceDark}`,
            width: 'fit-content'
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
                  color: selectedReport === tab.key ? colors.background : colors.textSecondary,
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>{tab.icon}</span>
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
                backgroundColor: colors.surface,
                padding: '2rem',
                borderRadius: '16px',
                border: `1px solid ${colors.surfaceDark}`
              }}>
                <h3 style={{ 
                  color: colors.text,
                  margin: '0 0 1.5rem 0',
                  fontSize: '1.3rem',
                  fontWeight: '700'
                }}>
                  Financial Overview
                </h3>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '1.5rem',
                  marginBottom: '2rem'
                }}>
                  <div style={{
                    backgroundColor: colors.background,
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: `1px solid ${colors.surfaceDark}`,
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: colors.primary }}>
                      {formatCurrency(reportData.totalRevenue)}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: colors.textSecondary, fontWeight: '600' }}>
                      Total Revenue
                    </div>
                  </div>
                  
                  <div style={{
                    backgroundColor: colors.background,
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: `1px solid ${colors.surfaceDark}`,
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: colors.success }}>
                      {reportData.completedServices}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: colors.textSecondary, fontWeight: '600' }}>
                      Completed Services
                    </div>
                  </div>
                  
                  <div style={{
                    backgroundColor: colors.background,
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: `1px solid ${colors.surfaceDark}`,
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: colors.info }}>
                      {formatCurrency(reportData.averageServiceValue)}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: colors.textSecondary, fontWeight: '600' }}>
                      Average Service Value
                    </div>
                  </div>
                  
                  <div style={{
                    backgroundColor: colors.background,
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: `1px solid ${colors.surfaceDark}`,
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: colors.warning }}>
                      {reportData.pendingServices}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: colors.textSecondary, fontWeight: '600' }}>
                      Pending Services
                    </div>
                  </div>
                </div>

                {/* Revenue Chart */}
                <div>
                  <h4 style={{ 
                    color: colors.text,
                    margin: '0 0 1rem 0',
                    fontSize: '1.1rem',
                    fontWeight: '600'
                  }}>
                    Monthly Revenue Trend
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'end', gap: '1rem', height: '200px' }}>
                    {reportData.monthlyRevenue.map((month, index) => (
                      <div key={month.month} style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ 
                          height: `${(month.revenue / Math.max(...reportData.monthlyRevenue.map(m => m.revenue))) * 150}px`,
                          backgroundColor: colors.primary,
                          borderRadius: '4px',
                          marginBottom: '0.5rem'
                        }} />
                        <div style={{ fontSize: '0.8rem', color: colors.textSecondary }}>
                          {month.month}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: colors.text, fontWeight: '600' }}>
                          {formatCurrency(month.revenue)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Popular Services */}
              <div style={{
                backgroundColor: colors.surface,
                padding: '2rem',
                borderRadius: '16px',
                border: `1px solid ${colors.surfaceDark}`
              }}>
                <h3 style={{ 
                  color: colors.text,
                  margin: '0 0 1.5rem 0',
                  fontSize: '1.3rem',
                  fontWeight: '700'
                }}>
                  Top Services
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {reportData.popularServices.map((service, index) => (
                    <div key={service.service} style={{
                      backgroundColor: colors.background,
                      padding: '1rem',
                      borderRadius: '8px',
                      border: `1px solid ${colors.surfaceDark}`
                    }}>
                      <div style={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.5rem'
                      }}>
                        <span style={{ fontWeight: '600', color: colors.text }}>
                          {service.service}
                        </span>
                        <span style={{ 
                          backgroundColor: colors.primary,
                          color: colors.background,
                          padding: '0.2rem 0.5rem',
                          borderRadius: '12px',
                          fontSize: '0.7rem',
                          fontWeight: '600'
                        }}>
                          {service.count} services
                        </span>
                      </div>
                      <div style={{ fontSize: '0.9rem', color: colors.textSecondary }}>
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
              backgroundColor: colors.surface,
              padding: '2rem',
              borderRadius: '16px',
              border: `1px solid ${colors.surfaceDark}`,
              marginBottom: '2rem'
            }}>
              <h3 style={{ 
                color: colors.text,
                margin: '0 0 1.5rem 0',
                fontSize: '1.3rem',
                fontWeight: '700'
              }}>
                Service Performance Analytics
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem'
              }}>
                <div style={{
                  backgroundColor: colors.background,
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: `1px solid ${colors.surfaceDark}`
                }}>
                  <h4 style={{ color: colors.text, margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '600' }}>
                    Service Completion Rate
                  </h4>
                  <div style={{ fontSize: '2rem', fontWeight: '800', color: colors.success }}>
                    {((reportData.completedServices / appointments.length) * 100).toFixed(1)}%
                  </div>
                  <div style={{ fontSize: '0.9rem', color: colors.textSecondary }}>
                    {reportData.completedServices} of {appointments.length} services completed
                  </div>
                </div>
                
                <div style={{
                  backgroundColor: colors.background,
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: `1px solid ${colors.surfaceDark}`
                }}>
                  <h4 style={{ color: colors.text, margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '600' }}>
                    Revenue per Service
                  </h4>
                  <div style={{ fontSize: '2rem', fontWeight: '800', color: colors.primary }}>
                    {formatCurrency(reportData.averageServiceValue)}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: colors.textSecondary }}>
                    Average revenue per completed service
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Customer Insights */}
          {selectedReport === 'customer' && reportData && (
            <div style={{
              backgroundColor: colors.surface,
              padding: '2rem',
              borderRadius: '16px',
              border: `1px solid ${colors.surfaceDark}`,
              marginBottom: '2rem'
            }}>
              <h3 style={{ 
                color: colors.text,
                margin: '0 0 1.5rem 0',
                fontSize: '1.3rem',
                fontWeight: '700'
              }}>
                Customer Insights
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem'
              }}>
                <div style={{
                  backgroundColor: colors.background,
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: `1px solid ${colors.surfaceDark}`,
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: '800', color: colors.primary }}>
                    {reportData.customerStats.totalCustomers}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: colors.textSecondary, fontWeight: '600' }}>
                    Total Customers
                  </div>
                </div>
                
                <div style={{
                  backgroundColor: colors.background,
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: `1px solid ${colors.surfaceDark}`,
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: '800', color: colors.success }}>
                    {reportData.customerStats.newCustomers}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: colors.textSecondary, fontWeight: '600' }}>
                    New Customers (30 days)
                  </div>
                </div>
                
                <div style={{
                  backgroundColor: colors.background,
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: `1px solid ${colors.surfaceDark}`,
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: '800', color: colors.info }}>
                    {reportData.customerStats.returningCustomers}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: colors.textSecondary, fontWeight: '600' }}>
                    Returning Customers
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Billing and Invoices Section */}
          <div style={{
            backgroundColor: colors.surface,
            padding: '2rem',
            borderRadius: '16px',
            border: `1px solid ${colors.surfaceDark}`
          }}>
            <h3 style={{ 
              color: colors.text,
              margin: '0 0 1.5rem 0',
              fontSize: '1.3rem',
              fontWeight: '700'
            }}>
              Billing & Invoices
            </h3>
            
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${colors.surfaceDark}` }}>
                    <th style={{ padding: '1rem', textAlign: 'left', color: colors.text, fontWeight: '600' }}>Invoice #</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: colors.text, fontWeight: '600' }}>Customer</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: colors.text, fontWeight: '600' }}>Service</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: colors.text, fontWeight: '600' }}>Date</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: colors.text, fontWeight: '600' }}>Amount</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: colors.text, fontWeight: '600' }}>Status</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: colors.text, fontWeight: '600' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.filter(a => a.status === 'completed').map(appointment => (
                    <tr key={appointment.id} style={{ borderBottom: `1px solid ${colors.surfaceDark}` }}>
                      <td style={{ padding: '1rem', color: colors.text }}>{appointment.invoice_number}</td>
                      <td style={{ padding: '1rem', color: colors.text }}>{appointment.name}</td>
                      <td style={{ padding: '1rem', color: colors.text }}>{appointment.service_type}</td>
                      <td style={{ padding: '1rem', color: colors.text }}>{formatDate(appointment.preferred_date)}</td>
                      <td style={{ padding: '1rem', color: colors.text, fontWeight: '600' }}>
                        {formatCurrency(appointment.amount || 0)}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          backgroundColor: appointment.payment_status === 'paid' ? '#D1FAE5' : '#FEF3C7',
                          color: appointment.payment_status === 'paid' ? '#065F46' : '#92400E',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          {appointment.payment_status?.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <button
                          onClick={() => handleCreateInvoice(appointment)}
                          style={{
                            backgroundColor: colors.primary,
                            color: colors.background,
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            transition: 'background-color 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = colors.primaryDark;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = colors.primary;
                          }}
                        >
                          Generate Invoice
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
      {showInvoiceModal && selectedAppointment && (
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
            {/* Invoice Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '2rem',
              paddingBottom: '1rem',
              borderBottom: `2px solid ${colors.primary}`
            }}>
              <div>
                <h2 style={{ color: colors.primary, margin: '0 0 0.5rem 0', fontSize: '1.8rem', fontWeight: '800' }}>
                  SUNNY AUTO
                </h2>
                <p style={{ color: colors.textSecondary, margin: 0 }}>
                  123 Automotive Drive<br />
                  Service City, SC 12345<br />
                  (555) 123-4567<br />
                  billing@sunnyauto.com
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h3 style={{ color: colors.text, margin: '0 0 1rem 0', fontSize: '1.5rem', fontWeight: '700' }}>
                  INVOICE
                </h3>
                <p style={{ color: colors.textSecondary, margin: '0 0 0.25rem 0' }}>
                  <strong>Invoice #:</strong> {selectedAppointment.invoice_number}
                </p>
                <p style={{ color: colors.textSecondary, margin: '0 0 0.25rem 0' }}>
                  <strong>Date:</strong> {formatDate(new Date().toISOString())}
                </p>
                <p style={{ color: colors.textSecondary, margin: 0 }}>
                  <strong>Due Date:</strong> {formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString())}
                </p>
              </div>
            </div>

            {/* Bill To */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ color: colors.text, margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '600' }}>
                Bill To:
              </h4>
              <div style={{ backgroundColor: colors.surface, padding: '1rem', borderRadius: '8px' }}>
                <p style={{ color: colors.text, margin: '0 0 0.5rem 0', fontWeight: '600' }}>
                  {selectedAppointment.name}
                </p>
                <p style={{ color: colors.textSecondary, margin: '0 0 0.25rem 0' }}>
                  {selectedAppointment.email}
                </p>
                <p style={{ color: colors.textSecondary, margin: 0 }}>
                  {selectedAppointment.phone}
                </p>
              </div>
            </div>

            {/* Service Details */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ color: colors.text, margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '600' }}>
                Service Details:
              </h4>
              <div style={{
                backgroundColor: colors.surface,
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <p style={{ color: colors.text, margin: '0 0 0.5rem 0' }}>
                  <strong>Service Type:</strong> {selectedAppointment.service_type}
                </p>
                <p style={{ color: colors.text, margin: '0 0 0.5rem 0' }}>
                  <strong>Vehicle:</strong> {selectedAppointment.vehicle_type}
                </p>
                <p style={{ color: colors.text, margin: '0 0 0.5rem 0' }}>
                  <strong>Service Date:</strong> {formatDate(selectedAppointment.preferred_date)}
                </p>
                <p style={{ color: colors.text, margin: 0 }}>
                  <strong>Service Time:</strong> {selectedAppointment.preferred_time}
                </p>
              </div>
            </div>

            {/* Payment Summary */}
            <div style={{
              backgroundColor: colors.surface,
              padding: '1.5rem',
              borderRadius: '8px',
              marginBottom: '2rem'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <span style={{ color: colors.text, fontWeight: '600' }}>Subtotal:</span>
                <span style={{ color: colors.text, fontWeight: '600' }}>
                  {formatCurrency(selectedAppointment.amount || 0)}
                </span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <span style={{ color: colors.text }}>Tax (8.5%):</span>
                <span style={{ color: colors.text }}>
                  {formatCurrency((selectedAppointment.amount || 0) * 0.085)}
                </span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '1rem',
                borderTop: `2px solid ${colors.surfaceDark}`
              }}>
                <span style={{ color: colors.text, fontSize: '1.2rem', fontWeight: '700' }}>Total:</span>
                <span style={{ color: colors.primary, fontSize: '1.2rem', fontWeight: '800' }}>
                  {formatCurrency((selectedAppointment.amount || 0) * 1.085)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setShowInvoiceModal(false)}
                style={{
                  backgroundColor: 'transparent',
                  color: colors.textSecondary,
                  padding: '0.75rem 1.5rem',
                  border: `1px solid ${colors.textSecondary}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handlePrintInvoice}
                style={{
                  backgroundColor: colors.primary,
                  color: colors.background,
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}
              >
                Print Invoice
              </button>
              <button
                onClick={handleDownloadPDF}
                style={{
                  backgroundColor: colors.success,
                  color: colors.background,
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}
              >
                Download PDF
              </button>
              <button
                onClick={handleSendInvoice}
                style={{
                  backgroundColor: colors.info,
                  color: colors.background,
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}
              >
                Send to Customer
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
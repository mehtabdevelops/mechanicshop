"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface Appointment {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  phone: string;
  vehicle_type: string;
  service_type: string;
  preferred_date: string;
  preferred_time: string;
  message: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
  images?: string[];
}

const AdminAppointments = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [editFormData, setEditFormData] = useState<Appointment | null>(null);

  // Color scheme - Red accent (#dc2626) with dark theme
  const colors = {
    primary: '#dc2626',
    primaryLight: '#ef4444',
    primaryDark: '#b91c1c',
    background: '#0a0a0a',
    surface: 'rgba(255, 255, 255, 0.05)',
    surfaceLight: 'rgba(255, 255, 255, 0.08)',
    surfaceDark: 'rgba(255, 255, 255, 0.02)',
    text: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    textMuted: 'rgba(255, 255, 255, 0.5)',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    border: 'rgba(255, 255, 255, 0.1)',
    borderLight: 'rgba(255, 255, 255, 0.2)'
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      console.log('Fetching appointments from Supabase...');
      
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Fetched appointments:', data);
      setAppointments(data || []);
      
    } catch (error: any) {
      console.error('Error fetching appointments:', error);
      
      // Show detailed error information
      if (error.code === 'PGRST301') {
        alert('Error: No appointments table found. Please make sure the table exists in your Supabase database.');
      } else if (error.code === '42501') {
        alert('Error: Permission denied. Please check RLS policies for the appointments table.');
      } else {
        alert(`Error loading appointments: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    router.push('/AdminHome');
  };

  const handleProfile = () => {
    router.push('/Adminprofile');
  };

  // Filter appointments by selected date
  const filteredAppointments = appointments.filter(app => app.preferred_date === selectedDate);
  
  // Sort appointments by time
  const sortedAppointments = filteredAppointments.sort((a, b) => {
    return a.preferred_time.localeCompare(b.preferred_time);
  });

  // Count appointments by status
  const statusCounts = {
    pending: filteredAppointments.filter(a => a.status === 'pending').length,
    confirmed: filteredAppointments.filter(a => a.status === 'confirmed').length,
    completed: filteredAppointments.filter(a => a.status === 'completed').length,
    cancelled: filteredAppointments.filter(a => a.status === 'cancelled').length
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return colors.warning;
      case 'confirmed': return colors.info;
      case 'completed': return colors.success;
      case 'cancelled': return colors.error;
      default: return colors.textMuted;
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleOpenImageSelector = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowImageModal(true);
  };

  const handleCloseImageModal = () => {
    setShowImageModal(false);
    setSelectedAppointment(null);
  };

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && selectedAppointment) {
      // In a real app, you would upload to Supabase Storage
      // For now, we'll simulate with base64
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          setAppointments(prev => prev.map(app => 
            app.id === selectedAppointment.id 
              ? { ...app, images: [...(app.images || []), imageUrl] }
              : app
          ));
        };
        reader.readAsDataURL(file);
      });
      
      alert(`${files.length} image(s) added to appointment record!`);
      handleCloseImageModal();
    }
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditFormData({...appointment});
    setShowEditModal(true);
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        const { error } = await supabase
          .from('appointments')
          .delete()
          .eq('id', appointmentId);

        if (error) throw error;
        
        setAppointments(prev => prev.filter(app => app.id !== appointmentId));
        alert('Appointment deleted successfully!');
      } catch (error) {
        console.error('Error deleting appointment:', error);
        alert('Error deleting appointment');
      }
    }
  };

  const handleSaveEdit = async () => {
    if (editFormData) {
      try {
        const { error } = await supabase
          .from('appointments')
          .update({
            name: editFormData.name,
            email: editFormData.email,
            phone: editFormData.phone,
            vehicle_type: editFormData.vehicle_type,
            service_type: editFormData.service_type,
            preferred_date: editFormData.preferred_date,
            preferred_time: editFormData.preferred_time,
            message: editFormData.message,
            status: editFormData.status
          })
          .eq('id', editFormData.id);

        if (error) throw error;

        setAppointments(prev => prev.map(app => 
          app.id === editFormData.id ? editFormData : app
        ));
        setShowEditModal(false);
        setEditFormData(null);
        alert('Appointment updated successfully!');
      } catch (error) {
        console.error('Error updating appointment:', error);
        alert('Error updating appointment');
      }
    }
  };

  // Refresh appointments data
  const handleRefresh = () => {
    setLoading(true);
    fetchAppointments();
  };

  if (loading) {
    return (
      <div style={{ 
        background: colors.background,
        minHeight: '100vh', 
        color: colors.text,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: `4px solid ${colors.border}`,
            borderTop: `4px solid ${colors.primary}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p style={{ color: colors.primary, fontSize: '1.2rem', fontWeight: '600' }}>Loading Appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      background: colors.background,
      minHeight: '100vh', 
      color: colors.text,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        borderBottom: `1px solid ${colors.border}`,
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(10px)'
      }}>
        <h1 style={{ 
          fontSize: '1.8rem', 
          fontWeight: '700',
          color: colors.primary,
          margin: 0,
          cursor: 'pointer'
        }} onClick={handleBackToDashboard}>
          <span style={{ color: colors.primary }}>Sunny</span>
          <span style={{ color: colors.text }}>Auto</span>
          <span style={{ 
            color: colors.primary, 
            fontSize: '0.9rem',
            marginLeft: '0.5rem',
            fontWeight: '400'
          }}>ADMIN</span>
        </h1>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button 
            onClick={handleRefresh}
            style={{
              backgroundColor: colors.primary,
              color: 'white',
              border: 'none',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.primaryDark;
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.primary;
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            title="Refresh Appointments"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M23 4v6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M1 20v-6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Refresh
          </button>
          
          <button 
            onClick={handleProfile}
            style={{
              backgroundColor: colors.primary,
              color: 'white',
              width: '45px',
              height: '45px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              boxShadow: `0 4px 15px rgba(220, 38, 38, 0.4)`
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.primaryDark;
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.primary;
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            title="Admin Profile"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ 
        padding: '2rem',
        minHeight: 'calc(100vh - 100px)'
      }}>
        <div style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          padding: '2.5rem',
          borderRadius: '12px',
          maxWidth: '1400px',
          margin: '0 auto',
          border: `1px solid ${colors.border}`,
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <h2 style={{ 
              fontSize: '2rem', 
              fontWeight: '700',
              color: colors.primary,
              margin: 0
            }}>
              Appointment Management
            </h2>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: colors.primary, fontWeight: '600', fontSize: '1rem' }}>Total Appointments:</span>
                <span style={{ 
                  backgroundColor: colors.primary, 
                  color: 'white', 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '20px',
                  fontWeight: '700',
                  fontSize: '0.9rem'
                }}>
                  {appointments.length}
                </span>
              </div>
              
              <label style={{ color: colors.primary, fontWeight: '600', fontSize: '1rem' }}>Filter by Date:</label>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                  color: colors.text, 
                  border: `1px solid ${colors.border}`, 
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.primary;
                  e.target.style.boxShadow = `0 0 0 3px rgba(220, 38, 38, 0.2)`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.border;
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>
          
          {/* Debug Information */}
          {appointments.length === 0 && (
            <div style={{
              backgroundColor: 'rgba(245, 158, 11, 0.2)',
              border: `1px solid ${colors.warning}`,
              borderRadius: '8px',
              padding: '1.5rem',
              marginBottom: '2rem',
              textAlign: 'center'
            }}>
              <h3 style={{ color: colors.warning, marginTop: 0 }}>No Appointments Found</h3>
              <p style={{ color: colors.text, marginBottom: '1rem' }}>
                There are no appointments in the database. This could be because:
              </p>
              <ul style={{ textAlign: 'left', color: colors.text, marginBottom: '1rem' }}>
                <li>No users have booked appointments yet</li>
                <li>The appointments table doesn't exist in Supabase</li>
                <li>RLS policies are preventing access to the data</li>
                <li>There's a connection issue with Supabase</li>
              </ul>
              <button 
                onClick={handleRefresh}
                style={{
                  backgroundColor: colors.primary,
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Check Again
              </button>
            </div>
          )}
          
          {/* Appointment Summary */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
            backgroundColor: colors.surface,
            padding: '2rem',
            borderRadius: '12px',
            border: `1px solid ${colors.border}`,
            marginBottom: '2rem',
            backdropFilter: 'blur(10px)'
          }}>
            {[
              { label: 'Total Appointments', count: filteredAppointments.length, color: colors.primary, icon: 'calendar' },
              { label: 'Pending', count: statusCounts.pending, color: colors.warning, icon: 'clock' },
              { label: 'Confirmed', count: statusCounts.confirmed, color: colors.info, icon: 'check-circle' },
              { label: 'Completed', count: statusCounts.completed, color: colors.success, icon: 'check' },
              { label: 'Cancelled', count: statusCounts.cancelled, color: colors.error, icon: 'x' }
            ].map((stat, index) => (
              <div key={index} style={{ 
                textAlign: 'center', 
                padding: '1.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                border: `1px solid ${stat.color}`,
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = `0 10px 30px rgba(0, 0, 0, 0.3)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <div style={{ marginBottom: '0.5rem' }}>
                  {stat.icon === 'calendar' && (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke={stat.color} strokeWidth="2"/>
                      <line x1="16" y1="2" x2="16" y2="6" stroke={stat.color} strokeWidth="2"/>
                      <line x1="8" y1="2" x2="8" y2="6" stroke={stat.color} strokeWidth="2"/>
                      <line x1="3" y1="10" x2="21" y2="10" stroke={stat.color} strokeWidth="2"/>
                    </svg>
                  )}
                  {stat.icon === 'clock' && (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke={stat.color} strokeWidth="2"/>
                      <polyline points="12,6 12,12 16,14" stroke={stat.color} strokeWidth="2"/>
                    </svg>
                  )}
                  {stat.icon === 'check-circle' && (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke={stat.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="22,4 12,14.01 9,11.01" stroke={stat.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  {stat.icon === 'check' && (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <polyline points="20,6 9,17 4,12" stroke={stat.color} strokeWidth="2"/>
                    </svg>
                  )}
                  {stat.icon === 'x' && (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <line x1="18" y1="6" x2="6" y2="18" stroke={stat.color} strokeWidth="2"/>
                      <line x1="6" y1="6" x2="18" y2="18" stroke={stat.color} strokeWidth="2"/>
                    </svg>
                  )}
                </div>
                <div style={{ fontSize: '2.5rem', color: stat.color, fontWeight: '800', marginBottom: '0.5rem' }}>
                  {stat.count}
                </div>
                <div style={{ color: colors.text, fontWeight: '600', fontSize: '1rem' }}>{stat.label}</div>
              </div>
            ))}
          </div>
          
          {/* Date Header */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '2rem',
            padding: '1.5rem',
            backgroundColor: colors.surface,
            borderRadius: '8px',
            border: `1px solid ${colors.border}`,
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{ 
              color: colors.primary, 
              margin: 0, 
              fontSize: '1.3rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
              </svg>
              {formatDate(selectedDate)}
              <span style={{ 
                fontSize: '0.9rem', 
                backgroundColor: colors.primary, 
                color: 'white', 
                padding: '0.25rem 0.75rem', 
                borderRadius: '20px',
                marginLeft: '1rem'
              }}>
                {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? 's' : ''}
              </span>
            </h3>
          </div>
          
          {/* Appointments List */}
          <div style={{ marginBottom: '3rem' }}>
            {sortedAppointments.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(550px, 1fr))', gap: '1.5rem' }}>
                {sortedAppointments.map(appointment => (
                  <div 
                    key={appointment.id}
                    style={{
                      backgroundColor: colors.surface,
                      padding: '2rem',
                      borderRadius: '12px',
                      border: `1px solid ${getStatusColor(appointment.status)}`,
                      transition: 'all 0.3s ease',
                      backdropFilter: 'blur(10px)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <div style={{ 
                          padding: '0.6rem 1.2rem', 
                          borderRadius: '8px', 
                          backgroundColor: colors.primary,
                          fontWeight: '700',
                          fontSize: '1rem',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          boxShadow: `0 4px 15px rgba(220, 38, 38, 0.4)`
                        }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                            <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                          {formatTime(appointment.preferred_time)}
                        </div>
                        <div style={{ 
                          padding: '0.6rem 1.2rem', 
                          borderRadius: '8px', 
                          fontWeight: '700',
                          fontSize: '1rem',
                          backgroundColor: getStatusColor(appointment.status),
                          color: 'white',
                          boxShadow: `0 4px 15px ${getStatusColor(appointment.status)}40`
                        }}>
                          {getStatusText(appointment.status)}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => handleOpenImageSelector(appointment)}
                          style={{
                            backgroundColor: colors.primary,
                            color: 'white',
                            border: 'none',
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease',
                            boxShadow: `0 4px 15px rgba(220, 38, 38, 0.4)`
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = colors.primaryDark;
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = colors.primary;
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                          title="Add Vehicle Images"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2"/>
                            <polyline points="21,15 16,10 5,21" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        </button>
                        
                        <button 
                          onClick={() => handleEditAppointment(appointment)}
                          style={{
                            backgroundColor: colors.warning,
                            color: 'white',
                            border: 'none',
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease',
                            boxShadow: `0 4px 15px rgba(245, 158, 11, 0.4)`
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#d97706';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = colors.warning;
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                          title="Edit Appointment"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="m18 2 4 4-14 14H4v-4L18 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        
                        <button 
                          onClick={() => handleDeleteAppointment(appointment.id)}
                          style={{
                            backgroundColor: colors.error,
                            color: 'white',
                            border: 'none',
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease',
                            boxShadow: `0 4px 15px rgba(239, 68, 68, 0.4)`
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#dc2626';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = colors.error;
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                          title="Delete Appointment"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="2"/>
                            <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h3 style={{ 
                        color: colors.primary, 
                        marginBottom: '1rem', 
                        fontSize: '1.3rem',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                      }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
                          <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        {appointment.name}
                      </h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <p style={{ margin: 0, color: colors.text, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10h-1.3l-.8-2H12" stroke={colors.primary} strokeWidth="2"/>
                            <circle cx="9" cy="19" r="2" stroke={colors.primary} strokeWidth="2"/>
                            <circle cx="20" cy="19" r="2" stroke={colors.primary} strokeWidth="2"/>
                            <path d="M9 19H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6l2 2h7a2 2 0 0 1 2 2v4.5" stroke={colors.primary} strokeWidth="2"/>
                          </svg>
                          <strong style={{ color: colors.primary }}>Vehicle:</strong> {appointment.vehicle_type}
                        </p>
                        <p style={{ margin: 0, color: colors.text, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke={colors.primary} strokeWidth="2"/>
                            <polyline points="22,6 12,13 2,6" stroke={colors.primary} strokeWidth="2"/>
                          </svg>
                          <strong style={{ color: colors.primary }}>Email:</strong> {appointment.email}
                        </p>
                        <p style={{ margin: 0, color: colors.text, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke={colors.primary} strokeWidth="2"/>
                          </svg>
                          <strong style={{ color: colors.primary }}>Phone:</strong> {appointment.phone}
                        </p>
                        <p style={{ margin: 0, color: colors.text, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke={colors.primary} strokeWidth="2"/>
                            <path d="M12 8V16M8 12h8" stroke={colors.primary} strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                          <strong style={{ color: colors.primary }}>Service:</strong> {appointment.service_type}
                        </p>
                      </div>
                      {appointment.message && (
                        <p style={{ margin: '1rem 0 0', color: colors.text, fontSize: '1rem', fontStyle: 'italic', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontWeight: '500' }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 2H6C5.46957 2 4.96265 2.21071 4.58579 2.58579C4.21071 2.96265 4 3.46957 4 4V20C4 20.5304 4.21071 21.0373 4.58579 21.4142C4.96265 21.7893 5.46957 22 6 22H18C18.5304 22 19.0373 21.7893 19.4142 21.4142C19.7893 21.0373 20 20.5304 20 20V8L14 2Z" stroke={colors.primary} strokeWidth="2"/>
                            <path d="M14 2V8H20" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <line x1="8" y1="13" x2="16" y2="13" stroke={colors.primary} strokeWidth="2" strokeLinecap="round"/>
                            <line x1="8" y1="17" x2="16" y2="17" stroke={colors.primary} strokeWidth="2" strokeLinecap="round"/>
                            <line x1="8" y1="9" x2="10" y2="9" stroke={colors.primary} strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                          <strong style={{ color: colors.primary }}>Customer Notes:</strong> {appointment.message}
                        </p>
                      )}
                    </div>
                    
                    {appointment.images && appointment.images.length > 0 && (
                      <div>
                        <h4 style={{ color: colors.primary, fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2"/>
                            <polyline points="21,15 16,10 5,21" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                          Vehicle Images:
                        </h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                          {appointment.images.map((image, i) => (
                            <img 
                              key={i} 
                              src={image} 
                              alt={`Vehicle image ${i + 1}`} 
                              style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: `2px solid ${colors.primary}`, boxShadow: `0 4px 15px rgba(220, 38, 38, 0.4)` }} 
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                color: colors.textMuted, 
                fontSize: '1.1rem', 
                padding: '4rem', 
                border: `2px dashed ${colors.border}`, 
                borderRadius: '12px',
                backgroundColor: colors.surface
              }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto 1rem', opacity: 0.5 }}>
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                  <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                  <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                  <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
                </svg>
                No appointments found for {formatDate(selectedDate)}.
                <br />
                <span style={{ fontSize: '0.9rem', color: colors.textMuted }}>
                  Total appointments in system: {appointments.length}
                </span>
              </div>
            )}
          </div>

          {/* Back to Dashboard Button */}
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button
              onClick={handleBackToDashboard}
              style={{
                backgroundColor: colors.primary,
                color: 'white',
                border: 'none',
                padding: '1.2rem 2.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '1.1rem',
                transition: 'all 0.3s ease',
                boxShadow: `0 6px 20px rgba(220, 38, 38, 0.4)`,
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                margin: '0 auto'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.primaryDark;
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = `0 10px 30px rgba(220, 38, 38, 0.6)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.primary;
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `0 6px 20px rgba(220, 38, 38, 0.4)`;
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        padding: '1.5rem 2rem',
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        borderTop: `1px solid ${colors.border}`,
        textAlign: 'center',
        marginTop: '3rem'
      }}>
        <p style={{ margin: 0, color: colors.textSecondary, fontSize: '0.9rem', fontWeight: '600' }}>
          &copy; 2025 Sunny Auto. All rights reserved.
        </p>
      </footer>

      {/* Image Upload Modal */}
      {showImageModal && selectedAppointment && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 100
        }}>
          <div style={{
            backgroundColor: colors.background,
            padding: '2.5rem',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '500px',
            border: `1px solid ${colors.primary}`,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{ color: colors.primary, marginTop: 0, marginBottom: '1.5rem', fontSize: '1.3rem', fontWeight: '700' }}>
              Upload Images for {selectedAppointment.name}
            </h3>
            <div style={{ marginBottom: '1.5rem' }}>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageSelect}
                multiple 
                style={{
                  display: 'block',
                  width: '100%',
                  color: colors.text,
                  padding: '1rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  border: `1px solid ${colors.border}`,
                  fontSize: '1rem',
                  fontWeight: '500'
                }}
              />
              <p style={{ color: colors.textMuted, fontSize: '0.9rem', marginTop: '0.75rem' }}>
                Select one or more images to upload for vehicle documentation.
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button 
                onClick={handleCloseImageModal}
                style={{
                  backgroundColor: colors.textMuted,
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.textSecondary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.textMuted;
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editFormData && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 100
        }}>
          <div style={{
            backgroundColor: colors.background,
            padding: '2.5rem',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '600px',
            border: `1px solid ${colors.primary}`,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            maxHeight: '90vh',
            overflowY: 'auto',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{ color: colors.primary, marginTop: 0, marginBottom: '1.5rem', fontSize: '1.3rem', fontWeight: '700' }}>
              Edit Appointment
            </h3>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ color: colors.text, marginBottom: '0.5rem', fontWeight: '600' }}>Customer Name *</label>
                  <input 
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                    required
                    style={inputStyle(colors)}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ color: colors.text, marginBottom: '0.5rem', fontWeight: '600' }}>Email *</label>
                  <input 
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                    required
                    style={inputStyle(colors)}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ color: colors.text, marginBottom: '0.5rem', fontWeight: '600' }}>Phone *</label>
                  <input 
                    type="tel"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                    required
                    style={inputStyle(colors)}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ color: colors.text, marginBottom: '0.5rem', fontWeight: '600' }}>Vehicle Type *</label>
                  <input 
                    type="text"
                    value={editFormData.vehicle_type}
                    onChange={(e) => setEditFormData({...editFormData, vehicle_type: e.target.value})}
                    required
                    style={inputStyle(colors)}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ color: colors.text, marginBottom: '0.5rem', fontWeight: '600' }}>Service Type *</label>
                  <input 
                    type="text"
                    value={editFormData.service_type}
                    onChange={(e) => setEditFormData({...editFormData, service_type: e.target.value})}
                    required
                    style={inputStyle(colors)}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ color: colors.text, marginBottom: '0.5rem', fontWeight: '600' }}>Preferred Date *</label>
                  <input 
                    type="date"
                    value={editFormData.preferred_date}
                    onChange={(e) => setEditFormData({...editFormData, preferred_date: e.target.value})}
                    required
                    style={inputStyle(colors)}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ color: colors.text, marginBottom: '0.5rem', fontWeight: '600' }}>Preferred Time *</label>
                  <input 
                    type="time"
                    value={editFormData.preferred_time}
                    onChange={(e) => setEditFormData({...editFormData, preferred_time: e.target.value})}
                    required
                    style={inputStyle(colors)}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ color: colors.text, marginBottom: '0.5rem', fontWeight: '600' }}>Status</label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({...editFormData, status: e.target.value as any})}
                    style={inputStyle(colors)}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '1.5rem' }}>
                <label style={{ color: colors.text, marginBottom: '0.5rem', fontWeight: '600' }}>Customer Message</label>
                <textarea
                  value={editFormData.message}
                  onChange={(e) => setEditFormData({...editFormData, message: e.target.value})}
                  rows={4}
                  style={{ ...inputStyle(colors), resize: 'vertical' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button 
                  type="button"
                  onClick={() => { setShowEditModal(false); setEditFormData(null); }}
                  style={{
                    backgroundColor: colors.textMuted,
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.textSecondary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.textMuted;
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{
                    backgroundColor: colors.primary,
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primaryDark;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primary;
                  }}
                >
                  Save Changes
                </button>
              </div>
            </form>
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

const inputStyle = (colors: any) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  color: colors.text,
  border: `1px solid ${colors.border}`,
  borderRadius: '8px',
  padding: '0.75rem 1rem',
  fontSize: '1rem',
  fontWeight: '500',
  transition: 'all 0.3s ease'
});

export default AdminAppointments;
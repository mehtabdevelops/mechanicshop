"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface Appointment {
  id: number;
  customerName: string;
  vehicle: string;
  service: string;
  date: string;
  time: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  phone: string;
  estimatedDuration: string;
  notes?: string;
  images?: string[];
}

const AdminAppointments = () => {
  const router = useRouter(); // Initialize the router
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [editFormData, setEditFormData] = useState<Appointment | null>(null);
  
  // Sample appointment data
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 1,
      customerName: "John Smith",
      vehicle: "Toyota Camry 2019",
      service: "Oil Change",
      date: new Date().toISOString().split('T')[0],
      time: "09:00",
      status: "Scheduled",
      phone: "+1 (555) 123-4567",
      estimatedDuration: "45 mins",
      notes: "Synthetic oil preferred",
      images: []
    },
    {
      id: 2,
      customerName: "Maria Garcia",
      vehicle: "Honda Civic 2021",
      service: "Brake Service",
      date: new Date().toISOString().split('T')[0],
      time: "10:30",
      status: "In Progress",
      phone: "+1 (555) 987-6543",
      estimatedDuration: "2 hours",
      notes: "Front brakes only",
      images: []
    },
    {
      id: 3,
      customerName: "Robert Johnson",
      vehicle: "Ford F-150 2020",
      service: "Tire Rotation",
      date: new Date().toISOString().split('T')[0],
      time: "11:15",
      status: "Scheduled",
      phone: "+1 (555) 456-7890",
      estimatedDuration: "30 mins",
      images: []
    },
    {
      id: 4,
      customerName: "Sarah Williams",
      vehicle: "Chevrolet Malibu 2018",
      service: "Full Service",
      date: new Date().toISOString().split('T')[0],
      time: "13:00",
      status: "Scheduled",
      phone: "+1 (555) 234-5678",
      estimatedDuration: "3 hours",
      notes: "Includes oil change, filter replacement, and inspection",
      images: []
    },
    {
      id: 5,
      customerName: "James Brown",
      vehicle: "Nissan Altima 2022",
      service: "AC Repair",
      date: new Date().toISOString().split('T')[0],
      time: "14:45",
      status: "Completed",
      phone: "+1 (555) 876-5432",
      estimatedDuration: "1.5 hours",
      images: []
    },
    {
      id: 6,
      customerName: "Lisa Davis",
      vehicle: "BMW X5 2020",
      service: "Electrical Diagnostics",
      date: new Date().toISOString().split('T')[0],
      time: "16:00",
      status: "Cancelled",
      phone: "+1 (555) 345-6789",
      estimatedDuration: "2 hours",
      notes: "Customer will reschedule",
      images: []
    }
  ]);

  const handleBackToDashboard = () => {
    router.push('/AdminHome'); // Navigate to the root URL
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      alert('Logging out...');
      // In a real app, this would navigate to /
    }
  };

  const handleProfile = () => {
    alert('Opening Admin Profile...');
    // In a real app, this would navigate to /Adminprofile
  };

  // Filter appointments by selected date
  const filteredAppointments = appointments.filter(app => app.date === selectedDate);
  
  // Sort appointments by time
  const sortedAppointments = filteredAppointments.sort((a, b) => {
    return a.time.localeCompare(b.time);
  });

  // Count appointments by status
  const statusCounts = {
    Scheduled: filteredAppointments.filter(a => a.status === 'Scheduled').length,
    'In Progress': filteredAppointments.filter(a => a.status === 'In Progress').length,
    Completed: filteredAppointments.filter(a => a.status === 'Completed').length,
    Cancelled: filteredAppointments.filter(a => a.status === 'Cancelled').length
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Scheduled': return '#3b82f6';
      case 'In Progress': return '#f59e0b';
      case 'Completed': return '#10b981';
      case 'Cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleOpenImageSelector = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowImageModal(true);
  };

  const handleCloseImageModal = () => {
    setShowImageModal(false);
    setSelectedAppointment(null);
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && selectedAppointment) {
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

  const handleDeleteAppointment = (appointmentId: number) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      setAppointments(prev => prev.filter(app => app.id !== appointmentId));
    }
  };

  const handleSaveEdit = () => {
    if (editFormData) {
      setAppointments(prev => prev.map(app => 
        app.id === editFormData.id ? editFormData : app
      ));
      setShowEditModal(false);
      setEditFormData(null);
    }
  };

  const handleAddAppointment = () => {
    const newAppointment: Appointment = {
      id: Math.max(...appointments.map(a => a.id)) + 1,
      customerName: "",
      vehicle: "",
      service: "",
      date: selectedDate,
      time: "09:00",
      status: "Scheduled",
      phone: "",
      estimatedDuration: "1 hour",
      notes: "",
      images: []
    };
    setEditFormData(newAppointment);
    setShowAddModal(true);
  };

  const handleSaveAdd = () => {
    if (editFormData && editFormData.customerName && editFormData.vehicle && editFormData.service) {
      setAppointments(prev => [...prev, editFormData]);
      setShowAddModal(false);
      setEditFormData(null);
    } else {
      alert('Please fill in all required fields');
    }
  };

  return (
    <div style={{ 
      background: '#0f172a',
      minHeight: '100vh', 
      color: 'white',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1e293b',
        borderBottom: '1px solid #334155',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '700',
          color: '#f97316',
          margin: 0
        }}>
          SUNNY AUTO ADMIN
        </h1>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button 
            onClick={handleProfile}
            style={{
              backgroundColor: '#f97316',
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
              transition: 'background-color 0.2s ease',
              boxShadow: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#ea580c';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f97316';
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
          backgroundColor: '#1e293b',
          padding: '2.5rem',
          borderRadius: '12px',
          maxWidth: '1400px',
          margin: '0 auto',
          border: '1px solid #334155'
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
              color: '#f97316',
              margin: 0
            }}>
              Appointment Management
            </h2>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <button 
                onClick={handleAddAppointment}
                style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '1rem',
                  transition: 'background-color 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#059669';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#10b981';
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Add Appointment
              </button>
              
              <label style={{ color: '#f97316', fontWeight: '600' }}>Select Date:</label>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{ 
                  backgroundColor: '#334155', 
                  color: 'white', 
                  border: '1px solid #f97316', 
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>
          
          {/* Appointment Summary */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
            backgroundColor: '#334155',
            padding: '2rem',
            borderRadius: '8px',
            border: '1px solid #475569',
            marginBottom: '2rem'
          }}>
            {[
              { label: 'Total Appointments', count: filteredAppointments.length, color: '#f97316', icon: 'calendar' },
              { label: 'Scheduled', count: statusCounts.Scheduled, color: '#3b82f6', icon: 'clock' },
              { label: 'In Progress', count: statusCounts['In Progress'], color: '#f59e0b', icon: 'tool' },
              { label: 'Completed', count: statusCounts.Completed, color: '#10b981', icon: 'check' },
              { label: 'Cancelled', count: statusCounts.Cancelled, color: '#ef4444', icon: 'x' }
            ].map((stat, index) => (
              <div key={index} style={{ 
                textAlign: 'center', 
                padding: '1.5rem',
                backgroundColor: '#475569',
                borderRadius: '8px',
                border: `1px solid ${stat.color}`
              }}>
                <div style={{ marginBottom: '0.5rem' }}>
                  {stat.icon === 'calendar' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke={stat.color} strokeWidth="2"/>
                      <line x1="16" y1="2" x2="16" y2="6" stroke={stat.color} strokeWidth="2"/>
                      <line x1="8" y1="2" x2="8" y2="6" stroke={stat.color} strokeWidth="2"/>
                      <line x1="3" y1="10" x2="21" y2="10" stroke={stat.color} strokeWidth="2"/>
                    </svg>
                  )}
                  {stat.icon === 'clock' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke={stat.color} strokeWidth="2"/>
                      <polyline points="12,6 12,12 16,14" stroke={stat.color} strokeWidth="2"/>
                    </svg>
                  )}
                  {stat.icon === 'tool' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke={stat.color} strokeWidth="2"/>
                    </svg>
                  )}
                  {stat.icon === 'check' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <polyline points="20,6 9,17 4,12" stroke={stat.color} strokeWidth="2"/>
                    </svg>
                  )}
                  {stat.icon === 'x' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <line x1="18" y1="6" x2="6" y2="18" stroke={stat.color} strokeWidth="2"/>
                      <line x1="6" y1="6" x2="18" y2="18" stroke={stat.color} strokeWidth="2"/>
                    </svg>
                  )}
                </div>
                <div style={{ fontSize: '2rem', color: stat.color, fontWeight: '700', marginBottom: '0.5rem' }}>
                  {stat.count}
                </div>
                <div style={{ color: '#cbd5e1', fontWeight: '500' }}>{stat.label}</div>
              </div>
            ))}
          </div>
          
          {/* Date Header */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '2rem',
            padding: '1.5rem',
            backgroundColor: '#334155',
            borderRadius: '8px',
            border: '1px solid #475569'
          }}>
            <h3 style={{ 
              color: '#f97316', 
              margin: 0, 
              fontSize: '1.4rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
              </svg>
              {formatDate(selectedDate)}
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
                      backgroundColor: '#334155',
                      padding: '2rem',
                      borderRadius: '8px',
                      border: `1px solid ${getStatusColor(appointment.status)}`,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <div style={{ 
                          padding: '0.5rem 1rem', 
                          borderRadius: '6px', 
                          backgroundColor: '#475569',
                          fontWeight: '600',
                          fontSize: '0.9rem',
                          color: '#f97316',
                          border: '1px solid #f97316',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                            <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                          {appointment.time}
                        </div>
                        <div style={{ 
                          padding: '0.5rem 1rem', 
                          borderRadius: '6px', 
                          fontWeight: '600',
                          fontSize: '0.9rem',
                          backgroundColor: getStatusColor(appointment.status),
                          color: 'white'
                        }}>
                          {appointment.status}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => handleOpenImageSelector(appointment)}
                          style={{
                            backgroundColor: '#8b5cf6',
                            color: 'white',
                            border: 'none',
                            width: '36px',
                            height: '36px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background-color 0.2s ease',
                            boxShadow: 'none'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#7c3aed';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#8b5cf6';
                          }}
                          title="Add Vehicle Images"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2"/>
                            <polyline points="21,15 16,10 5,21" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        </button>
                        
                        <button 
                          onClick={() => handleEditAppointment(appointment)}
                          style={{
                            backgroundColor: '#f59e0b',
                            color: 'white',
                            border: 'none',
                            width: '36px',
                            height: '36px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background-color 0.2s ease',
                            boxShadow: 'none'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#d97706';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#f59e0b';
                          }}
                          title="Edit Appointment"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="m18 2 4 4-14 14H4v-4L18 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        
                        <button 
                          onClick={() => handleDeleteAppointment(appointment.id)}
                          style={{
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            width: '36px',
                            height: '36px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background-color 0.2s ease',
                            boxShadow: 'none'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#dc2626';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#ef4444';
                          }}
                          title="Delete Appointment"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="2"/>
                            <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h3 style={{ 
                        color: '#f97316', 
                        marginBottom: '1rem', 
                        fontSize: '1.2rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
                          <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        {appointment.customerName}
                      </h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10h-1.3l-.8-2H12" stroke="currentColor" strokeWidth="2"/>
                            <circle cx="9" cy="19" r="2" stroke="currentColor" strokeWidth="2"/>
                            <circle cx="20" cy="19" r="2" stroke="currentColor" strokeWidth="2"/>
                            <path d="M9 19H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6l2 2h7a2 2 0 0 1 2 2v4.5" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                          <strong>Vehicle:</strong> {appointment.vehicle}
                        </p>
                        <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                          <strong>Phone:</strong> {appointment.phone}
                        </p>
                        <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                            <path d="M12 8V16M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                          <strong>Service:</strong> {appointment.service}
                        </p>
                        <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                            <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <strong>Duration:</strong> {appointment.estimatedDuration}
                        </p>
                      </div>
                      {appointment.notes && (
                        <p style={{ margin: '1rem 0 0', color: '#cbd5e1', fontSize: '0.95rem', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 2H6C5.46957 2 4.96265 2.21071 4.58579 2.58579C4.21071 2.96265 4 3.46957 4 4V20C4 20.5304 4.21071 21.0373 4.58579 21.4142C4.96265 21.7893 5.46957 22 6 22H18C18.5304 22 19.0373 21.7893 19.4142 21.4142C19.7893 21.0373 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2"/>
                            <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <line x1="8" y1="13" x2="16" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <line x1="8" y1="17" x2="16" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <line x1="8" y1="9" x2="10" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                          <strong>Notes:</strong> {appointment.notes}
                        </p>
                      )}
                    </div>
                    
                    {appointment.images && appointment.images.length > 0 && (
                      <div>
                        <h4 style={{ color: '#f97316', fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.75rem' }}>Vehicle Images:</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                          {appointment.images.map((image, i) => (
                            <img 
                              key={i} 
                              src={image} 
                              alt={`Vehicle image ${i + 1}`} 
                              style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #475569' }} 
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '1.2rem', padding: '3rem', border: '1px dashed #475569', borderRadius: '8px' }}>
                No appointments found for this date.
              </p>
            )}
          </div>

          {/* Back to Dashboard Button */}
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button
              onClick={handleBackToDashboard}
              style={{
                backgroundColor: '#f97316',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1.1rem',
                transition: 'background-color 0.2s ease',
                boxShadow: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#ea580c';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f97316';
              }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        padding: '1.5rem 2rem',
        backgroundColor: '#1e293b',
        borderTop: '1px solid #334155',
        textAlign: 'center'
      }}>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>
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
            backgroundColor: '#1e293b',
            padding: '2rem',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '500px',
            border: '1px solid #475569'
          }}>
            <h3 style={{ color: '#f97316', marginTop: 0, marginBottom: '1.5rem' }}>Upload Images for {selectedAppointment.customerName}</h3>
            <div style={{ marginBottom: '1.5rem' }}>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageSelect}
                multiple 
                style={{
                  display: 'block',
                  width: '100%',
                  color: 'white',
                  padding: '0.75rem',
                  backgroundColor: '#334155',
                  borderRadius: '8px',
                  border: '1px solid #f97316'
                }}
              />
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.5rem' }}>Select one or more images to upload.</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button 
                onClick={handleCloseImageModal}
                style={{
                  backgroundColor: '#64748b',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  boxShadow: 'none'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Add Modal */}
      {(showEditModal || showAddModal) && editFormData && (
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
            backgroundColor: '#1e293b',
            padding: '2rem',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '600px',
            border: '1px solid #475569'
          }}>
            <h3 style={{ color: '#f97316', marginTop: 0, marginBottom: '1.5rem' }}>{showAddModal ? 'Add New Appointment' : 'Edit Appointment'}</h3>
            <form onSubmit={(e) => { e.preventDefault(); showAddModal ? handleSaveAdd() : handleSaveEdit(); }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ color: '#cbd5e1', marginBottom: '0.5rem' }}>Customer Name</label>
                  <input 
                    type="text"
                    value={editFormData.customerName}
                    onChange={(e) => setEditFormData({...editFormData, customerName: e.target.value})}
                    required
                    style={inputStyle}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ color: '#cbd5e1', marginBottom: '0.5rem' }}>Vehicle</label>
                  <input 
                    type="text"
                    value={editFormData.vehicle}
                    onChange={(e) => setEditFormData({...editFormData, vehicle: e.target.value})}
                    required
                    style={inputStyle}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ color: '#cbd5e1', marginBottom: '0.5rem' }}>Service</label>
                  <input 
                    type="text"
                    value={editFormData.service}
                    onChange={(e) => setEditFormData({...editFormData, service: e.target.value})}
                    required
                    style={inputStyle}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ color: '#cbd5e1', marginBottom: '0.5rem' }}>Phone</label>
                  <input 
                    type="tel"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                    required
                    style={inputStyle}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ color: '#cbd5e1', marginBottom: '0.5rem' }}>Date</label>
                  <input 
                    type="date"
                    value={editFormData.date}
                    onChange={(e) => setEditFormData({...editFormData, date: e.target.value})}
                    required
                    style={inputStyle}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ color: '#cbd5e1', marginBottom: '0.5rem' }}>Time</label>
                  <input 
                    type="time"
                    value={editFormData.time}
                    onChange={(e) => setEditFormData({...editFormData, time: e.target.value})}
                    required
                    style={inputStyle}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ color: '#cbd5e1', marginBottom: '0.5rem' }}>Estimated Duration</label>
                  <input 
                    type="text"
                    value={editFormData.estimatedDuration}
                    onChange={(e) => setEditFormData({...editFormData, estimatedDuration: e.target.value})}
                    style={inputStyle}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ color: '#cbd5e1', marginBottom: '0.5rem' }}>Status</label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({...editFormData, status: e.target.value as any})}
                    style={inputStyle}
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '1rem' }}>
                <label style={{ color: '#cbd5e1', marginBottom: '0.5rem' }}>Notes</label>
                <textarea
                  value={editFormData.notes || ''}
                  onChange={(e) => setEditFormData({...editFormData, notes: e.target.value})}
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button 
                  type="button"
                  onClick={() => { setShowEditModal(false); setShowAddModal(false); setEditFormData(null); }}
                  style={{
                    backgroundColor: '#64748b',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    boxShadow: 'none'
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    boxShadow: 'none'
                  }}
                >
                  {showAddModal ? 'Add Appointment' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const inputStyle = {
  backgroundColor: '#334155',
  color: 'white',
  border: '1px solid #475569',
  borderRadius: '8px',
  padding: '0.75rem 1rem',
  fontSize: '1rem'
};

export default AdminAppointments;
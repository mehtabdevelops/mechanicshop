"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Define types for our appointment data
interface Appointment {
  id: number;
  name: string;
  email: string;
  phone: string;
  vehicleType: string;
  serviceType: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  status: string;
}

const AdminHome = () => {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notificationsCount, setNotificationsCount] = useState(3);
  const [searchQuery, setSearchQuery] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);

  // Fetch appointments from localStorage on component mount
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Load appointments from localStorage
    const loadAppointments = () => {
      try {
        const storedAppointments = localStorage.getItem('appointments');
        if (storedAppointments) {
          const parsedAppointments = JSON.parse(storedAppointments);
          setAppointments(parsedAppointments);
          setFilteredAppointments(parsedAppointments);
        }
      } catch (error) {
        console.error('Error loading appointments:', error);
      }
    };

    loadAppointments();

    // Set up listener for storage changes (in case another tab makes changes)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'appointments') {
        loadAppointments();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(timer);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Filter appointments based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredAppointments(appointments);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = appointments.filter(appt => 
        appt.name.toLowerCase().includes(query) ||
        appt.email.toLowerCase().includes(query) ||
        appt.phone.includes(query) ||
        appt.vehicleType.toLowerCase().includes(query) ||
        appt.serviceType.toLowerCase().includes(query) ||
        appt.preferredDate.includes(query) ||
        appt.status.toLowerCase().includes(query)
      );
      setFilteredAppointments(filtered);
    }
  }, [searchQuery, appointments]);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      alert('Logging out...');
      router.push('/');
      // In a real app, this would navigate to /
    }
  };

  const handleProfile = () => {
    router.push('/Adminprofile');
    // In a real app, this would navigate to /Adminprofile
  };
  
  const handleInventory = () => {
    router.push('/AdminInventory');
  };
  
  const handleAdminAppointments = () => {
    router.push('/AdminAppointment');
  };
  
  const handleEmployees = () => {
    router.push('/AdminEmployees');
  };

  const handleCustomers = () => {
    router.push('/AdminCustomers');
  };

  const handleReports = () => {
    router.push('/AdminReports');
  };

  const handleFinance = () => {
    router.push('/AdminFinance');
  };

  const handleNotifications = () => {
    router.push('/AdminNotifications');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled in the useEffect above
  };

  // Get today's appointments
  const getTodaysAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(appt => appt.preferredDate === today);
  };

  // Get upcoming appointments (next 7 days)
  const getUpcomingAppointments = () => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    return appointments
      .filter(appt => {
        const apptDate = new Date(appt.preferredDate);
        return apptDate >= today && apptDate <= nextWeek;
      })
      .slice(0, 5); // Limit to 5 appointments
  };

  // Format date for display
  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format time for display
  const formatDisplayTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    
    return `${formattedHour}:${minutes} ${period}`;
  };

  // Sample data for recent activity
  const recentActivities = [
    { id: 1, action: 'New appointment booked', time: '2 minutes ago', user: 'John Doe' },
    { id: 2, action: 'Oil change completed', time: '15 minutes ago', user: 'Service Team' },
    { id: 3, action: 'Inventory item low stock', time: '1 hour ago', user: 'System' },
    { id: 4, action: 'New employee registered', time: '2 hours ago', user: 'HR Manager' },
    { id: 5, action: 'Monthly report generated', time: '3 hours ago', user: 'Finance System' }
  ];

  // Get real upcoming appointments from user data
  const upcomingAppointments = getUpcomingAppointments().map(appt => ({
    id: appt.id,
    customer: appt.name,
    service: appt.serviceType,
    time: formatDisplayTime(appt.preferredTime),
    date: formatDisplayDate(appt.preferredDate),
    vehicle: appt.vehicleType
  }));

  // Get today's stats
  const todaysAppointments = getTodaysAppointments();
  const completedServices = appointments.filter(appt => appt.status === 'completed').length;
  const newAppointmentsCount = todaysAppointments.length;

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
          <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search appointments, customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '0.6rem 1rem',
                borderRadius: '8px',
                border: '1px solid #475569',
                backgroundColor: '#334155',
                color: 'white',
                width: '250px',
                outline: 'none'
              }}
            />
            <button 
              type="submit"
              style={{
                backgroundColor: '#f97316',
                color: 'white',
                border: 'none',
                padding: '0.6rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                marginLeft: '0.5rem',
                fontWeight: '600',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#ea580c';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f97316';
              }}
            >
              Search
            </button>
          </form>
          
          <div style={{ position: 'relative' }}>
            <button 
              onClick={handleNotifications}
              style={{
                backgroundColor: 'transparent',
                color: '#f97316',
                width: '45px',
                height: '45px',
                borderRadius: '8px',
                border: '1px solid #f97316',
                cursor: 'pointer',
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f97316';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#f97316';
              }}
              title="Notifications"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {notificationsCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {notificationsCount}
                </span>
              )}
            </button>
          </div>
          
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
              transition: 'background-color 0.2s ease'
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
          
          <button 
            onClick={handleLogout}
            style={{
              backgroundColor: 'transparent',
              color: '#f97316',
              padding: '0.75rem 1.5rem',
              border: '1px solid #f97316',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f97316';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#f97316';
            }}
          >
            Logout
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ 
              fontSize: '2rem', 
              fontWeight: '700',
              color: '#f97316',
              margin: 0
            }}>
              ADMIN DASHBOARD
            </h2>
            
            <div style={{ 
              color: '#f97316', 
              fontSize: '1.1rem',
              fontWeight: '500'
            }}>
              {currentTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
              })}
            </div>
          </div>
          
          <p style={{ 
            fontSize: '3.0rem', 
            marginBottom: '3rem',
            fontWeight: '500',
            color: '#cbd5e1',
            maxWidth: '800px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: '1.6',
            textAlign: 'center'
          }}>
            Welcome to Sunny Auto Admin Panel - Manage everything in one place
          </p>

          {/* Quick Stats Section */}
          <div style={{
            backgroundColor: '#334155',
            padding: '2rem',
            borderRadius: '8px',
            border: '1px solid #475569',
            marginBottom: '2.5rem'
          }}>
            <h3 style={{ 
              color: '#f97316', 
              marginBottom: '1.5rem',
              fontSize: '1.3rem',
              fontWeight: '600',
              textAlign: 'left'
            }}>Today's Overview</h3>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem'
            }}>
              <div style={{ 
                textAlign: 'center',
                padding: '1.5rem',
                backgroundColor: '#475569',
                borderRadius: '8px',
                border: '1px solid #f97316'
              }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f97316' }}>{newAppointmentsCount}</div>
                <div style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>New Appointments</div>
              </div>
              
              <div style={{ 
                textAlign: 'center',
                padding: '1.5rem',
                backgroundColor: '#475569',
                borderRadius: '8px',
                border: '1px solid #10b981'
              }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981' }}>{completedServices}</div>
                <div style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>Completed Services</div>
              </div>
              
              <div style={{ 
                textAlign: 'center',
                padding: '1.5rem',
                backgroundColor: '#475569',
                borderRadius: '8px',
                border: '1px solid #3b82f6'
              }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#3b82f6' }}>${(completedServices * 149.99).toLocaleString()}</div>
                <div style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>Today's Revenue</div>
              </div>
              
              <div style={{ 
                textAlign: 'center',
                padding: '1.5rem',
                backgroundColor: '#475569',
                borderRadius: '8px',
                border: '1px solid #f59e0b'
              }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f59e0b' }}>{appointments.filter(a => a.status === 'pending').length}</div>
                <div style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>Pending Appointments</div>
              </div>
            </div>
          </div>

          {/* Search Results */}
          {searchQuery && (
            <div style={{
              backgroundColor: '#334155',
              padding: '1.5rem',
              borderRadius: '8px',
              border: '1px solid #475569',
              marginBottom: '2rem',
              textAlign: 'left'
            }}>
              <h3 style={{ 
                color: '#f97316', 
                marginBottom: '1rem',
                fontSize: '1.2rem',
                fontWeight: '600'
              }}>
                Search Results ({filteredAppointments.length})
              </h3>
              
              {filteredAppointments.length > 0 ? (
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {filteredAppointments.map(appt => (
                    <div key={appt.id} style={{
                      padding: '1rem',
                      marginBottom: '0.8rem',
                      backgroundColor: '#475569',
                      borderRadius: '8px',
                      border: '1px solid #334155'
                    }}>
                      <div style={{ fontWeight: '600', color: '#f97316', marginBottom: '0.5rem' }}>
                        {appt.name} - {appt.serviceType}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>
                        {appt.vehicleType} • {formatDisplayDate(appt.preferredDate)} at {formatDisplayTime(appt.preferredTime)}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        Status: <span style={{ 
                          color: appt.status === 'completed' ? '#10b981' : 
                                 appt.status === 'pending' ? '#f59e0b' : '#ef4444',
                          fontWeight: '600'
                        }}>{appt.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: '#94a3b8', textAlign: 'center', padding: '1rem' }}>
                  No appointments found matching your search.
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
            {/* Dashboard Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem'
            }}>
              {/* Inventory */}
              <div 
                style={{
                  backgroundColor: '#334155',
                  padding: '2rem',
                  borderRadius: '8px',
                  border: '1px solid #475569',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'center',
                  height: '100%'
                }}
                onClick={handleInventory}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.borderColor = '#f97316';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#475569';
                }}
              >
                <div style={{ 
                  fontSize: '3rem', 
                  marginBottom: '1.2rem',
                  color: '#f97316'
                }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M9 9h6M9 12h6M9 15h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3 style={{ 
                  color: '#f97316', 
                  marginBottom: '1rem', 
                  fontSize: '1.3rem',
                  fontWeight: '600'
                }}>Inventory Management</h3>
                <p style={{ color: '#cbd5e1', lineHeight: '1.5', fontSize: '0.9rem' }}>
                  Manage parts, tools, and stock levels
                </p>
              </div>
              
              {/* Appointments */}
              <div 
                style={{
                  backgroundColor: '#334155',
                  padding: '2rem',
                  borderRadius: '8px',
                  border: '1px solid #475569',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'center',
                  height: '100%'
                }}
                onClick={handleAdminAppointments}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.borderColor = '#f97316';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#475569';
                }}
              >
                <div style={{ 
                  fontSize: '3rem', 
                  marginBottom: '1.2rem',
                  color: '#f97316'
                }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3 style={{ 
                  color: '#f97316', 
                  marginBottom: '1rem', 
                  fontSize: '1.3rem',
                  fontWeight: '600'
                }}>Appointments</h3>
                <p style={{ color: '#cbd5e1', lineHeight: '1.5', fontSize: '0.9rem' }}>
                  View and manage service bookings
                </p>
              </div>
              
              {/* Employees */}
              <div 
                style={{
                  backgroundColor: '#334155',
                  padding: '2rem',
                  borderRadius: '8px',
                  border: '1px solid #475569',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'center',
                  height: '100%'
                }}
                onClick={handleEmployees}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.borderColor = '#f97316';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#475569';
                }}
              >
                <div style={{ 
                  fontSize: '3rem', 
                  marginBottom: '1.2rem',
                  color: '#f97316'
                }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 style={{ 
                  color: '#f97316', 
                  marginBottom: '1rem', 
                  fontSize: '1.3rem',
                  fontWeight: '600'
                }}>Employees</h3>
                <p style={{ color: '#cbd5e1', lineHeight: '1.5', fontSize: '0.9rem' }}>
                  Manage staff and work schedules
                </p>
              </div>
              
              {/* Customers */}
              <div 
                style={{
                  backgroundColor: '#334155',
                  padding: '2rem',
                  borderRadius: '8px',
                  border: '1px solid #475569',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'center',
                  height: '100%'
                }}
                onClick={handleCustomers}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.borderColor = '#f97316';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#475569';
                }}
              >
                <div style={{ 
                  fontSize: '3rem', 
                  marginBottom: '1.2rem',
                  color: '#f97316'
                }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 style={{ 
                  color: '#f97316', 
                  marginBottom: '1rem', 
                  fontSize: '1.3rem',
                  fontWeight: '600'
                }}>Customers</h3>
                <p style={{ color: '#cbd5e1', lineHeight: '1.5', fontSize: '0.9rem' }}>
                  Manage customer database and history
                </p>
              </div>

              {/* Reports */}
              <div 
                style={{
                  backgroundColor: '#334155',
                  padding: '2rem',
                  borderRadius: '8px',
                  border: '1px solid #475569',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'center',
                  height: '100%'
                }}
                onClick={handleReports}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.borderColor = '#f97316';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#475569';
                }}
              >
                <div style={{ 
                  fontSize: '3rem', 
                  marginBottom: '1.2rem',
                  color: '#f97316'
                }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 style={{ 
                  color: '#f97316', 
                  marginBottom: '1rem', 
                  fontSize: '1.3rem',
                  fontWeight: '600'
                }}>Reports & Analytics</h3>
                <p style={{ color: '#cbd5e1', lineHeight: '1.5', fontSize: '0.9rem' }}>
                  Generate business reports and insights
                </p>
              </div>

              {/* Finance */}
              <div 
                style={{
                  backgroundColor: '#334155',
                  padding: '2rem',
                  borderRadius: '8px',
                  border: '1px solid #475569',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'center',
                  height: '100%'
                }}
                onClick={handleFinance}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.borderColor = '#f97316';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#475569';
                }}
              >
                <div style={{ 
                  fontSize: '3rem', 
                  marginBottom: '1.2rem',
                  color: '#f97316'
                }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 10a2 2 0 1 1 0 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 10v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 10v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 10h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 style={{ 
                  color: '#f97316', 
                  marginBottom: '1rem', 
                  fontSize: '1.3rem',
                  fontWeight: '600'
                }}>Finance</h3>
                <p style={{ color: '#cbd5e1', lineHeight: '1.5', fontSize: '0.9rem' }}>
                  Manage payments, invoices, and accounting
                </p>
              </div>
            </div>

            {/* Upcoming Appointments Sidebar */}
            <div style={{
              backgroundColor: '#334155',
              padding: '1.5rem',
              borderRadius: '8px',
              border: '1px solid #475569',
              height: 'fit-content'
            }}>
              <h3 style={{ 
                color: '#f97316', 
                marginBottom: '1.5rem',
                fontSize: '1.2rem',
                fontWeight: '600'
              }}>Upcoming Appointments</h3>
              
              {upcomingAppointments.length > 0 ? (
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {upcomingAppointments.map(appointment => (
                    <div key={appointment.id} style={{
                      padding: '1rem',
                      marginBottom: '0.8rem',
                      backgroundColor: '#475569',
                      borderRadius: '8px',
                      border: '1px solid #334155',
                      textAlign: 'left'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '0.5rem'
                      }}>
                        <span style={{ fontWeight: '600', color: '#f97316' }}>{appointment.customer}</span>
                        <span style={{ 
                          backgroundColor: 'rgba(249, 115, 22, 0.2)',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          color: '#f97316',
                          fontWeight: '600'
                        }}>
                          {appointment.time}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>
                        {appointment.service} • {appointment.vehicle}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        {appointment.date}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: '#94a3b8', textAlign: 'center', padding: '1rem' }}>
                  No upcoming appointments.
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity Section */}
          <div style={{
            backgroundColor: '#334155',
            padding: '2rem',
            borderRadius: '8px',
            border: '1px solid #475569',
          }}>
            <h3 style={{ 
              color: '#f97316', 
              marginBottom: '1.5rem',
              fontSize: '1.3rem',
              fontWeight: '600'
            }}>Recent Activity</h3>
            
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {recentActivities.map(activity => (
                <div key={activity.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem',
                  borderBottom: '1px solid #475569'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(249, 115, 22, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '1rem',
                    flexShrink: 0
                  }}>
                    <span style={{ color: '#f97316' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </div>
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ color: '#f97316', fontWeight: '600' }}>{activity.action}</div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginTop: '0.3rem'
                    }}>
                      <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                        By {activity.user}
                      </span>
                      <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                        {activity.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
    </div>
  );
};

export default AdminHome;
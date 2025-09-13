"use client";

import React, { useState } from 'react';
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
}

const AdminAppointments = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
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
      notes: "Synthetic oil preferred"
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
      notes: "Front brakes only"
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
      estimatedDuration: "30 mins"
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
      notes: "Includes oil change, filter replacement, and inspection"
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
      estimatedDuration: "1.5 hours"
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
      notes: "Customer will reschedule"
    }
  ]);

  const handleBackToDashboard = () => {
    router.push('/AdminHome');
  };

  const handleLogout = () => {
    router.push('/');
  };

  const handleProfile = () => {
    router.push('/Adminprofile');
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
      case 'Scheduled': return 'bg-blue-500';
      case 'In Progress': return 'bg-yellow-500';
      case 'Completed': return 'bg-green-500';
      case 'Cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch(status) {
      case 'Scheduled': return 'text-blue-500';
      case 'In Progress': return 'text-yellow-500';
      case 'Completed': return 'text-green-500';
      case 'Cancelled': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div style={{ 
      backgroundImage: 'url("https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh', 
      color: 'white',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
      }}></div>

      {/* Header with Profile Icon */}
      <header style={{
        position: 'relative',
        zIndex: 2,
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.9)'
      }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold',
          color: 'orange',
          margin: 0
        }}>
          SUNNY AUTO ADMIN - APPOINTMENTS
        </h1>
        
        <button 
          onClick={handleProfile}
          style={{
            backgroundColor: 'orange',
            color: 'black',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Admin Profile"
        >
          👤
        </button>
      </header>

      {/* Main Content */}
      <div style={{ 
        position: 'relative', 
        zIndex: 1,
        padding: '40px 20px',
        minHeight: 'calc(100vh - 100px)'
      }}>
        <div style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: '40px',
          borderRadius: '15px',
          maxWidth: '1400px',
          margin: '0 auto',
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '30px',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <h2 style={{ 
              fontSize: '2.2rem', 
              fontWeight: 'bold',
              color: 'orange',
              margin: 0
            }}>
              APPOINTMENT MANAGEMENT
            </h2>
            
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
              <label style={{ color: 'orange', fontWeight: 'bold' }}>Select Date:</label>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{ 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  color: 'white', 
                  border: '1px solid orange', 
                  borderRadius: '8px',
                  padding: '8px 15px'
                }}
              />
            </div>
          </div>
          
          {/* Appointment Summary */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            background: 'rgba(255, 165, 0, 0.1)',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid orange',
            marginBottom: '30px',
            flexWrap: 'wrap',
            gap: '15px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', color: 'orange', fontWeight: 'bold' }}>
                {filteredAppointments.length}
              </div>
              <div>Total Appointments</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', color: 'blue', fontWeight: 'bold' }}>
                {statusCounts.Scheduled}
              </div>
              <div>Scheduled</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', color: 'yellow', fontWeight: 'bold' }}>
                {statusCounts['In Progress']}
              </div>
              <div>In Progress</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', color: 'green', fontWeight: 'bold' }}>
                {statusCounts.Completed}
              </div>
              <div>Completed</div>
            </div>
          </div>
          
          {/* Date Header */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '20px',
            padding: '10px',
            background: 'rgba(255, 165, 0, 0.2)',
            borderRadius: '8px',
            border: '1px solid orange'
          }}>
            <h3 style={{ color: 'orange', margin: 0 }}>
              {formatDate(selectedDate)}
            </h3>
          </div>
          
          {/* Appointments List */}
          <div style={{ marginBottom: '50px' }}>
            {sortedAppointments.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {sortedAppointments.map(appointment => (
                  <div 
                    key={appointment.id}
                    style={{
                      backgroundColor: 'rgba(255, 165, 0, 0.1)',
                      padding: '20px',
                      borderRadius: '12px',
                      border: '2px solid orange',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px' }}>
                      <div style={{ flex: '1', minWidth: '250px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                          <div style={{ 
                            padding: '5px 10px', 
                            borderRadius: '20px', 
                            background: 'rgba(255, 255, 255, 0.2)',
                            fontWeight: 'bold'
                          }}>
                            {appointment.time}
                          </div>
                          <div style={{ 
                            padding: '5px 10px', 
                            borderRadius: '20px', 
                            fontWeight: 'bold',
                            background: getStatusColor(appointment.status)
                          }}>
                            {appointment.status}
                          </div>
                        </div>
                        <h3 style={{ color: 'orange', marginBottom: '5px' }}>{appointment.customerName}</h3>
                        <p style={{ margin: '2px 0', color: '#ccc' }}>{appointment.vehicle}</p>
                        <p style={{ margin: '2px 0', color: '#ccc' }}>{appointment.phone}</p>
                      </div>
                      
                      <div style={{ flex: '1', minWidth: '250px' }}>
                        <h4 style={{ color: 'orange', marginBottom: '5px' }}>Service</h4>
                        <p style={{ margin: '2px 0', color: '#ccc' }}>{appointment.service}</p>
                        <p style={{ margin: '2px 0', color: '#ccc' }}>Est: {appointment.estimatedDuration}</p>
                      </div>
                      
                      <div style={{ flex: '1', minWidth: '250px' }}>
                        {appointment.notes && (
                          <>
                            <h4 style={{ color: 'orange', marginBottom: '5px' }}>Notes</h4>
                            <p style={{ margin: '2px 0', color: '#ccc', fontStyle: 'italic' }}>{appointment.notes}</p>
                          </>
                        )}
                      </div>
                      
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                          style={{
                            background: 'orange',
                            color: 'black',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#e59400'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'orange'}
                        >
                          Edit
                        </button>
                        <button 
                          style={{
                            background: 'transparent',
                            color: 'orange',
                            border: '1px solid orange',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'orange';
                            e.currentTarget.style.color = 'black';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = 'orange';
                          }}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#ccc' }}>
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📅</div>
                <h3 style={{ color: 'orange' }}>No appointments scheduled</h3>
                <p>There are no appointments scheduled for {formatDate(selectedDate)}</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={handleBackToDashboard}
              style={{
                backgroundColor: 'transparent',
                color: 'orange',
                border: '2px solid orange',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'orange';
                e.currentTarget.style.color = 'black';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'orange';
              }}
            >
              ← Back to Dashboard
            </button>
            
            <button 
              onClick={handleLogout}
              style={{
                backgroundColor: 'orange',
                color: 'black',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e59400'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'orange'}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAppointments;
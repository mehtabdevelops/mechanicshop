"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Employee {
  id: number;
  name: string;
  position: string;
  email: string;
  phone: string;
  hireDate: string;
  status: 'Active' | 'On Leave' | 'Terminated';
  image: string;
}

const AdminEmployees = () => {
  const router = useRouter();
  
  // Sample employee data
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 1,
      name: "John Smith",
      position: "Head Mechanic",
      email: "john.smith@sunnyauto.com",
      phone: "+1 (555) 123-4567",
      hireDate: "2021-03-15",
      status: "Active",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 2,
      name: "Maria Garcia",
      position: "Service Advisor",
      email: "maria.garcia@sunnyauto.com",
      phone: "+1 (555) 987-6543",
      hireDate: "2022-01-10",
      status: "Active",
      image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 3,
      name: "Robert Johnson",
      position: "Auto Technician",
      email: "robert.johnson@sunnyauto.com",
      phone: "+1 (555) 456-7890",
      hireDate: "2020-11-05",
      status: "Active",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 4,
      name: "Sarah Williams",
      position: "Parts Manager",
      email: "sarah.williams@sunnyauto.com",
      phone: "+1 (555) 234-5678",
      hireDate: "2019-08-22",
      status: "On Leave",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 5,
      name: "James Brown",
      position: "Junior Mechanic",
      email: "james.brown@sunnyauto.com",
      phone: "+1 (555) 876-5432",
      hireDate: "2023-02-14",
      status: "Active",
      image: "https://images.unsplash.com/photo-1508341591423-4347099e1f19?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80"
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    position: "",
    email: "",
    phone: "",
    hireDate: new Date().toISOString().split('T')[0],
    status: "Active" as const,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80"
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Color scheme - Orange dominant (60-70%) with white (30-40%)
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

  const handleBackToDashboard = () => {
    router.push('/AdminHome');
  };

  const handleProfile = () => {
    router.push('/Adminprofile');
  };

  const handleAddEmployee = () => {
    if (newEmployee.name && newEmployee.position && newEmployee.email) {
      const newId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1;
      setEmployees([...employees, { ...newEmployee, id: newId }]);
      setNewEmployee({
        name: "",
        position: "",
        email: "",
        phone: "",
        hireDate: new Date().toISOString().split('T')[0],
        status: "Active",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80"
      });
      setShowAddForm(false);
    }
  };

  const handleDeleteEmployee = (id: number) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      setEmployees(employees.filter(employee => employee.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Active': return colors.success;
      case 'On Leave': return colors.warning;
      case 'Terminated': return colors.error;
      default: return colors.textMuted;
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Filter employees based on search term and status
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || employee.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ 
      background: colors.background,
      minHeight: '100vh', 
      color: colors.text,
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header - Orange Dominant */}
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
            SUNNY AUTO
          </h1>
          <div style={{ 
            color: colors.primary, 
            fontSize: '0.9rem',
            fontWeight: '500',
            padding: '0.25rem 0.75rem',
            backgroundColor: colors.background,
            borderRadius: '20px'
          }}>
            EMPLOYEE MANAGEMENT
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button 
            onClick={handleBackToDashboard}
            style={{
              backgroundColor: 'transparent',
              color: colors.background,
              border: `2px solid ${colors.background}`,
              padding: '0.75rem 1.5rem',
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
          
          <button 
            onClick={handleProfile}
            style={{
              backgroundColor: colors.background,
              color: colors.primary,
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.primaryLight;
              e.currentTarget.style.color = colors.background;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.background;
              e.currentTarget.style.color = colors.primary;
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
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          {/* Header Section */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <h2 style={{ 
                fontSize: '2rem', 
                fontWeight: '800',
                color: colors.primary,
                margin: '0 0 0.5rem 0'
              }}>
                Employee Management
              </h2>
              <p style={{ 
                color: colors.textSecondary,
                margin: 0,
                fontSize: '1rem'
              }}>
                Manage staff and work schedules
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button 
                onClick={() => setShowAddForm(true)}
                style={{
                  backgroundColor: colors.primary,
                  color: colors.background,
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  transition: 'background-color 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryDark}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Add Employee
              </button>
            </div>
          </div>
          
          {/* Employee Summary */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            backgroundColor: colors.surface,
            padding: '2rem',
            borderRadius: '16px',
            border: `2px solid ${colors.primaryLight}`,
            marginBottom: '2rem'
          }}>
            <div style={{ 
              textAlign: 'center',
              padding: '1.5rem',
              backgroundColor: colors.background,
              borderRadius: '12px',
              border: `2px solid ${colors.primary}`
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: colors.primary }}>
                {employees.length}
              </div>
              <div style={{ color: colors.textSecondary, fontSize: '0.9rem', fontWeight: '600' }}>Total Employees</div>
            </div>
            <div style={{ 
              textAlign: 'center',
              padding: '1.5rem',
              backgroundColor: colors.background,
              borderRadius: '12px',
              border: `2px solid ${colors.success}`
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: colors.success }}>
                {employees.filter(e => e.status === 'Active').length}
              </div>
              <div style={{ color: colors.textSecondary, fontSize: '0.9rem', fontWeight: '600' }}>Active</div>
            </div>
            <div style={{ 
              textAlign: 'center',
              padding: '1.5rem',
              backgroundColor: colors.background,
              borderRadius: '12px',
              border: `2px solid ${colors.warning}`
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: colors.warning }}>
                {employees.filter(e => e.status === 'On Leave').length}
              </div>
              <div style={{ color: colors.textSecondary, fontSize: '0.9rem', fontWeight: '600' }}>On Leave</div>
            </div>
            <div style={{ 
              textAlign: 'center',
              padding: '1.5rem',
              backgroundColor: colors.background,
              borderRadius: '12px',
              border: `2px solid ${colors.error}`
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: colors.error }}>
                {employees.filter(e => e.status === 'Terminated').length}
              </div>
              <div style={{ color: colors.textSecondary, fontSize: '0.9rem', fontWeight: '600' }}>Terminated</div>
            </div>
          </div>
          
          {/* Search and Filter */}
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            marginBottom: '2rem',
            flexWrap: 'wrap'
          }}>
            <div style={{ flex: '1', minWidth: '300px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                backgroundColor: colors.background,
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                border: `2px solid ${colors.primaryLight}`
              }}>
                <input 
                  type="text" 
                  placeholder="Search employees by name, position, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: colors.text,
                    outline: 'none',
                    fontSize: '0.9rem'
                  }}
                />
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: colors.primary }}>
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                  <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
            <div style={{ width: '200px' }}>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: colors.background,
                  border: `2px solid ${colors.primaryLight}`,
                  borderRadius: '12px',
                  color: colors.text,
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Terminated">Terminated</option>
              </select>
            </div>
          </div>
          
          {/* Add Employee Form */}
          {showAddForm && (
            <div style={{
              backgroundColor: colors.surface,
              padding: '2rem',
              borderRadius: '16px',
              border: `2px solid ${colors.primary}`,
              marginBottom: '2rem'
            }}>
              <h3 style={{ 
                color: colors.primary, 
                marginBottom: '1.5rem',
                fontSize: '1.3rem',
                fontWeight: '700'
              }}>Add New Employee</h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '1.5rem', 
                marginBottom: '1.5rem' 
              }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: colors.text, fontWeight: '600', fontSize: '0.9rem' }}>Full Name</label>
                  <input 
                    type="text" 
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: colors.background,
                      border: `2px solid ${colors.primaryLight}`,
                      borderRadius: '8px',
                      color: colors.text,
                      fontSize: '0.9rem'
                    }}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: colors.text, fontWeight: '600', fontSize: '0.9rem' }}>Position</label>
                  <input 
                    type="text" 
                    value={newEmployee.position}
                    onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: colors.background,
                      border: `2px solid ${colors.primaryLight}`,
                      borderRadius: '8px',
                      color: colors.text,
                      fontSize: '0.9rem'
                    }}
                    placeholder="Enter position"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: colors.text, fontWeight: '600', fontSize: '0.9rem' }}>Email</label>
                  <input 
                    type="email" 
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: colors.background,
                      border: `2px solid ${colors.primaryLight}`,
                      borderRadius: '8px',
                      color: colors.text,
                      fontSize: '0.9rem'
                    }}
                    placeholder="Enter email"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: colors.text, fontWeight: '600', fontSize: '0.9rem' }}>Phone</label>
                  <input 
                    type="text" 
                    value={newEmployee.phone}
                    onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: colors.background,
                      border: `2px solid ${colors.primaryLight}`,
                      borderRadius: '8px',
                      color: colors.text,
                      fontSize: '0.9rem'
                    }}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: colors.text, fontWeight: '600', fontSize: '0.9rem' }}>Hire Date</label>
                  <input 
                    type="date" 
                    value={newEmployee.hireDate}
                    onChange={(e) => setNewEmployee({...newEmployee, hireDate: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: colors.background,
                      border: `2px solid ${colors.primaryLight}`,
                      borderRadius: '8px',
                      color: colors.text,
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: colors.text, fontWeight: '600', fontSize: '0.9rem' }}>Status</label>
                  <select 
                    value={newEmployee.status}
                    onChange={(e) => setNewEmployee({...newEmployee, status: e.target.value as any})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: colors.background,
                      border: `2px solid ${colors.primaryLight}`,
                      borderRadius: '8px',
                      color: colors.text,
                      fontSize: '0.9rem'
                    }}
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Terminated">Terminated</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => setShowAddForm(false)}
                  style={{
                    backgroundColor: 'transparent',
                    color: colors.primary,
                    border: `2px solid ${colors.primary}`,
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
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
                  Cancel
                </button>
                <button 
                  onClick={handleAddEmployee}
                  style={{
                    backgroundColor: colors.primary,
                    color: colors.background,
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryDark}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary}
                >
                  Add Employee
                </button>
              </div>
            </div>
          )}
          
          {/* Employees Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            {filteredEmployees.map((employee) => (
              <div key={employee.id} style={{
                backgroundColor: colors.surface,
                borderRadius: '16px',
                padding: '1.5rem',
                border: `2px solid ${colors.primaryLight}`,
                transition: 'all 0.3s ease',
                position: 'relative'
              }} onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.borderColor = colors.primary;
              }} onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = colors.primaryLight;
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <img 
                    src={employee.image} 
                    alt={employee.name}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      marginRight: '1rem',
                      border: `2px solid ${colors.primary}`
                    }}
                  />
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: colors.primary, fontSize: '1.1rem', fontWeight: '700' }}>{employee.name}</h3>
                    <p style={{ margin: 0, color: colors.textSecondary, fontSize: '0.9rem', fontWeight: '500' }}>{employee.position}</p>
                  </div>
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: colors.primary, marginRight: '0.5rem' }}>
                      <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6z" stroke="currentColor" strokeWidth="2"/>
                      <path d="m22 6-10 7L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span style={{ color: colors.textSecondary }}>{employee.email}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: colors.primary, marginRight: '0.5rem' }}>
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span style={{ color: colors.textSecondary }}>{employee.phone}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: colors.primary, marginRight: '0.5rem' }}>
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                      <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span style={{ color: colors.textSecondary }}>Hired: {formatDate(employee.hireDate)}</span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: `1px solid ${colors.surfaceDark}` }}>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    backgroundColor: getStatusColor(employee.status),
                    color: colors.background
                  }}>
                    {employee.status}
                  </span>
                  
                  <button 
                    onClick={() => handleDeleteEmployee(employee.id)}
                    style={{
                      backgroundColor: 'transparent',
                      color: colors.error,
                      border: `2px solid ${colors.error}`,
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.error;
                      e.currentTarget.style.color = colors.background;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = colors.error;
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {filteredEmployees.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem', 
              color: colors.textSecondary,
              backgroundColor: colors.surface,
              borderRadius: '16px',
              border: `2px solid ${colors.primaryLight}`
            }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: colors.primary, marginBottom: '1rem' }}>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <line x1="8" y1="8" x2="16" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="16" y1="8" x2="8" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <h3 style={{ color: colors.primary, marginBottom: '0.5rem', fontSize: '1.3rem' }}>No employees found</h3>
              <p style={{ margin: 0 }}>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEmployees;
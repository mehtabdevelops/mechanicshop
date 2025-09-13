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
      case 'Active': return 'bg-green-500';
      case 'On Leave': return 'bg-yellow-500';
      case 'Terminated': return 'bg-red-500';
      default: return 'bg-gray-500';
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
          SUNNY AUTO ADMIN - EMPLOYEES
        </h1>
        
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <button 
            onClick={handleBackToDashboard}
            style={{
              backgroundColor: 'orange',
              color: 'black',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem'
            }}
          >
            Back to Dashboard
          </button>
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
        </div>
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
              EMPLOYEE MANAGEMENT
            </h2>
            
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => setShowAddForm(true)}
                style={{
                  backgroundColor: 'orange',
                  color: 'black',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  transition: 'background 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e59400'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'orange'}
              >
                <span>+</span> Add Employee
              </button>
            </div>
          </div>
          
          {/* Employee Summary */}
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
                {employees.length}
              </div>
              <div>Total Employees</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', color: 'green', fontWeight: 'bold' }}>
                {employees.filter(e => e.status === 'Active').length}
              </div>
              <div>Active</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', color: 'yellow', fontWeight: 'bold' }}>
                {employees.filter(e => e.status === 'On Leave').length}
              </div>
              <div>On Leave</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', color: 'red', fontWeight: 'bold' }}>
                {employees.filter(e => e.status === 'Terminated').length}
              </div>
              <div>Terminated</div>
            </div>
          </div>
          
          {/* Search and Filter */}
          <div style={{ 
            display: 'flex', 
            gap: '20px', 
            marginBottom: '30px',
            flexWrap: 'wrap'
          }}>
            <div style={{ flex: '1', minWidth: '250px' }}>
              <input 
                type="text" 
                placeholder="Search employees by name, position, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'black',
                  border: '1px solid orange',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '1rem'
                }}
              />
            </div>
            <div style={{ width: '200px' }}>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'black',
                  border: '1px solid orange',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '1rem'
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
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              padding: '25px',
              borderRadius: '12px',
              border: '2px solid orange',
              marginBottom: '30px'
            }}>
              <h3 style={{ color: 'orange', marginBottom: '20px' }}>Add New Employee</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: 'orange' }}>Full Name</label>
                  <input 
                    type="text" 
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid orange',
                      borderRadius: '4px',
                      color: 'white'
                    }}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: 'orange' }}>Position</label>
                  <input 
                    type="text" 
                    value={newEmployee.position}
                    onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid orange',
                      borderRadius: '4px',
                      color: 'white'
                    }}
                    placeholder="Enter position"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: 'orange' }}>Email</label>
                  <input 
                    type="email" 
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid orange',
                      borderRadius: '4px',
                      color: 'white'
                    }}
                    placeholder="Enter email"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: 'orange' }}>Phone</label>
                  <input 
                    type="text" 
                    value={newEmployee.phone}
                    onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid orange',
                      borderRadius: '4px',
                      color: 'white'
                    }}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: 'orange' }}>Hire Date</label>
                  <input 
                    type="date" 
                    value={newEmployee.hireDate}
                    onChange={(e) => setNewEmployee({...newEmployee, hireDate: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid orange',
                      borderRadius: '4px',
                      color: 'white'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: 'orange' }}>Status</label>
                  <select 
                    value={newEmployee.status}
                    onChange={(e) => setNewEmployee({...newEmployee, status: e.target.value as any})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid orange',
                      borderRadius: '4px',
                      color: 'white'
                    }}
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Terminated">Terminated</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => setShowAddForm(false)}
                  style={{
                    backgroundColor: 'transparent',
                    color: 'orange',
                    border: '2px solid orange',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
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
                  Cancel
                </button>
                <button 
                  onClick={handleAddEmployee}
                  style={{
                    backgroundColor: 'orange',
                    color: 'black',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e59400'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'orange'}
                >
                  Add Employee
                </button>
              </div>
            </div>
          )}
          
          {/* Employees Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '20px' 
          }}>
            {filteredEmployees.map((employee) => (
              <div key={employee.id} style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255, 165, 0, 0.3)',
                transition: 'transform 0.2s, border-color 0.2s',
                position: 'relative'
              }} onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.borderColor = 'orange';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 165, 0, 0.3)';
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  <img 
                    src={employee.image} 
                    alt={employee.name}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      marginRight: '15px'
                    }}
                  />
                  <div>
                    <h3 style={{ margin: '0 0 5px 0', color: 'orange' }}>{employee.name}</h3>
                    <p style={{ margin: 0, color: '#ccc' }}>{employee.position}</p>
                  </div>
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ color: '#ccc', marginRight: '8px' }}>📧</span>
                    <span>{employee.email}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ color: '#ccc', marginRight: '8px' }}>📞</span>
                    <span>{employee.phone}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ color: '#ccc', marginRight: '8px' }}>📅</span>
                    <span>Hired: {formatDate(employee.hireDate)}</span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    padding: '5px 10px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    backgroundColor: getStatusColor(employee.status)
                  }}>
                    {employee.status}
                  </span>
                  
                  <button 
                    onClick={() => handleDeleteEmployee(employee.id)}
                    style={{
                      backgroundColor: 'transparent',
                      color: 'red',
                      border: '1px solid red',
                      padding: '5px 10px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'red';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'red';
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {filteredEmployees.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#ccc' }}>
              No employees found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEmployees;
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface Employee {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string | null;
  hire_date: string;
  status: "Active" | "On Leave" | "Terminated";
  image_url: string | null;
  address: string | null;
  salary: number | null;
  department: string | null;
  sin: string | null;
  created_at: string;
}

const AdminEmployees = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [error, setError] = useState<string | null>(null);

  const [newEmployee, setNewEmployee] = useState({
    name: "Initials (exp) bank relationship",
    position: "@yand.com",
    email: "$5079607.1",
    phone: "$71871909",
    hire_date: "2025-10-09",
    status: "Active" as const,
    image_url: "https://epache.welstein.com/e632e292d/anacbqay/",
    address: "$408 connections Bud North out",
    salary: "24145",
    department: "Management",
    sin: "71871909", // This is 8 digits, needs to be 9
  });

  // Color scheme - Red accent (#dc2626) with dark theme
  const colors = {
    primary: "#FF8C00",
    primaryLight: "#FFA500",
    primaryDark: "#FF7F00",
    background: "#0a0a0a",
    surface: "rgba(255, 255, 255, 0.05)",
    surfaceLight: "rgba(255, 255, 255, 0.08)",
    surfaceDark: "rgba(255, 255, 255, 0.02)",
    text: "#ffffff",
    textSecondary: "rgba(255, 255, 255, 0.7)",
    textMuted: "rgba(255, 255, 255, 0.5)",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",
    border: "rgba(255, 255, 255, 0.1)",
    borderLight: "rgba(255, 255, 255, 0.2)",
 
  };

  // Fetch employees from Supabase
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error("Error loading employees:", error);
      alert("Error loading employee data");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    router.push("/AdminHome");
  };

  const handleProfile = () => {
    router.push("/Adminprofile");
  };

  const handleAddEmployee = async () => {
    setError(null);

    // Basic validation
    if (!newEmployee.name || !newEmployee.position || !newEmployee.email) {
      setError("Please fill in all required fields (Name, Position, Email)");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmployee.email)) {
      setError("Please enter a valid email address");
      return;
    }

    // SIN validation - make it optional but validate format if provided
    if (newEmployee.sin && !isValidSINFormat(newEmployee.sin)) {
      setError(
        "Please enter a valid Social Insurance Number (9 digits) or leave it blank"
      );
      return;
    }

    // Salary validation
    if (newEmployee.salary && isNaN(parseFloat(newEmployee.salary))) {
      setError("Please enter a valid salary amount");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("employees")
        .insert([
          {
            name: newEmployee.name,
            position: newEmployee.position,
            email: newEmployee.email,
            phone: newEmployee.phone || null,
            hire_date: newEmployee.hire_date,
            status: newEmployee.status,
            image_url: newEmployee.image_url || null,
            address: newEmployee.address || null,
            salary: newEmployee.salary ? parseFloat(newEmployee.salary) : null,
            department: newEmployee.department || null,
            sin: newEmployee.sin || null,
          },
        ])
        .select();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      // Update local state
      if (data && data[0]) {
        setEmployees((prev) => [data[0], ...prev]);
      }

      // Reset form and close modal
      setNewEmployee({
        name: "",
        position: "",
        email: "",
        phone: "",
        hire_date: new Date().toISOString().split("T")[0],
        status: "Active",
        image_url: "",
        address: "",
        salary: "",
        department: "",
        sin: "",
      });
      setShowAddForm(false);
      alert("Employee added successfully!");
    } catch (error: any) {
      console.error("Error adding employee:", error);
      setError(`Error adding employee: ${error.message || "Unknown error"}`);
    }
  };

  // SIN validation function - basic format check only
  const isValidSINFormat = (sin: string): boolean => {
    // Remove any spaces or dashes
    const cleanSIN = sin.replace(/[\s-]/g, "");

    // Check if it's exactly 9 digits
    return /^\d{9}$/.test(cleanSIN);
  };

  // Format SIN for display (XXX-XXX-XXX)
  const formatSIN = (sin: string | null): string => {
    if (!sin) return "Not provided";
    const cleanSIN = sin.replace(/[\s-]/g, "");
    if (cleanSIN.length !== 9) return sin;
    return `${cleanSIN.substring(0, 3)}-${cleanSIN.substring(3, 6)}-${cleanSIN.substring(6, 9)}`;
  };

  // Handle SIN input with auto-formatting
  const handleSINChange = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");

    // Limit to 9 digits
    const limited = digits.slice(0, 9);

    // Auto-format as XXX-XXX-XXX
    let formatted = limited;
    if (limited.length > 6) {
      formatted = `${limited.slice(0, 3)}-${limited.slice(3, 6)}-${limited.slice(6)}`;
    } else if (limited.length > 3) {
      formatted = `${limited.slice(0, 3)}-${limited.slice(3)}`;
    }

    setNewEmployee((prev) => ({ ...prev, sin: formatted }));
  };

  const handleDeleteEmployee = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        const { error } = await supabase
          .from("employees")
          .delete()
          .eq("id", id);

        if (error) throw error;

        setEmployees((prev) => prev.filter((employee) => employee.id !== id));
        alert("Employee deleted successfully!");
      } catch (error) {
        console.error("Error deleting employee:", error);
        alert("Error deleting employee");
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return colors.success;
      case "On Leave":
        return colors.warning;
      case "Terminated":
        return colors.error;
      default:
        return colors.textMuted;
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Filter employees based on search term and status
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee.sin && employee.sin.includes(searchTerm));
    const matchesStatus =
      filterStatus === "All" || employee.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Sample departments for dropdown
  const departments = [
    "Mechanics",
    "Service Advisors",
    "Parts Department",
    "Management",
    "Administration",
    "Sales",
    "Customer Service",
  ];

  if (loading) {
    return (
      <div
        style={{
          background: colors.background,
          minHeight: "100vh",
          color: colors.text,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "50px",
              height: "50px",
              border: `4px solid ${colors.border}`,
              borderTop: `4px solid ${colors.primary}`,
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 1rem",
            }}
          />
          <p
            style={{
              color: colors.primary,
              fontSize: "1.2rem",
              fontWeight: "600",
            }}
          >
            Loading Employees...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: colors.background,
        minHeight: "100vh",
        color: colors.text,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* Header - Dark with Red Accent */}
      <header
        style={{
          padding: "1.5rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.95)",
          borderBottom: `1px solid ${colors.border}`,
          position: "sticky",
          top: 0,
          zIndex: 50,
          backdropFilter: "blur(10px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <h1
            style={{
              fontSize: "1.8rem",
              fontWeight: "700",
              color: colors.primary,
              margin: 0,
              cursor: "pointer",
            }}
            onClick={handleBackToDashboard}
          >
            <span style={{ color: colors.primary }}>Sunny</span>
            <span style={{ color: colors.text }}>Auto</span>
          </h1>
          <div
            style={{
              color: colors.primary,
              fontSize: "0.9rem",
              fontWeight: "500",
              padding: "0.25rem 0.75rem",
              backgroundColor: "rgba(220, 38, 38, 0.2)",
              borderRadius: "20px",
              border: `1px solid ${colors.primary}`,
            }}
          >
            EMPLOYEE MANAGEMENT
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <button
            onClick={() => setShowAddForm(true)}
            style={{
              backgroundColor: colors.primary,
              color: colors.text,
              padding: "0.75rem 1.5rem",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.9rem",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = colors.primaryDark)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = colors.primary)
            }
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Add Employee
          </button>

          <button
            onClick={handleProfile}
            style={{
              backgroundColor: "transparent",
              color: colors.primary,
              width: "48px",
              height: "48px",
              borderRadius: "8px",
              border: `1px solid ${colors.primary}`,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.primary;
              e.currentTarget.style.color = colors.text;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = colors.primary;
            }}
            title="Admin Profile"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div
        style={{
          padding: "2rem",
          minHeight: "calc(100vh - 100px)",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
          }}
        >
          {/* Header Section */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "2rem",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "2rem",
                  fontWeight: "700",
                  color: colors.primary,
                  margin: "0 0 0.5rem 0",
                }}
              >
                Employee Management
              </h2>
              <p
                style={{
                  color: colors.textSecondary,
                  margin: 0,
                  fontSize: "1rem",
                }}
              >
                Manage staff, SIN numbers, and work schedules
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                backgroundColor: colors.surface,
                padding: "1.5rem",
                borderRadius: "12px",
                border: `1px solid ${colors.primary}`,
                textAlign: "center",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow =
                  "0 10px 30px rgba(0, 0, 0, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "800",
                  color: colors.primary,
                }}
              >
                {employees.length}
              </div>
              <div
                style={{
                  fontSize: "0.9rem",
                  color: colors.textSecondary,
                  fontWeight: "600",
                }}
              >
                Total Employees
              </div>
            </div>

            <div
              style={{
                backgroundColor: colors.surface,
                padding: "1.5rem",
                borderRadius: "12px",
                border: `1px solid ${colors.success}`,
                textAlign: "center",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow =
                  "0 10px 30px rgba(0, 0, 0, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "800",
                  color: colors.success,
                }}
              >
                {employees.filter((e) => e.status === "Active").length}
              </div>
              <div
                style={{
                  fontSize: "0.9rem",
                  color: colors.textSecondary,
                  fontWeight: "600",
                }}
              >
                Active
              </div>
            </div>

            <div
              style={{
                backgroundColor: colors.surface,
                padding: "1.5rem",
                borderRadius: "12px",
                border: `1px solid ${colors.warning}`,
                textAlign: "center",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow =
                  "0 10px 30px rgba(0, 0, 0, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "800",
                  color: colors.warning,
                }}
              >
                {employees.filter((e) => e.status === "On Leave").length}
              </div>
              <div
                style={{
                  fontSize: "0.9rem",
                  color: colors.textSecondary,
                  fontWeight: "600",
                }}
              >
                On Leave
              </div>
            </div>

            <div
              style={{
                backgroundColor: colors.surface,
                padding: "1.5rem",
                borderRadius: "12px",
                border: `1px solid ${colors.info}`,
                textAlign: "center",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow =
                  "0 10px 30px rgba(0, 0, 0, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "800",
                  color: colors.info,
                }}
              >
                {employees.filter((e) => e.sin).length}
              </div>
              <div
                style={{
                  fontSize: "0.9rem",
                  color: colors.textSecondary,
                  fontWeight: "600",
                }}
              >
                SIN Registered
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginBottom: "2rem",
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: "1", minWidth: "300px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: colors.surface,
                  padding: "0.75rem 1rem",
                  borderRadius: "8px",
                  border: `1px solid ${colors.border}`,
                  transition: "all 0.2s ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = colors.primary;
                  e.currentTarget.style.backgroundColor = colors.surfaceLight;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = colors.border;
                  e.currentTarget.style.backgroundColor = colors.surface;
                }}
              >
                <input
                  type="text"
                  placeholder="Search employees by name, position, email, or SIN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: "100%",
                    backgroundColor: "transparent",
                    border: "none",
                    color: colors.text,
                    outline: "none",
                    fontSize: "0.9rem",
                  }}
                />
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ color: colors.primary }}
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="8"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="m21 21-4.35-4.35"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
            <div style={{ width: "200px" }}>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.border}`,
                  borderRadius: "8px",
                  color: colors.text,
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  transition: "all 0.2s ease",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.primary;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.border;
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
            <div
              style={{
                backgroundColor: colors.surface,
                padding: "2rem",
                borderRadius: "12px",
                border: `1px solid ${colors.primary}`,
                marginBottom: "2rem",
                backdropFilter: "blur(10px)",
              }}
            >
              <h3
                style={{
                  color: colors.primary,
                  marginBottom: "1.5rem",
                  fontSize: "1.3rem",
                  fontWeight: "700",
                }}
              >
                Add New Employee
              </h3>

              {/* Error Message */}
              {error && (
                <div
                  style={{
                    backgroundColor: "rgba(239, 68, 68, 0.2)",
                    border: `1px solid ${colors.error}`,
                    color: colors.error,
                    padding: "1rem",
                    borderRadius: "8px",
                    marginBottom: "1.5rem",
                    fontSize: "0.9rem",
                  }}
                >
                  <strong>Error:</strong> {error}
                </div>
              )}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "1.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: colors.text,
                      fontWeight: "600",
                      fontSize: "0.9rem",
                    }}
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={newEmployee.name}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, name: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: `1px solid ${colors.border}`,
                      borderRadius: "8px",
                      color: colors.text,
                      fontSize: "0.9rem",
                    }}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: colors.text,
                      fontWeight: "600",
                      fontSize: "0.9rem",
                    }}
                  >
                    Position *
                  </label>
                  <input
                    type="text"
                    value={newEmployee.position}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        position: e.target.value,
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: `1px solid ${colors.border}`,
                      borderRadius: "8px",
                      color: colors.text,
                      fontSize: "0.9rem",
                    }}
                    placeholder="Enter position"
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: colors.text,
                      fontWeight: "600",
                      fontSize: "0.9rem",
                    }}
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, email: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: `1px solid ${colors.border}`,
                      borderRadius: "8px",
                      color: colors.text,
                      fontSize: "0.9rem",
                    }}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: colors.text,
                      fontWeight: "600",
                      fontSize: "0.9rem",
                    }}
                  >
                    Phone
                  </label>
                  <input
                    type="text"
                    value={newEmployee.phone}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, phone: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: `1px solid ${colors.border}`,
                      borderRadius: "8px",
                      color: colors.text,
                      fontSize: "0.9rem",
                    }}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: colors.text,
                      fontWeight: "600",
                      fontSize: "0.9rem",
                    }}
                  >
                    Social Insurance Number
                  </label>
                  <input
                    type="text"
                    value={newEmployee.sin}
                    onChange={(e) => handleSINChange(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: `1px solid ${colors.border}`,
                      borderRadius: "8px",
                      color: colors.text,
                      fontSize: "0.9rem",
                      fontFamily: "monospace",
                    }}
                    placeholder="123-456-789"
                    maxLength={11}
                  />
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: colors.textMuted,
                      marginTop: "0.25rem",
                    }}
                  >
                    Optional - Format: XXX-XXX-XXX (9 digits)
                  </div>
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: colors.text,
                      fontWeight: "600",
                      fontSize: "0.9rem",
                    }}
                  >
                    Department
                  </label>
                  <select
                    value={newEmployee.department}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        department: e.target.value,
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: `1px solid ${colors.border}`,
                      borderRadius: "8px",
                      color: colors.text,
                      fontSize: "0.9rem",
                    }}
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: colors.text,
                      fontWeight: "600",
                      fontSize: "0.9rem",
                    }}
                  >
                    Salary
                  </label>
                  <input
                    type="number"
                    value={newEmployee.salary}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, salary: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: `1px solid ${colors.border}`,
                      borderRadius: "8px",
                      color: colors.text,
                      fontSize: "0.9rem",
                    }}
                    placeholder="Enter salary"
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: colors.text,
                      fontWeight: "600",
                      fontSize: "0.9rem",
                    }}
                  >
                    Hire Date
                  </label>
                  <input
                    type="date"
                    value={newEmployee.hire_date}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        hire_date: e.target.value,
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: `1px solid ${colors.border}`,
                      borderRadius: "8px",
                      color: colors.text,
                      fontSize: "0.9rem",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: colors.text,
                      fontWeight: "600",
                      fontSize: "0.9rem",
                    }}
                  >
                    Status
                  </label>
                  <select
                    value={newEmployee.status}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        status: e.target.value as any,
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: `1px solid ${colors.border}`,
                      borderRadius: "8px",
                      color: colors.text,
                      fontSize: "0.9rem",
                    }}
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Terminated">Terminated</option>
                  </select>
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: colors.text,
                      fontWeight: "600",
                      fontSize: "0.9rem",
                    }}
                  >
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={newEmployee.image_url}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        image_url: e.target.value,
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: `1px solid ${colors.border}`,
                      borderRadius: "8px",
                      color: colors.text,
                      fontSize: "0.9rem",
                    }}
                    placeholder="Enter image URL"
                  />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: colors.text,
                      fontWeight: "600",
                      fontSize: "0.9rem",
                    }}
                  >
                    Address
                  </label>
                  <textarea
                    value={newEmployee.address}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        address: e.target.value,
                      })
                    }
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: `1px solid ${colors.border}`,
                      borderRadius: "8px",
                      color: colors.text,
                      fontSize: "0.9rem",
                      resize: "vertical",
                    }}
                    placeholder="Enter address"
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setError(null);
                  }}
                  style={{
                    backgroundColor: "transparent",
                    color: colors.primary,
                    border: `1px solid ${colors.primary}`,
                    padding: "0.75rem 1.5rem",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primary;
                    e.currentTarget.style.color = colors.text;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = colors.primary;
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEmployee}
                  style={{
                    backgroundColor: colors.primary,
                    color: colors.text,
                    padding: "0.75rem 1.5rem",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    transition: "background-color 0.2s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = colors.primaryDark)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = colors.primary)
                  }
                >
                  Add Employee
                </button>
              </div>
            </div>
          )}

          {/* Rest of the component remains the same... */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "1.5rem",
              marginBottom: "2rem",
            }}
          >
            {filteredEmployees.map((employee) => (
              <div
                key={employee.id}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: "12px",
                  padding: "1.5rem",
                  border: `1px solid ${colors.border}`,
                  transition: "all 0.3s ease",
                  position: "relative",
                  backdropFilter: "blur(10px)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.borderColor = colors.primary;
                  e.currentTarget.style.boxShadow =
                    "0 10px 30px rgba(0, 0, 0, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = colors.border;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <img
                    src={
                      employee.image_url ||
                      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80"
                    }
                    alt={employee.name}
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginRight: "1rem",
                      border: `2px solid ${colors.primary}`,
                    }}
                  />
                  <div>
                    <h3
                      style={{
                        margin: "0 0 0.5rem 0",
                        color: colors.primary,
                        fontSize: "1.1rem",
                        fontWeight: "700",
                      }}
                    >
                      {employee.name}
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        color: colors.textSecondary,
                        fontSize: "0.9rem",
                        fontWeight: "500",
                      }}
                    >
                      {employee.position}
                    </p>
                    {employee.department && (
                      <div
                        style={{
                          display: "inline-block",
                          backgroundColor: "rgba(220, 38, 38, 0.2)",
                          color: colors.primary,
                          padding: "0.25rem 0.5rem",
                          borderRadius: "12px",
                          fontSize: "0.7rem",
                          marginTop: "0.25rem",
                          fontWeight: "600",
                          border: `1px solid ${colors.primary}`,
                        }}
                      >
                        {employee.department}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "0.5rem",
                      fontSize: "0.9rem",
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ color: colors.primary, marginRight: "0.5rem" }}
                    >
                      <path
                        d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6z"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="m22 6-10 7L2 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span style={{ color: colors.textSecondary }}>
                      {employee.email}
                    </span>
                  </div>
                  {employee.phone && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "0.5rem",
                        fontSize: "0.9rem",
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ color: colors.primary, marginRight: "0.5rem" }}
                      >
                        <path
                          d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span style={{ color: colors.textSecondary }}>
                        {employee.phone}
                      </span>
                    </div>
                  )}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "0.5rem",
                      fontSize: "0.9rem",
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ color: colors.primary, marginRight: "0.5rem" }}
                    >
                      <rect
                        x="3"
                        y="4"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <line
                        x1="16"
                        y1="2"
                        x2="16"
                        y2="6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <line
                        x1="8"
                        y1="2"
                        x2="8"
                        y2="6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <line
                        x1="3"
                        y1="10"
                        x2="21"
                        y2="10"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span style={{ color: colors.textSecondary }}>
                      Hired: {formatDate(employee.hire_date)}
                    </span>
                  </div>
                  {employee.salary && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "0.5rem",
                        fontSize: "0.9rem",
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ color: colors.primary, marginRight: "0.5rem" }}
                      >
                        <path
                          d="M12 2v20M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span style={{ color: colors.textSecondary }}>
                        Salary: ${employee.salary}
                      </span>
                    </div>
                  )}
                  {employee.sin && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "0.5rem",
                        fontSize: "0.9rem",
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ color: colors.primary, marginRight: "0.5rem" }}
                      >
                        <path
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span
                        style={{
                          color: colors.textSecondary,
                          fontFamily: "monospace",
                        }}
                      >
                        SIN: {formatSIN(employee.sin)}
                      </span>
                    </div>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: "1rem",
                    borderTop: `1px solid ${colors.border}`,
                  }}
                >
                  <span
                    style={{
                      padding: "0.25rem 0.75rem",
                      borderRadius: "20px",
                      fontSize: "0.8rem",
                      fontWeight: "600",
                      backgroundColor: getStatusColor(employee.status),
                      color: colors.background,
                    }}
                  >
                    {employee.status}
                  </span>

                  <button
                    onClick={() =>
                      handleDeleteEmployee(employee.id, employee.name)
                    }
                    style={{
                      backgroundColor: "transparent",
                      color: colors.error,
                      border: `1px solid ${colors.error}`,
                      padding: "0.5rem 1rem",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                      fontWeight: "600",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.error;
                      e.currentTarget.style.color = colors.background;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
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
            <div
              style={{
                textAlign: "center",
                padding: "3rem",
                color: colors.textSecondary,
                backgroundColor: colors.surface,
                borderRadius: "12px",
                border: `1px solid ${colors.border}`,
                backdropFilter: "blur(10px)",
              }}
            >
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  color: colors.primary,
                  marginBottom: "1rem",
                  opacity: 0.5,
                }}
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <line
                  x1="8"
                  y1="8"
                  x2="16"
                  y2="16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="16"
                  y1="8"
                  x2="8"
                  y2="16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <h3
                style={{
                  color: colors.primary,
                  marginBottom: "0.5rem",
                  fontSize: "1.3rem",
                }}
              >
                No employees found
              </h3>
              <p style={{ margin: 0 }}>
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: "2rem",
            }}
          >
            <button
              onClick={handleBackToDashboard}
              style={{
                backgroundColor: "transparent",
                color: colors.primary,
                border: `1px solid ${colors.primary}`,
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "1rem",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.primary;
                e.currentTarget.style.color = colors.text;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = colors.primary;
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 12H5M12 19l-7-7 7-7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default AdminEmployees;

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalServices: number;
  firstService: string;
  lastService: string;
  appointments: Appointment[];
}

interface Appointment {
  id: string;
  preferred_date: string;
  preferred_time: string;
  service_type: string;
  vehicle_type: string;
  status: string;
  message?: string;
}

const AdminCustomers = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "frequent" | "new">("all");

  // Color scheme - Black and Red theme
  const colors = {
    primary: "#FF8C00",
    primaryLight: "#FFA500",
    primaryDark: "#FF7F00",
    background: "#000000",
    surface: "#0a0a0a",
    surfaceLight: "#171717",
    surfaceDark: "#262626",
    text: "#ffffff",
    textSecondary: "#d4d4d4",
    textMuted: "#a3a3a3",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Filter customers based on search query and active tab
  useEffect(() => {
    let filtered = customers;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (customer) =>
          customer.name.toLowerCase().includes(query) ||
          customer.email.toLowerCase().includes(query) ||
          customer.phone.includes(query)
      );
    }

    // Apply tab filter
    switch (activeTab) {
      case "frequent":
        filtered = filtered.filter((customer) => customer.totalServices >= 3);
        break;
      case "new":
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        filtered = filtered.filter(
          (customer) => new Date(customer.firstService) >= thirtyDaysAgo
        );
        break;
      default:
        // 'all' - no additional filtering
        break;
    }

    setFilteredCustomers(filtered);
  }, [searchQuery, activeTab, customers]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);

      // Fetch all appointments from Supabase
      const { data: appointments, error } = await supabase
        .from("appointments")
        .select("*")
        .order("preferred_date", { ascending: false });

      if (error) {
        console.error("Error fetching appointments:", error);
        return;
      }

      // Group appointments by customer (using email as unique identifier)
      const customerMap = new Map();

      appointments?.forEach((appointment) => {
        const email = appointment.email;

        if (!customerMap.has(email)) {
          customerMap.set(email, {
            id: appointment.id, // Use first appointment id as customer id
            name: appointment.name,
            email: appointment.email,
            phone: appointment.phone,
            totalServices: 0,
            appointments: [],
            firstService: appointment.preferred_date,
            lastService: appointment.preferred_date,
          });
        }

        const customer = customerMap.get(email);
        customer.appointments.push(appointment);
        customer.totalServices++;

        // Update first and last service dates
        if (
          new Date(appointment.preferred_date) < new Date(customer.firstService)
        ) {
          customer.firstService = appointment.preferred_date;
        }
        if (
          new Date(appointment.preferred_date) > new Date(customer.lastService)
        ) {
          customer.lastService = appointment.preferred_date;
        }
      });

      // Convert map to array and sort by last service date (newest first)
      const customersArray = Array.from(customerMap.values()).sort(
        (a, b) =>
          new Date(b.lastService).getTime() - new Date(a.lastService).getTime()
      );

      setCustomers(customersArray);
      setFilteredCustomers(customersArray);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    router.push("/AdminHome");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${period}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return colors.success;
      case "pending":
        return colors.warning;
      case "cancelled":
        return colors.error;
      default:
        return colors.info;
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#064e3b";
      case "pending":
        return "#78350f";
      case "cancelled":
        return "#7f1d1d";
      default:
        return "#1e3a8a";
    }
  };

  const getLoyaltyLevel = (serviceCount: number) => {
    if (serviceCount >= 10)
      return { level: "VIP", color: "#c4b5fd", bgColor: "#4c1d95" };
    if (serviceCount >= 5)
      return { level: "Regular", color: "#93c5fd", bgColor: "#1e3a8a" };
    if (serviceCount >= 2)
      return { level: "Returning", color: "#6ee7b7", bgColor: "#064e3b" };
    return { level: "New", color: "#d4d4d4", bgColor: "#404040" };
  };

  if (loading) {
    return (
      <div
        style={{
          background: colors.background,
          minHeight: "100vh",
          color: colors.text,
          fontFamily: "Inter, sans-serif",
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
              border: `3px solid ${colors.surfaceLight}`,
              borderTop: `3px solid ${colors.primary}`,
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 1rem",
            }}
          />
          <p style={{ color: colors.primary, fontSize: "1.1rem" }}>
            Loading Customers...
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
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: "1.5rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.surfaceDark}`,
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <h1
            style={{
              fontSize: "1.8rem",
              fontWeight: "800",
              color: colors.primary,
              margin: 0,
              cursor: "pointer",
            }}
            onClick={handleBackToDashboard}
          >
            SUNNY AUTO
          </h1>
          <div
            style={{
              color: colors.textSecondary,
              fontSize: "0.9rem",
              fontWeight: "500",
              padding: "0.25rem 0.75rem",
              backgroundColor: colors.surfaceLight,
              borderRadius: "20px",
            }}
          >
            CUSTOMER MANAGEMENT
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <form
            onSubmit={handleSearch}
            style={{ display: "flex", alignItems: "center" }}
          >
            <input
              type="text"
              placeholder="Search customers by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "12px",
                backgroundColor: colors.surfaceLight,
                color: colors.text,
                width: "320px",
                outline: "none",
                border: `1px solid ${colors.surfaceDark}`,
                fontSize: "0.9rem",
              }}
            />
          </form>

          <button
            onClick={handleBackToDashboard}
            style={{
              backgroundColor: "transparent",
              color: colors.primary,
              padding: "0.75rem 1.5rem",
              border: `1px solid ${colors.primary}`,
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.9rem",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.primary;
              e.currentTarget.style.color = colors.background;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = colors.primary;
            }}
          >
            Back to Dashboard
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
              alignItems: "flex-end",
              marginBottom: "2rem",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "2rem",
                  fontWeight: "800",
                  color: colors.text,
                  margin: "0 0 0.5rem 0",
                }}
              >
                Customer Database
              </h2>
              <p
                style={{
                  color: colors.textSecondary,
                  margin: 0,
                  fontSize: "1rem",
                }}
              >
                Manage and view customer service history and records
              </p>
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <div
                style={{
                  backgroundColor: colors.surface,
                  padding: "0.75rem 1.5rem",
                  borderRadius: "12px",
                  border: `1px solid ${colors.surfaceDark}`,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "800",
                    color: colors.primary,
                  }}
                >
                  {customers.length}
                </div>
                <div
                  style={{ fontSize: "0.8rem", color: colors.textSecondary }}
                >
                  Total Customers
                </div>
              </div>

              <div
                style={{
                  backgroundColor: colors.surface,
                  padding: "0.75rem 1.5rem",
                  borderRadius: "12px",
                  border: `1px solid ${colors.surfaceDark}`,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "800",
                    color: colors.success,
                  }}
                >
                  {customers.filter((c) => c.totalServices >= 3).length}
                </div>
                <div
                  style={{ fontSize: "0.8rem", color: colors.textSecondary }}
                >
                  Regular Customers
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              marginBottom: "2rem",
              backgroundColor: colors.surface,
              padding: "0.5rem",
              borderRadius: "12px",
              border: `1px solid ${colors.surfaceDark}`,
              width: "fit-content",
            }}
          >
            {[
              { key: "all", label: "All Customers", count: customers.length },
              {
                key: "frequent",
                label: "Regulars",
                count: customers.filter((c) => c.totalServices >= 3).length,
              },
              {
                key: "new",
                label: "New (30 days)",
                count: customers.filter((c) => {
                  const thirtyDaysAgo = new Date();
                  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                  return new Date(c.firstService) >= thirtyDaysAgo;
                }).length,
              },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                style={{
                  backgroundColor:
                    activeTab === tab.key ? colors.primary : "transparent",
                  color:
                    activeTab === tab.key
                      ? colors.background
                      : colors.textSecondary,
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                {tab.label}
                <span
                  style={{
                    backgroundColor:
                      activeTab === tab.key
                        ? colors.background
                        : colors.surfaceDark,
                    color:
                      activeTab === tab.key
                        ? colors.primary
                        : colors.textSecondary,
                    padding: "0.2rem 0.5rem",
                    borderRadius: "12px",
                    fontSize: "0.75rem",
                    fontWeight: "700",
                  }}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Customers Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: selectedCustomer ? "1fr 400px" : "1fr",
              gap: "2rem",
              alignItems: "start",
            }}
          >
            {/* Customers List */}
            <div>
              {filteredCustomers.length === 0 ? (
                <div
                  style={{
                    backgroundColor: colors.surface,
                    padding: "4rem 2rem",
                    borderRadius: "16px",
                    border: `1px solid ${colors.surfaceDark}`,
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>
                    👥
                  </div>
                  <h3 style={{ color: colors.text, marginBottom: "0.5rem" }}>
                    No customers found
                  </h3>
                  <p style={{ color: colors.textSecondary, margin: 0 }}>
                    {searchQuery
                      ? "Try adjusting your search terms"
                      : "No customer data available"}
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gap: "1rem",
                  }}
                >
                  {filteredCustomers.map((customer) => (
                    <div
                      key={customer.email}
                      style={{
                        backgroundColor: colors.surface,
                        padding: "1.5rem",
                        borderRadius: "16px",
                        border: `1px solid ${colors.surfaceDark}`,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onClick={() => setSelectedCustomer(customer)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          colors.surfaceLight;
                        e.currentTarget.style.borderColor = colors.primary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = colors.surface;
                        e.currentTarget.style.borderColor = colors.surfaceDark;
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: "1rem",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "1rem",
                              marginBottom: "0.5rem",
                            }}
                          >
                            <h3
                              style={{
                                color: colors.text,
                                margin: 0,
                                fontSize: "1.2rem",
                                fontWeight: "700",
                              }}
                            >
                              {customer.name}
                            </h3>
                            <span
                              style={{
                                backgroundColor: getLoyaltyLevel(
                                  customer.totalServices
                                ).bgColor,
                                color: getLoyaltyLevel(customer.totalServices)
                                  .color,
                                padding: "0.25rem 0.75rem",
                                borderRadius: "20px",
                                fontSize: "0.75rem",
                                fontWeight: "600",
                              }}
                            >
                              {getLoyaltyLevel(customer.totalServices).level}
                            </span>
                          </div>

                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns:
                                "repeat(auto-fit, minmax(200px, 1fr))",
                              gap: "0.5rem",
                              marginBottom: "1rem",
                            }}
                          >
                            <div
                              style={{
                                color: colors.textSecondary,
                                fontSize: "0.9rem",
                              }}
                            >
                              📧 {customer.email}
                            </div>
                            <div
                              style={{
                                color: colors.textSecondary,
                                fontSize: "0.9rem",
                              }}
                            >
                              📞 {customer.phone || "Not provided"}
                            </div>
                          </div>
                        </div>

                        <div style={{ textAlign: "right" }}>
                          <div
                            style={{
                              fontSize: "2rem",
                              fontWeight: "800",
                              color: colors.primary,
                              lineHeight: "1",
                            }}
                          >
                            {customer.totalServices}
                          </div>
                          <div
                            style={{
                              fontSize: "0.8rem",
                              color: colors.textSecondary,
                              fontWeight: "600",
                            }}
                          >
                            Services
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingTop: "1rem",
                          borderTop: `1px solid ${colors.surfaceDark}`,
                        }}
                      >
                        <div
                          style={{
                            fontSize: "0.8rem",
                            color: colors.textMuted,
                          }}
                        >
                          First service: {formatDate(customer.firstService)}
                        </div>
                        <div
                          style={{
                            fontSize: "0.8rem",
                            color: colors.textMuted,
                          }}
                        >
                          Last service: {formatDate(customer.lastService)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Customer Details Sidebar */}
            {selectedCustomer && (
              <div
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: "16px",
                  border: `1px solid ${colors.surfaceDark}`,
                  padding: "1.5rem",
                  position: "sticky",
                  top: "2rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "1.5rem",
                  }}
                >
                  <h3
                    style={{
                      color: colors.text,
                      margin: 0,
                      fontSize: "1.3rem",
                      fontWeight: "700",
                    }}
                  >
                    Customer Details
                  </h3>
                  <button
                    onClick={() => setSelectedCustomer(null)}
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      color: colors.textMuted,
                      cursor: "pointer",
                      fontSize: "1.2rem",
                      padding: "0.25rem",
                      borderRadius: "4px",
                    }}
                  >
                    ✕
                  </button>
                </div>

                {/* Customer Info */}
                <div style={{ marginBottom: "2rem" }}>
                  <h4
                    style={{
                      color: colors.text,
                      margin: "0 0 1rem 0",
                      fontSize: "1rem",
                      fontWeight: "600",
                    }}
                  >
                    Contact Information
                  </h4>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.75rem",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: colors.textMuted,
                          marginBottom: "0.25rem",
                        }}
                      >
                        Full Name
                      </div>
                      <div style={{ color: colors.text, fontWeight: "500" }}>
                        {selectedCustomer.name}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: colors.textMuted,
                          marginBottom: "0.25rem",
                        }}
                      >
                        Email Address
                      </div>
                      <div style={{ color: colors.text, fontWeight: "500" }}>
                        {selectedCustomer.email}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: colors.textMuted,
                          marginBottom: "0.25rem",
                        }}
                      >
                        Phone Number
                      </div>
                      <div style={{ color: colors.text, fontWeight: "500" }}>
                        {selectedCustomer.phone || "Not provided"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Service Statistics */}
                <div style={{ marginBottom: "2rem" }}>
                  <h4
                    style={{
                      color: colors.text,
                      margin: "0 0 1rem 0",
                      fontSize: "1rem",
                      fontWeight: "600",
                    }}
                  >
                    Service Statistics
                  </h4>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: "1rem",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: colors.background,
                        padding: "1rem",
                        borderRadius: "8px",
                        border: `1px solid ${colors.surfaceDark}`,
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: "800",
                          color: colors.primary,
                        }}
                      >
                        {selectedCustomer.totalServices}
                      </div>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: colors.textSecondary,
                        }}
                      >
                        Total Services
                      </div>
                    </div>
                    <div
                      style={{
                        backgroundColor: colors.background,
                        padding: "1rem",
                        borderRadius: "8px",
                        border: `1px solid ${colors.surfaceDark}`,
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "1rem",
                          fontWeight: "600",
                          color: getLoyaltyLevel(selectedCustomer.totalServices)
                            .color,
                        }}
                      >
                        {getLoyaltyLevel(selectedCustomer.totalServices).level}
                      </div>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: colors.textSecondary,
                        }}
                      >
                        Loyalty Level
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Services */}
                <div>
                  <h4
                    style={{
                      color: colors.text,
                      margin: "0 0 1rem 0",
                      fontSize: "1rem",
                      fontWeight: "600",
                    }}
                  >
                    Recent Services ({selectedCustomer.appointments.length})
                  </h4>
                  <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                    {selectedCustomer.appointments
                      .sort(
                        (a, b) =>
                          new Date(b.preferred_date).getTime() -
                          new Date(a.preferred_date).getTime()
                      )
                      .map((appointment) => (
                        <div
                          key={appointment.id}
                          style={{
                            backgroundColor: colors.background,
                            padding: "1rem",
                            borderRadius: "8px",
                            border: `1px solid ${colors.surfaceDark}`,
                            marginBottom: "0.75rem",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              marginBottom: "0.5rem",
                            }}
                          >
                            <div
                              style={{ fontWeight: "600", color: colors.text }}
                            >
                              {appointment.service_type}
                            </div>
                            <span
                              style={{
                                backgroundColor: getStatusBgColor(
                                  appointment.status
                                ),
                                color: getStatusColor(appointment.status),
                                padding: "0.2rem 0.5rem",
                                borderRadius: "12px",
                                fontSize: "0.7rem",
                                fontWeight: "600",
                              }}
                            >
                              {appointment.status}
                            </span>
                          </div>
                          <div
                            style={{
                              fontSize: "0.8rem",
                              color: colors.textSecondary,
                              marginBottom: "0.25rem",
                            }}
                          >
                            {appointment.vehicle_type}
                          </div>
                          <div
                            style={{
                              fontSize: "0.8rem",
                              color: colors.textMuted,
                            }}
                          >
                            {formatDate(appointment.preferred_date)} •{" "}
                            {formatTime(appointment.preferred_time)}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
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

export default AdminCustomers;

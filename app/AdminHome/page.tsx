"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// Define types for our appointment data
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
}

const AdminHome = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [notificationsCount, setNotificationsCount] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    Appointment[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

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

  // Fetch appointments from Supabase
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // 1000ms = 1 second

    const fetchAppointments = async () => {
      try {
        setIsLoading(true);

        const { data: appointmentsData, error } = await supabase
          .from("appointments")
          .select("*")
          .order("preferred_date", { ascending: true })
          .order("preferred_time", { ascending: true });

        if (error) {
          console.error("Error fetching appointments:", error);
          // Fallback to localStorage if Supabase fails
          const storedAppointments = localStorage.getItem("appointments");
          if (storedAppointments) {
            const parsedAppointments = JSON.parse(storedAppointments);
            setAppointments(parsedAppointments);
            setFilteredAppointments(parsedAppointments);
          }
        } else {
          console.log("Fetched appointments from Supabase:", appointmentsData);
          setAppointments(appointmentsData || []);
          setFilteredAppointments(appointmentsData || []);
        }
      } catch (error) {
        console.error("Error loading appointments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();

    // Set up real-time subscription for appointments for any changes in supabase
    const subscription = supabase
      .channel("appointments-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "appointments",
        },
        () => {
          fetchAppointments(); // Refresh appointments when changes occur
        }
      )
      .subscribe();

    // Cleanup function when component is not in the browser anymore
    return () => {
      clearInterval(timer);
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Filter appointments based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredAppointments(appointments);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = appointments.filter(
        (appt) =>
          appt.name.toLowerCase().includes(query) ||
          appt.email.toLowerCase().includes(query) ||
          appt.phone.includes(query) ||
          appt.vehicle_type.toLowerCase().includes(query) ||
          appt.service_type.toLowerCase().includes(query) ||
          appt.preferred_date.includes(query) ||
          appt.status.toLowerCase().includes(query)
      );
      setFilteredAppointments(filtered);
    }
  }, [searchQuery, appointments]);

  // Navigation handlers
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      router.push("/");
    }
  };

  const handleProfile = () => router.push("/Adminprofile");
  const handleInventory = () => router.push("/AdminInventory");
  const handleAdminAppointments = () => router.push("/AdminAppointment");
  const handleEmployees = () => router.push("/AdminEmployees");
  const handleCustomers = () => router.push("/AC");
  const handleReports = () => router.push("/AdminReports");
  const handleFinance = () => router.push("/AdminServices");
  const handleNotifications = () => router.push("/AdminNotification");
  const handleSettings = () => router.push("/UserProfSettings");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // Get today's appointments
  const getTodaysAppointments = () => {
    const today = new Date().toISOString().split("T")[0];
    return appointments.filter((appt) => appt.preferred_date === today);
  };

  // Get appointments for the next 7 days
  const getWeekAppointments = () => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    return appointments
      .filter((appt) => {
        const apptDate = new Date(appt.preferred_date);
        return (
          apptDate >= today &&
          apptDate <= nextWeek &&
          appt.status !== "completed"
        );
      })
      .sort(
        (a, b) =>
          new Date(a.preferred_date).getTime() -
          new Date(b.preferred_date).getTime()
      );
  };

  // Get real-time appointments (today's appointments)
  const getRealtimeAppointments = () => {
    const today = new Date().toISOString().split("T")[0];
    return appointments
      .filter(
        (appt) => appt.preferred_date === today && appt.status !== "completed"
      )
      .sort((a, b) => a.preferred_time.localeCompare(b.preferred_time))
      .slice(0, 6); // Limit to 6 appointments
  };

  // Format date for display
  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // Format time for display
  const formatDisplayTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;

    return `${formattedHour}:${minutes} ${period}`;
  };

  // Get status color
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

  // Get status background color (lighter version)
  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "completed":
        return "rgba(16, 185, 129, 0.2)";
      case "pending":
        return "rgba(245, 158, 11, 0.2)";
      case "cancelled":
        return "rgba(239, 68, 68, 0.2)";
      default:
        return "rgba(59, 130, 246, 0.2)";
    }
  };

  // Get today's stats
  const todaysAppointments = getTodaysAppointments();
  const realtimeAppointments = getRealtimeAppointments();
  const weekAppointments = getWeekAppointments();
  const completedServices = appointments.filter(
    (appt) => appt.status === "completed"
  ).length;
  const newAppointmentsCount = todaysAppointments.length;
  const pendingAppointments = appointments.filter(
    (appt) => appt.status === "pending"
  ).length;

  // Dashboard cards data
  const dashboardCards = [
    {
      title: "Inventory",
      description: "Manage parts, tools, and stock levels",
      icon: "📦",
      onClick: handleInventory,
    },
    {
      title: "Appointments",
      description: "View and manage service bookings",
      icon: "📅",
      onClick: handleAdminAppointments,
    },
    {
      title: "Employees",
      description: "Manage staff and work schedules",
      icon: "👥",
      onClick: handleEmployees,
    },
    {
      title: "Customers",
      description: "Manage customer database and history",
      icon: "👤",
      onClick: handleCustomers,
    },
    {
      title: "Reports",
      description: "Generate business reports and insights",
      icon: "📊",
      onClick: handleReports,
    },
    {
      title: "Services",
      description: "Available automotive services and pricing",
      icon: "💰",
      onClick: handleFinance,
    },
    {
      title: "Settings",
      description: "Manage admin profile, password, and security",
      icon: "⚙️",
      onClick: handleSettings,
    },
  ];

  if (isLoading) {
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
            Loading Dashboard...
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
            onClick={() => router.push("/AdminHome")}
          >
            <span style={{ color: "#FF8C00" }}>Sunny</span>
            <span style={{ color: "#ffffff" }}>Auto</span>
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
            ADMIN PANEL
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <form
            onSubmit={handleSearch}
            style={{ display: "flex", alignItems: "center" }}
          >
            <input
              type="text"
              placeholder="Search appointments, customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                color: colors.text,
                width: "280px",
                outline: "none",
                border: `1px solid ${colors.border}`,
                fontSize: "0.9rem",
                transition: "all 0.2s ease",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = colors.primary;
                e.target.style.backgroundColor = "rgba(255, 255, 255, 0.08)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = colors.border;
                e.target.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
              }}
            />
          </form>

          <div style={{ position: "relative" }}>
            <button
              onClick={handleNotifications}
              style={{
                backgroundColor: "transparent",
                color: colors.primary,
                width: "48px",
                height: "48px",
                borderRadius: "8px",
                border: `1px solid ${colors.primary}`,
                cursor: "pointer",
                fontSize: "1.2rem",
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
              title="Notifications"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.73 21a2 2 0 0 1-3.46 0"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {notificationsCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-2px",
                    right: "-2px",
                    backgroundColor: colors.primary,
                    color: colors.text,
                    borderRadius: "50%",
                    width: "18px",
                    height: "18px",
                    fontSize: "0.7rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "600",
                  }}
                >
                  {notificationsCount}
                </span>
              )}
            </button>
          </div>

          <button
            onClick={handleSettings}
            style={{
              backgroundColor: "transparent",
              color: colors.primary,
              width: "48px",
              height: "48px",
              borderRadius: "8px",
              border: `1px solid ${colors.primary}`,
              cursor: "pointer",
              fontSize: "1rem",
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
            title="Settings"
          >
            ⚙️
          </button>

          <button
            onClick={handleProfile}
            style={{
              backgroundColor: colors.primary,
              color: colors.text,
              width: "48px",
              height: "48px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontSize: "1.2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.primaryDark;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.primary;
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

          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "transparent",
              color: colors.primary,
              padding: "0.75rem 1.5rem",
              border: `1px solid ${colors.primary}`,
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
            Logout
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
          {/* Welcome Section */}
          <div
            style={{
              textAlign: "center",
              marginBottom: "3rem",
            }}
          >
            <h2
              style={{
                fontSize: "2.5rem",
                fontWeight: "700",
                color: colors.text,
                margin: "0 0 1rem 0",
              }}
            >
              Welcome to <span style={{ color: "#FF8C00" }}>Sunny Auto</span>{" "}
              Admin
            </h2>
            <p
              style={{
                fontSize: "1.1rem",
                color: colors.textSecondary,
                margin: 0,
                fontWeight: "500",
              }}
            >
              Manage your automotive business with real-time insights and
              control
            </p>
            <div
              style={{
                color: colors.primary,
                fontSize: "1rem",
                fontWeight: "600",
                marginTop: "0.5rem",
              }}
            >
              {currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              • {currentTime.toLocaleTimeString()}
            </div>
          </div>

          {/* Stats Overview - Red Accent Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1.5rem",
              marginBottom: "2.5rem",
            }}
          >
            {[
              {
                label: "Today's Appointments",
                value: newAppointmentsCount,
                color: colors.primary,
                icon: "📅",
                bgColor: colors.surface,
              },
              {
                label: "Completed Services",
                value: completedServices,
                color: colors.success,
                icon: "✅",
                bgColor: colors.surface,
              },
              {
                label: "Pending Appointments",
                value: pendingAppointments,
                color: colors.warning,
                icon: "⏳",
                bgColor: colors.surface,
              },
              {
                label: "Total Revenue",
                value: `$${(completedServices * 149.99).toLocaleString()}`,
                color: colors.info,
                icon: "💰",
                bgColor: colors.surface,
              },
            ].map((stat, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: colors.surface,
                  padding: "2rem",
                  borderRadius: "12px",
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  border: `1px solid ${colors.border}`,
                  backdropFilter: "blur(10px)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.borderColor = stat.color;
                  e.currentTarget.style.boxShadow = `0 10px 30px rgba(0, 0, 0, 0.3)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = colors.border;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    fontSize: "2.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  {stat.icon}
                </div>
                <div
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: "800",
                    color: stat.color,
                    marginBottom: "0.5rem",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    color: colors.textSecondary,
                    fontSize: "0.9rem",
                    fontWeight: "600",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: "2rem",
              alignItems: "start",
            }}
          >
            {/* Left Column - Dashboard Cards & Today's Appointments */}
            <div>
              <h3
                style={{
                  color: colors.primary,
                  marginBottom: "1.5rem",
                  fontSize: "1.5rem",
                  fontWeight: "700",
                }}
              >
                Quick Access
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "1.5rem",
                  marginBottom: "2.5rem",
                }}
              >
                {dashboardCards.map((card, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: colors.surface,
                      padding: "2rem",
                      borderRadius: "12px",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      textAlign: "center",
                      border: `1px solid ${colors.border}`,
                      backdropFilter: "blur(10px)",
                    }}
                    onClick={card.onClick}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        colors.surfaceLight;
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.borderColor = colors.primary;
                      e.currentTarget.style.boxShadow = `0 10px 30px rgba(0, 0, 0, 0.3)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = colors.surface;
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.borderColor = colors.border;
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div
                      style={{
                        fontSize: "3rem",
                        marginBottom: "1rem",
                        color: colors.primary,
                      }}
                    >
                      {card.icon}
                    </div>
                    <h4
                      style={{
                        color: colors.primary,
                        marginBottom: "0.75rem",
                        fontSize: "1.2rem",
                        fontWeight: "700",
                      }}
                    >
                      {card.title}
                    </h4>
                    <p
                      style={{
                        color: colors.textSecondary,
                        lineHeight: "1.5",
                        fontSize: "0.9rem",
                        margin: 0,
                      }}
                    >
                      {card.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Today's Appointments */}
              <div style={{ marginTop: "2.5rem" }}>
                <h3
                  style={{
                    color: colors.primary,
                    marginBottom: "1.5rem",
                    fontSize: "1.5rem",
                    fontWeight: "700",
                  }}
                >
                  Today's Appointments
                </h3>

                <div
                  style={{
                    backgroundColor: colors.surface,
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: `1px solid ${colors.border}`,
                    backdropFilter: "blur(10px)",
                  }}
                >
                  {realtimeAppointments.length > 0 ? (
                    <div>
                      {realtimeAppointments.map((appt, index) => (
                        <div
                          key={`${appt.id || "realtime"}-${appt.preferred_time}-${index}`}
                          style={{
                            padding: "1.5rem",
                            borderBottom:
                              index < realtimeAppointments.length - 1
                                ? `1px solid ${colors.border}`
                                : "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            transition: "background-color 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                              colors.surfaceLight;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              colors.surface;
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
                              <span
                                style={{
                                  fontWeight: "700",
                                  color: colors.text,
                                  fontSize: "1.1rem",
                                }}
                              >
                                {appt.name}
                              </span>
                              <span
                                style={{
                                  backgroundColor: getStatusBgColor(
                                    appt.status
                                  ),
                                  color: getStatusColor(appt.status),
                                  padding: "0.25rem 0.75rem",
                                  borderRadius: "20px",
                                  fontSize: "0.75rem",
                                  fontWeight: "600",
                                  border: `1px solid ${getStatusColor(appt.status)}`,
                                }}
                              >
                                {appt.status.toUpperCase()}
                              </span>
                            </div>
                            <div
                              style={{
                                color: colors.textSecondary,
                                fontSize: "0.9rem",
                              }}
                            >
                              {appt.service_type} • {appt.vehicle_type}
                            </div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div
                              style={{
                                color: colors.primary,
                                fontWeight: "700",
                                fontSize: "1rem",
                              }}
                            >
                              {formatDisplayTime(appt.preferred_time)}
                            </div>
                            <div
                              style={{
                                color: colors.textMuted,
                                fontSize: "0.8rem",
                              }}
                            >
                              Today
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div
                      style={{
                        padding: "3rem",
                        textAlign: "center",
                        color: colors.textSecondary,
                      }}
                    >
                      <div
                        style={{
                          fontSize: "3rem",
                          marginBottom: "1rem",
                          opacity: 0.5,
                        }}
                      >
                        📅
                      </div>
                      <p style={{ margin: 0, fontWeight: "600" }}>
                        No appointments for today
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Week Appointments & Quick Stats */}
            <div>
              <h3
                style={{
                  color: colors.primary,
                  marginBottom: "1.5rem",
                  fontSize: "1.5rem",
                  fontWeight: "700",
                }}
              >
                This Week's Appointments
              </h3>

              <div
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: `1px solid ${colors.border}`,
                  marginBottom: "2rem",
                  backdropFilter: "blur(10px)",
                }}
              >
                {weekAppointments.length > 0 ? (
                  <div style={{ maxHeight: "500px", overflowY: "auto" }}>
                    {weekAppointments.map((appt, index) => (
                      <div
                        key={`${appt.id || "weekly"}-${appt.preferred_date}-${index}`}
                        style={{
                          padding: "1.5rem",
                          borderBottom:
                            index < weekAppointments.length - 1
                              ? `1px solid ${colors.border}`
                              : "none",
                          transition: "background-color 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            colors.surfaceLight;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            colors.surface;
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "1rem",
                            marginBottom: "0.75rem",
                          }}
                        >
                          <div
                            style={{
                              backgroundColor: colors.primary,
                              color: colors.text,
                              width: "40px",
                              height: "40px",
                              borderRadius: "8px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: "700",
                              fontSize: "0.9rem",
                              flexShrink: 0,
                            }}
                          >
                            {new Date(appt.preferred_date).getDate()}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                fontWeight: "700",
                                color: colors.text,
                                marginBottom: "0.25rem",
                              }}
                            >
                              {appt.name}
                            </div>
                            <div
                              style={{
                                color: colors.textSecondary,
                                fontSize: "0.85rem",
                                marginBottom: "0.5rem",
                              }}
                            >
                              {appt.service_type}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                flexWrap: "wrap",
                              }}
                            >
                              <span
                                style={{
                                  backgroundColor: getStatusBgColor(
                                    appt.status
                                  ),
                                  color: getStatusColor(appt.status),
                                  padding: "0.2rem 0.6rem",
                                  borderRadius: "12px",
                                  fontSize: "0.75rem",
                                  fontWeight: "600",
                                  border: `1px solid ${getStatusColor(appt.status)}`,
                                }}
                              >
                                {appt.status}
                              </span>
                              <span
                                style={{
                                  color: colors.primary,
                                  fontSize: "0.8rem",
                                  fontWeight: "600",
                                }}
                              >
                                {formatDisplayTime(appt.preferred_time)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            color: colors.textMuted,
                            fontSize: "0.8rem",
                            paddingLeft: "3.5rem",
                          }}
                        >
                          {appt.vehicle_type} •{" "}
                          {formatDisplayDate(appt.preferred_date)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      padding: "3rem",
                      textAlign: "center",
                      color: colors.textSecondary,
                    }}
                  >
                    <div
                      style={{
                        fontSize: "3rem",
                        marginBottom: "1rem",
                        opacity: 0.5,
                      }}
                    >
                      ⏰
                    </div>
                    <p style={{ margin: 0, fontWeight: "600" }}>
                      No appointments this week
                    </p>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div
                style={{
                  backgroundColor: colors.surface,
                  padding: "1.5rem",
                  borderRadius: "12px",
                  border: `1px solid ${colors.border}`,
                  backdropFilter: "blur(10px)",
                }}
              >
                <h4
                  style={{
                    color: colors.primary,
                    marginBottom: "1rem",
                    fontSize: "1.2rem",
                    fontWeight: "700",
                  }}
                >
                  Quick Stats
                </h4>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  {[
                    {
                      label: "Total Appointments",
                      value: appointments.length,
                      color: colors.primary,
                    },
                    {
                      label: "Service Completion Rate",
                      value: `${appointments.length > 0 ? Math.round((completedServices / appointments.length) * 100) : 0}%`,
                      color: colors.success,
                    },
                    {
                      label: "Average Service Time",
                      value: "45min",
                      color: colors.info,
                    },
                    {
                      label: "Customer Satisfaction",
                      value: "98%",
                      color: colors.warning,
                    },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0.75rem",
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        borderRadius: "8px",
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      <span
                        style={{
                          color: colors.textSecondary,
                          fontSize: "0.9rem",
                        }}
                      >
                        {stat.label}
                      </span>
                      <span
                        style={{
                          color: stat.color,
                          fontWeight: "700",
                          fontSize: "0.9rem",
                        }}
                      >
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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

export default AdminHome;

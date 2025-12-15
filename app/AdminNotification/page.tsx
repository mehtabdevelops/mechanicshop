"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  created_at: string;
}

interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  is_read: boolean;
  created_at: string;
  expires_at: string | null;
}

const AdminNotifications = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [notificationForm, setNotificationForm] = useState({
    title: "",
    message: "",
    type: "info" as "info" | "warning" | "success" | "error",
    expires_in_days: 7,
  });

  // Color scheme - Red and Black theme
  const colors = {
    primary: "#FF8C00",
    primaryLight: "#FFA500",
    primaryDark: "#FF7F00",
    background: "#0a0a0a",
    surface: "rgba(255, 255, 255, 0.05)",
    surfaceLight: "rgba(255, 255, 255, 0.08)",
    text: "#ffffff",
    textSecondary: "rgba(255, 255, 255, 0.7)",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",
    border: "rgba(255, 255, 255, 0.1)",
    borderLight: "rgba(255, 255, 255, 0.2)",
  };

  // Fetch users and notifications
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch all users from profiles table
      const { data: usersData, error: usersError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (usersError) throw usersError;

      // Fetch all notifications
      const { data: notificationsData, error: notificationsError } =
        await supabase
          .from("notifications")
          .select("*")
          .order("created_at", { ascending: false });

      if (notificationsError) throw notificationsError;

      setUsers(usersData || []);
      setNotifications(notificationsData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error loading data");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    router.push("/AdminHome");
  };

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to logout?")) return;

    const { error } = await supabase.auth.signOut();
    if (error) {
      alert("Logout failed: " + error.message);
      return;
    }

    sessionStorage.removeItem("userData");
    localStorage.removeItem("currentUser");
    sessionStorage.removeItem("currentUser");

    router.push("/");
  };

  const handleSendNotification = async () => {
    if (!notificationForm.title || !notificationForm.message) {
      alert("Please fill in title and message");
      return;
    }

    if (selectedUsers.length === 0) {
      alert("Please select at least one user");
      return;
    }

    try {
      const notificationsToInsert = selectedUsers.map((userId) => ({
        user_id: userId,
        title: notificationForm.title,
        message: notificationForm.message,
        type: notificationForm.type,
        expires_at: new Date(
          Date.now() + notificationForm.expires_in_days * 24 * 60 * 60 * 1000
        ).toISOString(),
      }));

      const { error } = await supabase
        .from("notifications")
        .insert(notificationsToInsert);

      if (error) throw error;

      // Refresh notifications
      await fetchData();

      // Reset form
      setNotificationForm({
        title: "",
        message: "",
        type: "info",
        expires_in_days: 7,
      });
      setSelectedUsers([]);
      setShowSendModal(false);

      alert(
        `Notification sent to ${selectedUsers.length} user(s) successfully!`
      );
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("Error sending notification");
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      try {
        const { error } = await supabase
          .from("notifications")
          .delete()
          .eq("id", notificationId);

        if (error) throw error;

        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
        alert("Notification deleted successfully!");
      } catch (error) {
        console.error("Error deleting notification:", error);
        alert("Error deleting notification");
      }
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    setSelectedUsers(users.map((user) => user.id));
  };

  const deselectAllUsers = () => {
    setSelectedUsers([]);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return colors.success;
      case "warning":
        return colors.warning;
      case "error":
        return colors.error;
      case "info":
      default:
        return colors.info;
    }
  };

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.full_name || user.email : "Unknown User";
  };

  if (loading) {
    return (
      <div
        style={{
          background: colors.background,
          minHeight: "100vh",
          color: colors.text,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
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
            Loading Notifications...
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
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Header */}
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
            NOTIFICATION MANAGEMENT
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <button
            onClick={() => setShowSendModal(true)}
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
            Send Notification
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
                Notification Management
              </h2>
              <p
                style={{
                  color: colors.textSecondary,
                  margin: 0,
                  fontSize: "1rem",
                }}
              >
                Send and manage notifications for users
              </p>
            </div>
          </div>

          {/* Stats Cards */}
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
            >
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "800",
                  color: colors.primary,
                }}
              >
                {users.length}
              </div>
              <div
                style={{
                  fontSize: "0.9rem",
                  color: colors.textSecondary,
                  fontWeight: "600",
                }}
              >
                Total Users
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
            >
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "800",
                  color: colors.success,
                }}
              >
                {notifications.length}
              </div>
              <div
                style={{
                  fontSize: "0.9rem",
                  color: colors.textSecondary,
                  fontWeight: "600",
                }}
              >
                Total Notifications
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
            >
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "800",
                  color: colors.warning,
                }}
              >
                {notifications.filter((n) => !n.is_read).length}
              </div>
              <div
                style={{
                  fontSize: "0.9rem",
                  color: colors.textSecondary,
                  fontWeight: "600",
                }}
              >
                Unread Notifications
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div
            style={{
              backgroundColor: colors.surface,
              borderRadius: "12px",
              border: `1px solid ${colors.border}`,
              overflow: "hidden",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                padding: "1.5rem",
                borderBottom: `1px solid ${colors.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3
                style={{
                  color: colors.primary,
                  margin: 0,
                  fontSize: "1.3rem",
                  fontWeight: "600",
                }}
              >
                Sent Notifications
              </h3>
              <span
                style={{
                  color: colors.textSecondary,
                  fontSize: "0.9rem",
                }}
              >
                {notifications.length} total
              </span>
            </div>

            <div style={{ maxHeight: "600px", overflowY: "auto" }}>
              {notifications.length === 0 ? (
                <div
                  style={{
                    padding: "3rem",
                    textAlign: "center",
                    color: colors.textSecondary,
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
                    <path
                      d="M10 5a2 2 0 1 1 4 0 7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2-3v-3a7 7 0 0 1 4-6z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M9 17v1a3 3 0 0 0 6 0v-1"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  <h4 style={{ color: colors.primary, marginBottom: "0.5rem" }}>
                    No notifications sent yet
                  </h4>
                  <p>Send your first notification to get started</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    style={{
                      padding: "1.5rem",
                      borderBottom: `1px solid ${colors.border}`,
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "0.75rem",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            marginBottom: "0.5rem",
                          }}
                        >
                          <h4
                            style={{
                              color: colors.text,
                              margin: 0,
                              fontSize: "1.1rem",
                              fontWeight: "600",
                            }}
                          >
                            {notification.title}
                          </h4>
                          <span
                            style={{
                              backgroundColor: getTypeColor(notification.type),
                              color: "white",
                              padding: "0.25rem 0.75rem",
                              borderRadius: "12px",
                              fontSize: "0.75rem",
                              fontWeight: "600",
                            }}
                          >
                            {notification.type.toUpperCase()}
                          </span>
                          {!notification.is_read && (
                            <span
                              style={{
                                backgroundColor: colors.primary,
                                color: "white",
                                padding: "0.2rem 0.6rem",
                                borderRadius: "10px",
                                fontSize: "0.7rem",
                                fontWeight: "600",
                              }}
                            >
                              UNREAD
                            </span>
                          )}
                        </div>

                        <p
                          style={{
                            color: colors.textSecondary,
                            margin: "0 0 0.75rem 0",
                            lineHeight: "1.5",
                          }}
                        >
                          {notification.message}
                        </p>

                        <div
                          style={{
                            display: "flex",
                            gap: "1rem",
                            fontSize: "0.85rem",
                            color: colors.textSecondary,
                          }}
                        >
                          <span>
                            To:{" "}
                            <strong>{getUserName(notification.user_id)}</strong>
                          </span>
                          <span>
                            Sent:{" "}
                            {new Date(
                              notification.created_at
                            ).toLocaleDateString()}
                          </span>
                          {notification.expires_at && (
                            <span>
                              Expires:{" "}
                              {new Date(
                                notification.expires_at
                              ).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          handleDeleteNotification(notification.id)
                        }
                        style={{
                          backgroundColor: colors.error,
                          color: colors.text,
                          border: "none",
                          padding: "0.5rem 0.75rem",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: "600",
                          fontSize: "0.8rem",
                          transition: "background-color 0.2s ease",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#dc2626")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = colors.error)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
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

      {/* Send Notification Modal */}
      {showSendModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
        >
          <div
            style={{
              backgroundColor: colors.background,
              padding: "2rem",
              borderRadius: "12px",
              border: `1px solid ${colors.primary}`,
              width: "600px",
              maxWidth: "90%",
              maxHeight: "90vh",
              overflowY: "auto",
              backdropFilter: "blur(10px)",
            }}
          >
            <h2
              style={{
                color: colors.primary,
                marginBottom: "1.5rem",
                textAlign: "center",
                fontSize: "1.3rem",
                fontWeight: "700",
              }}
            >
              Send Notification
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              {/* Notification Details */}
              <div>
                <label
                  style={{
                    display: "block",
                    color: colors.text,
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                    fontSize: "0.9rem",
                  }}
                >
                  Title *
                </label>
                <input
                  type="text"
                  value={notificationForm.title}
                  onChange={(e) =>
                    setNotificationForm((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="Enter notification title"
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
                    color: colors.text,
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                    fontSize: "0.9rem",
                  }}
                >
                  Message *
                </label>
                <textarea
                  value={notificationForm.message}
                  onChange={(e) =>
                    setNotificationForm((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  placeholder="Enter notification message"
                  rows={4}
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
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      color: colors.text,
                      marginBottom: "0.5rem",
                      fontWeight: "600",
                      fontSize: "0.9rem",
                    }}
                  >
                    Type
                  </label>
                  <select
                    value={notificationForm.type}
                    onChange={(e) =>
                      setNotificationForm((prev) => ({
                        ...prev,
                        type: e.target.value as any,
                      }))
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
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      color: colors.text,
                      marginBottom: "0.5rem",
                      fontWeight: "600",
                      fontSize: "0.9rem",
                    }}
                  >
                    Expires In (Days)
                  </label>
                  <input
                    type="number"
                    value={notificationForm.expires_in_days}
                    onChange={(e) =>
                      setNotificationForm((prev) => ({
                        ...prev,
                        expires_in_days: parseInt(e.target.value) || 7,
                      }))
                    }
                    min="1"
                    max="30"
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
              </div>

              {/* User Selection */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <label
                    style={{
                      color: colors.text,
                      fontWeight: "600",
                      fontSize: "0.9rem",
                    }}
                  >
                    Select Users ({selectedUsers.length} selected)
                  </label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={selectAllUsers}
                      style={{
                        backgroundColor: "transparent",
                        color: colors.primary,
                        border: `1px solid ${colors.primary}`,
                        padding: "0.25rem 0.75rem",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "0.8rem",
                        transition: "all 0.2s ease",
                      }}
                    >
                      Select All
                    </button>
                    <button
                      onClick={deselectAllUsers}
                      style={{
                        backgroundColor: "transparent",
                        color: colors.error,
                        border: `1px solid ${colors.error}`,
                        padding: "0.25rem 0.75rem",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "0.8rem",
                        transition: "all 0.2s ease",
                      }}
                    >
                      Deselect All
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    maxHeight: "200px",
                    overflowY: "auto",
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                    borderRadius: "8px",
                    border: `1px solid ${colors.border}`,
                    padding: "0.5rem",
                  }}
                >
                  {users.map((user) => (
                    <label
                      key={user.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.75rem",
                        cursor: "pointer",
                        borderRadius: "6px",
                        transition: "background-color 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "rgba(255, 255, 255, 0.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                        style={{
                          width: "1rem",
                          height: "1rem",
                        }}
                      />
                      <div>
                        <div style={{ color: colors.text, fontWeight: "500" }}>
                          {user.full_name || "Unnamed User"}
                        </div>
                        <div
                          style={{
                            color: colors.textSecondary,
                            fontSize: "0.8rem",
                          }}
                        >
                          {user.email}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                marginTop: "2rem",
              }}
            >
              <button
                onClick={() => setShowSendModal(false)}
                style={{
                  backgroundColor: "transparent",
                  color: colors.primary,
                  border: `1px solid ${colors.primary}`,
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  transition: "all 0.2s ease",
                  flex: 1,
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
                onClick={handleSendNotification}
                style={{
                  backgroundColor: colors.primary,
                  color: colors.text,
                  padding: "0.75rem 1.5rem",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  transition: "background-color 0.2s ease",
                  flex: 1,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = colors.primaryDark)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = colors.primary)
                }
              >
                Send Notification
              </button>
            </div>
          </div>
        </div>
      )}

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

export default AdminNotifications;

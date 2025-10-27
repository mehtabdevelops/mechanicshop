"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  duration_minutes: number;
  image_url: string;
  is_available: boolean;
  created_at: string;
}

const AdminServices = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newService, setNewService] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    duration_minutes: "",
    image_url: "",
    is_available: true,
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

  // Fetch services from Supabase
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching services:", error);
        throw error;
      }

      setServices(data || []);
    } catch (error) {
      console.error("Error loading services:", error);
      alert("Error loading services data");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    router.push("/AdminHome");
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      router.push("/");
    }
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
  };

  const closeEditModal = () => {
    setEditingService(null);
  };

  const saveService = async () => {
    if (editingService) {
      try {
        const { error } = await supabase
          .from("services")
          .update({
            name: editingService.name,
            category: editingService.category,
            description: editingService.description,
            price: editingService.price,
            duration_minutes: editingService.duration_minutes,
            image_url: editingService.image_url,
            is_available: editingService.is_available,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingService.id);

        if (error) throw error;

        // Update local state
        setServices((prev) =>
          prev.map((service) =>
            service.id === editingService.id ? editingService : service
          )
        );
        closeEditModal();
        alert("Service updated successfully!");
      } catch (error) {
        console.error("Error updating service:", error);
        alert("Error updating service");
      }
    }
  };

  const handleDeleteService = async (
    serviceId: string,
    serviceName: string
  ) => {
    if (window.confirm(`Are you sure you want to delete "${serviceName}"?`)) {
      try {
        const { error } = await supabase
          .from("services")
          .delete()
          .eq("id", serviceId);

        if (error) throw error;

        // Update local state
        setServices((prev) =>
          prev.filter((service) => service.id !== serviceId)
        );
        alert("Service deleted successfully!");
      } catch (error) {
        console.error("Error deleting service:", error);
        alert("Error deleting service");
      }
    }
  };

  const handleAddService = async () => {
    // Basic validation
    if (
      !newService.name ||
      !newService.category ||
      !newService.description ||
      !newService.price ||
      !newService.duration_minutes ||
      !newService.image_url
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("services")
        .insert([
          {
            name: newService.name,
            category: newService.category,
            description: newService.description,
            price: parseFloat(newService.price),
            duration_minutes: parseInt(newService.duration_minutes),
            image_url: newService.image_url,
            is_available: newService.is_available,
          },
        ])
        .select();

      if (error) throw error;

      // Update local state
      if (data && data[0]) {
        setServices((prev) => [data[0], ...prev]);
      }

      // Reset form and close modal
      setNewService({
        name: "",
        category: "",
        description: "",
        price: "",
        duration_minutes: "",
        image_url: "",
        is_available: true,
      });
      setShowAddModal(false);
      alert("Service added successfully!");
    } catch (error) {
      console.error("Error adding service:", error);
      alert("Error adding service");
    }
  };

  // Filter services based on search and category
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Categories" ||
      service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter dropdown
  const categories = [
    "All Categories",
    ...new Set(services.map((service) => service.category)),
  ];

  // Sample categories for new services
  const sampleCategories = [
    "Oil Change",
    "Brake Service",
    "Engine Repair",
    "Tire Services",
    "AC Service",
    "Transmission",
    "Electrical",
    "Suspension",
    "Maintenance",
    "Diagnostics",
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
            Loading Services...
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
      {/* Header - Dark with Blue Accent */}
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
            <span style={{ color: "#FF8C00" }}>Sunny</span>
            <span style={{ color: "#ffffff" }}>Auto</span>
          </h1>
          <div
            style={{
              color: colors.primary,
              fontSize: "0.9rem",
              fontWeight: "500",
              padding: "0.25rem 0.75rem",
              backgroundColor: "rgba(59, 130, 246, 0.2)",
              borderRadius: "20px",
              border: `1px solid ${colors.primary}`,
            }}
          >
            SERVICES MANAGEMENT
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <button
            onClick={() => setShowAddModal(true)}
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
            Add New Service
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
                Services Management
              </h2>
              <p
                style={{
                  color: colors.textSecondary,
                  margin: 0,
                  fontSize: "1rem",
                }}
              >
                Manage automotive services and pricing
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: "1rem",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {/* Search Bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  border: `1px solid ${colors.border}`,
                  width: "280px",
                  transition: "all 0.2s ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = colors.primary;
                  e.currentTarget.style.backgroundColor =
                    "rgba(255, 255, 255, 0.08)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = colors.border;
                  e.currentTarget.style.backgroundColor =
                    "rgba(255, 255, 255, 0.05)";
                }}
              >
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    color: colors.text,
                    outline: "none",
                    width: "100%",
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

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  color: colors.text,
                  border: `1px solid ${colors.border}`,
                  borderRadius: "8px",
                  padding: "0.5rem 1rem",
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
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
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
                {services.length}
              </div>
              <div
                style={{
                  fontSize: "0.9rem",
                  color: colors.textSecondary,
                  fontWeight: "600",
                }}
              >
                Total Services
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
                {services.filter((service) => service.is_available).length}
              </div>
              <div
                style={{
                  fontSize: "0.9rem",
                  color: colors.textSecondary,
                  fontWeight: "600",
                }}
              >
                Available Services
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
                {categories.length - 1}
              </div>
              <div
                style={{
                  fontSize: "0.9rem",
                  color: colors.textSecondary,
                  fontWeight: "600",
                }}
              >
                Service Categories
              </div>
            </div>
          </div>

          {/* Services Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "1.5rem",
              marginBottom: "2rem",
            }}
          >
            {filteredServices.map((service) => (
              <div
                key={service.id}
                style={{
                  backgroundColor: colors.surface,
                  padding: "1.5rem",
                  borderRadius: "12px",
                  border: `1px solid ${service.is_available ? colors.primary : colors.error}`,
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                  backdropFilter: "blur(10px)",
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
                    height: "180px",
                    overflow: "hidden",
                    borderRadius: "8px",
                    marginBottom: "1rem",
                    border: `1px solid ${colors.border}`,
                  }}
                  onMouseEnter={(e) => {
                    const img = e.currentTarget.querySelector("img");
                    if (img) img.style.transform = "scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    const img = e.currentTarget.querySelector("img");
                    if (img) img.style.transform = "scale(1)";
                  }}
                >
                  <img
                    src={
                      service.image_url ||
                      "https://via.placeholder.com/300x180/1f2937/6b7280?text=No+Image"
                    }
                    alt={service.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.3s ease",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "inline-block",
                    backgroundColor: service.is_available
                      ? "rgba(59, 130, 246, 0.2)"
                      : "rgba(239, 68, 68, 0.2)",
                    color: service.is_available ? colors.primary : colors.error,
                    padding: "0.25rem 0.75rem",
                    borderRadius: "20px",
                    fontSize: "0.8rem",
                    marginBottom: "0.75rem",
                    fontWeight: "600",
                    border: `1px solid ${service.is_available ? colors.primary : colors.error}`,
                  }}
                >
                  {service.category}
                </div>

                <h3
                  style={{
                    color: colors.primary,
                    marginBottom: "0.75rem",
                    fontSize: "1.1rem",
                    fontWeight: "700",
                  }}
                >
                  {service.name}
                </h3>

                <p
                  style={{
                    color: colors.textSecondary,
                    marginBottom: "1rem",
                    fontSize: "0.9rem",
                    minHeight: "40px",
                    lineHeight: "1.4",
                  }}
                >
                  {service.description}
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      color: colors.success,
                      fontWeight: "700",
                      fontSize: "1.1rem",
                    }}
                  >
                    ${service.price}
                  </div>
                  <div
                    style={{
                      color: colors.textSecondary,
                      fontSize: "0.9rem",
                    }}
                  >
                    {service.duration_minutes} min
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "1rem",
                    paddingTop: "1rem",
                    borderTop: `1px solid ${colors.border}`,
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontWeight: "700",
                        color: service.is_available
                          ? colors.success
                          : colors.error,
                        fontSize: "0.9rem",
                      }}
                    >
                      {service.is_available ? "Available" : "Unavailable"}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(service);
                      }}
                      style={{
                        backgroundColor: colors.primary,
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
                        (e.currentTarget.style.backgroundColor =
                          colors.primaryDark)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = colors.primary)
                      }
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteService(service.id, service.name);
                      }}
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
              </div>
            ))}
          </div>

          {/* Show message if no services match filter */}
          {filteredServices.length === 0 && (
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
                No services found
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

      {/* Edit Service Modal */}
      {editingService && (
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
              width: "500px",
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
              Edit Service
            </h2>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
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
                  Service Name *
                </label>
                <input
                  type="text"
                  value={editingService.name}
                  onChange={(e) =>
                    setEditingService((prev) =>
                      prev ? { ...prev, name: e.target.value } : null
                    )
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
                    color: colors.text,
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                    fontSize: "0.9rem",
                  }}
                >
                  Category *
                </label>
                <select
                  value={editingService.category}
                  onChange={(e) =>
                    setEditingService((prev) =>
                      prev ? { ...prev, category: e.target.value } : null
                    )
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
                  {sampleCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
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
                  Description *
                </label>
                <textarea
                  value={editingService.description}
                  onChange={(e) =>
                    setEditingService((prev) =>
                      prev ? { ...prev, description: e.target.value } : null
                    )
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
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    value={editingService.price}
                    onChange={(e) =>
                      setEditingService((prev) =>
                        prev
                          ? { ...prev, price: parseFloat(e.target.value) || 0 }
                          : null
                      )
                    }
                    min="0"
                    step="0.01"
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
                    Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    value={editingService.duration_minutes}
                    onChange={(e) =>
                      setEditingService((prev) =>
                        prev
                          ? {
                              ...prev,
                              duration_minutes: parseInt(e.target.value) || 0,
                            }
                          : null
                      )
                    }
                    min="1"
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
                  Image URL *
                </label>
                <input
                  type="text"
                  value={editingService.image_url}
                  onChange={(e) =>
                    setEditingService((prev) =>
                      prev ? { ...prev, image_url: e.target.value } : null
                    )
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
                    display: "flex",
                    alignItems: "center",
                    color: colors.text,
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    gap: "0.5rem",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={editingService.is_available}
                    onChange={(e) =>
                      setEditingService((prev) =>
                        prev
                          ? { ...prev, is_available: e.target.checked }
                          : null
                      )
                    }
                    style={{
                      width: "1rem",
                      height: "1rem",
                    }}
                  />
                  Service Available
                </label>
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
                onClick={closeEditModal}
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
                onClick={saveService}
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
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Service Modal */}
      {showAddModal && (
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
              width: "500px",
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
              Add New Service
            </h2>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
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
                  Service Name *
                </label>
                <input
                  type="text"
                  value={newService.name}
                  onChange={(e) =>
                    setNewService((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Enter service name"
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
                  Category *
                </label>
                <select
                  value={newService.category}
                  onChange={(e) =>
                    setNewService((prev) => ({
                      ...prev,
                      category: e.target.value,
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
                  <option value="">Select Category</option>
                  {sampleCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
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
                  Description *
                </label>
                <textarea
                  value={newService.description}
                  onChange={(e) =>
                    setNewService((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Enter service description"
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
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    value={newService.price}
                    onChange={(e) =>
                      setNewService((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                    min="0"
                    step="0.01"
                    placeholder="0.00"
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
                    Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    value={newService.duration_minutes}
                    onChange={(e) =>
                      setNewService((prev) => ({
                        ...prev,
                        duration_minutes: e.target.value,
                      }))
                    }
                    min="1"
                    placeholder="30"
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
                  Image URL *
                </label>
                <input
                  type="text"
                  value={newService.image_url}
                  onChange={(e) =>
                    setNewService((prev) => ({
                      ...prev,
                      image_url: e.target.value,
                    }))
                  }
                  placeholder="https://example.com/service-image.jpg"
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
                    display: "flex",
                    alignItems: "center",
                    color: colors.text,
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    gap: "0.5rem",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={newService.is_available}
                    onChange={(e) =>
                      setNewService((prev) => ({
                        ...prev,
                        is_available: e.target.checked,
                      }))
                    }
                    style={{
                      width: "1rem",
                      height: "1rem",
                    }}
                  />
                  Service Available
                </label>
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
                onClick={() => setShowAddModal(false)}
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
                onClick={handleAddService}
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
                Add Service
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

export default AdminServices;

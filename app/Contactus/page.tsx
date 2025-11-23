"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ContactUs = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const navLinks = [
    { label: "HOME", path: "/UserHome" },
    { label: "SERVICES", path: "/Services" },
    { label: "ABOUT", path: "/About" },
    { label: "APPOINTMENTS", path: "/Appointment" },
    { label: "CONTACT", path: "/Contactus" },
  ];
  const handleNavigation = (path: string) => router.push(path);
  const handleProfile = () => router.push("/UserProfile");

  // Refs for animations
  const formRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);

  // Orange color scheme matching Profile page
  const colors = {
    primary: "#FF8C00",
    primaryLight: "#FFA500",
    primaryDark: "#cc7000",
    background: "#000000",
    surface: "rgba(255, 255, 255, 0.05)",
    surfaceLight: "rgba(255, 255, 255, 0.08)",
    text: "#ffffff",
    textSecondary: "rgba(255, 255, 255, 0.7)",
    textMuted: "rgba(255, 255, 255, 0.5)",
    border: "rgba(255, 255, 255, 0.1)",
  };
  const ORANGE = colors.primary;

  useEffect(() => {
    const trigger =
      navRef.current &&
      ScrollTrigger.create({
        start: "top -50",
        end: 99999,
        toggleClass: { className: "nav-scrolled", targets: navRef.current },
      });

    // Entrance animations
    const tl = gsap.timeline();

    tl.fromTo(
      navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
    );

    tl.fromTo(
      headerRef.current,
      { y: 50, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" },
      "-=0.4"
    );

    tl.fromTo(
      formRef.current,
      { x: -50, opacity: 0, rotationY: -15 },
      { x: 0, opacity: 1, rotationY: 0, duration: 0.6, ease: "power3.out" },
      "-=0.3"
    );

    tl.fromTo(
      infoRef.current,
      { x: 50, opacity: 0, rotationY: 15 },
      { x: 0, opacity: 1, rotationY: 0, duration: 0.6, ease: "power3.out" },
      "-=0.4"
    );

    // Floating background elements
    const floatingElements = document.querySelectorAll(".floating-element");
    floatingElements.forEach((element, index) => {
      gsap.to(element, {
        y: "+=20",
        rotation: "+=5",
        duration: 3 + index * 0.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });
    return () => {
      trigger?.kill();
    };
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Animate form submission
    const tl = gsap.timeline();
    tl.to(formRef.current, {
      scale: 0.95,
      duration: 0.2,
      ease: "power2.in",
    });
    tl.to(formRef.current, {
      scale: 1,
      duration: 0.3,
      ease: "elastic.out(1, 0.5)",
    });

    // Handle form submission here
    setTimeout(() => {
      alert("Thank you for contacting us! We will get back to you soon.");
      router.push("/UserHome");
    }, 600);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: colors.background,
        color: colors.text,
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated Background Elements */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
          opacity: 0.1,
        }}
      >
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="floating-element"
            style={{
              position: "absolute",
              width: `${80 + i * 40}px`,
              height: `${80 + i * 40}px`,
              borderRadius: "50%",
              border: `2px solid ${colors.primary}`,
              top: `${15 + i * 20}%`,
              right: `${5 + i * 12}%`,
            }}
          />
        ))}
        {[...Array(3)].map((_, i) => (
          <div
            key={i + 4}
            className="floating-element"
            style={{
              position: "absolute",
              width: `${60 + i * 30}px`,
              height: `${60 + i * 30}px`,
              borderRadius: "50%",
              border: `1px solid ${colors.primaryLight}`,
              bottom: `${20 + i * 15}%`,
              left: `${8 + i * 10}%`,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav
        ref={navRef}
        className="main-nav"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          background: "transparent",
          padding: "2rem 3rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 1000,
          transition: "all 0.3s ease",
        }}
      >
        <div
          ref={logoRef}
          style={{ cursor: "pointer" }}
          onClick={() => handleNavigation("/UserHome")}
        >
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: "700",
              margin: 0,
            }}
          >
            <span style={{ color: ORANGE }}>SUNNY</span>
            <span style={{ color: "#ffffff" }}>AUTO</span>
          </h1>
        </div>

        <div
          style={{
            display: "flex",
            gap: "3rem",
            alignItems: "center",
          }}
        >
          {navLinks.map((link) => (
            <button
              key={link.label}
              style={{
                color:
                  link.label === "SERVICES" || link.label === "APPOINTMENTS"
                    ? ORANGE
                    : "rgba(255, 255, 255, 0.9)",
                fontSize: "0.875rem",
                fontWeight: "700",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0.5rem 0",
                transition: "all 0.3s ease",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = ORANGE;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color =
                  link.label === "SERVICES" || link.label === "APPOINTMENTS"
                    ? ORANGE
                    : "rgba(255, 255, 255, 0.9)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
              onClick={() => handleNavigation(link.path)}
            >
              {link.label}
            </button>
          ))}
          <button
            style={{
              background: "transparent",
              color: "#ffffff",
              padding: "0.75rem 2rem",
              borderRadius: "0",
              fontWeight: "700",
              border: "2px solid #ffffff",
              cursor: "pointer",
              transition: "all 0.3s ease",
              fontSize: "0.875rem",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#ffffff";
              e.currentTarget.style.color = "#000000";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#ffffff";
            }}
            onClick={handleProfile}
          >
            PROFILE
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "8rem 2rem 3rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div
          ref={headerRef}
          style={{
            textAlign: "center",
            marginBottom: "4rem",
            padding: "3rem 2rem",
            background: colors.surface,
            borderRadius: "20px",
            border: `1px solid ${colors.primary}30`,
            backdropFilter: "blur(20px)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-50%",
              right: "-10%",
              width: "300px",
              height: "300px",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${colors.primary}15, transparent)`,
              filter: "blur(40px)",
            }}
          />

          <h1
            style={{
              fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
              fontWeight: "900",
              marginBottom: "1.5rem",
              background: `linear-gradient(135deg, #FFFFFF, ${colors.primary})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-1px",
              position: "relative",
              zIndex: 1,
            }}
          >
            Contact Us
          </h1>
          <p
            style={{
              fontSize: "1.2rem",
              color: colors.textSecondary,
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: "1.6",
              fontWeight: "300",
              position: "relative",
              zIndex: 1,
            }}
          >
            Have questions or need assistance? Our team is here to help you with
            all your automotive needs.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
            gap: "3rem",
            alignItems: "start",
          }}
        >
          {/* Contact Form */}
          <div
            ref={formRef}
            style={{
              background: colors.surface,
              borderRadius: "20px",
              padding: "3rem",
              border: `1px solid ${colors.primary}30`,
              backdropFilter: "blur(20px)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-30%",
                left: "-10%",
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                background: `radial-gradient(circle, ${colors.primaryLight}10, transparent)`,
                filter: "blur(30px)",
              }}
            />

            <h2
              style={{
                fontSize: "2rem",
                fontWeight: "900",
                marginBottom: "2rem",
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textAlign: "center",
                position: "relative",
                zIndex: 1,
              }}
            >
              Send Us a Message
            </h2>

            <form
              onSubmit={handleSubmit}
              style={{
                display: "grid",
                gap: "2rem",
                position: "relative",
                zIndex: 1,
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.75rem",
                    fontWeight: "600",
                    color: colors.primary,
                    fontSize: "1.1rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "1.25rem 1.5rem",
                    borderRadius: "12px",
                    border: `1px solid ${colors.primary}30`,
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    color: colors.text,
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    boxSizing: "border-box",
                    fontWeight: "500",
                    fontFamily: "inherit",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = colors.primary;
                    e.target.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
                    e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = `${colors.primary}30`;
                    e.target.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
                    e.target.style.boxShadow = "none";
                  }}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.75rem",
                    fontWeight: "600",
                    color: colors.primary,
                    fontSize: "1.1rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "1.25rem 1.5rem",
                    borderRadius: "12px",
                    border: `1px solid ${colors.primary}30`,
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    color: colors.text,
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    boxSizing: "border-box",
                    fontWeight: "500",
                    fontFamily: "inherit",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = colors.primary;
                    e.target.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
                    e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = `${colors.primary}30`;
                    e.target.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
                    e.target.style.boxShadow = "none";
                  }}
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.75rem",
                    fontWeight: "600",
                    color: colors.primary,
                    fontSize: "1.1rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "1.25rem 1.5rem",
                    borderRadius: "12px",
                    border: `1px solid ${colors.primary}30`,
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    color: colors.text,
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    boxSizing: "border-box",
                    fontWeight: "500",
                    fontFamily: "inherit",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = colors.primary;
                    e.target.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
                    e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = `${colors.primary}30`;
                    e.target.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
                    e.target.style.boxShadow = "none";
                  }}
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.75rem",
                    fontWeight: "600",
                    color: colors.primary,
                    fontSize: "1.1rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Subject *
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "1.25rem 1.5rem",
                    borderRadius: "12px",
                    border: `1px solid ${colors.primary}30`,
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    color: colors.text,
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    boxSizing: "border-box",
                    appearance: "none",
                    fontWeight: "500",
                    fontFamily: "inherit",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23FF8C00'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 1.5rem center",
                    backgroundSize: "1.25rem",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = colors.primary;
                    e.target.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
                    e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = `${colors.primary}30`;
                    e.target.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="service">Service Questions</option>
                  <option value="appointment">Appointment Request</option>
                  <option value="complaint">Complaint</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.75rem",
                    fontWeight: "600",
                    color: colors.primary,
                    fontSize: "1.1rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  style={{
                    width: "100%",
                    padding: "1.25rem 1.5rem",
                    borderRadius: "12px",
                    border: `1px solid ${colors.primary}30`,
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    color: colors.text,
                    fontSize: "1rem",
                    resize: "vertical",
                    transition: "all 0.3s ease",
                    boxSizing: "border-box",
                    fontWeight: "500",
                    fontFamily: "inherit",
                    minHeight: "150px",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = colors.primary;
                    e.target.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
                    e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = `${colors.primary}30`;
                    e.target.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
                    e.target.style.boxShadow = "none";
                  }}
                  placeholder="How can we help you?"
                />
              </div>

              <button
                type="submit"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`,
                  color: colors.background,
                  padding: "1.5rem 2rem",
                  borderRadius: "12px",
                  fontWeight: "700",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1.1rem",
                  transition: "all 0.3s ease",
                  marginTop: "1rem",
                  boxShadow: `0 8px 30px ${colors.primary}30`,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = `0 15px 40px ${colors.primary}40`;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = `0 8px 30px ${colors.primary}30`;
                }}
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div
            ref={infoRef}
            style={{
              background: colors.surface,
              borderRadius: "20px",
              padding: "3rem",
              border: `1px solid ${colors.primary}30`,
              backdropFilter: "blur(20px)",
              position: "relative",
              overflow: "hidden",
              height: "fit-content",
            }}
          >
            <div
              style={{
                position: "absolute",
                bottom: "-30%",
                right: "-10%",
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                background: `radial-gradient(circle, ${colors.primary}10, transparent)`,
                filter: "blur(30px)",
              }}
            />

            <h2
              style={{
                fontSize: "2rem",
                fontWeight: "900",
                marginBottom: "3rem",
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textAlign: "center",
                position: "relative",
                zIndex: 1,
              }}
            >
              Contact Information
            </h2>

            <div
              style={{
                display: "grid",
                gap: "2.5rem",
                position: "relative",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  padding: "2rem",
                  background: "rgba(0, 0, 0, 0.3)",
                  borderRadius: "16px",
                  border: `1px solid ${colors.primary}30`,
                  transition: "all 0.3s ease",
                  backdropFilter: "blur(10px)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.borderColor = colors.primary;
                  e.currentTarget.style.boxShadow = `0 15px 30px ${colors.primary}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = `${colors.primary}30`;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <h3
                  style={{
                    color: colors.primary,
                    fontSize: "1.3rem",
                    marginBottom: "1rem",
                    fontWeight: "700",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <span style={{ fontSize: "1.5rem" }}>🏢</span>
                  Company Name
                </h3>
                <p
                  style={{
                    color: colors.text,
                    lineHeight: "1.6",
                    fontSize: "1.1rem",
                    fontWeight: "500",
                  }}
                >
                  Sunny Auto Services
                </p>
              </div>

              <div
                style={{
                  padding: "2rem",
                  background: "rgba(0, 0, 0, 0.3)",
                  borderRadius: "16px",
                  border: `1px solid ${colors.primary}30`,
                  transition: "all 0.3s ease",
                  backdropFilter: "blur(10px)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.borderColor = colors.primary;
                  e.currentTarget.style.boxShadow = `0 15px 30px ${colors.primary}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = `${colors.primary}30`;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <h3
                  style={{
                    color: colors.primary,
                    fontSize: "1.3rem",
                    marginBottom: "1rem",
                    fontWeight: "700",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <span style={{ fontSize: "1.5rem" }}>📧</span>
                  Email Address
                </h3>
                <p
                  style={{
                    color: colors.text,
                    lineHeight: "1.6",
                    fontSize: "1.1rem",
                    fontWeight: "500",
                  }}
                >
                  contact@sunnyauto.com
                </p>
              </div>

              <div
                style={{
                  padding: "2rem",
                  background: "rgba(0, 0, 0, 0.3)",
                  borderRadius: "16px",
                  border: `1px solid ${colors.primary}30`,
                  transition: "all 0.3s ease",
                  backdropFilter: "blur(10px)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.borderColor = colors.primary;
                  e.currentTarget.style.boxShadow = `0 15px 30px ${colors.primary}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = `${colors.primary}30`;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <h3
                  style={{
                    color: colors.primary,
                    fontSize: "1.3rem",
                    marginBottom: "1rem",
                    fontWeight: "700",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <span style={{ fontSize: "1.5rem" }}>📞</span>
                  Phone Numbers
                </h3>
                <p
                  style={{
                    color: colors.text,
                    lineHeight: "1.6",
                    fontSize: "1.1rem",
                    fontWeight: "500",
                  }}
                >
                  Main: (368) 999-8074
                  <br />
                  Secondary: (368) 555-1234
                </p>
              </div>

              <div
                style={{
                  padding: "2rem",
                  background: "rgba(0, 0, 0, 0.3)",
                  borderRadius: "16px",
                  border: `1px solid ${colors.primary}30`,
                  transition: "all 0.3s ease",
                  backdropFilter: "blur(10px)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.borderColor = colors.primary;
                  e.currentTarget.style.boxShadow = `0 15px 30px ${colors.primary}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = `${colors.primary}30`;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <h3
                  style={{
                    color: colors.primary,
                    fontSize: "1.3rem",
                    marginBottom: "1rem",
                    fontWeight: "700",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <span style={{ fontSize: "1.5rem" }}>🕒</span>
                  Business Hours
                </h3>
                <p
                  style={{
                    color: colors.text,
                    lineHeight: "1.6",
                    fontSize: "1.1rem",
                    fontWeight: "500",
                  }}
                >
                  Monday - Friday: 8:00 AM - 6:00 PM
                  <br />
                  Saturday: 9:00 AM - 4:00 PM
                  <br />
                  Sunday: Closed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        .floating-element {
          animation: float 6s ease-in-out infinite;
        }
        .main-nav.nav-scrolled {
          background: rgba(0, 0, 0, 0.95) !important;
          backdrop-filter: blur(10px);
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
};

export default ContactUs;

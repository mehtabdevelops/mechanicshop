"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { gsap } from "gsap";

const ORANGE = "#FF8C00";
const ORANGE_LIGHT = "#FFA500";

const Signin = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  // Refs (still used for layout)
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const formCardRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const inputRefs = useRef<(HTMLDivElement | null)[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const backgroundPatternRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ❌ Disable all GSAP entrance animations
    if (false) {
      const tl = gsap.timeline();
      tl.to(backgroundPatternRef.current, { opacity: 1 });
    }

    // Remove parallax listener (disabled)
    return () => {};
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      if (data.user) {
        const { data: adminData } = await supabase
          .from("admin_signin")
          .select("admin_id")
          .eq("admin_id", data.user.id)
          .single();

        // ❌ Disable GSAP success animation
        if (false) {
          gsap.to(formCardRef.current, { scale: 1.05 });
        }

        alert("Sign in successful! Welcome back.");

        sessionStorage.setItem(
          "userData",
          JSON.stringify({
            id: data.user.id,
            email: data.user.email,
            isAdmin: !!adminData,
          })
        );

        if (adminData) router.push("/AdminHome");
        else router.push("/UserHome");
      }
    } catch (error: any) {
      console.error("Signin error:", error);

      // ❌ Disable shake animation
      if (false) {
        gsap.to(formCardRef.current, { x: 10 });
      }

      alert(error.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    // ❌ Disable exit animation
    router.push("/");
  };

  const handleSignUpClick = () => {
    // ❌ Disable animation
    router.push("/signup");
  };

  const handleForgotPassword = () => {
    // ❌ Disable animation
    router.push("/forgot-password");
  };

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Inter, sans-serif",
        background: "linear-gradient(135deg, #050505, #181818)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Pattern */}
      <div
        ref={backgroundPatternRef}
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(255, 140, 0, 0.08) 2px, transparent 0),
            radial-gradient(circle at 80% 80%, rgba(255, 165, 0, 0.05) 1px, transparent 0)
          `,
          backgroundSize: "60px 60px, 40px 40px",
          zIndex: 1,
          opacity: 1, // static now
        }}
      />

      {/* Header */}
      <header
        style={{
          padding: "1.5rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid rgba(255, 140, 0, 0.25)",
          backdropFilter: "blur(15px)",
          position: "relative",
          zIndex: 10,
          background: "rgba(12, 12, 12, 0.6)",
        }}
      >
        <h1
          style={{
            fontSize: "2.75rem",
            fontWeight: "800",
            background: `linear-gradient(135deg, #ffffff, ${ORANGE_LIGHT}, ${ORANGE})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "3px",
            cursor: "pointer",
          }}
          onClick={handleBackToHome}
        >
          SUNNY AUTO
        </h1>
      </header>

      {/* Main Layout */}
      <div
        style={{
          display: "flex",
          flex: 1,
          minHeight: "calc(100vh - 80px)",
          position: "relative",
          zIndex: 3,
        }}
      >
        {/* Left Panel (Form) */}
        <div
          ref={leftPanelRef}
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "3rem",
          }}
        >
          <div
            ref={formCardRef}
            style={{
              width: "100%",
              maxWidth: "480px",
              background: "rgba(17, 17, 17, 0.78)",
              backdropFilter: "blur(25px)",
              borderRadius: "20px",
              padding: "3.5rem 3rem",
              border: "1px solid rgba(255, 140, 0, 0.35)",
              color: "#f3f4f6",
            }}
          >
            <h2
              ref={titleRef}
              style={{
                fontSize: "2.25rem",
                fontWeight: 700,
                textAlign: "center",
                marginBottom: "2rem",
                background: `linear-gradient(135deg, #ffffff, ${ORANGE})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Welcome Back
            </h2>

            <form onSubmit={handleSignIn}>
              {/* EMAIL */}
              <div
                ref={(el) => (inputRefs.current[0] = el)}
                style={{ marginBottom: "2rem" }}
              >
                <label
                  style={{
                    display: "block",
                    color: ORANGE_LIGHT,
                    marginBottom: "0.5rem",
                  }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  onChange={handleInputChange}
                  value={formData.email}
                  placeholder="your.email@example.com"
                  style={{
                    width: "100%",
                    padding: "1rem",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 165, 0, 0.45)",
                    background: "rgba(24, 24, 27, 0.7)",
                    color: "#eee",
                  }}
                />
                {errors.email && (
                  <p style={{ color: ORANGE_LIGHT }}>{errors.email}</p>
                )}
              </div>

              {/* PASSWORD */}
              <div
                ref={(el) => (inputRefs.current[1] = el)}
                style={{ marginBottom: "2rem" }}
              >
                <label
                  style={{
                    display: "block",
                    color: ORANGE_LIGHT,
                    marginBottom: "0.5rem",
                  }}
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  onChange={handleInputChange}
                  value={formData.password}
                  placeholder="Enter your password"
                  style={{
                    width: "100%",
                    padding: "1rem",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 165, 0, 0.45)",
                    background: "rgba(24, 24, 27, 0.7)",
                    color: "#eee",
                  }}
                />
                {errors.password && (
                  <p style={{ color: ORANGE_LIGHT }}>{errors.password}</p>
                )}
              </div>

              {/* BUTTON */}
              <button
                ref={buttonRef}
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "1rem",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  borderRadius: "12px",
                  border: "none",
                  background: loading
                    ? "gray"
                    : `linear-gradient(135deg, ${ORANGE_LIGHT}, ${ORANGE})`,
                  color: loading ? "#aaa" : "#fff",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* SIGN UP LINK */}
            <div
              style={{
                marginTop: "1.5rem",
                textAlign: "center",
                color: "#aaa",
              }}
            >
              Don't have an account?
              <span
                style={{
                  marginLeft: "8px",
                  color: ORANGE_LIGHT,
                  cursor: "pointer",
                }}
                onClick={handleSignUpClick}
              >
                Sign Up
              </span>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div
          ref={rightPanelRef}
          style={{
            flex: 1,
            backgroundImage:
              "linear-gradient(rgba(15,15,15,0.6), rgba(15,15,15,0.85)), url('https://images.unsplash.com/photo-1542362567-b07e54358753')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            padding: "3rem",
            color: "#eee",
          }}
        >
          <div
            style={{
              background: "rgba(17,17,17,0.78)",
              padding: "2rem",
              borderRadius: "16px",
              border: "1px solid rgba(255,140,0,0.35)",
            }}
          >
            <h3
              style={{
                fontSize: "1.8rem",
                background: `linear-gradient(135deg, #fff, ${ORANGE_LIGHT})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Timeless Service, Modern Excellence
            </h3>

            <p style={{ marginTop: "1rem", opacity: 0.8 }}>
              Experience automotive care that blends craftsmanship with
              innovation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;

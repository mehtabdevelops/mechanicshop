"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ORANGE = "#FF8C00"; // primary accent
const ORANGE_LIGHT = "#FFA500"; // secondary for gradients
const ORANGE_RGBA = (a: number) => `rgba(255, 140, 0, ${a})`;

const About = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [heroTextReady, setHeroTextReady] = useState(false);
  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
      : false;

  // Refs for animations
  const rootRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const heroTextRef = useRef<HTMLDivElement | null>(null);
  const statsRef = useRef<HTMLDivElement | null>(null);
  const storyRef = useRef<HTMLDivElement | null>(null);
  const valuesRef = useRef<HTMLDivElement | null>(null);
  const teamRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const geometricRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const teamMembers = [
    {
      name: 'Michael "Steel Hands" Rodriguez',
      position: "Master Technician & Head Mechanic",
      experience: "15+ years",
      specialization: "Engine Diagnostics & Performance",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      quote: "Every engine has a voice. I speak fluent mechanic.",
      certifications: "ASE Master Certified",
    },
    {
      name: 'Sarah "The Negotiator" Johnson',
      position: "Service Manager & Customer Relations",
      experience: "12+ years",
      specialization: "Customer Experience & Operations",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      quote: "Your trust is earned, not given. We earn it daily.",
      certifications: "Service Excellence Award 2023",
    },
    {
      name: 'David "Circuit" Chen',
      position: "Electrical Systems Specialist",
      experience: "10+ years",
      specialization: "Advanced Electronics & Computer Systems",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      quote: "From spark plugs to sensors, I solve the impossible.",
      certifications: "Hybrid & EV Certified",
    },
    {
      name: 'Emily "Safety First" Williams',
      position: "Brake & Suspension Expert",
      experience: "8+ years",
      specialization: "Safety Systems & Chassis",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      quote: "Every mile you drive is a mile I made safer.",
      certifications: "Brake Safety Specialist",
    },
  ];

  const values = [
    {
      icon: "⚡",
      title: "Lightning Fast",
      description:
        "Most services completed same-day. Because your time matters.",
      metric: "2 hours average",
    },
    {
      icon: "🎯",
      title: "Precision Quality",
      description:
        "12-month/12,000-mile warranty. We stand behind every bolt we turn.",
      metric: "98% satisfaction",
    },
    {
      icon: "💎",
      title: "Crystal Clear Pricing",
      description:
        "No surprises. No hidden fees. Just honest work at honest prices.",
      metric: "100% transparent",
    },
    {
      icon: "🛡️",
      title: "Ironclad Trust",
      description:
        "We only recommend what your car actually needs. Your safety, our mission.",
      metric: "10,000+ loyal customers",
    },
  ];

  const stats = [
    { number: "10,247", label: "Happy Drivers", suffix: "+" },
    { number: "15", label: "Years of Excellence", suffix: "+" },
    { number: "98.7", label: "Satisfaction Rate", suffix: "%" },
    { number: "24", label: "Emergency Support", suffix: "/7" },
  ];

  const milestones = [
    { year: "2009", event: "Founded by James Wilson in a single-bay garage" },
    {
      year: "2012",
      event: "Expanded to 5 service bays, hired first team of 3 mechanics",
    },
    { year: "2016", event: "Achieved ASE Blue Seal of Excellence recognition" },
    {
      year: "2019",
      event: "Opened state-of-the-art facility with 12 service bays",
    },
    {
      year: "2023",
      event: "Served 10,000th customer, launched 24/7 roadside assistance",
    },
  ];

  // CAR / SHOP GALLERY (organized nicely with varied spans)
  const gallery: {
    src: string;
    title: string;
    wide?: boolean;
    tall?: boolean;
  }[] = [
    {
      src: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80",
      title: "Midnight Muscle",
      wide: true,
    },
    {
      src: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1600&q=80",
      title: "Turbo Bay",
      tall: true,
    },
    {
      src: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1600&q=80",
      title: "Classic Shine",
    },
    {
      src: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=80",
      title: "Shop Glow",
    },
    {
      src: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1600&q=80",
      title: "Detailing Bay",
      wide: true,
    },
    {
      src: "https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?auto=format&fit=crop&w=1600&q=80",
      title: "City Cruise",
    },
  ];

  // Mouse parallax effect (smoothed)
  useEffect(() => {
    if (prefersReducedMotion) return;
    const handleMouseMove = (e: MouseEvent): void => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    // Geometric shapes parallax
    if (geometricRef.current) {
      const shapes = geometricRef.current.querySelectorAll(".geometric-shape");
      shapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.45;
        const el = shape as HTMLElement;
        el.style.willChange = "transform";
        gsap.to(el, {
          x: mousePos.x * 30 * speed,
          y: mousePos.y * 30 * speed,
          duration: 0.6,
          ease: "power3.out",
          force3D: true,
        });
      });
    }
  }, [mousePos, prefersReducedMotion]);

  // Mark when hero text is ready for animation
  useEffect(() => {
    if (heroTextRef.current) {
      setHeroTextReady(true);
    }
  }, []);

  // ---- MAIN ANIMATIONS ----
  useLayoutEffect(() => {
    if (!heroTextReady || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // HERO: Character animation with proper sequencing
      const tl = gsap.timeline({
        defaults: { ease: "back.out(1.7)" },
        delay: 0.2, // Small delay to ensure DOM is ready
      });

      // Get all character spans
      const allChars = heroTextRef.current?.querySelectorAll(".hero-char");

      if (allChars && allChars.length > 0) {
        // Set initial state - characters start invisible and slightly below
        gsap.set(allChars, {
          opacity: 0,
          y: 40,
          scale: 0.5,
          rotationX: -90,
        });

        // Animate all characters with stagger
        tl.to(allChars, {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationX: 0,
          duration: 0.8,
          stagger: {
            each: 0.03,
            from: "start",
          },
          force3D: true,
          transformPerspective: 1000,
        });

        // Add a subtle bounce effect after main animation
        tl.to(
          allChars,
          {
            y: -5,
            duration: 0.3,
            stagger: 0.02,
            ease: "power2.out",
          },
          "+=0.1"
        );

        tl.to(allChars, {
          y: 0,
          duration: 0.3,
          stagger: 0.02,
          ease: "bounce.out",
        });
      }

      // Hero subtitle fade in
      const heroSubtitle = heroRef.current?.querySelector("p");
      if (heroSubtitle) {
        gsap.fromTo(
          heroSubtitle,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: 1.2,
            ease: "power3.out",
          }
        );
      }

      // Stats counter animation
      const statNumbers = statsRef.current?.querySelectorAll(".stat-number");
      statNumbers?.forEach((stat) => {
        const el = stat as HTMLElement;
        const target = parseFloat(el.dataset.target || "0");
        const obj = { val: 0 };

        gsap.to(obj, {
          val: target,
          duration: 2.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: stat,
            start: "top 85%",
            once: true,
          },
          onUpdate: function () {
            el.textContent = Math.ceil(obj.val).toString();
          },
        });
      });

      // Story section with parallax
      if (storyRef.current) {
        gsap.fromTo(
          storyRef.current,
          { opacity: 0, y: 100 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            scrollTrigger: {
              trigger: storyRef.current,
              start: "top 80%",
              end: "top 30%",
              scrub: 1,
            },
          }
        );
      }

      // Values cards stagger
      const valueCards = valuesRef.current?.querySelectorAll(".value-card");
      if (valueCards) {
        gsap.fromTo(
          valueCards,
          { opacity: 0, y: 50, rotationX: -12 },
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: valuesRef.current,
              start: "top 70%",
              once: true,
            },
          }
        );
      }

      // Team cards with rotation entrance
      const teamCards = teamRef.current?.querySelectorAll(".team-card");
      if (teamCards) {
        teamCards.forEach((card, index) => {
          gsap.fromTo(
            card,
            {
              opacity: 0,
              rotationY: index % 2 === 0 ? -180 : 180,
              scale: 0.3,
            },
            {
              opacity: 1,
              rotationY: 0,
              scale: 1,
              duration: 1.2,
              ease: "back.out(1.4)",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                once: true,
              },
              transformPerspective: 1000,
            }
          );
        });
      }

      // CTA section
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { opacity: 0, scale: 0.8, rotationY: -15 },
          {
            opacity: 1,
            scale: 1,
            rotationY: 0,
            duration: 1.2,
            ease: "elastic.out(1, 0.5)",
            scrollTrigger: {
              trigger: ctaRef.current,
              start: "top 80%",
              once: true,
            },
            transformPerspective: 1000,
          }
        );
      }

      // Geometric shapes floating animation
      const shapes = document.querySelectorAll(".geometric-shape");
      shapes.forEach((shape, index) => {
        gsap.to(shape, {
          y: "+=20",
          rotation: "+=360",
          duration: 3 + index * 0.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, [heroTextReady, prefersReducedMotion]);

  // Split text into characters for animation
  const splitText = (text: string): React.ReactElement[] =>
    text.split("").map((char, index) => (
      <span
        key={index}
        className="hero-char"
        style={{
          display: "inline-block",
          willChange: "transform, opacity",
          backfaceVisibility: "hidden",
          transformStyle: "preserve-3d",
          background: "inherit",
          backgroundClip: "inherit",
          WebkitBackgroundClip: "inherit",
          WebkitTextFillColor: "inherit",
          color: "inherit",
        }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));

  const navLinks = [
    { label: "HOME", path: "/UserHome" },
    { label: "SERVICES", path: "/Services" },
    { label: "ABOUT", path: "/About" },
    { label: "APPOINTMENTS", path: "/Appointment" },
    { label: "CONTACT", path: "/Contactus" },
  ];
  const handleNavigation = (path: string) => router.push(path);
  const handleProfile = () => router.push("/UserProfile");

  return (
    <div
      ref={rootRef}
      style={{
        minHeight: "100vh",
        background: "#000000",
        color: "#FFFFFF",
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Geometric Background */}
      <div
        ref={geometricRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
          opacity: 0.15,
        }}
      >
        {/* Circle */}
        <div
          className="geometric-shape"
          style={{
            position: "absolute",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            border: `2px solid ${ORANGE}`,
            top: "10%",
            right: "15%",
          }}
        />
        {/* Triangle */}
        <div
          className="geometric-shape"
          style={{
            position: "absolute",
            width: 0,
            height: 0,
            borderLeft: "150px solid transparent",
            borderRight: "150px solid transparent",
            borderBottom: `260px solid ${ORANGE_RGBA(0.3)}`,
            bottom: "20%",
            left: "10%",
          }}
        />
        {/* Rectangle */}
        <div
          className="geometric-shape"
          style={{
            position: "absolute",
            width: "200px",
            height: "200px",
            border: "2px solid rgba(255, 255, 255, 0.3)",
            top: "50%",
            left: "50%",
            transform: "rotate(45deg)",
          }}
        />
        {/* Small circles */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="geometric-shape"
            style={{
              position: "absolute",
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              background:
                i % 2 === 0 ? ORANGE_RGBA(0.2) : "rgba(255, 255, 255, 0.1)",
              top: `${20 + i * 15}%`,
              left: `${10 + i * 15}%`,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav
        style={{
          background: "rgba(0, 0, 0, 0.95)",
          padding: "1.5rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 100,
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${ORANGE_RGBA(0.3)}`,
          boxShadow: `0 4px 20px ${ORANGE_RGBA(0.1)}`,
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "900",
            background: `linear-gradient(135deg, #FFFFFF, ${ORANGE})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            cursor: "pointer",
            letterSpacing: "2px",
            margin: 0,
          }}
          onClick={() => handleNavigation("/UserHome")}
        >
          SUNNY AUTO
        </h1>

        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          {navLinks.map((link) => (
            <button
              key={link.label}
              style={{
                background: "transparent",
                border: "none",
                color:
                  link.label === "SERVICES" || link.label === "APPOINTMENTS"
                    ? ORANGE
                    : "rgba(255,255,255,0.85)",
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.3s ease",
                fontSize: "0.85rem",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = ORANGE;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color =
                  link.label === "SERVICES" || link.label === "APPOINTMENTS"
                    ? ORANGE
                    : "rgba(255,255,255,0.85)";
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
              color: "#FFFFFF",
              padding: "0.6rem 1.8rem",
              borderRadius: "0",
              fontWeight: 700,
              border: "2px solid #FFFFFF",
              cursor: "pointer",
              transition: "all 0.3s ease",
              fontSize: "0.85rem",
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#FFFFFF";
              e.currentTarget.style.color = "#000000";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#FFFFFF";
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
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "4rem 2rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Hero Section */}
        <div
          ref={heroRef}
          style={{
            textAlign: "center",
            marginBottom: "8rem",
            padding: "4rem 0",
          }}
        >
          <div
            ref={heroTextRef}
            style={{
              fontSize: "clamp(2.5rem, 8vw, 6rem)",
              fontWeight: "900",
              marginBottom: "2rem",
              letterSpacing: "-2px",
              lineHeight: "1.1",
              perspective: "1000px",
            }}
          >
            <div className="hero-line hero-line-1" style={{ display: "block" }}>
              {splitText("DRIVEN BY")}
            </div>
            <div
              className="hero-line hero-line-2"
              style={{
                display: "block",
                background: `linear-gradient(135deg, ${ORANGE}, ${ORANGE_LIGHT}, #FFFFFF)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {splitText("EXCELLENCE")}
            </div>
          </div>
          <p
            style={{
              fontSize: "1.25rem",
              color: "rgba(255, 255, 255, 0.7)",
              maxWidth: "700px",
              margin: "0 auto",
              lineHeight: "1.8",
              fontWeight: "300",
              opacity: 0,
            }}
          >
            For over 15 years, we've been more than mechanics—we're automotive
            craftsmen, problem solvers, and your trusted partners on every
            journey.
          </p>
        </div>

        {/* Stats Section */}
        <div ref={statsRef} style={{ marginBottom: "8rem" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "2rem",
            }}
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                style={{
                  background: `linear-gradient(135deg, ${ORANGE_RGBA(0.05)}, rgba(0, 0, 0, 0.8))`,
                  padding: "3rem 2rem",
                  borderRadius: "20px",
                  textAlign: "center",
                  border: `1px solid ${ORANGE_RGBA(0.2)}`,
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.style.borderColor = ORANGE;
                  e.currentTarget.style.boxShadow = `0 20px 40px ${ORANGE_RGBA(0.3)}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = ORANGE_RGBA(0.2);
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    fontSize: "3.5rem",
                    fontWeight: "900",
                    color: ORANGE,
                    marginBottom: "0.5rem",
                    letterSpacing: "-2px",
                  }}
                >
                  <span className="stat-number" data-target={stat.number}>
                    0
                  </span>
                  <span style={{ fontSize: "2rem" }}>{stat.suffix}</span>
                </div>
                <div
                  style={{
                    color: "rgba(255, 255, 255, 0.6)",
                    fontSize: "1rem",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    fontWeight: "600",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Story Section */}
        <div ref={storyRef} style={{ marginBottom: "8rem" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
              gap: "4rem",
              alignItems: "center",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  fontWeight: "900",
                  marginBottom: "2rem",
                  background: `linear-gradient(135deg, #FFFFFF, ${ORANGE})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  letterSpacing: "-1px",
                }}
              >
                Our Story
              </h2>
              <p
                style={{
                  color: "rgba(255, 255, 255, 0.7)",
                  lineHeight: "1.8",
                  marginBottom: "1.5rem",
                  fontSize: "1.1rem",
                }}
              >
                Founded in 2009 by James "Jimmy Wrench" Wilson, a
                third-generation mechanic with oil in his veins and precision in
                his hands, Sunny Auto started as a rebellious dream in a cramped
                single-bay garage.
              </p>
              <p
                style={{
                  color: "rgba(255, 255, 255, 0.7)",
                  lineHeight: "1.8",
                  marginBottom: "1.5rem",
                  fontSize: "1.1rem",
                }}
              >
                We didn't just want to fix cars—we wanted to revolutionize what
                honest automotive service means. No upselling. No mysterious
                "recommended services." Just pure, transparent craftsmanship.
              </p>
              <p
                style={{
                  color: "rgba(255, 255, 255, 0.8)",
                  lineHeight: "1.8",
                  fontSize: "1.1rem",
                  fontWeight: "500",
                }}
              >
                Today, with a team of ASE-certified technicians and a
                state-of-the-art 12-bay facility, we're still that same
                passionate garage—just bigger, faster, and more committed to
                your ride.
              </p>

              {/* Timeline */}
              <div style={{ marginTop: "3rem" }}>
                <h3
                  style={{
                    fontSize: "1.5rem",
                    color: ORANGE,
                    marginBottom: "1.5rem",
                    fontWeight: "700",
                  }}
                >
                  OUR JOURNEY
                </h3>
                {milestones.map((milestone, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      gap: "1rem",
                      marginBottom: "1rem",
                      paddingLeft: "1rem",
                      borderLeft: `2px solid ${ORANGE_RGBA(0.3)}`,
                    }}
                  >
                    <div
                      style={{
                        color: ORANGE,
                        fontWeight: "700",
                        fontSize: "1.1rem",
                        minWidth: "50px",
                      }}
                    >
                      {milestone.year}
                    </div>
                    <div
                      style={{
                        color: "rgba(255, 255, 255, 0.6)",
                        fontSize: "0.95rem",
                      }}
                    >
                      {milestone.event}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                position: "relative",
                borderRadius: "20px",
                overflow: "hidden",
                border: `2px solid ${ORANGE_RGBA(0.3)}`,
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1200&q=80"
                alt="Our Workshop"
                style={{
                  width: "100%",
                  display: "block",
                  filter: "grayscale(100%) contrast(1.2)",
                }}
                loading="lazy"
              />
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: `linear-gradient(135deg, ${ORANGE_RGBA(0.2)}, rgba(0, 0, 0, 0.4))`,
                  mixBlendMode: "multiply",
                }}
              />
            </div>
          </div>
        </div>

        {/* Showcase Gallery */}
        <section style={{ marginBottom: "8rem" }}>
          <h2
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: "900",
              textAlign: "center",
              marginBottom: "2rem",
              background: `linear-gradient(135deg, #FFFFFF, ${ORANGE})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-1px",
            }}
          >
            In the Shop & On the Road
          </h2>
          <p
            style={{
              textAlign: "center",
              color: "rgba(255,255,255,0.65)",
              marginBottom: "2rem",
            }}
          >
            A feel for the vibe — real cars, real work, real shine.
          </p>

          {/* Grid with responsive spans */}
          <div
            style={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gridAutoRows: "200px",
            }}
          >
            {gallery.map((g, i) => (
              <figure
                key={i}
                className="gallery-item"
                style={{
                  position: "relative",
                  borderRadius: "16px",
                  overflow: "hidden",
                  border: `1px solid ${ORANGE_RGBA(0.2)}`,
                  background: `linear-gradient(135deg, ${ORANGE_RGBA(0.04)}, rgba(0,0,0,0.9))`,
                  transition:
                    "transform .3s ease, box-shadow .3s ease, border-color .3s ease",
                  cursor: "zoom-in",
                  gridColumn: g.wide ? "span 2" : "span 1",
                  gridRow: g.tall ? "span 2" : "span 1",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.borderColor = ORANGE;
                  e.currentTarget.style.boxShadow = `0 12px 30px ${ORANGE_RGBA(0.25)}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = ORANGE_RGBA(0.2);
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <img
                  src={g.src}
                  alt={g.title}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    filter: "grayscale(8%) contrast(1.05)",
                  }}
                />
                <figcaption
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    padding: "0.5rem 0.75rem",
                    fontSize: "0.8rem",
                    color: "rgba(255,255,255,0.85)",
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.65) 70%)",
                  }}
                >
                  {g.title}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* Values Section */}
        <div ref={valuesRef} style={{ marginBottom: "8rem" }}>
          <h2
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: "900",
              textAlign: "center",
              marginBottom: "4rem",
              background: `linear-gradient(135deg, #FFFFFF, ${ORANGE})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-1px",
            }}
          >
            What Drives Us
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "2rem",
            }}
          >
            {values.map((value, index) => (
              <div
                key={index}
                className="value-card"
                style={{
                  background: `linear-gradient(135deg, ${ORANGE_RGBA(0.05)}, rgba(0, 0, 0, 0.9))`,
                  padding: "2.5rem",
                  borderRadius: "20px",
                  border: `1px solid ${ORANGE_RGBA(0.2)}`,
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-10px) scale(1.02)";
                  e.currentTarget.style.borderColor = ORANGE;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.borderColor = ORANGE_RGBA(0.2);
                }}
              >
                <div
                  style={{
                    fontSize: "4rem",
                    marginBottom: "1.5rem",
                    filter: "grayscale(100%)",
                  }}
                >
                  {value.icon}
                </div>
                <h3
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    color: ORANGE,
                    marginBottom: "1rem",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  {value.title}
                </h3>
                <p
                  style={{
                    color: "rgba(255, 255, 255, 0.6)",
                    lineHeight: "1.6",
                    marginBottom: "1rem",
                    fontSize: "1rem",
                  }}
                >
                  {value.description}
                </p>
                <div
                  style={{
                    color: ORANGE,
                    fontWeight: "700",
                    fontSize: "0.9rem",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    marginTop: "1rem",
                    paddingTop: "1rem",
                    borderTop: `1px solid ${ORANGE_RGBA(0.2)}`,
                  }}
                >
                  {value.metric}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div ref={teamRef} style={{ marginBottom: "8rem" }}>
          <h2
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: "900",
              textAlign: "center",
              marginBottom: "2rem",
              background: `linear-gradient(135deg, #FFFFFF, ${ORANGE})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-1px",
            }}
          >
            The Dream Team
          </h2>
          <p
            style={{
              textAlign: "center",
              color: "rgba(255, 255, 255, 0.6)",
              marginBottom: "4rem",
              fontSize: "1.1rem",
              maxWidth: "600px",
              margin: "0 auto 4rem",
            }}
          >
            Meet the certified professionals who treat your car like their own
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2.5rem",
            }}
          >
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="team-card"
                style={{
                  background: `linear-gradient(135deg, ${ORANGE_RGBA(0.05)}, rgba(0, 0, 0, 0.9))`,
                  padding: "2.5rem",
                  borderRadius: "20px",
                  border: `1px solid ${ORANGE_RGBA(0.2)}`,
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.style.borderColor = ORANGE;
                  e.currentTarget.style.boxShadow = `0 20px 40px ${ORANGE_RGBA(0.3)}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = ORANGE_RGBA(0.2);
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    width: "140px",
                    height: "140px",
                    margin: "0 auto 1.5rem",
                    position: "relative",
                  }}
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: `3px solid ${ORANGE}`,
                      filter: "grayscale(100%) contrast(1.1)",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.filter =
                        "grayscale(0%) contrast(1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.filter =
                        "grayscale(100%) contrast(1.1)";
                    }}
                    loading="lazy"
                  />
                </div>
                <h3
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: "700",
                    color: "#FFFFFF",
                    marginBottom: "0.5rem",
                  }}
                >
                  {member.name}
                </h3>
                <p
                  style={{
                    color: ORANGE,
                    fontWeight: "600",
                    marginBottom: "0.5rem",
                    fontSize: "1rem",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  {member.position}
                </p>
                <p
                  style={{
                    color: "rgba(255, 255, 255, 0.5)",
                    fontSize: "0.9rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  {member.specialization}
                </p>
                <p
                  style={{
                    color: "rgba(255, 255, 255, 0.4)",
                    marginBottom: "1rem",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                  }}
                >
                  {member.experience} • {member.certifications}
                </p>
                <p
                  style={{
                    color: "rgba(255, 255, 255, 0.7)",
                    fontStyle: "italic",
                    marginTop: "1.5rem",
                    padding: "1.5rem",
                    background: ORANGE_RGBA(0.05),
                    borderRadius: "12px",
                    borderLeft: `3px solid ${ORANGE}`,
                    fontSize: "0.95rem",
                    lineHeight: "1.5",
                  }}
                >
                  "{member.quote}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          ref={ctaRef}
          style={{
            background: `linear-gradient(135deg, ${ORANGE_RGBA(0.1)}, rgba(0, 0, 0, 0.9))`,
            borderRadius: "30px",
            padding: "4rem 3rem",
            textAlign: "center",
            border: `2px solid ${ORANGE_RGBA(0.3)}`,
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
              background: `radial-gradient(circle, ${ORANGE_RGBA(0.2)}, transparent)`,
              filter: "blur(60px)",
            }}
          />
          <h2
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: "900",
              marginBottom: "1.5rem",
              position: "relative",
              zIndex: 1,
            }}
          >
            Ready to Experience the{" "}
            <span style={{ color: ORANGE }}>Difference?</span>
          </h2>
          <p
            style={{
              color: "rgba(255, 255, 255, 0.7)",
              marginBottom: "2.5rem",
              maxWidth: "600px",
              margin: "0 auto 2.5rem",
              fontSize: "1.1rem",
              lineHeight: "1.6",
              position: "relative",
              zIndex: 1,
            }}
          >
            Join 10,000+ drivers who've discovered what automotive excellence
            really means. Book your appointment and feel the Sunny Auto
            difference.
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
              position: "relative",
              zIndex: 1,
            }}
          >
            <button
              style={{
                background: ORANGE,
                color: "#000000",
                padding: "1.25rem 3rem",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                fontWeight: "700",
                fontSize: "1.1rem",
                transition: "all 0.3s ease",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "translateY(-5px) scale(1.05)";
                e.currentTarget.style.boxShadow = `0 20px 40px ${ORANGE_RGBA(0.4)}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Book Appointment
            </button>
            <button
              style={{
                background: "transparent",
                color: "#FFFFFF",
                padding: "1.25rem 3rem",
                borderRadius: "12px",
                border: "2px solid rgba(255, 255, 255, 0.3)",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "1.1rem",
                transition: "all 0.3s ease",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#FFFFFF";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              Call 24/7: (555) 123-4567
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          textAlign: "center",
          padding: "3rem 2rem",
          color: "rgba(255, 255, 255, 0.4)",
          borderTop: `1px solid ${ORANGE_RGBA(0.1)}`,
          fontSize: "0.9rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        <p>© 2024 Sunny Auto. Where every mile matters.</p>
        <p style={{ marginTop: "0.5rem", fontSize: "0.8rem" }}>
          ASE Certified • Family Owned • Serving the Community Since 2009
        </p>
      </div>
    </div>
  );
};

export default About;

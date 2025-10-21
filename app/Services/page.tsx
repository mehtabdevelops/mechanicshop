"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";

const ORANGE_PRIMARY = "#FF8C00"; // Darker orange
const ORANGE_SECONDARY = "#FFA500"; // Lighter orange
const WHITE = "#FFFFFF";
const TEXT_SUBTLE = "#B3B3B3";

const Services = () => {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState<string | null>(null);

  // Refs for GSAP
  const navRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ctaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Respect reduced motion
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) return;

    // Stagger intro animations
    if (navRef.current) {
      gsap.fromTo(
        navRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
      );
    }

    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, delay: 0.1, ease: "power3.out" }
      );
    }

    if (cardRefs.current && cardRefs.current.length) {
      gsap.fromTo(
        cardRefs.current.filter(Boolean),
        { y: 24, opacity: 0, rotateX: -6 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.65,
          ease: "power3.out",
          stagger: 0.06,
          delay: 0.15,
        }
      );
    }

    if (ctaRef.current) {
      gsap.fromTo(
        ctaRef.current,
        { y: 24, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          delay: 0.2,
          ease: "power3.out",
        }
      );
    }
  }, []);

  const services = [
    {
      id: 1,
      title: "Oil Change",
      description:
        "Professional oil change service to keep your engine running smoothly and efficiently. Includes filter replacement and fluid check.",
      price: "$49.99",
      duration: "30 min",
      image:
        "https://www.carkeys.co.uk/media/1083/oil_change.jpg?anchor=center&mode=crop&width=1200&height=800",
      features: [
        "Synthetic Oil",
        "Filter Replacement",
        "Fluid Check",
        "20-Point Inspection",
      ],
    },
    {
      id: 2,
      title: "Brake Service",
      description:
        "Complete brake inspection and repair services for your safety on the road. Includes pad replacement and rotor resurfacing.",
      price: "$129.99",
      duration: "2 hours",
      image:
        "https://edmorsecadillacbrandonservice.com/wp-content/uploads/2018/10/brakes.jpg",
      features: [
        "Brake Inspection",
        "Pad Replacement",
        "Rotor Resurfacing",
        "Brake Fluid Check",
      ],
    },
    {
      id: 3,
      title: "Tire Rotation",
      description:
        "Professional tire rotation service to ensure even wear and extend the life of your tires. Includes pressure check and balance.",
      price: "$29.99",
      duration: "45 min",
      image:
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      features: [
        "Tire Rotation",
        "Pressure Check",
        "Wheel Balancing",
        "Visual Inspection",
      ],
    },
    {
      id: 4,
      title: "Basic Service",
      description:
        "Essential maintenance package including oil change, filter replacement, and basic safety inspection.",
      price: "$79.99",
      duration: "1 hour",
      image: "https://www.worldofservice.in/wp-content/uploads/2016/01/car-service.jpg",
      features: ["Oil Change", "Filter Replacement", "Safety Inspection", "Fluid Top-up"],
    },
    {
      id: 5,
      title: "Full Service",
      description:
        "Comprehensive maintenance package covering all essential systems for optimal vehicle performance.",
      price: "$199.99",
      duration: "3 hours",
      image:
        "https://mycarneedsa.com/assets/uploads/images/blog/6f67cc7a0a1341f213f2ab17a95f0ca5.jpg",
      features: [
        "Complete Inspection",
        "Oil Change",
        "Brake Check",
        "Tire Service",
        "AC Check",
      ],
    },
    {
      id: 6,
      title: "AC Repair",
      description:
        "Professional AC system diagnosis and repair to keep you cool and comfortable on the road.",
      price: "$149.99",
      duration: "2 hours",
      image:
        "https://ictire.com/wp-content/uploads/2022/10/Car-Air-Conditioning-Repair-1024x643.webp",
      features: [
        "AC Diagnosis",
        "Refrigerant Charge",
        "Compressor Check",
        "System Testing",
      ],
    },
    {
      id: 7,
      title: "Battery Replacement",
      description:
        "Professional battery testing and replacement service to ensure reliable starting power.",
      price: "$89.99",
      duration: "30 min",
      image:
        "https://knowhow.napaonline.com/wp-content/uploads/2017/03/Replace_Battery1.jpg",
      features: [
        "Battery Testing",
        "Replacement",
        "Terminal Cleaning",
        "Charging System Check",
      ],
    },
    {
      id: 8,
      title: "General Maintenance",
      description:
        "Routine maintenance service to keep your vehicle in top condition and prevent future issues.",
      price: "$99.99",
      duration: "1.5 hours",
      image:
        "https://blog.napacanada.com/wp-content/uploads/2020/02/shutterstock_118548643-scaled.jpg",
      features: [
        "Multi-point Inspection",
        "Fluid Changes",
        "Filter Replacement",
        "Safety Check",
      ],
    },
  ];

  const handleBookService = (serviceTitle: string) => {
    router.push(`/Appointment?service=${encodeURIComponent(serviceTitle)}`);
  };

  // Utility hover animation with GSAP
  const handleCardHoverIn = (el: HTMLDivElement | null) => {
    if (!el) return;
    gsap.to(el, {
      y: -8,
      duration: 0.25,
      ease: "power2.out",
      boxShadow: "0 20px 40px rgba(0,0,0,0.35), 0 0 30px rgba(255,140,0,0.25)",
      borderColor: "rgba(255,140,0,0.35)",
    });
  };

  const handleCardHoverOut = (el: HTMLDivElement | null) => {
    if (!el) return;
    gsap.to(el, {
      y: 0,
      duration: 0.25,
      ease: "power2.out",
      boxShadow: "none",
      borderColor: "rgba(255,255,255,0.10)",
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000000",
        color: WHITE,
        fontFamily: "Arial, sans-serif",
        padding: "2rem 0",
      }}
    >
      {/* Navigation */}
      <nav
        ref={navRef}
        style={{
          background: "rgba(0, 0, 0, 0.85)",
          padding: "1.5rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 40,
          backdropFilter: "blur(10px)",
          marginBottom: "3rem",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              letterSpacing: "1px",
              cursor: "pointer",
              margin: 0,
              background: `linear-gradient(45deg, ${ORANGE_PRIMARY}, ${ORANGE_SECONDARY})`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            onClick={() => router.push("/")}
          >
            SUNNY AUTO
          </h1>
        </div>

        <button
          style={{
            background: "transparent",
            color: WHITE,
            padding: "0.75rem 1.5rem",
            borderRadius: "50px",
            fontWeight: 400,
            cursor: "pointer",
            transition: "all 0.3s ease",
            fontSize: "1.1rem",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = ORANGE_PRIMARY;
            e.currentTarget.style.color = "#000000";
            e.currentTarget.style.borderColor = ORANGE_SECONDARY;
            e.currentTarget.style.boxShadow = "0 0 18px rgba(255,140,0,0.35)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = WHITE;
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
            e.currentTarget.style.boxShadow = "none";
          }}
          onClick={() => router.push("/UserHome")}
        >
          Back to Home
        </button>
      </nav>

      {/* Main Content */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 2rem",
        }}
      >
        {/* Header */}
        <div
          ref={headerRef}
          style={{
            textAlign: "center",
            marginBottom: "4rem",
          }}
        >
          <h1
            style={{
              fontSize: "4rem",
              fontWeight: "bold",
              marginBottom: "1rem",
              background: `linear-gradient(45deg, ${ORANGE_PRIMARY}, ${ORANGE_SECONDARY})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginTop: 0,
            }}
          >
            Our Services
          </h1>
          <p
            style={{
              fontSize: "1.5rem",
              color: TEXT_SUBTLE,
              maxWidth: "800px",
              margin: "0 auto",
              lineHeight: "1.6",
            }}
          >
            Professional automotive services to keep your vehicle running smoothly
            and safely. Our certified technicians use the latest tools and technology
            to deliver exceptional results.
          </p>
        </div>

        {/* Services Grid */}
        <div
          ref={gridRef}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
            gap: "2.5rem",
            marginBottom: "4rem",
          }}
        >
          {services.map((service, index) => (
            <div
              key={service.id}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                backdropFilter: "blur(20px)",
                borderRadius: "20px",
                overflow: "hidden",
                border: "1px solid rgba(255, 255, 255, 0.10)",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => handleCardHoverIn(e.currentTarget)}
              onMouseLeave={(e) => handleCardHoverOut(e.currentTarget)}
              onClick={() =>
                setSelectedService(
                  selectedService === service.title ? null : service.title
                )
              }
            >
              {/* Service Image */}
              <div style={{ height: "250px", overflow: "hidden" }}>
                <img
                  src={service.image}
                  alt={service.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.3s ease",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.transform = "scale(1.06)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                />
              </div>

              {/* Service Content */}
              <div style={{ padding: "2rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "1rem",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 600,
                      margin: 0,
                      background: `linear-gradient(45deg, ${ORANGE_PRIMARY}, ${ORANGE_SECONDARY})`,
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {service.title}
                  </h3>
                  <div
                    style={{
                      background: `linear-gradient(45deg, ${ORANGE_PRIMARY}, ${ORANGE_SECONDARY})`,
                      color: "#000000",
                      padding: "0.5rem 1rem",
                      borderRadius: "20px",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      border: "1px solid rgba(255,140,0,0.6)",
                      boxShadow: "0 0 14px rgba(255,140,0,0.3)",
                    }}
                  >
                    {service.price}
                  </div>
                </div>

                <p
                  style={{
                    color: TEXT_SUBTLE,
                    marginBottom: "1.5rem",
                    lineHeight: "1.6",
                  }}
                >
                  {service.description}
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1.5rem",
                    color: "#E5E7EB",
                  }}
                >
                  <span>⏱️ {service.duration}</span>
                  <span>⭐ 4.9/5 Rating</span>
                </div>

                {/* Features List */}
                {selectedService === service.title && (
                  <div
                    style={{
                      marginBottom: "2rem",
                      padding: "1rem",
                      background: "rgba(255, 140, 0, 0.10)", // rgba(255,140,0,.1)
                      borderRadius: "10px",
                      border: "1px solid rgba(255, 140, 0, 0.25)",
                    }}
                  >
                    <h4
                      style={{
                        marginBottom: "0.5rem",
                        fontSize: "1.1rem",
                        color: WHITE,
                      }}
                    >
                      <span
                        style={{
                          background: `linear-gradient(45deg, ${ORANGE_PRIMARY}, ${ORANGE_SECONDARY})`,
                          WebkitBackgroundClip: "text",
                          backgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        Includes:
                      </span>
                    </h4>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                      {service.features.map((feature, i) => (
                        <li
                          key={i}
                          style={{
                            padding: "0.25rem 0",
                            color: "#E5E7EB",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              color: ORANGE_SECONDARY,
                              marginRight: "0.5rem",
                            }}
                          >
                            ✓
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  style={{
                    width: "100%",
                    background: `linear-gradient(45deg, ${ORANGE_PRIMARY}, ${ORANGE_SECONDARY})`,
                    color: "#000000",
                    padding: "1rem 2rem",
                    borderRadius: "50px",
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1.1rem",
                    transition: "all 0.3s ease",
                    boxShadow: "0 0 18px rgba(255,140,0,0.25)",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 0 28px rgba(255,140,0,0.45)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 0 18px rgba(255,140,0,0.25)";
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookService(service.title);
                  }}
                >
                  Book This Service
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div
          ref={ctaRef}
          style={{
            background: `linear-gradient(135deg, rgba(255,140,0,0.10), rgba(255,165,0,0.10))`,
            borderRadius: "20px",
            padding: "3rem",
            textAlign: "center",
            border: "1px solid rgba(255,140,0,0.25)",
            marginBottom: "4rem",
            boxShadow: "inset 0 0 60px rgba(255,140,0,0.10)",
          }}
        >
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              marginBottom: "1rem",
              background: `linear-gradient(45deg, ${ORANGE_PRIMARY}, ${ORANGE_SECONDARY})`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginTop: 0,
            }}
          >
            Ready to Get Started?
          </h2>
          <p
            style={{
              fontSize: "1.25rem",
              color: TEXT_SUBTLE,
              marginBottom: "2rem",
              maxWidth: "600px",
              margin: "0 auto 2rem",
              lineHeight: "1.6",
            }}
          >
            Schedule your service today and experience the Sunny Auto difference.
            Our team is ready to provide exceptional care for your vehicle.
          </p>
          <button
            style={{
              background: `linear-gradient(45deg, ${ORANGE_PRIMARY}, ${ORANGE_SECONDARY})`,
              color: "#000000",
              padding: "1.25rem 3rem",
              borderRadius: "50px",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              fontSize: "1.25rem",
              transition: "all 0.3s ease",
              boxShadow: "0 0 22px rgba(255,140,0,0.35)",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 0 32px rgba(255,140,0,0.5)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 0 22px rgba(255,140,0,0.35)";
            }}
            onClick={() => router.push("/appointment")}
          >
            Book Appointment Now
          </button>
        </div>

        {/* Contact Info */}
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            background: "rgba(255, 255, 255, 0.02)",
            borderRadius: "15px",
            border: "1px solid rgba(255, 255, 255, 0.05)",
          }}
        >
          <h3
            style={{
              fontSize: "1.5rem",
              marginBottom: "1rem",
              background: `linear-gradient(45deg, ${ORANGE_PRIMARY}, ${ORANGE_SECONDARY})`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Questions About Our Services?
          </h3>
          <p style={{ color: "#E5E7EB", marginBottom: "0.5rem" }}>
            📞 Call us: <strong>(555) 123-4567</strong>
          </p>
          <p style={{ color: "#E5E7EB" }}>
            ✉️ Email: <strong>service@sunnyauto.com</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Services;

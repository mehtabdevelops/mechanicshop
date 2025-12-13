"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap"; // kept, but animations disabled

const ORANGE = "#FF8C00";
const ORANGE_LIGHT = "#FFA500";
const ORANGE_DARK = "#CC5500";
const ORANGE_DEEP = "#7F3F00";
const ORANGE_RGBA = (alpha: number) => `rgba(255, 140, 0, ${alpha})`;
const ORANGE_LIGHT_RGBA = (alpha: number) => `rgba(255, 165, 0, ${alpha})`;

const HomePage = () => {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();

  // Refs (kept because UI references them)
  const heroImageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentCardRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const accentLineRef = useRef<HTMLDivElement>(null);
  const floatingAnimationRef = useRef<gsap.core.Tween | null>(null);
  const backgroundPatternRef = useRef<HTMLDivElement>(null);

  const handleSignIn = () => router.push("/signin");
  const handleSignUp = () => router.push("/signup");

  const carImages = [
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1619405399517-d7fce0f13302?auto=format&fit=crop&w=1920&q=80",
  ];

  useEffect(() => {
    // ❌ all gsap animations disabled — keeps build safe
    // If you want to re-enable later, remove the `if(false)` wrapper.
    if (false) {
      const tl = gsap.timeline();
      tl.to(heroImageRef.current, { opacity: 1 });
    }

    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carImages.length);
    }, 7000);

    return () => {
      clearInterval(imageInterval);
    };
  }, []);

  const handleButtonHover = (index: number, isHovering: boolean) => {
    // ❌ disable animation
    return;
  };

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #333333 100%)",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        textAlign: "center",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Background Pattern */}
      <div
        ref={backgroundPatternRef}
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at 25% 25%, ${ORANGE_LIGHT_RGBA(0.15)} 2px, transparent 0),
            radial-gradient(circle at 75% 75%, ${ORANGE_LIGHT_RGBA(0.1)} 1px, transparent 0)
          `,
          backgroundSize: "60px 60px, 40px 40px",
          zIndex: 1,
        }}
      />

      {/* Hero Image */}
      <div
        ref={heroImageRef}
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${carImages[currentImageIndex]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 2,
          filter: "brightness(0.75) contrast(1.15)",
          transition: "background-image 0.8s ease",
        }}
      />

      {/* Overlay */}
      <div
        ref={overlayRef}
        style={{
          position: "absolute",
          inset: 0,
          background: `rgba(0,0,0,0.5)`,
          zIndex: 4,
        }}
      />

      {/* Content Card */}
      <div
        ref={contentCardRef}
        style={{
          position: "relative",
          zIndex: 10,
          background: "rgba(30, 30, 30, 0.85)",
          backdropFilter: "blur(25px)",
          padding: "4rem 3.5rem",
          borderRadius: "20px",
          border: `1px solid ${ORANGE_RGBA(0.45)}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "500px",
          maxWidth: "90%",
        }}
      >
        <div
          ref={accentLineRef}
          style={{
            width: "80%",
            height: "3px",
            background: `linear-gradient(90deg, transparent, ${ORANGE}, ${ORANGE_LIGHT}, ${ORANGE}, transparent)`,
            marginBottom: "20px",
          }}
        />

        <h1
          ref={titleRef}
          style={{
            fontSize: "3.5rem",
            fontWeight: "800",
            background: `linear-gradient(135deg, white, ${ORANGE_LIGHT}, ${ORANGE})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "24px",
          }}
        >
          SUNNY AUTOS
        </h1>

        <p
          ref={subtitleRef}
          style={{
            fontSize: "1.1rem",
            marginBottom: "40px",
            color: "rgba(245,245,245,0.8)",
          }}
        >
          Where Timeless Craftsmanship
          <br />
          Meets Modern Excellence
        </p>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            width: "100%",
          }}
        >
          {[
            { text: "Sign in", action: handleSignIn },
            { text: "Sign Up", action: handleSignUp },
          ].map((button, index) => (
            <button
              key={index}
              ref={(el) => {
                buttonsRef.current[index] = el;
              }}
              style={{
                background: `linear-gradient(135deg, ${ORANGE}, ${ORANGE_DARK})`,
                color: "white",
                padding: "18px 36px",
                borderRadius: "12px",
                border: "none",
                fontSize: "1rem",
                fontWeight: "700",
                cursor: "pointer",
              }}
              onMouseEnter={() => handleButtonHover(index, true)}
              onMouseLeave={() => handleButtonHover(index, false)}
              onClick={button.action}
            >
              {button.text}
            </button>
          ))}
        </div>

        <div
          style={{
            marginTop: "35px",
            width: "60%",
            height: "2px",
            background: `linear-gradient(90deg, transparent, ${ORANGE_RGBA(
              0.45
            )}, transparent)`,
          }}
        />

        <p
          style={{
            marginTop: "24px",
            fontSize: "0.9rem",
            color: "rgba(245,245,245,0.6)",
          }}
        >
          EST. 2009
        </p>
      </div>
    </div>
  );
};

export default HomePage;

"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, TextPlugin);
}

const ORANGE = '#FF8C00';
const ORANGE_LIGHT = '#FFA500';

const AutoServiceShop = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeService, setActiveService] = useState<number | null>(null);
  const router = useRouter();

  // Refs for GSAP animations
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const brandsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef(null);
  const servicesRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const testimonialsRef = useRef(null);
  const galleryRef = useRef(null);
  const processRef = useRef(null);

  const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=2000&auto=format&fit=crop",
      title: "SunnyAuto",
      subtitle: "Our experienced and certified technicians are dedicated to providing you with the highest quality repairs, so you can feel safe and secure on the road."
    },
    {
      image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=2000&auto=format&fit=crop",
      title: "SunnyAuto",
      subtitle: "State-of-the-art diagnostics and repair for optimal performance"
    },
    {
      image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2000&auto=format&fit=crop",
      title: "SunnyAuto",
      subtitle: "ASE certified technicians with decades of combined experience"
    }
  ];

  const brands = ['TESLA', 'TOYOTA', 'HYUNDAI', 'Mercedes-Benz', 'SUZUKI', 'JAGUAR'];

  const services = [
    { 
      title: 'Oil Change & Filter', 
      price: 'From $39.99',
      description: 'Full synthetic oil change with premium filter replacement',
      image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?q=80&w=1000&auto=format&fit=crop',
      duration: '30 mins',
      popular: true
    },
    { 
      title: 'Brake Service', 
      price: 'From $149.99',
      description: 'Complete brake inspection, pad replacement, and rotor resurfacing',
      image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=1000&auto=format&fit=crop',
      duration: '1-2 hours',
      popular: true
    },
    { 
      title: 'Tire Rotation', 
      price: 'From $24.99',
      description: 'Professional tire rotation and pressure adjustment',
      image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?q=80&w=1000&auto=format&fit=crop',
      duration: '20 mins',
      popular: false
    },
    { 
      title: 'Engine Diagnostic', 
      price: 'From $89.99',
      description: 'Comprehensive computer diagnostic and system check',
      image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=1000&auto=format&fit=crop',
      duration: '1 hour',
      popular: true
    },
    { 
      title: 'AC Service', 
      price: 'From $129.99',
      description: 'AC system inspection, recharge, and leak detection',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1000&auto=format&fit=crop',
      duration: '45 mins',
      popular: false
    },
    { 
      title: 'Transmission Service', 
      price: 'From $189.99',
      description: 'Fluid exchange and transmission system maintenance',
      image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1000&auto=format&fit=crop',
      duration: '2 hours',
      popular: false
    }
  ];

  const processSteps = [
    { 
      step: '01', 
      title: 'Book Online', 
      description: 'Schedule your appointment with our easy online booking system',
      icon: '📅'
    },
    { 
      step: '02', 
      title: 'Drop Off', 
      description: 'Bring your vehicle to our service center at your scheduled time',
      icon: '🚗'
    },
    { 
      step: '03', 
      title: 'Diagnosis', 
      description: 'Our experts thoroughly inspect and diagnose your vehicle',
      icon: '🔍'
    },
    { 
      step: '04', 
      title: 'Approval', 
      description: 'We provide a detailed estimate and get your approval before any work',
      icon: '✓'
    },
    { 
      step: '05', 
      title: 'Service', 
      description: 'Our certified technicians perform the necessary repairs',
      icon: '🔧'
    },
    { 
      step: '06', 
      title: 'Pick Up', 
      description: 'Your vehicle is ready! We explain all work completed',
      icon: '🔑'
    }
  ];

  const beforeAfterGallery = [
    {
      before: 'https://images.unsplash.com/photo-1565043666747-69f6646db940?q=80&w=1000&auto=format&fit=crop',
      after: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1000&auto=format&fit=crop',
      title: 'Complete Restoration'
    },
    {
      before: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=1000&auto=format&fit=crop',
      after: 'https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?q=80&w=1000&auto=format&fit=crop',
      title: 'Engine Overhaul'
    },
    {
      before: 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=1000&auto=format&fit=crop',
      after: 'https://images.unsplash.com/photo-1462396881884-de2c07cb95ed?q=80&w=1000&auto=format&fit=crop',
      title: 'Paint & Body Work'
    }
  ];

  useEffect(() => {
    setIsClient(true);

    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 2500);

    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearInterval(slideInterval);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [heroSlides.length]);

  useEffect(() => {
    if (!showWelcome && isClient) {
      // Initial animations
      const tl = gsap.timeline();

      tl.fromTo(navRef.current, 
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
      ).fromTo(logoRef.current,
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      );

      tl.fromTo(titleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
        "-=0.3"
      ).fromTo(subtitleRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        "-=0.5"
      ).fromTo(buttonsRef.current,
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" },
        "-=0.3"
      );

      // Scroll-triggered animations
      ScrollTrigger.defaults({ 
        toggleActions: "play none none reverse",
        markers: false 
      });

      // Parallax effect on hero
      if (heroRef.current) {
        gsap.to(heroRef.current, {
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
            invalidateOnRefresh: true
          },
          y: 100,
          opacity: 0.7
        });
      }

      // Brands animation
      if (brandsRef.current) {
        gsap.fromTo(brandsRef.current.children,
          { x: -50, opacity: 0 },
          {
            scrollTrigger: {
              trigger: brandsRef.current,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            },
            x: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out"
          }
        );
      }

      // Stats counter animation
      if (statsRef.current) {
        const statElements = (statsRef.current as HTMLElement).querySelectorAll('.stat-number');
        statElements.forEach((stat) => {
          const endValue = stat.textContent;
          const isPercentage = endValue.includes('%');
          const hasPlus = endValue.includes('+');
          const numericValue = parseFloat(endValue.replace(/[^0-9.]/g, ''));
          
          ScrollTrigger.create({
            trigger: stat,
            start: "top 80%",
            onEnter: () => {
              gsap.from(stat, {
                textContent: 0,
                duration: 2,
                ease: "power2.out",
                snap: { textContent: 0.1 },
                onUpdate: function() {
                  const current = parseFloat(this.targets()[0].textContent);
                  const suffix = isPercentage ? '%' : (hasPlus ? '+' : '');
                  if (endValue.includes('/')) {
                    this.targets()[0].textContent = '24/7';
                  } else {
                    this.targets()[0].textContent = current.toFixed(1) + suffix;
                  }
                },
                onComplete: function() {
                  stat.textContent = endValue;
                }
              });
            },
            once: true
          });
        });
      }

      // Services cards animation with stagger
      if (servicesRef.current) {
        const serviceCards = servicesRef.current.querySelectorAll('.service-card');
        
        ScrollTrigger.batch(serviceCards, {
          onEnter: batch => gsap.fromTo(batch, 
            {
              opacity: 0,
              y: 50,
              scale: 0.9
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              stagger: 0.15,
              ease: "power3.out",
              overwrite: true
            }
          ),
          onLeave: batch => gsap.to(batch, {
            opacity: 0.3,
            y: -50,
            scale: 0.95,
            duration: 0.5,
            stagger: 0.15,
            overwrite: true
          }),
          onEnterBack: batch => gsap.to(batch, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.15,
            overwrite: true
          }),
          onLeaveBack: batch => gsap.to(batch, {
            opacity: 0,
            y: 50,
            scale: 0.9,
            duration: 0.5,
            stagger: 0.15,
            overwrite: true
          }),
          start: "top 85%",
          end: "bottom 15%"
        });
      }

      // About section text reveal
      if (aboutRef.current) {
        const aboutText = (aboutRef.current as HTMLElement).querySelectorAll('p, h2, h3');
        
        gsap.fromTo(aboutText,
          {
            opacity: 0,
            y: 30,
            clipPath: "inset(100% 0% 0% 0%)"
          },
          {
            scrollTrigger: {
              trigger: aboutRef.current,
              start: "top 70%",
              end: "bottom 30%",
              toggleActions: "play none none reverse"
            },
            opacity: 1,
            y: 0,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out"
          }
        );
      }

      // Process steps animation
      if (processRef.current) {
        const steps = (processRef.current as HTMLElement).querySelectorAll('.process-step');
        
        steps.forEach((step, index) => {
          gsap.fromTo(step,
            {
              opacity: 0,
              x: index % 2 === 0 ? -50 : 50,
              rotateY: index % 2 === 0 ? -15 : 15
            },
            {
              scrollTrigger: {
                trigger: step,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
              },
              opacity: 1,
              x: 0,
              rotateY: 0,
              duration: 0.8,
              delay: index * 0.1,
              ease: "power3.out"
            }
          );
        });

        // Connecting lines animation
        const lines = (processRef.current as HTMLElement).querySelectorAll('.process-line');
        lines.forEach((line, index) => {
          gsap.fromTo(line,
            { scaleX: 0 },
            {
              scrollTrigger: {
                trigger: line,
                start: "top 75%",
                end: "bottom 25%",
                toggleActions: "play none none reverse"
              },
              scaleX: 1,
              duration: 0.6,
              delay: index * 0.15,
              ease: "power2.inOut"
            }
          );
        });
      }

      // Gallery animation
      if (galleryRef.current) {
        const galleryItems = (galleryRef.current as HTMLElement).querySelectorAll('.gallery-item');
        
        galleryItems.forEach((item, index) => {
          const slider = item.querySelector('.before-after-slider');
          
          ScrollTrigger.create({
            trigger: item,
            start: "top 70%",
            end: "bottom 30%",
            onEnter: () => {
              gsap.to(slider, {
                x: '100%',
                duration: 2,
                ease: "power2.inOut"
              });
            },
            onLeaveBack: () => {
              gsap.to(slider, {
                x: '50%',
                duration: 1,
                ease: "power2.inOut"
              });
            }
          });
        });
      }

      // Testimonials fade in
      if (testimonialsRef.current) {
        const testimonialCards = (testimonialsRef.current as HTMLElement).querySelectorAll('.testimonial-card');
        
        gsap.fromTo(testimonialCards,
          { 
            opacity: 0,
            scale: 0.8,
            rotateX: 10
          },
          {
            scrollTrigger: {
              trigger: testimonialsRef.current,
              start: "top 70%",
              end: "bottom 30%",
              toggleActions: "play none none reverse"
            },
            opacity: 1,
            scale: 1,
            rotateX: 0,
            duration: 0.7,
            stagger: 0.2,
            ease: "back.out(1.7)"
          }
        );
      }

      // Sticky navigation background on scroll
      ScrollTrigger.create({
        start: "top -50",
        end: 99999,
        toggleClass: { className: "nav-scrolled", targets: navRef.current }
      });

      ScrollTrigger.refresh();
    }
  }, [showWelcome, isClient]);

  const handleBookAppointment = () => router.push('/Appointment');
  const handleProfile = () => router.push('/UserProfile');
  const handleViewServices = () => router.push('/Services');
  const handleContactUs = () => router.push('/Contactus'); // Fixed route

  const handleNavigation = (path: string): void => {
    router.push(path);
  };

  if (!isClient) {
    return null;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      overflowX: 'hidden',
      position: 'relative'
    }} suppressHydrationWarning>

      {/* Welcome Animation */}
      {showWelcome && (
        <div style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000000',
          zIndex: 1000
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ animation: 'fadeIn 1s ease-in-out' }}>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: '600',
                marginBottom: '0.75rem',
                letterSpacing: '1px'
              }}>
                <span style={{ color: ORANGE }}>Sunny</span>
                <span style={{ color: '#ffffff' }}>Auto</span>
              </h1>
              <div style={{
                width: '120px',
                height: '2px',
                background: `linear-gradient(90deg, transparent, ${ORANGE}, transparent)`,
                margin: '0 auto 0.75rem'
              }}></div>
              <p style={{
                fontSize: '1rem',
                opacity: 0,
                animation: 'fadeIn 1.5s ease-in-out 0.5s forwards',
                color: '#9ca3af',
                fontWeight: '300'
              }}>
                Premium Automotive Care
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav ref={navRef} className="main-nav" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: 'transparent',
        padding: '2rem 3rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1000,
        transition: 'all 0.3s ease'
      }}>
        <div ref={logoRef} style={{ cursor: 'pointer' }} onClick={() => handleNavigation('/UserHome')}>
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: '700',
            margin: 0
          }}>
            <span style={{ color: ORANGE }}>SUNNY</span>
            <span style={{ color: '#ffffff' }}>AUTO</span>
          </h1>
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '3rem',
          alignItems: 'center'
        }}>
          {[
            { label: 'HOME', path: '/UserHome' },
            { label: 'SERVICES', path: '/Services' },
            { label: 'ABOUT', path: '/About' },
            { label: 'APPOINTMENTS', path: '/Appointment' },
            { label: 'CONTACT', path: '/Contactus' } // Fixed route
          ].map((item) => (
            <button
              key={item.label}
              style={{
                color: item.label === 'SERVICES' || item.label === 'APPOINTMENTS' ? ORANGE : 'rgba(255, 255, 255, 0.9)',
                fontSize: '0.875rem',
                fontWeight: '700',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem 0',
                transition: 'all 0.3s ease',
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = ORANGE;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = item.label === 'SERVICES' || item.label === 'APPOINTMENTS' ? ORANGE : 'rgba(255, 255, 255, 0.9)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              onClick={() => handleNavigation(item.path)}
            >
              {item.label}
            </button>
          ))}
          <button style={{
            background: 'transparent',
            color: '#ffffff',
            padding: '0.75rem 2rem',
            borderRadius: '0',
            fontWeight: '700',
            border: '2px solid #ffffff',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '0.875rem',
            letterSpacing: '0.5px',
            textTransform: 'uppercase'
          }} 
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.color = '#000000';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#ffffff';
          }}
          onClick={handleProfile}>
            PROFILE
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} style={{
        position: 'relative',
        height: '100vh',
        width: '100%',
        overflow: 'hidden'
      }}>
        {/* Background Image */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${heroSlides[currentSlide].image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'background-image 1.5s ease-in-out',
          filter: 'brightness(0.5)'
        }}></div>

        {/* Gradient Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 40%, transparent 100%)',
          pointerEvents: 'none'
        }}></div>
        
        {/* Hero Content - Left Aligned */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '8%',
          transform: 'translateY(-50%)',
          maxWidth: '600px',
          zIndex: 10
        }}>
          {/* Orange Accent Line */}
          <div style={{
            width: '3px',
            height: '200px',
            background: ORANGE,
            position: 'absolute',
            left: '-40px',
            top: '50%',
            transform: 'translateY(-50%)'
          }}></div>

          <h1 ref={titleRef} style={{
            fontSize: '3.5rem',
            fontWeight: '500',
            lineHeight: 1.2,
            marginBottom: '1.5rem'
          }}>
            <span style={{ color: ORANGE }}>{heroSlides[currentSlide].title}</span>
            <span style={{ color: '#ffffff', display: 'block' }}>- Drive with Confidence</span>
          </h1>
          <p ref={subtitleRef} style={{
            fontSize: '1.1rem',
            color: 'rgba(255, 255, 255, 0.7)',
            fontWeight: '300',
            lineHeight: '1.6',
            marginBottom: '2rem'
          }}>
            {heroSlides[currentSlide].subtitle}
          </p>
          
          {/* CTA Buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center'
          }}>
            <button
              ref={el => { buttonsRef.current[0] = el }}
              style={{
                background: ORANGE,
                color: 'white',
                padding: '0.875rem 2rem',
                borderRadius: '6px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.95rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = ORANGE_LIGHT;
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = ORANGE;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              onClick={handleBookAppointment}
            >
              Book Appointment
            </button>
            <button
              ref={el => { buttonsRef.current[1] = el }}
              style={{
                background: 'transparent',
                color: 'white',
                padding: '0.875rem 2rem',
                borderRadius: '6px',
                fontWeight: '600',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                cursor: 'pointer',
                fontSize: '0.95rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              }}
              onClick={handleViewServices}
            >
              View Services
            </button>
          </div>
        </div>

        {/* Slide Indicators */}
        <div style={{
          position: 'absolute',
          bottom: '3rem',
          left: '8%',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          zIndex: 10
        }}>
          <span style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '0.9rem',
            fontWeight: '500'
          }}>
            {String(currentSlide + 1).padStart(2, '0')}/{String(heroSlides.length).padStart(2, '0')}
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {heroSlides.map((_, index) => (
              <div
                key={index}
                style={{
                  width: '40px',
                  height: '2px',
                  background: index === currentSlide ? ORANGE : 'rgba(255, 255, 255, 0.3)',
                  transition: 'background 0.3s ease',
                  cursor: 'pointer'
                }}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>

        {/* Social Icons */}
        <div style={{
          position: 'fixed',
          right: '3rem',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          zIndex: 100
        }}>
          {['f', 't', 'in', 'ig'].map((icon) => (
            <div key={icon} style={{
              width: '40px',
              height: '40px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '0.9rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 140, 0, 0.1)';
              e.currentTarget.style.borderColor = ORANGE;
              e.currentTarget.style.color = ORANGE;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
            }}>
              {icon}
            </div>
          ))}
        </div>
      </section>

      {/* Brands Section */}
      <section style={{
        background: '#0a0a0a',
        padding: '4rem 3rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          <div ref={brandsRef} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '3rem'
          }}>
            {brands.map((brand) => (
              <div key={brand} style={{
                opacity: 0.5,
                transition: 'opacity 0.3s ease',
                fontSize: '1.2rem',
                fontWeight: '300',
                letterSpacing: '2px',
                cursor: 'default'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.5'}>
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} style={{
        padding: '5rem 2rem',
        background: '#000000'
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '700',
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, #ffffff 0%, #9ca3af 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Why Choose Sunny Auto?
          </h2>
          <p style={{
            fontSize: '1rem',
            color: '#9ca3af',
            lineHeight: '1.7',
            marginBottom: '2rem',
            maxWidth: '700px',
            margin: '0 auto 2rem'
          }}>
            With over a decade of experience, Sunny Auto has established itself as the premier automotive service center 
            in the region. Our commitment to excellence, combined with state-of-the-art diagnostic equipment and factory-trained 
            technicians, ensures your vehicle receives the highest quality care.
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginTop: '3rem'
          }}>
            {[
              {
                title: 'Expert Technicians',
                description: 'Our ASE-certified technicians have an average of 10+ years experience with specialized training.'
              },
              {
                title: 'Advanced Diagnostics',
                description: 'We utilize the latest diagnostic technology to accurately identify and solve complex problems.'
              },
              {
                title: 'Quality Parts',
                description: 'We source only OEM and premium aftermarket parts backed by comprehensive warranties.'
              },
              {
                title: 'Transparent Pricing',
                description: 'No hidden fees or surprises. Detailed estimates provided before any work begins.'
              }
            ].map((feature, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '2rem 1.5rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                textAlign: 'left',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-50%',
                  right: '-50%',
                  width: '200%',
                  height: '200%',
                  background: 'radial-gradient(circle, rgba(255,140,0,0.1) 0%, transparent 70%)',
                  pointerEvents: 'none',
                  opacity: 0,
                  transition: 'opacity 0.3s ease'
                }} className="hover-glow"></div>
                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  marginBottom: '0.75rem',
                  color: 'white'
                }}>
                  {feature.title}
                </h3>
                <p style={{ 
                  color: '#9ca3af',
                  lineHeight: '1.6',
                  fontSize: '0.9rem',
                  margin: 0
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{
        padding: '4rem 2rem',
        background: '#111111'
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          <div ref={statsRef} style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem'
          }}>
            {[
              { number: '12+', label: 'Years of Excellence' },
              { number: '8500+', label: 'Satisfied Customers' },
              { number: '98.7%', label: 'Customer Satisfaction' },
              { number: '24/7', label: 'Emergency Support' }
            ].map((stat, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '2rem 1rem',
                borderRadius: '8px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div className="stat-number" style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  background: `linear-gradient(135deg, ${ORANGE} 0%, ${ORANGE_LIGHT} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '0.5rem'
                }}>
                  {stat.number}
                </div>
                <div style={{
                  color: '#9ca3af',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Services Section with Images */}
      <section ref={servicesRef} style={{
        padding: '5rem 2rem',
        background: '#000000'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '700',
            marginBottom: '3rem',
            textAlign: 'center',
            color: '#ffffff'
          }}>
            Popular Services
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem'
          }}>
            {services.map((service, index) => (
              <div 
                key={index} 
                className="service-card"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                  e.currentTarget.style.borderColor = ORANGE;
                  const overlay = e.currentTarget.querySelector('.service-overlay') as HTMLElement;
                  if (overlay) overlay.style.opacity = '0.7';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  const overlay = e.currentTarget.querySelector('.service-overlay') as HTMLElement;
                  if (overlay) overlay.style.opacity = '0.4';
                }}
                onClick={() => setActiveService(index === activeService ? null : index)}
              >
                {/* Service Image */}
                <div style={{
                  position: 'relative',
                  height: '200px',
                  overflow: 'hidden'
                }}>
                  <img 
                    src={service.image} 
                    alt={service.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                  <div 
                    className="service-overlay"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.8))',
                      opacity: 0.4,
                      transition: 'opacity 0.3s ease'
                    }}
                  />
                  {service.popular && (
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: ORANGE,
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Popular
                    </div>
                  )}
                </div>
                
                {/* Service Details */}
                <div style={{
                  padding: '1.5rem'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '0.75rem'
                  }}>
                    <h3 style={{
                      fontSize: '1.2rem',
                      fontWeight: '600',
                      color: 'white'
                    }}>
                      {service.title}
                    </h3>
                    <span style={{
                      color: ORANGE,
                      fontSize: '1.1rem',
                      fontWeight: '600'
                    }}>
                      {service.price}
                    </span>
                  </div>
                  
                  <p style={{
                    color: '#9ca3af',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                    marginBottom: '1rem'
                  }}>
                    {service.description}
                  </p>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    fontSize: '0.85rem',
                    color: '#9ca3af'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      ⏱️ {service.duration}
                    </span>
                    <span style={{
                      color: ORANGE,
                      cursor: 'pointer'
                    }}>
                      Learn more →
                    </span>
                  </div>
                  
                  {/* Expandable Details */}
                  {activeService === index && (
                    <div style={{
                      marginTop: '1rem',
                      paddingTop: '1rem',
                      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                      animation: 'slideDown 0.3s ease'
                    }}>
                      <button style={{
                        background: ORANGE,
                        color: 'white',
                        padding: '0.5rem 1.5rem',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        width: '100%'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookAppointment();
                      }}>
                        Book This Service
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            textAlign: 'center',
            marginTop: '3rem'
          }}>
            <button style={{
              background: ORANGE,
              color: 'white',
              padding: '1rem 2.5rem',
              borderRadius: '6px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = ORANGE_LIGHT;
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = ORANGE;
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            onClick={handleViewServices}>
              View All Services
            </button>
          </div>
        </div>
      </section>

      {/* Our Process Section */}
      <section ref={processRef} style={{
        padding: '5rem 2rem',
        background: '#0a0a0a',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '700',
            marginBottom: '1rem',
            textAlign: 'center',
            color: '#ffffff'
          }}>
            Our Service Process
          </h2>
          <p style={{
            fontSize: '1rem',
            color: '#9ca3af',
            textAlign: 'center',
            marginBottom: '3rem',
            maxWidth: '600px',
            margin: '0 auto 3rem'
          }}>
            Experience seamless automotive service from start to finish
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '2rem',
            position: 'relative'
          }}>
            {processSteps.map((step, index) => (
              <div key={index} style={{ position: 'relative' }}>
                <div 
                  className="process-step"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '2rem 1.5rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    zIndex: 2
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 140, 0, 0.1)';
                    e.currentTarget.style.borderColor = ORANGE;
                    e.currentTarget.style.transform = 'translateY(-5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{
                    fontSize: '2rem',
                    marginBottom: '1rem'
                  }}>
                    {step.icon}
                  </div>
                  <div style={{
                    color: ORANGE,
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    marginBottom: '0.5rem',
                    letterSpacing: '1px'
                  }}>
                    STEP {step.step}
                  </div>
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    marginBottom: '0.5rem',
                    color: 'white'
                  }}>
                    {step.title}
                  </h3>
                  <p style={{
                    color: '#9ca3af',
                    fontSize: '0.85rem',
                    lineHeight: '1.4'
                  }}>
                    {step.description}
                  </p>
                </div>
                
                {/* Connecting Line */}
                {index < processSteps.length - 1 && (
                  <div 
                    className="process-line"
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '100%',
                      width: 'calc(100% - 80px)',
                      height: '2px',
                      background: `linear-gradient(90deg, ${ORANGE}, rgba(255, 140, 0, 0.3))`,
                      transformOrigin: 'left center',
                      zIndex: 1
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before & After Gallery */}
      <section ref={galleryRef} style={{
        padding: '5rem 2rem',
        background: '#000000'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '700',
            marginBottom: '3rem',
            textAlign: 'center',
            color: '#ffffff'
          }}>
            Our Work Speaks for Itself
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem'
          }}>
            {beforeAfterGallery.map((item, index) => (
              <div 
                key={index}
                className="gallery-item"
                style={{
                  position: 'relative',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  height: '300px',
                  cursor: 'pointer'
                }}
              >
                {/* Before Image */}
                <img 
                  src={item.before}
                  alt="Before"
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                
                {/* After Image with Slider */}
                <div 
                  className="before-after-slider"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '50%',
                    height: '100%',
                    overflow: 'hidden',
                    borderRight: `3px solid ${ORANGE}`
                  }}
                >
                  <img 
                    src={item.after}
                    alt="After"
                    style={{
                      position: 'absolute',
                      width: '100vw',
                      maxWidth: 'none',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
                
                {/* Labels */}
                <div style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '20px',
                  right: '20px',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span style={{
                    background: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}>
                    BEFORE
                  </span>
                  <span style={{
                    background: ORANGE,
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}>
                    AFTER
                  </span>
                </div>
                
                <h3 style={{
                  position: 'absolute',
                  top: '20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(0,0,0,0.8)',
                  color: 'white',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  whiteSpace: 'nowrap'
                }}>
                  {item.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialsRef} style={{
        padding: '5rem 2rem',
        background: '#111111'
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '700',
            marginBottom: '3rem',
            textAlign: 'center',
            color: '#ffffff'
          }}>
            What Our Customers Say
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {[
              {
                name: 'Sarah Johnson',
                review: 'Outstanding service! They diagnosed and fixed my car\'s issue quickly. Fair pricing and honest recommendations.',
                rating: 5,
                vehicle: '2022 Honda Accord',
                service: 'Engine Diagnostic'
              },
              {
                name: 'Michael Chen',
                review: 'Best auto shop in town. Professional staff, quality work, and they always explain everything clearly.',
                rating: 5,
                vehicle: '2021 Tesla Model 3',
                service: 'Brake Service'
              },
              {
                name: 'Emily Rodriguez',
                review: 'I\'ve been coming here for years. Trustworthy, reliable, and they stand behind their work. Highly recommend!',
                rating: 5,
                vehicle: '2020 Toyota RAV4',
                service: 'Regular Maintenance'
              }
            ].map((testimonial, index) => (
              <div 
                key={index} 
                className="testimonial-card"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '2rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '20px',
                  fontSize: '3rem',
                  color: 'rgba(255, 140, 0, 0.2)'
                }}>
                  "
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} style={{ color: ORANGE, fontSize: '1.2rem' }}>★</span>
                  ))}
                </div>
                
                <p style={{
                  color: '#d1d5db',
                  fontSize: '0.95rem',
                  lineHeight: '1.6',
                  marginBottom: '1rem',
                  fontStyle: 'italic'
                }}>
                  "{testimonial.review}"
                </p>
                
                <div style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  paddingTop: '1rem'
                }}>
                  <p style={{
                    color: '#ffffff',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    marginBottom: '0.25rem'
                  }}>
                    - {testimonial.name}
                  </p>
                  <p style={{
                    color: '#9ca3af',
                    fontSize: '0.8rem'
                  }}>
                    {testimonial.vehicle} • {testimonial.service}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Your Team Section */}
      <section style={{
        padding: '5rem 2rem',
        background: '#000000'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '700',
            marginBottom: '1rem',
            color: '#ffffff'
          }}>
            Meet Your Expert Team
          </h2>
          <p style={{
            fontSize: '1rem',
            color: '#9ca3af',
            marginBottom: '3rem',
            maxWidth: '600px',
            margin: '0 auto 3rem'
          }}>
            Our certified technicians bring decades of combined experience to every service
          </p>
          
          <button style={{
            background: 'transparent',
            color: ORANGE,
            padding: '0.875rem 2rem',
            borderRadius: '6px',
            fontWeight: '600',
            border: `2px solid ${ORANGE}`,
            cursor: 'pointer',
            fontSize: '0.95rem',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = ORANGE;
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = ORANGE;
          }}
          onClick={handleContactUs}>
            Contact Us
          </button>
        </div>
      </section>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideDown {
          from { 
            opacity: 0;
            transform: translateY(-10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .main-nav.nav-scrolled {
          background: rgba(0, 0, 0, 0.95) !important;
          backdrop-filter: blur(10px);
          box-shadow: 0 2px 20px rgba(0,0,0,0.5);
        }
        
        .hover-glow:hover {
          opacity: 1 !important;
        }
        
        .service-card {
          transform-style: preserve-3d;
          perspective: 1000px;
        }
        
        .testimonial-card {
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  );
};

export default AutoServiceShop;
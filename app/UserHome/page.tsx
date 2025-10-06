"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';

const AutoServiceShop = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  // Refs for GSAP animations
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const brandsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef(null);
  const servicesRef = useRef(null);

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

  useEffect(() => {
    setIsClient(true);

    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 2500);

    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    if (!showWelcome) {
      const tl = gsap.timeline();

      // Navigation animation
      tl.fromTo(navRef.current, 
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
      ).fromTo(logoRef.current,
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      );

      // Hero content animation
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

      // Brands animation
      if (brandsRef.current) {
        gsap.fromTo(brandsRef.current.children,
          { x: -50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            delay: 1
          }
        );
      }
    }

    return () => {
      clearTimeout(timer);
      clearInterval(slideInterval);
    };
  }, [showWelcome, heroSlides.length]);

  const handleBookAppointment = () => router.push('/Appointment');
  const handleProfile = () => router.push('/UserProfile');
  const handleViewServices = () => router.push('/Services');
  interface NavigationPath {
    path: string;
  }

  const handleNavigation = (path: string): void => router.push(path);

  if (!isClient) {
    return null;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      overflowX: 'hidden'
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
                <span style={{ color: '#dc2626' }}>Sunny</span>
                <span style={{ color: '#ffffff' }}>Auto</span>
              </h1>
              <div style={{
                width: '120px',
                height: '2px',
                background: 'linear-gradient(90deg, transparent, #dc2626, transparent)',
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
      <nav ref={navRef} style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: 'rgba(0, 0, 0, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '1.5rem 3rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1000
      }}>
        <div ref={logoRef} style={{ cursor: 'pointer' }} onClick={() => handleNavigation('/UserHome')}>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            margin: 0
          }}>
            <span style={{ color: '#dc2626' }}>Sunny</span>
            <span style={{ color: '#ffffff' }}>Auto</span>
          </h1>
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '2.5rem',
          alignItems: 'center'
        }}>
          {['Home', 'Services', 'About', 'Gallery', 'Contact'].map((item) => (
            <button
              key={item}
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.95rem',
                fontWeight: '400',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem 0',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}
              onClick={() => handleNavigation(item === 'Home' ? '/UserHome' : `/${item}`)}
            >
              {item}
            </button>
          ))}
          <button style={{
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            padding: '0.5rem 1.5rem',
            borderRadius: '6px',
            fontWeight: '500',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontSize: '0.9rem'
          }} 
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#dc2626';
            e.currentTarget.style.borderColor = '#dc2626';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }}
          onClick={handleProfile}>
            Profile
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
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
          filter: 'brightness(0.6)'
        }}></div>

        {/* Gradient Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 40%, transparent 100%)',
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
          {/* Red Accent Line */}
          <div style={{
            width: '3px',
            height: '200px',
            background: '#dc2626',
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
            <span style={{ color: '#dc2626' }}>{heroSlides[currentSlide].title}</span>
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
                background: '#dc2626',
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
                e.currentTarget.style.background = '#b91c1c';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#dc2626';
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
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
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
                  background: index === currentSlide ? '#dc2626' : 'rgba(255, 255, 255, 0.3)',
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
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
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
      <section style={{
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
                textAlign: 'left'
              }}>
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
        background: '#111827'
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
              { number: '8,500+', label: 'Satisfied Customers' },
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
                <div style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
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

      {/* Popular Services Section */}
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {[
              { 
                title: 'Oil Change & Filter', 
                price: 'From $39.99',
                description: 'Full synthetic oil change with premium filter replacement'
              },
              { 
                title: 'Brake Service', 
                price: 'From $149.99',
                description: 'Complete brake inspection, pad replacement, and rotor resurfacing'
              },
              { 
                title: 'Tire Rotation', 
                price: 'From $24.99',
                description: 'Professional tire rotation and pressure adjustment'
              },
              { 
                title: 'Engine Diagnostic', 
                price: 'From $89.99',
                description: 'Comprehensive computer diagnostic and system check'
              },
              { 
                title: 'AC Service', 
                price: 'From $129.99',
                description: 'AC system inspection, recharge, and leak detection'
              },
              { 
                title: 'Transmission Service', 
                price: 'From $189.99',
                description: 'Fluid exchange and transmission system maintenance'
              }
            ].map((service, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '2rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = '#dc2626';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}>
                <h3 style={{
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: 'white'
                }}>
                  {service.title}
                </h3>
                <p style={{
                  color: '#dc2626',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  marginBottom: '0.75rem'
                }}>
                  {service.price}
                </p>
                <p style={{
                  color: '#9ca3af',
                  fontSize: '0.9rem',
                  lineHeight: '1.5'
                }}>
                  {service.description}
                </p>
              </div>
            ))}
          </div>

          <div style={{
            textAlign: 'center',
            marginTop: '3rem'
          }}>
            <button style={{
              background: '#dc2626',
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
              e.currentTarget.style.background = '#b91c1c';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#dc2626';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            onClick={handleViewServices}>
              View All Services
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={{
        padding: '5rem 2rem',
        background: '#111827'
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
                rating: 5
              },
              {
                name: 'Michael Chen',
                review: 'Best auto shop in town. Professional staff, quality work, and they always explain everything clearly.',
                rating: 5
              },
              {
                name: 'Emily Rodriguez',
                review: 'I\'ve been coming here for years. Trustworthy, reliable, and they stand behind their work. Highly recommend!',
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '2rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{ marginBottom: '1rem' }}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} style={{ color: '#dc2626', fontSize: '1.2rem' }}>★</span>
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
                <p style={{
                  color: '#ffffff',
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}>
                  - {testimonial.name}
                </p>
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
            color: '#dc2626',
            padding: '0.875rem 2rem',
            borderRadius: '6px',
            fontWeight: '600',
            border: '2px solid #dc2626',
            cursor: 'pointer',
            fontSize: '0.95rem',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#dc2626';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#dc2626';
          }}>
            Meet Our Team
          </button>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default AutoServiceShop;
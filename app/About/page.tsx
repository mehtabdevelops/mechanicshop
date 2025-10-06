"use client";

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';

const About = () => {
  const router = useRouter();
  
  // Simple refs for subtle animations
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);

  const teamMembers = [
    {
      name: 'Michael Rodriguez',
      position: 'Head Mechanic',
      experience: '15+ years',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      quote: 'Every car tells a story. I listen and fix.'
    },
    {
      name: 'Sarah Johnson',
      position: 'Service Manager',
      experience: '12+ years', 
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      quote: 'Your satisfaction is our top priority.'
    },
    {
      name: 'David Chen',
      position: 'Electrical Systems Expert',
      experience: '10+ years',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      quote: 'Solving complex problems is my passion.'
    },
    {
      name: 'Emily Williams', 
      position: 'Brake & Suspension Specialist',
      experience: '8+ years',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      quote: 'Keeping your family safe on the road.'
    }
  ];

  const values = [
    {
      icon: '⚡',
      title: 'Quick Service',
      description: 'Most services completed within 2 hours'
    },
    {
      icon: '✅', 
      title: 'Quality Work',
      description: '12-month/12,000-mile warranty on all repairs'
    },
    {
      icon: '💎',
      title: 'Honest Pricing',
      description: 'Transparent pricing with no hidden fees'
    },
    {
      icon: '🤝',
      title: 'Trustworthy',
      description: 'We only recommend necessary repairs'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Happy Customers' },
    { number: '15+', label: 'Years Experience' },
    { number: '98%', label: 'Satisfaction Rate' },
    { number: '24/7', label: 'Roadside Support' }
  ];

  useEffect(() => {
    // Simple fade-in animations
    const elements = [
      heroRef.current,
      statsRef.current,
      storyRef.current, 
      valuesRef.current,
      teamRef.current
    ].filter(Boolean);

    gsap.fromTo(elements, 
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1,
        stagger: 0.2,
        ease: "power2.out"
      }
    );

    // Subtle hover effects for cards
    const cards = document.querySelectorAll('.hover-card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, { y: -5, duration: 0.3, ease: "power2.out" });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { y: 0, duration: 0.3, ease: "power2.out" });
      });
    });
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F5F5DC',
      color: '#2F4F4F',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Navigation */}
      <nav style={{
        background: 'rgba(47, 79, 79, 0.95)',
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.2)'
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #d4af37, #f4e5b8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          cursor: 'pointer'
        }} onClick={() => router.push('/')}>
          SUNNY AUTO
        </h1>
        
        <button 
          onClick={() => router.push('/UserHome')}
          style={{
            background: 'rgba(212, 175, 55, 0.1)',
            color: '#d4af37',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(212, 175, 55, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)';
          }}
        >
          Back to Home
        </button>
      </nav>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem'
      }}>
        {/* Hero Section */}
        <div ref={heroRef} style={{ opacity: 0, textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #d4af37, #f4e5b8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '1.5rem'
          }}>
            About Sunny Auto
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: '#2F4F4F',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            For over 15 years, we've been the trusted auto care partner for thousands of drivers. 
            Excellence and customer satisfaction drive everything we do.
          </p>
        </div>

        {/* Stats Section */}
        <div ref={statsRef} style={{ opacity: 0, marginBottom: '4rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem'
          }}>
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="hover-card"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '2rem 1rem',
                  borderRadius: '12px',
                  textAlign: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  color: '#d4af37',
                  marginBottom: '0.5rem'
                }}>
                  {stat.number}
                </div>
                <div style={{ color: 'rgba(47, 79, 79, 0.7)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Story Section */}
        <div ref={storyRef} style={{ opacity: 0, marginBottom: '4rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '3rem',
            alignItems: 'center'
          }}>
            <div>
              <h2 style={{
                fontSize: '2.5rem',
                fontWeight: '600',
                color: '#d4af37',
                marginBottom: '1.5rem'
              }}>
                Our Story
              </h2>
              <p style={{
                color: 'rgba(47, 79, 79, 0.8)',
                lineHeight: '1.6',
                marginBottom: '1.5rem'
              }}>
                Founded in 2009 by automotive enthusiast James Wilson, Sunny Auto started as a small 
                neighborhood garage with a big dream: to provide honest, reliable auto care that 
                customers could trust.
              </p>
              <p style={{
                color: 'rgba(47, 79, 79, 0.8)',
                lineHeight: '1.6',
                marginBottom: '2rem'
              }}>
                Today, we've grown into a full-service automotive center with state-of-the-art 
                equipment and a team of certified technicians, maintaining our core values of 
                integrity, quality, and customer satisfaction.
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  onClick={() => router.push('/Services')}
                  style={{
                    background: '#d4af37',
                    color: '#2F4F4F',
                    padding: '1rem 2rem',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Our Services
                </button>
                <button 
                  onClick={() => router.push('/Contactus')}
                  style={{
                    background: 'transparent',
                    color: '#d4af37',
                    padding: '1rem 2rem',
                    borderRadius: '8px',
                    border: '1px solid #d4af37',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  Contact Us
                </button>
              </div>
            </div>
            <div className="hover-card">
              <img 
                src="https://images.unsplash.com/photo-1603712610490-8dfb147f0dc1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Our Workshop"
                style={{
                  width: '100%',
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
                }}
              />
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div ref={valuesRef} style={{ opacity: 0, marginBottom: '4rem' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '600',
            color: '#d4af37',
            textAlign: 'center',
            marginBottom: '3rem'
          }}>
            Our Values
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            {values.map((value, index) => (
              <div 
                key={index}
                className="hover-card"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '2rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  textAlign: 'center',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                  {value.icon}
                </div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#d4af37',
                  marginBottom: '1rem'
                }}>
                  {value.title}
                </h3>
                <p style={{ color: 'rgba(47, 79, 79, 0.7)', lineHeight: '1.5' }}>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div ref={teamRef} style={{ opacity: 0, marginBottom: '4rem' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '600',
            color: '#d4af37',
            textAlign: 'center',
            marginBottom: '3rem'
          }}>
            Meet Our Team
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                className="hover-card"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '2rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  textAlign: 'center',
                  transition: 'all 0.3s ease'
                }}
              >
                <img 
                  src={member.image}
                  alt={member.name}
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    margin: '0 auto 1.5rem',
                    border: '3px solid #d4af37'
                  }}
                />
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#d4af37',
                  marginBottom: '0.5rem'
                }}>
                  {member.name}
                </h3>
                <p style={{ color: '#2F4F4F', fontWeight: '500', marginBottom: '0.5rem' }}>
                  {member.position}
                </p>
                <p style={{ color: 'rgba(47, 79, 79, 0.6)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  {member.experience}
                </p>
                <p style={{
                  color: 'rgba(47, 79, 79, 0.8)',
                  fontStyle: 'italic',
                  marginTop: '1rem',
                  padding: '1rem',
                  background: 'rgba(212, 175, 55, 0.1)',
                  borderRadius: '8px',
                  borderLeft: '3px solid #d4af37'
                }}>
                  "{member.quote}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div style={{
          background: 'rgba(212, 175, 55, 0.1)',
          borderRadius: '12px',
          padding: '3rem 2rem',
          textAlign: 'center',
          border: '1px solid rgba(212, 175, 55, 0.2)'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '600',
            color: '#d4af37',
            marginBottom: '1rem'
          }}>
            Ready to Experience the Sunny Auto Difference?
          </h2>
          <p style={{
            color: 'rgba(47, 79, 79, 0.8)',
            marginBottom: '2rem',
            maxWidth: '500px',
            margin: '0 auto 2rem'
          }}>
            Join thousands of satisfied customers who trust us with their vehicles.
          </p>
          <button 
            onClick={() => router.push('/Appointment')}
            style={{
              background: '#d4af37',
              color: '#2F4F4F',
              padding: '1rem 2.5rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1.1rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Book Your Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
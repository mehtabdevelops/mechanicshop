"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

const About = () => {
  const router = useRouter();

  const teamMembers = [
    {
      id: 1,
      name: 'Michael Rodriguez',
      position: 'Head Mechanic',
      experience: '15+ years',
      specialty: 'Engine Specialist',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      quote: 'Every car tells a story. I listen and fix.'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      position: 'Service Manager',
      experience: '12+ years',
      specialty: 'Customer Relations',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      quote: 'Your satisfaction is our top priority.'
    },
    {
      id: 3,
      name: 'David Chen',
      position: 'Electrical Systems Expert',
      experience: '10+ years',
      specialty: 'Diagnostics & Electronics',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      quote: 'Solving complex problems is my passion.'
    },
    {
      id: 4,
      name: 'Emily Williams',
      position: 'Brake & Suspension Specialist',
      experience: '8+ years',
      specialty: 'Safety Systems',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      quote: 'Keeping your family safe on the road.'
    }
  ];

  const values = [
    {
      icon: '⚡',
      title: 'Quick Service',
      description: 'We value your time and strive to complete most services within 2 hours.'
    },
    {
      icon: '✅',
      title: 'Quality Work',
      description: 'Every repair comes with a 12-month/12,000-mile warranty.'
    },
    {
      icon: '💎',
      title: 'Honest Pricing',
      description: 'No hidden fees. Transparent pricing with upfront estimates.'
    },
    {
      icon: '🤝',
      title: 'Trustworthy',
      description: 'We only recommend necessary repairs and use quality parts.'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Happy Customers' },
    { number: '15+', label: 'Years Experience' },
    { number: '98%', label: 'Satisfaction Rate' },
    { number: '24/7', label: 'Roadside Support' }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a2540 0%, #1a4b78 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      padding: '2rem 0'
    }}>
      {/* Navigation */}
      <nav style={{
        background: 'rgba(10, 37, 64, 0.95)',
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        backdropFilter: 'blur(10px)',
        marginBottom: '3rem'
      }}>
        <div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#fbbf24',
            letterSpacing: '1px',
            cursor: 'pointer'
          }} onClick={() => router.push('/')}>
            SUNNY AUTO
          </h1>
        </div>
        
        <button style={{
          background: 'transparent',
          color: '#ffffff',
          padding: '0.75rem 1.5rem',
          borderRadius: '50px',
          fontWeight: '400',
          border: '2px solid #fbbf24',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          fontSize: '1.1rem'
        }} 
        onMouseOver={(e) => {
          e.currentTarget.style.background = '#fbbf24';
          e.currentTarget.style.color = '#0a2540';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = '#ffffff';
        }}
        onClick={() => router.push('/UserHome')}>
          Back to Home
        </button>
      </nav>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem'
      }}>
        {/* Hero Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '5rem'
        }}>
          <h1 style={{
            fontSize: '4rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            About Sunny Auto
          </h1>
          <p style={{
            fontSize: '1.5rem',
            color: '#dbeafe',
            maxWidth: '800px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            For over 15 years, we've been the trusted auto care partner for thousands of drivers. 
            Our commitment to excellence and customer satisfaction sets us apart.
          </p>
        </div>

        {/* Stats Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          marginBottom: '5rem'
        }}>
          {stats.map((stat, index) => (
            <div key={index} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '2rem',
              borderRadius: '15px',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'transform 0.3s ease'
            }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                color: '#fbbf24',
                marginBottom: '0.5rem'
              }}>
                {stat.number}
              </div>
              <div style={{ color: '#dbeafe', fontSize: '1.1rem' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Story Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
          alignItems: 'center',
          marginBottom: '5rem'
        }}>
          <div>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: '#fbbf24',
              marginBottom: '1.5rem'
            }}>
              Our Story
            </h2>
            <p style={{
              fontSize: '1.1rem',
              color: '#dbeafe',
              lineHeight: '1.7',
              marginBottom: '1.5rem'
            }}>
              Founded in 2009 by automotive enthusiast James Wilson, Sunny Auto started as a small 
              neighborhood garage with a big dream: to provide honest, reliable auto care that 
              customers could trust.
            </p>
            <p style={{
              fontSize: '1.1rem',
              color: '#dbeafe',
              lineHeight: '1.7',
              marginBottom: '1.5rem'
            }}>
              Today, we've grown into a full-service automotive center with state-of-the-art 
              equipment and a team of certified technicians, but we've never lost sight of our 
              core values: integrity, quality, and customer satisfaction.
            </p>
            <div style={{
              display: 'flex',
              gap: '1rem',
              marginTop: '2rem'
            }}>
              <button style={{
                background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
                color: '#0a2540',
                padding: '1rem 2rem',
                borderRadius: '50px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.1rem',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              onClick={() => router.push('/services')}>
                Our Services
              </button>
              <button style={{
                background: 'transparent',
                color: '#fbbf24',
                padding: '1rem 2rem',
                borderRadius: '50px',
                fontWeight: '600',
                border: '2px solid #fbbf24',
                cursor: 'pointer',
                fontSize: '1.1rem',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#fbbf24';
                e.currentTarget.style.color = '#0a2540';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#fbbf24';
              }}
              onClick={() => router.push('/contact')}>
                Contact Us
              </button>
            </div>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '2rem',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <img 
              src="https://images.unsplash.com/photo-1565689223838-a741089720a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Our Workshop"
              style={{
                width: '100%',
                borderRadius: '15px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
              }}
            />
          </div>
        </div>

        {/* Values Section */}
        <div style={{ marginBottom: '5rem' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#fbbf24',
            textAlign: 'center',
            marginBottom: '3rem'
          }}>
            Our Values
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {values.map((value, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '2rem',
                borderRadius: '15px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                textAlign: 'center',
                transition: 'transform 0.3s ease'
              }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '1rem'
                }}>
                  {value.icon}
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#fbbf24',
                  marginBottom: '1rem'
                }}>
                  {value.title}
                </h3>
                <p style={{
                  color: '#dbeafe',
                  lineHeight: '1.6'
                }}>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div style={{ marginBottom: '5rem' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#fbbf24',
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
            {teamMembers.map((member) => (
              <div key={member.id} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '2rem',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                textAlign: 'center',
                transition: 'transform 0.3s ease'
              }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <img 
                  src={member.image}
                  alt={member.name}
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    margin: '0 auto 1.5rem',
                    border: '3px solid #fbbf24'
                  }}
                />
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#fbbf24',
                  marginBottom: '0.5rem'
                }}>
                  {member.name}
                </h3>
                <p style={{
                  color: '#ffffff',
                  fontWeight: '500',
                  marginBottom: '0.5rem'
                }}>
                  {member.position}
                </p>
                <p style={{
                  color: '#93c5fd',
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem'
                }}>
                  {member.experience} • {member.specialty}
                </p>
                <p style={{
                  color: '#dbeafe',
                  fontStyle: 'italic',
                  marginTop: '1rem',
                  padding: '1rem',
                  background: 'rgba(251, 191, 36, 0.1)',
                  borderRadius: '10px',
                  borderLeft: '4px solid #fbbf24'
                }}>
                  "{member.quote}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.1))',
          borderRadius: '20px',
          padding: '4rem 2rem',
          textAlign: 'center',
          border: '1px solid rgba(251, 191, 36, 0.2)',
          marginBottom: '4rem'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#fbbf24',
            marginBottom: '1.5rem'
          }}>
            Ready to Experience the Sunny Auto Difference?
          </h2>
          <p style={{
            fontSize: '1.25rem',
            color: '#dbeafe',
            marginBottom: '2rem',
            maxWidth: '600px',
            margin: '0 auto 2rem'
          }}>
            Join thousands of satisfied customers who trust us with their vehicles. 
            Book your appointment today!
          </p>
          <button style={{
            background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
            color: '#0a2540',
            padding: '1.25rem 3rem',
            borderRadius: '50px',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.25rem',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 25px rgba(251, 191, 36, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          onClick={() => router.push('/appointment')}>
            Book Your Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
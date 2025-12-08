"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

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

const Services = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  // Orange color scheme matching About page
  const colors = {
    primary: '#FF8C00',
    primaryLight: '#FFA500',
    primaryDark: '#cc7000',
    background: '#000000',
    surface: 'rgba(255, 255, 255, 0.05)',
    surfaceLight: 'rgba(255, 255, 255, 0.08)',
    text: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    textMuted: 'rgba(255, 255, 255, 0.5)',
    border: 'rgba(255, 255, 255, 0.1)',
  };

  // Fetch services from Supabase
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching services:', error);
        throw error;
      }

      setServices(data || []);
    } catch (error) {
      console.error('Error loading services:', error);
      alert('Error loading services data');
    } finally {
      setLoading(false);
    }
  };

  const handleBookService = (serviceName: string) => {
    router.push(`/Appointment?service=${encodeURIComponent(serviceName)}`);
  };

  // Filter services based on search and category
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter dropdown
  const categories = ['All Categories', ...new Set(services.map(service => service.category))];

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: colors.background,
        color: colors.text,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: `3px solid ${colors.border}`,
            borderTop: `3px solid ${colors.primary}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1.5rem'
          }} />
          <p style={{ 
            color: colors.primary, 
            fontSize: '1.3rem', 
            fontWeight: '600',
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Loading Services...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.background,
      color: colors.text,
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.1
      }}>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: `${100 + i * 50}px`,
              height: `${100 + i * 50}px`,
              borderRadius: '50%',
              border: `2px solid ${colors.primary}`,
              top: `${20 + i * 20}%`,
              right: `${10 + i * 15}%`,
              animation: `float ${6 + i * 2}s ease-in-out infinite`
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav style={{
        background: 'rgba(0, 0, 0, 0.95)',
        padding: '1.5rem 3rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(20px)',
        marginBottom: '3rem',
        borderBottom: `1px solid ${colors.primary}20`
      }}>
        <div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '900',
            background: `linear-gradient(135deg, #FFFFFF, ${colors.primary})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            cursor: 'pointer',
            letterSpacing: '1px',
            margin: 0
          }} onClick={() => router.push('/UserHome')}>
            SUNNY AUTO
          </h1>
        </div>
        
        <button style={{
          background: 'transparent',
          color: colors.primary,
          padding: '0.75rem 2rem',
          borderRadius: '8px',
          fontWeight: '600',
          border: `1px solid ${colors.primary}50`,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          fontSize: '0.9rem',
          letterSpacing: '0.5px',
          textTransform: 'uppercase'
        }} 
        onMouseOver={(e) => {
          e.currentTarget.style.background = colors.primary;
          e.currentTarget.style.color = colors.background;
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = colors.primary;
          e.currentTarget.style.transform = 'translateY(0)';
        }}
        onClick={() => router.push('/UserHome')}>
          Back to Home
        </button>
      </nav>

      {/* Main Content */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 2rem',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '4rem'
        }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: '900',
            marginBottom: '1.5rem',
            background: `linear-gradient(135deg, #FFFFFF, ${colors.primary})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-1px'
          }}>
            Our <span style={{ color: colors.primary }}>Services</span>
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: colors.textSecondary,
            maxWidth: '800px',
            margin: '0 auto',
            lineHeight: '1.6',
            fontWeight: '300'
          }}>
            Professional automotive services to keep your vehicle running smoothly and safely. 
            Our certified technicians use the latest tools and technology to deliver exceptional results.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div style={{
          display: 'flex',
          gap: '1.5rem',
          justifyContent: 'center',
          marginBottom: '4rem',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          {/* Search Bar */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            backgroundColor: colors.surface,
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            border: `1px solid ${colors.primary}30`,
            width: '350px',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = colors.primary;
            e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.primary}20`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = `${colors.primary}30`;
            e.currentTarget.style.boxShadow = 'none';
          }}>
            <input 
              type="text" 
              placeholder="Search services..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                backgroundColor: 'transparent', 
                border: 'none', 
                color: colors.text, 
                outline: 'none',
                width: '100%',
                fontSize: '1rem',
                padding: '0 0.5rem',
                fontFamily: 'inherit'
              }}
            />
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: colors.primary }}>
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          
          {/* Category Filter */}
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ 
              backgroundColor: colors.surface, 
              color: colors.text, 
              border: `1px solid ${colors.primary}30`, 
              borderRadius: '12px',
              padding: '1rem 1.5rem',
              fontSize: '1rem',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              fontFamily: 'inherit'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = colors.primary;
              e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = `${colors.primary}30`;
              e.target.style.boxShadow = 'none';
            }}
          >
            {categories.map(category => (
              <option key={category} value={category} style={{ backgroundColor: colors.background, color: colors.text }}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Services Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '2.5rem',
          marginBottom: '5rem'
        }}>
          {filteredServices.map((service) => (
            <div key={service.id} style={{
              background: colors.surface,
              borderRadius: '20px',
              overflow: 'hidden',
              border: `1px solid ${colors.primary}30`,
              transition: 'all 0.4s ease',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              position: 'relative'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
              e.currentTarget.style.boxShadow = `0 25px 50px ${colors.primary}20`;
              e.currentTarget.style.borderColor = colors.primary;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = `${colors.primary}30`;
            }}
            onClick={() => setSelectedService(selectedService === service.name ? null : service.name)}>
              
              {/* Service Image */}
              <div style={{ height: '280px', overflow: 'hidden', position: 'relative' }}>
                <img 
                  src={service.image_url} 
                  alt={service.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: service.is_available ? `${colors.primary}20` : 'rgba(255, 255, 255, 0.1)',
                  color: service.is_available ? colors.primary : colors.textMuted,
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontWeight: '700',
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  border: `1px solid ${service.is_available ? colors.primary : colors.textMuted}30`,
                  backdropFilter: 'blur(10px)'
                }}>
                  {service.is_available ? 'Available' : 'Unavailable'}
                </div>
              </div>

              {/* Service Content */}
              <div style={{ padding: '2.5rem' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '1.5rem'
                }}>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: colors.text,
                    margin: 0,
                    lineHeight: '1.3'
                  }}>
                    {service.name}
                  </h3>
                  <div style={{
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`,
                    color: colors.background,
                    padding: '0.75rem 1.25rem',
                    borderRadius: '12px',
                    fontWeight: '800',
                    fontSize: '1.2rem',
                    minWidth: '80px',
                    textAlign: 'center'
                  }}>
                    ${service.price}
                  </div>
                </div>

                {/* Category Badge */}
                <div style={{
                  display: 'inline-block',
                  backgroundColor: `${colors.primary}15`,
                  color: colors.primary,
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  marginBottom: '1.5rem',
                  fontWeight: '700',
                  border: `1px solid ${colors.primary}30`,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {service.category}
                </div>

                <p style={{
                  color: colors.textSecondary,
                  marginBottom: '2rem',
                  lineHeight: '1.6',
                  fontSize: '1rem'
                }}>
                  {service.description}
                </p>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '2rem',
                  color: colors.textMuted,
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: colors.primary }}>⏱</span>
                    {service.duration_minutes} minutes
                  </span>
                  <span style={{ 
                    color: service.is_available ? colors.primary : colors.textMuted,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    {service.is_available ? '✅' : '❌'}
                    {service.is_available ? 'Available Now' : 'Unavailable'}
                  </span>
                </div>

                {/* Service Details */}
                {selectedService === service.name && (
                  <div style={{
                    marginBottom: '2rem',
                    padding: '1.5rem',
                    background: `${colors.primary}10`,
                    borderRadius: '12px',
                    border: `1px solid ${colors.primary}20`
                  }}>
                    <h4 style={{
                      color: colors.primary,
                      marginBottom: '1rem',
                      fontSize: '1.1rem',
                      fontWeight: '700'
                    }}>
                      Service Details:
                    </h4>
                    <ul style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0,
                      display: 'grid',
                      gap: '0.75rem'
                    }}>
                      <li style={{
                        padding: '0.5rem 0',
                        color: colors.textSecondary,
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '0.95rem',
                        gap: '0.75rem'
                      }}>
                        <span style={{ color: colors.primary, fontSize: '1.1rem' }}>⏱</span>
                        <div>
                          <strong>Duration:</strong> {service.duration_minutes} minutes
                        </div>
                      </li>
                      <li style={{
                        padding: '0.5rem 0',
                        color: colors.textSecondary,
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '0.95rem',
                        gap: '0.75rem'
                      }}>
                        <span style={{ color: colors.primary, fontSize: '1.1rem' }}>💰</span>
                        <div>
                          <strong>Price:</strong> ${service.price} (All inclusive)
                        </div>
                      </li>
                      <li style={{
                        padding: '0.5rem 0',
                        color: colors.textSecondary,
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '0.95rem',
                        gap: '0.75rem'
                      }}>
                        <span style={{ color: colors.primary, fontSize: '1.1rem' }}>📅</span>
                        <div>
                          <strong>Availability:</strong> Same day appointment
                        </div>
                      </li>
                      <li style={{
                        padding: '0.5rem 0',
                        color: colors.textSecondary,
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '0.95rem',
                        gap: '0.75rem'
                      }}>
                        <span style={{ color: colors.primary, fontSize: '1.1rem' }}>⭐</span>
                        <div>
                          <strong>Quality:</strong> ASE Certified technicians
                        </div>
                      </li>
                    </ul>
                  </div>
                )}

                <button style={{
                  width: '100%',
                  background: service.is_available 
                    ? `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`
                    : colors.surfaceLight,
                  color: service.is_available ? colors.background : colors.textMuted,
                  padding: '1.25rem 2rem',
                  borderRadius: '12px',
                  fontWeight: '700',
                  border: 'none',
                  cursor: service.is_available ? 'pointer' : 'not-allowed',
                  fontSize: '1.1rem',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
                disabled={!service.is_available}
                onMouseOver={(e) => {
                  if (service.is_available) {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = `0 10px 25px ${colors.primary}30`;
                  }
                }}
                onMouseOut={(e) => {
                  if (service.is_available) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (service.is_available) {
                    handleBookService(service.name);
                  }
                }}>
                  {service.is_available ? 'Book This Service' : 'Currently Unavailable'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Show message if no services match filter */}
        {filteredServices.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem 2rem', 
            color: colors.textSecondary,
            backgroundColor: colors.surface,
            borderRadius: '20px',
            border: `1px solid ${colors.primary}20`,
            marginBottom: '4rem',
            backdropFilter: 'blur(10px)'
          }}>
            <svg width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: colors.primary, marginBottom: '1.5rem', opacity: 0.5 }}>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <line x1="8" y1="8" x2="16" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="16" y1="8" x2="8" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <h3 style={{ 
              color: colors.primary, 
              marginBottom: '1rem', 
              fontSize: '1.5rem', 
              fontWeight: '700',
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              No services found
            </h3>
            <p style={{ 
              fontSize: '1.1rem', 
              color: colors.textSecondary,
              maxWidth: '400px',
              
            }}>
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div style={{
          background: colors.surface,
          borderRadius: '20px',
          padding: '4rem 3rem',
          textAlign: 'center',
          border: `1px solid ${colors.primary}30`,
          marginBottom: '4rem',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-10%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${colors.primary}15, transparent)`,
            filter: 'blur(40px)'
          }} />
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: '900',
            marginBottom: '1.5rem',
            background: `linear-gradient(135deg, #FFFFFF, ${colors.primary})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-1px',
            position: 'relative',
            zIndex: 1
          }}>
            Ready to Get Started?
          </h2>
          <p style={{
            fontSize: '1.2rem',
            color: colors.textSecondary,
            marginBottom: '2.5rem',
            maxWidth: '600px',
            margin: '0 auto 2.5rem',
            lineHeight: '1.6',
            position: 'relative',
            zIndex: 1
          }}>
            Schedule your service today and experience the Sunny Auto difference. 
            Our team is ready to provide exceptional care for your vehicle.
          </p>
          <button style={{
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`,
            color: colors.background,
            padding: '1.25rem 3rem',
            borderRadius: '12px',
            fontWeight: '700',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.1rem',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            position: 'relative',
            zIndex: 1
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = `0 15px 30px ${colors.primary}30`;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          onClick={() => router.push('/Appointment')}>
            Book Appointment Now
          </button>
        </div>

        {/* Contact Info */}
        <div style={{
          textAlign: 'center',
          padding: '3rem 2rem',
          background: colors.surface,
          borderRadius: '16px',
          border: `1px solid ${colors.primary}20`,
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{
            color: colors.primary,
            fontSize: '1.4rem',
            marginBottom: '1.5rem',
            fontWeight: '700',
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Questions About Our Services?
          </h3>
          <p style={{ 
            color: colors.textSecondary, 
            marginBottom: '1rem', 
            fontSize: '1.1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ color: colors.primary }}>📞</span>
            Call us: <strong style={{ color: colors.text, marginLeft: '0.25rem' }}>(555) 123-4567</strong>
          </p>
          <p style={{ 
            color: colors.textSecondary, 
            fontSize: '1.1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ color: colors.primary }}>✉</span>
            Email: <strong style={{ color: colors.text, marginLeft: '0.25rem' }}>service@sunnyauto.com</strong>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
};

export default Services;
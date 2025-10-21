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
        background: '#000000',
        color: 'white',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid rgba(255, 107, 53, 0.3)',
            borderTop: '4px solid #ff6b35',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p style={{ color: '#ff6b35', fontSize: '1.2rem', fontWeight: '600' }}>Loading Services...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      padding: '2rem 0'
    }}>
      {/* Navigation */}
      <nav style={{
        background: 'rgba(0, 0, 0, 0.95)',
        padding: '1.5rem 3rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        backdropFilter: 'blur(10px)',
        marginBottom: '3rem',
        borderBottom: '1px solid rgba(255, 107, 53, 0.3)'
      }}>
        <div>
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: '700',
            color: '#ff6b35',
            cursor: 'pointer',
            margin: 0
          }} onClick={() => router.push('/UserHome')}>
            <span style={{ color: '#ff6b35' }}>SUNNY</span>
            <span style={{ color: '#ffffff' }}>AUTO</span>
          </h1>
        </div>
        
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
        onMouseOver={(e) => {
          e.currentTarget.style.background = '#ffffff';
          e.currentTarget.style.color = '#000000';
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
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 2rem'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '4rem'
        }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '700',
            marginBottom: '1rem',
            color: '#ffffff'
          }}>
            Our <span style={{ color: '#ff6b35' }}>Services</span>
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: 'rgba(255, 255, 255, 0.7)',
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
          gap: '1rem',
          justifyContent: 'center',
          marginBottom: '3rem',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          {/* Search Bar */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            border: '1px solid rgba(255, 107, 53, 0.3)',
            width: '300px',
            transition: 'all 0.2s ease'
          }}>
            <input 
              type="text" 
              placeholder="Search services..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                backgroundColor: 'transparent', 
                border: 'none', 
                color: 'white', 
                outline: 'none',
                width: '100%',
                fontSize: '0.95rem',
                padding: '0 0.5rem'
              }}
            />
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: '#ff6b35' }}>
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          
          {/* Category Filter */}
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.05)', 
              color: 'white', 
              border: '1px solid rgba(255, 107, 53, 0.3)', 
              borderRadius: '6px',
              padding: '0.75rem 1.5rem',
              fontSize: '0.95rem',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
          >
            {categories.map(category => (
              <option key={category} value={category} style={{ backgroundColor: '#000000', color: 'white' }}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Services Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '2.5rem',
          marginBottom: '4rem'
        }}>
          {filteredServices.map((service) => (
            <div key={service.id} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(255, 107, 53, 0.2)';
              e.currentTarget.style.borderColor = '#ff6b35';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
            onClick={() => setSelectedService(selectedService === service.name ? null : service.name)}>
              
              {/* Service Image */}
              <div style={{ height: '250px', overflow: 'hidden' }}>
                <img 
                  src={service.image_url} 
                  alt={service.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
              </div>

              {/* Service Content */}
              <div style={{ padding: '2rem' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '1rem'
                }}>
                  <h3 style={{
                    fontSize: '1.3rem',
                    fontWeight: '600',
                    color: '#ffffff',
                    margin: 0
                  }}>
                    {service.name}
                  </h3>
                  <div style={{
                    background: '#ff6b35',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    fontWeight: '600',
                    fontSize: '1rem'
                  }}>
                    ${service.price}
                  </div>
                </div>

                {/* Category Badge */}
                <div style={{
                  display: 'inline-block',
                  backgroundColor: 'rgba(255, 107, 53, 0.2)',
                  color: '#ff6b35',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  marginBottom: '1rem',
                  fontWeight: '600',
                  border: '1px solid rgba(255, 107, 53, 0.3)'
                }}>
                  {service.category}
                </div>

                <p style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  marginBottom: '1.5rem',
                  lineHeight: '1.6',
                  fontSize: '0.95rem'
                }}>
                  {service.description}
                </p>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.5rem',
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '0.9rem'
                }}>
                  <span>⏱ {service.duration_minutes} minutes</span>
                  <span style={{ 
                    color: service.is_available ? '#ff6b35' : 'rgba(255, 255, 255, 0.4)',
                    fontWeight: '600'
                  }}>
                    {service.is_available ? '✅ Available' : '❌ Unavailable'}
                  </span>
                </div>

                {/* Service Details */}
                {selectedService === service.name && (
                  <div style={{
                    marginBottom: '2rem',
                    padding: '1rem',
                    background: 'rgba(255, 107, 53, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 107, 53, 0.2)'
                  }}>
                    <h4 style={{
                      color: '#ff6b35',
                      marginBottom: '0.5rem',
                      fontSize: '1rem',
                      fontWeight: '600'
                    }}>
                      Service Details:
                    </h4>
                    <ul style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0
                    }}>
                      <li style={{
                        padding: '0.25rem 0',
                        color: 'rgba(255, 255, 255, 0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '0.9rem'
                      }}>
                        <span style={{ color: '#ff6b35', marginRight: '0.5rem' }}>⏱</span>
                        Duration: {service.duration_minutes} minutes
                      </li>
                      <li style={{
                        padding: '0.25rem 0',
                        color: 'rgba(255, 255, 255, 0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '0.9rem'
                      }}>
                        <span style={{ color: '#ff6b35', marginRight: '0.5rem' }}>💰</span>
                        Price: ${service.price}
                      </li>
                      <li style={{
                        padding: '0.25rem 0',
                        color: 'rgba(255, 255, 255, 0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '0.9rem'
                      }}>
                        <span style={{ color: '#ff6b35', marginRight: '0.5rem' }}>📅</span>
                        Same day appointment available
                      </li>
                      <li style={{
                        padding: '0.25rem 0',
                        color: 'rgba(255, 255, 255, 0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '0.9rem'
                      }}>
                        <span style={{ color: '#ff6b35', marginRight: '0.5rem' }}>⭐</span>
                        Certified technicians
                      </li>
                    </ul>
                  </div>
                )}

                <button style={{
                  width: '100%',
                  background: '#ff6b35',
                  color: 'white',
                  padding: '1rem 2rem',
                  borderRadius: '6px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  opacity: service.is_available ? 1 : 0.6
                }}
                disabled={!service.is_available}
                onMouseOver={(e) => {
                  if (service.is_available) {
                    e.currentTarget.style.background = '#e55a2b';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseOut={(e) => {
                  if (service.is_available) {
                    e.currentTarget.style.background = '#ff6b35';
                    e.currentTarget.style.transform = 'translateY(0)';
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
            padding: '4rem', 
            color: 'rgba(255, 255, 255, 0.7)',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 107, 53, 0.2)',
            marginBottom: '4rem'
          }}>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: '#ff6b35', marginBottom: '1rem', opacity: 0.5 }}>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <line x1="8" y1="8" x2="16" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="16" y1="8" x2="8" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <h3 style={{ color: '#ff6b35', marginBottom: '0.5rem', fontSize: '1.3rem', fontWeight: '600' }}>No services found</h3>
            <p style={{ margin: 0, fontSize: '1rem', color: 'rgba(255, 255, 255, 0.7)' }}>Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Call to Action */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '3rem',
          textAlign: 'center',
          border: '1px solid rgba(255, 107, 53, 0.3)',
          marginBottom: '4rem'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '1rem'
          }}>
            Ready to Get Started?
          </h2>
          <p style={{
            fontSize: '1.1rem',
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '2rem',
            maxWidth: '600px',
            margin: '0 auto 2rem'
          }}>
            Schedule your service today and experience the Sunny Auto difference. 
            Our team is ready to provide exceptional care for your vehicle.
          </p>
          <button style={{
            background: '#ff6b35',
            color: 'white',
            padding: '1rem 2.5rem',
            borderRadius: '6px',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#e55a2b';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = '#ff6b35';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          onClick={() => router.push('/Appointment')}>
            Book Appointment Now
          </button>
        </div>

        {/* Contact Info */}
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: '8px',
          border: '1px solid rgba(255, 107, 53, 0.2)'
        }}>
          <h3 style={{
            color: '#ff6b35',
            fontSize: '1.2rem',
            marginBottom: '1rem',
            fontWeight: '600'
          }}>
            Questions About Our Services?
          </h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
            📞 Call us: <strong>(555) 123-4567</strong>
          </p>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.95rem' }}>
            ✉ Email: <strong>service@sunnyauto.com</strong>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Services;
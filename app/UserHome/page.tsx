"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const AutoServiceShop = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleBookAppointment = () => {
    router.push('/Appointment');
  };

  const handleViewServices = () => {
    router.push('/Services');
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  // Prevent rendering until client-side to avoid hydration mismatches
  if (!isClient) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #0a2540 0%, #1a4b78 100%)',
        color: 'white',
        fontFamily: 'Arial, sans-serif'
      }} />
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #0a2540 0%, #1a4b78 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }} suppressHydrationWarning>
      {/* Welcome Animation */}
      {showWelcome && (
        <div style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a2540',
          zIndex: 1000
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ animation: 'fadeIn 1.5s ease-in-out' }}>
              <h1 style={{
                fontSize: '3.5rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: 'white'
              }}>
                SUNNY AUTO
              </h1>
              <div style={{
                width: '16rem',
                height: '2px',
                background: '#fbbf24',
                margin: '0 auto 1rem'
              }}></div>
              <p style={{
                fontSize: '1.5rem',
                opacity: 0,
                animation: 'fadeIn 2s ease-in-out 1s forwards'
              }}>
                Your Trusted Auto Care Partner
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav style={{
        background: 'rgba(10, 37, 64, 0.9)',
        padding: '1rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 40
      }}>
        <div>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#fbbf24'
          }}>
            SUNNY AUTO
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <button style={{
            color: 'white',
            fontSize: '1.25rem',
            fontWeight: '300',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.75rem 1.5rem',
            transition: 'all 0.3s ease',
            letterSpacing: '0.5px',
            textTransform: 'uppercase'
          }} onMouseOver={(e) => e.currentTarget.style.color = '#fbbf24'}
          onMouseOut={(e) => e.currentTarget.style.color = 'white'}
          onClick={() => handleNavigation('/')}>
            Home
          </button>
          <button style={{
            color: 'white',
            fontSize: '1.25rem',
            fontWeight: '300',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.75rem 1.5rem',
            transition: 'all 0.3s ease',
            letterSpacing: '0.5px',
            textTransform: 'uppercase'
          }} onMouseOver={(e) => e.currentTarget.style.color = '#fbbf24'}
          onMouseOut={(e) => e.currentTarget.style.color = 'white'}
          onClick={handleViewServices}>
            Services
          </button>
          <button style={{
            color: 'white',
            fontSize: '1.25rem',
            fontWeight: '300',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.75rem 1.5rem',
            transition: 'all 0.3s ease',
            letterSpacing: '0.5px',
            textTransform: 'uppercase'
          }} onMouseOver={(e) => e.currentTarget.style.color = '#fbbf24'}
          onMouseOut={(e) => e.currentTarget.style.color = 'white'}
          onClick={() => handleNavigation('/About')}>
            About
          </button>
          <button style={{
            color: 'white',
            fontSize: '1.25rem',
            fontWeight: '300',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.75rem 1.5rem',
            transition: 'all 0.3s ease',
            letterSpacing: '0.5px',
            textTransform: 'uppercase'
          }} onMouseOver={(e) => e.currentTarget.style.color = '#fbbf24'}
          onMouseOut={(e) => e.currentTarget.style.color = 'white'}
          onClick={() => handleNavigation('/Contactus')}>
            Contact
          </button>
        </div>
        <div>
          <button style={{
            background: '#fbbf24',
            color: '#0a2540',
            padding: '0.5rem 1.5rem',
            borderRadius: '9999px',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.3s'
          }} onMouseOver={(e) => e.currentTarget.style.background = '#f59e0b'}
          onMouseOut={(e) => e.currentTarget.style.background = '#fbbf24'}
          onClick={handleBookAppointment}>
            Book Appointment
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.3
        }}></div>
        
        <div style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          padding: '0 1.5rem',
          maxWidth: '64rem'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            lineHeight: 1.2
          }}>
            Premium Auto Care <br /> For All Makes & Models
          </h1>
          <p style={{
            fontSize: '1.5rem',
            marginBottom: '2.5rem',
            color: '#dbeafe'
          }}>
            Experience the difference of expert automotive service with a personal touch
          </p>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <button style={{
              background: '#fbbf24',
              color: '#0a2540',
              padding: '1rem 2rem',
              borderRadius: '9999px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s',
              fontSize: '1.125rem'
            }} onMouseOver={(e) => {
              e.currentTarget.style.background = '#f59e0b';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#fbbf24';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            onClick={handleBookAppointment}>
              Book Appointment
            </button>
            <button style={{
              background: 'transparent',
              color: '#fbbf24',
              padding: '1rem 2rem',
              borderRadius: '9999px',
              fontWeight: 600,
              border: '2px solid #fbbf24',
              cursor: 'pointer',
              transition: 'all 0.3s',
              fontSize: '1.125rem'
            }} onMouseOver={(e) => {
              e.currentTarget.style.background = '#fbbf24';
              e.currentTarget.style.color = '#0a2540';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#fbbf24';
            }}
            onClick={handleViewServices}>
              Our Services
            </button>
          </div>
        </div>

        <div style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          animation: 'bounce 1s infinite'
        }}>
          <svg style={{
            width: '2rem',
            height: '2rem',
            color: '#fbbf24'
          }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section style={{
        padding: '5rem 1.5rem',
        background: '#1a4b78'
      }}>
        <div style={{
          maxWidth: '72rem',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '2.25rem',
            fontWeight: 'bold',
            marginBottom: '3rem',
            textAlign: 'center'
          }}>
            Welcome to Sunny Auto
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '3rem',
            alignItems: 'center'
          }}>
            <div>
              <p style={{
                fontSize: '1.125rem',
                marginBottom: '1.5rem'
              }}>
                Located in the heart of the community, Sunny Auto has been serving drivers with reliable and affordable auto repair services for over a decade. We pride ourselves on being more than just a repair shop — we're your trusted automotive care partner.
              </p>
              <p style={{
                fontSize: '1.125rem',
                marginBottom: '1.5rem'
              }}>
                Our team of certified technicians combines modern technology with old-fashioned customer care. We use the latest diagnostic tools and high-quality parts, but we never lose sight of what matters most — building trust with our customers.
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button style={{
                  background: '#fbbf24',
                  color: '#0a2540',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '9999px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s'
                }} onMouseOver={(e) => e.currentTarget.style.background = '#f59e0b'}
                onMouseOut={(e) => e.currentTarget.style.background = '#fbbf24'}
                onClick={() => handleNavigation('/about')}>
                  Learn More
                </button>
                <button style={{
                  background: 'transparent',
                  color: '#fbbf24',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '9999px',
                  fontWeight: 600,
                  border: '2px solid #fbbf24',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }} onMouseOver={(e) => {
                  e.currentTarget.style.background = '#fbbf24';
                  e.currentTarget.style.color = '#0a2540';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#fbbf24';
                }}
                onClick={() => handleNavigation('/team')}>
                  Meet Our Team
                </button>
              </div>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem'
            }}>
              <div style={{
                background: '#1e3a8a',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '2.25rem',
                  fontWeight: 'bold',
                  color: '#fbbf24',
                  marginBottom: '0.5rem'
                }}>10+</div>
                <div>Years Experience</div>
              </div>
              <div style={{
                background: '#1e3a8a',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '2.25rem',
                  fontWeight: 'bold',
                  color: '#fbbf24',
                  marginBottom: '0.5rem'
                }}>5,000+</div>
                <div>Happy Customers</div>
              </div>
              <div style={{
                background: '#1e3a8a',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '2.25rem',
                  fontWeight: 'bold',
                  color: '#fbbf24',
                  marginBottom: '0.5rem'
                }}>100%</div>
                <div>Satisfaction Guarantee</div>
              </div>
              <div style={{
                background: '#1e3a8a',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '2.25rem',
                  fontWeight: 'bold',
                  color: '#fbbf24',
                  marginBottom: '0.5rem'
                }}>24/7</div>
                <div>Roadside Assistance</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section style={{
        padding: '5rem 1.5rem',
        background: '#0a2540'
      }}>
        <div style={{
          maxWidth: '72rem',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '2.25rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            Our Popular Services
          </h2>
          <p style={{
            fontSize: '1.25rem',
            color: '#93c5fd',
            marginBottom: '3rem',
            textAlign: 'center'
          }}>
            Quality service for all your automotive needs
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {/* Service 1 */}
            <div style={{
              background: '#1a4b78',
              borderRadius: '0.75rem',
              overflow: 'hidden',
              transition: 'transform 0.3s',
              cursor: 'pointer'
            }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onClick={handleViewServices}>
              <div style={{ height: '12rem', overflow: 'hidden' }}>
                <img 
                  src="https://www.carkeys.co.uk/media/1083/oil_change.jpg?anchor=center&mode=crop&width=1200&height=800"
                  alt="Oil Change" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  marginBottom: '0.5rem'
                }}>Oil Change</h3>
                <p style={{ color: '#d1d5db' }}>
                  Professional oil change service to keep your engine running smoothly and efficiently.
                </p>
              </div>
            </div>

            {/* Service 2 */}
            <div style={{
              background: '#1a4b78',
              borderRadius: '0.75rem',
              overflow: 'hidden',
              transition: 'transform 0.3s',
              cursor: 'pointer'
            }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onClick={handleViewServices}>
              <div style={{ height: '12rem', overflow: 'hidden' }}>
                <img 
                  src="https://edmorsecadillacbrandonservice.com/wp-content/uploads/2018/10/brakes.jpg" 
                  alt="Brake Service" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  marginBottom: '0.5rem'
                }}>Brake Service</h3>
                <p style={{ color: '#d1d5db' }}>
                  Complete brake inspection and repair services for your safety on the road.
                </p>
              </div>
            </div>

            {/* Service 3 */}
            <div style={{
              background: '#1a4b78',
              borderRadius: '0.75rem',
              overflow: 'hidden',
              transition: 'transform 0.3s',
              cursor: 'pointer'
            }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onClick={handleViewServices}>
              <div style={{ height: '12rem', overflow: 'hidden' }}>
                <img 
                  src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                  alt="Tire Service" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  marginBottom: '0.5rem'
                }}>Tire Service</h3>
                <p style={{ color: '#d1d5db' }}>
                  Tire rotation, balancing, and replacement services for optimal performance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0) translateX(-50%); }
          40% { transform: translateY(-30px) translateX(-50%); }
          60% { transform: translateY(-15px) translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default AutoServiceShop;
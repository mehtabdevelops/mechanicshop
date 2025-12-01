'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { gsap } from 'gsap';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  phone: string | null;
  updated_at: string;
  created_at: string;
}

const UserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Refs for animations
  const profileCardRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

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
    success: '#10b981',
    error: '#ef4444',
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  // Animation when component mounts
  useEffect(() => {
    if (!loading && profile) {
      animateProfileEntrance();
    }
  }, [loading, profile]);

  const animateProfileEntrance = () => {
    const tl = gsap.timeline();
    
    tl.fromTo(profileCardRef.current, 
      { opacity: 0, y: 50, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.7)" }
    );
    
    tl.fromTo(avatarRef.current,
      { opacity: 0, scale: 0, rotation: -180 },
      { opacity: 1, scale: 1, rotation: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" },
      "-=0.4"
    );

const rows = detailsRef.current?.querySelectorAll(".detail-row") || [];

tl.fromTo(
  rows,
  { opacity: 0, x: -30 },
  { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, ease: "power3.out" },
  "-=0.3"
);


    tl.fromTo(buttonsRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }
    );
  };

  const animateEditMode = () => {
    const tl = gsap.timeline();
    
    tl.to(profileCardRef.current, {
      y: -10,
      scale: 1.02,
      duration: 0.3,
      ease: "power2.out"
    });
    
    tl.to(profileCardRef.current, {
      y: 0,
      scale: 1,
      duration: 0.3,
      ease: "back.out(1.7)"
    });
  };

  const getCurrentUser = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('No authenticated user found');
      return user;
    } catch (err: any) {
      console.error('Error getting current user:', err);
      throw err;
    }
  };

  const getCurrentUserProfile = async () => {
    try {
      const user = await getCurrentUser();
      
      if (!user?.id || !user?.email) {
        throw new Error('Invalid user data');
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        if (profileError.code === 'PGRST116') {
          return await createNewProfile(user);
        }
        throw profileError;
      }

      return profileData;
    } catch (err: any) {
      console.error('Error getting user profile:', err);
      throw err;
    }
  };

  const createNewProfile = async (user: any) => {
    const newProfile = {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || null,
      bio: null,
      avatar_url: user.user_metadata?.avatar_url || null,
      phone: user.user_metadata?.phone || null,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('profiles')
      .insert([newProfile])
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const profileData = await getCurrentUserProfile();
      
      if (profileData) {
        setProfile(profileData);
        setEditedProfile(profileData);
        setAvatarPreview(profileData.avatar_url);
      } else {
        throw new Error('Could not load user profile');
      }
    } catch (err: any) {
      setError(err.message || 'Error loading profile');
    } finally {
      setLoading(false);
    }
  };

  // FILE UPLOAD FUNCTIONALITY - ADDED THIS
  const handleFileUpload = async (file: File) => {
    try {
      setUploading(true);
      setError(null);

      const user = await getCurrentUser();
      if (!user) throw new Error('No authenticated user found');

      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        throw new Error('Please select a valid image file (JPEG, PNG, GIF, WebP)');
      }

      if (file.size > maxSize) {
        throw new Error('File size must be less than 5MB');
      }

      // Create preview URL for immediate display
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      if (editedProfile) {
        const updatedProfile = {
          ...editedProfile,
          avatar_url: publicUrl
        };
        setEditedProfile(updatedProfile);
        
        // Auto-save the avatar URL
        await saveProfile(updatedProfile);
      }

      // Animate success
      if (avatarRef.current) {
        gsap.fromTo(avatarRef.current,
          { scale: 0.8 },
          { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" }
        );
      }

    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Error uploading image');
      // Revert to previous avatar on error
      setAvatarPreview(editedProfile?.avatar_url || null);
    } finally {
      setUploading(false);
    }
  };

  // Handle file selection - ADDED THIS
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
    // Reset input
    if (event.target) {
      event.target.value = '';
    }
  };

  // Trigger file input click - ADDED THIS
  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Separate save function for profile updates
  const saveProfile = async (profileData: UserProfile) => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        throw new Error('No authenticated user found');
      }

      const updatedProfile = {
        ...profileData,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .update(updatedProfile)
        .eq('id', user.id);

      if (error) throw error;

      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err: any) {
      throw err;
    }
  };

  const handleSave = async () => {
    if (!editedProfile) return;
    
    try {
      setSaving(true);
      setError(null);

      const updatedProfile = await saveProfile(editedProfile);
      
      setProfile(updatedProfile);
      setEditedProfile(updatedProfile);
      setIsEditing(false);
      
      // Animate success
      gsap.fromTo(profileCardRef.current,
        { backgroundColor: colors.primary + '20' },
        { backgroundColor: colors.surface, duration: 0.5, ease: "power2.out" }
      );
      
    } catch (err: any) {
      setError(err.message || 'Error saving profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setAvatarPreview(profile?.avatar_url || null);
    setIsEditing(false);
    setError(null);
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    if (editedProfile) {
      setEditedProfile({
        ...editedProfile,
        [field]: value
      });
    }
  };

const handleLogout = async () => {
  if (confirm('Are you sure you want to logout?')) {
    try {
      gsap.to(profileCardRef.current, {
        opacity: 0,
        y: 50,
        scale: 0.9,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
          (async () => {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            localStorage.removeItem('currentUser');
            sessionStorage.removeItem('currentUser');
            router.push('/');
          })(); // <-- THIS was missing
        }
      }); // <-- close gsap.to
    } catch (err: any) {
      alert('Error during logout: ' + err.message);
    }
  }
};

  const handleGoToHome = () => {
    router.push('/UserHome');
  };

  const handleEditClick = () => {
    setIsEditing(true);
    animateEditMode();
  };

  // Inline styles
  const detailRow: React.CSSProperties = {
    display: 'flex',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: `1px solid ${colors.border}`,
    alignItems: 'flex-start',
    flexWrap: 'wrap'
  };

  const detailLabel: React.CSSProperties = {
    fontWeight: '600',
    width: '150px',
    color: colors.primary,
    flexShrink: 0,
    marginBottom: '0.5rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontSize: '0.9rem'
  };

  const detailValue: React.CSSProperties = {
    color: colors.textSecondary,
    margin: 0,
    flexGrow: 1,
    lineHeight: '1.5'
  };

  const inputField: React.CSSProperties = {
    padding: '0.75rem',
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    fontSize: '1rem',
    flexGrow: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    color: colors.text,
    transition: 'all 0.3s ease',
    minWidth: '250px',
    fontFamily: 'inherit'
  };

  if (loading) {
    return (
      <div style={{ 
        background: colors.background,
        minHeight: '100vh', 
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
            Loading your profile...
          </p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div style={{ 
        background: colors.background,
        minHeight: '100vh', 
        color: colors.text,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          backgroundColor: colors.surface,
          padding: '3rem',
          borderRadius: '16px',
          border: `1px solid ${colors.primary}`,
          textAlign: 'center',
          maxWidth: '500px',
          width: '90%',
          backdropFilter: 'blur(10px)'
        }}>
          <h2 style={{ 
            color: colors.primary, 
            marginBottom: '1rem',
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Profile Error
          </h2>
          <p style={{ color: colors.textSecondary, marginBottom: '2rem' }}>{error}</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: colors.primary,
                color: colors.text,
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.primaryDark;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.primary;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      background: colors.background,
      minHeight: '100vh', 
      color: colors.text,
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Hidden file input - ADDED THIS */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        style={{ display: 'none' }}
      />

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

      {/* Header */}
      <header style={{
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        borderBottom: `1px solid ${colors.primary}20`,
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(20px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
          }} onClick={handleGoToHome}>
            SUNNY AUTO
          </h1>
          <div style={{ 
            color: colors.primary, 
            fontSize: '0.8rem',
            fontWeight: '700',
            padding: '0.4rem 1rem',
            backgroundColor: `${colors.primary}15`,
            borderRadius: '20px',
            border: `1px solid ${colors.primary}30`,
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            PROFILE
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          style={{
            backgroundColor: 'transparent',
            color: colors.primary,
            border: `1px solid ${colors.primary}50`,
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.9rem',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.primary;
            e.currentTarget.style.color = colors.background;
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = colors.primary;
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <div style={{ 
        padding: '2rem',
        minHeight: 'calc(100vh - 100px)',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ 
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <div 
            ref={profileCardRef}
            style={{
              backgroundColor: colors.surface,
              padding: '3rem',
              borderRadius: '20px',
              border: `1px solid ${colors.primary}30`,
              backdropFilter: 'blur(20px)',
              boxShadow: `0 20px 40px ${colors.primary}10`,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Profile Header with Avatar */}
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div 
                ref={avatarRef}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  marginBottom: '2rem',
                  position: 'relative'
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    cursor: isEditing ? 'pointer' : 'default',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={handleAvatarClick} // ADDED THIS
                  onMouseEnter={(e) => {
                    if (isEditing) {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (isEditing) {
                      e.currentTarget.style.transform = 'scale(1)';
                    }
                  }}
                >
                  {avatarPreview ? (
                    <img 
                      src={avatarPreview} 
                      alt="Profile" 
                      style={{
                        width: '140px',
                        height: '140px',
                        borderRadius: '50%',
                        border: `4px solid ${colors.primary}`,
                        objectFit: 'cover',
                        boxShadow: `0 10px 30px ${colors.primary}30`
                      }} 
                    />
                  ) : (
                    <div style={{
                      width: '140px',
                      height: '140px',
                      borderRadius: '50%',
                      backgroundColor: colors.surfaceLight,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `4px solid ${colors.primary}`,
                      boxShadow: `0 10px 30px ${colors.primary}30`
                    }}>
                      <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path 
                          d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" 
                          fill={colors.primary}
                        />
                      </svg>
                    </div>
                  )}
                  
                  {/* Upload overlay - ADDED THIS */}
                  {isEditing && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      color: colors.text,
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      textAlign: 'center'
                    }}
                    className="upload-overlay">
                      {uploading ? 'Uploading...' : 'Click to upload\nprofile picture'}
                    </div>
                  )}
                </div>

                {/* Uploading indicator - ADDED THIS */}
                {uploading && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '160px',
                    height: '160px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      border: `3px solid ${colors.border}`,
                      borderTop: `3px solid ${colors.primary}`,
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                  </div>
                )}
              </div>
              
              <h2 style={{ 
                fontSize: '2.5rem',
                fontWeight: '900',
                marginBottom: '1rem',
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-1px'
              }}>
                Personal Profile
              </h2>
              <p style={{ 
                color: colors.textSecondary, 
                fontSize: '1.1rem',
                marginBottom: '0.5rem'
              }}>
                Welcome back, {editedProfile?.full_name || 'Valued Customer'}
              </p>

              {/* Upload instructions - ADDED THIS */}
              {isEditing && (
                <p style={{ 
                  color: colors.textMuted, 
                  fontSize: '0.9rem',
                  marginTop: '0.5rem'
                }}>
                  Click on avatar to upload profile picture
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div style={{
                backgroundColor: `${colors.error}20`,
                border: `1px solid ${colors.error}`,
                color: '#fca5a5',
                padding: '1rem 1.5rem',
                borderRadius: '12px',
                marginBottom: '2rem',
                fontSize: '0.9rem',
                textAlign: 'center'
              }}>
                <strong>Error:</strong> {error}
              </div>
            )}

            {/* Profile Details */}
            <div ref={detailsRef}>
              <div className="detail-row" style={detailRow}>
                <label style={detailLabel}>User ID</label>
                <p style={{
                  ...detailValue, 
                  fontFamily: 'monospace', 
                  fontSize: '0.85em', 
                  wordBreak: 'break-all',
                  color: colors.textMuted
                }}>
                  {editedProfile?.id}
                </p>
              </div>

              <div className="detail-row" style={detailRow}>
                <label style={detailLabel}>Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedProfile?.email || ''}
                    disabled
                    style={{
                      ...inputField,
                      backgroundColor: '#374151',
                      color: colors.textMuted,
                      cursor: 'not-allowed'
                    }}
                    title="Email cannot be changed"
                  />
                ) : (
                  <p style={detailValue}>{editedProfile?.email}</p>
                )}
              </div>

              <div className="detail-row" style={detailRow}>
                <label style={detailLabel}>Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile?.full_name || ''}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    style={inputField}
                    placeholder="Enter your full name"
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.primary;
                      e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = colors.border;
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                ) : (
                  <p style={detailValue}>{editedProfile?.full_name || 'Not provided'}</p>
                )}
              </div>

              <div className="detail-row" style={detailRow}>
                <label style={detailLabel}>Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedProfile?.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    style={inputField}
                    placeholder="Enter your phone number"
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.primary;
                      e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = colors.border;
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                ) : (
                  <p style={detailValue}>{editedProfile?.phone || 'Not provided'}</p>
                )}
              </div>

              <div className="detail-row" style={detailRow}>
                <label style={detailLabel}>Bio</label>
                {isEditing ? (
                  <textarea
                    value={editedProfile?.bio || ''}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    style={{
                      ...inputField,
                      minHeight: '120px',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                    rows={4}
                    placeholder="Tell us about yourself..."
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.primary;
                      e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = colors.border;
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                ) : (
                  <p style={{...detailValue, lineHeight: '1.6'}}>
                    {editedProfile?.bio || 'No bio provided'}
                  </p>
                )}
              </div>

              <div className="detail-row" style={detailRow}>
                <label style={detailLabel}>Avatar URL</label>
                {isEditing ? (
                  <div style={{ flexGrow: 1 }}>
                    <input
                      type="url"
                      value={editedProfile?.avatar_url || ''}
                      onChange={(e) => handleInputChange('avatar_url', e.target.value)}
                      style={inputField}
                      placeholder="https://example.com/avatar.jpg or upload above"
                      onFocus={(e) => {
                        e.target.style.borderColor = colors.primary;
                        e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = colors.border;
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    <p style={{ 
                      color: colors.textMuted, 
                      fontSize: '0.8rem', 
                      marginTop: '0.5rem',
                      lineHeight: '1.4'
                    }}>
                      Enter a direct image URL or click the avatar above to upload a file
                    </p>
                  </div>
                ) : (
                  <p style={detailValue}>{editedProfile?.avatar_url || 'No avatar URL provided'}</p>
                )}
              </div>

              {editedProfile?.created_at && (
                <div className="detail-row" style={detailRow}>
                  <label style={detailLabel}>Member Since</label>
                  <p style={detailValue}>{new Date(editedProfile.created_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric'
                  })}</p>
                </div>
              )}

              {editedProfile?.updated_at && (
                <div className="detail-row" style={detailRow}>
                  <label style={detailLabel}>Last Updated</label>
                  <p style={detailValue}>{new Date(editedProfile.updated_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div 
              ref={buttonsRef}
              style={{ 
                display: 'flex', 
                gap: '1rem', 
                justifyContent: 'center',
                marginTop: '3rem',
                paddingTop: '2rem',
                borderTop: `1px solid ${colors.border}`
              }}
            >
              {isEditing ? (
                <>
                  <button 
                    onClick={handleSave} 
                    style={{
                      backgroundColor: saving ? colors.primaryLight : colors.primary,
                      color: colors.background,
                      border: 'none',
                      padding: '1rem 2rem',
                      borderRadius: '12px',
                      cursor: (saving || uploading) ? 'not-allowed' : 'pointer',
                      fontWeight: '700',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease',
                      opacity: (saving || uploading) ? 0.7 : 1,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      minWidth: '140px'
                    }}
                    disabled={saving || uploading}
                    onMouseEnter={(e) => !saving && !uploading && (e.currentTarget.style.transform = 'translateY(-3px)')}
                    onMouseLeave={(e) => !saving && !uploading && (e.currentTarget.style.transform = 'translateY(0)')}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button 
                    onClick={handleCancel} 
                    style={{
                      backgroundColor: 'transparent',
                      color: colors.primary,
                      border: `2px solid ${colors.primary}50`,
                      padding: '1rem 2rem',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontWeight: '700',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      minWidth: '140px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.primary;
                      e.currentTarget.style.color = colors.background;
                      e.currentTarget.style.transform = 'translateY(-3px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = colors.primary;
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button 
                  onClick={handleEditClick}
                  style={{
                    backgroundColor: colors.primary,
                    color: colors.background,
                    border: 'none',
                    padding: '1rem 2rem',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontWeight: '700',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    minWidth: '140px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primaryDark;
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = `0 10px 25px ${colors.primary}30`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primary;
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .upload-overlay:hover {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
};

export default UserProfile;
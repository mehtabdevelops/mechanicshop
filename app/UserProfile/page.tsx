'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
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
  const router = useRouter();
  const supabase = createClientComponentClient();

  // Red color scheme
  const colors = {
    primary: '#dc2626',
    primaryLight: '#ef4444',
    primaryDark: '#b91c1c',
    background: '#0a0a0a',
    surface: 'rgba(255, 255, 255, 0.05)',
    surfaceLight: 'rgba(255, 255, 255, 0.08)',
    text: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    textMuted: 'rgba(255, 255, 255, 0.5)',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    border: 'rgba(255, 255, 255, 0.1)',
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  const getCurrentUser = async () => {
    try {
      // Get the current authenticated user from Supabase
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
      // Get the current authenticated user
      const user = await getCurrentUser();
      
      if (!user?.id || !user?.email) {
        throw new Error('Invalid user data');
      }

      // Fetch the user's profile from the profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        if (profileError.code === 'PGRST116') {
          // Profile doesn't exist, create a new one using auth user data
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
      first_name: user.user_metadata?.first_name || null,
      last_name: user.user_metadata?.last_name || null,
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
      } else {
        throw new Error('Could not load user profile');
      }
    } catch (err: any) {
      setError(err.message || 'Error loading profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editedProfile) return;
    
    try {
      setSaving(true);
      setError(null);

      // Get current user to verify ownership
      const user = await getCurrentUser();
      if (!user) {
        throw new Error('No authenticated user found');
      }

      // Verify the profile belongs to the current user
      if (editedProfile.id !== user.id) {
        throw new Error('Unauthorized: This profile does not belong to you');
      }

      // Update timestamp
      const updatedProfile = {
        ...editedProfile,
        updated_at: new Date().toISOString()
      };

      // Save to profiles table
      const { error } = await supabase
        .from('profiles')
        .update(updatedProfile)
        .eq('id', user.id);

      if (error) throw error;

      // Update state
      setProfile(updatedProfile);
      setEditedProfile(updatedProfile);
      setIsEditing(false);
      
      // Show success message
      alert('Profile updated successfully!');
      
    } catch (err: any) {
      setError(err.message || 'Error saving profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
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
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        
        // Clear any local storage
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
        
        // Redirect to home page
        router.push('/');
      } catch (err: any) {
        alert('Error during logout: ' + err.message);
      }
    }
  };

  const handleGoToSignup = () => {
    router.push('/signup');
  };

  const handleGoToHome = () => {
    router.push('/UserHome');
  };

  // Inline styles
  const detailRow: React.CSSProperties = {
    display: 'flex',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    alignItems: 'flex-start',
    flexWrap: 'wrap'
  };

  const detailLabel: React.CSSProperties = {
    fontWeight: '600',
    width: '150px',
    color: colors.primary,
    flexShrink: 0,
    marginBottom: '0.5rem'
  };

  const detailValue: React.CSSProperties = {
    color: 'rgba(255, 255, 255, 0.7)',
    margin: 0,
    flexGrow: 1,
    lineHeight: '1.5'
  };

  const inputField: React.CSSProperties = {
    padding: '0.75rem',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '6px',
    fontSize: '1rem',
    flexGrow: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: '#ffffff',
    transition: 'border-color 0.2s ease',
    minWidth: '250px'
  };

  if (loading) {
    return (
      <div style={{ 
        background: colors.background,
        minHeight: '100vh', 
        color: colors.text,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: `4px solid ${colors.border}`,
            borderTop: `4px solid ${colors.primary}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p style={{ color: colors.primary, fontSize: '1.2rem', fontWeight: '600' }}>Loading your profile...</p>
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
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          backgroundColor: colors.surface,
          padding: '3rem',
          borderRadius: '12px',
          border: `1px solid ${colors.primary}`,
          textAlign: 'center',
          maxWidth: '500px',
          width: '90%'
        }}>
          <h2 style={{ color: colors.primary, marginBottom: '1rem' }}>Profile Error</h2>
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
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryDark}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary}
            >
              Try Again
            </button>
            <button 
              onClick={handleGoToSignup}
              style={{
                backgroundColor: 'transparent',
                color: colors.primary,
                border: `1px solid ${colors.primary}`,
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.primary;
                e.currentTarget.style.color = colors.text;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = colors.primary;
              }}
            >
              Go to Signup
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
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        borderBottom: `1px solid ${colors.border}`,
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h1 style={{ 
            fontSize: '1.8rem', 
            fontWeight: '700',
            color: colors.primary,
            margin: 0,
            cursor: 'pointer'
          }} onClick={handleGoToHome}>
            <span style={{ color: colors.primary }}>Sunny</span>
            <span style={{ color: colors.text }}>Auto</span>
          </h1>
          <div style={{ 
            color: colors.primary, 
            fontSize: '0.9rem',
            fontWeight: '500',
            padding: '0.25rem 0.75rem',
            backgroundColor: 'rgba(220, 38, 38, 0.2)',
            borderRadius: '20px',
            border: `1px solid ${colors.primary}`
          }}>
            PERSONAL PROFILE
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button 
            onClick={handleLogout}
            style={{
              backgroundColor: 'transparent',
              color: colors.primary,
              border: `1px solid ${colors.primary}`,
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.primary;
              e.currentTarget.style.color = colors.text;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = colors.primary;
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ 
        padding: '2rem',
        minHeight: 'calc(100vh - 100px)'
      }}>
        <div style={{ 
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <div style={{
            backgroundColor: colors.surface,
            padding: '2.5rem',
            borderRadius: '12px',
            border: `1px solid ${colors.primary}`,
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h2 style={{ 
                color: colors.primary, 
                fontSize: '2rem', 
                fontWeight: '700',
                marginBottom: '1.5rem'
              }}>
                Personal Profile
              </h2>
              <p style={{ color: colors.textSecondary, marginBottom: '1.5rem' }}>
                Welcome to your personalized profile page
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                {editedProfile?.avatar_url ? (
                  <img 
                    src={editedProfile.avatar_url} 
                    alt="Profile" 
                    style={{
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      border: `4px solid ${colors.primary}`,
                      objectFit: 'cover'
                    }} 
                  />
                ) : (
                  <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    backgroundColor: colors.surfaceLight,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `4px solid ${colors.primary}`
                  }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill={colors.primary}/>
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                border: `1px solid ${colors.error}`,
                color: '#fca5a5',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '2rem',
                fontSize: '0.9rem'
              }}>
                <strong>Error:</strong> {error}
              </div>
            )}

            <div style={{ marginBottom: '2rem' }}>
              <div style={detailRow}>
                <label style={detailLabel}>User ID</label>
                <p style={{...detailValue, fontFamily: 'monospace', fontSize: '0.9em', wordBreak: 'break-all'}}>
                  {editedProfile?.id}
                </p>
              </div>

              <div style={detailRow}>
                <label style={detailLabel}>Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedProfile?.email || ''}
                    disabled
                    style={{
                      ...inputField,
                      backgroundColor: '#374151',
                      color: '#9ca3af',
                      cursor: 'not-allowed'
                    }}
                    title="Email cannot be changed"
                  />
                ) : (
                  <p style={detailValue}>{editedProfile?.email}</p>
                )}
              </div>

              <div style={detailRow}>
                <label style={detailLabel}>Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile?.full_name || ''}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    style={inputField}
                    placeholder="Enter your full name"
                  />
                ) : (
                  <p style={detailValue}>{editedProfile?.full_name || 'Not provided'}</p>
                )}
              </div>

              <div style={detailRow}>
                <label style={detailLabel}>First Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile?.first_name || ''}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                    style={inputField}
                    placeholder="Enter your first name"
                  />
                ) : (
                  <p style={detailValue}>{editedProfile?.first_name || 'Not provided'}</p>
                )}
              </div>

              <div style={detailRow}>
                <label style={detailLabel}>Last Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile?.last_name || ''}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    style={inputField}
                    placeholder="Enter your last name"
                  />
                ) : (
                  <p style={detailValue}>{editedProfile?.last_name || 'Not provided'}</p>
                )}
              </div>

              <div style={detailRow}>
                <label style={detailLabel}>Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedProfile?.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    style={inputField}
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <p style={detailValue}>{editedProfile?.phone || 'Not provided'}</p>
                )}
              </div>

              <div style={detailRow}>
                <label style={detailLabel}>Bio</label>
                {isEditing ? (
                  <textarea
                    value={editedProfile?.bio || ''}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    style={{
                      ...inputField,
                      minHeight: '100px',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                    rows={3}
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p style={{...detailValue, lineHeight: '1.5'}}>
                    {editedProfile?.bio || 'No bio provided'}
                  </p>
                )}
              </div>

              <div style={detailRow}>
                <label style={detailLabel}>Avatar URL</label>
                {isEditing ? (
                  <input
                    type="url"
                    value={editedProfile?.avatar_url || ''}
                    onChange={(e) => handleInputChange('avatar_url', e.target.value)}
                    style={inputField}
                    placeholder="https://example.com/avatar.jpg"
                  />
                ) : (
                  <p style={detailValue}>{editedProfile?.avatar_url || 'No avatar URL provided'}</p>
                )}
              </div>

              {editedProfile?.created_at && (
                <div style={detailRow}>
                  <label style={detailLabel}>Account Created</label>
                  <p style={detailValue}>{new Date(editedProfile.created_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                </div>
              )}

              {editedProfile?.updated_at && (
                <div style={detailRow}>
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

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              {isEditing ? (
                <>
                  <button 
                    onClick={handleSave} 
                    style={{
                      backgroundColor: saving ? colors.primaryLight : colors.primary,
                      color: colors.text,
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '8px',
                      cursor: saving ? 'not-allowed' : 'pointer',
                      fontWeight: '600',
                      fontSize: '1rem',
                      transition: 'background-color 0.2s ease',
                      opacity: saving ? 0.7 : 1
                    }}
                    disabled={saving}
                    onMouseEnter={(e) => !saving && (e.currentTarget.style.backgroundColor = colors.primaryDark)}
                    onMouseLeave={(e) => !saving && (e.currentTarget.style.backgroundColor = colors.primary)}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button 
                    onClick={handleCancel} 
                    style={{
                      backgroundColor: 'transparent',
                      color: colors.primary,
                      border: `1px solid ${colors.primary}`,
                      padding: '0.75rem 1.5rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '1rem',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.primary;
                      e.currentTarget.style.color = colors.text;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = colors.primary;
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)} 
                  style={{
                    backgroundColor: colors.primary,
                    color: colors.text,
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '1rem',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryDark}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary}
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
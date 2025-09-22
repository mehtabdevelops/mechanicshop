'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';

interface UserProfile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  updated_at: string | null;
  phone?: string;
  providers?: string[];
  created_at?: string;
}

const UserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userDataStr = sessionStorage.getItem('userData');
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        const userProfile: UserProfile = {
          id: userData.id || '',
          email: userData.email || '',
          first_name: userData.first_name || userData.firstname || null,
          last_name: userData.last_name || null,
          bio: userData.bio || null,
          avatar_url: userData.avatar_url || null,
          updated_at: userData.updated_at || userData.update_at || null,
          phone: userData.phone || '',
          providers: userData.providers || [],
          created_at: userData.created_at || ''
        };
        
        setProfile(userProfile);
        setEditedProfile(userProfile);
        setLoading(false);
        return;
      } catch (err) {
        console.error('Error parsing userData from sessionStorage:', err);
      }
    }
    
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setError('Please sign in to view your profile');
      setLoading(false);
      return;
    }
    fetchUserProfile();
  };

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw userError;
      }
      
      if (!user) {
        throw new Error('No authenticated user found. Please sign in.');
      }

      try {
        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (!profileError && data) {
          const userProfile: UserProfile = {
            id: user.id,
            email: user.email || '',
            first_name: data.firstname,
            last_name: data.last_name,
            bio: data.bio,
            avatar_url: data.avatar_url,
            updated_at: data.update_at,
            phone: user.phone || '',
            providers: user.app_metadata?.providers || [],
            created_at: user.created_at
          };
          setProfile(userProfile);
          setEditedProfile(userProfile);
          return;
        }
      } catch (profileErr) {
        console.log('No profiles table or data found, using auth data only');
      }

      const userProfile: UserProfile = {
        id: user.id,
        email: user.email || '',
        first_name: null,
        last_name: null,
        bio: null,
        avatar_url: null,
        updated_at: null,
        phone: user.phone || '',
        providers: user.app_metadata?.providers || [],
        created_at: user.created_at
      };

      setProfile(userProfile);
      setEditedProfile(userProfile);
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError(err.message || 'An error occurred while fetching profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editedProfile) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          firstname: editedProfile.first_name,
          last_name: editedProfile.last_name,
          bio: editedProfile.bio,
          avatar_url: editedProfile.avatar_url,
          update_at: new Date().toISOString()
        })
        .eq('id', editedProfile.id);
      
      if (error) {
        throw error;
      }
      
      setProfile(editedProfile);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'An error occurred while updating profile');
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleSignIn = () => {
    router.push('/signin');
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  if (loading) {
    return (
      <div style={styles.profileContainer}>
        <div style={styles.profileLoading}>
          <div style={styles.loadingSpinner}></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.profileContainer}>
        <div style={styles.profileError}>
          <h2>Error Loading Profile</h2>
          <p>{error}</p>
          <div style={styles.authActions}>
            <button onClick={fetchUserProfile} style={styles.retryButton}>
              Try Again
            </button>
            <button onClick={handleSignIn} style={styles.signInButton}>
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.logo}>SUNNY AUTO</h1>
        
        <nav style={styles.nav}>
          <button 
            onClick={() => handleNavigation('/')}
            style={styles.navButton}
          >
            HOME
          </button>
          <button 
            onClick={() => handleNavigation('/services')}
            style={styles.navButton}
          >
            SERVICES
          </button>
          <button 
            onClick={() => handleNavigation('/about')}
            style={styles.navButton}
          >
            ABOUT
          </button>
          <button 
            onClick={() => handleNavigation('/contact')}
            style={styles.navButton}
          >
            CONTACT
          </button>
        </nav>
        
        <div style={styles.profileIcon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
          </svg>
        </div>
      </header>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.profileContainer}>
          <div style={styles.profileCard}>
            <div style={styles.profileHeader}>
              <h2 style={styles.profileTitle}>User Profile</h2>
              <div style={styles.avatarContainer}>
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile" style={styles.profileAvatar} />
                ) : (
                  <div style={styles.profileAvatarPlaceholder}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#f97316"/>
                    </svg>
                  </div>
                )}
              </div>
            </div>

            <div style={styles.profileDetails}>
              <div style={styles.detailRow}>
                <label style={styles.detailLabel}>Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedProfile?.email || ''}
                    disabled
                    style={styles.inputField}
                  />
                ) : (
                  <p style={styles.detailValue}>{profile?.email}</p>
                )}
              </div>

              <div style={styles.detailRow}>
                <label style={styles.detailLabel}>First Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile?.first_name || ''}
                    onChange={(e) => setEditedProfile({...editedProfile!, first_name: e.target.value})}
                    style={styles.inputField}
                  />
                ) : (
                  <p style={styles.detailValue}>{profile?.first_name || 'Not provided'}</p>
                )}
              </div>

              <div style={styles.detailRow}>
                <label style={styles.detailLabel}>Last Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile?.last_name || ''}
                    onChange={(e) => setEditedProfile({...editedProfile!, last_name: e.target.value})}
                    style={styles.inputField}
                  />
                ) : (
                  <p style={styles.detailValue}>{profile?.last_name || 'Not provided'}</p>
                )}
              </div>

              <div style={styles.detailRow}>
                <label style={styles.detailLabel}>Bio</label>
                {isEditing ? (
                  <textarea
                    value={editedProfile?.bio || ''}
                    onChange={(e) => setEditedProfile({...editedProfile!, bio: e.target.value})}
                    style={styles.textareaField}
                    rows={3}
                  />
                ) : (
                  <p style={{...styles.detailValue, ...styles.bioText}}>{profile?.bio || 'No bio provided'}</p>
                )}
              </div>

              {profile?.phone && (
                <div style={styles.detailRow}>
                  <label style={styles.detailLabel}>Phone</label>
                  <p style={styles.detailValue}>{profile.phone}</p>
                </div>
              )}

              <div style={styles.detailRow}>
                <label style={styles.detailLabel}>User ID</label>
                <p style={{...styles.detailValue, ...styles.userId}}>{profile?.id}</p>
              </div>

              {profile?.providers && profile.providers.length > 0 && (
                <div style={styles.detailRow}>
                  <label style={styles.detailLabel}>Auth Providers</label>
                  <p style={styles.detailValue}>{profile.providers.join(', ')}</p>
                </div>
              )}

              {profile?.created_at && (
                <div style={styles.detailRow}>
                  <label style={styles.detailLabel}>Account Created</label>
                  <p style={styles.detailValue}>{new Date(profile.created_at).toLocaleDateString()}</p>
                </div>
              )}
            </div>

            <div style={styles.profileActions}>
              {isEditing ? (
                <>
                  <button onClick={handleSave} style={styles.saveButton}>
                    Save Changes
                  </button>
                  <button onClick={handleCancel} style={styles.cancelButton}>
                    Cancel
                  </button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)} style={styles.editButton}>
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

const styles = {
  container: {
    background: '#0f172a',
    minHeight: '100vh',
    color: 'white',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  } as const,
  header: {
    padding: '1.5rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderBottom: '1px solid #334155',
    position: 'sticky' as const,
    top: 0,
    zIndex: 50
  },
  logo: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#f97316',
    margin: 0
  } as const,
  nav: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center'
  } as const,
  navButton: {
    backgroundColor: 'transparent',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'color 0.2s ease',
  } as const,
  profileIcon: {
    color: '#f97316',
    width: '45px',
    height: '45px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(249, 115, 22, 0.1)'
  } as const,
  mainContent: {
    padding: '2rem',
    minHeight: 'calc(100vh - 100px)'
  } as const,
  profileContainer: {
    maxWidth: '800px',
    margin: '0 auto'
  } as const,
  profileCard: {
    backgroundColor: '#1e293b',
    padding: '2.5rem',
    borderRadius: '12px',
    border: '1px solid #334155'
  } as const,
  profileHeader: {
    textAlign: 'center' as const,
    marginBottom: '2rem'
  } as const,
  profileTitle: {
    color: '#f97316',
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '1.5rem'
  } as const,
  avatarContainer: {
    display: 'flex',
    justifyContent: 'center' as const,
    marginBottom: '1.5rem'
  } as const,
  profileAvatar: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    border: '4px solid #f97316',
    objectFit: 'cover' as const
  } as const,
  profileAvatarPlaceholder: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    backgroundColor: '#334155',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '4px solid #f97316'
  } as const,
  profileDetails: {
    marginBottom: '2rem'
  } as const,
  detailRow: {
    display: 'flex',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #334155',
    alignItems: 'center' as const,
    flexWrap: 'wrap' as const
  } as const,
  detailLabel: {
    fontWeight: '600',
    width: '150px',
    color: '#f97316',
    flexShrink: 0
  } as const,
  detailValue: {
    color: '#cbd5e1',
    margin: 0,
    flexGrow: 1
  } as const,
  inputField: {
    padding: '0.75rem',
    border: '1px solid #334155',
    borderRadius: '6px',
    fontSize: '1rem',
    flexGrow: 1,
    backgroundColor: '#0f172a',
    color: 'white'
  } as const,
  textareaField: {
    padding: '0.75rem',
    border: '1px solid #334155',
    borderRadius: '6px',
    fontSize: '1rem',
    flexGrow: 1,
    fontFamily: 'inherit',
    backgroundColor: '#0f172a',
    color: 'white',
    minHeight: '100px',
    resize: 'vertical' as const
  } as const,
  bioText: {
    lineHeight: '1.5'
  } as const,
  userId: {
    fontFamily: 'monospace',
    fontSize: '0.9em',
    wordBreak: 'break-all' as const
  } as const,
  profileActions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center'
  } as const,
  editButton: {
    backgroundColor: '#f97316',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'background-color 0.2s ease'
  } as const,
  saveButton: {
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'background-color 0.2s ease'
  } as const,
  cancelButton: {
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'background-color 0.2s ease'
  } as const,
  profileLoading: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem',
    textAlign: 'center' as const,
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    border: '1px solid #334155'
  } as const,
  loadingSpinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #334155',
    borderTop: '4px solid #f97316',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem'
  } as const,
  profileError: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem',
    textAlign: 'center' as const,
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    border: '1px solid #334155'
  } as const,
  retryButton: {
    backgroundColor: '#f97316',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'background-color 0.2s ease',
    margin: '0.5rem'
  } as const,
  signInButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'background-color 0.2s ease',
    margin: '0.5rem'
  } as const,
  authActions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginTop: '1.5rem',
    flexWrap: 'wrap' as const
  } as const
};

export default UserProfile;
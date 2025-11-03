"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { gsap } from "gsap";

interface AdminProfile {
  id: string;
  email: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  phone: string | null;
  role: string;
  updated_at: string;
  created_at: string;
}

const AdminProfile = () => {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<AdminProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  // Refs for animations
  const profileCardRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  // Orange color scheme matching UserProfile
  const colors = {
    primary: "#FF8C00",
    primaryLight: "#FFA500",
    primaryDark: "#cc7000",
    background: "#000000",
    surface: "rgba(255, 255, 255, 0.05)",
    surfaceLight: "rgba(255, 255, 255, 0.08)",
    text: "#ffffff",
    textSecondary: "rgba(255, 255, 255, 0.7)",
    textMuted: "rgba(255, 255, 255, 0.5)",
    border: "rgba(255, 255, 255, 0.1)",
    success: "#10b981",
    error: "#ef4444",
  };

  useEffect(() => {
    loadAdminProfile();
  }, []);

  // Animation when component mounts
  useEffect(() => {
    if (!loading && profile) {
      animateProfileEntrance();
    }
  }, [loading, profile]);

  const animateProfileEntrance = () => {
    const tl = gsap.timeline();

    tl.fromTo(
      profileCardRef.current,
      { opacity: 0, y: 50, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.7)" }
    );

    tl.fromTo(
      avatarRef.current,
      { opacity: 0, scale: 0, rotation: -180 },
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.5)",
      },
      "-=0.4"
    );

    tl.fromTo(
      detailsRef.current?.querySelectorAll(".detail-row"),
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, ease: "power3.out" },
      "-=0.3"
    );

    tl.fromTo(
      buttonsRef.current,
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
      ease: "power2.out",
    });

    tl.to(profileCardRef.current, {
      y: 0,
      scale: 1,
      duration: 0.3,
      ease: "back.out(1.7)",
    });
  };

  const getCurrentUser = async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("No authenticated user found");
      return user;
    } catch (err: any) {
      console.error("Error getting current user:", err);
      throw err;
    }
  };

  const getCurrentAdminProfile = async () => {
    try {
      const user = await getCurrentUser();

      if (!user?.id || !user?.email) {
        throw new Error("Invalid user data");
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) {
        if (profileError.code === "PGRST116") {
          return await createNewAdminProfile(user);
        }
        throw profileError;
      }

      return profileData;
    } catch (err: any) {
      console.error("Error getting admin profile:", err);
      throw err;
    }
  };

  const createNewAdminProfile = async (user: any) => {
    const newProfile = {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || "Admin User",
      bio: null,
      avatar_url: user.user_metadata?.avatar_url || null,
      phone: user.user_metadata?.phone || null,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("profiles")
      .insert([newProfile])
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const loadAdminProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const profileData = await getCurrentAdminProfile();

      if (profileData) {
        setProfile(profileData);
        setEditedProfile(profileData);
      } else {
        throw new Error("Could not load admin profile");
      }
    } catch (err: any) {
      setError(err.message || "Error loading profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editedProfile) return;

    try {
      setSaving(true);
      setError(null);

      const user = await getCurrentUser();
      if (!user) {
        throw new Error("No authenticated user found");
      }

      if (editedProfile.id !== user.id) {
        throw new Error("Unauthorized: This profile does not belong to you");
      }

      // Create update object with all editable fields
      const updatedProfile = {
        full_name: editedProfile.full_name,
        email: editedProfile.email,
        bio: editedProfile.bio,
        avatar_url: editedProfile.avatar_url,
        phone: editedProfile.phone,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("profiles")
        .update(updatedProfile)
        .eq("id", user.id);

      if (error) throw error;

      // Update local state with the complete profile data
      const completeProfile = {
        ...editedProfile,
        ...updatedProfile,
      };

      setProfile(completeProfile);
      setEditedProfile(completeProfile);
      setIsEditing(false);

      // Animate success
      gsap.fromTo(
        profileCardRef.current,
        { backgroundColor: colors.primary + "20" },
        { backgroundColor: colors.surface, duration: 0.5, ease: "power2.out" }
      );

      // Show success message
      alert("Profile updated successfully!");
    } catch (err: any) {
      setError(err.message || "Error saving profile");
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
    setError(null);
  };

  const handleInputChange = (field: keyof AdminProfile, value: string) => {
    if (editedProfile) {
      setEditedProfile({
        ...editedProfile,
        [field]: value,
      });
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${profile?.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      // Update profile with new avatar URL
      if (editedProfile) {
        const updatedProfile = {
          ...editedProfile,
          avatar_url: publicUrl,
        };
        setEditedProfile(updatedProfile);
        setImageUrl(publicUrl);
        await handleSave();
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
      try {
        // Animate logout
        gsap.to(profileCardRef.current, {
          opacity: 0,
          y: 50,
          scale: 0.9,
          duration: 0.5,
          ease: "power2.in",
          onComplete: async () => {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            localStorage.removeItem("currentUser");
            sessionStorage.removeItem("currentUser");
            router.push("/");
          },
        });
      } catch (err: any) {
        alert("Error during logout: " + err.message);
      }
    }
  };

  const handleBackToDashboard = () => {
    router.push("/AdminHome");
  };

  const handleEditClick = () => {
    setIsEditing(true);
    animateEditMode();
  };

  // Inline styles
  const detailRow: React.CSSProperties = {
    display: "flex",
    marginBottom: "1.5rem",
    paddingBottom: "1rem",
    borderBottom: `1px solid ${colors.border}`,
    alignItems: "flex-start",
    flexWrap: "wrap",
  };

  const detailLabel: React.CSSProperties = {
    fontWeight: "600",
    width: "150px",
    color: colors.primary,
    flexShrink: 0,
    marginBottom: "0.5rem",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    fontSize: "0.9rem",
  };

  const detailValue: React.CSSProperties = {
    color: colors.textSecondary,
    margin: 0,
    flexGrow: 1,
    lineHeight: "1.5",
  };

  const inputField: React.CSSProperties = {
    padding: "0.75rem",
    border: `1px solid ${colors.border}`,
    borderRadius: "8px",
    fontSize: "1rem",
    flexGrow: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    color: colors.text,
    transition: "all 0.3s ease",
    minWidth: "250px",
    fontFamily: "inherit",
  };

  if (loading) {
    return (
      <div
        style={{
          background: colors.background,
          minHeight: "100vh",
          color: colors.text,
          fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              border: `3px solid ${colors.border}`,
              borderTop: `3px solid ${colors.primary}`,
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 1.5rem",
            }}
          />
          <p
            style={{
              color: colors.primary,
              fontSize: "1.3rem",
              fontWeight: "600",
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Loading admin profile...
          </p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div
        style={{
          background: colors.background,
          minHeight: "100vh",
          color: colors.text,
          fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            backgroundColor: colors.surface,
            padding: "3rem",
            borderRadius: "16px",
            border: `1px solid ${colors.primary}`,
            textAlign: "center",
            maxWidth: "500px",
            width: "90%",
            backdropFilter: "blur(10px)",
          }}
        >
          <h2
            style={{
              color: colors.primary,
              marginBottom: "1rem",
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Profile Error
          </h2>
          <p style={{ color: colors.textSecondary, marginBottom: "2rem" }}>
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: colors.primary,
              color: colors.text,
              border: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "1rem",
              transition: "all 0.3s ease",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.primaryDark;
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.primary;
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundImage:
          'url("https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        color: "white",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
        }}
      ></div>

      <header
        style={{
          position: "relative",
          zIndex: 2,
          padding: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.9)",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "600",
            marginBottom: "0.75rem",
            letterSpacing: "1px",
          }}
        >
          <span style={{ color: "#ff6b35" }}>Sunny</span>
          <span style={{ color: "#ffffff" }}>Auto</span>
        </h1>

        <button
          onClick={handleBackToDashboard}
          style={{
            backgroundColor: "#e55a2b",
            color: "#ffffff",
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Back to Dashboard
        </button>
      </header>

      {/* Main Content */}
      <div
        style={{
          padding: "2rem",
          minHeight: "calc(100vh - 100px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          <div
            ref={profileCardRef}
            style={{
              backgroundColor: colors.surface,
              padding: "3rem",
              borderRadius: "20px",
              border: `1px solid ${colors.primary}30`,
              backdropFilter: "blur(20px)",
              boxShadow: `0 20px 40px ${colors.primary}10`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Profile Header with Avatar */}
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <h2
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "900",
                  marginBottom: "2rem",
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  letterSpacing: "-1px",
                }}
              >
                Administrator Profile
              </h2>

              <div
                ref={avatarRef}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "1rem",
                  marginBottom: "2rem",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    backgroundColor: "#ff6b35",
                    margin: "0 auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "3rem",
                    color: "black",
                    border: `4px solid ${colors.primary}`,
                    boxShadow: `0 10px 30px ${colors.primary}30`,
                    overflow: "hidden",
                    position: "relative",
                    cursor: isEditing ? "pointer" : "default",
                  }}
                  onClick={() =>
                    isEditing &&
                    document.getElementById("avatar-upload")?.click()
                  }
                >
                  {imageUrl || editedProfile?.avatar_url ? (
                    <img
                      src={imageUrl || editedProfile?.avatar_url || ""}
                      alt="Profile"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <span>👤</span>
                  )}
                  {uploading && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: colors.text,
                      }}
                    >
                      Uploading...
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  onChange={uploadAvatar}
                  style={{ display: "none" }}
                  disabled={!isEditing}
                />
                {isEditing && (
                  <p
                    style={{
                      color: colors.textSecondary,
                      fontSize: "0.9rem",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      document.getElementById("avatar-upload")?.click()
                    }
                  >
                    {uploading ? "Uploading..." : "Change Profile Picture"}
                  </p>
                )}
              </div>

              <div
                style={{
                  display: "inline-block",
                  backgroundColor: `${colors.primary}20`,
                  color: colors.primary,
                  padding: "0.5rem 1.5rem",
                  borderRadius: "20px",
                  border: `1px solid ${colors.primary}`,
                  fontWeight: "700",
                  fontSize: "0.9rem",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginTop: "1rem",
                }}
              >
                {editedProfile?.full_name || "Administrator"}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div
                style={{
                  backgroundColor: `${colors.error}20`,
                  border: `1px solid ${colors.error}`,
                  color: "#fca5a5",
                  padding: "1rem 1.5rem",
                  borderRadius: "12px",
                  marginBottom: "2rem",
                  fontSize: "0.9rem",
                  textAlign: "center",
                }}
              >
                <strong>Error:</strong> {error}
              </div>
            )}

            {/* Profile Details */}
            <div ref={detailsRef}>
              <div className="detail-row" style={detailRow}>
                <label style={detailLabel}>Admin ID</label>
                <p
                  style={{
                    ...detailValue,
                    fontFamily: "monospace",
                    fontSize: "15px",
                    wordBreak: "break-all",
                    color: colors.textMuted,
                  }}
                >
                  {editedProfile?.id}
                </p>
              </div>

              <div className="detail-row" style={detailRow}>
                <label style={detailLabel}>Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedProfile?.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    style={{
                      ...inputField,
                      backgroundColor: "rgba(0, 0, 0, 0.3)",
                      color: colors.text,
                      cursor: "text",
                    }}
                    placeholder="Enter your email address"
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.primary;
                      e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = colors.border;
                      e.target.style.boxShadow = "none";
                    }}
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
                    value={editedProfile?.full_name || ""}
                    onChange={(e) =>
                      handleInputChange("full_name", e.target.value)
                    }
                    style={inputField}
                    placeholder="Enter your full name"
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.primary;
                      e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = colors.border;
                      e.target.style.boxShadow = "none";
                    }}
                  />
                ) : (
                  <p style={detailValue}>
                    {editedProfile?.full_name || "Not provided"}
                  </p>
                )}
              </div>

              <div className="detail-row" style={detailRow}>
                <label style={detailLabel}>Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedProfile?.phone || ""}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    style={inputField}
                    placeholder="Enter your phone number"
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.primary;
                      e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = colors.border;
                      e.target.style.boxShadow = "none";
                    }}
                  />
                ) : (
                  <p style={detailValue}>
                    {editedProfile?.phone || "Not provided"}
                  </p>
                )}
              </div>

              <div className="detail-row" style={detailRow}>
                <label style={detailLabel}>Bio</label>
                {isEditing ? (
                  <textarea
                    value={editedProfile?.bio || ""}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    style={{
                      ...inputField,
                      minHeight: "120px",
                      resize: "vertical",
                      fontFamily: "inherit",
                    }}
                    rows={4}
                    placeholder="Tell us about yourself..."
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.primary;
                      e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = colors.border;
                      e.target.style.boxShadow = "none";
                    }}
                  />
                ) : (
                  <p style={{ ...detailValue, lineHeight: "1.6" }}>
                    {editedProfile?.bio || "No bio provided"}
                  </p>
                )}
              </div>

              <div className="detail-row" style={detailRow}>
                <label style={detailLabel}>Avatar URL</label>
                {isEditing ? (
                  <input
                    type="url"
                    value={editedProfile?.avatar_url || ""}
                    onChange={(e) =>
                      handleInputChange("avatar_url", e.target.value)
                    }
                    style={inputField}
                    placeholder="https://example.com/avatar.jpg"
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.primary;
                      e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = colors.border;
                      e.target.style.boxShadow = "none";
                    }}
                  />
                ) : (
                  <p style={detailValue}>
                    {editedProfile?.avatar_url || "No avatar URL provided"}
                  </p>
                )}
              </div>

              {editedProfile?.created_at && (
                <div className="detail-row" style={detailRow}>
                  <label style={detailLabel}>Member Since</label>
                  <p style={detailValue}>
                    {new Date(editedProfile.created_at).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              )}

              {editedProfile?.updated_at && (
                <div className="detail-row" style={detailRow}>
                  <label style={detailLabel}>Last Updated</label>
                  <p style={detailValue}>
                    {new Date(editedProfile.updated_at).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div
              ref={buttonsRef}
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                marginTop: "3rem",
                paddingTop: "2rem",
                borderTop: `1px solid ${colors.border}`,
              }}
            >
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    style={{
                      backgroundColor: saving
                        ? colors.primaryLight
                        : colors.primary,
                      color: colors.background,
                      border: "none",
                      padding: "1rem 2rem",
                      borderRadius: "12px",
                      cursor: saving ? "not-allowed" : "pointer",
                      fontWeight: "700",
                      fontSize: "1rem",
                      transition: "all 0.3s ease",
                      opacity: saving ? 0.7 : 1,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      minWidth: "140px",
                    }}
                    disabled={saving}
                    onMouseEnter={(e) =>
                      !saving &&
                      (e.currentTarget.style.transform = "translateY(-3px)")
                    }
                    onMouseLeave={(e) =>
                      !saving &&
                      (e.currentTarget.style.transform = "translateY(0)")
                    }
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={handleCancel}
                    style={{
                      backgroundColor: "transparent",
                      color: colors.primary,
                      border: `2px solid ${colors.primary}50`,
                      padding: "1rem 2rem",
                      borderRadius: "12px",
                      cursor: "pointer",
                      fontWeight: "700",
                      fontSize: "1rem",
                      transition: "all 0.3s ease",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      minWidth: "140px",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.primary;
                      e.currentTarget.style.color = colors.background;
                      e.currentTarget.style.transform = "translateY(-3px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = colors.primary;
                      e.currentTarget.style.transform = "translateY(0)";
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
                    border: "none",
                    padding: "1rem 2rem",
                    borderRadius: "12px",
                    cursor: "pointer",
                    fontWeight: "700",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    minWidth: "140px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primaryDark;
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = `0 10px 25px ${colors.primary}30`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primary;
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
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
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default AdminProfile;

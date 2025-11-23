"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const UserProfSettings = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    fetchUser();
  }, [supabase]);

  useEffect(() => {
    if (!passwordSuccess) return;
    const timer = setTimeout(() => router.push("/AdminHome"), 1500);
    return () => clearTimeout(timer);
  }, [passwordSuccess, router]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setIsSavingPassword(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setPasswordError(error.message);
    } else {
      setPasswordSuccess("Password updated successfully.");
      setNewPassword("");
      setConfirmPassword("");
    }

    setIsSavingPassword(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const colors = {
    primary: "#FF8C00",
    primaryLight: "#FFA500",
    primaryDark: "#FF7F00",
    background: "#0a0a0a",
    surface: "rgba(255, 255, 255, 0.05)",
    surfaceLight: "rgba(255, 255, 255, 0.08)",
    surfaceDark: "rgba(255, 255, 255, 0.02)",
    text: "#ffffff",
    textSecondary: "rgba(255, 255, 255, 0.7)",
    textMuted: "rgba(255, 255, 255, 0.5)",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    border: "rgba(255, 255, 255, 0.1)",
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "2rem auto",
        padding: "2rem",
        backgroundColor: colors.surface,
        borderRadius: "8px",
        boxShadow: `0 4px 12px ${colors.border}`,
      }}
    >
      <h2
        style={{
          marginBottom: "1.5rem",
          fontSize: "1.75rem",
          fontWeight: "700",
          color: colors.text,
        }}
      >
        User Profile Settings
      </h2>

      <form onSubmit={handlePasswordChange}>
        <div style={{ marginBottom: "1rem" }}>
          <label
            htmlFor="newPassword"
            style={{
              display: "block",
              marginBottom: "0.5rem",
              color: colors.textSecondary,
            }}
          >
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: "4px",
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.surfaceDark,
              color: colors.text,
            }}
            required
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label
            htmlFor="confirmPassword"
            style={{
              display: "block",
              marginBottom: "0.5rem",
              color: colors.textSecondary,
            }}
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: "4px",
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.surfaceDark,
              color: colors.text,
            }}
            required
          />
        </div>
        <button
          type="submit"
          disabled={isSavingPassword}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: colors.primary,
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: isSavingPassword ? "not-allowed" : "pointer",
          }}
        >
          {isSavingPassword ? "Saving..." : "Change Password"}
        </button>
      </form>
      {passwordError && (
        <p style={{ color: colors.error, marginTop: "1rem" }}>
          {passwordError}
        </p>
      )}
      {passwordSuccess && (
        <p style={{ color: colors.success, marginTop: "1rem" }}>
          {passwordSuccess}
        </p>
      )}
    </div>
  );
};

export default UserProfSettings;

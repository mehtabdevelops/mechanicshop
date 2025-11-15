"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const UserProfSettings = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });


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







export default UserProfSettings;

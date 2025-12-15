"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RootRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/UserHome");
  }, [router]);

  return null;
}

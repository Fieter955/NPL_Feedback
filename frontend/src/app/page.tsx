"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="h-8 w-8 rounded-full border-4 border-slate-300 border-t-slate-800 animate-spin"></div>
        <p className="text-slate-500 font-medium">Loading Evaluator...</p>
      </div>
    </div>
  );
}

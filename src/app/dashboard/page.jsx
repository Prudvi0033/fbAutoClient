"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axiosInstance from "../../lib/axios";

const DashboardPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
  const checkAuth = async () => {
    try {
      const response = await axiosInstance.get("/auth/profile", {
        withCredentials: true,
      });
      setUser(response.data);
      setLoading(false);
    } catch (err) {
      toast.error("Please login to access dashboard");
      router.push("/auth/login");
    }
  };

  checkAuth();
}, [router]);


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-black"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Welcome, {user?.username || "User"}!</p>
    </div>
  );
};

export default DashboardPage;

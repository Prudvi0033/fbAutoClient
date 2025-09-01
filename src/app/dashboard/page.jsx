"use client";
import { useState, useEffect } from "react";
import FacebookModal from "../components/FacebookModal";
import axiosInstance from "../../lib/axios";
import Sidebar from "../components/Sidebar";

import { Montserrat } from "next/font/google";

const monte = Montserrat({subsets: ['latin']})

export default function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [facebookCreds, setFacebookCreds] = useState(null);

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const res = await axiosInstance.get("/facebook/credentials");
        if (!res.data.hasCredentials) {
          setModalOpen(true);
        } else {
          setFacebookCreds(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch credentials:", err);
      }
    };

    fetchCredentials();
  }, []);

  const handleSaveCreds = async (creds) => {
    try {
      await axiosInstance.post("/facebook/credentials", {
        email: creds.email,
        password: creds.password,
      });

      setModalOpen(false);
      setFacebookCreds(creds);
    } catch (err) {
      console.error("Error saving credentials:", err);
    }
  };

  return (
    <div className={`flex h-screen bg-white ${monte.className}`}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full">
          <h1 className="text-3xl font-bold text-black mb-2">Welcome 🎉</h1>
          <p className="text-gray-600 text-lg">Here is your dashboard overview.</p>
        </div>

        {/* Facebook Credentials Modal */}
        <FacebookModal isOpen={modalOpen} onSave={handleSaveCreds} />
      </div>
    </div>
  );
}
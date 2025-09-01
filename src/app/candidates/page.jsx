"use client";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import axiosInstance from "../../lib/axios";
import { Briefcase, Users, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Montserrat } from "next/font/google";

const monte = Montserrat({ subsets: ["latin"] });

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchCandidates = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await axiosInstance.get("/candidates");
      setCandidates(res.data.data || []);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch candidates:", err);
      setError("Failed to load candidates");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen bg-white">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 rounded-lg p-6 space-y-4">
                <div className="h-6 w-1/2 bg-gray-300 rounded" />
                <div className="h-4 w-1/3 bg-gray-300 rounded" />
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-4 w-full bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen bg-white ${monte.className}`}>
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">Candidates</h1>
            <button
              onClick={() => fetchCandidates(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-black rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Refresh
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Candidates Grid */}
          {candidates.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates found</h3>
              <p className="text-gray-600 mb-4">Candidates will appear here once submitted</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
              {candidates.map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-lg border border-gray-200 shadow hover:shadow-lg transition p-6 flex flex-col gap-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column: Personal Info */}
                    <div className="flex flex-col gap-2">
                      <h2 className="text-xl font-semibold text-black">{c.name}</h2>
                      {c.email && <p className="text-sm text-gray-600">Email: {c.email}</p>}
                      {c.phone && <p className="text-sm text-gray-600">Phone: {c.phone}</p>}
                      {c.experience && (
                        <div className="flex items-center gap-2 text-gray-700 text-sm">
                          <Briefcase size={16} />
                          Experience: {c.experience}
                        </div>
                      )}
                      {c.skills && c.skills.length > 0 && (
                        <div className="flex items-center gap-2 text-gray-700 text-sm">
                          <Users size={16} />
                          Skills: {c.skills.join(", ")}
                        </div>
                      )}
                      {c.screeningScore != null && (
                        <div className="text-sm text-gray-700">
                          Screening Score:
                          <span className="ml-2 font-semibold">{c.screeningScore}/100</span>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className={`h-2 rounded-full ${
                                c.screeningScore > 80
                                  ? "bg-green-500"
                                  : c.screeningScore > 50
                                  ? "bg-yellow-400"
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${c.screeningScore}%` }}
                            />
                          </div>
                        </div>
                      )}
                      {/* <div
                        className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-2 ${
                          c.eligibility === "APPROVED"
                            ? "bg-green-100 text-green-800"
                            : c.eligibility === "REJECTED"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {c.eligibility}
                      </div> */}
                    </div>

                    {/* Right Column: Resume / Notes / Summary */}
                    <div className="flex flex-col gap-2">
                      {c.resumeUrl && (
                        <a
                          href={c.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View Resume
                        </a>
                      )}
                      {c.notes && (
                        <div>
                          <h4 className="text-gray-800 font-medium text-sm mb-1">Notes:</h4>
                          <p className="text-gray-600 text-sm">{c.notes}</p>
                        </div>
                      )}
                      {c.conversationSummary && (
                        <div>
                          <h4 className="text-gray-800 font-medium text-sm mb-1">
                            Conversation Summary:
                          </h4>
                          <p className="text-gray-500 text-sm line-clamp-3">{c.conversationSummary}</p>
                        </div>
                      )}
                      {c.preferredInterviewTime && (
                        <p className="text-gray-600 text-sm mt-2">
                          Preferred Interview: {c.preferredInterviewTime}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Footer: Created At */}
                  <div className="text-gray-400 text-xs text-right">
                    Submitted on {new Date(c.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  RefreshCw,
  Briefcase,
  MapPin,
  Building,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import axiosInstance from "../../lib/axios";
import Sidebar from "../components/Sidebar";

import { Montserrat } from "next/font/google";

const monte = Montserrat({ subsets: ["latin"] });

export default function JobPosts() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchJobs = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await axiosInstance.get("/jobs");
      setJobs(res.data.jobs || []);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "SUCCESS":
        return "text-green-600";
      case "FAILED":
        return "text-red-600";
      case "PENDING":
        return "text-yellow-600";
      case "POSTING":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "SUCCESS":
        return <CheckCircle size={16} />;
      case "FAILED":
        return <XCircle size={16} />;
      case "PENDING":
        return <AlertCircle size={16} />;
      case "POSTING":
        return <Clock size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  if (loading) {
    // Skeleton UI
    return (
      <div className="flex h-screen bg-white">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-100 rounded-lg p-6 space-y-4">
                <div className="h-6 w-3/4 bg-gray-300 rounded" />
                <div className="h-4 w-1/2 bg-gray-300 rounded" />
                <div className="flex gap-4">
                  <div className="h-3 w-1/4 bg-gray-200 rounded" />
                  <div className="h-3 w-1/6 bg-gray-200 rounded" />
                </div>
                <div className="h-12 bg-gray-200 rounded" />
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
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">Job Posts</h1>
              <p className="text-gray-600">
                Manage and track your job postings
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => fetchJobs(true)}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-black rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  size={18}
                  className={refreshing ? "animate-spin" : ""}
                />
                Refresh
              </button>
              <Link
                href="/job-posts/create"
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Plus size={18} />
                Create Job
              </Link>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Jobs Grid */}
          {/* Jobs Grid */}
          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No jobs found
              </h3>
              <p className="text-gray-600 mb-4">
                Start by creating your first job post
              </p>
              <Link
                href="/job-posts/create"
                className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Plus size={18} />
                Create Job
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="block bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)]"
                >
                  <div className="p-6">
                    {/* Job Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-black mb-1 line-clamp-2">
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <Building size={14} />
                          <span className="text-sm">{job.company}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin size={14} />
                          <span className="text-sm">{job.location}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-gray-500">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            job.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {job.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>

                    {/* Job Details */}
                    <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Briefcase size={14} />
                        {job.jobType}
                      </div>
                      {job.experiance && (
                        <div className="flex items-center gap-1">
                          <Users size={14} />
                          {job.experiance}
                        </div>
                      )}
                      {job.salaryRange && (
                        <div className="flex items-center gap-1">
                          💰 {job.salaryRange}
                        </div>
                      )}
                    </div>

                    {/* Posting Status */}
                    {job.postingStatus && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            Posting Status
                          </span>
                          <span className="text-xs text-gray-600">
                            {job.postingStatus.totalGroups} groups
                          </span>
                        </div>
                        <div className="flex gap-4 text-xs">
                          <div
                            className={`flex items-center gap-1 ${getStatusColor(
                              "SUCCESS"
                            )}`}
                          >
                            {getStatusIcon("SUCCESS")}
                            {job.postingStatus.posted} Posted
                          </div>
                          {job.postingStatus.posting > 0 && (
                            <div
                              className={`flex items-center gap-1 ${getStatusColor(
                                "POSTING"
                              )}`}
                            >
                              {getStatusIcon("POSTING")}
                              {job.postingStatus.posting} Posting
                            </div>
                          )}
                          {job.postingStatus.pending > 0 && (
                            <div
                              className={`flex items-center gap-1 ${getStatusColor(
                                "PENDING"
                              )}`}
                            >
                              {getStatusIcon("PENDING")}
                              {job.postingStatus.pending} Pending
                            </div>
                          )}
                          {job.postingStatus.failed > 0 && (
                            <div
                              className={`flex items-center gap-1 ${getStatusColor(
                                "FAILED"
                              )}`}
                            >
                              {getStatusIcon("FAILED")}
                              {job.postingStatus.failed} Failed
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Job Description Preview */}
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {job.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex gap-2">
                        {job.requirements && job.requirements.length > 0 && (
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {job.requirements.length} requirements
                          </span>
                        )}
                        {job.responsibities &&
                          job.responsibities.length > 0 && (
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {job.responsibities.length} responsibilities
                            </span>
                          )}
                      </div>
                      <span className="text-xs text-gray-500">Job card</span>
                    </div>
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

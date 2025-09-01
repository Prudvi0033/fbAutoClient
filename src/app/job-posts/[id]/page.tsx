"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, MapPin, Building, Briefcase, Users, Calendar, Send, BarChart3, RefreshCw, CheckCircle, XCircle, AlertCircle, Clock, ExternalLink } from "lucide-react";
import axiosInstance from "../../../lib/axios";
import Sidebar from "../../components/Sidebar";

export default function SingleJob() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.jobId;
  
  const [job, setJob] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState(null);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/jobs/${jobId}`);
      setJob(res.data.job);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch job:", err);
      setError("Failed to load job details");
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await axiosInstance.get(`/jobs/${jobId}/analytics`);
      setAnalytics(res.data.analytics);
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    }
  };

  useEffect(() => {
    if (jobId) {
      fetchJob();
      fetchAnalytics();
    }
  }, [jobId]);

  const handlePostToFacebook = async () => {
    try {
      setPosting(true);
      await axiosInstance.post(`/jobs/${jobId}/post`);
      // Refresh job data to see updated posting status
      await fetchJob();
      await fetchAnalytics();
    } catch (err) {
      console.error("Failed to post to Facebook:", err);
      alert("Failed to post to Facebook groups. Please try again.");
    } finally {
      setPosting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SUCCESS': return 'text-green-600 bg-green-50 border-green-200';
      case 'FAILED': return 'text-red-600 bg-red-50 border-red-200';
      case 'PENDING': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'POSTING': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'SUCCESS': return <CheckCircle size={16} />;
      case 'FAILED': return <XCircle size={16} />;
      case 'PENDING': return <AlertCircle size={16} />;
      case 'POSTING': return <Clock size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-white">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-black">Loading job details...</div>
        </div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="flex h-screen bg-white">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-600 mb-4">{error || "Job not found"}</div>
            <button
              onClick={() => router.push("/job-posts")}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Back to Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/job-posts")}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-black transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Jobs
              </button>
              <div>
                <h1 className="text-3xl font-bold text-black">{job.title}</h1>
                <div className="flex items-center gap-4 text-gray-600 mt-2">
                  <div className="flex items-center gap-1">
                    <Building size={16} />
                    {job.company}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    {new Date(job.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  fetchJob();
                  fetchAnalytics();
                }}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-black rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw size={18} />
                Refresh
              </button>
              {job.facebookGroups && job.facebookGroups.length > 0 && (
                <button
                  onClick={handlePostToFacebook}
                  disabled={posting}
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {posting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Post to Facebook
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Details Card */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-black">Job Details</h2>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    job.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {job.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Job Type</label>
                    <div className="flex items-center gap-2 text-black">
                      <Briefcase size={16} />
                      {job.jobType}
                    </div>
                  </div>
                  {job.experiance && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Experience</label>
                      <div className="flex items-center gap-2 text-black">
                        <Users size={16} />
                        {job.experiance}
                      </div>
                    </div>
                  )}
                  {job.salaryRange && (
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Salary Range</label>
                      <div className="text-black font-medium">💰 {job.salaryRange}</div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-black mb-2">Description</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
                  </div>

                  {job.requirements && job.requirements.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-black mb-2">Requirements</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {job.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {job.responsibities && job.responsibities.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-black mb-2">Responsibilities</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {job.responsibities.map((resp, index) => (
                          <li key={index}>{resp}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {job.perks && (
                    <div>
                      <h3 className="text-lg font-medium text-black mb-2">Perks & Benefits</h3>
                      <p className="text-gray-700 whitespace-pre-wrap">{job.perks}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Facebook Groups */}
              {job.facebookGroups && job.facebookGroups.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] p-6">
                  <h2 className="text-xl font-semibold text-black mb-4">Facebook Groups</h2>
                  <div className="space-y-3">
                    {job.facebookGroups.map((group, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700 truncate flex-1 mr-3">{group}</span>
                        <a
                          href={group}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                        >
                          <ExternalLink size={14} />
                          Open
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Posting Status */}
              {job.postingStatus && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 size={20} />
                    <h3 className="text-lg font-semibold text-black">Posting Status</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Groups</span>
                      <span className="font-medium text-black">{job.postingStatus.totalGroups}</span>
                    </div>
                    <div className="space-y-2">
                      {job.postingStatus.posted > 0 && (
                        <div className={`flex items-center justify-between p-2 rounded border ${getStatusColor('SUCCESS')}`}>
                          <div className="flex items-center gap-2">
                            {getStatusIcon('SUCCESS')}
                            <span className="text-sm">Posted</span>
                          </div>
                          <span className="font-medium">{job.postingStatus.posted}</span>
                        </div>
                      )}
                      {job.postingStatus.posting > 0 && (
                        <div className={`flex items-center justify-between p-2 rounded border ${getStatusColor('POSTING')}`}>
                          <div className="flex items-center gap-2">
                            {getStatusIcon('POSTING')}
                            <span className="text-sm">Posting</span>
                          </div>
                          <span className="font-medium">{job.postingStatus.posting}</span>
                        </div>
                      )}
                      {job.postingStatus.pending > 0 && (
                        <div className={`flex items-center justify-between p-2 rounded border ${getStatusColor('PENDING')}`}>
                          <div className="flex items-center gap-2">
                            {getStatusIcon('PENDING')}
                            <span className="text-sm">Pending</span>
                          </div>
                          <span className="font-medium">{job.postingStatus.pending}</span>
                        </div>
                      )}
                      {job.postingStatus.failed > 0 && (
                        <div className={`flex items-center justify-between p-2 rounded border ${getStatusColor('FAILED')}`}>
                          <div className="flex items-center gap-2">
                            {getStatusIcon('FAILED')}
                            <span className="text-sm">Failed</span>
                          </div>
                          <span className="font-medium">{job.postingStatus.failed}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Analytics */}
              {analytics && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] p-6">
                  <h3 className="text-lg font-semibold text-black mb-4">Analytics</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{analytics.totalComments}</div>
                        <div className="text-sm text-gray-600">Comments</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{analytics.interestedCandidates}</div>
                        <div className="text-sm text-gray-600">Interested</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{analytics.totalViews}</div>
                        <div className="text-sm text-gray-600">Views</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{analytics.totalReactions}</div>
                        <div className="text-sm text-gray-600">Reactions</div>
                      </div>
                    </div>
                    {analytics.eligibleCandidates > 0 && (
                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{analytics.eligibleCandidates}</div>
                        <div className="text-sm text-gray-600">Eligible Candidates</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Post Details */}
              {job.posts && job.posts.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] p-6">
                  <h3 className="text-lg font-semibold text-black mb-4">Recent Posts</h3>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {job.posts.slice(0, 5).map((post) => (
                      <div key={post.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(post.status)}`}>
                            {post.status}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-sm text-gray-700 truncate">
                          {post.facebookGroupUrl}
                        </div>
                        {post.postUrl && (
                          <a
                            href={post.postUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-1"
                          >
                            <ExternalLink size={12} />
                            View Post
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
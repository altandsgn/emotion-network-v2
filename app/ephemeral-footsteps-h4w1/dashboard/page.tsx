'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Submission {
  id: string;
  message: string;
  emotion: string;
  location: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSubmissions();
  }, [page, statusFilter, searchQuery]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/submissions?page=${page}&status=${statusFilter}&search=${searchQuery}`
      );
      const data = await response.json();
      
      if (response.ok) {
        setSubmissions(data.submissions);
        setTotalPages(data.totalPages);
      } else {
        setError(data.error || 'Failed to fetch submissions');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'approved' | 'rejected') => {
    try {
      const response = await fetch(`/api/admin/submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchSubmissions();
      } else {
        setError('Failed to update submission status');
      }
    } catch (err) {
      setError('Failed to connect to server');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-green-500 font-mono text-3xl mb-8">
          System Control Interface
        </h1>
        
        <div className="mb-8 flex gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-black/50 border border-green-500/50 text-green-500 px-3 py-2 rounded font-mono"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="all">All</option>
          </select>
          
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search submissions..."
            className="flex-1 bg-black/50 border border-green-500/50 text-green-500 px-3 py-2 rounded font-mono"
          />
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 text-red-500 rounded font-mono">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="h-8 w-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="border border-green-500/50 rounded-lg bg-black/80 p-6 backdrop-blur-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-green-500 font-mono">{submission.message}</p>
                    <p className="text-green-500/70 font-mono text-sm mt-1">
                      {submission.emotion} • {submission.location}
                    </p>
                    <p className="text-green-500/50 font-mono text-xs mt-2">
                      {formatDate(submission.createdAt)}
                    </p>
                  </div>
                  
                  {submission.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusChange(submission.id, 'approved')}
                        className="px-3 py-1 bg-green-500/10 border border-green-500/50 text-green-500 rounded font-mono hover:bg-green-500/20"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusChange(submission.id, 'rejected')}
                        className="px-3 py-1 bg-red-500/10 border border-red-500/50 text-red-500 rounded font-mono hover:bg-red-500/20"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {submissions.length === 0 && (
              <div className="text-center text-green-500/50 font-mono py-8">
                No submissions found
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-3 py-1 rounded font-mono ${
                      page === pageNum
                        ? 'bg-green-500/20 border border-green-500 text-green-500'
                        : 'bg-black/50 border border-green-500/50 text-green-500/70 hover:bg-green-500/10'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 
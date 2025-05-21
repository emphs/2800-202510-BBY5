import { createFileRoute } from '@tanstack/react-router'
import React, { useState, useEffect } from 'react'

export const Route = createFileRoute('/my-reports')({
  component: UserReports,
})

function UserReports() {
  const [reports, setReports] = useState<any[]>([])
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const userId = localStorage.getItem('userId')

    if (!userId) {
      setError('User not logged in.')
      setLoading(false)
      return
    }

    fetch(`/api/reports?userId=${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch reports')
        return res.json()
      })
      .then((data) => {
        setReports(data)
      })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => setLoading(false))
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Submitted':
        return '📤'
      case 'In Progress':
        return '🚧'
      case 'Resolved':
        return '✅'
      default:
        return 'ℹ️'
    }
  }

  const filteredReports = reports.filter((r) =>
    filter === 'All' ? true : r.status === filter
  )

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Past Reports</h1>

      {/* Filter */}
      <div className="mb-4">
        <label className="mr-2 font-medium">Filter by status:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2"
        >
          <option value="All">All</option>
          <option value="Submitted">Submitted</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      {/* Loading / Error */}
      {loading && <p>Loading your reports...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Empty State */}
      {!loading && !error && filteredReports.length === 0 && (
        <p>No reports found for this filter.</p>
      )}

      {/* Report List */}
      {filteredReports.map((report) => (
        <div
          key={report.id}
          className="border p-4 mb-4 rounded shadow bg-white"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {getStatusIcon(report.status)} {report.title}
            </h2>
            <span className="text-sm text-gray-500">
              {new Date(report.timestamp).toLocaleString()}
            </span>
          </div>
          <p className="mt-1">{report.description}</p>
          <p className="mt-1">
            Status: <strong>{report.status}</strong>
          </p>
          <button className="text-blue-600 hover:underline mt-2">
            ✏️ Edit Report
          </button>
        </div>
      ))}
    </div>
  )
}

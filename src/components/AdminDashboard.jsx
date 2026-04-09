import React, { useState, useEffect } from 'react';
import { getReports, updateReportStatus, flagReport, deleteReport } from '../services/reportService';

const STATUS_CONFIG = {
  pending: { bg: 'bg-surface-container-highest', text: 'text-secondary', label: 'Pending' },
  verified: { bg: 'bg-secondary-container', text: 'text-on-secondary-container', label: 'Verified' },
  'in-progress': { bg: 'bg-tertiary-container', text: 'text-on-tertiary-container', label: 'In Progress' },
  resolved: { bg: 'bg-primary-container', text: 'text-on-primary-container', label: 'Resolved' },
};

const URGENCY_CONFIG = {
  high: { bg: 'bg-tertiary-container', text: 'text-on-tertiary-container', label: 'CRITICAL', icon: 'emergency' },
  medium: { bg: 'bg-warning/20', text: 'text-warning', label: 'MEDIUM', icon: 'warning' },
  low: { bg: 'bg-success/20', text: 'text-success', label: 'LOW', icon: 'info' },
};

const TYPE_ICONS = {
  violence: 'security',
  accident: 'car_crash',
  fire: 'local_fire_department',
  kidnapping: 'no_encryption',
  medical: 'medical_services',
  other: 'report_problem',
};

function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: 'all', urgency: 'all', type: 'all' });
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { fetchReports(); }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await getReports(filters);
      console.log('Admin dashboard fetched reports:', data.length, data);
      setReports(data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (reportId, newStatus) => {
    try {
      await updateReportStatus(reportId, newStatus);
      fetchReports();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (window.confirm('Confirm deletion of this report?')) {
      try {
        await deleteReport(reportId);
        fetchReports();
      } catch (error) {
        console.error('Error deleting report:', error);
      }
    }
  };

  const filteredReports = reports.filter(report => {
    if (searchTerm) {
      return (
        report.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.location?.address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return true;
  });

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    verified: reports.filter(r => r.status === 'verified').length,
    resolved: reports.filter(r => r.status === 'resolved').length,
    highUrgency: reports.filter(r => r.urgency === 'high').length,
    spam: reports.filter(r => r.aiAnalysis?.isSpam).length,
  };

  return (
    <div className="min-h-screen bg-surface pt-16">
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">Sentinel Command Interface</span>
              <h1 className="text-5xl font-extrabold tracking-tighter text-on-surface leading-none uppercase">Active Directives</h1>
            </div>
            <div className="flex gap-3">
              <button className="bg-primary text-on-primary px-6 py-3 rounded-md font-bold text-sm tracking-tight hover:opacity-90 active:scale-95 transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">add_circle</span>
                Deploy Unit
              </button>
              <button className="bg-tertiary-container text-on-tertiary-container px-6 py-3 rounded-md font-bold text-sm tracking-tight hover:opacity-90 active:scale-95 transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">emergency</span>
                Emergency
              </button>
            </div>
          </div>
        </header>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-surface-container-low p-6 flex flex-col justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-secondary">Total Reports</span>
            <span className="text-6xl font-black tracking-tighter text-primary">{stats.total}</span>
          </div>
          <div className="bg-surface-container-low p-6 flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-widest text-secondary">In Progress</span>
            </div>
            <span className="text-6xl font-black tracking-tighter text-on-surface">{stats.pending}</span>
          </div>
          <div className="bg-surface-container-low p-6 flex flex-col justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-secondary">Verified</span>
            <span className="text-6xl font-black tracking-tighter text-on-surface-variant">{stats.verified}</span>
          </div>
          <div className="bg-primary-container p-6 flex flex-col justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-on-primary-container">Resolved</span>
            <span className="text-6xl font-black tracking-tighter text-white">{stats.resolved}</span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-surface-container-low p-6 rounded-xl mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search directives..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-3 bg-surface-container-highest border-0 rounded-lg focus:ring-2 focus:ring-primary text-sm"
            />
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-4 py-3 bg-surface-container-highest border-0 rounded-lg text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
            <select
              value={filters.urgency}
              onChange={(e) => setFilters(prev => ({ ...prev, urgency: e.target.value }))}
              className="px-4 py-3 bg-surface-container-highest border-0 rounded-lg text-sm"
            >
              <option value="all">All Urgency</option>
              <option value="high">Critical</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="px-4 py-3 bg-surface-container-highest border-0 rounded-lg text-sm"
            >
              <option value="all">All Types</option>
              {Object.keys(TYPE_ICONS).map(type => (
                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Report Cards */}
        {loading ? (
          <div className="bg-surface-container-low p-12 rounded-xl text-center">
            <span className="animate-spin material-symbols-outlined text-primary text-4xl">progress_activity</span>
            <p className="text-on-surface-variant mt-4 text-sm font-bold uppercase tracking-widest">Loading directives...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 px-6 py-2">
              <div className="col-span-5 text-[10px] font-black uppercase tracking-widest text-secondary">Report Identification</div>
              <div className="col-span-2 text-[10px] font-black uppercase tracking-widest text-secondary">Timestamp</div>
              <div className="col-span-2 text-[10px] font-black uppercase tracking-widest text-secondary">Status</div>
              <div className="col-span-3 text-[10px] font-black uppercase tracking-widest text-secondary text-right">Actions</div>
            </div>

            {/* Report Cards */}
            {filteredReports.map((report) => {
              const statusConfig = STATUS_CONFIG[report.status] || STATUS_CONFIG.pending;
              const urgencyConfig = URGENCY_CONFIG[report.urgency] || URGENCY_CONFIG.medium;
              return (
                <div
                  key={report.id}
                  className="bg-surface-container-lowest p-6 flex flex-col md:grid md:grid-cols-12 items-center gap-4 hover:bg-surface-bright transition-colors cursor-pointer group rounded-xl"
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="col-span-5 flex items-start gap-4 w-full">
                    <div className="bg-surface-container-high p-3 rounded-lg flex-shrink-0">
                      <span className="material-symbols-outlined text-primary">
                        {TYPE_ICONS[report.type] || 'report_problem'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-on-surface tracking-tight group-hover:text-primary transition-colors line-clamp-1">
                        {report.aiAnalysis?.summary || report.description?.substring(0, 60)}
                      </h3>
                      <p className="text-sm text-secondary line-clamp-1">{report.location?.address || 'Location unknown'}</p>
                    </div>
                  </div>
                  <div className="col-span-2 w-full">
                    <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                      {report.createdAt?.toDate().toLocaleDateString() || 'N/A'}
                    </span>
                  </div>
                  <div className="col-span-2 w-full">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${statusConfig.bg} ${statusConfig.text} text-[10px] font-black uppercase tracking-tighter`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${report.status === 'pending' ? 'animate-pulse bg-currentColor' : 'bg-currentColor'}`}></span>
                      {statusConfig.label}
                    </span>
                    {report.urgency === 'high' && (
                      <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-tertiary-container text-on-tertiary-container">
                        <span className="material-symbols-outlined text-[10px]">emergency</span>
                        Critical
                      </span>
                    )}
                  </div>
                  <div className="col-span-3 w-full text-right flex items-center justify-end gap-2">
                    <span className="font-mono text-xs text-secondary">
                      {report.aiAnalysis?.severityScore ? `${(report.aiAnalysis.severityScore * 100).toFixed(0)}%` : '--'}
                    </span>
                    <div className="flex gap-1 ml-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleStatusUpdate(report.id, 'verified'); }}
                        className="w-8 h-8 flex items-center justify-center bg-surface-container-low hover:bg-primary-container rounded transition-colors"
                        title="Verify"
                      >
                        <span className="material-symbols-outlined text-sm">verified</span>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteReport(report.id); }}
                        className="w-8 h-8 flex items-center justify-center bg-surface-container-low hover:bg-error-container rounded transition-colors"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredReports.length === 0 && (
              <div className="bg-surface-container-low p-12 rounded-xl text-center">
                <span className="material-symbols-outlined text-on-surface-variant text-4xl">inbox</span>
                <p className="text-on-surface-variant mt-4 text-sm font-bold uppercase tracking-widest">No directives match your filters</p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-12 flex justify-between items-center">
          <p className="text-xs font-bold uppercase tracking-widest text-secondary">
            Displaying {filteredReports.length} of {reports.length} Directives
          </p>
        </div>
      </main>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-black text-on-surface tracking-tighter uppercase">Directive Details</h2>
                <button onClick={() => setSelectedReport(null)} className="text-on-surface-variant hover:text-on-surface">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${URGENCY_CONFIG[selectedReport.urgency]?.bg} ${URGENCY_CONFIG[selectedReport.urgency]?.text}`}>
                    {selectedReport.urgency.toUpperCase()} URGENCY
                  </span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${STATUS_CONFIG[selectedReport.status]?.bg} ${STATUS_CONFIG[selectedReport.status]?.text}`}>
                    {selectedReport.status.toUpperCase()}
                  </span>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Description</h3>
                  <p className="text-on-surface">{selectedReport.description}</p>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Location</h3>
                  <p className="text-on-surface">{selectedReport.location?.address || 'Not provided'}</p>
                </div>

                {selectedReport.mediaUrl && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Evidence</h3>
                    <img src={selectedReport.mediaUrl} alt="Evidence" className="w-full h-auto rounded-lg" />
                  </div>
                )}

                {selectedReport.aiAnalysis && (
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">psychology</span>
                      AI Analysis Results
                    </h3>
                    <div className="space-y-3 text-sm">
                      <p><strong className="text-on-surface-variant">Summary:</strong> <span className="text-on-surface">{selectedReport.aiAnalysis.summary}</span></p>
                      <p><strong className="text-on-surface-variant">Severity Score:</strong> <span className="text-on-surface">{(selectedReport.aiAnalysis.severityScore * 100).toFixed(0)}%</span></p>
                      <p><strong className="text-on-surface-variant">Is Spam:</strong> <span className={selectedReport.aiAnalysis.isSpam ? 'text-error' : 'text-success'}>{selectedReport.aiAnalysis.isSpam ? 'Yes - Flagged' : 'No - Legitimate'}</span></p>
                      <p><strong className="text-on-surface-variant">Category:</strong> <span className="text-on-surface capitalize">{selectedReport.aiAnalysis.correctedCategory}</span></p>
                      {selectedReport.aiAnalysis.recommendedAction && (
                        <p><strong className="text-on-surface-variant">Recommended Action:</strong> <span className="text-on-surface">{selectedReport.aiAnalysis.recommendedAction}</span></p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-outline-variant">
                  <button
                    onClick={() => { handleStatusUpdate(selectedReport.id, 'verified'); setSelectedReport(null); }}
                    className="flex-1 bg-primary text-on-primary py-3 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-primary-container transition-all"
                  >
                    Verify
                  </button>
                  <button
                    onClick={() => { handleStatusUpdate(selectedReport.id, 'in-progress'); setSelectedReport(null); }}
                    className="flex-1 bg-tertiary-container text-on-tertiary-container py-3 rounded-lg font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all"
                  >
                    Mark In Progress
                  </button>
                  <button
                    onClick={() => { handleStatusUpdate(selectedReport.id, 'resolved'); setSelectedReport(null); }}
                    className="flex-1 bg-success text-white py-3 rounded-lg font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all"
                  >
                    Resolve
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden bg-white/85 dark:bg-slate-950/85 backdrop-blur-2xl fixed bottom-0 w-full z-50 rounded-t-2xl shadow-[0_-4px_20px_0_rgba(0,6,102,0.12)]">
        <div className="flex justify-around items-center px-4 pb-6 pt-2">
          <button onClick={() => window.location.href = '/'} className="flex flex-col items-center justify-center text-slate-400 py-2">
            <span className="material-symbols-outlined">home</span>
            <span className="text-[10px] font-black uppercase tracking-widest mt-1">Home</span>
          </button>
          <button onClick={() => window.location.href = '/report'} className="flex flex-col items-center justify-center text-slate-400 py-2">
            <span className="material-symbols-outlined">add_alert</span>
            <span className="text-[10px] font-black uppercase tracking-widest mt-1">Report</span>
          </button>
          <button onClick={() => window.location.href = '/map'} className="flex flex-col items-center justify-center text-slate-400 py-2">
            <span className="material-symbols-outlined">location_searching</span>
            <span className="text-[10px] font-black uppercase tracking-widest mt-1">Tracking</span>
          </button>
          <div className="flex flex-col items-center justify-center bg-blue-900 text-white rounded-xl py-2 px-6 scale-110 -translate-y-2 transition-all">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-[10px] font-black uppercase tracking-widest mt-1">Dashboard</span>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default AdminDashboard;

import React, { useState, useMemo } from 'react';
import { useTapestry } from '../context/TapestryContext';
import { CorporateRole, AuditLog } from '../types';
import {
  Shield,
  ShieldCheck,
  Building2,
  Users,
  FileText,
  Download,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  Database,
  Filter,
  Search,
  Eye,
  Check,
  Award,
  RefreshCw,
  ArrowRight
} from 'lucide-react';

export const CorporateGovernanceView: React.FC = () => {
  const {
    memories,
    auditLogs,
    user,
    corporateRole,
    setCorporateRole,
    corporateDepartment,
    setCorporateDepartment,
    verifyChronicle,
    firestoreConnected,
    showToast,
    navigate
  } = useTapestry();

  const [activeTab, setActiveTab] = useState<'overview' | 'audit' | 'verification' | 'departments'>('overview');
  const [auditFilterAction, setAuditFilterAction] = useState<string>('ALL');
  const [auditSearch, setAuditSearch] = useState<string>('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('ALL');

  const DEPARTMENTS = [
    'CSR & Cultural Heritage (نیکی و خیرخواہی)',
    'Executive Leadership & Strategy',
    'Operations & Northern Logistics',
    'Employee Wellbeing & Culture',
    'Global Diaspora Relations'
  ];

  const ROLES: { id: CorporateRole; label: string; desc: string; badge: string }[] = [
    {
      id: 'admin',
      label: 'Corporate Administrator',
      desc: 'Full sovereign enterprise authority: verify chronicles, manage governance, audit trails.',
      badge: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300'
    },
    {
      id: 'executive',
      label: 'Executive Director',
      desc: 'Strategic oversight across departments, approval powers, milestone certifications.',
      badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300'
    },
    {
      id: 'chronicler',
      label: 'Senior Staff Chronicler',
      desc: 'Writes 2,000-word chronicles under each category, manages department narratives.',
      badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300'
    },
    {
      id: 'auditor',
      label: 'Compliance Auditor',
      desc: 'Read-only inspection of immutable audit records, data integrity verification.',
      badge: 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border-sky-300'
    }
  ];

  // Filtered Audit Logs
  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      if (auditFilterAction !== 'ALL' && log.action !== auditFilterAction) return false;
      if (auditSearch.trim()) {
        const q = auditSearch.toLowerCase();
        const match =
          log.details.toLowerCase().includes(q) ||
          log.action.toLowerCase().includes(q) ||
          log.userEmail.toLowerCase().includes(q) ||
          log.resourceType.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [auditLogs, auditFilterAction, auditSearch]);

  // Department Stats
  const departmentStats = useMemo(() => {
    const stats: Record<string, { total: number; verified: number; kindnessCount: number }> = {};
    DEPARTMENTS.forEach((dept) => {
      stats[dept] = { total: 0, verified: 0, kindnessCount: 0 };
    });

    memories.forEach((m) => {
      const dept = m.department || 'CSR & Cultural Heritage (نیکی و خیرخواہی)';
      if (!stats[dept]) {
        stats[dept] = { total: 0, verified: 0, kindnessCount: 0 };
      }
      stats[dept].total += 1;
      if (m.verified) stats[dept].verified += 1;
      if (m.category === 'Act of Kindness' || m.category === 'Acts That Matter') {
        stats[dept].kindnessCount += 1;
      }
    });

    return stats;
  }, [memories]);

  // Export audit logs as CSV
  const handleExportAuditCSV = () => {
    const headers = ['ID', 'Timestamp', 'User Email', 'Action', 'Resource Type', 'Details'];
    const rows = auditLogs.map((log) => [
      log.id,
      log.timestamp,
      log.userEmail,
      log.action,
      log.resourceType,
      `"${log.details.replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `sheeraza-corporate-audit-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Corporate Audit CSV exported.');
  };

  // Export Executive Compliance Dossier (JSON)
  const handleExportComplianceJSON = () => {
    const data = {
      organization: user?.organization || 'Sheeraza Enterprise Group',
      exportedAt: new Date().toISOString(),
      complianceOfficer: user?.displayName,
      role: corporateRole,
      firestoreDatabaseId: 'ai-studio-tapestrythelivin-6f6c2fe2-6427-4b1f-b1e0-edc40eb6639d',
      totalChronicles: memories.length,
      verifiedChronicles: memories.filter((m) => m.verified).length,
      kindnessInitiatives: memories.filter((m) => m.category === 'Act of Kindness' || m.category === 'Acts That Matter').length,
      auditLogs: auditLogs.slice(0, 100)
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compliance-dossier-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('Executive Compliance Dossier downloaded.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Executive Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-stone-900 text-white shadow-xl border border-stone-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[11px] border border-emerald-500/30 flex items-center gap-1.5">
                <Database size={12} className="text-emerald-400" />
                <span>{firestoreConnected ? 'Cloud Firestore Active' : 'Persistent Storage'}</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-serif text-[11px] border border-amber-500/30">
                Corporate Level Governance (ادارہ جاتی شیرازہ)
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-light text-stone-100">
              Enterprise Governance & Database Portal
            </h1>

            <p className="text-sm text-stone-300 font-serif italic leading-relaxed">
              Real-time Firestore synchronization, Role-Based Access Control (RBAC), immutable compliance audit logs, and departmental verification for high-impact chronicles.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={handleExportComplianceJSON}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-serif flex items-center justify-center gap-2 transition-colors cursor-pointer border border-white/15"
            >
              <Download size={14} />
              <span>Compliance Dossier</span>
            </button>
            <button
              onClick={() => navigate('/record-chronicle')}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-serif font-medium shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles size={14} />
              <span>New Chronicle (2,000w)</span>
            </button>
          </div>
        </div>
      </div>

      {/* METRIC STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white/80 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>Database Records</span>
            <Database size={15} className="text-emerald-600" />
          </div>
          <div className="mt-2 font-serif text-3xl font-light text-stone-900 dark:text-stone-100">
            {memories.length}
          </div>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-serif">
            Live Synchronized
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white/80 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>Verified Milestones</span>
            <ShieldCheck size={15} className="text-amber-600" />
          </div>
          <div className="mt-2 font-serif text-3xl font-light text-stone-900 dark:text-stone-100">
            {memories.filter((m) => m.verified).length}
          </div>
          <span className="text-[11px] text-amber-700 dark:text-amber-400 font-serif">
            Corporate Certified
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white/80 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>Compliance Events</span>
            <Clock size={15} className="text-sky-600" />
          </div>
          <div className="mt-2 font-serif text-3xl font-light text-stone-900 dark:text-stone-100">
            {auditLogs.length}
          </div>
          <span className="text-[11px] text-sky-700 dark:text-sky-400 font-serif">
            Immutable Audit Trail
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white/80 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>CSR & Kindness Acts</span>
            <Award size={15} className="text-rose-600" />
          </div>
          <div className="mt-2 font-serif text-3xl font-light text-stone-900 dark:text-stone-100">
            {memories.filter((m) => m.category === 'Act of Kindness' || m.category === 'Acts That Matter').length}
          </div>
          <span className="text-[11px] text-rose-700 dark:text-rose-400 font-serif">
            نیکی و خدمت
          </span>
        </div>
      </div>

      {/* ROLE SWITCHER CARD */}
      <div className="p-6 rounded-3xl bg-white/80 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-stone-400">
              Enterprise Role-Based Access Control (RBAC)
            </span>
            <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100">
              Active Corporate Role: <span className="text-emerald-700 dark:text-emerald-400 uppercase font-semibold">{corporateRole}</span>
            </h3>
          </div>
          <span className="text-xs text-stone-500 font-serif italic">
            Organization: {user?.organization || 'Sheeraza Enterprise Group'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {ROLES.map((r) => {
            const isSelected = corporateRole === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setCorporateRole(r.id)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-emerald-700 dark:border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/30 shadow-xs ring-2 ring-emerald-600/20'
                    : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 hover:border-stone-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full border ${r.badge}`}>
                    {r.id}
                  </span>
                  {isSelected && <Check size={14} className="text-emerald-600 dark:text-emerald-400" />}
                </div>
                <div className="font-serif text-sm font-medium text-stone-900 dark:text-stone-100 mb-1">
                  {r.label}
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 font-serif leading-relaxed">
                  {r.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-serif transition-colors cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 font-medium'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          Department Portfolios
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl text-xs font-serif transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'audit'
              ? 'bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 font-medium'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          <span>Audit Trail</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
            {auditLogs.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('verification')}
          className={`px-4 py-2 rounded-xl text-xs font-serif transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'verification'
              ? 'bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 font-medium'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          <span>Chronicle Certification</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
            {memories.filter((m) => !m.verified).length} pending
          </span>
        </button>
      </div>

      {/* TAB CONTENT 1: DEPARTMENT PORTFOLIOS */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DEPARTMENTS.map((dept) => {
              const stat = departmentStats[dept] || { total: 0, verified: 0, kindnessCount: 0 };
              const isUserDept = corporateDepartment === dept;

              return (
                <div
                  key={dept}
                  className="p-5 rounded-2xl bg-white/80 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
                        Corporate Unit
                      </span>
                      <h4 className="font-serif text-sm font-medium text-stone-900 dark:text-stone-100 mt-0.5">
                        {dept}
                      </h4>
                    </div>
                    {isUserDept && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-mono">
                        Active
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-stone-100 dark:border-stone-800">
                    <div>
                      <span className="block text-lg font-serif font-medium text-stone-900 dark:text-stone-100">
                        {stat.total}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">Stories</span>
                    </div>
                    <div>
                      <span className="block text-lg font-serif font-medium text-amber-700 dark:text-amber-400">
                        {stat.verified}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">Verified</span>
                    </div>
                    <div>
                      <span className="block text-lg font-serif font-medium text-emerald-700 dark:text-emerald-400">
                        {stat.kindnessCount}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">Kindness</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setCorporateDepartment(dept)}
                      className="text-xs font-serif text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                    >
                      {isUserDept ? 'Selected Unit' : 'Switch Active Unit'}
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate('/record-chronicle')}
                      className="text-xs text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Record</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: IMMUTABLE AUDIT LOG */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white/80 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-mono uppercase text-stone-400">Action:</span>
              {['ALL', 'CREATE', 'UPDATE', 'DELETE', 'VERIFY', 'LOGIN', 'ROLE_CHANGE'].map((act) => (
                <button
                  key={act}
                  onClick={() => setAuditFilterAction(act)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                    auditFilterAction === act
                      ? 'bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900'
                      : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  {act}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Filter audit log..."
                  value={auditSearch}
                  onChange={(e) => setAuditSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-stone-100 dark:bg-stone-800 rounded-lg text-xs border border-transparent focus:border-stone-400 focus:outline-none"
                />
              </div>
              <button
                onClick={handleExportAuditCSV}
                className="px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Download size={13} />
                <span>CSV</span>
              </button>
            </div>
          </div>

          {/* Audit Log Table */}
          <div className="bg-white/80 dark:bg-stone-900/60 rounded-2xl border border-stone-200/80 dark:border-stone-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 dark:bg-stone-800/60 text-stone-500 font-mono uppercase tracking-wider text-[11px] border-b border-stone-200 dark:border-stone-800">
                  <tr>
                    <th className="px-4 py-3">Timestamp</th>
                    <th className="px-4 py-3">Action</th>
                    <th className="px-4 py-3">Resource</th>
                    <th className="px-4 py-3">Actor Email</th>
                    <th className="px-4 py-3">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800 font-mono">
                  {filteredAuditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-stone-400 font-serif italic">
                        No audit events matching criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredAuditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/40">
                        <td className="px-4 py-3 text-stone-500 whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-md font-mono text-[10px] ${
                              log.action === 'CREATE'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : log.action === 'VERIFY'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                : log.action === 'DELETE'
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                : 'bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-300'
                            }`}
                          >
                            {log.action}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-stone-600 dark:text-stone-400">
                          {log.resourceType}
                        </td>
                        <td className="px-4 py-3 text-stone-500 truncate max-w-[160px]">
                          {log.userEmail}
                        </td>
                        <td className="px-4 py-3 text-stone-800 dark:text-stone-200 font-sans">
                          {log.details}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: CHRONICLE CERTIFICATION */}
      {activeTab === 'verification' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-amber-600 shrink-0" />
              <span>
                As <strong>{corporateRole.toUpperCase()}</strong>, you can certify historical truth and corporate compliance on recorded chronicles. Certified chronicles display an official verification crest.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {memories.map((mem) => (
              <div
                key={mem.id}
                className="p-5 rounded-2xl bg-white/80 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                      {mem.category}
                    </span>
                    {mem.verified ? (
                      <span className="flex items-center gap-1 text-[11px] font-serif text-emerald-700 dark:text-emerald-400 font-medium">
                        <CheckCircle size={13} className="text-emerald-600" />
                        <span>Certified by {mem.verifiedBy || 'Admin'}</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-serif text-stone-400 italic">
                        Uncertified
                      </span>
                    )}
                  </div>

                  <h4 className="font-serif text-base font-medium text-stone-900 dark:text-stone-100">
                    {mem.title}
                  </h4>

                  <p className="text-xs text-stone-500 font-serif line-clamp-2">
                    {mem.story}
                  </p>

                  <div className="text-[11px] font-mono text-stone-400 flex items-center gap-3">
                    <span>{mem.date}</span>
                    <span>•</span>
                    <span>{mem.wordCount || mem.story.split(/\s+/).length} words</span>
                    <span>•</span>
                    <span>{mem.department || 'CSR & Cultural Heritage'}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => navigate(`/moments/${mem.id}`)}
                    className="text-xs font-serif text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 cursor-pointer"
                  >
                    Read full narrative
                  </button>

                  <button
                    type="button"
                    onClick={() => verifyChronicle(mem.id, !mem.verified)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-serif transition-colors flex items-center gap-1.5 cursor-pointer ${
                      mem.verified
                        ? 'border border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-300'
                        : 'bg-emerald-900 text-white hover:bg-emerald-800 shadow-xs'
                    }`}
                  >
                    <Award size={13} />
                    <span>{mem.verified ? 'Revoke Certification' : 'Certify Chronicle'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

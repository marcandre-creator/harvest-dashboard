'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

interface VideoJob {
  id: string;
  file_name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  retry_count: number;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  error_message: string | null;
}

interface KnowledgeItem {
  id: string;
  title: string;
  category: string;
  golden_nuggets: string[];
  created_at: string;
}

export default function Dashboard() {
  const [jobs, setJobs] = useState<VideoJob[]>([]);
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL || '',
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
        );

        // Fetch video queue
        const { data: jobsData } = await supabase
          .from('video_harvest_queue')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);

        // Fetch knowledge base
        const { data: kbData } = await supabase
          .from('personal_knowledge')
          .select('id, title, category, golden_nuggets, created_at')
          .eq('source_type', 'drive_video')
          .order('created_at', { ascending: false })
          .limit(10);

        setJobs(jobsData || []);
        setKnowledge(kbData || []);
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Erreur fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Refresh every 5s
    return () => clearInterval(interval);
  }, []);

  const stats = {
    total: jobs.length,
    processing: jobs.filter(j => j.status === 'processing').length,
    completed: jobs.filter(j => j.status === 'completed').length,
    failed: jobs.filter(j => j.status === 'failed').length,
    pending: jobs.filter(j => j.status === 'pending').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return '⏳';
      case 'completed':
        return '✅';
      case 'failed':
        return '❌';
      case 'pending':
        return '📋';
      default:
        return '❓';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">📹 Harvest Videos Dashboard</h1>
          <p className="text-slate-400">
            Dernière mise à jour: {lastUpdated.toLocaleTimeString('fr-CA')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.total, color: 'from-purple-500 to-purple-600' },
            { label: 'En cours', value: stats.processing, color: 'from-blue-500 to-blue-600' },
            { label: 'Complétées', value: stats.completed, color: 'from-green-500 to-green-600' },
            { label: 'En attente', value: stats.pending, color: 'from-yellow-500 to-yellow-600' },
            { label: 'Erreurs', value: stats.failed, color: 'from-red-500 to-red-600' },
          ].map(stat => (
            <div
              key={stat.label}
              className={`bg-gradient-to-br ${stat.color} p-6 rounded-lg text-white shadow-lg`}
            >
              <p className="text-sm font-medium opacity-90">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Queue Section */}
          <div className="bg-slate-800 rounded-lg shadow-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">📋 Queue de Traitement</h2>
            {loading ? (
              <div className="text-slate-400">Chargement...</div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {jobs.map(job => (
                  <div
                    key={job.id}
                    className="bg-slate-700 p-4 rounded-lg border-l-4 border-slate-600"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span>{getStatusIcon(job.status)}</span>
                          <span className="text-sm font-mono text-slate-300 truncate">
                            {job.file_name}
                          </span>
                        </div>
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                            job.status
                          )}`}
                        >
                          {job.status}
                        </span>
                        {job.error_message && (
                          <p className="text-xs text-red-400 mt-2 truncate">
                            ⚠️ {job.error_message.substring(0, 100)}
                          </p>
                        )}
                      </div>
                      {job.retry_count > 0 && (
                        <span className="text-xs text-yellow-400 ml-2">
                          Retry: {job.retry_count}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Knowledge Base Section */}
          <div className="bg-slate-800 rounded-lg shadow-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">📚 Vidéos Traitées</h2>
            {loading ? (
              <div className="text-slate-400">Chargement...</div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {knowledge.map(item => (
                  <div
                    key={item.id}
                    className="bg-slate-700 p-4 rounded-lg hover:bg-slate-600 transition"
                  >
                    <h3 className="font-semibold text-white truncate mb-1">{item.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">
                        {new Date(item.created_at).toLocaleDateString('fr-CA')}
                      </span>
                      <span className="text-xs bg-slate-600 text-slate-200 px-2 py-1 rounded">
                        {item.category}
                      </span>
                    </div>
                    {item.golden_nuggets && item.golden_nuggets.length > 0 && (
                      <p className="text-xs text-slate-300 mt-2">
                        ✨ {item.golden_nuggets.length} nuggets
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 p-4 bg-slate-700 rounded-lg text-center text-slate-400 text-sm">
          Auto-refresh: Toutes les 5 secondes • Powered by Harvest Videos + Supabase
        </div>
      </div>
    </div>
  );
}

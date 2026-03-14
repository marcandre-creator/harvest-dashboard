'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

interface VideoJob {
  id: string;
  file_name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  processing_step: string | null;
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

const STEP_LABELS: Record<string, string> = {
  download: 'Telechargement',
  chunking: 'Decoupage video',
  analysis: 'Analyse Gemini',
  embedding: 'Embeddings',
  kb_save: 'Sauvegarde KB',
  drive_output: 'Export Drive',
  google_docs: 'Google Docs',
  workbook: 'Workbook',
  slides: 'Google Slides',
  move_video: 'Deplacement video',
  complete: 'Termine',
};

const STEP_ORDER = [
  'download', 'chunking', 'analysis', 'embedding', 'kb_save',
  'drive_output', 'google_docs', 'workbook', 'slides', 'move_video', 'complete',
];

function getStepLabel(step: string | null): string {
  if (!step) return '';
  // Handle chunked analysis steps like "analysis_chunk_2_of_6"
  if (step.startsWith('analysis_chunk_')) {
    const parts = step.match(/analysis_chunk_(\d+)_of_(\d+)/);
    if (parts) return `Analyse chunk ${parts[1]}/${parts[2]}`;
  }
  return STEP_LABELS[step] || step;
}

function getStepProgress(step: string | null): number {
  if (!step) return 0;
  const baseStep = step.startsWith('analysis_chunk_') ? 'analysis' : step;
  const idx = STEP_ORDER.indexOf(baseStep);
  if (idx === -1) return 0;
  return Math.round(((idx + 1) / STEP_ORDER.length) * 100);
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

        const { data: jobsData } = await supabase
          .from('video_harvest_queue')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);

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
    const interval = setInterval(fetchData, 5000);
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
      case 'processing': return 'bg-emerald-light text-emerald-dark';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBorderColor = (status: string) => {
    switch (status) {
      case 'processing': return 'border-emerald';
      case 'completed': return 'border-green-500';
      case 'failed': return 'border-red-500';
      case 'pending': return 'border-yellow-500';
      default: return 'border-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing': return '\u23F3';
      case 'completed': return '\u2705';
      case 'failed': return '\u274C';
      case 'pending': return '\uD83D\uDCCB';
      default: return '\u2753';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-deep to-charcoal p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="font-heading font-extrabold text-emerald text-lg tracking-widest">OME</span>
              <span className="font-heading font-bold text-white text-lg tracking-wide">SOLUTION</span>
            </div>
            <h1 className="text-3xl font-heading font-bold text-white">Harvest Videos</h1>
            <p className="text-gray-400 font-body text-sm mt-1">
              Derniere mise a jour: {lastUpdated.toLocaleTimeString('fr-CA')}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.total, bg: 'bg-charcoal', border: 'border-gray-600' },
            { label: 'En cours', value: stats.processing, bg: 'bg-emerald/10', border: 'border-emerald' },
            { label: 'Completees', value: stats.completed, bg: 'bg-green-900/30', border: 'border-green-500' },
            { label: 'En attente', value: stats.pending, bg: 'bg-yellow-900/30', border: 'border-yellow-500' },
            { label: 'Erreurs', value: stats.failed, bg: 'bg-red-900/30', border: 'border-red-500' },
          ].map(stat => (
            <div
              key={stat.label}
              className={`${stat.bg} border ${stat.border} p-5 rounded-lg text-white`}
            >
              <p className="text-xs font-heading font-semibold uppercase tracking-wider text-gray-400">{stat.label}</p>
              <p className="text-3xl font-heading font-bold mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Queue Section */}
          <div className="bg-charcoal rounded-lg border border-gray-700 p-6">
            <h2 className="text-xl font-heading font-bold text-white mb-4">Queue de Traitement</h2>
            {loading ? (
              <div className="text-gray-400 font-body">Chargement...</div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {jobs.map(job => (
                  <div
                    key={job.id}
                    className={`bg-charcoal-deep p-4 rounded-lg border-l-4 ${getBorderColor(job.status)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span>{getStatusIcon(job.status)}</span>
                          <span className="text-sm font-mono text-gray-300 truncate">
                            {job.file_name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${getStatusColor(job.status)}`}
                          >
                            {job.status}
                          </span>
                          {job.status === 'processing' && job.processing_step && (
                            <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-emerald/20 text-emerald-light">
                              {getStepLabel(job.processing_step)}
                            </span>
                          )}
                        </div>
                        {/* Progress bar for processing jobs */}
                        {job.status === 'processing' && job.processing_step && (
                          <div className="mt-2">
                            <div className="w-full bg-gray-700 rounded-full h-1.5">
                              <div
                                className="bg-emerald h-1.5 rounded-full transition-all duration-500"
                                style={{ width: `${getStepProgress(job.processing_step)}%` }}
                              />
                            </div>
                            <p className="text-[10px] text-gray-500 mt-1">
                              {getStepProgress(job.processing_step)}%
                            </p>
                          </div>
                        )}
                        {job.error_message && (
                          <p className="text-xs text-red-400 mt-2 truncate">
                            {job.error_message.substring(0, 100)}
                          </p>
                        )}
                      </div>
                      {job.retry_count > 0 && (
                        <span className="text-xs text-yellow-400 ml-2 whitespace-nowrap">
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
          <div className="bg-charcoal rounded-lg border border-gray-700 p-6">
            <h2 className="text-xl font-heading font-bold text-white mb-4">Videos Traitees</h2>
            {loading ? (
              <div className="text-gray-400 font-body">Chargement...</div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {knowledge.map(item => (
                  <div
                    key={item.id}
                    className="bg-charcoal-deep p-4 rounded-lg border-l-4 border-emerald hover:border-emerald-light transition"
                  >
                    <h3 className="font-heading font-semibold text-white truncate mb-1">{item.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400 font-body">
                        {new Date(item.created_at).toLocaleDateString('fr-CA')}
                      </span>
                      <span className="text-xs bg-emerald/20 text-emerald-light px-2 py-0.5 rounded font-semibold">
                        {item.category}
                      </span>
                    </div>
                    {item.golden_nuggets && item.golden_nuggets.length > 0 && (
                      <p className="text-xs text-gray-400 mt-2">
                        {item.golden_nuggets.length} nuggets
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 p-4 bg-charcoal-deep rounded-lg border border-gray-800 text-center">
          <span className="font-heading font-bold text-emerald text-sm tracking-wider">OME</span>
          <span className="font-heading font-semibold text-gray-400 text-sm ml-1">SOLUTION</span>
          <p className="text-gray-500 text-xs mt-1">Auto-refresh: 5s | Harvest Videos + Supabase</p>
        </div>
      </div>
    </div>
  );
}

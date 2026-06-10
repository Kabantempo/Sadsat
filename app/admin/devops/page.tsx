'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Activity, TrendingUp } from 'lucide-react';

interface MetricData {
  maxProcesses: number;
  maxProcessesLimit: number;
  supabaseConnections: number;
  supabaseLimit: number;
  siteStatus: number;
  timestamp: string;
  analysis: string;
}

interface HistoryItem extends MetricData {
  id: string;
}

export default function DevOpsPage() {
  const [current, setCurrent] = useState<MetricData | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [interval, setInterval] = useState(3600);

  useEffect(() => {
    // Charger les données initiales
    fetchMetrics();
  }, []);

  async function fetchMetrics() {
    try {
      const res = await fetch('/api/devops/check');
      const data = await res.json();
      setCurrent(data);
      setHistory([{ id: Date.now().toString(), ...data }, ...history.slice(0, 9)]);
    } catch (err) {
      console.error('Erreur fetch:', err);
    }
  }

  function toggleMonitoring() {
    if (isMonitoring) {
      setIsMonitoring(false);
    } else {
      setIsMonitoring(true);
      const intervalId = setInterval(fetchMetrics, interval * 1000);
      return () => clearInterval(intervalId);
    }
  }

  if (!current) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Chargement...</p>
      </div>
    );
  }

  const maxProcessesPercent = (current.maxProcesses / 120) * 100; // Seuil critique = 120
  const supabasePercent = (current.supabaseConnections / current.supabaseLimit) * 100;
  const isMaxProcessesCritical = current.maxProcesses > 120; // CRITIQUE si > 120
  const isSupabaseCritical = current.supabaseConnections > 12;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">🤖 DevOps Monitor</h1>
            <p className="text-slate-400">Sadsat Production Monitoring</p>
          </div>
          <button
            onClick={() => { setIsMonitoring(!isMonitoring); fetchMetrics(); }}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              isMonitoring
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isMonitoring ? '⏹️ Stop' : '▶️ Start'} Monitoring
          </button>
        </div>

        {/* Main Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Max Processes Card */}
          <div className={`rounded-lg p-8 backdrop-blur-md ${
            isMaxProcessesCritical
              ? 'bg-red-500/20 border border-red-500/50'
              : maxProcessesPercent > 80
              ? 'bg-yellow-500/20 border border-yellow-500/50'
              : 'bg-green-500/20 border border-green-500/50'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Activity className="w-6 h-6" />
                Max Processes (max: 120)
              </h2>
              {isMaxProcessesCritical ? (
                <AlertCircle className="w-6 h-6 text-red-500" />
              ) : maxProcessesPercent > 80 ? (
                <AlertCircle className="w-6 h-6 text-yellow-500" />
              ) : (
                <CheckCircle className="w-6 h-6 text-green-500" />
              )}
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-5xl font-bold text-white">{current.maxProcesses}</span>
                <span className="text-xl text-slate-300">/ {current.maxProcessesLimit}</span>
              </div>
              <p className="text-slate-400">
                {maxProcessesPercent.toFixed(0)}% utilisation
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all ${
                  isMaxProcessesCritical
                    ? 'bg-red-500'
                    : maxProcessesPercent > 80
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(maxProcessesPercent, 100)}%` }}
              />
            </div>

            {/* Status Message */}
            <div className="mt-4 p-3 bg-slate-800 rounded text-sm text-slate-300">
              {isMaxProcessesCritical
                ? '🔴 CRITIQUE: Site BLOQUÉ par Hostinger (30 min)'
                : maxProcessesPercent > 83 // 100/120
                ? '🟠 ALERTE: Proche du seuil critique (120)'
                : maxProcessesPercent > 67 // 80/120
                ? '🟡 ATTENTION: Utilisation élevée'
                : '🟢 OK: Utilisation normale'}
            </div>
          </div>

          {/* Supabase Pool Card */}
          <div className={`rounded-lg p-8 backdrop-blur-md ${
            isSupabaseCritical
              ? 'bg-orange-500/20 border border-orange-500/50'
              : supabasePercent > 75
              ? 'bg-yellow-500/20 border border-yellow-500/50'
              : 'bg-blue-500/20 border border-blue-500/50'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Supabase Pool
              </h2>
              {isSupabaseCritical ? (
                <AlertCircle className="w-6 h-6 text-orange-500" />
              ) : supabasePercent > 75 ? (
                <AlertCircle className="w-6 h-6 text-yellow-500" />
              ) : (
                <CheckCircle className="w-6 h-6 text-blue-500" />
              )}
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-5xl font-bold text-white">{current.supabaseConnections}</span>
                <span className="text-xl text-slate-300">/ {current.supabaseLimit}</span>
              </div>
              <p className="text-slate-400">
                {supabasePercent.toFixed(0)}% pool utilisé
              </p>
            </div>

            <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all ${
                  isSupabaseCritical
                    ? 'bg-orange-500'
                    : supabasePercent > 75
                    ? 'bg-yellow-500'
                    : 'bg-blue-500'
                }`}
                style={{ width: `${Math.min(supabasePercent, 100)}%` }}
              />
            </div>

            <div className="mt-4 p-3 bg-slate-800 rounded text-sm text-slate-300">
              Mode: <span className="font-semibold">Transaction (6543)</span> — Max 100+
            </div>
          </div>
        </div>

        {/* Site Status */}
        <div className="rounded-lg p-6 bg-slate-700/50 border border-slate-600 mb-8">
          <h3 className="text-lg font-bold text-white mb-3">🌐 Site Status</h3>
          <div className="flex items-center gap-3">
            {current.siteStatus === 200 ? (
              <>
                <CheckCircle className="w-6 h-6 text-green-500" />
                <span className="text-white font-semibold">sadsat.com online</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-6 h-6 text-red-500" />
                <span className="text-white font-semibold">HTTP {current.siteStatus}</span>
              </>
            )}
            <span className="text-slate-400 ml-auto text-sm">
              {new Date(current.timestamp).toLocaleTimeString('fr-FR')}
            </span>
          </div>
        </div>

        {/* AI Analysis */}
        <div className="rounded-lg p-6 bg-slate-700/50 border border-slate-600 mb-8">
          <h3 className="text-lg font-bold text-white mb-3">🤖 Claude Analysis</h3>
          <p className="text-slate-300 whitespace-pre-wrap">{current.analysis}</p>
        </div>

        {/* Settings */}
        <div className="rounded-lg p-6 bg-slate-700/50 border border-slate-600 mb-8">
          <h3 className="text-lg font-bold text-white mb-4">⚙️ Configuration</h3>
          <div className="space-y-3">
            <div>
              <label className="text-slate-300 block text-sm mb-2">
                Intervalle de vérification (secondes)
              </label>
              <input
                type="number"
                value={interval}
                onChange={(e) => setInterval(parseInt(e.target.value))}
                className="w-full px-4 py-2 bg-slate-800 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
              />
              <p className="text-slate-400 text-xs mt-1">
                {interval < 60 ? `${interval}s` : `${(interval / 60).toFixed(0)}min`}
              </p>
            </div>
          </div>
        </div>

        {/* History */}
        <div className="rounded-lg p-6 bg-slate-700/50 border border-slate-600">
          <h3 className="text-lg font-bold text-white mb-4">📊 Historique (10 derniers checks)</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {history.length === 0 ? (
              <p className="text-slate-400">Pas d'historique encore</p>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-3 bg-slate-800/50 rounded text-sm"
                >
                  <span className="text-slate-300">
                    {new Date(item.timestamp).toLocaleTimeString('fr-FR')}
                  </span>
                  <span className="text-white font-semibold">
                    {item.maxProcesses}/{item.maxProcessesLimit}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    item.maxProcesses > 100
                      ? 'bg-red-500/30 text-red-300'
                      : item.maxProcesses > 80
                      ? 'bg-yellow-500/30 text-yellow-300'
                      : 'bg-green-500/30 text-green-300'
                  }`}>
                    {item.siteStatus === 200 ? '✓ Online' : `✗ ${item.siteStatus}`}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

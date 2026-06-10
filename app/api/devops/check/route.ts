import { NextResponse } from 'next/server';

// Mock data — à remplacer par des vraies données Hostinger/Supabase
let mockData = {
  maxProcesses: 45,
  supabaseConnections: 8,
};

export async function GET() {
  try {
    // TODO: Connecter à Hostinger API pour récupérer Max Processes réels
    // TODO: Connecter à Supabase pour récupérer le nombre de connections

    const analysis = generateAnalysis(mockData.maxProcesses);

    return NextResponse.json({
      maxProcesses: mockData.maxProcesses,
      maxProcessesLimit: 120,
      supabaseConnections: mockData.supabaseConnections,
      supabaseLimit: 15,
      siteStatus: 200,
      timestamp: new Date().toISOString(),
      analysis
    });
  } catch (err) {
    console.error('DevOps check error:', err);
    return NextResponse.json(
      { error: 'Failed to check status' },
      { status: 500 }
    );
  }
}

function generateAnalysis(maxProcesses: number): string {
  if (maxProcesses > 120) {
    return '🔴 CRITIQUE\nMax Processes dépasse 120! Le site SERA BLOQUÉ par Hostinger (30 min).\n\nAction IMMÉDIATE:\n1. SSH et tuer les processus Node: pkill -9 node\n2. Ou redéployer (git push origin main)\n3. Ou changer transaction mode (port 6543)';
  }

  if (maxProcesses > 100) {
    return '🟠 ALERTE\nMax Processes proche du seuil critique (120).\n\nActions recommandées:\n1. Vérifier les processus en background\n2. Optimiser les requêtes Supabase\n3. Envisager un redéploiement';
  }

  if (maxProcesses > 80) {
    return '🟡 ATTENTION\nUtilisation élevée mais OK.\n\nMonitorer de près.';
  }

  return '🟢 OK\nSystème en bon état. Utilisation normale.';
}

export async function POST(req: Request) {
  try {
    const { maxProcesses, supabaseConnections } = await req.json();

    mockData = {
      maxProcesses: maxProcesses || mockData.maxProcesses,
      supabaseConnections: supabaseConnections || mockData.supabaseConnections,
    };

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to update mock data' },
      { status: 400 }
    );
  }
}

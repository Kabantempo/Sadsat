#!/usr/bin/env node
/**
 * Sadsat DevOps Monitor
 * Utilise l'agent global pour monitorer Max Processes + status prod
 *
 * Usage:
 *   node devops-monitor.js check          # Vérifier une fois
 *   node devops-monitor.js watch 300      # Vérifier toutes les 5 min
 */

const DevOpsAgent = require("../agents/devops-agent");
const config = require("../agents/config.json");

const sadstatConfig = config.devops.monitoring.sadsat;

const agent = new DevOpsAgent({
  hostingerDomain: sadstatConfig.domain,
  maxProcessesLimit: sadstatConfig.maxProcessesLimit,
  alertThreshold: sadstatConfig.alertThreshold
});

const command = process.argv[2] || "help";

if (command === "check") {
  console.log("🔍 Sadsat DevOps Check...\n");
  agent.monitor({
    verbose: true,
    maxProcesses: parseInt(process.argv[3] || "0"),
    interval: 0
  });
} else if (command === "watch") {
  const seconds = parseInt(process.argv[3] || "60");
  console.log(`⏱️  Watching sadsat.com every ${seconds}s\n`);
  agent.monitor({
    verbose: true,
    maxProcesses: parseInt(process.argv[4] || "0"),
    interval: seconds * 1000
  });
} else {
  console.log(`
🔧 Sadsat DevOps Monitor

Commands:
  node devops-monitor.js check                    # Check now
  node devops-monitor.js watch [seconds]          # Monitor continuously
  node devops-monitor.js check [maxProcesses]     # Check with Max Processes value

Examples:
  node devops-monitor.js check
  node devops-monitor.js check 120                # Simulate Max Processes = 120
  node devops-monitor.js watch 300                # Check every 5 minutes
  node devops-monitor.js watch 60 120             # Check every 60s with Max = 120
  `);
}

// PM2 Configuration для Panda VPN Frontend
module.exports = {
  apps: [{
    name: 'panda-vpn-frontend',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '/root/Panda-vpn',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      NEXT_TELEMETRY_DISABLED: '1'
    },
    error_file: '/root/.pm2/logs/panda-vpn-frontend-error.log',
    out_file: '/root/.pm2/logs/panda-vpn-frontend-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '1G',
    watch: false,
    ignore_watch: ['node_modules', '.next', 'logs']
  }]
}


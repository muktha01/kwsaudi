module.exports = {
  apps: [
    {
      name: 'kwsaudi-backend',
      cwd: './Backend',
      script: 'server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: { 
        NODE_ENV: 'production', 
        PORT: 5001, 
        HOST: '0.0.0.0' 
      },
      max_memory_restart: '1G',
      error_file: './logs/backend-err.log',
      out_file: './logs/backend-out.log',
      time: true,
      autorestart: true,
      watch: false,
      max_restarts: 10,
      min_uptime: '10s'
    },
    {
      name: 'kwsaudi-frontend',
      cwd: './frontend',
      script: 'npm',
      args: 'start',
      instances: 1,
      exec_mode: 'fork',
      env: { 
        NODE_ENV: 'production', 
        PORT: 3000,
        HOST: '0.0.0.0'
      },
      error_file: './logs/frontend-err.log',
      out_file: './logs/frontend-out.log',
      time: true,
      autorestart: true,
      watch: false,
      max_restarts: 10,
      min_uptime: '10s'
    },
    {
      name: 'kwsaudi-admin', 
      cwd: './KW-Saudi-Admin-Dashboard-main',
      script: 'npx',
      args: 'vite preview --port 3001 --host 0.0.0.0',
      instances: 1,
      exec_mode: 'fork',
      env: { 
        NODE_ENV: 'production', 
        PORT: 3001
      },
      error_file: './logs/admin-err.log',
      out_file: './logs/admin-out.log',
      time: true,
      autorestart: true,
      watch: false,
      max_restarts: 10,
      min_uptime: '10s'
    }
  ]
}

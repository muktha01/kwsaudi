#!/bin/bash
# KW Saudi Arabia - Complete Configuration Script
# Run this AFTER cloning the repository on VPS

set -e
echo "🚀 Configuring KW Saudi Arabia..."

# ============================================
# STEP 1: Create Environment Files
# ============================================
echo "📝 Creating environment files..."

# Backend .env
cat > Backend/.env << 'EOF'
NODE_ENV=production
PORT=5001
HOST=0.0.0.0
MONGO_URI=mongodb+srv://priya:priya123@kw.astrfes.mongodb.net/?retryWrites=true&w=majority&appName=kw
JWT_SECRET=kwsaudi-prod-jwt-secret-2026-change-this-minimum-32-chars
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=dbnesacgi
CLOUDINARY_API_KEY=535936974827325
CLOUDINARY_API_SECRET=bCDPuwzkpd6EKItm4enFzFZ_DOc
CORS_ORIGIN=https://www.kwsaudiarabia.com,https://kwsaudiarabia.com,https://kw-saudiarabia.com
EOF

# Frontend .env.local
cat > frontend/.env.local << 'EOF'
NEXT_PUBLIC_API_URL=https://www.kwsaudiarabia.com/api
NEXTAUTH_SECRET=kwsaudi-nextauth-prod-2026-random-32-characters-here
NEXTAUTH_URL=https://www.kwsaudiarabia.com
NODE_ENV=production
EOF

# Admin .env
cat > KW-Saudi-Admin-Dashboard-main/.env << 'EOF'
REACT_APP_API_URL=https://www.kwsaudiarabia.com/api
VITE_API_URL=https://www.kwsaudiarabia.com/api
VITE_APP_BASE_NAME=/
NODE_ENV=production
EOF

echo "✅ Environment files created"

# ============================================
# STEP 2: Install Dependencies & Build
# ============================================
echo "📦 Installing dependencies and building..."

# Backend
echo "Building Backend..."
cd Backend
npm ci --production
cd ..

# Frontend (Next.js 15)
echo "Building Frontend..."
cd frontend
rm -rf .next node_modules package-lock.json
npm install
npm run build
cd ..

# Admin Dashboard (Vite)
echo "Building Admin Dashboard..."
cd KW-Saudi-Admin-Dashboard-main
rm -rf node_modules dist build
npm install
npm run build
cd ..

echo "✅ All applications built"

# ============================================
# STEP 3: Start PM2
# ============================================
echo "🔄 Starting PM2 processes..."
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup

echo "✅ PM2 started"
pm2 status

# ============================================
# STEP 4: Configure NGINX
# ============================================
echo "🌐 Configuring NGINX..."

# Frontend + API
cat > /etc/nginx/sites-available/kw-frontend << 'NGINX_EOF'
server {
    listen 80;
    listen [::]:80;
    server_name www.kwsaudiarabia.com kwsaudiarabia.com;
    
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    client_max_body_size 50M;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    location /api/ {
        proxy_pass http://localhost:5001/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location /uploads/ {
        proxy_pass http://localhost:5001/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
NGINX_EOF

# Admin + API
cat > /etc/nginx/sites-available/kw-admin << 'NGINX_EOF'
server {
    listen 80;
    listen [::]:80;
    server_name kw-saudiarabia.com;
    
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    client_max_body_size 50M;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    location /api/ {
        proxy_pass http://localhost:5001/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location /uploads/ {
        proxy_pass http://localhost:5001/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
NGINX_EOF

# Enable sites
ln -sf /etc/nginx/sites-available/kw-frontend /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/kw-admin /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

nginx -t
systemctl reload nginx

echo "✅ NGINX configured"

# ============================================
# STEP 5: Install SSL
# ============================================
echo "🔒 Ready to install SSL certificates"
echo ""
echo "⚠️  IMPORTANT: Make sure DNS is configured first!"
echo "    A    www.kwsaudiarabia.com  →  31.97.62.135"
echo "    A    kwsaudiarabia.com      →  31.97.62.135"
echo "    A    kw-saudiarabia.com     →  31.97.62.135"
echo ""
echo "To install SSL, run:"
echo "certbot --nginx -d www.kwsaudiarabia.com -d kwsaudiarabia.com -d kw-saudiarabia.com"
echo ""
echo "🎉 Configuration Complete!"
echo ""
echo "Test URLs:"
echo "  Backend API: http://31.97.62.135:5001/api/test"
echo "  Frontend:    http://31.97.62.135:3000"
echo "  Admin:       http://31.97.62.135:3001"

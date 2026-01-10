# 🚀 KW SAUDI ARABIA - HOSTINGER VPS DEPLOYMENT GUIDE
## Complete Deployment from GitHub (Fresh Ubuntu 24.04)

**Repository**: https://github.com/muktha01/kwsaudi  
**Domains**: 
- www.kwsaudiarabia.com → Frontend (Next.js on port 3000)
- kw-saudiarabia.com → Admin Dashboard (Vite on port 3001)
- Backend API → Port 5001 (shared by both apps)

---

## 📋 STEP-BY-STEP DEPLOYMENT (Copy-Paste Ready)

### 🔌 STEP 1: SSH into Your Fresh VPS
```bash
ssh root@YOUR_VPS_IP
# Enter your password
```

---

### 📦 STEP 2: Install All Dependencies (10 mins)
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs nginx certbot python3-certbot-nginx git ufw

# Install PM2 globally
npm i -g pm2

# Configure Firewall
ufw allow ssh
ufw allow 'Nginx Full'
ufw --force enable

# Verify installations
node -v   # Should show v20.x.x
npm -v    # Should show 10.x.x
pm2 -v    # Should show 5.x.x
nginx -v  # Should show nginx version
```

---

### 📥 STEP 3: Clone GitHub Repository
```bash
cd /root
git clone https://github.com/muktha01/kwsaudi.git
cd kwsaudi
mkdir -p logs
```

---

### 🔐 STEP 4: Create Environment Files

#### Backend Environment (.env)
```bash
cat > Backend/.env << 'EOF'
NODE_ENV=production
PORT=5001
HOST=0.0.0.0
MONGO_URI=mongodb+srv://priya:priya123@kw.astrfes.mongodb.net/?retryWrites=true&w=majority&appName=kw
JWT_SECRET=kwsaudi-prod-jwt-secret-2026-change-this-32-chars-minimum
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=dbnesacgi
CLOUDINARY_API_KEY=535936974827325
CLOUDINARY_API_SECRET=bCDPuwzkpd6EKItm4enFzFZ_DOc
CORS_ORIGIN=https://www.kwsaudiarabia.com,https://kwsaudiarabia.com,https://kw-saudiarabia.com
EOF
```

#### Frontend Environment (.env.local)
```bash
cat > frontend/.env.local << 'EOF'
NEXT_PUBLIC_API_URL=https://www.kwsaudiarabia.com/api
NEXTAUTH_SECRET=kwsaudi-nextauth-secret-2026-random-32-characters
NEXTAUTH_URL=https://www.kwsaudiarabia.com
NODE_ENV=production
EOF
```

#### Admin Dashboard Environment (.env)
```bash
cat > KW-Saudi-Admin-Dashboard-main/.env << 'EOF'
REACT_APP_API_URL=https://www.kwsaudiarabia.com/api
VITE_API_URL=https://www.kwsaudiarabia.com/api
VITE_APP_BASE_NAME=/
NODE_ENV=production
EOF
```

---

### 🏗️ STEP 5: Build All Applications (15-20 mins)

#### Build Backend
```bash
cd /root/kwsaudi/Backend
npm ci --production
cd ..
```

#### Build Frontend (Next.js 15)
```bash
cd /root/kwsaudi/frontend
rm -rf .next node_modules package-lock.json
npm install
npm run build
cd ..
```

#### Build Admin Dashboard (Vite)
```bash
cd /root/kwsaudi/KW-Saudi-Admin-Dashboard-main
rm -rf node_modules dist build
npm install
npm run build
cd ..
```

---

### 🔄 STEP 6: Start Applications with PM2

#### Verify ecosystem.config.cjs exists
```bash
cd /root/kwsaudi
cat ecosystem.config.cjs
```

#### Start PM2 processes
```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
pm2 status
```

**Expected Output:**
```
┌────┬─────────────────────┬─────────┬─────────┬──────────┐
│ id │ name                │ mode    │ ↺       │ status   │
├────┼─────────────────────┼─────────┼─────────┼──────────┤
│ 0  │ kwsaudi-backend     │ cluster │ 0       │ online   │
│ 1  │ kwsaudi-frontend    │ fork    │ 0       │ online   │
│ 2  │ kwsaudi-admin       │ fork    │ 0       │ online   │
└────┴─────────────────────┴─────────┴─────────┴──────────┘
```

#### Test locally
```bash
curl http://localhost:5001/api/test        # Backend
curl http://localhost:3000 | head -10      # Frontend
curl http://localhost:3001 | head -10      # Admin
```

---

### 🌐 STEP 7: Configure NGINX

#### Frontend Configuration
```bash
cat > /etc/nginx/sites-available/kw-frontend << 'EOF'
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
EOF
```

#### Admin Configuration
```bash
cat > /etc/nginx/sites-available/kw-admin << 'EOF'
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
EOF
```

#### Enable Sites & Reload NGINX
```bash
ln -sf /etc/nginx/sites-available/kw-frontend /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/kw-admin /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test configuration
nginx -t

# Reload NGINX
systemctl reload nginx
systemctl status nginx
```

---

### 🔒 STEP 8: SSL Certificates with Let's Encrypt

**⚠️ CRITICAL: Before running, ensure DNS is configured!**

#### Configure DNS First (in Hostinger Panel):
```
Type    Name                        Value
A       www.kwsaudiarabia.com       YOUR_VPS_IP
A       kwsaudiarabia.com           YOUR_VPS_IP
A       kw-saudiarabia.com          YOUR_VPS_IP
```

#### Verify DNS propagation:
```bash
dig +short www.kwsaudiarabia.com
dig +short kwsaudiarabia.com
dig +short kw-saudiarabia.com
# All should return YOUR_VPS_IP
```

#### Install SSL Certificates:
```bash
certbot --nginx \
  -d www.kwsaudiarabia.com \
  -d kwsaudiarabia.com \
  -d kw-saudiarabia.com \
  --non-interactive \
  --agree-tos \
  --email your-email@example.com \
  --redirect
```

---

### ✅ STEP 9: Final Verification

#### Check All Services:
```bash
# PM2 Status
pm2 status

# Check Logs
pm2 logs --lines 50

# Test Backend API
curl https://www.kwsaudiarabia.com/api/test

# Test Listings (should show 216 properties)
curl https://www.kwsaudiarabia.com/api/listings | jq '.pagination.totalitems'

# Test Frontend
curl -I https://www.kwsaudiarabia.com

# Test Admin
curl -I https://kw-saudiarabia.com
```

#### Check NGINX:
```bash
systemctl status nginx
nginx -t
```

---

## 🎉 DEPLOYMENT COMPLETE!

Your KW Saudi Arabia platform is now LIVE at:

- **Frontend**: https://www.kwsaudiarabia.com
- **Admin Dashboard**: https://kw-saudiarabia.com
- **API**: https://www.kwsaudiarabia.com/api

---

## 🔧 USEFUL COMMANDS

### PM2 Management:
```bash
pm2 status                    # Check all processes
pm2 logs                      # View all logs
pm2 logs kwsaudi-backend      # Backend logs only
pm2 logs kwsaudi-frontend     # Frontend logs only
pm2 logs kwsaudi-admin        # Admin logs only
pm2 restart all               # Restart all apps
pm2 stop all                  # Stop all apps
pm2 delete all                # Delete all apps
pm2 save                      # Save current process list
```

### Deploy Updates from GitHub:
```bash
cd /root/kwsaudi
git pull origin main
pm2 restart all
```

### Rebuild After Code Changes:
```bash
# Backend (if dependencies changed)
cd /root/kwsaudi/Backend && npm ci --production && cd ..

# Frontend (if code changed)
cd /root/kwsaudi/frontend && npm run build && cd ..
pm2 restart kwsaudi-frontend

# Admin (if code changed)
cd /root/kwsaudi/KW-Saudi-Admin-Dashboard-main && npm run build && cd ..
pm2 restart kwsaudi-admin
```

### NGINX Management:
```bash
systemctl status nginx        # Check NGINX status
systemctl reload nginx        # Reload config
systemctl restart nginx       # Full restart
nginx -t                      # Test configuration
tail -f /var/log/nginx/error.log    # Watch error logs
tail -f /var/log/nginx/access.log   # Watch access logs
```

### SSL Certificate Renewal:
```bash
certbot renew                 # Renew certificates
certbot certificates          # List certificates
```

### System Monitoring:
```bash
htop                          # System resources
df -h                         # Disk space
free -h                       # Memory usage
netstat -tulpn | grep LISTEN  # Check open ports
```

---

## 🐛 TROUBLESHOOTING

### Issue: PM2 process crashes
```bash
pm2 logs kwsaudi-backend --err --lines 100
pm2 restart kwsaudi-backend
```

### Issue: Frontend not building
```bash
cd /root/kwsaudi/frontend
rm -rf .next node_modules
npm install
npm run build
pm2 restart kwsaudi-frontend
```

### Issue: SSL certificate problems
```bash
certbot renew --dry-run
certbot delete
# Then re-run certbot --nginx command
```

### Issue: NGINX 502 Bad Gateway
```bash
# Check if apps are running
pm2 status
curl http://localhost:3000
curl http://localhost:3001
curl http://localhost:5001/api/test

# Check NGINX config
nginx -t
systemctl restart nginx
```

---

## 📞 SUPPORT

If you encounter issues:
1. Check PM2 logs: `pm2 logs`
2. Check NGINX logs: `tail -f /var/log/nginx/error.log`
3. Verify DNS: `dig +short www.kwsaudiarabia.com`
4. Test local ports: `netstat -tulpn | grep LISTEN`

---

**🚀 Your KW Saudi Arabia platform is production-ready!**

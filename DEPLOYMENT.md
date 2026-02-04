# Digital Ocean Deployment Guide

## Prerequisites
- Digital Ocean account
- Domain name (optional but recommended)

## Option 1: App Platform (Recommended for beginners)

### Backend Deployment

1. **Create App**
   - Go to Digital Ocean → App Platform
   - Click "Create App"
   - Connect your GitHub repository
   - Select `backend` folder as source

2. **Configure Environment**
   - Add environment variables:
     ```
     MONGODB_URI=your_mongodb_atlas_connection_string
     JWT_SECRET=your_production_secret_key
     NODE_ENV=production
     PORT=8080
     ```

3. **Configure Build**
   - Build Command: `npm install`
   - Run Command: `npm start`

### Frontend Deployment

1. **Create App**
   - Create another app for frontend
   - Select root folder as source

2. **Configure Build**
   - Build Command: `npm install && npm run build`
   - Output Directory: `dist`

3. **Update API URL**
   - Create `.env.production` in root:
     ```
     VITE_API_URL=https://your-backend-app.ondigitalocean.app
     ```

## Option 2: Droplet (More control)

### 1. Create Droplet
```bash
# Choose Ubuntu 22.04
# At least 1GB RAM recommended
```

### 2. Initial Setup
```bash
# SSH into droplet
ssh root@your_droplet_ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install Nginx
apt install -y nginx

# Install PM2
npm install -g pm2
```

### 3. Deploy Backend
```bash
# Clone repository
git clone https://github.com/your-username/church-project.git
cd church-project/backend

# Install dependencies
npm install

# Create .env file
nano .env
# Add your environment variables

# Start with PM2
pm2 start server.js --name church-backend
pm2 save
pm2 startup
```

### 4. Deploy Frontend
```bash
cd ../
npm install
npm run build

# Copy build to nginx
cp -r dist /var/www/church-frontend
```

### 5. Configure Nginx
```bash
nano /etc/nginx/sites-available/church
```

Add this configuration:
```nginx
# Backend
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/church-frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Enable site:
```bash
ln -s /etc/nginx/sites-available/church /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### 6. SSL Certificate (Let's Encrypt)
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
```

### 7. Firewall
```bash
ufw allow 'Nginx Full'
ufw allow OpenSSH
ufw enable
```

## Domain Configuration

### DNS Settings
Add these records to your domain:

```
Type    Name    Value
A       @       your_droplet_ip
A       www     your_droplet_ip
A       api     your_droplet_ip
```

## Continuous Deployment

### Setup GitHub Actions Secret
1. Go to GitHub repository → Settings → Secrets
2. Add secrets:
   - `DROPLET_IP`
   - `SSH_PRIVATE_KEY`
   - `MONGODB_URI`
   - `JWT_SECRET`

### Auto-deploy on push
The `.github/workflows/ci-cd.yml` will automatically deploy on push to main branch.

## Monitoring

```bash
# View backend logs
pm2 logs church-backend

# Monitor resources
pm2 monit

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## Backup Strategy

1. **Database**: MongoDB Atlas has automatic backups
2. **Code**: GitHub repository
3. **Uploads**: Setup automated backup script
   ```bash
   # Add to crontab
   0 2 * * * rsync -av /path/to/uploads /backup/location
   ```

## Troubleshooting

### Backend not starting
```bash
pm2 logs church-backend
# Check MongoDB connection
# Verify environment variables
```

### Frontend not loading
```bash
# Check nginx configuration
nginx -t

# Check nginx logs
tail -f /var/log/nginx/error.log
```

### CORS errors
Update backend CORS configuration to include your domain.

## Cost Estimate

- **App Platform**: ~$12-25/month (2 apps)
- **Droplet**: ~$6-12/month (1GB-2GB RAM)
- **Domain**: ~$10-15/year
- **MongoDB Atlas**: Free (M0 tier)

**Total**: ~$18-40/month

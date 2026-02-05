# 🚀 Church Platform Deployment Guide

This guide details how to deploy the application to **DigitalOcean** using the production-ready Docker configuration.

## Option 1: DigitalOcean App Platform (Easiest)
This is the recommended approach for professional, high-availability hosting.

1. **Connect GitHub**: Go to DO App Platform and select your `church-project` repository.
2. **Auto-Detect Docker**: DigitalOcean will automatically see your `Dockerfile` and offer to build it.
3. **Configure Environment Variables**:
   In the "Environment Variables" section, add the following (refer to `backend/.env.example`):
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: A secure random string.
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `CLIENT_URL`: Your final domain (e.g., `https://church.ge`).
   - `VITE_API_URL`: `https://church.ge/api`
4. **Deploy**: Click "Create Resources". DigitalOcean will build your Docker image and provide a live URL.

## Option 2: DigitalOcean Droplet (VPS/Manual)
Use this if you want full control over the Linux server.

1. **Setup Docker**: Install Docker and Docker Compose on your Droplet.
2. **Clone & Setup**:
   ```bash
   git clone https://github.com/acdagunes/church-project.git
   cd church-project
   cp backend/.env.example backend/.env
   # Edit backend/.env with your production values
   ```
3. **Launch**:
   ```bash
   docker-compose up -d
   ```

## Post-Deployment Checklist
- [ ] **SSL (HTTPS)**: Ensure your domain is pointed to the DO App Platform or Droplet.
- [ ] **Database**: We recommend using **MongoDB Atlas** (Free/Pro tier) for external persistence.
- [ ] **Uploads**: If using a Droplet, ensure the `uploads_data` volume is being backed up.

---
✨ **Your church platform is now architecturaly ready for the world!**

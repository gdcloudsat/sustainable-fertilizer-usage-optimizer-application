# Installation Guide

## Sustainable Fertilizer Usage Optimizer Application

This guide will walk you through the installation and setup process for the Sustainable Fertilizer Usage Optimizer application.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start with Docker](#quick-start-with-docker)
- [Manual Installation](#manual-installation)
- [Development Setup](#development-setup)
- [Production Deployment](#production-deployment)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### For Docker Deployment
- [Docker](https://docs.docker.com/get-docker/) (version 20.10 or higher)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0 or higher)

### For Manual Installation
- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/get-npm) (version 9 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (version 6.0 or higher)
  - Or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for a cloud-hosted solution

---

## Quick Start with Docker

The fastest way to get started is using Docker Compose. This will spin up the entire application stack including the frontend, backend, and MongoDB database.

### 1. Clone the Repository

```bash
git clone https://github.com/gdcloudsat/sustainable-fertilizer-usage-optimizer-application.git
cd sustainable-fertilizer-usage-optimizer-application
```

### 2. Configure Environment Variables

Create a `.env` file in the project root (optional but recommended):

```bash
# Create .env file
cp backend/.env.example .env
```

Edit the `.env` file with your preferred settings:

```env
JWT_SECRET=your_super_secret_jwt_key_change_in_production
WEATHER_API_KEY=your_openweather_api_key_optional
```

### 3. Start the Application

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

### 4. Access the Application

- **Frontend Application**: http://localhost
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

### 5. Initialize the Database (First Time Only)

The database will be automatically seeded with initial data on first startup.

### 6. Stopping the Application

```bash
# Stop all services
docker-compose down

# Stop and remove all data (including database)
docker-compose down -v
```

---

## Manual Installation

If you prefer to run the application without Docker, follow these steps.

### 1. Clone the Repository

```bash
git clone https://github.com/gdcloudsat/sustainable-fertilizer-usage-optimizer-application.git
cd sustainable-fertilizer-usage-optimizer-application
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Backend Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your configuration
nano .env  # or use your preferred editor
```

Minimum required configuration:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sustainable_fertilizer
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Ubuntu/Debian
sudo systemctl start mongod

# On Windows
net start MongoDB
```

### 5. Seed the Database (Optional)

```bash
node utils/initDb.js
```

### 6. Start the Backend Server

```bash
# Development mode with hot reload
npm run dev

# Or production mode
npm start
```

The backend will be available at `http://localhost:5000`.

### 7. Install Frontend Dependencies

Open a new terminal window:

```bash
cd frontend
npm install
```

### 8. Start the Frontend Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`.

---

## Development Setup

For active development, you can use Docker Compose with hot reloading for the backend:

### Using Docker Compose for Development

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop development environment
docker-compose -f docker-compose.dev.yml down
```

This configuration:
- Runs MongoDB in a container
- Mounts your local backend code for hot reloading
- Allows you to run the frontend separately for development

### Frontend Development (Separate)

With the development Docker Compose running:

```bash
cd frontend
npm install
npm run dev
```

---

## Production Deployment

### Using Docker Compose (Recommended)

```bash
# Start in production mode
docker-compose -f docker-compose.yml up -d

# View logs
docker-compose logs -f

# Scale backend instances (if needed)
docker-compose up -d --scale backend=3
```

### Environment Variables for Production

Create a production `.env` file:

```env
# Required
JWT_SECRET=your_very_long_and_random_secret_key_min_32_chars
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/sustainable_fertilizer

# Optional
WEATHER_API_KEY=your_openweather_api_key
NODE_ENV=production
```

### SSL/HTTPS Configuration

For production deployments, configure SSL certificates in the frontend nginx configuration:

1. Update `frontend/nginx.conf` with your SSL certificates
2. Or use a reverse proxy like Nginx or Traefik

Example with Let's Encrypt:

```yaml
# Add to docker-compose.yml
services:
  reverse-proxy:
    image: traefik:v2.10
    command:
      - "--api.insecure=true"
      - "--providers.docker=true"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencrypt.acme.tlschallenge=true"
      - "--certificatesresolvers.letsencrypt.acme.email=your@email.com"
      - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
    ports:
      - "443:443"
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock:ro"
      - "./letsencrypt:/letsencrypt"
```

---

## Environment Variables

### Backend Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | 5000 | Server port |
| `MONGODB_URI` | Yes | - | MongoDB connection string |
| `JWT_SECRET` | Yes | - | Secret key for JWT tokens |
| `WEATHER_API_KEY` | No | - | OpenWeather API key |
| `NODE_ENV` | No | development | Environment mode |

### Frontend Build Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL (default: http://localhost:5000) |

---

## Troubleshooting

### Common Issues

#### MongoDB Connection Failed

**Error**: `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution**:
- Ensure MongoDB is running: `sudo systemctl status mongod`
- Check your `MONGODB_URI` in `.env`
- For Docker: Ensure the MongoDB container is healthy: `docker-compose ps`

#### Port Already in Use

**Error**: `Error: listen EADDRINUSE: address already in use :::5000`

**Solution**:
```bash
# Find and kill the process
lsof -ti:5000 | xargs kill -9

# Or use a different port in .env
PORT=5001
```

#### Frontend Build Failures

**Error**: Module not found or build errors

**Solution**:
```bash
# Clear node_modules and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

#### Docker Permission Denied

**Error**: `permission denied while trying to connect to Docker daemon`

**Solution**:
```bash
# Add your user to docker group
sudo usermod -aG docker $USER
# Log out and log back in
```

### Health Checks

All services include health checks:

```bash
# Check backend health
curl http://localhost:5000/api/health

# Check frontend health
curl http://localhost

# Check MongoDB health (from container)
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"
```

### Logs

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

---

## Next Steps

After installation:

1. **Register an Account**: Visit http://localhost and create a new account
2. **Complete Your Profile**: Add your farm details and location
3. **Input Soil Data**: Enter your soil test results
4. **Get Recommendations**: Generate your first fertilizer recommendation

## Support

For additional help:

- Check the [README.md](README.md) for API documentation
- Open an issue on GitHub
- Contact us at support@ecofertilizer.com

---

## License

This project is licensed under the MIT License.

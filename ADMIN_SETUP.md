# Admin Panel Setup Guide

This guide explains how to set up and use the Admin Panel for the Sustainable Fertilizer Usage Optimizer application.

## Overview

The admin panel is a separate React application designed for managing the platform. It provides:

- User management (view, activate/block, delete)
- Fertilizer management (CRUD operations)
- Crop management (CRUD operations)
- Dashboard with statistics
- Secure admin-only access

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Deployment Structure                  │
├─────────────────────────────────────────────────────────┤
│  api.domain.com      → Backend API (Port 5000)          │
│  app.domain.com      → User Frontend (Port 3000)        │
│  admin.domain.com    → Admin Frontend (Port 3001)       │
└─────────────────────────────────────────────────────────┘
```

## Setup Instructions

### 1. Backend Setup

The backend has been updated with admin support:

#### Updated Files:
- `backend/models/User.js` - Added `role` and `status` fields
- `backend/middleware/admin.js` - Admin role verification middleware
- `backend/routes/admin.js` - Admin-only API endpoints
- `backend/server.js` - Added admin routes

#### Create Admin User:

Run the following command to create an admin user:

```bash
cd backend
node utils/createAdmin.js
```

This will create an admin user with:
- Email: `admin@example.com`
- Password: `admin123`
- Role: `admin`
- Status: `active`

⚠️ **Important**: Change the admin password after first login!

### 2. Admin Frontend Setup

#### Install Dependencies:

```bash
cd admin-frontend
npm install
```

#### Configure Environment:

Create a `.env` file in `admin-frontend/`:

```
VITE_API_URL=http://localhost:5000/api
```

For production, use your actual API URL:

```
VITE_API_URL=https://api.domain.com/api
```

#### Start Development Server:

```bash
cd admin-frontend
npm run dev
```

The admin panel will be available at: `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login (works for both user and admin)
- `GET /api/auth/me` - Get current user info

### Admin Endpoints (Protected)

#### Statistics
- `GET /api/admin/stats` - Get dashboard statistics

#### User Management
- `GET /api/admin/users` - List users (with pagination and filters)
- `GET /api/admin/users/:id` - Get single user
- `PATCH /api/admin/users/:id/status` - Update user status (active/blocked)
- `DELETE /api/admin/users/:id` - Delete user

#### Fertilizer Management
- `GET /api/admin/fertilizers` - List fertilizers (with pagination and filters)
- `POST /api/admin/fertilizers` - Create fertilizer
- `GET /api/admin/fertilizers/:id` - Get single fertilizer
- `PUT /api/admin/fertilizers/:id` - Update fertilizer
- `DELETE /api/admin/fertilizers/:id` - Delete fertilizer

#### Crop Management
- `GET /api/admin/crops` - List crops (with pagination and filters)
- `POST /api/admin/crops` - Create crop
- `GET /api/admin/crops/:id` - Get single crop
- `PUT /api/admin/crops/:id` - Update crop
- `DELETE /api/admin/crops/:id` - Delete crop

## Security Features

### Backend Security
1. **JWT Authentication**: All admin routes require valid JWT token
2. **Role Verification**: Only users with `role: 'admin'` can access admin endpoints
3. **Middleware Protection**: `adminMiddleware` checks both authentication and role

### Frontend Security
1. **Protected Routes**: All admin routes wrapped with `ProtectedRoute` component
2. **Role Check**: Redirects to login if user is not admin
3. **Token Storage**: JWT stored securely in localStorage
4. **Auto Logout**: Automatic logout on token expiry (401) or unauthorized access (403)
5. **API Interceptors**: Global error handling for auth failures

## Admin Panel Features

### 1. Authentication
- Login page with email/password
- Admin role verification
- Secure token storage
- Auto-redirect to dashboard after successful login

### 2. Dashboard
- Total users count
- Active users count
- Total fertilizers count
- Total crops count
- Recent users list

### 3. User Management
- List all users with pagination
- Search users by name or email
- Filter by status (active/blocked)
- Filter by role (user/admin)
- View user details
- Activate/block users
- Delete users

### 4. Fertilizer Management
- List all fertilizers with pagination
- Search fertilizers by name
- Filter by type (organic, inorganic, etc.)
- Add new fertilizer
- Edit existing fertilizer
- View fertilizer details
- Delete fertilizer

### 5. Crop Management
- List all crops with pagination
- Search crops by name
- Filter by category
- Add new crop
- Edit existing crop
- View crop details
- Delete crop

## Development Workflow

### Running All Services

For local development, you'll need to run:

1. **Backend** (Terminal 1):
```bash
cd backend
npm run dev
```
Runs on: `http://localhost:5000`

2. **User Frontend** (Terminal 2):
```bash
cd frontend
npm run dev
```
Runs on: `http://localhost:3000`

3. **Admin Frontend** (Terminal 3):
```bash
cd admin-frontend
npm run dev
```
Runs on: `http://localhost:3001`

### Database Seeding

If you need to seed initial data:

```bash
cd backend
node utils/initDb.js
```

## Production Deployment

### Environment Variables

Create `.env` files for each service:

**Backend (.env)**:
```
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-secret-key
PORT=5000
```

**Admin Frontend (.env)**:
```
VITE_API_URL=https://api.domain.com/api
```

### Deployment Checklist

1. ✅ Backend admin routes are configured
2. ✅ Admin user created in database
3. ✅ Admin frontend environment variables set
4. ✅ DNS configured for admin.domain.com
5. ✅ SSL certificates configured
6. ✅ CORS configured to allow admin.domain.com
7. ✅ Admin password changed from default

## Troubleshooting

### Admin Login Fails

1. Check if admin user exists:
```bash
cd backend
node -e "require('mongoose').connect(process.env.MONGODB_URI).then(() => require('./models/User').findOne({role: 'admin'}).then(u => console.log(u || 'No admin user')))"
```

2. Create admin user if doesn't exist:
```bash
cd backend
node utils/createAdmin.js
```

### 401 Unauthorized Errors

- Check that JWT token is being sent in Authorization header
- Verify token hasn't expired
- Check that `VITE_API_URL` is correct

### 403 Forbidden Errors

- Verify user has `role: 'admin'`
- Check that admin middleware is applied to routes

### CORS Issues

Update backend CORS configuration to allow admin domain:

```javascript
// backend/server.js
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'https://admin.domain.com'],
  credentials: true
}));
```

## User Management Operations

### Activating a User
```bash
PATCH /api/admin/users/:id/status
Body: { "status": "active" }
```

### Blocking a User
```bash
PATCH /api/admin/users/:id/status
Body: { "status": "blocked" }
```

### Deleting a User
```bash
DELETE /api/admin/users/:id
```

## Support

For issues or questions:
1. Check the main README.md
2. Review API endpoints documentation
3. Check browser console for errors
4. Check network tab for failed requests

## License

MIT License - See main project LICENSE file

# Admin Panel - Sustainable Fertilizer Usage Optimizer

A separate React-based admin panel for managing the Sustainable Fertilizer Usage Optimizer application.

## Features

- **Authentication**: Admin-only login with JWT authentication
- **Dashboard**: Overview with statistics for users, fertilizers, and crops
- **User Management**: View, activate/block, and delete users
- **Fertilizer Management**: Full CRUD operations for fertilizers
- **Crop Management**: Full CRUD operations for crops
- **Responsive Design**: Professional admin UI with sidebar navigation
- **Security**: Role-based access control, protected routes

## Tech Stack

- React 18 with Vite
- React Router for navigation
- Axios for API calls
- Tailwind CSS for styling
- Lucide React for icons
- React Hot Toast for notifications
- Context API for authentication state

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running on port 5000

### Installation

1. Navigate to the admin-frontend directory:
```bash
cd admin-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and set your API URL:
```
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:3001`

## Project Structure

```
admin-frontend/
├── src/
│   ├── components/
│   │   └── ProtectedRoute.jsx    # Route protection wrapper
│   ├── context/
│   │   └── AuthContext.jsx       # Authentication state management
│   ├── layouts/
│   │   └── AdminLayout.jsx       # Main layout with sidebar
│   ├── pages/
│   │   ├── auth/
│   │   │   └── Login.jsx         # Admin login page
│   │   ├── dashboard/
│   │   │   └── Dashboard.jsx     # Dashboard with stats
│   │   ├── users/
│   │   │   ├── UserList.jsx      # User management
│   │   │   └── ViewUser.jsx      # View user details
│   │   ├── fertilizers/
│   │   │   ├── FertilizerList.jsx # Fertilizer management
│   │   │   ├── FertilizerForm.jsx # Add/Edit fertilizer
│   │   │   └── ViewFertilizer.jsx # View fertilizer details
│   │   └── crops/
│   │       ├── CropList.jsx      # Crop management
│   │       ├── CropForm.jsx      # Add/Edit crop
│   │       └── ViewCrop.jsx      # View crop details
│   ├── services/
│   │   └── api.js                # Axios instance with interceptors
│   ├── App.jsx                   # Main app with routing
│   ├── index.css                # Global styles
│   └── main.jsx                 # Entry point
├── .env                         # Environment variables
├── tailwind.config.js           # Tailwind configuration
├── vite.config.js               # Vite configuration
└── package.json                 # Dependencies
```

## API Integration

The admin panel connects to the backend API with the following endpoints:

### Authentication
- `POST /api/auth/login` - Admin login

### Admin Routes
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get single user
- `PATCH /api/admin/users/:id/status` - Update user status
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/fertilizers` - Get all fertilizers
- `POST /api/admin/fertilizers` - Create fertilizer
- `GET /api/admin/fertilizers/:id` - Get single fertilizer
- `PUT /api/admin/fertilizers/:id` - Update fertilizer
- `DELETE /api/admin/fertilizers/:id` - Delete fertilizer
- `GET /api/admin/crops` - Get all crops
- `POST /api/admin/crops` - Create crop
- `GET /api/admin/crops/:id` - Get single crop
- `PUT /api/admin/crops/:id` - Update crop
- `DELETE /api/admin/crops/:id` - Delete crop

## Security

- All admin routes are protected with JWT authentication
- Role-based access control (admin only)
- Automatic logout on token expiry
- Protected routes using ProtectedRoute component
- API interceptors handle 401/403 errors globally

## Deployment

The admin panel is designed to be deployed on a separate subdomain:

```
admin.domain.com    → Admin Frontend (this project)
app.domain.com      → User Frontend (main application)
api.domain.com      → Backend API
```

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist` directory.

### Environment Variables for Production

```
VITE_API_URL=https://api.domain.com/api
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Port Configuration

The admin panel runs on port 3001 by default (configurable in `vite.config.js`).

## Authentication Flow

1. User enters credentials on `/admin/login`
2. Credentials are sent to `/api/auth/login`
3. If successful and user has admin role, JWT token is stored
4. Token is included in all subsequent API requests
5. Protected routes check for valid admin token
6. On 401/403 errors, user is redirected to login

## License

MIT

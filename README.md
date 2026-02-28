# Sustainable Fertilizer Usage Optimizer

A comprehensive full-stack application that helps farmers optimize fertilizer usage based on soil health, crop type, and weather patterns to promote sustainable agriculture while maximizing crop yield and farmer income.

## Features

- **Soil Health Management**: Input and track soil test results (pH, NPK levels, organic matter)
- **Crop Selection**: Browse and select crops with detailed information about nutrient requirements
- **Smart Recommendations**: AI-powered fertilizer recommendations based on:
  - Soil health data
  - Crop nutrient requirements
  - Weather patterns and forecasts
  - Sustainability metrics
- **Sustainability Focus**: 
  - Nutrient use efficiency tracking
  - Carbon footprint reduction metrics
  - Water quality impact assessment
  - Overall sustainability scoring
- **Financial Analysis**: Cost-benefit analysis with profit estimates
- **Weather Integration**: Real-time weather data for optimal application timing

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Express Validator** for input validation

### User Frontend
- **React 18** with Vite
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API communication
- **React Hot Toast** for notifications
- **Lucide React** for icons

### Admin Panel
- **React 18** with Vite
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API communication
- **Context API** for state management
- **React Hot Toast** for notifications
- **Lucide React** for icons

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/gdcloudsat/sustainable-fertilizer-usage-optimizer-application.git
cd sustainable-fertilizer-usage-optimizer-application
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

4. Seed the database with initial data:
```bash
node utils/initDb.js
```

5. Start the backend server:
```bash
npm run dev
```

6. In a new terminal, install frontend dependencies:
```bash
cd frontend
npm install
```

7. Start the frontend development server:
```bash
npm run dev
```

8. Open your browser and navigate to `http://localhost:3000`

### Setting Up the Admin Panel

The admin panel is a separate application for managing the platform.

1. Install admin panel dependencies:
```bash
cd admin-frontend
npm install
```

2. Create an admin user:
```bash
npm run create-admin
```

3. Start the admin panel:
```bash
npm run dev:admin
```

4. Open your browser and navigate to `http://localhost:3001`

Default admin credentials:
- Email: `admin@example.com`
- Password: `admin123`

⚠️ **Important**: Change the admin password after first login!

For detailed admin panel setup and usage, see [ADMIN_SETUP.md](./ADMIN_SETUP.md).

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Soil Data
- `GET /api/soil` - Get all soil tests
- `POST /api/soil` - Create new soil test
- `GET /api/soil/:id` - Get single soil test
- `PUT /api/soil/:id` - Update soil test
- `DELETE /api/soil/:id` - Delete soil test

### Crops
- `GET /api/crops` - Get all crops
- `GET /api/crops/:id` - Get single crop
- `POST /api/crops` - Create new crop (admin)

### Fertilizers
- `GET /api/fertilizers` - Get all fertilizers
- `GET /api/fertilizers/sustainable/top` - Get sustainable fertilizers

### Recommendations
- `GET /api/recommendations` - Get all recommendations
- `POST /api/recommendations/generate` - Generate new recommendation
- `GET /api/recommendations/:id` - Get single recommendation
- `PUT /api/recommendations/:id/status` - Update recommendation status
- `DELETE /api/recommendations/:id` - Delete recommendation

### Weather
- `GET /api/weather/current` - Get current weather
- `GET /api/weather/forecast` - Get weather forecast

### Admin (Protected)
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

## Recommendation Algorithm

The recommendation engine calculates optimal fertilizer usage by:

1. **Analyzing Soil Data**: Comparing current nutrient levels against crop requirements
2. **Calculating Nutrient Gaps**: Determining deficiency levels for N, P, K
3. **Selecting Fertilizers**: Matching available fertilizers to nutrient gaps
4. **Optimizing Quantities**: Calculating precise amounts needed per acre
5. **Sustainability Scoring**: Evaluating environmental impact and efficiency
6. **Cost Analysis**: Computing total cost and expected ROI

### Sustainability Metrics
- **Nutrient Use Efficiency**: How effectively applied nutrients are utilized
- **Carbon Footprint Reduction**: Impact of organic vs synthetic fertilizers
- **Soil Health Score**: Long-term soil improvement potential
- **Water Quality Impact**: Risk of nutrient runoff

## Project Structure

```
sustainable-fertilizer-optimizer/
├── backend/
│   ├── middleware/
│   │   ├── auth.js
│   │   └── admin.js
│   ├── models/
│   │   ├── Crop.js
│   │   ├── Fertilizer.js
│   │   ├── Recommendation.js
│   │   ├── Soil.js
│   │   └── User.js
│   ├── routes/
│   │   ├── admin.js
│   │   ├── auth.js
│   │   ├── crops.js
│   │   ├── fertilizers.js
│   │   ├── recommendations.js
│   │   ├── soil.js
│   │   └── weather.js
│   ├── services/
│   │   └── recommendationEngine.js
│   ├── utils/
│   │   ├── createAdmin.js
│   │   ├── initDb.js
│   │   └── seedData.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── SoilHealthCard.jsx
│   │   │   └── SustainabilityScore.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── CropSelection.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── History.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Recommendations.jsx
│   │   │   ├── Register.jsx
│   │   │   └── SoilInput.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── admin-frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── layouts/
│   │   │   └── AdminLayout.jsx
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   └── Login.jsx
│   │   │   ├── dashboard/
│   │   │   │   └── Dashboard.jsx
│   │   │   ├── users/
│   │   │   │   ├── UserList.jsx
│   │   │   │   └── ViewUser.jsx
│   │   │   ├── fertilizers/
│   │   │   │   ├── FertilizerList.jsx
│   │   │   │   ├── FertilizerForm.jsx
│   │   │   │   └── ViewFertilizer.jsx
│   │   │   └── crops/
│   │   │       ├── CropList.jsx
│   │   │       ├── CropForm.jsx
│   │   │       └── ViewCrop.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── .gitignore
├── ADMIN_SETUP.md
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository.

## Acknowledgments

- Thanks to all contributors who help improve sustainable agriculture
- Inspired by the need for environmentally conscious farming practices
- Built with modern web technologies for optimal performance

# Digital E-Panchayat

A digital platform for panchayat services that brings governance closer to citizens through digital innovation.

## Project Structure

```
├── frontend/                # Next.js + Tailwind (UI Layer)
│   ├── public/              # Static files (logos, images, icons)
│   ├── src/
│   │   ├── app/             # (App Router) Pages & routing
│   │   │   ├── layout.tsx   # Root layout
│   │   │   ├── page.tsx     # Homepage
│   │   │   ├── services/    # Category pages (Governance, Welfare, etc.)
│   │   │   ├── dashboard/   # Citizen/official dashboards
│   │   ├── components/      # Reusable UI components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── ServiceCard.tsx
│   │   │   ├── HeroSection.tsx
│   │   ├── styles/          # Tailwind / global styles
│   │   │   └── globals.css
│   │   ├── lib/             # Frontend helpers (api clients, utils)
│   │   │   └── api.ts
│   ├── .env.local           # API URLs, frontend env vars
│   └── package.json
│
├── backend/                 # Node.js + Express + TypeScript (API Layer)
│   ├── src/
│   │   ├── config/          # MongoDB & server configs
│   │   │   └── db.ts
│   │   ├── models/          # Mongoose schemas
│   │   │   ├── User.ts
│   │   │   ├── ServiceRequest.ts
│   │   │   ├── Grievance.ts
│   │   │   ├── Scheme.ts
│   │   ├── routes/          # API routes
│   │   │   ├── auth.routes.ts
│   │   │   ├── grievance.routes.ts
│   │   │   ├── service.routes.ts
│   │   │   ├── scheme.routes.ts
│   │   ├── controllers/     # Request handlers
│   │   │   ├── auth.controller.ts
│   │   │   ├── grievance.controller.ts
│   │   │   ├── service.controller.ts
│   │   ├── middleware/      # Auth, error handlers
│   │   ├── utils/           # Helpers (jwt, email, logging)
│   │   ├── server.ts        # Express app entry point
│   │   └── app.ts           # App configuration
│   ├── .env                 # DB connection string, JWT secret
│   └── package.json
│
├── docs/                    # Documentation (API docs, system design)
├── README.md
└── package.json             # Root config (if monorepo with workspaces)
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd digital-e-panchayat
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   cd ..
   
   # Install backend dependencies
   cd backend
   npm install
   cd ..
   ```

### Running the Application

#### Development Mode

```bash
# Run both frontend and backend in development mode
npm run dev

# Run only frontend
npm run dev:frontend

# Run only backend
npm run dev:backend
```

#### Production Mode

```bash
# Build both frontend and backend
npm run build

# Start the application
npm start
```

### Environment Variables

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

#### Backend (.env)
```env
MONGO_URI=mongodb://localhost:27017/digital-e-panchayat
PORT=3000
JWT_SECRET=your_jwt_secret_here
```

## Technologies Used

### Frontend
- Next.js 13+ (App Router)
- TypeScript
- Tailwind CSS
- React

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB with Mongoose
- JSON Web Tokens (JWT) for authentication

### Dev Tools
- ESLint
- Prettier
- Concurrently (for running both frontend and backend simultaneously)

## Features

- User authentication (citizen and official roles)
- Service request submission and tracking
- Grievance redressal system
- Scheme application management
- Dashboard for citizens and officials
- RESTful API

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
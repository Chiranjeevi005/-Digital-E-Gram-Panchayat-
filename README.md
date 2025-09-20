# Digital E-Panchayat

A comprehensive digital platform for panchayat services that brings governance closer to citizens through innovative technology solutions. This web application provides a unified interface for citizens, staff, and officers to access and manage various panchayat services efficiently.

[![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green?style=flat&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-red?style=flat&logo=mongodb)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Table of Contents

- [Project Overview](#digital-e-panchayat)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Default Login Credentials](#default-login-credentials)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

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
├── PROJECT_REPORT.md        # Comprehensive project documentation
├── DEPLOYMENT.md            # Deployment instructions
├── DEPLOYMENT_READY.md      # Deployment readiness report
└── package.json             # Root config (if monorepo with workspaces)
```

## Getting Started

### Prerequisites

- Node.js (v18.x or higher)
- MongoDB (v5.x or higher)
- npm (v8.x or higher) or yarn (v1.x)
- Git (v2.x or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/digital-e-panchayat.git
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

# Run only frontend (port 3001)
npm run dev:frontend

# Run only backend (port 3002)
npm run dev:backend
```

#### Production Mode

```bash
# Build both frontend and backend
npm run build

# Start the application in production mode
npm start

# Start only frontend
npm run start:frontend

# Start only backend
npm run start:backend
```

### Default Login Credentials

For testing and development purposes, the system has predefined accounts with default passwords:

#### Officer Account
- Email: `officer@epanchayat.com`
- Default Password: `officer123`

#### Staff Accounts
- Email: `staff1@epanchayat.com` or `staff2@epanchayat.com`
- Default Password: `staff123`

**Note:** On first login with these default credentials, the system will automatically hash and store the password. Users are encouraged to change their passwords after first login for security.

#### Citizen Accounts
- Citizens can register for new accounts using the registration page
- No default credentials for citizens

#### Admin Account (Development Only)
- Email: `admin@epanchayat.com`
- Default Password: `admin123`

### Environment Variables

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3002/api
```

#### Backend (.env)
```env
PORT=3002
MONGO_URI=mongodb://localhost:27017/digital-e-panchayat
JWT_SECRET=your-super-secret-jwt-key-here
OFFICER_DEFAULT_PASSWORD=officer123
STAFF_DEFAULT_PASSWORD=staff123
```

## Deployment

For detailed deployment instructions to Render (backend) and Vercel (frontend), please refer to the [DEPLOYMENT.md](DEPLOYMENT.md) file.

### Deployment Status

- ✅ Frontend builds successfully
- ✅ Backend builds successfully
- ✅ All critical errors fixed
- ✅ Applications run without runtime errors
- ✅ Ready for production deployment

For a detailed deployment readiness report, see [DEPLOYMENT_READY.md](DEPLOYMENT_READY.md).

## Technologies Used

### Frontend
- Next.js 15.5.3 (App Router)
- TypeScript 5.9.2
- Tailwind CSS 4
- React 19.1.0
- Turbopack (Build Tool)

### Backend
- Node.js 18.x+
- Express.js 4.18.2
- TypeScript 5.9.2
- MongoDB with Mongoose 7.5.0
- JSON Web Tokens (JWT) for authentication

### Dev Tools
- ESLint 9
- Prettier
- Concurrently 8.2.2
- Jest 30.1.3 (Testing Framework)
- Supertest 7.1.4 (API Testing)
- ts-node-dev 2.0.0 (Development Server)

## Features

### Core Services
- **Certificate Services**: Birth, Death, Marriage, Income, Caste, and Residence certificates
- **Grievance Redressal**: Submit and track complaints across various categories
- **Schemes & Subsidies**: Apply for government schemes and track applications
- **Property & Land Services**: Pay property taxes and access land records

### User Management
- Role-based access control (Citizen, Staff, Officer)
- Secure authentication with JWT tokens
- User profile management

### Dashboards
- **Citizen Dashboard**: Personalized interface with quick access to services
- **Staff Dashboard**: Task tracking and citizen record management
- **Officer Dashboard**: Analytics and staff management

### Additional Features
- Real-time application tracking across all services
- Document generation and download (PDF/JPG)
- Responsive design for all device types
- Comprehensive search functionality
- RESTful API for integration

## Documentation

For a comprehensive overview of the project, please refer to our detailed [PROJECT_REPORT.md](PROJECT_REPORT.md).

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

### Development Guidelines
- Follow the existing code style and architecture
- Write unit tests for new functionality
- Update documentation when making changes
- Ensure all tests pass before submitting a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue on the GitHub repository or contact the development team.

## Project Status

✅ Production Ready - All critical issues resolved
✅ Deployment Ready - See [DEPLOYMENT_READY.md](DEPLOYMENT_READY.md) for details
✅ Comprehensive Testing - Unit and integration tests passing
✅ Documentation Complete - See [PROJECT_REPORT.md](PROJECT_REPORT.md) for full details
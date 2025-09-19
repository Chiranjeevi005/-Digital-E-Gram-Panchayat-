# Digital E-Panchayat Role-Specific Dashboards

This document provides an overview of the role-specific dashboard implementation for the Digital E-Panchayat Web App.

## Overview

The dashboard system provides customized interfaces for three user roles:
- **Citizen**: General users accessing panchayat services
- **Staff**: Administrative personnel with limited access
- **Officer**: High-level administrators with comprehensive oversight

## Authentication & Role Control

### User Roles
1. **Citizen** → Unlimited users
2. **Staff** → Limited to 2 accounts:
   - staff1@epanchayat.com
   - staff2@epanchayat.com
3. **Officer** → Limited to 1 account:
   - officer@epanchayat.com

### Default Credentials

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

### Authentication Flow
1. Users select their role during login
2. Credentials are validated against predefined accounts for Staff and Officer roles
3. JWT tokens are issued with user role information
4. Users are redirected to their role-specific dashboard upon successful authentication

## Dashboard Implementations

### 1. Citizen Dashboard (`/dashboard/citizen`)

**Features:**
- Personalized welcome message
- Quick access cards for core services:
  - Certificates
  - Grievances
  - Schemes
  - Property & Land Services
- Recent activity tracking
- Notifications panel for updates

**UI Components:**
- Responsive grid layout
- Service cards with icons
- Activity timeline
- Notification list

### 2. Staff Dashboard (`/dashboard/staff`)

**Features:**
- Task tracking system
- Citizen record management
- Certificate and grievance processing
- Report generation capabilities

**UI Components:**
- Metric cards (pending certificates, assigned grievances, etc.)
- Task tracker table with status and priority indicators
- Citizen records table
- Export buttons (PDF/JPG)

### 3. Officer Dashboard (`/dashboard/officer`)

**Features:**
- Comprehensive analytics and metrics
- Staff performance monitoring
- High-priority approval workflows
- Report generation with charts

**UI Components:**
- Overview metric cards
- Chart placeholders for data visualization
- Staff management table
- Approval queue list
- Report export options

## Technical Implementation

### Frontend Architecture

**Technologies Used:**
- Next.js 13+ with App Router
- TailwindCSS for styling
- TypeScript for type safety
- React Context API for state management

**Key Components:**
1. `AuthContext` - Manages authentication state across the application
2. `ProtectedRoute` - Higher-order component for role-based access control
3. `Sidebar` - Responsive navigation sidebar for all dashboards
4. `ProfileDropdown` - User profile and settings menu
5. `Navbar` - Updated to show role-specific navigation

**File Structure:**
```
frontend/
├── src/
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── components/
│   │   ├── ProtectedRoute.tsx
│   │   ├── Sidebar.tsx
│   │   ├── ProfileDropdown.tsx
│   │   └── Navbar.tsx
│   ├── app/
│   │   ├── dashboard/
│   │   │   ├── page.tsx (redirects to role-specific dashboards)
│   │   │   ├── citizen/
│   │   │   │   └── page.tsx
│   │   │   ├── staff/
│   │   │   │   └── page.tsx
│   │   │   └── officer/
│   │   │       └── page.tsx
│   │   └── login/
│   │       └── page.tsx (updated to redirect based on role)
│   └── utils/
│       └── responsive.ts
```

### Backend Integration

**Authentication Endpoints:**
- `POST /api/auth/login` - User authentication with role validation
- `GET /api/auth/user/me` - Current user information retrieval

**Role Validation:**
- Middleware functions for route protection
- User type verification in authentication flow
- Account limit enforcement for Staff (2) and Officer (1)

## Responsive Design

### Mobile View
- Collapsible sidebar menu (hamburger icon)
- Vertical stacking of dashboard cards
- Horizontal scrolling for tables
- Simplified navigation

### Tablet/Desktop View
- Expanded sidebar with icons and labels
- Grid layout for dashboard cards
- Full table displays
- Enhanced navigation options

## UI/UX Features

### Consistent Theme
- Light background with green/blue accent colors
- Professional typography
- Soft shadows and rounded corners
- Smooth animations for interactions

### Role-Based Customization
- Unique dashboard layouts per user role
- Role-specific navigation options
- Customized quick actions and widgets
- Appropriate data visibility based on permissions

### User Experience Enhancements
- Progress indicators for pending applications
- Color-coded status tags (Green=Completed, Yellow=In Progress, Red=Pending)
- Profile dropdown with quick access to settings
- Role-based quick actions in navbar
- Loading states for data fetching

## Security Considerations

1. **JWT-based Authentication**: Secure token management with expiration
2. **Role-based Access Control**: Server-side validation of user permissions
3. **Protected Routes**: Client-side route protection with automatic redirects
4. **Account Limiting**: Enforcement of Staff (2) and Officer (1) account limits

## Future Enhancements

1. **Data Visualization**: Integration of charting libraries (react-chartjs-2 or Recharts)
2. **Real-time Updates**: WebSocket integration for live notifications
3. **Advanced Filtering**: Enhanced search and filter capabilities for records
4. **Audit Trail**: Comprehensive logging of user actions
5. **Performance Optimization**: Code splitting and lazy loading improvements

## Testing

The dashboard implementations have been tested for:
- Authentication flow validation
- Role-based access control
- Responsive design across device sizes
- UI component functionality
- Error handling and edge cases

## Deployment

The dashboard system is ready for deployment with the existing Digital E-Panchayat infrastructure. Ensure the following environment variables are configured:
- `NEXT_PUBLIC_API_URL` - Backend API endpoint
- `JWT_SECRET` - Secret for token generation (backend)

## Maintenance

Regular maintenance tasks include:
- Monitoring authentication logs
- Updating user account information
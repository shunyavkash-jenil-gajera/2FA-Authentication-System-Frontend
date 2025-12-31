# 2FA Authentication System - Frontend

A modern React-based frontend for a Two-Factor Authentication (2FA) system with device management, secure authentication, and an intuitive user interface.

## 🎯 Features

✅ **User Authentication**

- Email/password registration and login
- Google OAuth 2.0 integration
- JWT token-based session management
- Secure password validation

✅ **Two-Factor Authentication (2FA)**

- OTP verification with authenticator apps
- QR code scanning for setup
- 15-day 2FA validity tracking
- Auto-logout on 2FA expiry

✅ **Device Management**

- View all logged-in devices with details
- Device trust status indicators
- 2FA expiry status badges
- Logout from individual devices
- Logout from all devices simultaneously

✅ **Security Features**

- Protected routes with authentication checks
- Device fingerprinting for trust detection
- LocalStorage token management
- Secure API interceptors
- CORS-protected requests

✅ **User Experience**

- Responsive design (mobile & desktop)
- Clean and intuitive UI
- Real-time loading states
- User-friendly error messages
- Navigation between auth and dashboard

✅ **State Management**

- React Context API for global auth state
- Local component state management
- Automatic auth persistence

## 📋 Prerequisites

- **Node.js**: v14 or higher
- **npm**: v6 or higher
- **Browser**: Chrome, Firefox, Safari, or Edge (latest versions)
- **Backend Server**: Running on http://localhost:4001

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd 2FA-Authentication-System-Frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Backend API Configuration
VITE_API_BASE_URL=http://localhost:4001/api/v1
```

Or create a `.env.local` file for local development:

```env
VITE_API_BASE_URL=http://localhost:4001/api/v1
```

## 📖 Running the Application

### Development Mode

```bash
npm run dev
```

Application will be available at `http://localhost:5173`

### Production Build

```bash
npm run build
```

Creates optimized build in `dist/` directory

### Preview Production Build

```bash
npm run preview
```

Preview the production build locally

## 📁 Project Structure

```
2FA-Authentication-System-Frontend/
├── src/
│   ├── main.jsx                # Application entry point
│   ├── App.jsx                 # Main app component with routing
│   ├── App.css
│   ├── index.css               # Global styles
│   ├── components/             # React components
│   │   ├── Login.jsx           # Login form
│   │   ├── Register.jsx        # Registration form
│   │   ├── Dashboard.jsx       # User dashboard with device list
│   │   ├── Setup2FA.jsx        # 2FA setup with QR code
│   │   ├── VerifyOTP.jsx       # OTP verification form
│   │   ├── AuthCallback.jsx    # Google OAuth callback handler
│   │   ├── ProtectedRoute.jsx  # Route protection wrapper
│   │   └── Loading.jsx         # Loading spinner component
│   ├── context/                # React Context for state management
│   │   └── AuthContext.jsx     # Authentication state and functions
│   ├── services/               # API and external services
│   │   ├── api.js              # Axios instance and API methods
│   │   └── fingerprint.service.js # Device fingerprinting service
│   ├── utils/                  # Utility functions
│   │   └── constants.util.js   # API route constants
│   └── assets/                 # Static assets
├── public/                     # Static files served as-is
├── .env                        # Environment variables (dev)
├── .gitignore
├── index.html                  # HTML entry point
├── package.json
├── vite.config.js              # Vite configuration
├── eslint.config.mjs           # ESLint configuration
└── README.md
```

## 🔌 API Integration

### Backend Base URL

The frontend communicates with the backend at:

```
http://localhost:4001/api/v1
```

### API Routes Used

**Authentication:**

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - Logout from current device
- `POST /auth/logout-all` - Logout from all devices
- `POST /auth/logout-device` - Logout from specific device
- `GET /auth/google` - Google OAuth login
- `GET /auth/google/callback` - OAuth callback handler

**2FA:**

- `POST /auth/enable-2fa` - Generate 2FA setup
- `POST /auth/verifyOtp` - Verify 2FA OTP

**Dashboard:**

- `GET /dashboard` - Get dashboard data
- `GET /dashboard/login-accounts` - Get list of devices

## 🔐 Authentication Flow

### Registration Flow

```
User fills registration form
  ↓
POST /auth/register (with deviceFingerprint)
  ↓
Token stored in localStorage
  ↓
User redirected to Setup2FA or Dashboard
```

### Login Flow

```
User enters email & password
  ↓
POST /auth/login (with deviceFingerprint)
  ↓
If skipTwoFA = true → Go to Dashboard
If skipTwoFA = false → Go to VerifyOTP
  ↓
Token stored in localStorage
```

### 2FA Setup Flow

```
User clicks "Enable 2FA"
  ↓
GET /auth/enable-2fa
  ↓
Display QR code (scan with Authenticator app)
  ↓
User enters OTP
  ↓
POST /auth/verifyOtp
  ↓
2FA enabled, go to Dashboard
```

### Device Logout Flow

```
User clicks "Logout from Device"
  ↓
Confirmation dialog appears
  ↓
User confirms
  ↓
POST /auth/logout-device {sessionId}
  ↓
Device removed from list
```

## 🎨 Components Overview

### Login Component (`Login.jsx`)

- Email and password input fields
- Error message display
- Google login button
- Link to registration page
- Handles device fingerprint

### Register Component (`Register.jsx`)

- Username, email, password fields
- Password strength validation
- Error handling
- Link to login page
- Auto-sets test credentials for development

### Setup2FA Component (`Setup2FA.jsx`)

- Displays QR code for Authenticator app
- Shows backup secret key
- Handles next step navigation

### VerifyOTP Component (`VerifyOTP.jsx`)

- OTP input field
- Real-time OTP verification
- Error messages
- Redirects on success

### Dashboard Component (`Dashboard.jsx`)

- User information display
- 2FA status
- Device list with cards
- Individual device logout buttons
- Logout all devices button
- Device details (OS, IP, login date)
- Trust and expiry badges

### ProtectedRoute Component (`ProtectedRoute.jsx`)

- Route protection wrapper
- Redirects to login if not authenticated
- Handles 2FA requirement checks
- Shows loading state

### AuthCallback Component (`AuthCallback.jsx`)

- Handles Google OAuth callback
- Extracts and stores token
- Redirects based on 2FA status

## 📦 Dependencies

### Core Dependencies

- **react**: ^18.2.0 - UI framework
- **react-dom**: ^18.2.0 - DOM rendering
- **react-router-dom**: ^7.11.0 - Client-side routing
- **axios**: ^1.7.x - HTTP client

### Security & Authentication

- **@fingerprintjs/fingerprintjs**: ^4.1.0 - Device fingerprinting
- **qrcode**: ^1.5.x - QR code generation

### Development Tools

- **vite**: ^5.4.x - Build tool
- **eslint**: ^9.x - Code linting

Install all dependencies:

```bash
npm install
```

## 🔑 Key Features Explained

### Device Fingerprinting

The app uses Fingerprint.js to create a unique device identifier:

```javascript
// In fingerprint.service.js
const { requestIdPromise, visitorId } = FingerprintJS.load();
const fingerprint = await visitorId();
```

This fingerprint is:

- Sent with login/register requests
- Used to identify trusted devices
- Persistent across sessions

### 2FA Expiry Management

The app tracks 2FA validity using localStorage:

```javascript
// Stored on successful OTP verification
localStorage.setItem("twoFaExpiry", expiryTimestamp);

// Checked on app load
const checkTwoFAExpiry = () => {
  const expiryDate = new Date(localStorage.getItem("twoFaExpiry"));
  if (expiryDate < new Date()) {
    // 2FA has expired
  }
};
```

### Protected Routes

Routes require authentication and 2FA validation:

```javascript
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

### State Management with Context

Global auth state using React Context:

```javascript
const { user, token, isAuthenticated, logout } = useAuth();
```

## 🧪 Testing the Application

### Test Credentials

Pre-filled credentials for quick testing:

```
Email: jenil@gmail.com
Password: Jenil@1234
```

### Test Scenarios

**Scenario 1: Registration & 2FA Setup**

1. Click "Create a new account"
2. Register with email and password
3. Setup 2FA with authenticator app
4. Scan QR code and verify OTP

**Scenario 2: Login & Device Management**

1. Login with credentials
2. Navigate to Dashboard
3. View all devices
4. Logout from individual device
5. Device should disappear from list

**Scenario 3: Google OAuth**

1. Click "Continue with Google"
2. Complete Google authentication
3. Setup 2FA if not already enabled
4. Redirect to Dashboard

## 🎨 Styling

### CSS Architecture

- Global styles in `index.css`
- Component-specific styles
- Responsive design with media queries
- CSS variables for theming

### Color Scheme

- **Primary**: #4f46e5 (Indigo)
- **Success**: #10b981 (Green)
- **Error**: #ef4444 (Red)
- **Warning**: #f97316 (Orange)

### Responsive Design

- Mobile-first approach
- Breakpoints: 640px, 1024px, 1280px
- Flexbox and Grid layouts

## 🔧 Development Tips

### Debugging

Check browser DevTools console for:

- API request/response logs
- Authentication state changes
- Local storage data
- Component render issues

### Local Storage Inspection

In browser console:

```javascript
// View stored data
localStorage.getItem("accessToken");
localStorage.getItem("user");
localStorage.getItem("twoFaExpiry");

// Clear all data
localStorage.clear();
```

### API Request Debugging

Check Network tab in DevTools:

- Verify API endpoints are correct
- Check request headers (Authorization)
- Review response data structure
- Check for CORS issues

### Component State

Add console logs in components:

```javascript
useEffect(() => {
  console.log("Auth state:", { user, token, isAuthenticated });
}, [user, token, isAuthenticated]);
```

## 🚨 Common Issues & Solutions

### "Cannot GET /api/v1/auth/login"

- Backend server not running
- VITE_API_BASE_URL incorrect in .env
- Check backend is on localhost:4001

### CORS Errors

- Verify backend CORS configuration
- Check FRONTEND_URL in backend .env
- Ensure API requests include credentials if needed

### 2FA OTP Expires Too Quick

- Check device time is synchronized
- OTP window is ±30 seconds
- Try regenerating QR code

### Device Fingerprint Not Working

- Check browser supports WebGL/Canvas
- Try clearing browser cache
- Fingerprint.js may need network access

### localStorage is undefined

- App requires localStorage support
- Private/Incognito mode might restrict it
- Check browser privacy settings

### Token Expired After 3 Days

- By design, tokens expire after 3 days
- User must login again
- 2FA expires after 15 days from verification

## 📝 .env Configuration

| Variable          | Description          | Example                      |
| ----------------- | -------------------- | ---------------------------- |
| VITE_API_BASE_URL | Backend API base URL | http://localhost:4001/api/v1 |

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Hosting Services

**Vercel:**

```bash
npm install -g vercel
vercel
```

**Netlify:**

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**GitHub Pages:**

```bash
npm run build
# Push dist folder to gh-pages branch
```

### Environment Variables for Production

Update `.env` or set environment variables on hosting platform:

```
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
```

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [Vite Documentation](https://vitejs.dev/)
- [Axios Documentation](https://axios-http.com/)
- [Fingerprint.js Documentation](https://fingerprint.com/js/)
- [JWT.io](https://jwt.io/)

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add AmazingFeature'`)
3. Push to branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 👤 Author

**Jenil Gajera**

## 📞 Support

For issues or questions:

1. Check the Network tab in browser DevTools
2. Review console for error messages
3. Verify backend is running and accessible
4. Check .env configuration
5. Clear localStorage and try again

---

**Last Updated**: December 31, 2025
**Version**: 1.0.0
**Status**: Production Ready ✅

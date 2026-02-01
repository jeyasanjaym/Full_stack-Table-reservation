# ReserveTable Backend Setup Guide

This guide will help you set up the MongoDB backend for your ReserveTable application.

## Prerequisites

1. **Node.js** (version 14 or higher)
2. **MongoDB** (Atlas cloud or local installation)
3. **npm** or **yarn**

## Setup Instructions

### 1. Install Backend Dependencies

Navigate to the server directory and install dependencies:

```bash
cd my-app/server
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `my-app/server/` directory:

```bash
# Copy the example file
cp config.env.example .env
```

Edit the `.env` file with your actual values:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/reservetable?retryWrites=true&w=majority

# JWT Secret (generate a strong secret for production)
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### 3. MongoDB Setup Options

#### Option A: MongoDB Atlas (Recommended for production)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Replace `<username>`, `<password>`, and `<cluster>` in your connection string

#### Option B: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/reservetable`

### 4. Start the Backend Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

### 5. Test the Connection

Visit `http://localhost:5000/api/health` in your browser. You should see:
```json
{
  "message": "Server is running!",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /register` - Register new user
- `POST /login` - Login user
- `POST /google` - Google authentication
- `GET /me` - Get current user
- `POST /logout` - Logout user

### User Routes (`/api/users`)

- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `PUT /change-password` - Change password
- `DELETE /account` - Delete account

## Frontend Configuration

Update your React app's environment variables:

1. Copy `env.example` to `.env` in the `my-app/` directory
2. Update the API URL if needed:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Security Notes

1. **JWT Secret**: Use a strong, random secret key in production
2. **Environment Variables**: Never commit `.env` files to version control
3. **CORS**: Configure CORS properly for production
4. **HTTPS**: Use HTTPS in production

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check your connection string
   - Ensure MongoDB service is running
   - Verify network access in Atlas

2. **Port Already in Use**
   - Change the PORT in your `.env` file
   - Or kill the process using port 5000

3. **CORS Errors**
   - Check FRONTEND_URL in your `.env` file
   - Ensure it matches your React app URL

### Getting Help

If you encounter issues:
1. Check the server console for error messages
2. Verify your environment variables
3. Test MongoDB connection separately
4. Check network connectivity

## Production Deployment

For production deployment:
1. Use a strong JWT secret
2. Set NODE_ENV=production
3. Use a production MongoDB cluster
4. Configure proper CORS settings
5. Use HTTPS
6. Set up proper logging and monitoring

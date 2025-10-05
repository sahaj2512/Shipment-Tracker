# Shipment Tracker - Setup Instructions

## Prerequisites

Before running this project, make sure you have the following installed on your local machine:

1. **Node.js** (version 14 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **MongoDB** (version 4.4 or higher)
   - Download from: https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud): https://www.mongodb.com/atlas

3. **Git** (for cloning the repository)
   - Download from: https://git-scm.com/

## Project Structure

```
shipment-tracker/
├── backend/          # Node.js/Express API server
├── frontend/         # React.js frontend application
└── README.md
```

## Setup Steps

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd shipment-tracker
```

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - The `.env` file is already configured with default values
   - For production, update the following variables in `backend/.env`:
     ```
     NODE_ENV=production
     PORT=5000
     MONGODB_URI=your-mongodb-connection-string
     JWT_SECRET=your-super-secret-jwt-key-change-in-production
     JWT_EXPIRES_IN=30d
     ```

4. Start MongoDB:
   - **Local MongoDB**: Start the MongoDB service
     ```bash
     # On Windows
     net start MongoDB
     
     # On macOS/Linux
     sudo systemctl start mongod
     ```
   - **MongoDB Atlas**: No local setup needed, just use your connection string

5. Start the backend server:
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

   The backend server will run on `http://localhost:5000`

### 3. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm start
   ```

   The frontend will run on `http://localhost:3000`

## Running the Application

1. **Start Backend**: In the backend directory, run `npm run dev`
2. **Start Frontend**: In the frontend directory, run `npm start`
3. **Open Browser**: Navigate to `http://localhost:3000`

## Features

- **User Authentication**: Register and login with username/email and password
- **Shipment Management**: Create, read, update, and delete shipments
- **Real-time Tracking**: Track shipment status and location
- **Advanced Filtering**: Filter shipments by various criteria
- **Responsive Design**: Works on desktop and mobile devices

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/health` - Health check

### Shipments
- `GET /api/shipments` - Get all shipments
- `POST /api/shipments` - Create new shipment
- `GET /api/shipments/:id` - Get specific shipment
- `PUT /api/shipments/:id` - Update shipment
- `DELETE /api/shipments/:id` - Delete shipment

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   - Ensure MongoDB is running locally or check your Atlas connection string
   - Verify the MONGODB_URI in your `.env` file

2. **Port Already in Use**:
   - Backend: Change PORT in `.env` file
   - Frontend: React will prompt to use a different port

3. **CORS Issues**:
   - The backend is configured to allow CORS from the frontend
   - If you encounter CORS errors, check the axios base URL configuration

4. **Authentication Issues**:
   - Clear browser localStorage and try again
   - Check browser console for error messages

5. **Dependencies Issues**:
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again

### Development Tips

1. **Backend Logs**: Check the terminal where you ran `npm run dev` for server logs
2. **Frontend Logs**: Check browser developer tools console for client-side errors
3. **Database**: Use MongoDB Compass or Atlas dashboard to view your data
4. **API Testing**: Use Postman or curl to test API endpoints directly

## Production Deployment

### Backend Deployment
1. Set `NODE_ENV=production` in your environment
2. Use a production MongoDB instance (Atlas recommended)
3. Set a strong JWT_SECRET
4. Deploy to platforms like Heroku, Railway, or AWS

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy the `build` folder to platforms like Netlify, Vercel, or AWS S3
3. Update the `REACT_APP_API_URL` environment variable to point to your production backend

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Check the console logs for error messages
4. Ensure both backend and frontend servers are running
5. Verify MongoDB connection

## Recent Fixes Applied

- ✅ Added proper npm scripts to backend
- ✅ Added missing bcryptjs dependency
- ✅ Configured axios base URL for API calls
- ✅ Fixed login UI register button navigation
- ✅ Added email support to authentication
- ✅ Created comprehensive setup instructions
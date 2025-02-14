# URL Shortener

A modern URL shortening service built with React, Node.js, and MongoDB. This application allows users to create shortened URLs, track their usage analytics, and organize links by topics.

## Features

- 🔐 Google OAuth Authentication
- 🔗 URL Shortening with optional custom aliases
- 📊 Detailed analytics for each shortened URL
- 🏷️ Topic-based organization
- 📱 Responsive design
- 📈 Click tracking and user statistics
- 🌐 Cross-platform compatibility

## Tech Stack

### Frontend

- React
- React Router DOM
- TailwindCSS
- Vite
- Recharts (for analytics visualization)

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- Passport.js (Google OAuth)
- Express Session

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Google OAuth credentials

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/url-shortener.git
cd url-shortener
```

2. Install dependencies for both frontend and backend:

```bash
cd frontend
npm install
cd ../backend
npm install
```

3. Set up environment variables:

Create `.env` file in the backend directory:

```env
MONGODB_URI=your_mongodb_uri
SESSION_SECRET=your_session_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
PORT=5001
```

Create `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5001
```

## Running the Application

1. Start the backend server:

```bash
cd backend
npm start
```

2. Start the frontend server:

```bash
cd frontend
npm run dev
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend: http://localhost:5001

## API Endpoints

### Authentication

- `GET /auth/google` - Google OAuth login
- `GET /auth/google/callback` - Google OAuth callback
- `POST /auth/logout` - Logout
- `GET /auth/check` - Check authentication status

### URL Operations

- `POST /api/url/shorten` - Create short URL
- `GET /api/url/user/urls` - Get user's URLs
- `GET /api/url/:shortCode/analytics` - Get URL analytics
- `GET /api/analytics/topic/:topic` - Get topic analytics
- `GET /api/analytics/overall` - Get overall analytics

## Features in Detail

### URL Shortening

- Create shortened URLs with optional custom aliases
- Organize URLs by topics
- View list of all shortened URLs

### Analytics

- Track total clicks
- Monitor unique visitors
- View geographical data
- Track device and browser information
- Analyze click patterns over time

### User Dashboard

- View all shortened URLs
- Access detailed analytics
- Organize URLs by topics
- Copy shortened URLs with one click

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google OAuth for authentication
- MongoDB Atlas for database hosting
- TailwindCSS for styling
- Recharts for analytics visualization

# EduConnect

A comprehensive e-learning platform with user profiles, courses, achievements, and community features.

## Features

- User authentication (register, login, logout)
- Profile management with profile picture upload
- Course enrollment and progress tracking
- Achievements and badges
- Student leaderboard
- Responsive UI

## Tech Stack

- **Frontend**: React, Chakra UI
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Image Storage**: Cloudinary

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (optional)

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/educonnect.git
cd educonnect
```

2. Install dependencies:
```
npm install
cd frontend-starter
npm install
cd ../backend
npm install
```

3. Configure environment variables:
   - Create a `.env` file in the `backend` directory:
```
JWT_SECRET=your_jwt_secret
MONGO_URI=your_mongodb_uri
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### Running the application

#### Start backend server:
```
cd backend
node server.js
```

#### Start frontend development server:
```
cd frontend-starter
npm start
```

#### Or use concurrently to run both:
```
npm run dev
```

## Usage

1. Register a new account
2. Login with your credentials
3. Update your profile information and upload a profile picture
4. Explore courses, achievements, and leaderboard
5. Track your progress in the platform

## Screenshots

[Include screenshots here]

## License

[MIT License](LICENSE) 
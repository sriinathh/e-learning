# Campus Connect E-Learning Platform

A comprehensive e-learning platform built with React, Node.js, and MongoDB that provides a seamless learning experience with modern UI and extensive features.

## 📱 Implemented Pages & Features

### 🏠 Landing Page
- Modern, responsive design with gradient backgrounds
- Animated transitions and components
- Quick access to login/register
- Featured courses showcase
- Platform benefits and features overview

### 🔐 Authentication System
#### Register Page
- Multi-step registration form
- Real-time form validation
- Password strength indicator
- Profile picture upload option
- Social registration options:
  - Google Sign-up
  - College ID registration
- Terms and conditions acceptance

#### Login Page
- Clean, modern login interface
- Email/Password authentication
- Remember me functionality
- Forgot password option
- Social login options:
  - Google login
  - College domain login
- Toast notifications for feedback
- Secure JWT token handling

### 🏡 Home Dashboard
- Personalized welcome message
- Course progress overview
- Recent activity feed
- Quick access to:
  - Enrolled courses
  - Upcoming events
  - Placement opportunities
  - Community updates
- Achievement highlights
- Learning statistics

### 📚 Courses Section
#### Course Catalog
- Grid view of available courses
- Course filtering and search
- Course categories
- Difficulty levels
- Progress tracking

#### Simple Course View
- Streamlined course interface
- Basic course content
- Progress tracking
- Quick assessments
- Certificate generation

#### Udemy-Style Course View
- Rich multimedia content
- Interactive lessons
- Progress checkpoints
- Detailed course materials
- Student discussions

### 📖 Resources
- Downloadable study materials
- Reference documents
- Practice exercises
- Additional reading materials
- Resource categories and search

### 💼 Placement Hub
- Job opportunities listing
- Placement drive announcements
- Company profiles
- Application tracking
- Interview preparation resources
- Resume builder tools

### 📅 Events
- Upcoming events calendar
- Event registration
- Virtual event hosting
- Event categories:
  - Workshops
  - Webinars
  - Hackathons
  - Career fairs
- Event reminders

### 👥 Community
- Discussion forums
- Student groups
- Knowledge sharing
- Peer support
- Activity feed
- User mentions and tags

### 🤖 Chatbot
- AI-powered assistance
- Quick query resolution
- Course recommendations
- Technical support
- FAQ handling
- Interactive responses

### 👤 Profile Management
- Profile customization
- Profile picture upload/update
- Academic details
- Course enrollment history
- Achievement showcase
- Progress tracking
- Personal statistics
- Account settings

## 🛠️ Technical Stack

### Frontend
- React.js
- Chakra UI for modern components
- Framer Motion for animations
- React Router for navigation
- Axios for API calls
- React Toastify for notifications
- React Icons

### Backend
- Node.js
- Express.js
- MongoDB for database
- JWT for authentication
- Bcrypt for password hashing
- Cloudinary for image storage

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation Steps

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd e-learning
\`\`\`

2. Install backend dependencies:
\`\`\`bash
cd backend
npm install
\`\`\`

3. Install frontend dependencies:
\`\`\`bash
cd frontend-starter
npm install
\`\`\`


4. Set up environment variables:
Create a .env file in the backend directory with:
\`\`\`env

MONGO_URI=mongodb+srv://nithiinsrinu:slnzIp1K1T9k11fq@edu.cvqcfqv.mongodb.net/?retryWrites=true&w=majority&appName=edu
MISTRAL_API_KEY=OgNQhTRpLj7VbteEV3gsCq2cWuPk1YZt
JWT_SECRET=***************************************************
PORT=5969
JWT_SECRET=educonnect_secure_jwt_secret
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=sree-infinty
CLOUDINARY_API_KEY=	811285816124998
CLOUDINARY_API_SECRET=H64phpsWPtBfRCfWy0L3bcWEUZ4


\`\`\`

5. Start the backend server:
\`\`\`bash
cd backend
node server.js (or) nodemon server.js
\`\`\`

6. Start the frontend:
\`\`\`bash
cd frontend-starter
npm run dev

build :
npm run build

test : 
 npm run test
\`\`\`

The application will be running at `http://localhost:5969`

## 🎨 UI Features
- Responsive design for all devices
- Dark/Light theme support
- Modern gradient backgrounds
- Smooth animations and transitions
- Toast notifications
- Loading states
- Error handling
- Form validations
- Modal dialogs
- Interactive components

## 🔒 Security Features
- JWT authentication
- Password encryption
- Protected routes
- Form validation
- Secure file upload
- Session management
- Error handling
- API security

## 📱 Mobile Responsiveness
- Adaptive layouts
- Touch-friendly interfaces
- Responsive images
- Flexible grids
- Mobile-first approach
- Cross-browser compatibility

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support
For support, please email support@campusconnect.com 
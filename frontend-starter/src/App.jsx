import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import Navbar from "./components/shared/Navbar";
import LandingPage from "./pages/LandingPage";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import ProfilePage from './pages/ProfilePage';
import CoursePage from './components/courses/CoursePage';
import PlacementHub from './placement/PlacementHub';
import JobOpportunities from "./placement/JobOpportunities";
import ChatbotPage from './pages/ChatbotPage'; 
import CampusConnectPage from "./pages/CampusConnectPage";
import CommunityPage from "./pages/CommunityPage";
import DirectMessaging from './pages/DirectMessaging';
import SimpleCourse from './components/SimpleCourse';

import PrivateRoute from "./components/PrivateRoute"; // Ensure it's implemented correctly
import Resources from './components/courses/Resources';
import CertificatePage from './components/courses/CertificatePage'; 
import GenerateCertificate from './components/courses/GenerateCertificate'; 
import DownloadCertificate from './components/courses/DownloadCertificate';
import SidebarNav from "./components/courses/SidebarNav";
import PlacementDrive from './placement/PlacementDrive';
import { useThemeStore } from './store/themeStore';
import './styles/layout.css'; // Import layout styles
import './styles/fullpage.css'; // Import full-page styles
import CourseContent from './components/courses/CourseContent';
import QuizPage from './components/courses/QuizPage';
import MaterialsPage from './components/materials/MaterialsPage';
import EventsPage from './components/events/EventsPage';
import UdemyStyleCoursePage from './components/courses/UdemyStyleCoursePage';
import LectureNotes from "./pages/LectureNotes";
import YoutubeToPDF from './components/YoutubeToPDF'; 

// Create a custom theme for Chakra UI
const colors = {
  brand: {
    50: "#e3f2fd",
    100: "#bbdefb",
    200: "#90caf9",
    300: "#64b5f6",
    400: "#42a5f5",
    500: "#2196f3",
    600: "#1e88e5",
    700: "#1976d2",
    800: "#1565c0",
    900: "#0d47a1",
  },
};

const theme = extendTheme({
  colors,
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
});

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme: appTheme } = useThemeStore();

  // Routes that shouldn't show the navbar
  const fullPageRoutes = ["/", "/login", "/register"];
  const isFullPageRoute = fullPageRoutes.includes(location.pathname);
  const showNavbar = !isFullPageRoute;
  
  // Modified to exclude udemy-style course page and simple course page from showing sidebar
  const showSidebar = location.pathname.startsWith("/courses") && 
                    !location.pathname.includes("/udemy-course") && 
                    !location.pathname.includes("/simple-course");

  // For development, you can set this to true to disable auth redirects
  const bypassAuth = true;
  const isLoggedIn = bypassAuth || localStorage.getItem("user");

  // Apply theme to HTML document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', appTheme);
  }, [appTheme]);

  // Only redirect for login if not bypassing auth
  useEffect(() => {
    if (!bypassAuth && !isLoggedIn && !["/", "/login", "/register"].includes(location.pathname)) {
      navigate("/login");
    }
  }, [isLoggedIn, location.pathname, navigate, bypassAuth]);

  const [certificates, setCertificates] = useState(() => {
    const savedCertificates = localStorage.getItem("certificates");
    return savedCertificates ? JSON.parse(savedCertificates) : [];
  });

  useEffect(() => {
    localStorage.setItem("certificates", JSON.stringify(certificates));
  }, [certificates]);

  const handleCertificateGeneration = (certificate) => {
    setCertificates((prevCertificates) => [...prevCertificates, certificate]);
  };

  return (
    <ChakraProvider theme={theme}>
      <div className={`app-container theme-${appTheme}`}>
        {showNavbar && <Navbar />}
        
        {showSidebar ? (
          <div className="sidebar">
            <SidebarNav certificates={certificates} />
          </div>
        ) : null}

        <div className={isFullPageRoute ? "fullscreen-content" : "main-content"}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            {/* Private Routes */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            <Route path="/courses" element={<PrivateRoute><CoursePage /></PrivateRoute>} />
            <Route path="/courses/:courseId" element={<PrivateRoute><CourseContent /></PrivateRoute>} />
            
            {/* New Udemy-style Course Routes */}
            <Route path="/udemy-course/:courseId" element={<PrivateRoute><UdemyStyleCoursePage /></PrivateRoute>} />

            <Route path="/placement" element={<PrivateRoute><PlacementHub /></PrivateRoute>} />
            <Route path="/placement/jobOpportunities" element={<PrivateRoute><JobOpportunities /></PrivateRoute>} />
            <Route path="/chatbot" element={<PrivateRoute><ChatbotPage /></PrivateRoute>} />
            
            <Route path="/placement/drive" element={<PrivateRoute><PlacementDrive /></PrivateRoute>} />
            <Route path="/campusconnect" element={<PrivateRoute><CampusConnectPage /></PrivateRoute>} />
            <Route path="/community" element={<PrivateRoute><CommunityPage /></PrivateRoute>} />
            
            {/* Smart Materials and Events Routes */}
            <Route path="/materials" element={<PrivateRoute><MaterialsPage /></PrivateRoute>} />
            <Route path="/events" element={<PrivateRoute><EventsPage /></PrivateRoute>} />

            {/* Resources and Certificate Routes */}
            <Route path="/courses/resources" element={<Resources />} />
            <Route path="/courses/certificate" element={<CertificatePage certificates={certificates} />} />
            <Route path="/courses/generateCertificate" element={<GenerateCertificate onGenerate={handleCertificateGeneration} />} />
            <Route path="/courses/newCertificate" element={<GenerateCertificate onGenerate={handleCertificateGeneration} courseData={{name: "Advanced Course", instructor: "Dr. Johnson"}} />} />
            <Route path="/courses/downloadCertificate" element={<DownloadCertificate />} />
            
            {/* New Quiz Route */}
            <Route path="/quiz/:id" element={<PrivateRoute><QuizPage /></PrivateRoute>} />

            {/* Simple Course Route */}
            <Route path="/simple-course" element={<PrivateRoute><SimpleCourse /></PrivateRoute>} />
            <Route path="/messages" element={<DirectMessaging />} />
            <Route path="/video-lecture" element={<LectureNotes />} />
            <Route path="/notes" element={<YoutubeToPDF />} />
          </Routes>
        </div>
      </div>
    </ChakraProvider>
  );
};

export default App;
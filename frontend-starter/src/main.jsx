import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { SocketProvider } from "./context/SocketContext";
import { UserProvider } from "./context/UserContext";
import "./styles/themes.css"; // Import themes CSS
import { setupMockUser } from "./utils/mockUser"; // Import mock user setup

// Initialize a mock user for development
setupMockUser();

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ChakraProvider>
      <BrowserRouter>
        <UserProvider>
          <SocketProvider>
            <App />
          </SocketProvider>
        </UserProvider>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);

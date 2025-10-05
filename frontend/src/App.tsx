import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import StatusJobs from "./pages/StatusJobs.tsx";
import Calendar from "./pages/Calendar.tsx";
import Application from "./pages/Application.tsx";
import UserProvider from "./context/userContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Profile from "./pages/Profile.tsx";

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Root />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/applications" element={<Application />} />
            <Route path="/statusjobs" element={<StatusJobs />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/calendar" element={<Calendar />} />
          </Routes>
        </Router>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
const Root = () => {
  const isAuthenticate = !!localStorage.getItem("token");

  return isAuthenticate ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login " />
  );
};

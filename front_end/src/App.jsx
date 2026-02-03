import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";

import Landing from "./pages/Landing";
import login from "./pages/login";
import Register from "./pages/Register";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Bookings from "./pages/Bookings";
import Profile from "./pages/Profile";
import Navbar from "./pages/Navbar";
import CreateEvent from "./pages/CreateEvent";
import AdminUsers from "./pages/AdminUsers";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import AdminRevenue from "./pages/AdminRevenue";


import ProtectedRoute from "./ProtectedRoute";

/* ---------------- ROUTES WRAPPER ---------------- */

function AnimatedRoutes({ setIsLoggedIn }) {
  const location = useLocation();
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* PUBLIC */}
        <Route path="/" element={<Landing />} />
        <Route
          path="/login"
          element={<login setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route path="/register" element={<Register />} />

        {/* USER */}
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          }
        />

        <Route
          path="/events/:id"
          element={
            <ProtectedRoute>
              <EventDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              {!isAdmin ? <Bookings /> : <Navigate to="/events" />}
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              {!isAdmin ? <Profile /> : <Navigate to="/events" />}
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              {isAdmin ? <AdminDashboard /> : <Navigate to="/events" />}
            </ProtectedRoute>
          }
        />
        <Route
  path="/admin/revenue"
  element={
    <ProtectedRoute>
      <AdminRevenue />
    </ProtectedRoute>
  }
/>


        <Route
          path="/create-event"
          element={
            <ProtectedRoute>
              {isAdmin ? <CreateEvent /> : <Navigate to="/events" />}
            </ProtectedRoute>
          }
        />
        <Route
  path="dashboard"
  element={
    <ProtectedRoute>
      <UserDashboard />
    </ProtectedRoute>
  }
/>


<Route path="/payment-success" element={<PaymentSuccess />} />
<Route path="/payment-cancel" element={<PaymentCancel />} />



        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              {isAdmin ? <AdminUsers /> : <Navigate to="/events" />}
            </ProtectedRoute>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

/* ---------------- APP ---------------- */

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  return (
    <BrowserRouter>
      {isLoggedIn && <Navbar />}
      <AnimatedRoutes setIsLoggedIn={setIsLoggedIn} />
    </BrowserRouter>
  );
}

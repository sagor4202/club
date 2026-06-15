import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import LocationGirls from "./pages/LocationGirls";
import LegalNotice from "./pages/LegalNotice";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Register from "./pages/Register";
import RegistrationForm from "./pages/RegistrationForm";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import WorkWithUs from "./pages/WorkWithUs";
import GirlProfile from "./pages/GirlProfile";
import NormalRegistration from "./pages/NormalRegistration";
import UserDashboard from "./pages/UserDashboard";
import GirlDashboard from "./pages/GirlDashboard";
import GetAppointment from "./pages/GetAppointment";
import SiteLoader from "./components/SiteLoader";
import { AutoTranslator } from "./components/AutoTranslator";
import AgeVerification from "./components/AgeVerification";

export default function App() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const delay = location.pathname === "/" ? 900 : 520;
    const timer = window.setTimeout(() => setIsLoading(false), delay);
    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      <AgeVerification />
      <SiteLoader isVisible={isLoading} />
      <AutoTranslator />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/girls/:club" element={<LocationGirls />} />
        <Route path="/legal-notice" element={<LegalNotice />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/register" element={<Register />} />
        <Route path="/registration-form" element={<RegistrationForm />} />
        <Route path="/normal-registration" element={<NormalRegistration />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/girl-dashboard" element={<GirlDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/work-with-us" element={<WorkWithUs />} />
        <Route path="/work-with-us/:location" element={<WorkWithUs />} />
        <Route path="/profile/:name" element={<GirlProfile />} />
        <Route path="/appointment/:name" element={<GetAppointment />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

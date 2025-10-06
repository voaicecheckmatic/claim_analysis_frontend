import { Routes, Route } from "react-router-dom"
import LandingPage from "./components/landing_page"
import Login from "./components/login"
import HospitalTariffDashboard from "./components/dashboard"
import TariffPdfUploadCard from "./components/test_page"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<HospitalTariffDashboard />} />
      <Route path="/test_page" element={<TariffPdfUploadCard />} />
    </Routes>
  )
}

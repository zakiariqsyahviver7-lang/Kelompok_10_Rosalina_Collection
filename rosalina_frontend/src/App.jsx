import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Kain from "./pages/master/Kain";

// Placeholder sementara untuk halaman yang belum dibuat
const Soon = ({ title }) => <h2>{title} (segera dibuat)</h2>;
const Admin = ({ children }) => (
  <ProtectedRoute roles={["Admin"]}>{children}</ProtectedRoute>
);

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/laporan" element={<Soon title="Laporan Produksi" />} />
        <Route path="/produksi/work-order" element={<Soon title="Work Order" />} />

        <Route path="/master/model" element={<Admin><Soon title="Model Produk" /></Admin>} />
        <Route path="/master/kain" element={<Admin><Kain /></Admin>} />
        <Route path="/master/bahan" element={<Admin><Soon title="Bahan Pendukung" /></Admin>} />
        <Route path="/master/tim" element={<Admin><Soon title="Tim Produksi" /></Admin>} />
        <Route path="/master/pembelian" element={<Admin><Soon title="Pembelian Bahan" /></Admin>} />
        <Route path="/produksi/potong" element={<Admin><Soon title="Hasil Potong" /></Admin>} />
        <Route path="/produksi/jahit" element={<Admin><Soon title="Hasil Jahit" /></Admin>} />
        <Route path="/produksi/qc" element={<Admin><Soon title="Hasil QC & Pengemasan" /></Admin>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
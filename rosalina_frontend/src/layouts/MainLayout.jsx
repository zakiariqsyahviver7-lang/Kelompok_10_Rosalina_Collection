import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const MENU = [
  { to: "/", label: "Dashboard", roles: ["Owner", "Admin"] },
  { to: "/produksi/work-order", label: "Work Order", roles: ["Owner", "Admin"] },
  { to: "/master/model", label: "Model Produk", roles: ["Admin"] },
  { to: "/master/kain", label: "Kain", roles: ["Admin"] },
  { to: "/master/bahan", label: "Bahan Pendukung", roles: ["Admin"] },
  { to: "/master/tim", label: "Tim Produksi", roles: ["Admin"] },
  { to: "/master/pembelian", label: "Pembelian Bahan", roles: ["Admin"] },
  { to: "/produksi/potong", label: "Hasil Potong", roles: ["Admin"] },
  { to: "/produksi/jahit", label: "Hasil Jahit", roles: ["Admin"] },
  { to: "/produksi/qc", label: "Hasil QC & Pengemasan", roles: ["Admin"] },
  { to: "/laporan", label: "Laporan Produksi", roles: ["Owner", "Admin"] },
];

export default function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-user">
          <div className="avatar">{user.nama.charAt(0)}</div>
          <strong>{user.nama}</strong>
          <small>{user.role}</small>
        </div>
        <nav>
          {MENU.filter((m) => m.roles.includes(user.role)).map((m) => (
            <NavLink key={m.to} to={m.to} end={m.to === "/"}>
              {m.label}
            </NavLink>
          ))}
        </nav>
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
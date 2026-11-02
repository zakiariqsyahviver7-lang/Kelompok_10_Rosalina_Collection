import { createContext, useContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

const MOCK_USERS = [
  { username: "owner", password: "owner123", role: "Owner", nama: "Owner Rosalina", aktif: true },
  { username: "admin", password: "admin123", role: "Admin", nama: "Admin Gudang", aktif: true },
  { username: "nonaktif", password: "123456", role: "Admin", nama: "Akun Nonaktif", aktif: false },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const saveSession = (token, data) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
  };

  const login = async (username, password) => {
    if (USE_MOCK) {
          const found = MOCK_USERS.find(
        (u) =>
          u.username === username.trim().toLowerCase() &&
          u.password === password.trim()
      );
      if (!found)
        throw new Error("Login gagal, periksa kembali username dan password Anda");
      if (!found.aktif) throw new Error("Akun Anda belum diaktifkan");
      saveSession("mock-token", { nama: found.nama, role: found.role });
      return;
    }

    // Mode API asli: sesuaikan dengan format response backend
    const res = await api.post("/login", { username, password });
    saveSession(res.data.token, {
      nama: res.data.user.nama,
      role: res.data.user.role,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
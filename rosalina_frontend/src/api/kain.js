import api from "./axios";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const delay = (v) => new Promise((r) => setTimeout(() => r(v), 300));

let mockData = [
  { idKain: 1, namaKain: "Katun Combed 30s", jenis: "Katun", warna: "Putih", supplier: "CV Tekstil Jaya", stok: 120 },
  { idKain: 2, namaKain: "Rayon Twill", jenis: "Rayon", warna: "Hitam", supplier: "UD Sandang Makmur", stok: 85 },
  { idKain: 3, namaKain: "Drill Japan", jenis: "Drill", warna: "Navy", supplier: "CV Tekstil Jaya", stok: 0 },
];

export const getKain = async () =>
  USE_MOCK ? delay([...mockData]) : (await api.get("/kain")).data;

export const createKain = async (data) => {
  if (USE_MOCK) {
    const item = { ...data, idKain: Date.now() };
    mockData.push(item);
    return delay(item);
  }
  return (await api.post("/kain", data)).data;
};

export const updateKain = async (id, data) => {
  if (USE_MOCK) {
    mockData = mockData.map((k) => (k.idKain === id ? { ...k, ...data } : k));
    return delay(true);
  }
  return (await api.put(`/kain/${id}`, data)).data;
};

export const deleteKain = async (id) => {
  if (USE_MOCK) {
    mockData = mockData.filter((k) => k.idKain !== id);
    return delay(true);
  }
  return (await api.delete(`/kain/${id}`)).data;
};
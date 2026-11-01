import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Modal from "../../components/Modal";
import { getKain, createKain, updateKain, deleteKain } from "../../api/kain";

const EMPTY = { namaKain: "", jenis: "", warna: "", supplier: "", stok: "" };

export default function Kain() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    getKain()
      .then(setData)
      .catch(() => toast.error("Gagal memuat data kain"))
      .finally(() => setLoading(false));
  }, []);

  const refresh = async () => setData(await getKain());

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY);
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({ ...item });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.namaKain.trim() || !form.jenis.trim()) {
      toast.error("Nama kain dan jenis bahan wajib diisi");
      return;
    }
    if (form.stok === "" || Number(form.stok) < 0) {
      toast.error("Stok harus berupa angka 0 atau lebih");
      return;
    }
    const payload = { ...form, stok: Number(form.stok) };
    try {
      if (editing) {
        await updateKain(editing.idKain, payload);
        toast.success("Data kain diperbarui");
      } else {
        await createKain(payload);
        toast.success("Data kain ditambahkan");
      }
      setShowForm(false);
      await refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menyimpan data");
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Hapus kain "${item.namaKain}"?`)) return;
    try {
      await deleteKain(item.idKain);
      toast.success("Data kain dihapus");
      await refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menghapus data");
    }
  };

  const filtered = data.filter((k) =>
    k.namaKain.toLowerCase().includes(search.toLowerCase())
  );

  const field = (key, label, type = "text") => (
    <label>
      {label}
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
      />
    </label>
  );

  return (
    <div>
      <div className="page-header">
        <h2>Data Kain</h2>
        <button className="btn btn-primary" onClick={openAdd}>+ Tambah Kain</button>
      </div>

      <input
        className="search"
        placeholder="Cari nama kain..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p>Memuat data...</p>
      ) : filtered.length === 0 ? (
        <p>Data kain belum tersedia.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>No</th><th>Nama Kain</th><th>Jenis</th><th>Warna</th>
              <th>Supplier</th><th>Stok (m)</th><th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((k, i) => (
              <tr key={k.idKain}>
                <td>{i + 1}</td>
                <td>{k.namaKain}</td>
                <td>{k.jenis}</td>
                <td>{k.warna}</td>
                <td>{k.supplier}</td>
                <td>{k.stok}</td>
                <td>
                  <button className="btn btn-edit" onClick={() => openEdit(k)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(k)}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showForm && (
        <Modal title={editing ? "Edit Kain" : "Tambah Kain"} onClose={() => setShowForm(false)}>
          <form className="form" onSubmit={handleSubmit}>
            {field("namaKain", "Nama Kain")}
            {field("jenis", "Jenis Bahan")}
            {field("warna", "Warna")}
            {field("supplier", "Supplier")}
            {field("stok", "Stok (meter)", "number")}
            <div className="form-actions">
              <button type="button" className="btn" onClick={() => setShowForm(false)}>Batal</button>
              <button type="submit" className="btn btn-primary">Simpan</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
export default function Dashboard() {
  const stats = [
    { label: "Total Work Order", value: 28, color: "#dbeafe" },
    { label: "Produksi Berjalan", value: 12, color: "#fef9c3" },
    { label: "Selesai", value: 14, color: "#dcfce7" },
    { label: "Produksi Gagal QC", value: 2, color: "#fee2e2" },
  ];

  return (
    <div>
      <h2>Dashboard Monitoring Produksi</h2>
      <div className="stat-grid">
        {stats.map((s) => (
          <div key={s.label} className="stat-card" style={{ background: s.color }}>
            <span>{s.label}</span>
            <strong>{s.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
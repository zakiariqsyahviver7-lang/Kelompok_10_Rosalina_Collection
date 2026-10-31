-- Jalankan di database rosalina_collection
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  nama VARCHAR(100) NOT NULL,
  role VARCHAR(10) NOT NULL CHECK (role IN ('owner','admin')),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS model_produksi (
  id SERIAL PRIMARY KEY,
  nama_model VARCHAR(100) NOT NULL,
  deskripsi TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kain (
  id SERIAL PRIMARY KEY,
  nama_kain VARCHAR(100) NOT NULL,
  jenis VARCHAR(50),
  warna VARCHAR(50),
  harga_per_meter NUMERIC(14,2) DEFAULT 0,
  stok_meter NUMERIC(12,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tim_produksi (
  id SERIAL PRIMARY KEY,
  nama_tim VARCHAR(100),
  nama_karyawan VARCHAR(100) NOT NULL,
  bagian VARCHAR(20) CHECK (bagian IN ('potong','jahit','qc')),
  jumlah_anggota INT DEFAULT 1 CHECK (jumlah_anggota >= 0),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bahan_tambahan (
  id SERIAL PRIMARY KEY,
  nama_bahan VARCHAR(100) NOT NULL,
  satuan VARCHAR(20),
  harga NUMERIC(14,2) DEFAULT 0,
  stok NUMERIC(12,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE SEQUENCE IF NOT EXISTS wo_seq START 1;

CREATE TABLE IF NOT EXISTS work_orders (
  id SERIAL PRIMARY KEY,
  kode_wo VARCHAR(30) UNIQUE NOT NULL DEFAULT ('WO-' || lpad(nextval('wo_seq')::text, 4, '0')),
  model_id INT NOT NULL REFERENCES model_produksi(id),
  kain_id INT REFERENCES kain(id),
  tim_id INT REFERENCES tim_produksi(id),
  jumlah_target INT NOT NULL CHECK (jumlah_target > 0),
  deadline DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'dibuat'
    CHECK (status IN ('dibuat','dipotong','dijahit','qc','selesai')),
  catatan TEXT,
  created_by INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hasil_potong (
  id SERIAL PRIMARY KEY,
  wo_id INT NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
  jumlah_hasil INT NOT NULL CHECK (jumlah_hasil >= 0),
  tanggal DATE DEFAULT CURRENT_DATE,
  catatan TEXT
);

CREATE TABLE IF NOT EXISTS hasil_jahit (
  id SERIAL PRIMARY KEY,
  wo_id INT NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
  jumlah_hasil INT NOT NULL CHECK (jumlah_hasil >= 0),
  tanggal DATE DEFAULT CURRENT_DATE,
  catatan TEXT
);

CREATE TABLE IF NOT EXISTS hasil_qc (
  id SERIAL PRIMARY KEY,
  wo_id INT NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
  jumlah_lolos INT NOT NULL DEFAULT 0 CHECK (jumlah_lolos >= 0),
  jumlah_reject INT NOT NULL DEFAULT 0 CHECK (jumlah_reject >= 0),
  tanggal DATE DEFAULT CURRENT_DATE,
  catatan TEXT
);

CREATE TABLE IF NOT EXISTS pembelian_bahan (
  id SERIAL PRIMARY KEY,
  nama_bahan VARCHAR(100) NOT NULL,
  supplier VARCHAR(100),
  jumlah NUMERIC(12,2) NOT NULL CHECK (jumlah > 0),
  harga_satuan NUMERIC(14,2) NOT NULL CHECK (harga_satuan >= 0),
  total_harga NUMERIC(16,2) GENERATED ALWAYS AS (jumlah * harga_satuan) STORED,
  tanggal DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

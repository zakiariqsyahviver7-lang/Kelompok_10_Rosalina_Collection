const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Login(): validasi input -> ambil_data_user() -> sukses/gagal
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username dan password wajib diisi' });
    }
    const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Username atau password salah' });
    }
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );
    res.json({
      success: true,
      message: 'Login berhasil',
      token,
      user: { id: user.id, username: user.username, nama: user.nama, role: user.role },
    });
  } catch (err) { next(err); }
};

exports.me = async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT id, username, nama, role FROM users WHERE id = $1', [req.user.id]);
    res.json({ success: true, data: rows[0] });
  } catch (err) { next(err); }
};

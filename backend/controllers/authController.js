const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, BankSampah } = require('../models');

const register = async (req, res) => {
  try {
    const { name, email, password, phone, address, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nama, email, dan password wajib diisi.' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email sudah terdaftar. Silakan gunakan email lain.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const validRole = ['admin', 'pengelola', 'masyarakat'].includes(role) ? role : 'masyarakat';

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone: phone || '',
      address: address || '',
      role: validRole
    });

    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      process.env.JWT_SECRET || 'super_secret_jwt_key_bank_sampah_palu_2026',
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'Registrasi berhasil!',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        address: newUser.address,
        role: newUser.role
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal melakukan registrasi.', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password wajib diisi.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Email atau password salah.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email atau password salah.' });
    }

    // If pengelola, load their bank_sampah_id
    let bank_sampah = null;
    if (user.role === 'pengelola') {
      bank_sampah = await BankSampah.findOne({ where: { user_id: user.id } });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'super_secret_jwt_key_bank_sampah_palu_2026',
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      message: 'Login berhasil!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        bank_sampah_id: bank_sampah ? bank_sampah.id : null
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal melakukan login.', error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: BankSampah,
          as: 'bank_sampah_managed'
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal memuat profil.', error: error.message });
  }
};

module.exports = {
  register,
  login,
  getProfile
};

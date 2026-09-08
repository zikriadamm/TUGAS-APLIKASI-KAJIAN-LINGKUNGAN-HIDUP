const express = require('express');
const router = express.Router();
const {
  getAllTransaksi,
  getTransaksiById,
  createTransaksi,
  updateStatusTransaksi,
  deleteTransaksi
} = require('../controllers/transaksiController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getAllTransaksi);
router.get('/:id', verifyToken, getTransaksiById);
router.post('/', verifyToken, createTransaksi);
router.put('/:id', verifyToken, authorizeRoles('admin', 'pengelola'), updateStatusTransaksi);
router.delete('/:id', verifyToken, authorizeRoles('admin'), deleteTransaksi);

module.exports = router;

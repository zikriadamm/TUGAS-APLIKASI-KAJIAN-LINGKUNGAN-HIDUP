const express = require('express');
const router = express.Router();
const {
  getAllKategori,
  createKategori,
  updateKategori,
  deleteKategori
} = require('../controllers/kategoriSampahController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', getAllKategori);
router.post('/', verifyToken, authorizeRoles('admin'), createKategori);
router.put('/:id', verifyToken, authorizeRoles('admin'), updateKategori);
router.delete('/:id', verifyToken, authorizeRoles('admin'), deleteKategori);

module.exports = router;

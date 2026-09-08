const express = require('express');
const router = express.Router();
const {
  getAllJenisSampah,
  getJenisSampahById,
  createJenisSampah,
  updateJenisSampah,
  deleteJenisSampah
} = require('../controllers/jenisSampahController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', getAllJenisSampah);
router.get('/:id', getJenisSampahById);
router.post('/', verifyToken, authorizeRoles('admin', 'pengelola'), createJenisSampah);
router.put('/:id', verifyToken, authorizeRoles('admin', 'pengelola'), updateJenisSampah);
router.delete('/:id', verifyToken, authorizeRoles('admin'), deleteJenisSampah);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getAllEdukasi,
  getEdukasiById,
  createEdukasi,
  updateEdukasi,
  deleteEdukasi
} = require('../controllers/edukasiController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', getAllEdukasi);
router.get('/:id', getEdukasiById);
router.post('/', verifyToken, authorizeRoles('admin'), createEdukasi);
router.put('/:id', verifyToken, authorizeRoles('admin'), updateEdukasi);
router.delete('/:id', verifyToken, authorizeRoles('admin'), deleteEdukasi);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getAllBankSampah,
  getBankSampahById,
  createBankSampah,
  updateBankSampah,
  deleteBankSampah
} = require('../controllers/bankSampahController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', getAllBankSampah);
router.get('/:id', getBankSampahById);
router.post('/', verifyToken, authorizeRoles('admin', 'pengelola'), createBankSampah);
router.put('/:id', verifyToken, authorizeRoles('admin', 'pengelola'), updateBankSampah);
router.delete('/:id', verifyToken, authorizeRoles('admin'), deleteBankSampah);

module.exports = router;

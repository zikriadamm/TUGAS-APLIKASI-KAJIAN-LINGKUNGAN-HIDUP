const express = require('express');
const router = express.Router();
const {
  getAdminDashboard,
  getPengelolaDashboard,
  getMasyarakatDashboard
} = require('../controllers/dashboardController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/admin', verifyToken, authorizeRoles('admin'), getAdminDashboard);
router.get('/pengelola', verifyToken, authorizeRoles('admin', 'pengelola'), getPengelolaDashboard);
router.get('/masyarakat', verifyToken, getMasyarakatDashboard);

module.exports = router;

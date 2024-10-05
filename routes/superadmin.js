const express = require('express');
const { verifyToken, requireSuperadmin } = require('../middleware/auth');
const router = express.Router();

router.get('/superadmin-dashboard', verifyToken, requireSuperadmin, (req, res) => {
  res.json({ message: 'Welcome to the superadmin dashboard!' });
});

module.exports = router;

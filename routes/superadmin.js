const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');

// Apply authentication middleware to all routes in this router
router.use(authenticate);

// Example Superadmin Route
router.get('/', (req, res) => {
  res.json({ message: 'Welcome Super Admin!' });
});

// Add more superadmin routes here

module.exports = router;

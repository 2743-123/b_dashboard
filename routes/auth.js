const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');  // Sequelize User model
const router = express.Router();

// Example superadmin email
const SUPERADMIN_EMAIL = 'superadmin@example.com';

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    
    const user = await User.findAll({where: { email }});
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const role = email === SUPERADMIN_EMAIL ? 'superadmin' : user.role;
    const token = jwt.sign({ id: user.id, role }, 'your_jwt_secret', { expiresIn: '1h' });

    res.json({ token, role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

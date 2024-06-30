const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { title: 'Online Grocery Store' });
});

router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
  });

router.get('/signup', (req, res) => {
    res.render('signup', { title: 'Signup' });
  });

module.exports = router;


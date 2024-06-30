const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const dbOptions = {
  host: 'localhost',
  user: 'root',
  password: 'Benzema10002',
  database: 'shopify'
};

const connection = mysql.createConnection(dbOptions);

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL for Users');
});

// User registration route
router.post('/signup', (req, res) => {
  const { firstName,lastName,email,mobileNo, password } = req.body;
  const query = 'INSERT INTO user (firstName,lastName,emailid,mobileNo, password) VALUES (?,?,?,?,?)';
  connection.query(query, [firstName,lastName,email,mobileNo, password], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error registering user');
    }
    res.redirect('/login');
  });
});

// User login route
router.post('/login', (req, res) => {
  const { mobileNo, password } = req.body;
  const query = 'SELECT * FROM user WHERE mobileNo = ? AND password = ?';
  
  connection.query(query, [mobileNo, password], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error logging in');
    }
    if (results.length > 0) {
      console.log(results[0]);
      req.session.userId = results[0].UserID;
      res.redirect('/products');
    } else {
      res.status(401).send('Invalid credentials');
    }
  });
});

// User logout route
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Error logging out');
    }
    res.redirect('/');
  });
});

module.exports = router;


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
  console.log('Connected to MySQL for Orders');
});

// Get order status for user
router.get('/status', (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.redirect('/login');
  }
  const query = 'SELECT * FROM orders WHERE user_id = ?';
  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error fetching order status');
    }
    res.render('order_status', { orders: results });
  });
});

// Place an order
router.post('/place', (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.status(401).send('You must be logged in to place an order');
  }
  const query = 'INSERT INTO orders (user_id, product_id, quantity) SELECT user_id, product_id, quantity FROM cart WHERE user_id = ?';
  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error placing order');
    }
    // Clear the cart after placing the order
    const deleteQuery = 'DELETE FROM cart WHERE user_id = ?';
    connection.query(deleteQuery, [userId], (err, deleteResults) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error clearing cart');
      }
      res.redirect('/orders/status');
    });
  });
});

module.exports = router;


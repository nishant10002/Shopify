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
  console.log('Connected to MySQL for Products');
});

// Get all products
router.get('/', (req, res) => {
  const query = 'SELECT * FROM product';
  connection.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error fetching products');
    }
    res.render('products', { products: results });
  });
});

module.exports = router;

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
  console.log('Connected to MySQL for Cart');
});

// Get cart items for user
router.get('/', (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.redirect('/login');
  }

  const query = `
    SELECT p.*, c.QuantityToOrder, (p.price * c.QuantityToOrder) AS Subtotal 
    FROM product_cart_orders c 
    JOIN product p ON c.ProductID = p.ProductID 
    WHERE c.OrderID IN (SELECT OrderID FROM orders WHERE UserID = ? AND Status = 'pending')`;

  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error fetching cart items');
    }
    res.render('cart', { cartItems: results });
  });
});

// Add item to cart
router.post('/add', (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.session.userId;
  if (!userId) {
    return res.status(401).send('You must be logged in to add items to cart');
  }

  const getOrderQuery = 'SELECT OrderID FROM orders WHERE UserID = ? AND Status = ?';
  connection.query(getOrderQuery, [userId, 'pending'], (err, orderResults) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error fetching order');
    }

    let orderId;

    if (orderResults.length > 0) {
      orderId = orderResults[0].OrderID;
      addToCart(orderId);
    } else {
      const createOrderQuery = 'INSERT INTO orders (UserID, OrderDate, Status, TotalAmount) VALUES (?, NOW(), ?, ?)';
      connection.query(createOrderQuery, [userId, 'pending', 0], (err, orderResults) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error creating order');
        }

        orderId = orderResults.insertId;
        addToCart(orderId);
      });
    }

    function addToCart(orderId) {
      const addToCartQuery = 'INSERT INTO product_cart_orders (ProductID, OrderID, QuantityToOrder) VALUES (?, ?, ?)';
      connection.query(addToCartQuery, [productId, orderId, quantity], (err, cartResults) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error adding item to cart');
        }
        res.redirect('/cart');
      });
    }
  });
});

module.exports = router;





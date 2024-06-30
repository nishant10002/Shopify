const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Benzema10002',
    database: 'shopify'
});

// Middleware to check if user is logged in
function checkAuth(req, res, next) {
    if (!req.session.userId) {
        res.redirect('/users/login');
    } else {
        next();
    }
}

// Select payment method
router.post('/select', checkAuth, (req, res) => {
    const { orderId, paymentMethod } = req.body;
    const userId = req.session.userId;

    pool.query('SELECT TotalAmount FROM orders WHERE OrderID = ? AND UserID = ?', [orderId, userId], (error, results) => {
        if (error) throw error;

        if (results.length > 0) {
            const totalAmount = results[0].TotalAmount;

            pool.query('INSERT INTO payment (Amount, PaymentMode, OrderID) VALUES (?, ?, ?)', 
            [totalAmount, paymentMethod, orderId], 
            (error, results) => {
                if (error) throw error;
                res.redirect('/payment/history');
            });
        } else {
            res.send('Order not found or access denied');
        }
    });
});

// View payment history
router.get('/history', checkAuth, (req, res) => {
    const userId = req.session.userId;

    pool.query(`
        SELECT p.Amount, p.PaymentMode, o.OrderID, o.OrderDate 
        FROM payment p
        JOIN orders o ON p.OrderID = o.OrderID
        WHERE o.UserID = ?
    `, [userId], (error, results) => {
        if (error) throw error;
        res.render('payment_history', { payments: results });
    });
});

module.exports = router;

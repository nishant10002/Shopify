const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Benzema10002',
    database: 'shopify'
});

// Middleware to check if admin is logged in
function checkAdminAuth(req, res, next) {
    if (!req.session.admin) {
        res.redirect('/admin/login');
    } else {
        next();
    }
}

// Admin login
router.get('/login', (req, res) => {
    res.render('admin_login');
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'admin@123') {
        req.session.admin = true;
        res.redirect('/admin');
    } else {
        res.send('Invalid credentials');
    }
});

// Admin home
router.get('/', checkAdminAuth, (req, res) => {
    res.render('admin');
});

// Add new product
router.post('/add_product', checkAdminAuth, (req, res) => {
    const { name, brand, description, image, price, quantityInStock, category, subCategory } = req.body;

    pool.query('INSERT INTO product (Name, Brand, Description, Image, Price, QuantityInStock, Category, SubCategory) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
    [name, brand, description, image, price, quantityInStock, category, subCategory], 
    (error, results) => {
        if (error) throw error;
        res.redirect('/admin');
    });
});

// Update product
router.post('/update_product', checkAdminAuth, (req, res) => {
    const { productId, name, brand, description, image, price, quantityInStock, category, subCategory } = req.body;

    pool.query('UPDATE product SET Name = ?, Brand = ?, Description = ?, Image = ?, Price = ?, QuantityInStock = ?, Category = ?, SubCategory = ? WHERE ProductID = ?', 
    [name, brand, description, image, price, quantityInStock, category, subCategory, productId], 
    (error, results) => {
        if (error) throw error;
        res.redirect('/admin');
    });
});

module.exports = router;

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dbMyapp'
});

// Rutas API
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ?';
    
    connection.query(query, [username], async (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error del servidor' });
            return;
        }
        
        if (results.length > 0) {
            const match = await bcrypt.compare(password, results[0].password);
            if (match) {
                res.json({ success: true });
            } else {
                res.status(401).json({ error: 'Credenciales inválidas' });
            }
        } else {
            res.status(401).json({ error: 'Usuario no encontrado' });
        }
    });
});

// Obtener productos
app.get('/api/products', (req, res) => {
    const query = 'SELECT * FROM products WHERE state = "A"';
    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error al obtener productos' });
            return;
        }
        res.json(results);
    });
});

// Crear producto
app.post('/api/products', (req, res) => {
    const { name, category, price, stock } = req.body;
    const query = 'INSERT INTO products (name, category, price, stock, state) VALUES (?, ?, ?, ?, "A")';
    
    connection.query(query, [name, category, price, stock], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error al crear producto' });
            return;
        }
        res.json({ id: result.insertId });
    });
});

// Actualizar producto
app.put('/api/products/:id', (req, res) => {
    const { name, category, price, stock } = req.body;
    const query = 'UPDATE products SET name = ?, category = ?, price = ?, stock = ? WHERE id = ?';
    
    connection.query(query, [name, category, price, stock, req.params.id], (err) => {
        if (err) {
            res.status(500).json({ error: 'Error al actualizar producto' });
            return;
        }
        res.json({ success: true });
    });
});

// Eliminar producto (lógico)
app.delete('/api/products/:id', (req, res) => {
    const query = 'UPDATE products SET state = "I" WHERE id = ?';
    
    connection.query(query, [req.params.id], (err) => {
        if (err) {
            res.status(500).json({ error: 'Error al eliminar producto' });
            return;
        }
        res.json({ success: true });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
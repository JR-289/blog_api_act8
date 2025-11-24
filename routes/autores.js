const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET - Obtener todos los autores
router.get('/', async (req, res) => {
    try {
        const [autores] = await pool.query('SELECT * FROM autores');
        res.json({ success: true, data: autores });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET - Obtener un autor por ID
router.get('/:id', async (req, res) => {
    try {
        const [autor] = await pool.query('SELECT * FROM autores WHERE id = ?', [req.params.id]);
        if (autor.length === 0) {
            return res.status(404).json({ success: false, message: 'Autor no encontrado' });
        }
        res.json({ success: true, data: autor[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST - Crear un nuevo autor
router.post('/', async (req, res) => {
    const { nombre, email, imagen } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO autores (nombre, email, imagen) VALUES (?, ?, ?)',
            [nombre, email, imagen]
        );
        res.status(201).json({ 
            success: true, 
            message: 'Autor creado exitosamente',
            id: result.insertId 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// PUT - Actualizar un autor
router.put('/:id', async (req, res) => {
    const { nombre, email, imagen } = req.body;
    try {
        const [result] = await pool.query(
            'UPDATE autores SET nombre = ?, email = ?, imagen = ? WHERE id = ?',
            [nombre, email, imagen, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Autor no encontrado' });
        }
        res.json({ success: true, message: 'Autor actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// DELETE - Eliminar un autor
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM autores WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Autor no encontrado' });
        }
        res.json({ success: true, message: 'Autor eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;

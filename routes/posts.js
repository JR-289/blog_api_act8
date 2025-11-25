const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET - Obtener todos los posts con datos del autor
router.get('/', async (req, res) => {
    try {
        const [posts] = await pool.query(`
            SELECT 
                p.id, 
                p.titulo, 
                p.descripcion, 
                p.fecha_creacion, 
                p.categoria,
                p.autor_id,
                a.nombre AS autor_nombre,
                a.email AS autor_email,
                a.imagen AS autor_imagen
            FROM posts p
            INNER JOIN autores a ON p.autor_id = a.id
            ORDER BY p.fecha_creacion DESC
        `);
        
        const postsConAutor = posts.map(post => ({
            id: post.id,
            titulo: post.titulo,
            descripcion: post.descripcion,
            fecha_creacion: post.fecha_creacion,
            categoria: post.categoria,
            autor: {
                id: post.autor_id,
                nombre: post.autor_nombre,
                email: post.autor_email,
                imagen: post.autor_imagen
            }
        }));
        
        res.json({ success: true, data: postsConAutor });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
// GET - Obtener un post por ID con datos del autor
router.get('/:id', async (req, res) => {
    try {
        const [posts] = await pool.query(`
            SELECT 
                p.id, 
                p.titulo, 
                p.descripcion, 
                p.fecha_creacion, 
                p.categoria,
                p.autor_id,
                a.nombre AS autor_nombre,
                a.email AS autor_email,
                a.imagen AS autor_imagen
            FROM posts p
            INNER JOIN autores a ON p.autor_id = a.id
            WHERE p.id = ?
        `, [req.params.id]);
        
        if (posts.length === 0) {
            return res.status(404).json({ success: false, message: 'Post no encontrado' });
        }
        
        const post = {
            id: posts[0].id,
            titulo: posts[0].titulo,
            descripcion: posts[0].descripcion,
            fecha_creacion: posts[0].fecha_creacion,
            categoria: posts[0].categoria,
            autor: {
                id: posts[0].autor_id,
                nombre: posts[0].autor_nombre,
                email: posts[0].autor_email,
                imagen: posts[0].autor_imagen
            }
        };
        
        res.json({ success: true, data: post });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET - Obtener posts por autor
router.get('/autor/:autorId', async (req, res) => {
    try {
        const [posts] = await pool.query(`
            SELECT 
                p.id, 
                p.titulo, 
                p.descripcion, 
                p.fecha_creacion, 
                p.categoria,
                p.autor_id,
                a.nombre AS autor_nombre,
                a.email AS autor_email,
                a.imagen AS autor_imagen
            FROM posts p
            INNER JOIN autores a ON p.autor_id = a.id
            WHERE p.autor_id = ?
            ORDER BY p.fecha_creacion DESC
        `, [req.params.autorId]);
        
        const postsConAutor = posts.map(post => ({
            id: post.id,
            titulo: post.titulo,
            descripcion: post.descripcion,
            fecha_creacion: post.fecha_creacion,
            categoria: post.categoria,
            autor: {
                id: post.autor_id,
                nombre: post.autor_nombre,
                email: post.autor_email,
                imagen: post.autor_imagen
            }
        }));
        
        res.json({ success: true, data: postsConAutor });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST - Crear un nuevo post
router.post('/', async (req, res) => {
    const { titulo, descripcion, categoria, autor_id } = req.body;
    try {
        // Verificar que el autor existe
        const [autor] = await pool.query('SELECT id FROM autores WHERE id = ?', [autor_id]);
        if (autor.length === 0) {
            return res.status(404).json({ success: false, message: 'Autor no encontrado' });
        }
        
        const [result] = await pool.query(
            'INSERT INTO posts (titulo, descripcion, categoria, autor_id) VALUES (?, ?, ?, ?)',
            [titulo, descripcion, categoria, autor_id]
        );
        
        res.status(201).json({ 
            success: true, 
            message: 'Post creado exitosamente',
            id: result.insertId 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// PUT - Actualizar un post
router.put('/:id', async (req, res) => {
    const { titulo, descripcion, categoria, autor_id } = req.body;
    try {
        if (autor_id) {
            const [autor] = await pool.query('SELECT id FROM autores WHERE id = ?', [autor_id]);
            if (autor.length === 0) {
                return res.status(404).json({ success: false, message: 'Autor no encontrado' });
            }
        }
        
        const [result] = await pool.query(
            'UPDATE posts SET titulo = ?, descripcion = ?, categoria = ?, autor_id = ? WHERE id = ?',
            [titulo, descripcion, categoria, autor_id, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Post no encontrado' });
        }
        
        res.json({ success: true, message: 'Post actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// DELETE - Eliminar un post
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM posts WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Post no encontrado' });
        }
        res.json({ success: true, message: 'Post eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;


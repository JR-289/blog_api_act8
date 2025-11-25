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


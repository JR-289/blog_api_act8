const express = require('express');
require('dotenv').config();
const autoresRoutes = require('./routes/autores');
const postsRoutes = require('./routes/posts');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/autores', autoresRoutes);
app.use('/api/posts', postsRoutes);

// Ruta principal
app.get('/', (req, res) => {
    res.json({ 
        message: 'API Blog - Endpoints disponibles',
        endpoints: {
            autores: {
                'GET /api/autores': 'Obtener todos los autores',
                'GET /api/autores/:id': 'Obtener un autor por ID',
                'POST /api/autores': 'Crear un nuevo autor',
                'PUT /api/autores/:id': 'Actualizar un autor',
                'DELETE /api/autores/:id': 'Eliminar un autor'
            },
            posts: {
                'GET /api/posts': 'Obtener todos los posts con autor',
                'GET /api/posts/:id': 'Obtener un post por ID con autor',
                'GET /api/posts/autor/:autorId': 'Obtener posts de un autor específico',
                'POST /api/posts': 'Crear un nuevo post',
                'PUT /api/posts/:id': 'Actualizar un post',
                'DELETE /api/posts/:id': 'Eliminar un post'
            }
        }
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

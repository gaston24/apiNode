'use strict'

// cargar modulos de node para crear el servidor
var express = require('express');
var bodyParser = require('body-parser');

// ejecutar expres
var app = express();

// cargar ficheros de rutas
var articleRoutes = require('./routes/article');

// cargar middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// activar CORS (permite peticiones desde frontend)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});



// añadir prefijos de rutas / cargar rutas
app.use('/api', articleRoutes);
// app.use(articleRoutes);

// exportar modulo (fichero actual)
module.exports = app;
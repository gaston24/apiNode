'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3900;

// metodos nuevos
mongoose.set('useFindAndModify', false);
// arreglar promesas
mongoose.Promise = global.Promise;

// conexion a la bbdd
mongoose.connect('mongodb://localhost:27017/api_rest_blog', {useNewUrlParser: true})
    .then(()=>{
        console.log('la conexion a la bbdd se ha realizado correctamente!');
        // crear servidor y escuchar peticiones http
        app.listen(port, () =>{
            console.log('servidor corriendo en http://localhost'+port);
            
        });
    });




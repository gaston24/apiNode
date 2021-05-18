'use strict'

var validator = require('validator');
var Article = require('../models/article');
var Fs = require('fs');
var Path = require('path');

var controller = {

    datosCurso: (req, res) => {

        return res.status(200).send({
            curso: "master en frameworks",
            autor: "uno de por ahi",
            url: "gaston",
            hola: "hola mundo"
        });

    }, 

    test: (req, res) => {
        return res.status(200).send({
            message: 'soy el accion test del controller article'
        });
    },

    // api rest

    save: (req, res) => {
        // recoger parametros por post
        var params = req.body;

        // validar datos (validator)

        try{
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        }catch(err){
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }   

        if(validate_title && validate_content){
            // crear el objeto a guardar
            var article = new Article();

            // asignar valores
            article.title = params.title;
            article.content = params.content;
            article.image = null;

            // guardar el articulo

            article.save((err, articleStore)=>{
                if(err || !articleStore){
                    return res.status(404).send({
                        status: 'error',
                        message: 'Los datos no son validos!'
                    });
                }else{
                    // retornar res

                    return res.status(200).send({
                        status: 'success',
                        article: articleStore
                    });
                }
            });

            
        }else{
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son validos'
            });
        }

        

    }, 

    getArticles: (req, res) =>{

        var query = Article.find({});

        var last = req.params.last;

        if(last || last != undefined){
            query.limit(5);
        }

        // find 

        query.sort('-_id').exec((err, articles) =>{

            if(err){
                return res.status(500).send({
                    status: 'error', 
                    message: 'error al devolver los articulos'
                });
            }

            if(!articles){
                return res.status(404).send({
                    status: 'error', 
                    message: 'no hay articulos para mostrar'
                });
            }


            return res.status(200).send({
                status: 'success', 
                articles
            });

        });




        

    }, 

    getArticle: (req, res) =>{
        // recoger id de url
        var articleId = req.params.id;
        // comprbar q existe
        if(!articleId || articleId == null){
            return res.status(404).send({
                status: 'error', 
                message: 'no existe el articulo'
            });
        }

        // buscar articulo 
        Article.findById(articleId, (err, article)=>{
            if(err){
                return res.status(500).send({
                    status: 'error', 
                    message: 'error al devolver los datos'
                });
            }
            if(!article){
                return res.status(404).send({
                    status: 'error', 
                    message: 'no existe el articulo'
                });
            }
            // response
        
            return res.status(200).send({
                status: 'success', 
                article
            });
        });
        
        
    },

    update: (req, res) =>{

        // recoger id articulo por url

        var articleId = req.params.id;

        // recoger datos que llegan por put

        var params = req.body;

        // validar datos

        try {

            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
            
        } catch (err) {

            return res.status(404).send({
                status: 'error', 
                message: 'faltan datos'
            });
            
        }

        if(validate_title && validate_content){
            // find and update

            Article.findByIdAndUpdate({_id: articleId}, params, {new: true}, (err, articleUpdated) =>{
                if(err){
                    return res.status(500).send({
                        status: 'error', 
                        message: 'error al actualizar'
                    });
                }

                if(!articleUpdated){
                    return res.status(404).send({
                        status: 'error', 
                        message: 'no existe el articulo'
                    });
                }

                return res.status(200).send({
                    status: 'success', 
                    article: articleUpdated
                });
            });

        
        }else{
            return res.status(200).send({
                status: 'error', 
                message: 'no existe el articulo'
            });
        }

        
    },

    delete: (req, res) => {

        // recoger id de url

        var articleId = req.params.id;

        // find and delete

        Article.findOneAndDelete({_id: articleId}, (err, articleDeleted) => {
            if(err){
                return res.status(500).send({
                    status: 'error', 
                    message: 'error al borrar'
                });
            }

            if(!articleDeleted){
                return res.status(404).send({
                    status: 'error', 
                    message: 'articulo no encontrado, no se ha borrado'
                });
            }

            return res.status(200).send({
                status: 'success', 
                article: articleDeleted
            })
        });


    },

    search: (req, res) => {

        // sacar el string a buscar

        var searchString = req.params.search;

        // find or 

        Article.find({ "$or" : [
            {"title": {"$regex": searchString, "$options": "i"}},
            {"content": {"$regex": searchString, "$options": "i"}},
        ]})
        .sort([['date', 'descending']])
        .exec((err, articles)=>{

            if(err){
                return res.status(200).send({
                    status: 'error', 
                    message: "error en la peticion"
                })
            }

            if(!articles || articles.length <= 0){
                return res.status(404).send({
                    status: 'error', 
                    message: "no hay articulos que coincidan con la busqueda"
                })
            }

            return res.status(200).send({
                status: 'success', 
                articles: articles
            })

        });



        
    },

    // subida archivos

    upload: (req, res) => {

        // configurar el modulo de connect multiparty (router/article.js)

        // recoger fichero de la peticion

        var fileName = 'Imagen no subida';

        if(!req.files){
            return res.status(404).send({
                status: "error",
                message: fileName
            });
        }

        // conseguir el nombre y extension del archivo

        var file_path = req.files.file0.path;
        // var file_name = req.files.file0.name;

        var file_split = file_path.split('\\'); 
        
        // ADVERTENCIA -> linux o mac
        // var file_split = file_path.split('/'); 

        // Nombre del archivo

        var file_name = file_split[2];

        // extension del fichero

        var extension_split = file_name.split('\.');
        var file_extension = extension_split[1];
        
        // comprobar la extension (solo imagenes), si no es valida, borrar fichero

        if(file_extension != 'png' && file_extension != 'jpg' && file_extension != 'jpeg' && file_extension != 'gif'){
            Fs.unlink(file_path, (err)=>{
                return res.status(200).send({
                    status: "error", 
                    message: "la extension de la imagen no es valida!"
                });
            });
        }else{

            var articleId = req.params.id;

            Article.findOneAndUpdate({_id: articleId}, {image: file_name}, {new: true}, (err, articleUpdated)=>{
                
                if(err || !articleUpdated){
                    
                    return res.status(200).send({
                        status: "error", 
                        // mesage: "error al guardar la imagen del articulo", 
                        mesage: err 
                        
                    });

                }
                return res.status(200).send({
                    status: "success", 
                    article: articleUpdated
                });

            });


        }


        // si todo OK

        // buscar el articulo, asignarle imagen y actualizarlo

        
    },

    getImage: (req, res) => {

        var file = req.params.image;

        var path_file = './upload/articles/'+file;

        console.log(path_file);

        Fs.exists(path_file, (exists)=>{
            if(exists){
                return res.sendFile(Path.resolve(path_file));
            }else{
                return res.status(404).send({
                    status: "error",
                    message: "la imagen no existe", 
                    file: file, 
                    path: path_file
                });
            }
        });

    }, 



};

module.exports = controller;


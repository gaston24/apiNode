'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

// declara el esquema del modelo
var articleSchema = schema({
    title: String,
    content: String,
    date: {type: Date, default: Date.now},
    image: String
});

// nombre del esquema, modelo del esquema usado
// mongoose lo pluraliza
module.exports = mongoose.model('Article', articleSchema);


"use strict";

const express = require('express');
const mongoose = require('mongoose');
var hateoasLinker = require('express-hateoas-links');
const dotenv = require('dotenv');
dotenv.config();
const app = express();

// Déclaration d'un parser pour analyser "le corps (body)" d'une 'requête entrante avec POST  
// Permet donc d'analyser

// parse application/json
app.use(express.json()); 

// remplace le res.json standard avec la nouvelle version
// qui prend en charge les liens HATEOAS
app.use(hateoasLinker); 

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

const errorController = require('./controllers/error');

// Importe les routes
const postRoutes = require('./routes/post');

// Utilisation des routes en tant que middleware
app.use(postRoutes);

app.use(errorController.get404);

// Gestion des erreurs
// "Attrappe" les erreurs envoyé par "throw"
app.use(function (err, req, res, next) {
  console.log('err', err);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).json({ message: err.message, statusCode: err.statusCode });
});


mongoose
  .connect(process.env.MONGODB)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log('Node.js est à l\'écoute sur le port %s ', process.env.PORT);
    });
  })
  .catch(err => console.log(err));


"use strict";

const dotenv = require('dotenv');
dotenv.config();

// Récupère le modèle Post
const Post = require('../models/post');

const url_base = process.env.URL + ":" + process.env.PORT;

// Exemple HATOEAS pour une collection
exports.getPosts = (req, res, next) => {
  Post.find()
    .then(posts => {
      let postsWithLink = posts.map(post => {
        let links = [{
          self: {
            method: "GET",
            href: url_base + "/post/" + post._id.toString()
            }
          },
          {
            update: {
              method: "PUT",
              href: url_base + "/post/"
            }
          },
          {
            delete: {
              method: "DELETE",
              href: url_base + "/post/" + post._id.toString()
            }
          }
        ];
        post = post.toJSON();
        post.links = links;
        return post;
      });
      res.json(postsWithLink);
    })
    .catch(err => {
      next(err);
    });
};

// Récupère un article grâce à son id
// Exemple de endpoint pour un objet unique avec HATOEAS
exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('L\'article n\'existe pas.');
        error.statusCode = 404;
        throw error;
      }
      // La librairie "express-hateoas-links" va créer le champ 'links' dans la réponse
      // avec les urls définies ici
      res.json(post, [{
          self: {
            method: "GET",
            href: url_base + "/post/" + post._id.toString()
          }
        },
        {
          update: {
            method: "PUT",
            title: "Update post",
            href: url_base + "/post/"
          }
        },
        {
          delete: {
            method: "DELETE",
            title: "Delete post",
            href: url_base + "/post/" + post._id.toString()
          }
        }
      ]);
    })
    .catch(err => {
      next(err);
    });
};

// Enregistre un article dans la bd
exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;

  // Crée un nouvel article avec les informations passées dans le body
  const post = new Post({
    title: title,
    content: content
  });

  // Enregistre l'article dans la base de données
  // Utilisation de la méthode save() qui retourne une promesse
  post.save()
    .then(result => {
      res.status(200).json({
        message: "Article créé",
        post: post
      });
    })
    .catch(err => {
      next(err);
    });
};

// Enregistre un article modifié dans la bd
exports.updatePost = (req, res, next) => {
  const postId = req.body.postId;
  const title = req.body.title;
  const content = req.body.content;

  // Retrouve l'article et l'enregistre dans la base de données
  // Utilisation de la méthode save() qui retourne une promesse
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('L\'article n\'existe pas.');
        error.statusCode = 404;
        throw error;
      }
      post.title = title;
      post.content = content;
      return post.save();
    })
    .then(result => {
      res.status(200).json({
        message: 'Article mis à jour !',
        post: result
      });
      // res.redirect('/');
    })
    .catch(err => {
      next(err);
    });
};

// Suprime un article grâce à son id
exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findByIdAndRemove(postId)
    .then(() => {
      console.log('post supprimé');
      res.status(200).json({
        message: "Article supprimé"
      });
    });

};
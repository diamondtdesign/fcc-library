'use strict';

var expect = require('chai').expect;
const Book = require('./bookModel');
require("dotenv").config({ path: "./.env" });

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      Book.find({}, (err, books) => {
        if(err || !books) {
          return res.send('no books found')
        }
        return res.json(books)
      })
    })
    
    .post(function (req, res){
      const { title } = req.body;

      if(!title) {
        return res.send('invalid title')
      }

      new Book({ 
        title: title
      }).save((err, book) => {
        if(err) {
          return res.send('invalid title');
        }
        return res.json(book);
      });
    })
    
    .delete(function(req, res){
      Book.deleteMany({}, err => {
        if(err) {
          return res.send('complete delete failed');
        }
        return res.send('complete delete successful');
      })
    });


  app.route('/api/books/:id')
    .get(function (req, res){
      const bookid = req.params.id;

      if(!bookid) {
        return res.send('no book exists')
      }

      Book.findById(bookid, (err, book) => {
        if(err || !book) {
          res.send('no book exists');
        }
        return res.json(book);
      });
    })
    
    .post(function(req, res){
      const bookid = req.params.id;
      const { comment } = req.body;

      Book.findById(bookid, (err, book) => {
        if(err || !book) {
          return res.send('no book exists');
        }

        if(comment) {
          book.comments.push(comment);
          book.commentcount++;
        }

        book.save(err => {
          if (err) { 
            return res.send('could not add comment');
          }
          return res.json(book);
        })
      });
    })
    
    .delete(function(req, res){
      const bookid = req.params.id;

      if(!bookid) {
        return res.send('no book exists');
      }
  
      Book.deleteOne({ _id: bookid }, err => {
        if (err) {
          return res.send('no book exists');
        }
        return res.send('delete successful');
    });
  });  
};

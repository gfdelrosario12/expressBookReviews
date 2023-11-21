const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

public_users.get('/', function (req, res) {
  const sendResponsePromise = new Promise((resolve, reject) => {
    try {
      const jsonResponse = JSON.stringify(books, null, 4);
      res.send(jsonResponse);
      resolve(jsonResponse);
    } catch (error) {
      reject(error);
    }
  });

  sendResponsePromise
    .then((result) => {
      console.log('Response sent successfully:', result);
    })
    .catch((error) => {
      console.error('Error sending response:', error);
    });
});


public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  const sendResponsePromise = new Promise((resolve, reject) => {
    try {
      const book = books[isbn];

      if (book) {
        res.send(book);
        resolve(book);
      } else {
        const errorMessage = `Book with ISBN ${isbn} not found`;
        res.status(404).send(errorMessage);
        reject(new Error(errorMessage));
      }
    } catch (error) {
      reject(error);
    }
  });

  sendResponsePromise
    .then((result) => {
      console.log('Response sent successfully:', result);
    })
    .catch((error) => {
      console.error('Error sending response:', error);
    });
});
  
public_users.get('/author/:author', function (req, res) {
  const requestedAuthor = req.params.author;

  const findAuthorPromise = new Promise((resolve, reject) => {
    try {
      for (let key in books) {
        if (books.hasOwnProperty(key) && books[key].author === requestedAuthor) {
          const foundBook = books[key];
          res.send(foundBook);
          resolve(foundBook);
          return;
        }
      }
      const errorMessage = `Author ${requestedAuthor} not found`;
      res.status(404).send(errorMessage);
      reject(new Error(errorMessage));
    } catch (error) {
      reject(error);
    }
  });

  findAuthorPromise
    .then((result) => {
      console.log('Response sent successfully:', result);
    })
    .catch((error) => {
      console.error('Error sending response:', error);
    });
});

public_users.get('/title/:title', function (req, res) {
  const requestedTitle = req.params.title;

  const findTitlePromise = new Promise((resolve, reject) => {
    try {
      for (let key in books) {
        if (books.hasOwnProperty(key) && books[key].title === requestedTitle) {
          const foundBook = books[key];
          res.send(foundBook);
          resolve(foundBook);
          return;
        }
      }
      const errorMessage = `Title ${requestedTitle} not found`;
      res.status(404).send(errorMessage);
      reject(new Error(errorMessage));
    } catch (error) {
      reject(error);
    }
  });

  findTitlePromise
    .then((result) => {
      console.log('Response sent successfully:', result);
    })
    .catch((error) => {
      console.error('Error sending response:', error);
    });
});


public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books.hasOwnProperty(isbn)) {
    const book = books[isbn];
    const reviews = book.reviews;
    res.send(reviews);
  } else {
    res.status(404).send('Book not found');
  }
});

module.exports.general = public_users;

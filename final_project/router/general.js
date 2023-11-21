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

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const requestedAuthor = req.params.author;
  for (let key in books) {
    if (books.hasOwnProperty(key) && books[key].author === requestedAuthor) {
      res.send(books[key]);
      return;
    }
  }
  res.send("Author not found");
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const requestedTitle = req.params.title;
  for (let key in books) {
    if (books.hasOwnProperty(key) && books[key].title === requestedTitle) {
      res.send(books[key]);
      return;
    }
  }
  res.send("Title not found");
});

//  Get book review
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

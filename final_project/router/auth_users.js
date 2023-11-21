const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }}

const authenticatedUser = (username,password)=>{
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }
 if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }});


regd_users.put('/auth/review/:isbn', (req, res) => {
  const username = req.session.authorization.username;
  console.log("Put Username" + username)
  const isbn = parseInt(req.params.isbn);
  const reviewText = req.body.review;
  if (!isbn || !reviewText) {
    return res.status(400).json({ message: 'ISBN and review text are required' });
  }
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  book.reviews[username] = reviewText;
  return res.send(books[isbn]);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const sessionUsername = req.session.authorization.username;
console.log("Delete Username" + sessionUsername);
  if (books[isbn]) {
    const book = books[isbn];
    
    if (book.reviews) {
      if (book.reviews[sessionUsername]) {
        delete book.reviews[sessionUsername];
        res.send(books[isbn])
      } else {
        res.status(403).send("You are not authorized to delete this review");
      }
    } else {
      res.status(404).send("No reviews found for this book");
    }
  } else {
    res.status(404).send("Book not found");
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

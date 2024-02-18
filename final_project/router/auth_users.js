const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
  for (const user of users) {
    if (user.username === username) {
      return false;
    }
  }
  return true;
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  for(const user of users){
    if(user.username===username && user.password === password) return true;
  }
  return false;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: username
    },"Mike22-11", { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.query.review;
  let book_new = books[isbn];
  book_new = {...book_new, reviews: {...book_new.reviews, [req.user.data]: review}}
  books = {...books, [isbn]: book_new}
  return res.status(200).json({ message: `The review for the book with ISBN ${isbn} has been added/update` });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  let book_new = books[isbn];
  let reviews = book_new.reviews;
  delete reviews[req.user.data];
  book_new = {...book_new, reviews}
  books = {...books, [isbn]: book_new}
  return res.status(200).json({ message: `The review for the book with ISBN ${isbn} by the user ${req.user.data} deleted` });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

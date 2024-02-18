const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here
  const {username, password} = req.body;
  if(!username){
    return res.status(500).json({message: "username are not provided"})
  }
  if(!password){
    return res.status(500).json({message: "password are not provided"})
  }
  if(!isValid(username)){
    return res.status(500).json({message: "username already exists"})
  }
  const newUser = {
    username, password
  }
  users.push(newUser);
  return res.status(200).json({message: "Customer successfully registred. Now you can login"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json((books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const data = books[isbn];
  return res.status(200).json(data)
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const data = [];
  const keys = Object.keys(books);
  keys.forEach((e)=>{
    if(books[e].author===author) {
      let newObject = {
        isbn: e,
        title: books[e].title,
        reviews: books[e].reviews
      }
      data.push(newObject)
    }
  })
  return res.status(200).json({booksbyauthor: data});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const data = [];
  const keys = Object.keys(books);
  keys.forEach((e)=>{
    if(books[e].title===title) {
      let newObject = {
        isbn: e,
        author: books[e].author,
        reviews: books[e].reviews
      }
      data.push(newObject)
    }
  })
  return res.status(200).json({booksbytitle: data});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const review = books[isbn].reviews;
  return res.status(200).json(review);
});

module.exports.general = public_users;

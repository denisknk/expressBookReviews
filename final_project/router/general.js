const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (users.find(user => user.username === username)) {
        return res.status(409).json({ message: "Username already exists" });
    }

    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {

    let booksList = [];
    for (let book in books) {
        booksList.push(books[book]);
    }
    return res.status(200).json(booksList);

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {

    let isbn = req.params.isbn;
    let book = books[isbn];
    if(book){
        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
 });

// Get book details based on author
public_users.get('/author/:author',function (req, res) {

    let author = req.params.author;
    let booksList = [];
    for (let book in books) {
        if(books[book].author === author){
            booksList.push(books[book]);
        }
    }
    if(booksList.length > 0){
        return res.status(200).json(booksList);
    } else {
        return res.status(404).json({ message: "Author not found" });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {

    let title = req.params.title;
    let booksList = [];
    for (let book in books) {
        if(books[book].title === title){
            booksList.push(books[book]);
        }
    }
    if(booksList.length > 0){
        return res.status(200).json(booksList);
    } else {
        return res.status(404).json({ message: "Title not found" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {

    let isbn = req.params.isbn;
    let book = books[isbn];
    if(book){
        if(book.reviews.length > 0){
            return res.status(200).json(book.reviews);
        } else {
            return res.status(404).json({ message: "No reviews found" });
        }
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;

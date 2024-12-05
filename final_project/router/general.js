const express = require('express');
let books = require("./booksdb.js");
const axios = require('axios');
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
public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:5001/books');
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books list" });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const { isbn } = req.params;
    try {
        const response = await axios.get(`http://localhost:5001/books/${isbn}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book details" });
    }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const { author } = req.params;
    try {
        const response = await axios.get(`http://localhost:5001/books/author/${author}`);
        return res.status(200).json(response.data);
    } catch (error) {
        console.error("Error fetching book details by author:", error.message);
        return res.status(500).json({ message: "Error fetching book details by author" });
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const { title } = req.params;
    try {
        const response = await axios.get(`http://localhost:5001/books/title/${title}`);
        return res.status(200).json(response.data);
    } catch (error) {
        console.error("Error fetching book details by title:", error.message);
        return res.status(500).json({ message: "Error fetching book details by title" });
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

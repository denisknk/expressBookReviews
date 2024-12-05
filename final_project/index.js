const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
let books = require('./router/booksdb.js');

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

app.use("/customer/auth/*", function auth(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(401).json({ message: "Access denied! Token not provided" });
    }
    jwt.verify(token, "fingerprint_customer", (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Access denied! Invalid token" });
        }
        req.user = user;
        next();
    });
});

const PORT = 5001;

app.use("/customer", customer_routes);
app.use("/", genl_routes);


app.get('/books', (req, res) => {
    res.status(200).json(books);
});

app.get('/books/:isbn', (req, res) => {
    const { isbn } = req.params;
    const book = books[isbn];
    if (book) {
        res.status(200).json(book);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

app.get('/books/author/:author', (req, res) => {
    const { author } = req.params;
    const booksByAuthor = Object.values(books).filter(book => book.author === author);
    if (booksByAuthor.length > 0) {
        res.status(200).json(booksByAuthor);
    } else {
        res.status(404).json({ message: "Books by this author not found" });
    }
});

app.get('/books/title/:title', (req, res) => {
    const { title } = req.params;
    const booksByTitle = Object.values(books).filter(book => book.title === title);
    if (booksByTitle.length > 0) {
        res.status(200).json(booksByTitle);
    } else {
        res.status(404).json({ message: "Books with this title not found" });
    }
});

app.listen(PORT, () => console.log("Server is running"));

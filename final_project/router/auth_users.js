const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({
            message: "Error logging in"
        });
    }

    let authenticatedUser = users.find(user =>
        user.username === username &&
        user.password === password
    );

    if (authenticatedUser) {

        let accessToken = jwt.sign(
            {
                data: password
            },
            "access",
            {
                expiresIn: 60 * 60
            }
        );

        req.session.authorization = {
            accessToken
        };

        return res.status(200).send("User successfully logged in");

    } else {

        return res.status(208).json({
            message: "Invalid Login. Check username and password."
        });

    }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

    const username = req.session.authorization.username;
    const isbn = req.params.isbn;
    const review = req.query.review;

    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: "Review successfully added/updated.",
        reviews: books[isbn].reviews
    });

});
regd_users.delete("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    if (books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];

        return res.status(200).json({
            message: "Review successfully deleted."
        });
    }

    return res.status(404).json({
        message: "Review not found."
    });

});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

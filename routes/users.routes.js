const express = require(`express`);
const router = express.Router();
const User = require(`../models/User.model`);
const isLoggedIn = require("../middleware/isLoggedIn");
const consoleLog = require("../middleware/consoleLog");

router.get(`/`, isLoggedIn, consoleLog, (req, res) => {
    User.find()
        .then((data) => {
            console.log(data);
            res.render("users/users", { users: data, isAuthenticated: !!req.session.currentUser });
        })
        .catch((err) => console.log(err));
});

router.get(`/profile`, isLoggedIn, consoleLog, (req, res) => {
    User.find()
        .then((data) => {
            console.log(data);
            res.render("users/profile", { users: data, isAuthenticated: !!req.session.currentUser });
        })
        .catch((err) => console.log(err));
});

module.exports = router;
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

router.get(`/:id`, isLoggedIn, (req, res) => {
    User.findById(req.params.id).populate(`user`)
        .then((data) => {
            res.render(`users/profile`, { user: data });
        });
});

router.post(`/:id/delete`, isLoggedIn, (req, res) => {
    User.findByIdAndDelete(req.params.id).then(() => res.redirect(`auth/signup`));
});

router.get(`/edit/:id`, isLoggedIn, (req, res) => {
    Promise.all([
        User.findById(req.params.id),
        User.find()
    ])

        .then(([user]) => {
            res.render(`users/edit`, { user });
        });
});

router.post(`/:id/edit`, isLoggedIn, (req, res) => {
    const { alias, email, username } = req.body;
    User.findByIdAndUpdate(req.params.id, { alias, email, username }, { new: true })
        .then(() => res.redirect(`/users/${req.params.id}`));
});

module.exports = router;
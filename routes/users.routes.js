const express = require(`express`);
const router = express.Router();
const User = require(`../models/User.model`);
const isLoggedIn = require("../middleware/isLoggedIn");
const consoleLog = require("../middleware/consoleLog");
const fileUploader = require('../config/cloudinary.config');

// User List
router.get(`/users`, isLoggedIn, (req, res) => {
    User.find()
        .then((data) => {
            res.render("users/users", { users: data, isAuthenticated: !!req.session.currentUser });
        })
        .catch((err) => console.log(err));
});

// View profile all users
router.get('/profile', isLoggedIn, consoleLog, (req, res) => {
    const currentUser = req.session.currentUser;

    User.findById(currentUser._id)
        .then((data) => {
            console.log(data);
            res.render("users/profile", { user: data, isAuthenticated: !!req.session.currentUser });
        })
        .catch((err) => console.log(err));
});


// Delete User in view profile
router.post(`/:id/delete`, isLoggedIn, (req, res) => {
    User.findByIdAndDelete(req.params.id).then(() => res.redirect(`auth/signup`))
        .catch(err => console.log(err));
});


router.get(`/edit/:id`, isLoggedIn, (req, res) => {

    User.findById(req.params.id)

        .then((user) => {
            res.render(`users/edit-profile`, { user, isAuthenticated: !!req.session.currentUser });
        });
});

// Edit User in view Profile
router.post(`/:id/edit`, isLoggedIn, (req, res) => {
    const { username, alias, email, } = req.body;
    User.findByIdAndUpdate(req.params.id, { username, alias, email }, { new: true })
        .then(() => res.redirect(`/users/profile`))
        .catch(err => console.log(err));
});


module.exports = router;
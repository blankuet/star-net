const express = require(`express`);
const router = express.Router();
const User = require(`../models/User.model`);
const isLoggedIn = require("../middleware/isLoggedIn");
const consoleLog = require("../middleware/consoleLog");

router.get('/profile', isLoggedIn, consoleLog, (req, res) => {
    const currentUser = req.session.currentUser;

    User.findById(currentUser._id)
        .then((data) => {
            console.log(data);
            res.render("users/profile", { user: data, isAuthenticated: !!req.session.currentUser });
        })
        .catch((err) => console.log(err));
});

router.get(`/:id`, isLoggedIn, (req, res) => {
    User.findById(req.params.id)
        .then((data) => {
            res.render(`users/profile`, { user: data });
        })
        .catch((err) => console.log(err));
});

router.post(`/:id/delete`, isLoggedIn, (req, res) => {
    User.findByIdAndDelete(req.params.id).then(() => res.redirect(`auth/signup`))
        .catch(err => console.log(err));
});

router.get('/:id/edit', isLoggedIn, (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            res.render('users/edit-profile', { user });
        })
        .catch(err => console.log(err));
});

router.post(`/:id/edit`, isLoggedIn, (req, res) => {
    const { alias, email, username } = req.body;
    User.findByIdAndUpdate(req.params.id, { alias, email, username }, { new: true })
        .then(() => res.redirect(`/users/`))
        .catch(err => console.log(err));
});

module.exports = router;
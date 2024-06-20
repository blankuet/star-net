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

router.get('/profile', isLoggedIn, consoleLog, (req, res) => {
    const currentUser = req.session.currentUser;

    User.findById(currentUser._id)
        .then((data) => {
            console.log(data);
            res.render("users/profile", { user: data, isAuthenticated: !!req.session.currentUser });
        })
        .catch((err) => console.log(err));
});



router.post(`/:id/delete`, isLoggedIn, (req, res) => {
    User.findByIdAndDelete(req.params.id).then(() => res.redirect(`auth/signup`))
        .catch(err => console.log(err));
});



router.post(`/:id/edit`, isLoggedIn, (req, res) => {
    const { alias, email, username } = req.body;
    User.findByIdAndUpdate(req.params.id, { alias, email, username }, { new: true })
        .then(() => res.redirect(`/users/edit-profile`))
        .catch(err => console.log(err));
});

module.exports = router;
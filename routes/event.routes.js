const express = require(`express`);
const router = express.Router();
const Event = require(`../models/Event.model`);
const isLoggedIn = require("../middleware/isLoggedIn");

router.get(`/`, isLoggedIn, (req, res) => {
    Event.find({ user: req.session.currentUser._id })
    .then((data) => {
        res.render("event/list", { events: data });
    });
});
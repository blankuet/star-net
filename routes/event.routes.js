const express = require(`express`);
const router = express.Router();
const Event = require(`../models/Event.model`);
const User = require(`../models/User.model`);
const isLoggedIn = require("../middleware/isLoggedIn");
router.get(`/`, isLoggedIn, (req, res) => {
    Event.find({ user: req.session.currentUser._id }) //{ user: req.session.currentUser._id } esto va dentro del parentesis del find
    .then((data) => {
        console.log(data)
        res.render("events/eventList", { events: data });
    });
});
router.get(`/create`, isLoggedIn, async (req, res) => {
    const users = await User.find();
    res.render("events/create", { users });
});
router.post(`/create`, isLoggedIn, (req, res)=> {
    const user = req.session.currentUser._id;
    const { name, description } = req.body;
    Event.create({name, description, user}).then((data) => {
        res.redirect("/events/");
    });
});
module.exports = router;
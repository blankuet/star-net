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

router.get(`/:id`, isLoggedIn, (req, res) => {
    Event.findById(req.params.id)
    .then((data) => {
        res.render(`events/event-detais`, { event: data });
    });
});

router.post(`/:id/delete`, isLoggedIn, (req, res) => {
    Event.findByIdAndDelete(req.params.id).then(() => res.redirect(`/events`));
});

router.get(`/edit/:id`, isLoggedIn, (req, res) => {
    Promise.all([
        Event.findById(req.params.id),
        User.find()
    ])

    .then(([event, user]) => {
        res.render(`events/edit-event`, { event, user });
    });
});

router.post(`/:id/edit`, isLoggedIn, (req, res) => {
    const { name, description } = req.body;
    Event.findByIdAndUpdate(req.params.id, { name, description }, { new: true })
    .then(() => res.redirect(`/events/${req.params.id}`));
});

module.exports = router;
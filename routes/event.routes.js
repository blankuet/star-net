const express = require(`express`);
const router = express.Router();
const Event = require(`../models/Event.model`);
const User = require(`../models/User.model`);
const Comment = require(`../models/Comment.model`);
const isLoggedIn = require("../middleware/isLoggedIn");
const fileUploader = require("../config/cloudinary.config");

router.get(`/`, isLoggedIn, (req, res) => {
  Event.find({ user: req.session.currentUser._id }).then((data) => {
    res.render("events/eventList", {
      events: data,
      isAuthenticated: !!req.session.currentUser,
    });
  });
});

router.get(`/create`, isLoggedIn, async (req, res) => {
  const users = await User.find();
  res.render("events/create", {
    users,
    isAuthenticated: !!req.session.currentUser,
  });
});
router.post(
  `/create`,
  isLoggedIn,
  fileUploader.single("event-image"),
  (req, res) => {
    const user = req.session.currentUser._id;
    const img = req.file.path;
    const { name, description } = req.body;
    Event.create({ name, description, img, user }).then((data) => {
      res.redirect("/events/");
    });
  }
);

/* all events route */
router.get(`/all-events`, isLoggedIn, (req, res) => {
  Event.find().then((data) => {
    res.render("events/all-events", {
      events: data,
      isAuthenticated: !!req.session.currentUser,
    });
  });
});
/* END */

//event details all events:

router.get(`/view/:id`, isLoggedIn, (req, res) => {
  Event.findById(req.params.id)
    .populate("user")
    .populate({ path: `comments`, populate: { path: `user` } })
    .then((data) => {
      res.render(`events/event-view`, {
        event: data,
        isAuthenticated: !!req.session.currentUser,
      });
    });
});

//event details all events:

router.get(`/:id`, isLoggedIn, (req, res) => {
  Event.findById(req.params.id)
    .populate(`user`)
    .then((data) => {
      res.render(`events/event-details`, {
        event: data,
        isAuthenticated: !!req.session.currentUser,
      });
    });
});

router.post(`/:id/delete`, isLoggedIn, (req, res) => {
  Event.findByIdAndDelete(req.params.id).then(() => res.redirect(`/events`));
});

router.get(`/edit/:id`, isLoggedIn, (req, res) => {
  Promise.all([Event.findById(req.params.id), User.find()])
  .then(([event, user]) => {
    res.render(`events/edit-event`, {
      event,
      user,
      isAuthenticated: !!req.session.currentUser,
    });
  });
});

router.post(`/:id/edit`, isLoggedIn, (req, res) => {
  const { name, description } = req.body;
  Event.findByIdAndUpdate(
    req.params.id,
    { name, description },
    { new: true }
  ).then(() => res.redirect(`/events/${req.params.id}`));
});

//Route to add a comment to an event:

router.post(`/:id/comment`, isLoggedIn, (req, res) => {
  const { text } = req.body;
  const userId = req.session.currentUser._id;
  const eventId = req.params.id;
  Comment.create({ text, User:userId, event: eventId, likes: [] })
    .then((comment) => {
      return Event.findByIdAndUpdate(eventId, {
        $push: { comments: comment._id },
      });
    })
    .then(() => {
      res.redirect(`/events/view/${eventId}`);
    });
});

//Route to like an event:

router.post(`/:id/likes`, isLoggedIn, (req, res) => {
  const eventId = req.params.id;
  const userId = req.session.currentUser._id;

  Event.findByIdAndUpdate(eventId)
    .populate("likes")
    .then((event) => {
      if (!event) {
        throw new Error(`Event not found`);
      }
      console.log(event.likes);
      let isAlreadyLiked = false;
      event.likes.forEach((like) => {
        if (like.equals(userId)) {
          isAlreadyLiked = true;
        }
      });
      if (!isAlreadyLiked) {
        event.likes.push(userId);
      } else {
        const index = event.likes.indexOf(userId);
        event.likes.splice(index, 1);
      }
      return event.save();
    })
    .then(() => {
      res.redirect(`/events//view/${eventId}`);
    });
});

//Route to like a comment:

router.post(`/comments/:id/likes`, isLoggedIn, (req, res) => {
  const commentId = req.params._id;
  const userId = req.session.currentUser._id;

  Comment.findById(commentId)
    .then((comment) => {
      if (!comment) {
        throw new Error(`Comment not found`);
      }
      if (!comment.likes.includes(userId)) {
        comment.likes.push(userId);
        return comment.save();
      } else {
        comment.likes.pull(userId);
        return comment.save();
      }
      /*res.redirect(`back`)	
            throw new Error(`Comment already liked by this user`);   (Esto para poner después de else)*/
    })
    .then(() => {
      res.redirect(`/view/${req.params.id}`);
    });
});

module.exports = router;

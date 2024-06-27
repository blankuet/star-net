const express = require(`express`);
const router = express.Router();
const Event = require(`../models/Event.model`);
const User = require(`../models/User.model`);
const Comment = require(`../models/Comment.model`);
const isLoggedIn = require("../middleware/isLoggedIn");
const fileUploader = require("../config/cloudinary.config");
const authString = btoa(`e6b9d448-3a3a-4cbb-b89d-f410c6b37537:6c70edcb386607c9c306b227d0b2a5f978ce9030913a67470e7c0332c339ecbbb48d3f4e6af630fdfe320e6ca6039b07c157d5fc4e0090bcbd97368458d47988b9bf8afb98b33837e6edb69a3fe592080d597dfa458050e7b867f6287d3fa3a76c2ea10b7f9f6bff5c0b19509aa1967f`);

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
  const response = await fetch('https://api.astronomyapi.com/api/v2/bodies/events',
    {
      headers: {
        Authorization: `Basic ${authString}`,

      },
    }
  );
  const finalResponse = await response.json();
  console.log(finalResponse);
  res.render("events/create", {
    users,
    isAuthenticated: !!req.session.currentUser,
  });
});

router.post(`/create`, isLoggedIn, fileUploader.single("event-image"),  (req, res) => {
    const user = req.session.currentUser._id;
    const img = req.file.path;
    const { name, description, location, date, startTime } = req.body;

    // Parse the date string into a Date object
    const eventDate = new Date(date);
    const [hours, minutes] = startTime.split(':').map(Number);

    eventDate.setHours(hours)
    eventDate.setMinutes(minutes)


    // Create a new Date object for time and set hours and minutes
    const eventTime = new Date(1970, 0, 1); // January 1, 1970
    // const [hours, minutes] = startTime.split(':').map(Number);
    // eventTime.setHours(hours);
    // eventTime.setMinutes(minutes);

    const eventStartTime = new Date(date) 

    Event.create({ name, description, location, date: eventDate, startTime: eventStartTime, img, user }).then((data) => {
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
    .populate({ path: `comments`, populate: { path: `user` } })
    .then((data) => {
      let date = data.date.toISOString().split('T')[0];
let time = data.date.toISOString().split('T')[1];
      res.render(`events/event-details`, {
        event: data,
        date, 
        time: `${data.date.getHours()}:${data.date.getMinutes()}`,
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
let date = event.date.toISOString().split('T')[0];
let time = event.date.toISOString().split('T')[1];
console.log(date);
console.log(time);
    res.render(`events/edit-event`, {
      event,
      date,
      time,
      user,
      isAuthenticated: !!req.session.currentUser,

    });
});

router.post(`/:id/edit`, isLoggedIn, (req, res) => {
  const { name, description, location, date, startTime } = req.body;

  const eventDate = new Date(date);
  const [hours, minutes] = startTime.split(':').map(Number);

  eventDate.setHours(hours)
  eventDate.setMinutes(minutes)


  Event.findByIdAndUpdate(
    req.params.id,
    { name, description, location, date: eventDate, startTime: eventDate },
    { new: true }
  ).then(() => res.redirect(`/events/${req.params.id}`));
});

//Route to edit image:

router.get(`/edit-image/:id`, isLoggedIn, (req, res) => {
  Event.findById(req.params.id).then((event) => {
    res.render(`events/edit-image`, {
      event,
      isAuthenticated: !!req.session.currentUser,
    });
  });
});

router.post(`/:id/edit-image`, isLoggedIn, (req, res) => {
  const { image } = req.body;
  Event.findByIdAndUpdate(
    req.params.id,
    { image },
    { new: true }
  ).then(() => res.redirect(`/events/${req.params.id}`
  ));
});

//Route to add a comment to an event:


router.post(`/:id/comment`, isLoggedIn, (req, res) => {
  const { text } = req.body;
  const userId = req.session.currentUser._id;
  const eventId = req.params.id;
  Comment.create({ text, User: userId, event: eventId, likes: [] })
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
      res.redirect(`/events/view/${eventId}`);
    });
});

//Route to like a comment:

router.post(`/comments/:id/likes`, isLoggedIn, (req, res) => {
  const commentId = req.params.id;
  const userId = req.session.currentUser._id;

  Comment.findById(commentId)
    .populate("likes")
    .then((comment) => {
      if (!comment) {
        throw new Error(`Comment not found`);
      }

      let isAlreadyLiked = false;
      comment.likes.forEach((like) => {
        if (like.equals(userId)) {
          isAlreadyLiked = true;
        }
      });
      if (!isAlreadyLiked) {
        comment.likes.push(userId);
      } else {
        const index = comment.likes.indexOf(userId);
        comment.likes.splice(index, 1);
      }
      return comment.save();
    })
    .then(() => {
      res.redirect(`/events/view/${comment.eventId}`);
    });
});



module.exports = router;

const express = require('express');
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index", { isAuthenticated: req.session.currentUser ? true : false });
});

module.exports = router;

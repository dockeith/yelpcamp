const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware");

// Index route
router.get("/", (req, res) => {
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", {
        campgrounds: campgrounds,
        page: "campgrounds"
      });
    }
  });
});

// Create route
router.post("/", middleware.isLoggedIn, (req, res) => {
  const name = req.body.name;
  const price = req.body.price;
  const image = req.body.image;
  const desc = req.body.description;
  const author = {
    id: req.user._id,
    username: req.user.username
  };
  const newCampground = {
    name: name,
    price: price,
    image: image,
    description: desc,
    author: author
  };
  Campground.create(newCampground, err => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
});

// New route
router.get("/new", middleware.isLoggedIn, (_req, res) => {
  res.render("campgrounds/new");
});

// Show route
router.get("/:id", (req, res) => {
  Campground.findById(req.params.id)
    .populate("comments")
    .exec((err, campground) => {
      if (err) {
        console.log(err);
      } else {
        res.render("campgrounds/show", { campground: campground });
      }
    });
});

// Edit campground form route
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) {
      req.flash("error", "Campground not found");
      res.redirect("/campgrounds");
    } else {
      res.render("campgrounds/edit", { campground: foundCampground });
    }
  });
});

// Update campground route
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, err => {
    if (err) {
      req.flash("error", "Campground not found");
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// Destroy campground route
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, err => {
    if (err) {
      req.flash("error", "Campground not found");
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;

var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');

// ===================
//  CAMPGROUND ROUTES
// ===================

// INDEX ROUTE
router.get("/", function(req, res) {
	Campground.find({}, function(err, allCampgrounds) {
		if(err) {
			console.log(err);
		}
		else {	
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	});
});

// CREATE ROUTE
router.post("/", function(req, res) { 
	var name = req.body.name;
	var image = req.body.image;
	var discription = req.body.discription;
	var newCampground = {name: name, image: image, discription: discription};
	Campground.create(newCampground, function(err, newlyCreated) {
		if(err) {
			console.log(err);
		}
		else {
			res.redirect("/campgrounds");	
		}
	});
});

// NEW ROUTE
router.get("/new", function(req, res) {
	res.render("campgrounds/new");
});

// SHOW ROUTE
router.get("/:id", function(req, res) {
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
		if(err) {
			console.log(err);
		}
		else {
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

module.exports = router;
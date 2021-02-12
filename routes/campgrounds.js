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
router.post("/", isLoggedIn, function(req, res) { 
	var name = req.body.name;
	var image = req.body.image;
	var discription = req.body.discription;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name: name, image: image, discription: discription, author: author};
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
router.get("/new", isLoggedIn, function(req, res) {
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

// EDIT ROUTE
router.get("/:id/edit", checkCampgroundOwnership, function(req, res) {
	Campground.findById(req.params.id, function(err, foundCampground) {			
		res.render("campgrounds/edit", {campground: foundCampground});				
	});
});

// UPDATE ROUTE
router.put("/:id", checkCampgroundOwnership, function(req, res) {
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
		if(err) {
			res.redirect("/campgrounds");
		}
		else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
});

// DESTROY ROUTE
router.delete("/:id", checkCampgroundOwnership, function(req, res) {
	Campground.findByIdAndRemove(req.params.id, function(err) {
		if(err) {
			res.redirect('/campgrounds');
		}
		else {
			res.redirect('/campgrounds');
		}
	})
})

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}

function checkCampgroundOwnership(req, res, next) {
	if(req.isAuthenticated()) {
		Campground.findById(req.params.id, function(err, foundCampground) {
			if(err) {
				res.redirect("back");
			}
			else {
				if(foundCampground.author.id.equals(req.user._id)) {
					next();
				}
				else {
					res.redirect("back");
				}
			}
		})
	}
	else {
		res.redirect("back");
	}
}

module.exports = router;
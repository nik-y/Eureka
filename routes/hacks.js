var express = require('express');
var router = express.Router();
var Hack = require('../models/hack');
var middleware = require('../middleware');

// ===================
//  HACKS ROUTES
// ===================

// INDEX ROUTE
router.get("/", function(req, res) {
	Hack.find({}, function(err, allHacks) {
		if(err) {
			console.log(err);
		}
		else {	
			res.render("hacks/index", {hacks: allHacks});
		}
	});
});

// CREATE ROUTE
router.post("/", middleware.isLoggedIn, function(req, res) { 
	var name = req.body.name;
	var topic = req.body.topic;
	var image = req.body.image;
	var discription = req.body.discription;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newHack = {name: name, topic: topic, image: image, discription: discription, author: author};
	Hack.create(newHack, function(err, newHack) {
		if(err) {
			console.log(err);
		}
		else {
			res.redirect("/hacks/" + newHack._id);	
		}
	});
});
 
// NEW ROUTE
router.get("/new", middleware.isLoggedIn, function(req, res) {
	res.render("hacks/new");
});

// SHOW ROUTE
router.get("/:id", function(req, res) {
	Hack.findById(req.params.id).populate("comments").exec(function(err, foundHack) {
		if(err || !foundHack) {
			req.flash("error", "Hack not found!");
			res.redirect("/hacks");
		}
		else {
			res.render("hacks/show", {hack: foundHack});
		}
	});
});

// EDIT ROUTE
router.get("/:id/edit", middleware.checkHackOwnership, function(req, res) {
	Hack.findById(req.params.id, function(err, foundHack) {			
		res.render("hacks/edit", {hack: foundHack});				
	});
});

// UPDATE ROUTE
router.put("/:id", middleware.checkHackOwnership, function(req, res) {
	Hack.findByIdAndUpdate(req.params.id, req.body.hack, function(err, updatedHack) {
		if(err) {
			res.redirect("/hacks");
		}
		else {
			res.redirect("/hacks/" + req.params.id);
		}
	})
});

// DESTROY ROUTE
router.delete("/:id", middleware.checkHackOwnership, function(req, res) {
	Hack.findByIdAndRemove(req.params.id, function(err) {
		if(err) {
			res.redirect('/hacks');
		}
		else {
			req.flash("success", "Hack removed!");
			res.redirect('/hacks');
		}
	})
})

module.exports = router;
var express = require('express');
var router = express.Router({mergeParams: true});
var Hack = require('../models/hack');
var Comment = require('../models/comment');
var middleware = require('../middleware');

// =========================
//      COMMENT ROUTES
// =========================

// NEW ROUTE
router.get("/new", middleware.isLoggedIn, function(req, res) {
	Hack.findById(req.params.id, function(err, hack) {
		if(err) {
			console.log(err);
		}
		else {
			res.render("comments/new", {hack: hack});
		}
	})
});

// CREATE ROUTE
router.post("/", middleware.isLoggedIn, function(req, res) {
	Hack.findById(req.params.id, function(err, hack) {
		if(err || !hack) {
			req.flash("error", "Hack not found!");
			res.redirect("/hacks")
		}
		else {
			Comment.create(req.body.comment, function(err, comment) {
				if(err) {
					console.log(err);
				}
				else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();	
					
					hack.comments.push(comment);
					hack.save();
					req.flash("success", "Comment Added!");
					res.redirect('/hacks/' + hack._id);
				}
			})	
		}
	})
});

// EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
	Comment.findById(req.params.comment_id, function(err, foundComment) {
		if(err || !foundComment) {
			req.flash("error", "Comment not found!");
			res.redirect('/hacks/' + req.params.id);
		}
		else {
			res.render("comments/edit", {hack_id: req.params.id, comment: foundComment});
		}
	});
})

// UPDATE ROUTE 
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
		if(err) {
			req.flash("error", "Database not working!");
			res.redirect("back");
		}
		else {
			res.redirect("/hacks/" + req.params.id);
		}
	})
})

// DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndRemove(req.params.comment_id, function(err) {
		if(err) {
			res.redirect("back");
		}
		else { 
			req.flash("success", "Comment removed!");
			res.redirect("/hacks/" + req.params.id);
		}
	})
})

module.exports = router;
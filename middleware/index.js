var Hack = require('../models/hack');
var Comment = require('../models/comment')
var middlewareObj = {};

middlewareObj.checkHackOwnership = function(req, res, next) {
	if(req.isAuthenticated()) {
		Hack.findById(req.params.id, function(err, foundHack) {
			if(err || !foundHack) {
				req.flash("error", "Hack not found!");
				res.redirect("/hacks");
			}
			else {
				if(foundHack.author.id.equals(req.user._id)) {
					next();
				}
				else {
					req.flash("error", "Permission denied!");
					res.redirect("/hacks/" + req.params.id);
				}
			}
		})
	}
	else {
		req.flash("error", "Log in first!")
		res.redirect("/hacks/" + req.params.id);
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
	if(req.isAuthenticated()) {
		Hack.findById(req.params.id, function(err, foundHack) {
			if(err || !foundHack) {
				req.flash("error", "Hack not found!");
				res.redirect('/hacks');
			}
			else {
				Comment.findById(req.params.comment_id, function(err, foundComment) {
					if(err || !foundComment) {
						req.flash("error", "Comment not found!");
						res.redirect('/hacks/' + req.params.id);
					}
					else {
						if(foundComment.author.id.equals(req.user._id)) {
							next();
						}
						else {
							req.flash("error", "Permission denied!");
							res.redirect('/hacks/' + req.params.id);
						}
					}
				})
			}
		})
		
	}
	else {
		req.flash("error", "Log in first!")
		res.redirect('/hacks/' + req.params.id);
	}
}

middlewareObj.isLoggedIn = function(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	req.flash("error", "Log in first!");
	res.redirect('/login');
}

module.exports = middlewareObj;
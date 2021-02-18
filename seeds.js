var mongoose = require("mongoose");
var Hack = require("./models/hack");
var Comment   = require("./models/comment");

var data = [
    // fill with dummy data
]

function seedDB(){
   //Remove all hacks
   Hack.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed hacks!");
        Comment.remove({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
             //add a few hacks
            data.forEach(function(seed){
                Hack.create(seed, function(err, hack){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a hack");
                        //create a comment
                        Comment.create(
                            {
                                text: "This place is great, but I wish there was internet",
                                author: "Homer"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    hack.comments.push(comment);
                                    hack.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        });
    }); 
	
}


module.exports = seedDB;

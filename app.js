var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var campgrounds = [
		{name: "Mount Musk", image: "https://pixabay.com/get/52e3d3404a55af14f1dc84609620367d1c3ed9e04e50774875297fd59f4dc4_340.png"},
		{name: "Hilbert Hotel", image: "https://pixabay.com/get/57e8d1464d53a514f1dc84609620367d1c3ed9e04e50774875297fd59f4dc4_340.jpg"},
		{name: "Payne Gyan", image: "https://pixabay.com/get/57e8d1454b56ae14f1dc84609620367d1c3ed9e04e50774875297fd59f4dc4_340.jpg"},
	{name: "Mount Musk", image: "https://pixabay.com/get/52e3d3404a55af14f1dc84609620367d1c3ed9e04e50774875297fd59f4dc4_340.png"},
		{name: "Hilbert Hotel", image: "https://pixabay.com/get/57e8d1464d53a514f1dc84609620367d1c3ed9e04e50774875297fd59f4dc4_340.jpg"},
		{name: "Payne Gyan", image: "https://pixabay.com/get/57e8d1454b56ae14f1dc84609620367d1c3ed9e04e50774875297fd59f4dc4_340.jpg"},
	{name: "Mount Musk", image: "https://pixabay.com/get/52e3d3404a55af14f1dc84609620367d1c3ed9e04e50774875297fd59f4dc4_340.png"},
		{name: "Hilbert Hotel", image: "https://pixabay.com/get/57e8d1464d53a514f1dc84609620367d1c3ed9e04e50774875297fd59f4dc4_340.jpg"},
		{name: "Payne Gyan", image: "https://pixabay.com/get/57e8d1454b56ae14f1dc84609620367d1c3ed9e04e50774875297fd59f4dc4_340.jpg"}
];

app.get("/", function(req, res) {
	res.render("landing")
});

app.get("/campgrounds", function(req, res) {
	res.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds", function(req, res) { 
	var name = req.body.name;
	var image = req.body.image;
	var newCampground = {name: name, image: image};
	campgrounds.push(newCampground);
	res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res) {
	res.render("new");
});

app.listen(3001, function() {
	console.log("The YelpCamp server app has started");
});
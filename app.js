var express        = require('express'),
	app            = express(),
	bodyParser     = require('body-parser'),
	mongoose       = require('mongoose'),
	flash          = require('connect-flash'),
	passport       = require('passport'),
	LocalStrategy  = require('passport-local'),
	methodOverride = require('method-override');
	
var	Campground    = require('./models/campground'),
	Comment       = require('./models/comment'),
	User          = require('./models/user'),
	seedBD        = require('./seeds');

var campgroundRoutes = require('./routes/campgrounds'),
	commentRoutes    = require('./routes/comments'),
	indexRoutes      = require('./routes/index');

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});
// mongoose.connect("mongodb+srv://NikYMLab:elgoog123@cluster0.z3o8p.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method")); 
app.use(flash());
//seedBD(); 

// PASSPORT CONFIGURATION
app.use(require('express-session')({
	secret: "nobody know what it is.. neither do I",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});


app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT || 3002, function() {
	console.log("The YelpCamp server app has started");
});
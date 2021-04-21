var express        = require('express'),
	app            = express(),
	bodyParser     = require('body-parser'),
	mongoose       = require('mongoose'),
	flash          = require('connect-flash'),
	passport       = require('passport'),
	LocalStrategy  = require('passport-local'),
	methodOverride = require('method-override');
	
var	Hack          = require('./models/hack'),
	Comment       = require('./models/comment'),
	User          = require('./models/user'),
	seedBD        = require('./seeds');

var hackRoutes       = require('./routes/hacks'),
	commentRoutes    = require('./routes/comments'),
	indexRoutes      = require('./routes/index');

var dbUrl = process.env.DBURL || "mongodb://localhost:27017/hackdb";
mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true});

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
app.use("/hacks", hackRoutes);
app.use("/hacks/:id/comments", commentRoutes);

app.get("*", function(req, res) {
	req.flash("error", "Page not found!");
	res.redirect("/");
})

app.listen(process.env.PORT || 3003, function() {
	console.log("The Eureka server app has started");
});
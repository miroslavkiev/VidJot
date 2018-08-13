const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const app = express();

//load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//Passport config
require('./config/passport')(passport);

//Connect to mongoose
const db = require('./config/database');
mongoose.connect(db.mongoURI, {
	useNewUrlParser: true
})
	.then(() => console.log(`MongoDB connected...`))
	.catch(err => console.log(err));

//Handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// bodyParser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Method override middleware
app.use(methodOverride('_method'));

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

//express-session middleware
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash middleware
app.use(flash());

//Global variables
app.use(function(req,res,next){
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});
const port = process.env.PORT || 80;

app.get('/', (req, res) => {
	const title = 'Welcome!';
	res.render('index', {
		title: title
	});
});

app.get('/about', (req, res) => {
	res.render('about');
});

//Use routes
app.use('/ideas', ideas);
app.use('/users', users);

app.listen(port, () => {
	console.log(`The app started on ${port}`);
});
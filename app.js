const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

//Connect to mongoose
mongoose.connect('mongodb://localhost:27017/vidjot-dev', {
	useNewUrlParser: true
})
	.then(() => console.log(`MongoDB connected...`))
	.catch(err => console.log(err));

// Load idea model
require('./models/Idea');
const Idea = mongoose.model('ideas');

//Handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// bodyParser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = 80;

app.get('/', (req, res) => {
	const title = 'Welcome!';
  res.render('index',{
  	title: title
	});
});

app.get('/about', (req, res) => {
	res.render('about');
});

app.get('/ideas', (req, res) => {
	Idea.find({})
		.sort({date:'desc'})
		.then(ideas => {
			res.render('ideas/index',{
				ideas:ideas
			})
		})
});

app.post('/ideas', (req, res) => {
	let errors = [];
	if (!req.body.title){
		errors.push({text: 'The title must be defined'});
	}
	if (!req.body.details){
		errors.push({text: 'Please add some details'});
	}
	if (errors.length > 0){
		res.render('ideas/add',{
			errors: errors,
			title: req.body.title,
			details: req.body.details
		})
	} else {
		const newUser = {
			title: req.body.title,
			details: req.body.details
		};
		new Idea(newUser)
			.save()
			.then(idea => {
				res.redirect('/ideas');
			})
	}
});

app.get('/ideas/edit/:id', (req, res) => {
	Idea.findOne({
		_id: req.params.id
	})
		.then(idea => {
			res.render('ideas/edit', {
				idea: idea
			});
		});

});

app.get('/ideas/add', (req, res) => {
	res.render('ideas/add');
});

app.listen(port, () => {
  console.log(`The app started on ${port}`);
});
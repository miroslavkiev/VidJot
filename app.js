const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
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

app.listen(port, () => {
  console.log(`The app started on ${port}`);
});
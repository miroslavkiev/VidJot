const express = require('express');
const exphbs  = require('express-handlebars');
const app = express();

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
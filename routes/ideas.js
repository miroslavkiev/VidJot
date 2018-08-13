const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');

// Load idea model
require('../models/Idea');
const Idea = mongoose.model('ideas');

// GET all ideas
router.get('/', ensureAuthenticated, (req, res) => {
	Idea.find({user: req.user.id})
		.sort({date: 'desc'})
		.then(ideas => {
			res.render('ideas/index', {
				ideas: ideas
			})
		})
});

// GET Add idea page
router.get('/add', ensureAuthenticated, (req, res) => {
	res.render('ideas/add');
});

// POST new idea
router.post('/', ensureAuthenticated, (req, res) => {
	let errors = [];
	if (!req.body.title) {
		errors.push({text: 'The title must be defined'});
	}
	if (!req.body.details) {
		errors.push({text: 'Please add some details'});
	}
	if (errors.length > 0) {
		res.render('ideas/add', {
			errors: errors,
			title: req.body.title,
			details: req.body.details
		})
	} else {
		const newIdea = {
			title: req.body.title,
			details: req.body.details,
			user: req.user.id
		};
		new Idea(newIdea)
			.save()
			.then(idea => {
				req.flash('success_msg','The idea was successfully added!');
				res.redirect('/ideas');
			})
	}
});

// GET Edit idea page
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
	Idea.findOne({
		_id: req.params.id
	})
		.then(idea => {
			if(idea.user !== req.user.id){
				req.flash('error_msg', 'You have no rights to edit this idea!');
				res.redirect('/ideas');
			} else {
				res.render('ideas/edit', {
					idea: idea
				});
			}
		})
		.catch(err => {
		console.log(err);
		throw err;
	})
});

// PUT idea
router.put('/:id', ensureAuthenticated, (req, res) => {
	Idea.findOneAndUpdate({
		_id: req.params.id,
		user: req.user.id
	}, {
		title: req.body.title,
		details: req.body.details
	})
		.then(idea => {
			if(!idea){
				req.flash('error_msg','The idea was not found or you have no access to it!');
				res.redirect('/ideas');
			} else {
			req.flash('success_msg','The idea was successfully updated!');
			res.redirect('/ideas');
			}
		})
		.catch(err => {
			console.log(err);
			return;
		})
});

// DELETE idea
router.delete('/:id', ensureAuthenticated, (req, res) => {
	Idea.deleteOne({
		_id: req.params.id,
		user: req.user.id
	})
		.then(() => {
			req.flash('success_msg','The idea was successfully deleted!');
			res.redirect('/ideas');
		})
		.catch(err => {
			console.log(err);
			return;
		})
});

module.exports = router;
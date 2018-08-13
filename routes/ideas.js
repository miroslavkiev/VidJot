const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Load idea model
require('../models/Idea');
const Idea = mongoose.model('ideas');

// GET all ideas
router.get('/', (req, res) => {
	Idea.find({})
		.sort({date: 'desc'})
		.then(ideas => {
			res.render('ideas/index', {
				ideas: ideas
			})
		})
});

// GET Add idea page
router.get('/add',(req, res) => {
	res.render('ideas/add');
});

// POST new idea
router.post('/', (req, res) => {
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
			details: req.body.details
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
router.get('/edit/:id', (req, res) => {
	Idea.findOne({
		_id: req.params.id
	})
		.then(idea => {
			res.render('ideas/edit', {
				idea: idea
			});
		});
});

// PUT idea
router.put('/:id', (req, res) => {
	Idea.findByIdAndUpdate(req.params.id, {
		title: req.body.title,
		details: req.body.details
	})
		.then(idea => {
			req.flash('success_msg','The idea was successfully updated!');
			res.redirect('/ideas');
		})
});

// DELETE idea
router.delete('/:id', (req, res) => {
	Idea.remove({_id: req.params.id})
		.then(() => {
			req.flash('success_msg','The idea was successfully deleted!');
			res.redirect('/ideas');
		})
});

module.exports = router;
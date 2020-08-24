//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true});

const articlesSchema = new mongoose.Schema({
	title: String,
	content: String
});

const Article = mongoose.model("Article", articlesSchema);

app.route('articles')
	.get(function (req, res) {
		Article.find({}, function (err, allArticles) {
			if (!err) {
				res.send(allArticles);
			} else {
				res.send(err);
			}
		});
	})
	.post(function (req, res) {
		const newArticle = new Article ({
			title: req.body.title,
			content: req.body.content
		});

		newArticle.save(function (err) {
			if (!err) {
				res.send("Successfully added a new article " + req.body.title);
			} else {
				res.send(err);
			}
		});
	})
	.delete (function (req, res) {
		Article.deleteMany({}, function (err) {
			if (!err) {
				res.send("Successfully deleted all articles")
			} else {
				res.send(err);
			}
		});
	});




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
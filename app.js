const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true, useUnifiedTopology: true });

const articleSchema = new mongoose.Schema({
    title: String,
    body: String
});

const Article = mongoose.model("Article", articleSchema);

// HTTP verbs for /articles route : GET, POST, DELETE

app.route("/articles")
    .get(function(req, res) {
        Article.find({}, [], function(err, foundArticles) {
            if(err) {
                res.send(err);
            } else {
                res.send(foundArticles);
            }
        });
    })
    
    .post(function(req, res) {
        console.log(req.body);
        const newArticle = new Article(req.body);
        newArticle.save(function(err) {
            if(err) {
                res.send(err);
            } else {
                res.send("Successfully inserted a new article.");
            }
        });
    })

    .delete(function(req, res) {
        Article.deleteMany({}, function(err) {
            if(err) {
                res.send(err);
            } else {
                res.send("Successfully deleted all the articles.");
            }
        });
    });

// HTTP verbs for /articles/specificArticles route : GET, PUT, PATCH, DELETE

app.route("/articles/:articleId")
    .get(function(req, res) {
        Article.findOne({_id: req.params.articleId}, [], function(err, foundArticle) {
            if(err) {
                res.send(err);
            } else {
                res.send(foundArticle);
            }
        });
    })
    
    .put(function(req, res) {
        Article.replaceOne(
            {_id: req.params.articleId },
            req.body,
            function(err, replaceOpResult) {
                if(err) {
                    res.send(err);
                } else {
                    res.send(replaceOpResult);
                }
            }
        )
    })

    .patch(function(req, res) {
        Article.updateOne(
            { _id: req.params.articleId },
            { $set: req.body },
            function(err, updateOpResult) {
                if(err) {
                    res.send(err);
                } else {
                    res.send(updateOpResult);
                }
            }
        );
    })

    .delete(function(req, res) {
        Article.deleteOne({ _id: req.params.articleId }, function(err) {
            if(err) {
                res.send(err);
            } else {
                res.send("Successfully deleted the article.");
            }
        })
    })

app.listen(3000, function() {
    console.log("Server is up & running on port 3000.");
});
// Dependencies
var express = require("express");
var path = require("path");
//var mongojs = require("mongojs");
var mongoose = require("mongoose");
var logger = require("morgan");

// Scraping Tools
var axios = require("axios");
var cheerio = require("cheerio");

// Initialize Express App
var app = express();

// Set app up with Morgan
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Database Config
var db = require("./models");
//var databaseUrl = "skyscraper";
//var collections = ["scrapedData", "savedArticles", "comments"];

//var db = mongojs(databaseUrl, collections);

// Mongo DB Connection
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/skyscraper";
mongoose.connect(MONGODB_URI);
//mongoose.connect("mongodb://localhost/skyscraper", { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);
mongoose.set('debug', true);

/*
db.on("error", function (error) {
    console.log("Database Error:", error);
});
*/

// Routes

// HTML Route for index.html
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

// HTML Route for article.html
app.get("/saved-articles", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/article.html"));
});

// Route to 'GET' all documents in the 'scrapedData' collection in MongoDB
app.get("/articles", function (req, res) {
    db.Article.find({}, function (err, found) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.json(found);
        }
    });
});

// Route to scrape sky.com and 'GET' all top stories' titles and links
app.get("/scrape", function (req, res) {
    axios.get("https://news.sky.com/").then(function (response) {

        var $ = cheerio.load(response.data);

        // Loop through each element with the class 'sdc-site-tile__headline' to get their titles and links
        $(".sdc-site-tile__headline-text").each(function (i, element) {

            var result = {};

            result.title = $(this).text();
            result.link = $(this).parent("a").attr("href");

            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                }).catch(function (err) {
                    console.log(err);
                });


            // Insert these titles and links as documents in the 'scrapedData' collection in MongoDB
            /*if (title && link) {
                db.scrapedData.insert({
                    title: title,
                    link: `https://news.sky.com${link}`,
                    saved: false
                },
                    function (err, inserted) {
                        if (err) {
                            console.log(err);
                            res.send(err);
                        } else {
                            console.log(inserted);
                        }
                    });
            };*/
        });
    });
    res.send("scrape complete");
});

// Route to 'GET' headline by ID
app.get("/articles/:id", function (req, res) {
    db.Article.find({ _id: req.params.id }, function (err, found) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.json(found);
            console.log(found);
        }
    });
});

// Route to findOne headline by ID and populate with its comments
app.get("/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
        .populate("comment")
        .then(function (dbArticle) {
            res.json(dbArticle)
        })
        .catch(function (err) {
            res.json(err);
        });
});

// Clear the 'scrapedData' collection from mongoDB
app.get("/clear-articles", function (req, res) {
    db.Article.remove({}, function (error, response) {
        if (error) {
            console.log(error);
            res.send(error);
        }
        else {
            console.log(response);
            res.send(response);
        }
    });
});

// Route to 'GET' all savedArticles documents in mongoDB
app.get("/saved", function (req, res) {
    //const saved = req.query.saved;

    db.Article.find({ saved: { $exists: true } }, function (err, saved) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.json(saved);
        }
    });
});

// Route to update / 'POST' by id to change document's saved value from false to true
app.put("/articles/saved/:id", function (req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { saved : "true" } ).catch(err => console.log(err));
    console.log("you did it!");
    console.log(res);
    /*db.Article.create(req.body)
        .then(function (dbArticle) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { $set : {saved : true } })
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        })*/
});

// Route for saving/updating an Article's associated Comments
app.post("/articles/comments/:id", function (req, res) {
    db.Comment.create(req.body)
        .then(function (dbComment) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true })
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        })
})

// Listen on port 3000
app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });

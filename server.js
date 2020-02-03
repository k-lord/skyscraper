// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var axios = require("axios");
var cheerio = require("cheerio");
var logger = require("morgan");

// Initialize Express App
var app = express();

// Set app up with Morgan
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Database Config
var databaseUrl = "skyscraper";
var collections = ["scrapedData"];

var db = mongojs(databaseUrl, collections);

db.on("error", function (error) {
    console.log("Database Error:", error);
});

// Routes

// Route to 'GET' all documents in the 'scrapedData' collection in MongoDB
app.get("/all", function (req, res) {
    db.scrapedData.find({}, function (err, data) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.json(data);
        }
    });
});

// Route to scrape sky.com and 'GET' all top stories' titles and links
app.get("/scrape", function (req, res) {
    axios.get("https://news.sky.com/").then(function (response) {

        var $ = cheerio.load(response.data);

        // Loop through each element with the class 'sdc-site-tile__headline' to get their titles and links
        $(".sdc-site-tile__headline").each(function (i, element) {
            var title = $(element).find("span").text();
            var link = $(element).find("a").attr("href");


            // Insert these titles and links as documents in the 'scrapedData' collection in MongoDB
            if (title && link) {
                db.scrapedData.insert({
                    title: title,
                    link: `https://news.sky.com${link}`
                },
                    function (err, inserted) {
                        if (err) {
                            console.log(err);
                            res.send(err);
                        } else {
                            console.log(inserted);
                        }
                    });
            };
        });
    });
    res.send("scrape complete");
});

// Route to 'GET' headline by ID
app.get("/find-news/:id", function (req, res) {
    db.scrapedData.find({ _id: req.params.id }, function (err, found) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.json(found);
        }
    });
});



// Clear the 'scrapedData' collection from mongoDB
app.get("/clear-news", function (req, res) {
    db.scrapedData.remove({}, function (error, response) {
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

// Listen on port 3000
app.listen(3000, function () {
    console.log("App running on port 3000!");
});

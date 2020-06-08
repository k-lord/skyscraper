//import { Timestamp } from "bson";

$(document).ready(function () {

    // Display all of the scraped articles in container div
    getArticles();
    // getSaved();

    $("#scrape-button").on('click', function (e) {
        // clear();
        scrape();
        location.reload(true);
    })

    // On-Click event to update document's saved value to true
    $(document).on('click', 'button[data-id]', function (e) {
        var savedId = $(this).attr('data-id');
        console.log("button's id: " + savedId);
        $(this).text("Saved");
        $(this).attr('data-saved', true);

        // Ajax call to update article by id to 'saved: true'
        $.ajax({
            type: "PUT",
            url: "/articles/save/" + savedId,
            // On successful call
            success: function (data) {
                console.log("you saved an article!");
            }
        });
    });
});

// Function for displaying documents from scrapedData collection onto index.html
function displayScrapeResults(data) {
    // Clear the container
    $("#headline-container").empty();

    // Loop through all articles scraped from Sky News and for each article create a card and append to index.html
    for (var i = 0; i < data.length; i++) {

        var card = $("<div>").addClass("card")
        var cardBody = $("<div>").addClass("card-body headline-body");
        var buttonText = "Save Article";

        if (data[i].saved === true) {
            buttonText = "Saved";
        } else {
            buttonText = "Save Article"
        }

        card.append(cardBody);
        cardBody.append(
            $("<a>").addClass("title").attr("href", `https://news.sky.com${data[i].link}`).text(data[i].title),
            $("<button>").addClass("btn btn-light save")
                .attr("type", "button")
                .text(buttonText)
                .attr("id", "button-" + data[i]._id)
                .attr("data-id", data[i]._id)
                .attr("data-saved", data[i].saved)
        );

        $("#headline-container").append(card);

        // var buttonId = $("#button-" + data[i]._id);

        // checkSaved(buttonId);

    };
};

function clear() {
    $.ajax({
        type: "GET",
        url: "/clear-articles",
        // On successful call
        success: function (response) {
            console.log(response)
        }
    });
};

function scrape() {
    $.ajax({
        type: "GET",
        url: "/scrape",
        // On successful call
        success: function (response) {
            console.log(response)
        }
    });
};

function getArticles() {
    $.getJSON("/articles", function (data) {
        displayScrapeResults(data);
    });
};

// function checkSaved(buttonId) {
//     if ($("#" + buttonId).attr("data-saved", true)) {
//         $("#" + buttonId).text("Saved");
//     } else {
//         $("#" + buttonId).text("Save Article");
//     };
// };

$(document).ready(function () {

    // Display all of the scraped articles in container div
    getArticles();
    getSaved();

    // On-Click event to update document's saved value to true
    $(document).on('click', 'button[data-id]', function (e) {
        var savedId = $(this).attr('data-id');
        console.log("button's id: " + savedId);


        // Ajax call to update article by id to 'saved: true'
        $.ajax({
            type: "PUT",
            url: "/articles/saved/" + savedId,
            // On successful call
            success: function (data) {
                console.log("you saved an article!")
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
        var cardbody = $("<div>").addClass("card-body headline-body");

        card.append(cardbody);
        cardbody.append(
            $("<a>").addClass("title").attr("href", `https://news.sky.com${data[i].link}`).text(data[i].title),
            $("<button>").addClass("btn btn-light save")
                .attr("type", "button")
                .text("Save Article")
                .attr("data-id", data[i]._id)
        );

        $("#headline-container").append(card);
    };
};

function displaySaved(data) {

    // Clear the container
    $("#saved-container").empty();


    for (var i = 0; i < data.length; i++) {

        var card = $("<div>").addClass("card")
        var cardbody = $("<div>").addClass("card-body saved-body");

        card.append(cardbody);
        cardbody.append(
            $("<a>").addClass("title").attr("href", `https://news.sky.com${data[i].link}`).text(data[i].title),
            $("<button>").addClass("btn btn-light add-comment")
                .attr("type", "button")
                .text("Add Comment")
                .attr("data-id", data[i]._id),
            $("<button>").addClass("btn btn-light view-comment")
                .attr("type", "button")
                .text("View Comments")
                .attr("data-id", data[i]._id),
            $("<button>").addClass("btn btn-light remove-comment")
                .attr("type", "button")
                .text("Clear Article")
                .attr("data-id", data[i]._id)
        );

        $("#saved-container").append(card);
    };
};

function getArticles() {
    $.getJSON("/articles", function (data) {
        displayScrapeResults(data);
    });
};

function getSaved() {
    $.getJSON("/saved", function (data) {
        displaySaved(data);
    });


};



// On click event for add comments creates bootstrap modal pop up with comment form and update scrapedData collection with new comment obj

// On click event for view comments that toggles accordian div underneath card header as card body



$(document).ready(function () {

    // Display all of the scraped articles in container div
    getArticles();
    //getSaved();

    // On-Click event to update document's saved value to true
    $(document).on('click', 'button[data-id]', function (e) {
        var savedId = $(this).attr('data-id');
        console.log("button's id: " + savedId);

        $.ajax({
            type: "POST",
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
    }

};







function displaySaved(savedArticles) {




    // Add append div code right here :)
    // Append Add Comments button and View Comments button
};

function getArticles() {
    $.getJSON("/articles", function (data) {
        displayScrapeResults(data);
    });
};

function getSaved() {
    $.getJSON("/articles/saved", function (data) {
        displaySaved(data);
    });
};



// On click event for add comments creates bootstrap modal pop up with comment form and update scrapedData collection with new comment obj

// On click event for view comments that toggles accordian div underneath card header as card body



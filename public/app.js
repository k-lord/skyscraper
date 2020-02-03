$(document).ready(function () {

    // Display all of the scraped articles in container div
    $.getJSON("/all", function (data) {
        displayScrapeResults(data);
    });

    // On-Click event to insert article data as documents into savedArticle collection when user clicks 'Save Article' button
    $(document).on('click', 'button[data-id]', function (e) {
        var savedId = $(this).attr('data-id');
        console.log("button's id: " + savedId);

        // 'GET' document data from scrapedData by ID

        $.ajax({
            type: "GET",
            url: "/find-news/" + savedId,
            success: function (data) {
                // Once you 'GET' data by ID, 'POST' article information to 'savedArticles' collection in MongoDB
                console.log(data);
                $.ajax({
                    type: "POST",
                    url: "/save",
                    data: {
                        dataType: JSON,
                        data: {
                            title: data.title,
                            link: data.link,
                        }
                    }
                })
            }
        });

    });

});


// Function for displaying documents from scrapedData collection onto index.html
function displayScrapeResults(scrapedData) {
    // Clear the container
    $("#headline-container").empty();

    // Loop through each document in the scrapedData collection and append as cards onto index.html
    scrapedData.forEach(function (headline) {

        var cardId = 1;
        var card = $("<div>").addClass("card").attr("id", "card-" + cardId);
        var cardbody = $("<div>").addClass("card-body headline-body").attr("id", "card_body-" + cardId);

        card.append(cardbody);
        cardbody.append(
            $("<a>").addClass("title").attr("href", headline.link).text(headline.title),
            $("<button>").addClass("btn btn-light save")
                .attr("type", "button")
                .attr("id", "button" + cardId)
                .text("Save Article")
                .attr("data-id", headline._id)
        );

        $("#headline-container").append(card);
        cardId++;
    });
};



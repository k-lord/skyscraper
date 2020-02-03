// Function for displaying documents from scrapedData collection onto index.html

function displayResults(scrapedData) {
    // Clear the container
    $("#headline-container").empty();

    scrapedData.forEach(function (headline) {

        var cardId = 1;
        var card = $("<div>").addClass("card").attr("id", "card-" + cardId);
        var cardbody = $("<div>").addClass("card-body headline-body").attr("id", "card_body-" + cardId);

        card.append(cardbody);
        cardbody.append(
            $("<a>").addClass("title").attr("href", headline.link).text(headline.title),
            $("<button>").addClass("btn btn-light save")
            .attr("type", "button")
            .attr("id", "button-cardId")
            .text("Save Article")
        );

        $("#headline-container").append(card);
        cardId++;
    });

    //console.log(scrapedData);

};

// Display all of the scraped articles in container div
$.getJSON("/all", function(data) {
    displayResults(data);
  });
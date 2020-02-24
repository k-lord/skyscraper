//import { Timestamp } from "bson";

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
        var cardBody = $("<div>").addClass("card-body headline-body");

        card.append(cardBody);
        cardBody.append(
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

        $("#modal-" + data[i]._id).modal();

        // assigning variables for HTML collapsing div elements for toggling the viewing of comments
        var accordion = $("<div>").addClass("accordion").attr("id", "accordion-" + data[i]._id);
        var collapseDiv = $("<div>")
            .addClass("collapse")
            .attr("id", "collapse-" + data[i]._id)
            .attr("aria-labelledby", "heading-" + data[i]._id)
            .attr("data-parent", "#accordion-"+data[i]._id)

        // assigning variables for HTML cards
        var card = $("<div>").addClass("card")
        var cardHeader = $("<div>").addClass("card-header").attr("id", "heading-" + data[i]._id);
        var cardBody = $("<div>").addClass("card-body saved-body");

        // assigning variables for bootstrap modal form to add new comment
        var modal = $("<div>")
            .addClass("modal")
            .attr("id", "modal-" + data[i]._id)
            .attr("tabindex", "-1")
            .attr("role", "dialog")
            .attr("aria-labelledby", "modalLabel-" + data[i]._id)
            .attr("aria-hidden", "true");
        var modalDialogue = $("<div>")
            .addClass("modal-dialog")
            .attr("role", "document");
        var modalContent = $("<div>")
            .addClass("modal-content");
        var modalHeader = $("<div>")
            .addClass("modal-header")
        var modalTitle = $("<h5>")
            .addClass("modal-title")
            .attr("modalLabel-" + data[i]._id)
        var modalCloseButton = $("<button>")
            .addClass("close")
            .attr("type", "button")
            .attr("data-dismiss", "modal")
            .attr("aria-label", "Close")
            .append("<span aria-hidden='true'>&times;</span>")
        var modalBody = $("<div>")
            .addClass("modal-body")

        // appending saved article cards 
        accordion.append(card);
        card.append(cardHeader);
        cardHeader.append(
            $("<a>").addClass("title").attr("href", `https://news.sky.com${data[i].link}`).text(data[i].title),
            $("<button>").addClass("btn btn-light option-btn add-comment")
                .attr("type", "button")
                .attr("data-toggle", "modal")
                .attr("data-target", "modal-" + data[i]._id)
                .text("Add Comment")
                .attr("data-id", data[i]._id),
            $("<button>").addClass("btn btn-light btn option-btn view-comment")
                .attr("type", "button")
                .text("View Comments")
                .attr("data-id", data[i]._id)
                .attr("data-toggle", "collapse")
                .attr("data-target", "#collapse-" + data[i]._id)
                .attr("aria-expanded", "true")
                .attr("aria-controls", "collapse-" + data[i]._id),
            $("<button>").addClass("btn btn-light option-btn remove-comment")
                .attr("type", "button")
                .text("Clear Article")
                .attr("data-id", data[i]._id)
        );
        accordion.append(collapseDiv);
        collapseDiv.append(cardBody);
        cardBody.append($("<div>").text("comments go here"));


        $("#saved-container").append(accordion);

        
        modal.append(modalDialogue);
        modalDialogue.append(modalContent);
        modalContent.append(modalHeader, modalBody);
        modalHeader.append(modalTitle, modalCloseButton);
        modalBody.text("This is a modal pop up");

        $("#saved-container").append(modal);
        /*
        modalBody.append($("<form>"));
        $("<form>").append("<div class='form-row'>");
        $(".form-row").append("<div class='col'>");
        $(".col").append("<input type='text' class='form-control' placeholder='Name'>");
        */    

    


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



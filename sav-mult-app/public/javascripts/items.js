$(document).ready(function() {

  // handler for the PLUS or MINUS icon on each table row
  // for expanding or contracting content
  $('.glyphicon-plus-sign').on('click', function() {
    var item_id = $(this)[0].id;
    $('.showOrHide_' + item_id).toggle();
    if ($(this).hasClass("glyphicon-plus-sign")) {
      $(this).removeClass("glyphicon-plus-sign").addClass("glyphicon-minus-sign");
    }
    else {
      $(this).removeClass("glyphicon-minus-sign").addClass("glyphicon-plus-sign");
    }
  });

  // handler for clicking the Remove button
  $('.remove-btn').on('click', function() {
    var item_id = $(this)[0].id;
    $('#book_' + item_id).remove();

    $.ajax({
      url: '/auction',
      method: 'DELETE',
      data: {
        item_id: item_id
      },
      success: function(response) {
        console.log("returned from ajax DELETE");
      }
    });
  });

  // handler for clicking the Edit button
  $('.edit-btn').on('click', function() {
    var item_id = $(this)[0].id;
    window.location.href = '/auction/' + item_id;
  });

  function getISBNData(isbn) {
    var config = {};
    config.key = "2ORGC85I";
    // $.ajax({
    //   url: "../config.json",
    //   dataType: "json",
    //   success: function(config) {

        $.ajax({
          // tried to use the following variable, stored in ~/.bash_profile
          // doesn't work since this code is not executed by node
          // set heroku config:set ISBNDB_API_KEY=
          // url: "http://isbndb.com/api/v2/json/" + process.env.ISBNDB_API_KEY + "/book/" + isbn,

          url: "http://isbndb.com/api/v2/json/" + config.key + "/book/" + isbn,
          dataType: "json",
          success: function(data) {
            console.log("success getting ISBN data");
            var bookData = data.data[0];

            $('#bookTitle').val(bookData.title);
            $('#bookAuthor').val(bookData.author_data[0].name);
            $('#bookPublisher').val(bookData.publisher_name);
            $('#bookDDC').val(bookData.dewey_decimal);

          }
        });

        
    //   }
    // });


   }

  // ISBN button click listener
  $('#isbnButton').on('click', function() {
    var isbn = $('#bookISBN').val();
    getISBNData(isbn);
  });

});

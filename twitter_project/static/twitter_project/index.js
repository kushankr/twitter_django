$(function () {

  $('form').submit(function( event ) {
    var csrfToken, inputURL;

    // Get value of URL entered in Textbox
  	inputURL = $('#id_input_url').val();
  	inputURL = $.trim(inputURL);

    // Stop form from submitting through sync POST
    event.preventDefault();

    // Source: http://stackoverflow.com/questions/15005500/loading-cross-domain-html-page-with-ajax
    // To enable cross domain access
    $.ajaxPrefilter( function (options) {
      if (options.crossDomain && jQuery.support.cors) {
        var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
        options.url = http + '//cors-anywhere.herokuapp.com/' + options.url;
      }
    });

    // Make an AJAX call
	  $.ajax({
      method: 'POST',
      url: '/twitter_project/',
      data:  $('form').serialize(),
      success: function (data) {
        // If form is valid, data is sent as a JSON object
        if(typeof data =='object') {
          // remove any errors on successful validation
          $('div.form-group').attr('class','form-group');
          $('label').remove();
          
          // Shorthand for AJAX get call
          $.get(
              data['input_url'],
              function (response) {
                  //console.log(response);
          });
        }
        else {
          $('body').html(data);
        }
      },
      error: function (data) {
      }
    });
  });
});
$(function () {

  var processResponse;

  processResponse = function (data, twitterFlag) {
    var  $data, $anchors, arrLinks, urlPattern, twitterHandles, linkString;
    var $data= $(data);
    $anchors = $data.find('a');
    arrLinks = [];
    if (twitterFlag) {
      urlPattern = new RegExp('^/','i');
    }
    else {
      urlPattern = new RegExp('^(http|https)://twitter.com/','i');
    }
    $anchors.each(function () {        
      linkString = $(this).attr('href');
        if (urlPattern.test(linkString)) {
          arrLinks.push($(this).text());
          arrLinks.push($(this).parent().text());
      }
    });
    twitterHandles = {};
    $.each(arrLinks, function (i, val) {
      linkString = $.trim(val);
      match = linkString.match(/@\w+/g);
      if (match) {
        for (var i in match) {
          if (typeof twitterHandles[match[i]] == 'undefined') {
            twitterHandles[match[i]] = '0';
          }
        }
      }          
    });
    return Object.keys(twitterHandles);
  };

  $('form').submit(function( event ) {
    var csrfToken, inputURL;

    $('#twitter_handles_textarea').hide();

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
                var twitterHandles, urlPattern, isTwitter;
                urlPattern = new RegExp('^(http|https)://twitter.com/','i');
                if (urlPattern.test(data['input_url'])) {
                  isTwitter = true;
                }
                else {
                  isTwitter = false;
                }
                twitterHandles = processResponse(response, isTwitter);
                $('#twitter_handles_textarea').val(twitterHandles.join('\n'));
                $('#twitter_handles_textarea').show();
          });
        }
        else {
          $('#twitter_handles_textarea').hide();
          $('body').html(data);
        }
      },
      error: function (data) {
      }
    });
  });
});
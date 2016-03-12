$(function () {

  var processResponse, getTwitterHandles,

  // This function matches '@...' 
  // in link text and link parent text
  getTwitterHandles = function (linkTextString, twitterHandles) {
    var twitterHandlePattern;

    linkTextString = $.trim(linkTextString);
    twitterHandlePattern = linkTextString.match(/@\w+/g);
    
    if (twitterHandlePattern) {
      for (var i in twitterHandlePattern) {
        if (typeof twitterHandles[twitterHandlePattern[i]] == 'undefined') {
          twitterHandles[twitterHandlePattern[i]] = '0';
        }
      }
    }
    return twitterHandles;
  };

  // This function returns all Twitter Handles
  // present in a web page.
  processResponse = function (data, twitterFlag) {
    var anchors, twitterUrlPattern, twitterHandles, linkString;
    
    // Find all links that start with
    // 'http:// or https:// twitter.com'
    // process Link text and Link parent text
    anchors = $(data).find('a');
    if (twitterFlag) {
      twitterUrlPattern= new RegExp('^/','i');
    }
    else {
      twitterUrlPattern = new RegExp('^(http|https)://twitter.com/','i');
    }

    twitterHandles = {};    
    anchors.each(function () {            
      linkString = $(this).attr('href');      
      if (twitterUrlPattern.test(linkString)) {
        twitterHandles = getTwitterHandles($(this).text(), twitterHandles);
        twitterHandles = getTwitterHandles($(this).parent().text(), twitterHandles);
      }
    });
    return Object.keys(twitterHandles);
  };

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
    
    // Make an AJAX Post call on form submission
    $.ajax({
      method: 'POST',
      url: '/twitter_project/',
      data:  $('form').serialize(),
      success: function (data) {
        // If form is valid, 
        // data is sent as a JSON object
        if(typeof data =='object') {
          // remove any errors 
          // on successful validation
          $('div.form-group').attr('class','form-group');
          $('label').remove();
          
          // Make an AJAX get call to URL
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
              // Show and populate text area
              // with Twitter Handles
              $('#twitter_handles_textarea').val(twitterHandles.join('\n'));
              $('#twitter_handles_textarea').show();
          });
        }
        // If form is invalid
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

$(function () {

  var processResponse, getTwitterHandles;

  var divFormGroup, divAlert, divTextArea;

  // Storing reference of divs to prevent repeat iteration of DOM
  divFormGroup = $('div.form-group');
  divAlert = $('div.alert');
  divTextArea = $('#div_textarea');

  // This function matches '@...' 
  // in link text and link parent text
  getTwitterHandles = function (linkTextString, twitterHandles, twitterHandlesString) {
    var twitterHandlePattern;

    linkTextString = $.trim(linkTextString);
    twitterHandlePattern = linkTextString.match(/@\w+/g);
    
    if (twitterHandlePattern) {
      for (var i in twitterHandlePattern) {
        if (typeof twitterHandles[twitterHandlePattern[i]] === 'undefined') {
          twitterHandlesString += "<li class='list-group-item'>" + 
          "<a href='http://twitter.com/" + twitterHandlePattern[i].substring(1) + "' target='_blank'>" + 
          twitterHandlePattern[i] + "</a></li>";
          twitterHandles[twitterHandlePattern[i]] = '0';
        }
      }
    }
    return twitterHandles, twitterHandlesString;
  };

  // This function returns all Twitter Handles
  // present in a web page.
  processResponse = function (data, twitterFlag) {
    var anchors, twitterHandles, twitterHandlesString;

    twitterHandlesString = '';
    
    // Find all links that start with
    // 'http:// or https:// twitter.com'
    // process Link text and Link parent text
    if (twitterFlag) {
      anchors = $('a[href^="/"]', $(data));
    }
    else {
      anchors = $('a[href^="http://twitter.com"], a[href^="https://twitter.com"]', $(data));
    }

    twitterHandles = {};    
    anchors.each(function () {
      twitterHandles, twitterHandlesString = getTwitterHandles($(this).text(), twitterHandles, twitterHandlesString);
      twitterHandles, twitterHandlesString = getTwitterHandles($(this).parent().text(), twitterHandles, twitterHandlesString);
    });
    return twitterHandlesString;
  };

  $('form').submit(function (event) {

    // Stop form from submitting through sync POST
    event.preventDefault();
    
    // Show loading gif on form submit
    $('img').show();

    // Make an AJAX Post call on form submission
    $.ajax({
      method: 'POST',
      url: '/twitter_project/',
      data:  $('form').serialize(),
      success: function (data) {
        var twitterHandlesString, urlPattern, isTwitter;

        // Hide the dynamic elements once the AJAX call returns
        $('img').hide();
        divTextArea.hide();
        divAlert.hide();

        // If form is valid, 
        // data is sent as a JSON object
        if (typeof data === 'object') {
          // remove any errors 
          // on successful validation
          divFormGroup.attr('class','form-group');
          $('label').remove();

          // if form has no errors, parse the HTML
          if (typeof data['error'] === 'undefined') {           
            urlPattern = new RegExp('^(http|https)://twitter.com/','i');
            if (urlPattern.test(data['input_url'])) {
              isTwitter = true;
            }
            else {
              isTwitter = false;
            }
            // Extract twitter handles (hyperlinks)
            twitterHandlesString = processResponse(data['html'], isTwitter);
            // If no twitter handles are present
            // Display an alert box       
            if (twitterHandlesString.length === 0) {
              divAlert.text('No Twitter Handles Found!').show();
            }
            // Show and populate text area
            // with Twitter Handles
            else {
              $('#twitter_handles_ul').empty().append(twitterHandlesString);
              divTextArea.show();
            }
          }
          // If get request does not succeed, show an error message
          else {
            divAlert.text(data['error']).show();
          }
        }
        // If form is invalid
        else {
          divFormGroup.attr('class', 'form-group has-error').html($('div.form-group', $(data)).html());          
        }
      }
    });
  });
  
  $('#clear_text').on('click', function() {
    // Hide Textarea, Alert Box, and Loading Image
    $('img').hide();
    divTextArea.hide();
    divAlert.hide();
    // Set value of input field as empty
    $('#id_input_url').val('');
    // Remove any existing error messages
    divFormGroup.attr('class','form-group');
    $('label').remove();
  });

});

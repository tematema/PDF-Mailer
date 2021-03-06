(function() {
  /**
   * PDF-Mailer namespace
   * @namespace
   */
  var pdfmailer = {};


  /**
   * Unique user ID
   * @type {string}
   */
  pdfmailer.UNIQUE_ID = '1c711fe53cd08eea5055337c8f9278b7';


  /**
   * View namespace
   * @namespace
   */
  var view = {};


  /**
   * Application DIV
   * @type {string}
   */
  view.DIVAPP = 'pdf_div';


  /**
   * Base DIV to attach
   * @type {string}
   */
  view.DIVBASE = 'bottom_div';


  /**
   * Fade-out message
   * @type {string}
   */
  view.DIVMESSAGE = 'pdf_message';


  /**
   * Add elements to DOM and subscribe to events
   */
  view.create = function() {
    var block = '<div class="' + view.DIVAPP + '">' +
        '<input class="pdf_email" type="text"/>' +
        '<input type="button" class="pdf_button" value="Click Me!">' +
        '</div>';

    $('.' + view.DIVBASE).append(block);
    $('.pdf_button').click(pdfmailer.run);
  };


  /**
   * Show invalid email message
   */
  view.showInvalidEmail = function(message) {
    var html = '<p class="' + view.DIVMESSAGE + '">' + message + '</p>';
    var appNode = '.' + view.DIVAPP;
    var messageNode = appNode + ' .' + view.DIVMESSAGE;

    $(appNode).append(html);
    $(messageNode).fadeOut(3000, function() {
      $(this).remove();
    });
  };


  /**
   * Remove PDF UI from DOM
   */
  view.destroy = function(message) {
    var html = '<p>' + message + '</p>';
    $('.' + view.DIVAPP).html(html);
  };


  /**
   * Filter script tags
   *
   * @param {!object} html
   * @return {string}
   */
  pdfmailer.filter = function(html) {
    html.find('script').remove();
    html.find(':button').remove();
    html.find(':input').remove();
    return html.html();
  };


  /**
   * Validate email
   * @param {!string} email
   * @return {boolean}
   */
  pdfmailer.isValidEmail = function(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
  };


  /**
   * Access point
   */
  pdfmailer.run = function() {
    var bodyNode = $('body').clone();
    var bodyHTML = pdfmailer.filter(bodyNode);
    console.log(bodyHTML);

    var email = $('.pdf_email').val();
    console.log('email:', email);

    if (!pdfmailer.isValidEmail(email)) {
      var message = 'Invalid email';
      view.showInvalidEmail(message);
      console.log(message);
      return;
    }


    /**
     * Handle XHR response
     * @param {Object} data
     * @param {string} status
     */
    function responseHandler(data, status) {
      if (status === 'success') {
        console.log(data);
        view.destroy(data.message);
      } else {
        console.log('Request failed.');
      }
    }


    /**
     * Hack Accept headers for CORS to avoid OPTIONS request
     * @param {!string} token
     * @param {!string} email
     * @return {string}
     */
    function createHeader(token, email) {
      return btoa('token:' + token + ';' + 'email:' + email);
    }


    /**
     * PDF-Mailer server URL
     * @type {string}
     */
    var url = 'http://localhost:1337/';

    $.ajax({
      url: url,
      type: 'POST',
      beforeSend: function(xhr) {
        var header = createHeader(pdfmailer.UNIQUE_ID, email);
        xhr.setRequestHeader('Accept', header);
      },
      data: bodyHTML,
      contentType: 'application/x-www-form-urlencoded',
      success: responseHandler,
      error: responseHandler
    });
  };


  /**
   * On document ready
   */
  $('document').ready(function() {
    var baseNodeExist = !($('.' + view.DIVBASE).length === 0);

    if (baseNodeExist) {
      view.create();
    }
  });
}());

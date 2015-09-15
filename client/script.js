(function() {
  /**
   * @namespace
   */
  var pdfmailer = {};


  /**
   * @type {string}
   */
  pdfmailer.UNIQUE_ID = '1c711fe53cd08eea5055337c8f9278b7';

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
      return console.log('Invalid email');
    }

    var url = 'http://localhost:1337/';

    function responseHandler(data, status) {
      if (status === 'success') {
        console.log(data);
      } else {
        console.log('Request failed.');
      }
    }

    $.ajax({
      url: url,
      type: 'POST',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', pdfmailer.UNIQUE_ID);
        xhr.setRequestHeader('PDF-Email', email);
      },
      data: bodyHTML,
      contentType: 'application/x-www-form-urlencoded',
      success: responseHandler,
      error: responseHandler
    });
  };

  /**
   * Button handler
   */
  $('.pdf_button').click(pdfmailer.run);
}());

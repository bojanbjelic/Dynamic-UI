jQuery(function($){
  $('form').on('submit', function(e){
    e.preventDefault();
    var form = $(this);
    var values = form.serializeArray();
    var data = {};
    var method, index;
    values.forEach(function(v, i) { if (v.name === "metadata_method") { method = v.value; index = i; } });
    values.splice(index, 1);
    data.method = method;
    data.content = values.reduce(function(obj, cv) { 
      if (!cv.name.startsWith('metadata')) { 
        obj[cv.name] = cv.value;
      }
      return obj;
    }, {});
    var url = form.attr('action');
    $.ajax({
        url: url,
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify(data)
    }).done(function(data) {
        $('input:text').val('');
        (window.parent || window).postMessage(data, "*");
    }).fail(function(jqXHR, textStatus, errorThrown){
        (window.parent || window).postMessage(jqXHR.responseJSON, "*");
    });
  });

  var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
  var eventer = window[eventMethod];
  var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
  eventer(messageEvent, function(e) {
    if (e.data == 'submit')
      $('form').submit();
  }, false);
});

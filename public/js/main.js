jQuery(function($){

  /*
   * Handles keypress on each field
   */
  $('.fields').on('keyup', function(e){
    var target = $(e.target);
    // We only care about input elements
    if (!target.is('input:text'))
      return;

    var li = target.parent('li');
    var isLast = li.is(':last-child');
    var nonEmpty = $('input:text', li).filter(function(i, el){
      return $(el).val() != '';
    });

    if (nonEmpty.length > 0 && isLast){
        li.clone().appendTo('.fields').find('input:text').val('');
    }
    else if (nonEmpty.length == 0 && !isLast){
      li.remove();
    }
  });

  /*
   * Handles remove field
   */
  $('.remove').click(function(){
    $(this).parent().remove();
  });

  /*
   * Handles generate container
   */
  $('#generate').on('click', function(){
    var fields = [];
    $('.fields li').each(function(index, el){
      var name = $('.field_name', el).val();
      var label = $('.field_label', el).val();
      if (name && label){
        fields.push({ name: name, label: label });
      }
    });

    $.ajax({
      url: '/container',
      type: 'post',
      data: { fields: fields }
    }).done(function(data){
      $('.fields li:gt(0)').remove();
      $('.fields input:text').val('');

      var body = $('body');
      var url = location.origin + '/container/' + data.containerId;
      var msgBox = $(
        '<div class="msg-box">'+
          '<b>Container created!</b><br/>' +
          '<a href="' + url + '" target="blank">' + url + '</a>' +
        '</div>'
      ).appendTo(body);
      msgBox.css('left', (body.width() / 2) - (msgBox.width() / 2));
      msgBox.css('top', (body.height() / 2) - (msgBox.height() / 2));
      msgBox.css('z-index', 10);

      var bg = $('<div class="msg-box-bg"></div>');
      bg.css('c-index', 9);
      bg.appendTo(body);

      setTimeout(function(){
        msgBox.remove();
        bg.remove();
      }, 10000);
    });
  });

});

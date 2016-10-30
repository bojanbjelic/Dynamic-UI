jQuery(function($){

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

    });
  });

});

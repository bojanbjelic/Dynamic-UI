$('.preview').click(function(){
  var metadataId = $(this).data('id');
  var defaultCss = $('#defaultCss').val();
  var url = location.origin + '/metadata/' +  metadataId;

  $.ajax({
        url: url,
        type: 'get'
    }).done(function(cfg){
      console.log(cfg);
        $('textarea').val(JSON.stringify(cfg.module));
    }).fail(function(){
        alert('Metadata was not found');
    });

    $('.metadata-preview').modal('show');        
});

$('.done').click(function(){
    $('.metadata-preview').modal('hide');
});
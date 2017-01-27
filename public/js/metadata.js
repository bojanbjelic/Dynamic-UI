jQuery(function(js){
  $('.preview').click(function(){
    var metadataId = $(this).data('id');
    var defaultCss = $('#defaultCss').val();
    var url = location.origin + '/metadata/' +  metadataId;

    $.ajax({
          url: url,
          type: 'get'
      }).done(function(cfg){
        console.log(cfg);
          $('textarea').val(JSON.stringify(cfg.config));
      }).fail(function(){
          alert('Metadata was not found');
      });

      $('.metadata-preview').modal('show');        
  });

  $('.delete').click(function(){
    if (!confirm("Are you sure?"))
        return;

    var self = $(this);
    $.ajax({
        url:'/metadata/' + self.data('id'),
        type: 'delete'
      }).done(function(){
        self.parents('tr').remove();
      }).fail(function(error){
        alert('Delete failed. ' + error);
      });
  });

  $('.done').click(function(){
      $('.metadata-preview').modal('hide');
  });
});
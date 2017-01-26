jQuery(function(js){
  
    function updatePreview(){
        $('iframe').attr('src', $('#url').val() + '&preview=yes');
    }

    $('.preview').click(function(){
        var metadataId = $(this).data('id');
        var defaultCss = $('#defaultCss').val();
        var url = location.origin + '/metadata-ui/' +  metadataId + '?cssUrl=' + defaultCss;
        $('#url').val(url); 
        updatePreview();
        $('.metadata-preview').modal('show');        
    });

    $('.delete').click(function(){
        if (!confirm("Are you sure?"))
            return;

        var self = $(this);
        $.ajax({
            url:'/metadata-ui/' + self.data('id'),
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

    $('#url').change(function(){
        updatePreview();
    });
});
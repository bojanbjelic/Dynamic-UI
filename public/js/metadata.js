jQuery(function(js){
    var clipboard = new Clipboard('.copy');
    clipboard.on('success', function(e) { console.log(e); });
    clipboard.on('error', function(e) { console.log(e); });

    function updatePreview(){
        $('iframe').attr('src', $('#url').val());
    }

    $('.preview').click(function(){
        var metadataId = $(this).data('id');
        var defaultCss = $('#defaultCss').val();
        var url = location.origin + '/metadata/' +  metadataId + '?cssUrl=' + defaultCss;
        $('#url').val(url); 
        updatePreview();
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

    $('#url').change(function(){
        updatePreview();
    });
});
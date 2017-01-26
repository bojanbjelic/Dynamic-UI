jQuery(function($){
 $('.delete').click(function(){
    if (!confirm("Are you sure?"))
        return;

    var self = $(this);
    $.ajax({
        url:'/validation/' + self.data('id'),
        type: 'delete'
    }).done(function(){
        self.parents('tr').remove();
    }).fail(function(error){
        alert('Delete failed. ' + error);
    });
});
});
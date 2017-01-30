jQuery(function($){
    $('.create').click(function(){
        var data = {
            method : $('.metadata_method').val(),
            config: $('.config').val()
        };

        $.ajax({
            url: $('form').attr('action'),
            type: 'put',
            data: data
        }).done(function(){
            alert('Payment method metadata updated.');
        }).fail(function(jqXHR, textStatus, errorThrown){
            alert('Payment method metadata was not updated. \n' + jqXHR.responseText);
        });
    });
});
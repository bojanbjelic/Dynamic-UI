jQuery(function($){
    $('.create').click(function(){
        var data = {
            name : $('.metadata_name').val(),
            config: $('.config_name').val()
        };

        $.ajax({
            url: '/metadata',
            type: 'post',
            data: data
        }).done(function(){
            alert('Payment method created');
            $('input:text').val('');
        }).fail(function(jqXHR, textStatus, errorThrown){
            alert('Payment method was not created. ' + jqXHR.responseText);
        });
    });
});
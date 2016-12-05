jQuery(function($){
    $('.create').click(function(){
        var data = {
            name : $('.metadata_name').val(),
            module: $('.module_name').val()
        };

        $.ajax({
            url: '/validation',
            type: 'post',
            data: data
        }).done(function(){
            alert('Validation created');
            $('input:text').val('');
        }).fail(function(jqXHR, textStatus, errorThrown){
            alert('Validation was not created. ' + jqXHR.responseText);
        });
    });
});
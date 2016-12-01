jQuery(function($){
    $('.create').click(function(){
        var data = {
            name : $('.metadata_name').val(),
            moduleName: $('.module_name').val(),
            errorMessage: $('.error_message').val()
        };

        $.ajax({
            url: '/validation',
            type: 'post',
            data: data
        }).done(function(){
            alert('Validation created');
            $('input:text').val('');
        }).fail(function(){
            alert('Validation was not created');
        });
    });
});
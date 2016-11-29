jQuery(function($){
    $('.create').click(function(){
        var data = {
            name : $('.metadata_name').val(),
            availableInClient: $('.client_side').is(':checked'),
            scriptUrl: $('.script_url').val(),
            errorMessage: $('.error_message').val()
        };

        $.ajax({
            url: '/validation',
            type: 'post',
            data: data
        }).done(function(){
            alert('Validation created');
            fieldRows.remove().empty();
        }).fail(function(){
            alert('Validation was not created');
        });
    });
});
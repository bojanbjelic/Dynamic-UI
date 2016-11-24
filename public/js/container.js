jQuery(function($){

    if ($('.metadata option').length > 0)
        $('.preview').attr('src', '/form/' + $('.metadata option').val());

    $('.metadata').on('change', function(){
        $('.preview').attr('src', '/form/' + $('.metadata option:selected').val());
    });

    $('.create').on('click', function(){
        var data = {
            name: $('.name').val(),
            cssUrl: $('.css_url').val(),
            metadata: {
                _id: $('.metadata option:selected').val(),
                name: $('.metadata option:selected').text()
            }
        };

        $.ajax({
            url: '/container',
            type: 'post',
            data: data
        }).done(function(newContainer){
            alert('Container ' + newContainer._id + ' created!');
        }).fail(function(error){
            alert('Container create error: ' + error);
        });
    });

    function updatePreview(metadataId){
        $('.preview').attr('src', '/form/' + metadataId);
    }

    window.OnSuccess = function(token){
        alert("Success: " + token);
    };

    window.OnFailure = function(error){
        alert("Failure: " + error);
    };
});
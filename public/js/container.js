jQuery(function($){

    if ($('.metadata option').length > 0)
        updatePreview();

    $('.metadata').on('change', function(){
        updatePreview();
    });

    $('.css_url').on('change', function(){
        updatePreview();
    })

    $('.create').on('click', function(){
        var data = {
            name: $('.name').val(),
            cssUrl: $('.css_url').val()
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

    function updatePreview(){
        var metadataId = $('.metadata option:selected').val();
        var cssUrl = encodeURIComponent($('.css_url').val()) || 'Sample.css';
        $('.preview').attr('src', '/form/preview/' + metadataId + '/' + cssUrl);
    }

    window.OnSuccess = function(token){
        alert("Success: " + token);
    };

    window.OnFailure = function(error){
        alert("Failure: " + error);
    };
});
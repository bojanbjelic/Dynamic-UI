

jQuery(function($){

    if ($('.metadata option').length > 0)
        $('.preview').attr('src', '/form/' + $('.metadata option').val());

    $('.metadata').on('change', function(){
        $('.preview').attr('src', '/form/' + $('.metadata option:selected').val());
    });

    function updatePreview(metadataId, successCallback, failureCallback){
        if (!successCallback)
            successCallback  = 'OnSuccess';

        if (!failureCallback)
            failureCallback = 'OnFailure';

        $('.preview').attr('src', '/form/' + metadataId + '?successCallback=' + successCallback + '&failureCallback=' + failureCallback);
    }

    window.OnSuccess = function(token){
        alert("Success: " + token);
    };

    window.OnFailure = function(error){
        alert("Failure: " + error);
    }; 
});
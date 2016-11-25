jQuery(function($){
    $('form').on('submit', function(e){
        e.preventDefault();
        var form = $(this);
        var values = form.serializeArray();
        var data = values.reduce(function(obj, cv){ obj[cv.name] = cv.value; return obj;}, {})
        var url = form.attr('action');
        $.ajax({
            url: url,
            type: 'post',
            data: data
        }).done(function(data){
            window.parent.postMessage(data, location.origin);
        }).error(function(){

        });
    });
});
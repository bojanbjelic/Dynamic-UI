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
            (window.parent || window).postMessage(data, "*");
        }).fail(function(jqXHR, textStatus, errorThrown){
            console.log(jqXHR);
            console.log(textStatus);
            (window.parent || window).postMessage(jqXHR.responseJSON, "*");
        });
    });
});

jQuery(function($){
    var popup = $('.container-preview');    
    
    $('.preview').on('click', function(){
        var containerId = $(this).data('id');
        var url = 'http://localhost:3000/form/c/' + containerId;    
        $('iframe', popup).attr('src', url);
        $('.url', popup).val(url);
        popup.modal('show');
    });

    var clipboard = new Clipboard('.copy');
    $('.done', popup).on('click', function(){ popup.modal('hide'); });
});
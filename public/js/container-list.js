jQuery(function($){
    var popup = $('.container-preview');    
    
    $('.preview').on('click', function(){
        var containerId = $(this).data('id');    
        $('iframe', popup).attr('src', 'http://localhost:3000/form/c/' + containerId);
        popup.modal('show');
    });

    $('.done', popup).on('click', ()=> popup.modal('hide'));
});
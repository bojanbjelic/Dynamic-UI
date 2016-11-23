jQuery(function($){
    var _fields = [];
    
    /*
    * Handles keypress on each field
    */
    $('.fields').on('keyup', function(e){
        var target = $(e.target);
        // We only care about input elements
        if (!target.is('input:text'))
        return;

        var li = target.parent('tr');
        var isLast = li.is(':last-child');
        var nonEmpty = $('input:text', li).filter(function(i, el){
            return $(el).val() != '';
        });

        if (nonEmpty.length > 0 && isLast){
            li.clone().appendTo('.fields').find('input:text').val('');
        } 
        else if (nonEmpty.length == 0 && !isLast){
            li.remove();
        }
    });

    $('.add').click(function(){
        var name = $('.field_name');
        var label = $('.field_label');
        var field = {name: name.val(), label: label.val(), validations: []};
        _fields.push(field);
        name.val('');
        label.val('');
        addToTable(field);
    });

    function addToTable(f){
        var table = $('.fields');
        // TODO: Use template engine here
        $('tr:last', table).before(
            '<tr>' + 
            '<td>'+ f.name +'</td>' + 
            '<td>'+ f.label +'</td>' +
            '<td><a class="btn">Add</a></td>' +
            '<td><a class="remove"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>' +
            '</tr>'
        );
    }
});
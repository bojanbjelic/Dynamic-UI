jQuery(function($){
    
    if ($('.metadata option').length > 0)
        $('.preview').attr('src', '/form/' + $('.metadata option').val());
    
    
    var _fields = [];    

    $('.fields').click(function(e){
        var target = $(e.target);
        if (!target.hasClass('btn'))
            target = target.parent('.btn');
        
        if (target.hasClass('add')){
            addField(target.parents('tr'));
        } else if (target.hasClass('validations')){            
            showValidationList(target.parents('tr'));
        }
        
    });

    $('.validation-list .list-group-item').click(function(){
        $(this).toggleClass('selected');
    });

    $('.create').click(function(){
        var name = $('.metadata_name').val();
        var fields = [];
        var fieldRows = $('.field');
        fieldRows.each(function(i, el){
            el = $(el);
            fields.push({
                name: el.data('name'),
                label: el.data('label'),
                validations: el.data('validations') 
            });
        });

        $.ajax({
            url: '/metadata',
            type: 'post',
            data: {name: name, fields: fields}
        }).done(function(){
            alert('Metadata created');
            fieldRows.remove().empty();
        }).fail(function(){
            alert('Metadata was not created');
        });
    });

    function addField(row){
        var name = $('.field_name');
        var label = $('.field_label');
        var validations = row.data('validations') || [];
        var field = { name: name.val(), label: label.val(), validations: validations };
        addToTable(field);
        // Reset
        name.val('');
        label.val('');
        row.data('validations', []);
        $('.validations', row).html('<span class="glyphicon glyphicon-edit" aria-hidden="true"></span>');        
    }

    function showValidationList(row){
        var list = $('.validation-list');
        $('.done', list).one('click', function(){
            var selected = []
            $('.selected', list).each(function(i, e){
                selected.push($(e).data('id'));
            });
            row.data('validations', selected);
            $('.validations', row).text(selected.join(', '));
            list.modal('hide');
        });

        $('.fieldName', list).text(row.data('name'));
        list.modal('show');
    }

    function addToTable(field){
        // TODO: Use template engine here
        var row = $( 
            '<tr class="field">' +
                '<td>'+ field.name +'</td>' +
                '<td>'+ field.label +'</td>' +
                '<td><a class="btn validations"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></a></td>' +
                '<td><a class="btn remove"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>' +
            '</tr>');

        if (field.validations.length > 0)
            $('.validations', row).html(field.validations.join(', '));
            
        row.data('validations', field.validations)
        row.data('name', field.name);
        row.data('label', field.label);
        $('tr:last', '.fields').before(row);
    }
});
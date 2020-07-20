var hasSubmitted = false;
const endpoint = 'scripts/php/index.php';

$(function() {

    /*var query = new URLSearchParams(location.search);
    console.log(query.getAll('ok'));

    if(query.get('ok')) {
        alert('Reserva feita com sucesso!');   
        window.location.href = '/culto-presencial';
    }*/
    

    $.get(endpoint, 
        { action: 'total-segment' },
        function(response) {

            var count = $('.horarios').find('.assentos span');
            var countMobile = $('.horarios-mobile').find('.assentos span');

            if(response) {

                console.log(response);
                $.each(response, function(index, item) {

                    var total = 90 - parseInt(item.records);
                    $(count).eq(index).text(total);
                    $(countMobile).eq(index).text(total);

                })                
                
            }
        }
    );
    

    $('form')
        .submit(function() {

            //if(!hasSubmitted) {
                
                var email = $(this).find('[name="mauticform[email]"]').val();
                var data_nascimento = $(this).find('[name="mauticform[data_de_nascimento]"]').val();
                var name = $(this).find('[name="mauticform[nome]"]').val();
                var phone = $(this).find('[name="mauticform[tel]"]').val();
                var formId = $(this).attr('id');

                if(name.length === 0 || phone.length === 0 || email.length === 0 || data_nascimento.length === 0) {
                    alert('Por favor informe todos os campos');
                    return 
                }

                var age = date_diff(data_nascimento);
                console.log(age, age < 13 || age > 60);
                if(age < 13 || age > 60) {
                    
                    alert('Disponível apenas para pessoas que tenham entre 13 e 60 anos.');
                    var segment_id = $(this).data('segment_id');
                    var query = new URLSearchParams();

                    query.append('email', email);
                    query.append('segment_id', segment_id);
                    query.append('action', 'segment');
                    setTimeout(function() {

                        console.log('deleting...');
                        $.ajax({
                            url: endpoint + '?' + query.toString(),
                            method: 'DELETE',
                            success: function(response) {
                                
                                if(response) {
                                    if(response.type == 'OK')
                                        location.reload();                                    
                                    else alert(response.message);
                                }
                            },
                            error: function(err) {
                                console.log(err);
                                alert('Desculpe ocorreu um erro durante a solicitação');
                            }
                        });

                    }, 1000);

                    return;

                }                
                
                $.get(endpoint, { action: 'segment', email, formId },
                    function(response) {

                        console.log(response);
                        if(response) {

                            if(response.records == 0) {                                
                                hasSubmitted = true;
                                alert('Reserva feita com sucesso!');
                                setTimeout(function() {
                                    location.href = '/culto-presencial'
                                }, 1000);
                            } else {
                                alert('Você já possui uma reserva nesse horário');                                
                                location.href = '/culto-presencial'
                            }

                        }

                    }
                );

            /*} else {                
                hasSubmitted = false;
            }*/

        })

    $('p.cancelar')
        .find('a').click(function() {

            console.log('click link');

            var email = prompt('Informe o email cadastrado na reserva');
            var segment_id = $(this).data('segment_id');

            if(!email)
                return;

            var query = new URLSearchParams();
            query.append('email', email);
            query.append('segment_id', segment_id);
            query.append('action', 'segment');
            
            $.ajax({
                url: endpoint + '?' + query.toString(),
                method: 'DELETE',
                success: function(response) {
                    console.log(response);
                    if(response) {
                        if(response.type == 'OK') {
                            alert('Reserva cancelada com sucesso!');
                            location.reload();
                        }
                        else alert(response.message);
                    }
                },
                error: function(err) {
                    console.log(err);
                    alert('Desculpe ocorreu um erro durante a solicitação');
                }
            });

        })

})

var date_diff = function(date) {
    dt1 = new Date(date);
    dt2 = new Date();
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24 * 365));
}
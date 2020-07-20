const endpoint = 'app/scripts/php/index.php';

$(function() {

    $('form').submit(function() {

        var email = $('#mauticform_input_checkin_email').val();
        //var nome = $('#mauticform_input_checkin_nome').val();

        console.log(email);
        $.get(endpoint,
            { action: 'check-in', email },
            function(response) {

                console.log(response);

                if(response) {

                    if(response.records) {
                        alert('Parabéns, seu assento foi previamente reservado! Entre e seja abençoado!');
                        location.href = "/culto-presencial";
                    } else {
                        if(response.places < response.total_places) {
                            var remaimning = response.total_places - response.places;
                            alert('Que pena, seu assento não foi previamente reservado! Mas não fique triste, ainda temos ' + remaimning + ' vagas, clique em ok cadastre-se');
                            location.href = "/culto-presencial";
                        } else {
                            alert('Que pena, seu assento não foi previamente reservado e infelizmente não temos mais assentos disponíveis');
                        }
                    }

                } else {
                    alert('Desculpe, ocorreu um erro durante a solicitação');
                }
            }
        )

    })

    

})
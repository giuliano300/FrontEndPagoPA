let itemsPerPage = 100;

function FiltraRichieste() {
    $('.preload').show();
   let data = {
        dataInizio: $('#dataInizio').val(),
        dataFine: $('#dataFine').val(),
        worked: $('#worked').val(),
        valid: $('#valid').val(),
        nominativo: $('#nominativo').val(),
        paid: $('#pagato').val(),
        page: 1,
        itemsPerPage: itemsPerPage
    }
    $.post("/Action/FiltraRichieste", data, function (res) {
        let r = $.parseJSON(res);
        GetRichieste(r.Result);
        CreatePaginations(r.Message);
    });
}

function GeneraCsv() {
    let data = {
        dataInizio: $('#dataInizio').val(),
        dataFine: $('#dataFine').val(),
        nominativo: $('#nominativo').val(),
        paid: $('#pagato').val()
    }
    $.post("/Action/GeneraRendicontazione", data, function (res) {
        window.open(res);
    });
}

function GetRichiestePerPage(p, first) {
    $.get("/Action/GetRendicontazionePagamenti?page=" + p + "&itemsPerPage=" + itemsPerPage, function (res) {
        var r = $.parseJSON(res);
        GetRichieste(r.Result);
        if (first)
            CreatePaginations(r.Message);

        $('.preload').hide();

    })
}


$(function () {
    $('.preload').show();
    GetRichiestePerPage(1, true);
});

function CreatePaginations(totItems) {
    $('.pagination').empty();

    if (totItems > 0) {

        let a = "<a onclick='GetRichiestePerPage(1)'><i class='las la-angle-left'></i></a>";

        let nPage = Math.ceil(totItems / itemsPerPage);

        for (var i = 0; i < nPage; i++)
            a += "<a onclick='GetRichiestePerPage(" + (i + 1) + ")'>" + (i + 1) + "</a>";

        a += "<a onclick='GetRichiestePerPage(" + nPage + ")'><i class='las la-angle-right'></i></a>";

        $('.pagination').append(a);
    }
}

function EliminaFiltro() {
    $('.preload').show();
    let dataI = $('#dataInizio');
    let dataF = $('#dataFine');
    let nominativo = $('#nominativo');
    let pagato = $('#pagato');
    $.get("/Action/EliminaFiltroRendicontazione", function (res) {
        var r = $.parseJSON(res);
        dataI.val('@today');
        dataF.val('');
        nominativo.val('');
        pagato.val('SI');
        GetRichiestePerPage(1, true);
    })
};


function GetRichieste(r) {
    $('.archive-payments').empty();
    if(r != null)
        if (r.length > 0) {
            for (var i = 0; i < r.length; i++) {
                let rata = "Rata unica";
                let expDate = new Date(r[i].installment.expirationDate);
                let options = { year: 'numeric', month: '2-digit', day: '2-digit' };
                let expDateString = expDate.toLocaleDateString('it-IT', options);
                if (r[i].installment.numeroRata != 0)
                    rata = r[i].installment.numeroRata;
                var li = "<ul>" +
                    "<li>" + r[i].debtPosition.anagraficaPagatore + "</li>" +
                    "<li>" + r[i].debtPosition.codiceIdentificativoUnivocoPagatore + "</li>" +
                    "<li>" + r[i].installment.iuv + "</li>" +
                    "<li>" + r[i].installment.price + "€</li>" +
                    "<li class='text-center'>" + rata + "</li>" +
                    "<li>" + expDateString + "</li>";

                if (r[i].installment.paid == true && r[i].installment.valid == true && r[i].installment.worked == true)
                    li += "<li class='text-center'><a href='#'><i class='bx bxs-check-square'></i></a></li>";
                else
                    li += "<li class='text-center'><a href='#'><i class='bx bx-x'></i></a></li>";

                li += "</ul>";

                $('.archive-payments').append(li);
            }
        }
        else
        {
            $('.archive-payments').append("<ul><li style='width:100%; text-align: center; padding:10px'> Nessuna richiesta trovata </li></ul>");
        }
    else
        $('.archive-payments').append("<ul><li style='width:100%; text-align: center; padding:10px'> Nessuna richiesta trovata </li></ul>");

    $('.preload').hide();

}

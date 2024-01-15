let itemsPerPage = 100;

function DownloadList() {
    let data = {
        dataInizio: $('#dataInizio').val(),
        dataFine: $('#dataFine').val(),
        codiceFiscale: $('#codiceFiscale').val(),
        iuv: $('#iuv').val(),
        worked: 1,
        type: "RichiesteEsitate"
    }
    $.post("/Action/GetIuvInCsv", data, function (res) {
        window.open(res);
    });
}

function FiltraRichieste() {
    $('.preload').show();
    let data = {
        dataInizio: $('#dataInizio').val(),
        dataFine: $('#dataFine').val(),
        codiceFiscale: $('#codiceFiscale').val(),
        iuv: $('#iuv').val(),
        worked: true,
        page: 1,
        valid: true,
        itemsPerPage: itemsPerPage
    }
    $.post("/Action/FiltraRichieste", data, function (res) {
        let r = JSON.parse(res);
        GetRichieste(r.Result);
        CreatePaginations(r.Message);
    });
}

function GetRichiestePerPage(p, first) {
    let codiceFiscale = $('#codiceFiscale').val();
    let iuv = $('#iuv').val();
    let dataInizio = $('#dataInizio').val();
    let dataFine = $('#dataFine').val();

    $.get("/Action/GetRichiesteEsitate?page=" + p + "&itemsPerPage=" + itemsPerPage + "&codiceFiscale=" + codiceFiscale + "&iuv=" + iuv + "&dataInizio=" + dataInizio + "&dataFine=" + dataFine, function (res) {
        var r = JSON.parse(res);
        GetRichieste(r.Result);
        if (first)
            CreatePaginations(r.Message);

        $('.preload').hide();
    })
}


$(function () {
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
    let codiceFiscale = $('#codiceFiscale');
    let iuv = $('#iuv');
    $.get("/Action/EliminaFiltro", function (res) {
        var r = JSON.parse(res);
        dataI.val('');
        dataF.val('');
        codiceFiscale.val('');
        iuv.val('');
        GetRichiestePerPage(1, true);
    })
};


function GetRichieste(r) {
    $('.archive-list-accepted').empty();
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
                    "<li>" + r[i].installment.id + "</li>" +
                    "<li>" + r[i].installment.iuv + "</li>" +
                    "<li>" + r[i].debtPosition.codiceIdentificativoUnivocoPagatore + "</li>" +
                    "<li>" + r[i].installment.price + "€</li>" +
                    "<li>" + rata + "</li>" +
                    "<li>" + expDateString + "</li>" +
                    "<li><strong><i class='las la-check'></i>&nbsp;ESITATA</strong></li>" +
                    //"<li><a href='#'><i class='las la-file-alt'></i></a></li>" +
                    "</ul>";

                $('.archive-list-accepted').append(li);
            }
        }
        else
            $('.archive-list-accepted').append("<ul><li style='width:100%; text-align: center; padding:10px'> Nessuna richiesta trovata </li></ul>");
    else
        $('.archive-list-accepted').append("<ul><li style='width:100%; text-align: center; padding:10px'> Nessuna richiesta trovata </li></ul>");

    $('.preload').hide();

}

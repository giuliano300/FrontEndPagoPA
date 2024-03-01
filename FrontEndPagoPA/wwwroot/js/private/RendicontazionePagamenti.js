let itemsPerPage = 100;
let currentDate = new Date();
let today = currentDate.toISOString().split('T')[0];

const OperationType = {
    TARI: 1,
    MENSA: 2,
    MULTE: 3,
    CANONE: 4,
    PASSOCARRABILE: 5,
    TRASPORTO: 6
}


function FiltraRichieste() {
    $('.preload').show();
    let data = {
        dataInizio: $('#dataInizio').val(),
        dataFine: $('#dataFine').val(),
        worked: $('#worked').val(),
        valid: $('#valid').val(),
        nominativo: $('#nominativo').val(),
        codiceFiscale: $('#codiceFiscale').val(),
        iuv: $('#iuv').val(),
        importoMin: $('#importoMinimo').val(),
        importoMax: $('#importoMassimo').val(),
        paid: $('#pagato').val(),
        page: 1,
        itemsPerPage: itemsPerPage,
        payable: false
    }

    if (data.paid == "NO") {
        data.paid = false;
        data.payable = true;
    }
    else
        data.paid = true;

    $.post("/Action/FiltraRichieste", data, function (res) {
        let r = JSON.parse(res);
        GetRichieste(r.Result);
        CreatePaginations(data.paid, data.nominativo, data.dataInizio, data.dataFine, data.iuv, data.codiceFiscale, data.importoMin, data.importoMax, true);
    });
}

function GeneraCsv() {
    let data = {
        dataInizio: $('#dataInizio').val(),
        dataFine: $('#dataFine').val(),
        nominativo: $('#nominativo').val(),
        paid: $('#pagato').val(),
        iuv: $('#iuv').val(),
        codiceFiscale: $('#codiceFiscale').val(),
        importoMin: $('#importoMinimo').val(),
        importoMax: $('#importoMassimo').val()
    };

    $('.preload').show();

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';

    document.body.appendChild(iframe);
    $.post("/Action/GeneraRendicontazione", data, function (res) {
        iframe.src = res;
    }).done(function () {
        $('.preload').hide();
    });
}


function GetRichiestePerPage(p, first) {


    let paid = $('#pagato').val();
    let payable;

    if (paid == "NO") {
        paid = false;
        payable = true;
    }
    else {
        paid = true;
        payable = false;
    }

    let nominativo = $('#nominativo').val();
    let dataInizio = $('#dataInizio').val();
    let dataFine = $('#dataFine').val();
    let iuv = $('#iuv').val();
    let codiceFiscale = $('#codiceFiscale').val();
    let importoMin = $('#importoMinimo').val();
    let importoMax = $('#importoMassimo').val();

    $('.items').removeClass('selected');
    $('.item-' + p).addClass('selected');

    $.get("/Action/GetRendicontazionePagamenti?page=" + p + "&itemsPerPage=" + itemsPerPage + "&paid=" + paid + "&nominativo=" + nominativo + "&dataInizio=" + dataInizio + "&dataFine=" + dataFine + "&iuv=" + iuv + "&codiceFiscale=" + codiceFiscale + "&importoMin=" + importoMin + "&importoMax=" + importoMax + "&payable=" + payable, function (res) {
        var r = JSON.parse(res);
        GetRichieste(r.Result);
        if (first)
            CreatePaginations(paid, nominativo, dataInizio, dataFine, iuv, codiceFiscale, importoMin, importoMax, first);

        $('.preload').hide();
    });
}


$(function () {
    $('.preload').show();
    GetRichiestePerPage(1, true);
});

function CreatePaginations(paid, nominativo, dataInizio, dataFine, iuv, codiceFiscale, importoMin, importoMax, first) {

    let payable = false;

    if (paid == false)
        payable = true;

    let url = "/Action/GetRendicontazionePagamenti?page=1&itemsPerPage=1000000000&paid=" + paid + "&nominativo=" + nominativo + "&dataInizio=" + dataInizio + "&dataFine=" + dataFine + "&iuv=" + iuv + "&codiceFiscale=" + codiceFiscale + "&importoMin=" + importoMin + "&importoMax=" + importoMax + "&payable=" + payable;
    $.get(url, function (res) {
        var r = JSON.parse(res);

        var totItems = r.Message;

        $('.pagination').empty();

        if (totItems > 0) {

            let a = "<a onclick='GetRichiestePerPage(1)'><i class='las la-angle-left'></i></a>";

            let nPage = Math.ceil(totItems / itemsPerPage);

            for (var i = 0; i < nPage; i++)
                a += "<a onclick='GetRichiestePerPage(" + (i + 1) + ")' class='items item-" + (i + 1) + "'>" + (i + 1) + "</a>";

            a += "<a onclick='GetRichiestePerPage(" + nPage + ")'><i class='las la-angle-right'></i></a>";

            if (totItems == 1)
                a += "<span>  1 Risultato </span>";
            else
                a += "<span>" + "  " + totItems + " Risultati</span>";

            $('.pagination').append(a);
            if (first) {
                $('.items').removeClass('selected');
                $('.item-1').addClass('selected');
            }
        }
    })
}

function EliminaFiltro() {
    $('.preload').show();
    let dataI = $('#dataInizio');
    let dataF = $('#dataFine');
    let nominativo = $('#nominativo');
    let iuv = $('#iuv');
    let pagato = $('#pagato');
    let codiceFiscale = $('#codiceFiscale');
    let importoMin = $('#importoMinimo');
    let importoMax = $('#importoMassimo');
    $.get("/Action/EliminaFiltroRendicontazione", function (res) {
        var r = JSON.parse(res);
        dataI.val(today);
        dataF.val('');
        nominativo.val('');
        iuv.val('');
        codiceFiscale.val('');
        importoMin.val('');
        importoMax.val('');
        pagato.val('SI');
        GetRichiestePerPage(1, true);
    })
};


function GetRichieste(r) {
    $('.archive-payments').empty();
    if (r != null) {
        if (r.length > 0) {
            for (var i = 0; i < r.length; i++) {
                let rata = "Rata unica";
                let expDate = new Date(r[i].expirationDate);
                let options = { year: 'numeric', month: '2-digit', day: '2-digit' };
                let expDateString = expDate.toLocaleDateString('it-IT', options);
                let operationType = CheckOperationTypeId(r[i].operationTypeId);

                if (r[i].numeroRata != 0)
                    rata = r[i].numeroRata;
                var li = "<ul>" +
                    "<li>" + r[i].anagraficaPagatore + "</li>" +
                    "<li>" + r[i].codiceIdentificativoUnivocoPagatore + "</li>" +
                    "<li>" + r[i].iuv + "</li>" +
                    "<li>" + operationType + "</li>" +
                    "<li>" + r[i].price + "€</li>";

                if (operationType == "Multa")
                    li += "<li>" + r[i].description + "</li>";
                else
                    li += "<li>" + rata + "</li>";

                li += "<li class='text-center'>" + expDateString + "</li>";

                if (r[i].paid == true)
                    li += "<li class='text-center'><a href='#'><i class='bx bxs-check-square'></i></a></li>";
                else
                    li += "<li class='text-center'><a href='#'><i class='bx bx-x'></i></a></li>";

                li += "</ul>";

                $('.archive-payments').append(li);
            }
        }
        else
            $('.archive-payments').append("<ul><li style='width:100%; text-align: center; padding:10px'> Nessuna richiesta trovata </li></ul>");
    }
    else
        $('.archive-payments').append("<ul><li style='width:100%; text-align: center; padding:10px'> Nessuna richiesta trovata </li></ul>");

    $('.preload').hide();
}


function CheckOperationTypeId(id) {
    if (id === OperationType.TARI)
        return "Tari";
    else if (id === OperationType.MENSA)
        return "Mensa scolastica";
    else if (id === OperationType.MULTE)
        return "Multa";
    else if (id === OperationType.CANONE)
        return "Canone unico";
    else if (id === OperationType.PASSOCARRABILE)
        return "Passo carrabile";
    else if (id === OperationType.TRASPORTO)
        return "Trasporto scolastico";
    else
        return "";
}
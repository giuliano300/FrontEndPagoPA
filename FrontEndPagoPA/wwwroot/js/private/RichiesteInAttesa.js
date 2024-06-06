let itemsPerPage = 100;
let currentDate = new Date();
let today = currentDate.toISOString().split('T')[0];

const OperationType = {
    TARIANNIPRECEDENTI: 1,
    MENSA: 2,
    MULTE: 3,
    CANONE: 4,
    PASSOCARRABILE: 5,
    TRASPORTO: 6,
    DIRITTISEGRETERIACERTIFICATIANAGRAFICI: 7,
    AFFITI: 8,
    TASSACONCORSO: 9,
    DIRITTISEGRETERIAESPESEDINOTIFICA: 10,
    AREEMERCATALI: 11,
    COSAPTOSAP: 12,
    TARIANNOINCORSO: 13,
    ACQUALUCEGAS: 14
}

function FiltraRichieste() {
    $('.preload').show();
    let data = {
        dataInizio: $('#dataInizio').val(),
        dataFine: $('#dataFine').val(),
        codiceFiscale: $('#codiceFiscale').val(),
        iuv: $('#iuv').val(),
        worked: $('#worked').val(),
        page: 1,
        itemsPerPage: itemsPerPage
    }
    $.post("/Action/FiltraRichieste", data, function (res) {
        let r = JSON.parse(res);
        GetRichieste(r.Result);
        CreatePaginations(data.codiceFiscale, data.iuv, data.dataInizio, data.dataFine, true);
    });
}

function GetRichiestePerPage(p, first) {

    let codiceFiscale = $('#codiceFiscale').val();
    let iuv = $('#iuv').val();
    let dataInizio = $('#dataInizio').val();
    let dataFine = $('#dataFine').val();

    $('.items').removeClass('selected');
    $('.item-' + p).addClass('selected');

    $.get("/Action/GetRichiesteInAttesa?page=" + p + "&itemsPerPage=" + itemsPerPage + "&codiceFiscale=" + codiceFiscale + "&iuv=" + iuv + "&dataInizio=" + dataInizio + "&dataFine=" + dataFine, function (res) {
        var r = JSON.parse(res);
        GetRichieste(r.Result);
        if (first)
            CreatePaginations(codiceFiscale, iuv, dataInizio, dataFine, first);

        $('.preload').hide();
    })
}

function CreatePaginations(codiceFiscale, iuv, dataInizio, dataFine, first) {
    $.get("/Action/GetRichiesteInAttesa?page=1&itemsPerPage=1000000000&codiceFiscale=" + codiceFiscale + "&iuv=" + iuv + "&dataInizio=" + dataInizio + "&dataFine=" + dataFine, function (res) {
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


$(function () {
    $('.preload').show();
    GetRichiestePerPage(1, true);
});

function EliminaFiltro() {
    $('.preload').show();

    let dataI = $('#dataInizio');
    let dataF = $('#dataFine');
    let codiceFiscale = $('#codiceFiscale');
    let iuv = $('#iuv');
    $.get("/Action/EliminaFiltroInAttesa", function (res) {
        var r = JSON.parse(res);
        dataI.val(today);
        dataF.val('');
        codiceFiscale.val('');
        iuv.val('');
        GetRichiestePerPage(1, true);
    })
};


function GetRichieste(r) {
    $('.archive-list-waiting').empty();
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
                    "<li>" + r[i].id + "</li>" +
                    "<li>" + r[i].codiceIdentificativoUnivocoPagatore + "</li>" +
                    "<li>" + r[i].iuv + "</li>" +
                    "<li>" + operationType + "</li>" +
                    "<li>" + r[i].price + "€</li>";

                if (operationType == "Multa")
                    li += "<li>" + r[i].description + "</li>";
                else
                    li += "<li>" + rata + "</li>";

                li += "<li>" + expDateString + "</li>" +
                    "<li><strong><i class='las la-clock'></i>&nbsp;IN ATTESA DI ESITAZIONE</strong></li>" +
                    "</ul>";

                $('.archive-list-waiting').append(li);
            }
        }
        else
            $('.archive-list-waiting').append("<ul><li style='width:100%; text-align: center; padding:10px'> Nessuna richiesta trovata </li></ul>");
    }
    else
        $('.archive-list-waiting').append("<ul><li style='width:100%; text-align: center; padding:10px'> Nessuna richiesta trovata </li></ul>");

    $('.preload').hide();
}
function CheckOperationTypeId(id) {
    if (id === OperationType.TARIANNIPRECEDENTI)
        return "Tari anni precedenti";
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
    else if (id === OperationType.DIRITTISEGRETERIACERTIFICATIANAGRAFICI)
        return "Diritti di segreteria per certificati anagrafici";
    else if (id === OperationType.AFFITI)
        return "Affitti";
    else if (id === OperationType.TASSACONCORSO)
        return "Tassa concorso";
    else if (id === OperationType.DIRITTISEGRETERIAESPESEDINOTIFICA)
        return "Diritti di segreteria e spese di notifica";
    else if (id === OperationType.AREEMERCATALI)
        return "Aree Mercatali";
    else if (id === OperationType.COSAPTOSAP)
        return "COSAP/TOSAP";
    else if (id === OperationType.TARIANNOINCORSO)
        return "Tari anno in corso";
    else
        return "";
}
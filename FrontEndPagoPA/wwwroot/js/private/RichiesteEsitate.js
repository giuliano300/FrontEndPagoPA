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

function DownloadList() {
    $('.preload').show();

    let data = {
        dataInizio: $('#dataInizio').val(),
        dataFine: $('#dataFine').val(),
        codiceFiscale: $('#codiceFiscale').val(),
        iuv: $('#iuv').val(),
        importoMin: $('#importoMinimo').val(),
        importoMax: $('#importoMassimo').val(),
        worked: true,
        page: 1,
        valid: null,
        itemsPerPage: 100000000,
        type: "RichiesteEsitate"
    }

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';

    document.body.appendChild(iframe);
    $.post("/Action/GetIuvInCsv", data, function (res) {
        iframe.src = res;
    })
        .done(function () {
            $('.preload').hide();
        });
}


function FiltraRichieste() {
    $('.preload').show();
    let data = {
        dataInizio: $('#dataInizio').val(),
        dataFine: $('#dataFine').val(),
        codiceFiscale: $('#codiceFiscale').val(),
        iuv: $('#iuv').val(),
        importoMin: $('#importoMinimo').val(),
        importoMax: $('#importoMassimo').val(),
        worked: true,
        page: 1,
        valid: null,
        itemsPerPage: itemsPerPage
    }
    $.post("/Action/FiltraRichieste", data, function (res) {
        let r = JSON.parse(res);
        GetRichieste(r.Result);
        CreatePaginations(data.codiceFiscale, data.iuv, data.dataInizio, data.dataFine, data.importoMin, data.importoMax, true);
    });
}

function GetRichiestePerPage(p, first) {
    let codiceFiscale = $('#codiceFiscale').val();
    let iuv = $('#iuv').val();
    let dataInizio = $('#dataInizio').val();
    let dataFine = $('#dataFine').val();
    let importoMin = $('#importoMinimo').val();
    let importoMax = $('#importoMassimo').val();

    $('.items').removeClass('selected');
    $('.item-' + p).addClass('selected');

    $.get("/Action/GetRichiesteEsitate?page=" + p + "&itemsPerPage=" + itemsPerPage + "&codiceFiscale=" + codiceFiscale + "&iuv=" + iuv + "&dataInizio=" + dataInizio + "&dataFine=" + dataFine + "&importoMin=" + importoMin + "&importoMax=" + importoMax, function (res) {
        var r = JSON.parse(res);
        GetRichieste(r.Result);
        if (first)
            CreatePaginations(codiceFiscale, iuv, dataInizio, dataFine, importoMin, importoMax, first);

        $('.preload').hide();
    })
}


$(function () {
    $('.preload').show();
    GetRichiestePerPage(1, true);
});

function CreatePaginations(codiceFiscale, iuv, dataInizio, dataFine, importoMin, importoMax, first) {
    $.get("/Action/GetRichiesteEsitate?page=1&itemsPerPage=1000000000&codiceFiscale=" + codiceFiscale + "&iuv=" + iuv + "&dataInizio=" + dataInizio + "&dataFine=" + dataFine + "&importoMin=" + importoMin + "&importoMax=" + importoMax, function (res) {
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
    let codiceFiscale = $('#codiceFiscale');
    let iuv = $('#iuv');
    let importoMin = $('#importoMinimo');
    let importoMax = $('#importoMassimo');
    $.get("/Action/EliminaFiltroRichiesteEsitate", function (res) {
        var r = JSON.parse(res);
        dataI.val(today);
        dataF.val('');
        codiceFiscale.val('');
        iuv.val('');
        importoMin.val('');
        importoMax.val('');
        GetRichiestePerPage(1, true);
    })
};


function GetRichieste(r) {
    $('.archive-list-accepted').empty();
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

                li += "<li>" + expDateString + "</li>";

                if (r[i].valid != true)
                    li += "<li><strong style='color:#EA5555;'><i class='las la-times'></i>&nbsp;NON VALIDATA</strong></li>";

                else
                    li += "<li><strong><i class='las la-check'></i>&nbsp;ESITATA</strong></li>";

                li += "</ul>";

                $('.archive-list-accepted').append(li);
            }
        }
        else
            $('.archive-list-accepted').append("<ul><li style='width:100%; text-align: center; padding:10px'> Nessuna richiesta trovata </li></ul>");
    }
    else
        $('.archive-list-accepted').append("<ul><li style='width:100%; text-align: center; padding:10px'> Nessuna richiesta trovata </li></ul>");

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
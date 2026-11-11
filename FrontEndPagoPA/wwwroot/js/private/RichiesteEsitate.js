let itemsPerPage = 100;
let currentDate = new Date();
let currentPage = 1;
let today = currentDate.toISOString().split('T')[0];

loadOperationTypes();

function loadOperationTypes() {
    return $.get("/Action/GetOperationTypes")
        .then(response => {
            response = JSON.parse(response);

            if (response && response.IsSuccess) {
                operationTypes = response.Result.reduce((acc, type) => {
                    acc[type.id] = type.typeName;
                    return acc;
                }, {});
            }
        })
        .catch(error => {
            console.error('Error fetching operation types:', error);
        });
}

function CheckOperationTypeId(id) {
    return operationTypes[id] || '';
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
    currentPage = 1;
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
    currentPage = p;
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

function ChangeItemsPerPage(value) {
    itemsPerPage = Number(value) || 100;
    currentPage = 1;
    $('.preload').show();
    GetRichiestePerPage(1, true);
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

            let nPage = Math.ceil(totItems / itemsPerPage);
            currentPage = Math.min(Math.max(currentPage, 1), nPage);
            let start = Math.max(1, currentPage - 2);
            let end = Math.min(nPage, start + 4);
            start = Math.max(1, end - 4);
            let a = "<div class='pagination-controls'>";
            a += "<button type='button' aria-label='Pagina precedente' " + (currentPage === 1 ? "disabled" : "onclick='GetRichiestePerPage(" + (currentPage - 1) + ", true)'") + "><i class='las la-angle-left'></i></button>";
            if (start > 1) {
                a += "<button type='button' onclick='GetRichiestePerPage(1, true)' class='items item-1'>1</button>";
                if (start > 2) a += "<span class='pagination-ellipsis'>…</span>";
            }
            for (let page = start; page <= end; page++)
                a += "<button type='button' onclick='GetRichiestePerPage(" + page + ", true)' class='items item-" + page + (page === currentPage ? " selected" : "") + "' aria-label='Pagina " + page + "'>" + page + "</button>";
            if (end < nPage) {
                if (end < nPage - 1) a += "<span class='pagination-ellipsis'>…</span>";
                a += "<button type='button' onclick='GetRichiestePerPage(" + nPage + ", true)' class='items item-" + nPage + "'>" + nPage + "</button>";
            }
            a += "<button type='button' aria-label='Pagina successiva' " + (currentPage === nPage ? "disabled" : "onclick='GetRichiestePerPage(" + (currentPage + 1) + ", true)'") + "><i class='las la-angle-right'></i></button>";
            a += "</div><span class='pagination-summary'>" + totItems + (totItems === 1 ? " risultato" : " risultati") + "</span>";
            $('.pagination').append(a);
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
        dataI.val('');
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

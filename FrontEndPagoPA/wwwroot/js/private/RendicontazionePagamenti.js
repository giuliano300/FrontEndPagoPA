let itemsPerPage = 100;

let operationTypes = {};


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

function FiltraRichieste() {
    $('.preload').show();
    GetRichiestePerPage(1, true);
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

    if (paid == "NO")
        paid = false;
    else
        paid = true;

    let nominativo = $('#nominativo').val();
    let dataInizio = $('#dataInizio').val();
    let dataFine = $('#dataFine').val();
    let iuv = $('#iuv').val();
    let codiceFiscale = $('#codiceFiscale').val();
    let importoMin = $('#importoMinimo').val();
    let importoMax = $('#importoMassimo').val();

    $('.items').removeClass('selected');
    $('.item-' + p).addClass('selected');

    $.get("/Action/GetRendicontazionePagamenti?page=" + p + "&itemsPerPage=" + itemsPerPage + "&paid=" + paid + "&nominativo=" + nominativo + "&dataInizio=" + dataInizio + "&dataFine=" + dataFine + "&iuv=" + iuv + "&codiceFiscale=" + codiceFiscale + "&importoMin=" + importoMin + "&importoMax=" + importoMax, function (res) {
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

    let url = "/Action/GetRendicontazionePagamenti?page=1&itemsPerPage=1000000000&paid=" + paid + "&nominativo=" + nominativo + "&dataInizio=" + dataInizio + "&dataFine=" + dataFine + "&iuv=" + iuv + "&codiceFiscale=" + codiceFiscale + "&importoMin=" + importoMin + "&importoMax=" + importoMax;
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
        dataI.val('');
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
                let isExpired = expDate < new Date(new Date().setHours(0, 0, 0, 0));
                let paymentDate = "";
                if (r[i].paid == true) {
                    let payDate = new Date(r[i].paymentDate);
                    paymentDate = payDate.toLocaleDateString('it-IT', options);
                }

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

                li += "<li class='text-center'>" + paymentDate + "</li>";

                if (r[i].paid !== true && isExpired) {
                    let isoExpirationDate = String(r[i].expirationDate).split('T')[0];
                    li += "<li class='text-center'><button type='button' class='expiration-action' " +
                        "aria-label='Modifica scadenza' data-tooltip='Modifica scadenza' " +
                        "onclick=\"OpenExpirationModal(" + r[i].id + ", '" +
                        String(r[i].iuv).replace(/'/g, "\\'") + "', '" + isoExpirationDate +
                        "')\"><i class='bx bx-calendar-edit'></i></button></li>";
                } else {
                    li += "<li class='text-center'>-</li>";
                }
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

function OpenExpirationModal(id, iuv, expirationDate) {
    $('#updateExpirationInstallmentId').val(id);
    $('#updateExpirationIuv').text(iuv);
    $('#currentExpirationDate').val(expirationDate);
    $('#newExpirationDate').val('').attr('min', new Date(Date.now() + 86400000).toISOString().split('T')[0]);
    $('#updateExpirationMessage').empty();
    $('#confirmExpirationUpdate').prop('disabled', false);
    bootstrap.Modal.getOrCreateInstance(document.getElementById('updateExpirationModal')).show();
}

function UpdateExpirationDate() {
    let id = $('#updateExpirationInstallmentId').val();
    let expirationDate = $('#newExpirationDate').val();
    let message = $('#updateExpirationMessage');

    if (!expirationDate) {
        message.html("<strong style='color:#EA5555;'>Inserire la nuova data di scadenza.</strong>");
        return;
    }

    $('#confirmExpirationUpdate').prop('disabled', true);
    $.post('/Action/UpdateIuvExpirationDate', { id: id, expirationDate: expirationDate })
        .done(function (response) {
            let result = JSON.parse(response);
            if (result.IsSuccess) {
                message.html("<strong>" + result.Message + "</strong>");
                setTimeout(function () {
                    bootstrap.Modal.getInstance(document.getElementById('updateExpirationModal')).hide();
                    GetRichiestePerPage(1, true);
                }, 800);
            } else {
                message.html("<strong style='color:#EA5555;'>" + result.Message + "</strong>");
                $('#confirmExpirationUpdate').prop('disabled', false);
            }
        })
        .fail(function () {
            message.html("<strong style='color:#EA5555;'>Errore durante l'aggiornamento.</strong>");
            $('#confirmExpirationUpdate').prop('disabled', false);
        });
}

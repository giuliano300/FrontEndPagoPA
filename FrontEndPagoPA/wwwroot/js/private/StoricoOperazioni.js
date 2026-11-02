let itemsPerPage = 100;
var currentDate = new Date();
let currentPage = 1;
var today = currentDate.toISOString().split('T')[0];

function FiltraRichieste() {
    currentPage = 1;
    $('.preload').show();
    let data = {
        dataInizio: $('#dataInizio').val(),
        dataFine: $('#dataFine').val(),
        page: 1,
        itemsPerPage: itemsPerPage
    }
    $.post("/Action/FiltraRichiesteStoricoOperazioni", data, function (res) {
        let r = JSON.parse(res);
        GetRichieste(r.Result);
        CreatePaginations(data.dataInizio, data.dataFine, true);
    });
}

function GetRichiestePerPage(p, first) {
    currentPage = p;
    let dataInizio = $('#dataInizio').val();
    let dataFine = $('#dataFine').val();

    $('.items').removeClass('selected');
    $('.item-' + p).addClass('selected');

    $.get("/Action/GetStoricoOperazioni?page=" + p + "&itemsPerPage=" + itemsPerPage + "&dataInizio=" + dataInizio + "&dataFine=" + dataFine, function (res) {
        var r = JSON.parse(res);
        GetRichieste(r.Result);
        if (first)
            CreatePaginations(dataInizio, dataFine, first);

        $('.preload').hide();
    });
}

function ChangeItemsPerPage(value) {
    itemsPerPage = Number(value) || 100;
    currentPage = 1;
    $('.preload').show();
    GetRichiestePerPage(1, true);
}

function CreatePaginations(dataInizio, dataFine, first) {
    $.get("/Action/GetStoricoOperazioni?page=1&itemsPerPage=1000000000&dataInizio=" + dataInizio + "&dataFine=" + dataFine, function (res) {
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
    });
}


$(function () {
    $('.preload').show();
    GetRichiestePerPage(1, true);
});

function EliminaFiltro() {
    $('.preload').show();
    let dataI = $('#dataInizio');
    let dataF = $('#dataFine');
    $.get("/Action/EliminaFiltroStoricoOperazioni", function (res) {
        var r = JSON.parse(res);
        dataI.val(today);
        dataF.val('');
        GetRichiestePerPage(1, true);
    })
};


function GetRichieste(r) {
    $('.operations-history').empty();
    if (r != null) {
        if (r.length > 0) {
            for (var i = 0; i < r.length; i++) {
                let date = new Date(r[i].date);
                let options = { year: 'numeric', month: '2-digit', day: '2-digit' };
                let insDateString = date.toLocaleDateString('it-IT', options);
                var li = "<ul>" +
                    "<li>" + r[i].title + "</li>" +
                    "<li class='text-center'>" + insDateString + "</li>" +
                    "<li class='text-center'>" + r[i].operationType + "</li>";

                if (r[i].bollettino == false || r[i].bollettino == "" || r[i].bollettino == null)
                    li += "<li class='text-center'>IUV</li>";
                else
                    li += "<li class='text-center'>IUV + Bollettino</li>";

                li += "<li class='text-center'><div class='progress-bar'>" +
                    "<div style='width:100%; position:absolute; z-index:200; text-align:center; color:#FFF; font-weight:600;'>" + r[i].workedInstallmentsPercentage + "%</div>" +
                    "<span style='width:" + r[i].workedInstallmentsPercentage + "%'></span></div></li>";
                if (r[i].workedInstallmentsPercentage == 100) {
                    li += "<li class='text-center' title='documento disponibile' onclick='GetCsv(" + r[i].operationId + ")'><i class='bx bx-qr active-btn'></i></li>";

                    if (r[i].bollettino != true) {
                        li += "<li class='text-center' title='nessuna azione possibile'>-</li>";
                    }
                    else {
                        if (r[i].downloadableFile)
                            li += "<li class='text-center' title='documento disponibile' onclick='GetZipFile(" + r[i].operationId + ")'><i class='las la-file-archive active-btn'></i></li>";
                        else
                            li += "<li class='text-center' title='documento non ancora disponibile'><i class='las la-file-archive not-active'></i></li>";
                    }
                }
                else {
                    li += "<li class='text-center' title='documento non ancora disponibile'><i class='bx bx-qr not-active'></i></li>";

                    if (r[i].bollettino != true) {
                        li += "<li class='text-center' title='nessuna azione possibile'>-</li>";
                    }
                    else
                        li += "<li class='text-center' title='documento non ancora disponibile'><i class='las la-file-archive not-active'></i></li>";
                }
                li += "</ul>";

                $('.operations-history').append(li);
            }
        }
        else
            $('.operations-history').append("<ul><li style='width:100%; text-align: center; padding:10px'> Nessuna richiesta trovata </li></ul>");
    }
    else
        $('.operations-history').append("<ul><li style='width:100%; text-align: center; padding:10px'> Nessuna richiesta trovata </li></ul>");

    $('.preload').hide();
}

function GetCsv(id) {
    $('.preload').show();

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';

    document.body.appendChild(iframe);
    $.get("/Action/GetCsvFromOperation?id=" + id, function (res) {
        iframe.src = res;
    })
        .done(function () {
            $('.preload').hide();
        });
}

function GetZipFile(id) {
    $('.preload').show();

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';

    document.body.appendChild(iframe);
    $.get("/Action/GetFileFromOperation?id=" + id, function (res) {
        iframe.src = res;
    })
        .done(function () {
            $('.preload').hide();
        });
}

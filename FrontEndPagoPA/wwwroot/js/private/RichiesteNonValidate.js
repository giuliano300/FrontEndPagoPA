let elementiPerPaginaNonValidati = 100;
let paginaCorrenteNonValidati = 1;
let tipiOperazioneNonValidati = {};

function CodificaHtmlNonValidati(valore) {
    const entita = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return String(valore == null ? '' : valore).replace(/[&<>"']/g, carattere => entita[carattere]);
}

function CaricaTipiOperazioneNonValidati() {
    return $.get('/Action/GetOperationTypes').then(response => {
        const risultato = JSON.parse(response);
        if (risultato && risultato.IsSuccess) {
            tipiOperazioneNonValidati = risultato.Result.reduce((mappa, tipo) => {
                mappa[tipo.id] = tipo.typeName;
                return mappa;
            }, {});
        }
    });
}

function ParametriNonValidati(pagina, elementi) {
    return $.param({
        page: pagina,
        itemsPerPage: elementi,
        dataInizio: $('#dataInizio').val(),
        dataFine: $('#dataFine').val(),
        codiceFiscale: $('#codiceFiscale').val(),
        iuv: $('#iuv').val(),
        importoMin: $('#importoMinimo').val(),
        importoMax: $('#importoMassimo').val()
    });
}

function CaricaRichiesteNonValidate(pagina, aggiornaPaginazione) {
    paginaCorrenteNonValidati = pagina;
    $('.preload').show();

    $.get('/Action/GetRichiesteNonValidate?' + ParametriNonValidati(pagina, elementiPerPaginaNonValidati), function (response) {
        const risultato = JSON.parse(response);
        MostraRichiesteNonValidate(risultato.Result);
        if (aggiornaPaginazione)
            CreaPaginazioneNonValidati();
        $('.preload').hide();
    });
}

function CreaPaginazioneNonValidati() {
    $.get('/Action/GetRichiesteNonValidate?' + ParametriNonValidati(1, 1000000000), function (response) {
        const risultato = JSON.parse(response);
        const totale = Number(risultato.Message) || 0;
        const contenitore = $('.pagination');
        contenitore.empty();

        if (totale === 0)
            return;

        const numeroPagine = Math.ceil(totale / elementiPerPaginaNonValidati);
        paginaCorrenteNonValidati = Math.min(Math.max(paginaCorrenteNonValidati, 1), numeroPagine);
        let inizio = Math.max(1, paginaCorrenteNonValidati - 2);
        let fine = Math.min(numeroPagine, inizio + 4);
        inizio = Math.max(1, fine - 4);
        let html = "<div class='pagination-controls'>";
        html += "<button type='button' aria-label='Pagina precedente' " + (paginaCorrenteNonValidati === 1 ? 'disabled' : "onclick='CaricaRichiesteNonValidate(" + (paginaCorrenteNonValidati - 1) + ", true)'") + "><i class='las la-angle-left'></i></button>";

        for (let pagina = inizio; pagina <= fine; pagina++)
            html += "<button type='button' onclick='CaricaRichiesteNonValidate(" + pagina + ", true)' class='items" + (pagina === paginaCorrenteNonValidati ? ' selected' : '') + "'>" + pagina + '</button>';

        html += "<button type='button' aria-label='Pagina successiva' " + (paginaCorrenteNonValidati === numeroPagine ? 'disabled' : "onclick='CaricaRichiesteNonValidate(" + (paginaCorrenteNonValidati + 1) + ", true)'") + "><i class='las la-angle-right'></i></button>";
        html += "</div><span class='pagination-summary'>" + totale + (totale === 1 ? ' risultato' : ' risultati') + '</span>';
        contenitore.append(html);
    });
}

function MostraRichiesteNonValidate(richieste) {
    const contenitore = $('.archive-list-not-validated');
    contenitore.empty();

    if (!richieste || richieste.length === 0) {
        contenitore.append("<ul><li style='width:100%; text-align:center; padding:10px'>Nessuna richiesta non validata trovata</li></ul>");
        return;
    }

    richieste.forEach(richiesta => {
        const rata = richiesta.numeroRata === 0 ? 'Rata unica' : richiesta.numeroRata;
        const scadenza = new Date(richiesta.expirationDate).toLocaleDateString('it-IT', { year: 'numeric', month: '2-digit', day: '2-digit' });
        const tipo = tipiOperazioneNonValidati[richiesta.operationTypeId] || '';
        const errore = richiesta.message && richiesta.message.trim() ? richiesta.message.trim() : 'Validazione IUV non riuscita.';
        const erroreSicuro = CodificaHtmlNonValidati(errore);
        let html = '<ul>';
        html += '<li>' + CodificaHtmlNonValidati(richiesta.id) + '</li>';
        html += '<li>' + CodificaHtmlNonValidati(richiesta.codiceIdentificativoUnivocoPagatore) + '</li>';
        html += '<li>' + CodificaHtmlNonValidati(richiesta.iuv) + '</li>';
        html += '<li>' + CodificaHtmlNonValidati(tipo) + '</li>';
        html += '<li>' + CodificaHtmlNonValidati(richiesta.price) + '€</li>';
        html += '<li>' + CodificaHtmlNonValidati(rata) + '</li>';
        html += '<li>' + CodificaHtmlNonValidati(scadenza) + '</li>';
        html += "<li class='validation-status'><strong style='color:#EA5555;'><i class='las la-times'></i>&nbsp;NON VALIDATA</strong><small class='validation-error-message' title='" + erroreSicuro + "'>" + erroreSicuro + '</small></li>';
        html += '</ul>';
        contenitore.append(html);
    });
}

function FiltraRichiesteNonValidate() {
    CaricaRichiesteNonValidate(1, true);
}

function SvuotaFiltriNonValidati() {
    $('#dataInizio,#dataFine,#codiceFiscale,#iuv,#importoMinimo,#importoMassimo').val('');
    CaricaRichiesteNonValidate(1, true);
}

function CambiaElementiPerPaginaNonValidati(valore) {
    elementiPerPaginaNonValidati = Number(valore) || 100;
    CaricaRichiesteNonValidate(1, true);
}

$(function () {
    $('.preload').show();
    CaricaTipiOperazioneNonValidati().always(function () {
        CaricaRichiesteNonValidate(1, true);
    });
});

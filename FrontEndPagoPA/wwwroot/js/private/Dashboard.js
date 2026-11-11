$(function () {
    $.get('/Action/GetRichiesteNonValidateCount', function (response) {
        const risultato = JSON.parse(response);
        const conteggio = risultato && risultato.IsSuccess ? Number(risultato.Result) || 0 : 0;
        $('#invalid-iuv-count').text('(' + conteggio.toLocaleString('it-IT') + ')');
    }).fail(function () {
        $('#invalid-iuv-count').text('(—)');
    });
});

Dropzone.options.dropzoneForm = {
    url: "/Action/UploadFileCsv?bollettino=1",
    paramName: "file",
    maxFilesize: 50,
    maxFiles: 1,
    chunking: true,
    acceptedFiles: ".csv",
    dictDefaultMessage: "<i class='fas fa-file-upload'></i><br>Trascina un file oppure clicca per effettuare l'upload",
    init: function () {
        this.on("maxfilesexceeded", function (data) {
            var res = eval('(' + data.xhr.responseText + ')');
        });
        this.on("addedfile", function (file) {
        });
        this.on("processing", function (file) {
            $('.progress-bar').css('width', '0%');
            $('.progress-bar').text('0%');
        });
        this.on("complete", function (file) {
            this.removeFile(file);
        });
        this.on("uploadprogress", function (file, a) {
            $('.progress-bar').css('width', parseInt(a) + '%');
            $('.progress-bar').text(parseInt(a) + '%');
            if (a === 100) {
                $('.preload-file').html('<i class="fas fa-file-upload"></i><br>Trascina un file oppure clicca per effettuare l\'upload');
            }
        });
    },
    success: function (file, response) {
        $('.btn-submit').removeAttr('disabled');
        $('.csv-list').hide();
        $('.csv-list-body').empty();
        var r = JSON.parse(response);
        if (r.length == 0) {
            $('.modal-title').html('Attenzione');
            $('.modal-body').html('Attenzione si è verificato un problema nel caricamento del csv. Il nome delle colonne non risulta corretto. Modificare le colonne e ricaricare il file.');
            $('#exampleModal').modal('show');
        }
        else {
            if (r.filter(a => a.valid == true).length == 0) {
                $('.modal-title').html('Attenzione');
                $('.modal-body').html('Attenzione si è verificato un problema con tutti i dati presenti nel csv. Controllare il file e ricaricarlo una volta corretto.');
                $('#exampleModal').modal('show');
                $('.btn-submit').attr('disabled', 'disabled');
            }
            for (var i = 0; i < r.length; i++) {
                let err = "";
                let stato = "OK";
                if (!r[i].valid) {
                    err = " class='error-csv'";
                    stato = "KO";
                }
                let res = "<ul " + err + ">" +
                    "<li>" + r[i].nominativo + "</li>" +
                    "<li>" + r[i].codicefiscale + " </li>" +
                    "<li>€" + r[i].totale + "</li>" +
                    "<li class='text-center'>" + r[i].numeroRatei + "</li>" +
                    "<li><strong>" + stato + "</strong></li>" +
                    "<li>" + r[i].message + "</li>" +
                    "</ul>";

                $('.csv-list-body').append(res);
            }

            $('.csv-list').show();

            $('.lista').val(true);
        }
    }

};


$(function () {
    GetUsers();
});

$('.frm').on('submit', function () {
    if ($('.lista').val() != "true") {
        $('.modal-title').html('Attenzione');
        $('.modal-body').html('Prima di procedere caricare una lista csv');
        $('#exampleModal').modal('show');
        return false;
    };
})

function GetOperationType(id) {
    $('.operationType').empty();
    $('.operationType').append('<option value="">Seleziona un tipo</option>')
    $.get("/Action/GetOperationTypes", function (res) {
        let r = JSON.parse(res);
        $.get("/User/GetOperationTypeSenderUser/" + id, function (resx) {
            let op = JSON.parse(resx).map(a => a.operationTypeId);
            for (var i = 0; i < r.Result.length; i++) {
                if (op.indexOf(r.Result[i].id) >= 0)
                    $('.operationType').append('<option value="' + r.Result[i].id + '">' + r.Result[i].typeName + '</option>')
            }
        });
    })
}

function CheckOperationType() {
    var selectedOption = $('.operationType').val();
    if (selectedOption == "3") {
        $('#rate-select').prop('disabled', true);
        $('#rate-list').empty();

    } else
        $('#rate-select').prop('disabled', false);
}

function GetUsers() {
    $.get("/User/GetUsers", function (res) {
        var r = JSON.parse(res);
        for (var i = 0; i < r.length; i++) {
            $('.user').append('<option value="' + r[i].id + '">' + r[i].businessName + '</option>')
        }
    })
}

function GetPreload() {
    $('.preload').show();
}

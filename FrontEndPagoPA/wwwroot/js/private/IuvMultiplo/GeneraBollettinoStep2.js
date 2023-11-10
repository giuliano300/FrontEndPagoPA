Dropzone.options.dropzoneForm = {
    url: "/Action/UploadFileZip",
    paramName: "file",
    maxFilesize: 50,
    maxFiles: 1,
    chunking: true,
    acceptedFiles: ".zip",
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
        $('.csv-list').hide();
        $('.csv-list-body').empty();
        var r = jQuery.parseJSON(response);
        if (r.length == 0) {
            $('.modal-title').html('Attenzione');
            $('.modal-body').html('Attenzione si è verificato un problema nel caricamento del csv. Il nome delle colonne non risulta corretto. Modificare le colonne e ricaricare il file.');
            $('#exampleModal').modal('show');
        }
        else {
            if (r.filter(a => a.valid == true).length == 0) {
                $('.modal-title').html('Attenzione');
                $('.modal-body').html('Attenzione si è verificato un problema con tutti i file presenti nello zip. Controllare il file e ricaricarlo una volta corretto.');
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
$(function () {
    $.get("/Action/GetOperationTypes", function (res) {
        let r = JSON.parse(res);
        let op = operationTypesId;
        for (var i = 0; i < r.Result.length; i++) {

            let selected = "";

            if (op.indexOf(r.Result[i].id) >= 0)
                selected = "selected";

            $('.multiple-select').append('<option value=' + r.Result[i].id + ' ' + selected + '> ' + r.Result[i].typeName + ' </option>')
        }
    });

    if ($('#contoBanca').is(':checked')) 
        $('#CBILL').removeAttr('readonly');

    if ($('#contoPostale').is(':checked')) 
        $('#numeroContoPoste').removeAttr('readonly');


    $('#contoBanca').on('change', function () {
        if ($(this).is(':checked')) 
            $('#CBILL').removeAttr('readonly');
        else
        {
            $('#CBILL').val('');
            $('#CBILL').attr('readonly', 'readonly');
        }

    })

        $('#contoPostale').on('change', function () {
            if ($(this).is(':checked')) 
                $('#numeroContoPoste').removeAttr('readonly');
            else
            {
                $('#numeroContoPoste').val('');
                $('#numeroContoPoste').attr('readonly', 'readonly');
            }
    })

})
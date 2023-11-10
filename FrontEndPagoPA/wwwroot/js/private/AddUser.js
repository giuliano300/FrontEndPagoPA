$(function () {
    $.get("/Action/GetOperationTypes", function (res) {
        let r = $.parseJSON(res);
        let op = operationTypesId;
        for (var i = 0; i < r.Result.length; i++) {

            let selected = "";

            if (op.indexOf(r.Result[i].id) >= 0)
                selected = "selected";

            $('.multiple-select').append('<option value=' + r.Result[i].id + ' ' + selected + '> ' + r.Result[i].typeName + ' </option>')
        }
    })
})
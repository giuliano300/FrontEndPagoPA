$(function () {
    $("#loginForm").validate({
        rules: {
            userName: {
                required: true,
            },
            password: {
                required: true,
                minlength: 6,
            },
        },
        messages: {
            userName: {
                required: "L'email è obbligatoria",
                email: "Il formato dell'email è errato",
            },
            password: {
                required: "La password è obbligatoria",
                minlength: "La password deve essere almeno di 6 lettere.",
            },
        },
    });
});
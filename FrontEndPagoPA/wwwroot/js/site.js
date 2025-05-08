$(function () {
    $('.nav li').on('click', function () {
        $('.nav--sub').slideUp();
        $(".nav--sub", this).slideDown(200);
    })

//    $("#myId").dropzone({ url: "/Upload/FilePdf" });


    $('#rate-list').hide();
    $('#rate-select').change(function () {
        if ($('#rate-select').val() != '0') {
            $('#rate-list').fadeIn(200);
        } else {
            $('#rate-list').hide();
        }
    });

});




function PwdRecovery() {
    $(".panel-login").fadeOut(100, function () {
        $(".panel-pwd").delay(100).fadeIn(300);
    });
}
function BackLogin() {
    $(".panel-pwd").fadeOut(100, function () {
        $(".panel-login").delay(100).fadeIn(300);
    });
}

function OpenMenuUser() {
    $(".header_nav_user ul").fadeToggle(100);
}

function PersonalArea() {
    var currentPassword = $("#currentPassword").val();
    if (currentPassword) {
        $("#newPassword").prop("required", true);
        $("#confirmNewPassword").prop("required", true);
    } else {
        $("#newPassword").prop("required", false);
        $("#confirmNewPassword").prop("required", false);
    }
}

//function togglePasswordFields() {
//    $("#togglePasswordFields").click(function () {
//        $("#passwordFields").toggle();
//        $("#togglePasswordFields").toggle();
//    });
//}

//// Call the function when the document is ready
//$(function () {
//    togglePasswordFields();
//});





/* GSAP Animation
----------------------------------------------------------------*/

let tl = gsap.timeline();

tl.to(".fade-in", { opacity: 1, y: 0, duration: 0.2, stagger: 0.2, ease: Power4.easeOut }, "0.2");












$(function () {
    $('.nav > ul > li.has-sub').each(function () {
        const $item = $(this);
        const isOpen = $item.hasClass('open');
        $item.children('.nav--sub').toggle(isOpen);
        $item.children('.nav-parent').attr('aria-expanded', isOpen ? 'true' : 'false');
    });
    $('.nav-parent').on('click', function () {
        const $item = $(this).closest('.has-sub');
        const willOpen = !$item.hasClass('open');
        $('.nav > ul > li.has-sub').not($item).removeClass('open').children('.nav--sub').stop(true, true).slideUp(180);
        $('.nav > ul > li.has-sub').not($item).children('.nav-parent').attr('aria-expanded', 'false');
        $item.toggleClass('open', willOpen).children('.nav--sub').stop(true, true)[willOpen ? 'slideDown' : 'slideUp'](180);
        $(this).attr('aria-expanded', willOpen ? 'true' : 'false');
    });

    function setMobileMenu(open) {
        $('body').toggleClass('nav-open', open);
        $('.mobile-menu-toggle').attr('aria-expanded', open ? 'true' : 'false');
    }
    $('.mobile-menu-toggle').on('click', function () { setMobileMenu(true); });
    $('.mobile-menu-close, .nav-backdrop').on('click', function () { setMobileMenu(false); });
    $('.nav a').on('click', function () {
        if (window.matchMedia('(max-width: 991px)').matches) setMobileMenu(false);
    });
    $('.header-create-trigger').on('click', function (event) {
        event.stopPropagation();
        const $menu = $(this).closest('.header-create-menu');
        const open = !$menu.hasClass('is-open');
        $menu.toggleClass('is-open', open);
        $(this).attr('aria-expanded', open ? 'true' : 'false');
    });
    $('.header-create-options').on('click', function (event) { event.stopPropagation(); });
    $(document).on('click', function () {
        $('.header-create-menu').removeClass('is-open').find('.header-create-trigger').attr('aria-expanded', 'false');
    });
    $(document).on('keydown', function (event) {
        if (event.key === 'Escape') {
            setMobileMenu(false);
            $('.header-create-menu').removeClass('is-open').find('.header-create-trigger').attr('aria-expanded', 'false').trigger('focus');
        }
    });
    $('.password-toggle').on('click', function () {
        const $button = $(this);
        const $input = $button.siblings('input');
        const show = $input.attr('type') === 'password';
        $input.attr('type', show ? 'text' : 'password');
        $button.attr('aria-pressed', show ? 'true' : 'false').attr('aria-label', show ? 'Nascondi password' : 'Mostra password');
        $button.find('i').toggleClass('bx-show', !show).toggleClass('bx-hide', show);
    });

    /* Archive pages: filters are a separate, collapsed surface. */
    $('.request-archive').each(function () {
        const $card = $(this);
        const $filterHeading = $card.children('.row').first();
        const $filterForm = $card.children('.form-site').first();
        if (!$filterForm.length || $card.prev('.archive-filter-panel').length) return;

        const $panel = $('<details class="archive-filter-panel"></details>');
        const $summary = $('<summary class="archive-filter-panel__summary"><span class="archive-filter-panel__icon" aria-hidden="true"><i class="bx bx-filter-alt"></i></span><span class="archive-filter-panel__copy"><strong>Filtri di ricerca</strong><small>Restringi i risultati per trovare rapidamente ciò che cerchi</small></span><span class="archive-filter-panel__state" aria-hidden="true"><i class="bx bx-chevron-down"></i></span></summary>');
        const $body = $('<div class="archive-filter-panel__body"></div>');

        $body.append($filterForm.removeClass('p-0'));
        $panel.append($summary, $body);
        $card.before($panel);
        $filterHeading.remove();
        $card.addClass('archive-table-card').prepend('<div class="archive-table-toolbar"><span class="archive-table-toolbar__icon" aria-hidden="true"><i class="bx bx-list-ul"></i></span><span><strong>Risultati</strong><small>Elenco aggiornato in base ai filtri applicati</small></span></div>');
    });

    /* Recommended IUV option is presented first, visually and in reading order. */
    $('.position-options').each(function () {
        $(this).children('.position-option--primary').first().prependTo(this);
    });

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

if (typeof gsap !== 'undefined' && document.querySelector('.fade-in')) {
    let tl = gsap.timeline();
    tl.to(".fade-in", { opacity: 1, y: 0, duration: 0.2, stagger: 0.2, ease: "power4.out" }, "0.2");
}












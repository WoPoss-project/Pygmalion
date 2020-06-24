
function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() +(days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    } else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}



function language () {
    var siglas = document.getElementsByClassName('language');
    for (i = 0; i < siglas.length; i++) {
        siglas[i].addEventListener('click', changeLang, false);
    }
    var lang = readCookie('lg');
    if (lang) {
        createCookie('lg', lang, 30);
        changeLang();
    } else {
        var LNG = window.navigator.language.substring(0, 2);
        if (LNG == 'la') {
            var lang = LNG;
        } else {
            var lang = 'en';
        }
        createCookie('lg', lang, 30);
        changeLang();
    }
}



function changeLang() {
    if (typeof this.dataset.idno === 'undefined') {
        var id = readCookie('lg')
    } else {
        var id = this.dataset.idno;
    }
    createCookie('lg', id, 30);
    var ens = document.getElementsByClassName('en');
    var ensLength = ens.length;
    var las = document.getElementsByClassName('la');
    var lasLength = las.length;
    var languageCodes = document.querySelectorAll('.languages > a');
    var languageCodesLength = languageCodes.length;
    for (i = 0; i < languageCodesLength; i++) {
        if (languageCodes[i].dataset.idno == id) {
            languageCodes[i].style.textShadow = '1px 2px 1px';
        } else {
            languageCodes[i].style.textShadow = 'none';
        }
    }
    switch (id) {
        case 'la':
            for (var i = 0; i < ensLength; i++) {
                ens[i].style.display = 'none';
            }
            for (var i = 0; i < lasLength; i++) {
                las[i].style.display = 'inline';
            }
            break;
        case 'en':
            for (var i = 0; i < lasLength; i++) {
                las[i].style.display = 'none';
            }
            for (var i = 0; i < ensLength; i++) {
                ens[i].style.display = 'inline';
            }
    }
}

window.addEventListener('load', language, false);
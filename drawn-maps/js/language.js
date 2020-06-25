
//Cookie management functions from http://www.quirksmode.org/js/cookies.html


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


/*Project-specific code begins here


 * Listen for clicks on the language codes to change language
 * When the page loads, create a new cookie with the old value, so that it lasts 30 days
 */

function language_init () {
    var i, length;
    var codes = document.getElementsByClassName('language');
    for (i = 0; i < codes.length; i++) {
        codes[i].addEventListener('click', changeLang, false);
    }
    var lang = readCookie('lg');

    /*Unless user has the browser in Latin, the default language is English*/
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

/*
* Called from init and when a language code is clicked;
* if this.dataset.idno is undefined, it's been called from init, so the current cookie value should be used (if any)
* otherwise get the language from the language code that's been clicked.
* The language codes have a @data-idno attribute instead of @id because there is more than one
* language menu by page.
*/

function changeLang() {
    if (typeof this.dataset.idno === 'undefined') {
        var id = readCookie('lg')
    } else {
        var id = this.dataset.idno;
    }
    createCookie('lg', id, 30);
    var ens = document.getElementsByClassName('en');
    var las = document.getElementsByClassName('la');
    var languageCodes = document.querySelectorAll('.languages > a');

    /*Add some styling so it is visible which language has been selected*/

    for (i = 0; i < languageCodes.length; i++) {
        if (languageCodes[i].dataset.idno == id) {
            languageCodes[i].style.textShadow = '1px 2px 1px';
        } else {
            languageCodes[i].style.textShadow = 'none';
        }
    }

    /*Change the CSS property display depending on the selected language*/

    switch (id) {
        case 'la':
            for (var i = 0; i < ens.length; i++) {
                ens[i].style.display = 'none';
            }
            for (var i = 0; i < las.length; i++) {
                las[i].style.display = 'inline';
            }
            break;
        case 'en':
            for (var i = 0; i < las.length; i++) {
                las[i].style.display = 'none';
            }
            for (var i = 0; i < ens.length; i++) {
                ens[i].style.display = 'inline';
            }
    }
}

window.addEventListener('load', language_init, false);
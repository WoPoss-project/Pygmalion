// var targets = document.querySelectorAll('.sense');

window.addEventListener('DOMContentLoaded', function () {
    var senses = document.querySelectorAll('.sense');
    for (var i = 0; i < senses.length; i++) {
        senses[i].addEventListener('click', hide, false);
    }
}, false);


function hide() {
    paths = document.querySelectorAll('.sense.' + CSS.escape(this.id));
    targets = document.querySelectorAll('.sense:not(.' + CSS.escape(this.id) + ')');
    connections = document.querySelectorAll('.links.' + CSS.escape(this.id));
    for (var i = 0; i < targets.length; i++) {
        targets[i].style.display = 'none'
    };
    for (var i = 0; i < paths.length; i++) {
        paths[i].addEventListener('dblclick', show, false)
    };
    for (var i = 0; i < connections.length; i++) {
        connections[i].style.display = "inline"
    }

}

function show() {
    clear();
    senses = document.querySelectorAll('.sense');
    for (var i = 0; i < senses.length; i++) {
        senses[i].style.display = 'inline'

    }
}

function clear() {
    links = document.getElementsByClassName('links');
    for (var i = 0; i < links.length; i++) {
        links[i].style.display = "none"
    }

}


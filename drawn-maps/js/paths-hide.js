
/*Listen for a click in one of the senses*/

window.addEventListener('DOMContentLoaded', function () {
    var senses = document.querySelectorAll('.sense');
    for (var i = 0; i < senses.length; i++) {
        senses[i].addEventListener('click', hide, false);
    }
}, false);


function hide() {
    /*Definition of the semantic path: all senses that have a @class value that matches the ID of the selected
    * sense*/

    paths = document.querySelectorAll('.sense.' + CSS.escape(this.id));
    targets = document.querySelectorAll('.sense:not(.' + CSS.escape(this.id) + ')');
    connections = document.querySelectorAll('.links.' + CSS.escape(this.id));

    /*All senses not in the path are hidden.
    The links that belong connect the senses of the semantic path
    are shown.
    An event is added to the senses
     in the path so the visualization can be reseted. */

    for (var i = 0; i < targets.length; i++) {
        targets[i].style.display = 'none'
    };
    for (var i = 0; i < connections.length; i++) {
        connections[i].style.display = "inline"
    };
    for (var i = 0; i < paths.length; i++) {
        paths[i].addEventListener('dblclick', show, false)
    }


}

/*Reset the visualization*/

function show() {
    clear();
    senses = document.querySelectorAll('.sense');
    for (var i = 0; i < senses.length; i++) {
        senses[i].style.display = 'inline'

    }
}

/*Hide the lines connecting the senses*/

function clear() {
    links = document.getElementsByClassName('links');
    for (var i = 0; i < links.length; i++) {
        links[i].style.display = "none"
    }

}


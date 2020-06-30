/*Code taken from: https://github.com/bigspotteddog/ScrollToFixed*/

$(document).ready(function() {
    $('#menu').scrollToFixed();

    $('#timeline').scrollToFixed({
        marginTop: $('#menu').outerHeight() + 10,
        limit: function() {
            var limit = $('#footer').offset().top - $('#timeline').outerHeight(true) - 10;
            return limit;
        }});
});


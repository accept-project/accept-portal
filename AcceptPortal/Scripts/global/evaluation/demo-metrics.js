$(function () {
    $('#demometrics').visualize({ type: 'pie', height: '300px', width: '600px' });
    $('#demometrics').visualize({ type: 'bar', width: '600px' });
});

$(document).ready(function () {
    $("span.label").css("background-color", "transparent");
});
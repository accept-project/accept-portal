//portal global custom methods.

//core audit method.
function globalPageVisitAudit(auditUrl, callback) {
    $.ajax({
        url: auditUrl,
        type: 'GET',       
        success: function (data) {callback},
        complete: function () {},
        error: function () {},
        data: {},
        cache: false,
        async: true
    });
}

//validates an email address.
function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

//returns a given parameter value from query string.
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.search);
    if (results == null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}

//extending method that allows to deserialize a JSON string. 
$.extend({
    parseJSON: function (data) {
        if (typeof data !== "string" || !data) {
            return null;
        }
        data = jQuery.trim(data);

        if (/^[\],:{}\s]*$/.test(data.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")
				.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")
				.replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {

            return window.JSON && window.JSON.parse ?
					window.JSON.parse(data) :
					(new Function("return " + data))();

        } else {
            jQuery.error("Invalid JSON: " + data);
        }
    }
});

//cool trick taken from jquery core library.
function getScript(url, callback) {
    debugger;
    var script,
			head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
    script = document.createElement("script");
    script.src = url;

    //attach handlers for all browsers.
    script.onload = script.onreadystatechange = function (_, isAbort) {
        if (!script.readyState || /loaded|complete/.test(script.readyState)) {
            //handle memory leak in IE.
            script.onload = script.onreadystatechange = null;
            //remove the script.
            if (head && script.parentNode) {
                head.removeChild(script);
            }
            //dereference the script.
            script = undefined;
            //callback if not abort.
            if (!isAbort) {
                callback(200, "success");
            }
        }
    };

    //use "insertBefore" instead of appendChild  to circumvent an IE6 bug.    
    head.insertBefore(script, head.firstChild);
}

//datatables.net methods.

//destroy datatable .net (jquery selector not id should be provided).
function destroyTable(jQuerySelector) {
    var oTable = $(jQuerySelector).dataTable();
    oTable.fnDestroy();
}

//generic method to create localized datatables.net instances
function createDataTable(selector, language)
{
    language = window.location.toString();
    language.indexOf("/fr/") != -1 ? language = "fr" : language.indexOf("/de/") != -1 ? language = "de" : language = "en";
    if(language != null)
        switch (language) {
            case "fr": {
                $(selector).dataTable({
                    "bStateSave": true,
                    "sScrollY": "100%",
                    "bScrollCollapse": true,
                    "bPaginate": false,
                    "bJQueryUI": false,
                    "bPaginate": true,
                    "bLengthChange": true,
                    "bFilter": true,
                    "bSort": true,
                    "bInfo": true,
                    "bAutoWidth": true,
                    "iDisplayLength": 10,
                    "sPaginationType": "bootstrap",
                    "oLanguage": {
                        "sProcessing": "Traitement en cours...",
                        "sSearch": "Rechercher&nbsp;:",
                        "sLengthMenu": "Afficher _MENU_ &eacute;l&eacute;ments",
                        "sInfo": "Affichage de l'&eacute;lement _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
                        "sInfoEmpty": "Affichage de l'&eacute;lement 0 &agrave; 0 sur 0 &eacute;l&eacute;ments",
                        "sInfoFiltered": "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
                        "sInfoPostFix": "",
                        "sLoadingRecords": "Chargement en cours...",
                        "sZeroRecords": "Aucun &eacute;l&eacute;ment &agrave; afficher",
                        "sEmptyTable": "Aucune donnée disponible dans le tableau",
                        "oPaginate": {
                            "sFirst": "Premier",
                            "sPrevious": "Pr&eacute;c&eacute;dent",
                            "sNext": "Suivant",
                            "sLast": "Dernier"
                        },
                        "oAria": {
                            "sSortAscending": ": activer pour trier la colonne par ordre croissant",
                            "sSortDescending": ": activer pour trier la colonne par ordre décroissant"
                        }
                    }
                });
            } break;
            case "de": {                     
                $(selector).dataTable({             
                "bStateSave": true,
                "sScrollY": "100%",
                "bScrollCollapse": true,
                "bPaginate": false,
                "bJQueryUI": false,
                "bPaginate": true,
                "bLengthChange": true,
                "bFilter": true,
                "bSort": true,
                "bInfo": true,
                "bAutoWidth": true,
                "iDisplayLength": 10,               
                "sPaginationType": "bootstrap",              
                "oLanguage": {
                    "sProcessing": "Bitte warten...",
                    "sLengthMenu": "_MENU_ Einträge anzeigen",
                    "sZeroRecords": "Keine Einträge vorhanden.",
                    "sInfo": "_START_ bis _END_ von _TOTAL_ Einträgen",
                    "sInfoEmpty": "0 bis 0 von 0 Einträgen",
                    "sInfoFiltered": "(gefiltert von _MAX_  Einträgen)",
                    "sInfoPostFix": "",
                    "sSearch": "Suchen",
                    "sUrl": "",
                    "oPaginate": {
                        "sFirst": "Erster",
                        "sPrevious": "Zurück",
                        "sNext": "Nächster",
                        "sLast": "Letzter"
                    }
                }
            });} break;
            default: {
                $(selector).dataTable({                   
                    "bStateSave": true,
                    "sScrollX": "100%",
                    "sScrollY": "100%",
                    "bScrollCollapse": true,
                    "bPaginate": false,
                    "bJQueryUI": false,
                    "bPaginate": true,
                    "bLengthChange": true,
                    "bFilter": true,
                    "bSort": true,
                    "bInfo": true,
                    "bAutoWidth": true,
                    "iDisplayLength": 10,
                    "sPaginationType": "bootstrap",
                    "oLanguage": {
                        "sLengthMenu": "_MENU_ records per page"
                    }
                });

            } break;
        }
    else
    {
        $(selector).dataTable({          
            "sDom": 'T<"clear">lfrtip',
            "bStateSave": true,
            "sScrollX": "100%",
            "sScrollY": "100%",
            "bScrollCollapse": true,
            "bPaginate": false,
            "bJQueryUI": false,
            "bPaginate": true,
            "bLengthChange": true,
            "bFilter": true,
            "bSort": true,
            "bInfo": true,
            "bAutoWidth": true,
            "iDisplayLength": 10,            
            "sPaginationType": "bootstrap",
            "oLanguage": {
                "sLengthMenu": "_MENU_ records per page"
            }           
        });
    }
}

//creates a datatables.net instance given a jQuery selector.
function createDataTable2(jQuerySelector) {
    var oTable = $(jQuerySelector).dataTable({
        "sScrollX": "100%",
        "sScrollY": "100%",
        "bScrollCollapse": true,
        "bPaginate": false,
        "bJQueryUI": false,
        "bPaginate": true,
        "bLengthChange": true,
        "bFilter": true,
        "bSort": true,
        "bInfo": true,
        "bAutoWidth": true,
        "iDisplayLength": 20
    });
}

//document is loaded.
$(document).ready(function () {

    //swap top logo img onmouseover.
    $('#topLogo').mouseover(function () {       
        var currentUrl = $(this).attr('src');
        $(this).attr('src', currentUrl.replace('accept_globe_transparent_top.png', 'accept_globe_transparent_white_top.png'));

    }).mouseout(function () {       
        var currentUrl = $(this).attr('src');
        $(this).attr('src', currentUrl.replace('accept_globe_transparent_white_top.png', 'accept_globe_transparent_top.png'));
    });

    //run width/heigth defaults.
    var height = parseInt($(window).height() - 141); 
    $("#divMainContainerPortal").css("min-height", height.toString() + "px");
    var width = parseInt($(window).width() - 100);
    $("#mainHeaderContainer").css("width", width.toString() + "px");

    //click the feedback should trigger a click on the hidden feedback form.
    $("#ddlHeaderFeedback").click(function () {
        $("#contactable_inner").trigger("click");
    });
    

    if ($("#contactable").length > 0) {
        $(function () {
            $('#contactable').contactable({
                subject: feedbackSubjectLabel, emailValue: emailLabel, disclaimer: disclaimerLabel,
                name: nameLabel,
                email: 'Email',
                submit: submitLabel, message: messageLabel
            });
        });
        setTimeout(function () {
            $("#feedback_contactable").click(function () {

                if ($("#feedbackName_contactable").val().length == 0 || $("#subject_contactable").val().length == 0 || $("#feedbackMessage_contactable").val().length == 0) {
                    alert(mandatoryFieldMessage);
                }
                else {
                    $.ajax({
                        url: feedbackEndpointUrl,
                        contentType: 'application/html; charset=utf-8',
                        type: 'GET',
                        dataType: 'html',
                        data: {
                            user: $('#feedbackName_contactable').val().toString(),
                            email: $('#feedbackEmail_contactable').val().toString(),
                            message: $('#feedbackMessage_contactable').val().toString(),
                            link: window.location.toString(),
                            subject: $('#subject_contactable').val().toString()
                        }
                    }).success(function (result) {
                        if (result.toString() == 'True') alert(messageFeedbackSent); else alert(messageFeedbackFailed);
                        $("#contactable #contactable_inner").trigger('click');
                        $('#feedbackName_contactable').val("");
                        $('#subject_contactable').val("");
                        $('#feedbackMessage_contactable').val("");
                    }).error(function (xhr, status) {
                        lert(messageFeedbackFailed);
                        $("#contactable #contactable_inner").trigger('click');
                        $('#feedbackName_contactable').val("");
                        $('#subject_contactable').val("");
                        $('#feedbackMessage_contactable').val("");
                    });
                }
            });
        }, 2000);
    }


});


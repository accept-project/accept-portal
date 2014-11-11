function populateDdList(data) {
    var rulesets = null;
    try {
        rulesets = jQuery.parseJSON(data);
        if (rulesets === null)
            rulesets = data;

    } catch (e) { }
    for (var i = 0; i < rulesets.ResponseObject.length; i++)
        if (rulesets.ResponseObject[i].toString().indexOf("Preediting_") > -1 || rulesets.ResponseObject[i].toString().indexOf("Portal_") > -1)
            $("#ruleSetDdList").append("<option value=\"" + rulesets.ResponseObject[i] + "\">" + rulesets.ResponseObject[i] + "</option>");

    $("#ruleSetDdList").val(currentRuleSetName);
}

$(document).ready(function () {

    $("#txtAreaFrenchhDemo").Accept({
        configurationType: 'tinyMceEmbedded',
        AcceptServerPath: apiUrl,
        ApiKey: apiKey,
        configurationFilesPath: configFilesPath,
        Rule: currentRuleSetName,
        imagesPath: imgsPath,
        styleSheetPath: cssPath,
        checkingLevels: checkingLevels,
        Lang: "fr",
        uiLanguage: 'fr',
        requestFormat: "HTML",
        editorWidth: '600px',
        editorHeight: '400px',
        cssSelectorToolbarMessage: '#mce_25',
        getSessionUser: function () {
            return $("#userPlaceHolder").text();
        }
    });


    setTimeout(function () {


        $("#txtAreaFrenchhDemo_ifr").css("width", "940px")
        $("#mce_9-body").append('<div class="mce-container mce-flow-layout-item mce-btn-group"></div>'
        + '<div class="mce-container mce-flow-layout-item mce-btn-group">'
        + '<div style="padding-top:5px;"><span class="mceSeparator" role="separator" aria-orientation="vertical" tabindex="-1"></span>'
        + '<b style="float:left;">&nbsp;&nbsp;' + ruleSetlLabel + '</b><select style="background:#FFFFFF;font-size:normal;" id="ruleSetDdList" disabled="disabled"></select></div></div>'
        + '<div class="mce-container mce-flow-layout-item mce-btn-group"><div style="padding-top:5px;"><b style="float:left;">&nbsp;&nbsp;' + replaceAllLabel + '</b> &nbsp;<input type="checkbox" id="showFixAllDDList" name="" value="on"  /></div>'
        + '</div><div class="mce-container mce-flow-layout-item mce-btn-group"><div style="padding-top:5px;"><b style="float:left;">&nbsp;&nbsp;' + sequentialChecksLabel + '</b> &nbsp;<input type="checkbox" id="showSequentialRuleSets" checked="checked" name="" value="on"  /></div>'
        + '');


        if ($.browser.msie) {
            var call = apiUrl + '/Core/GetLanguageRulesSet?language=fr';
            var xdr = new XDomainRequest();
            xdr.open("get", call);
            xdr.onload = function () {
                populateDdList(xdr.responseText);
            };
            xdr.onerror = function () {
            };
            xdr.onprogress = function () {
            };
            xdr.ontimeout = function () {
            };
            xdr.onopen = function () {
            };
            xdr.send();
        }
        else {
            $.ajax({
                type: 'GET',
                url: apiUrl + '/Core/GetLanguageRulesSet?language=fr',
                async: false,
                cache: false,
                success: function (data) {
                    populateDdList(data);

                }
            });
        }

        $("#ruleSetDdList").change(function () {
            $.updateRuleSet($("#ruleSetDdList option:selected").val());
        });


        $("#showFixAllDDList").change(function () {
            if ($('#showFixAllDDList').is(':checked'))
                $.updateShowFixAll(true);
            else
                $.updateShowFixAll(false);
        });


        $("#showSequentialRuleSets").click(function () {
            debugger;
            if ($(this).prop('checked') == true) {
                $("#ruleSetDdList").attr('disabled', 'disabled');
                $.setCheckingLevels(checkingLevels);
                $.updateRuleSet("");
            }
            else {
                $('#ruleSetDdList').removeAttr('disabled');
                $.setCheckingLevels([]);

                if ($("#ruleSetDdList option:selected").val().length > 0)
                    $.updateRuleSet($("#ruleSetDdList option:selected").val());
                else
                    $.updateRuleSet(currentRuleSetName);
            }
        });


    }, 1000);
});

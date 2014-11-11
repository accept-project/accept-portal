
function populateDdList(data) {
    var rulesets = null;

    try {
        rulesets = jQuery.parseJSON(data);
        if (rulesets === null)
            rulesets = data;

    } catch (e) { }

    for (var i = 0; i < rulesets.ResponseObject.length; i++)
        if (rulesets.ResponseObject[i].toString().indexOf("Preediting_") > -1)
            $("#ruleSetDdList").append("<option value=\"" + rulesets.ResponseObject[i] + "\">" + rulesets.ResponseObject[i] + "</option>");
    $("#ruleSetDdList").val(currentRuleSetName);
}

$(document).ready(function () {

    $("#txtAreaEnglishDemo").Accept({
        configurationType: 'tinyMceEmbedded',
        AcceptServerPath: apiUrl,
        ApiKey: apiKey,
        imagesPath: imgsPath,
        styleSheetPath: cssPath,
        configurationFilesPath: configFilesPath,
        Lang: "en",
        requestFormat: "HTML",
        Rule: currentRuleSetName,    
        cssSelectorToolbarMessage: '#mce_25',
        editorWidth: '600px',
        editorHeight: '400px',
        showManualCheck: true,
        righClickEnable: false,
        getSessionUser: function () {
            return $("#userPlaceHolder").text();
        }
    });

    setTimeout(function () {
        $("#txtAreaEnglishDemo_ifr").css("width", "940px");
        $("#mce_9-body").append('<div class="mce-container mce-flow-layout-item mce-btn-group"></div>'
        + '<div class="mce-container mce-flow-layout-item mce-btn-group">'
        + '<div style="padding-top:5px;"><span class="mceSeparator" role="separator" aria-orientation="vertical" tabindex="-1"></span>'
        + '<b style="float:left;">&nbsp;&nbsp;' + ruleSetlLabel + '</b><select style="background:#FFFFFF;font-size:normal;" id="ruleSetDdList"></select></div></div>'
        + '<div class="mce-container mce-flow-layout-item mce-btn-group"><div style="padding-top:5px;"><b style="float:left;">&nbsp;&nbsp;' + replaceAllLabel + '</b> &nbsp;<input type="checkbox" id="showFixAllDDList" name="" value="on"  /></div>'
        + '</div>');
        if ($.browser.msie) {
            var call = apiUrl + '/Core/GetLanguageRulesSet?language=en';
            //use ms xdr obj.								
            var xdr = new XDomainRequest();
            xdr.open("GET", call);
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
                url: apiUrl + '/Core/GetLanguageRulesSet?language=en',
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

    }, 1000);

});

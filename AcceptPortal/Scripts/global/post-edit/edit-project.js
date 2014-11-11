
$(document).ready(function () {

    $(".help-tooltip").attr("data-placement", "right");
    $(".help-tooltip").tooltip();
    $("#divGlobalHeaderMargin").css("margin-top", "20px");
    $("#ddlParaphrasing").prop('selectedIndex', parseInt(paraPhrasingMode));
    $("#").prop('selectedIndex', parseInt(paraPhrasingMode));

    $("#hddListOptions").val("_$#$_");

    if (displayTranslationOptions.ID == 2)
        $('#ddlShowTranslationOptions>option:nth-child(2)').attr('selected', true);

    if (uiConfiguration == 2)
        $('#Project_InterfaceConfigurationId>option:nth-child(2)').attr('selected', true);

    if (customUIConfiguration == 1)
        $('#Project_CustomInterfaceConfiguration>option:nth-child(2)').attr('selected', true);

    for (var i = 0; i < ddlOptions.length; i++) {
        $("#optionsList").append('<option>' + ddlOptions[i].Option + '</option>');
        var currentList = $("#hddListOptions").val();
        $("#hddListOptions").val(currentList + "_$#$_" + ddlOptions[i].Option);
    }

    $("#addOptionLabel").click(function () {
        if ($.trim($("#txtOptions").val())) {
            var count = $("#optionsList option").length;
            if ($("#optionsList option").length <= 8) {
                $("#optionsList").append('<option>' + $("#txtOptions").val() + '</option>');
                var currentList = $("#hddListOptions").val();
                $("#hddListOptions").val(currentList + "_$#$_" + $("#txtOptions").val());
                $("#txtOptions").val("");
            }
        }
    });

    $("#removeOptionLabel").click(function () {
        if ($("#optionsList option").length > 0) {
            var currentList = $("#hddListOptions").val();
            currentList = currentList.replace($("#optionsList option:last").val(), "");
            $("#hddListOptions").val(currentList);
            $("#optionsList option:last").remove();
        }
    });

    $("#btnUpdateProject").click(function () {
        if ($("#srcLang option:selected").text() === $("#tgtLang option:selected").text() && $("#srcLang option:selected").text() !== labelOthers && $("#tgtLang option:selected").text() !== labelOthers)
            alert(message);
        else
            $("#editProjectForm").submit();
    });

    if ($("#Project_External").attr('checked') == true) {
        $('#Project_EmailInvitationBodyText').attr('disabled', 'disabled');
        $('#Project_ProjectSurvey').attr('disabled', 'disabled');
    }

    $("#chkSingleRevision").click(function () {
        if (this.checked)
            $('#inputMaxThreshold').removeAttr('disabled');
        else
            $('#inputMaxThreshold').attr('disabled', 'disabled');
    });

    $("#ddlParaphrasing").change(function () {
        if ($(this).prop('selectedIndex') === 1)
            $("#ddlShowTranslationOptions").prop('selectedIndex', 1);
        else
            $("#ddlShowTranslationOptions").prop('selectedIndex', 0);
    });

    $("#ddlShowTranslationOptions").change(function () {
        if ($(this).prop('selectedIndex') === 0)
            $("#ddlParaphrasing").prop('selectedIndex', 0);
        else
            $("#ddlParaphrasing").prop('selectedIndex', 1);
    });


});
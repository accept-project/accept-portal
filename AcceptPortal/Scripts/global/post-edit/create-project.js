
$(document).ready(function () {

    $(".help-tooltip").attr("data-placement", "right");
    $(".help-tooltip").tooltip();

    $("#divGlobalHeaderMargin").css("margin-top", "30px");
    $('#inputMaxThreshold').attr('disabled', 'disabled');

    $("#chkSingleRevision").click(function () {
        if (this.checked)
            $('#inputMaxThreshold').removeAttr('disabled');
        else
            $('#inputMaxThreshold').attr('disabled', 'disabled');
    });

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

    $("#hddListOptions").val("_$#$_");

    $("#btnCreateProject").click(function () {
        if ($("#srcLang option:selected").text() === $("#tgtLang option:selected").text() && $("#srcLang option:selected").text() !== labelOthers && $("#tgtLang option:selected").text() !== labelOthers)
            alert(message);
        else
            $("#createProjectForm").submit();
    });

    $("#Project_External").click(function () {
        if (this.checked) {
            $('#Project_EmailInvitationBodyText').attr('disabled', 'disabled');
            $('#Project_ProjectSurvey').attr('disabled', 'disabled');
        }
        else {
            $('#Project_EmailInvitationBodyText').removeAttr('disabled');
            $('#Project_ProjectSurvey').removeAttr('disabled');
        }
    });

    $("#ddlParaphrasing").change(function () {
        if ($(this).prop('selectedIndex') === 1)
            $("#ddlShowTranslationOptions").prop('selectedIndex', 1);
        else
            $("#ddlShowTranslationOptions").prop('selectedIndex', 0);
    });

    $("#ddlShowTranslationOptions").change(function () {
        if ($("#tgtLang").val() == 1 || $("#tgtLang").val() == 2) {
            if ($(this).prop('selectedIndex') === 0)
                $("#ddlParaphrasing").prop('selectedIndex', 0);
            else
                $("#ddlParaphrasing").prop('selectedIndex', 1);
        }
    });

    $("#tgtLang").change(function () {

        if ($(this).val() == englishLanguageId) {
            $("#Project_InteractiveCheckMetadata").removeAttr('disabled');
            $("#Project_InteractiveCheck").removeAttr('disabled');
            $("#Project_ParaphrasingMetadata").val(englishParaphrasingDefaultSystemId);
            $("#Project_InteractiveCheckMetadata").val(englishRuleSet);

            $('#Project_ParaphrasingMetadata').removeAttr('disabled');
            $("#ddlParaphrasing").removeAttr('disabled');
        }
        else
            if ($(this).val() == frenchLanguageId) {
                $("#Project_InteractiveCheckMetadata").removeAttr('disabled');
                $("#Project_InteractiveCheck").removeAttr('disabled');
                $("#Project_ParaphrasingMetadata").val(frenchParaphrasingDefaultSystemId);
                $("#Project_InteractiveCheckMetadata").val(frenchRuleSet);
                $('#Project_ParaphrasingMetadata').removeAttr('disabled');
                $("#ddlParaphrasing").removeAttr('disabled');
            }
            else
                if ($(this).val() == germanLanguageId) {
                    $("#ddlParaphrasing").prop('selectedIndex', 0);
                    $("#ddlParaphrasing").attr('disabled', 'disabled');
                    $('#Project_ParaphrasingMetadata').val("");
                    $('#Project_ParaphrasingMetadata').attr('disabled', 'disabled');
                    $("#Project_InteractiveCheckMetadata").val(germanRuleSet);

                    $("#Project_InteractiveCheckMetadata").removeAttr('disabled');
                    $("#Project_InteractiveCheck").removeAttr('disabled');
                }
                else {
                    $("#ddlParaphrasing").prop('selectedIndex', 0);
                    $("#ddlParaphrasing").attr('disabled', 'disabled');
                    $('#Project_ParaphrasingMetadata').val("");
                    $('#Project_ParaphrasingMetadata').attr('disabled', 'disabled');
                    $("#Project_InteractiveCheck").prop('selectedIndex', 0);
                    $("#Project_InteractiveCheck").attr('disabled', 'disabled');
                    $("#Project_InteractiveCheckMetadata").val("");
                    $("#Project_InteractiveCheckMetadata").attr("disabled", "disabled");
                }
    });
});




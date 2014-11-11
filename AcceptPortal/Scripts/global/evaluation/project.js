$(document).ready(function () {

    $("#myProjectDetails").click(function (e) {
        e.preventDefault();
        if ($("#dialogMyProject").length > 0)
            $("#dialogMyProject").dialog("destroy");
        $("#dialogMyProject").dialog();


    });

    $("#divAddContentDialog").dialog({
        title: dialogTitle, modal: false, resizable: false, autoOpen: false,
        buttons:
    {
        uploadMethod: function () {
            var f = $("#formUploadFile");
            if (f != null)
                f.submit();
            $("#divAddContentDialog").dialog('close');
        }
    }
    });

    $("#addContentToProject").click(function (e) {

        e.preventDefault();
        $("#divAddContentDialog").dialog("option", { position: [e.pageX, e.pageY] });
        $("#divAddContentDialog").dialog('open');

    });

    $('#formUploadFile').ajaxForm({
        complete: function (xhr) {
            alert(xhr.responseText);
        }
    });
});
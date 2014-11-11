function loadUsersTable() {
    $("#divUsersInProjectPlaceholder").css("display", "none");
    $("#divUsersInProjectPlaceholder").empty();
    $("#divManageProjectLoader").css("display", "block");

    $("#divUsersInProjectPlaceholder").load(allUsersInProjectUrlPath, function () {
        $("#txtAddUserToProject").val("");
        $("#divManageProjectLoader").css("display", "none");
        $("#divUsersInProjectPlaceholder").css("display", "block");
        createDataTable("#tblUsersInProject");
    });
}

$(document).ready(function () {
    $('#tblPostEditTasks').contents().find(".EditTask").AcceptPostEdit({
        textIdContainer: 'title',
        dialogHeight: 630,
        dialogWidth: 1050,
        acceptServerPath: apiUrl,
        userIdSelector: 'div.userContainer',
        userIdContainer: 'title',
        imagesPath: imagesPath,
        acceptHubUrl: acceptSignalRHubUrlPath,
        cssPath: cssPath,
        interactiveCheckConfigPath: configFiles
    });

    createDataTable("#tblPostEditTasks");

    //dialog upload pos edit document.
    $("#btnOpenUploadDialog").click(function () {
        $("#divUploadFileDialog").dialog({ width: 'auto', height: 'auto', resizable: true, modal: false, title: uploadDialogTitle });
    });

    //add user to project event bind.
    $("#btnAddUserToProject").click(function () {

        $.ajax({
            type: "POST",
            url: portalUrl + '/Admin/UserProject',
            contentType: "application/json",
            dataType: 'json',
            async: true,
            cache: false,
            data: '{"UserName":"' + $("#txtAddUserToProject").val() + '", "token":"' + token + '" }',
            success: function () {
                alert("User: " + $("#txtAddUserToProject").val() + " " + messageInternalProjectUserAdded);
                loadUsersTable();
            },
            error: function () {
                alert("User: " + $("#txtAddUserToProject").val() + " " + messageInternalProjectUserNotAdded);
                loadUsersTable();
            }
        });
    });

    //dialog manage pos edit project.
    $("#btnDialogManageProject").click(function () {
        $("#divDialogManageProject").dialog({
            width: 600, height: 400, resizable: true, modal: false, title: manageProjectDialogTitle,
            open: function () {
                loadUsersTable();

            }, buttons:
            {
                labelClose: function () { $("#divDialogManageProject").dialog("destroy"); destroyTable("#tblUsersInProject"); },
                labelRemoveSelected: function () {
                    $("#divUsersInProjectPlaceholder").css("display", "none");
                    $("#divManageProjectLoader").css("display", "block");
                    $("#tblUsersInProject input:checked").each(function () {
                        var name = $(this).val();
                        $.ajax({
                            context: this,
                            type: "DELETE",
                            url: portalUrl + '/Admin/UserProject',
                            contentType: "application/json",
                            dataType: 'json',
                            async: true,
                            cache: false,
                            data: '{"UserName":"' + name + '", "token":"' + token + '" }',
                            success: function () { },
                            error: function () { }
                        });

                    });

                    loadUsersTable();
                },
            }
        });
    });

    $("#inviteUsersAnchor").click(function () {
        $("#inviteUsersDialog").dialog("destroy");
        $('#inviteUsersDialog').dialog({
            width: 400, height: 300, resizable: true, modal: true,
            open: function (event, ui) { },
            close: function (event, ui) { },
            drag: function (event, ui) { },
            buttons: [
            {
                id: "btn-invite",
                text: inviteButtonText,
                click: function () {
                    var submitForm = true;
                    var splittedEmailsAddresses = [];
                    splittedEmailsAddresses = $('#usersList').val().split(';');
                    if (splittedEmailsAddresses == null || splittedEmailsAddresses.length == 0)
                        submitForm = false;
                    else {
                        for (var i = 0; i < splittedEmailsAddresses.length; i++) {
                            if (!validateEmail(splittedEmailsAddresses[i]))
                                submitForm = false;
                        }

                    }

                    if (submitForm) {
                        $("#InviteForm").submit();
                        $('#inviteUsersDialog').dialog("close");
                    }
                    else
                        alert(messageInvalidEmail);
                }
            }
            ]
        });
    });

    function inviteUsers(usersList) {
        debugger;
        var url = "PostEdit/InviteUsers";
        $.post(url, { "usersList": usersList },
         function (data) {
             //TODO:
         });
    }


    $(function () {
        $('#InviteForm').submit(function () {
            $.ajax({
                url: this.action,
                type: this.method,
                data: $(this).serialize(),
                success: function (result) {
                    // TODO: handle the results of the AJAX call.                         
                    var objResult = result;
                    if (objResult.ResponseStatus == "FAILED") {
                        $("#  modalInviteConfirmationNotSent").dialog("destroy");
                        $("#  modalInviteConfirmationNotSent").dialog({
                            width: 'auto',
                            height: 'auto',
                            modal: true,
                            buttons: {
                                Ok: function () {
                                    $(this).dialog("close");
                                }
                            }
                        });
                    } else {
                        $("#modalInviteConfirmation").dialog("destroy");
                        $("#modalInviteConfirmation").dialog({
                            width: 'auto',
                            height: 'auto',
                            modal: true,
                            buttons:
                            {
                                Ok: function () {
                                    $(this).dialog("close");
                                }
                            }
                        });
                    }

                    $("#inviteUsersDialog").dialog("destroy");

                }
            });
            return false;
        });
    });

    //check whether the request come in from an invitation.                     
    if (uploadFailedMessageDetail != null && uploadFailedMessageDetail.length > 0) {
        alert(uploadFailedMessageDetail.toString());
    }

    //delete task.
    $('b[id^="deleteTask_"]').click(function () {
        debugger;
        var splittedId = $(this).attr("id").split('&');
        $("#modalDeleteTask").dialog("destroy");
        $("#modalDeleteTask").dialog({
            width: 'auto',
            height: 'auto',
            modal: true,
            buttons: [{
                id: "btn-yes",
                text: yesLabel,
                click: function () {
                    var url = $('a[name="deleteTaskAnchor_&' + splittedId[1] + '"]').attr("href");
                    $(this).dialog("close");
                    window.location.href = url;
                }
            },
            {
                id: "btn-no",
                text: noLabel,
                click: function () {
                    $(this).dialog("close");

                }
            }]
        });
    });

    $("#checkTaskStatus").click(function () {
        $('#dialogTaskStatus').dialog({
            autoOpen: false,
            width: 'auto',
            height: 'auto',
            resizable: true,
            modal: true,
            open: function (event, ui) {
                $(this).load(getTaskStatusPartialUrl);
            },
            buttons: {
                "OK": function () {
                    $(this).dialog("close");
                }
            }
        });
        $('#dialogTaskStatus').dialog('open');
    });

    $("#myProjectDetails").click(function (e) {
        e.preventDefault();
        if ($("#dialogMyProject").length > 0)
            $("#dialogMyProject").dialog("destroy");
        $("#dialogMyProject").dialog();
    });

});
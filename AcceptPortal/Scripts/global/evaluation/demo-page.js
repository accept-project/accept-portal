$(document).ready(function () {
    $.ajax({
        url: evaluationQuestionUrl,
        contentType: "application/json",
        type: "GET",
        async: false,
        cache: false,
        dataType: 'jsonp',
        success: function (data) {           
            var text = '';
            var q = data.ResponseObject[0];
            for (var i = 0; i < q.LanguageQuestions.length; i++) {
                question = q.LanguageQuestions[i].Question;
                questionId = q.LanguageQuestions[i].Id;
                language = q.LanguageQuestions[i].Language.Code;
                languageid = q.LanguageQuestions[i].Language.Id
                action = q.LanguageQuestions[i].Action;
                $("div[class^='lia-message-view message-uid-']").each(function () {
                    var id = $(this).attr("class");
                    var PostID = $(this).attr("class").replace("lia-message-view message-uid-", "");
                    var frmName = "voting_" + PostID;

                    text = '<form id="' + frmName + '"><table border=1><tr><td bgcolor=lightgray><b>' + question + '</b></td></tr>';
                    text += '<tr><td><div id="voteoptions">';

                    for (var x = 0; x < q.LanguageQuestions[i].Answers.length; x++) {
                        answer = q.LanguageQuestions[i].Answers[x];
                        if (x == 0)
                            text += '<input id="radioCount_' + answer.Id + '" type="radio" name="choice" value="' + answer.Id + '" checked>' + answer.Name;
                        else
                            text += '<input id="radioCount_' + answer.Id + '" type="radio" name="choice" value="' + answer.Id + '">' + answer.Name;

                    }
                    text += '<br/>';
                    text += '<input  value="' + action + '" type="button" onclick="SubmitVote(\'' + frmName + '\');" />';
                    text += '</div>';
                    text += '<div id="voteresult" style="display:none">';
                    text += '<font color="green">' + q.LanguageQuestions[i].Confirmation + '</font>';
                    text += '</div>';
                    text += '</td></tr>';
                    text += '</table></form>';
                    $(this).find('div[name="voting"]').html(text);
                });
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {           
            alert(errorThrown);
        }
    });

});

function SubmitVote(frmName) {
    var PostID = frmName.replace("voting_", "")
    $('#' + frmName + " input:radio").each(function () {
        if ($(this).is(':checked')) {
            var answerID = $(this).val();
            $.ajax({
                url: evaluationScoreUrl,
                dataType: 'json',
                contentType: "application/json",
                type: 'post',
                data: '{ "key": "' + evaluationApiKey + '", "answer": ' + answerID + ', "param1": ' + PostID + '  }',
                success: function (e) {
                    $('#' + frmName).find('#voteoptions').css("display", "none");
                    $('#' + frmName).find('#voteresult').css("display", "block");
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    //TODO: ?
                }
            });
        }
    });
}
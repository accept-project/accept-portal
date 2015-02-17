var segmentsent = false;

function sendInternalEvaluationAudit(token, user, status, meta) {
    segmentsent = true;
    
    if ($.browser.msie) {
        call = apiUrl + "/Evaluation/EvaluationInternalAudit";
        var xdr = new XDomainRequest();
        xdr.open("POST", call);
        xdr.onload = function () {
        };
        xdr.onerror = function () { };
        xdr.onprogress = function () { };
        xdr.ontimeout = function () { };
        xdr.onopen = function () { };
        xdr.timeout = 5000;
        xdr.send(JSON.stringify({
            "token": "" + token + "", "user": "" + user + "", "status": "" + status + ""
            , "meta": "" + meta + ""
        }));
    }
    else {
    }


}

function sendViaAjax(id, key, answer, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10) {
    
    if ($.browser.msie) {
        call = apiUrl + "/Evaluation/Score/" + id;
        var xdr = new XDomainRequest();
        xdr.open("POST", call);
        xdr.onload = function () {};
        xdr.onerror = function () {};
        xdr.onprogress = function () {};
        xdr.ontimeout = function () {};
        xdr.onopen = function () {};
        xdr.timeout = 5000;
        xdr.send(JSON.stringify({
            "key": "" + key + "", "answer": "" + answer + "", "param1": "" + param1 + ""
            , "param2": "" + param2 + "", "param3": "" + param3 + "", "param4": "" + param4 + "", "param5": "" + param5 + ""
            , "param6": "" + param6 + "", "param7": "" + param7 + "", "param8": "" + param8 + "", "param9": "" + param9 + ""
            , "param10": "" + param10 + ""
        }));
    }
    else {

    }

}


function generateEvaluationMD5Hash(input) {
    return md5(input);
}

function injectForms(questionInEvaluation, selector) {

    var text = '';
    var qIndex = 0;
    var question = questionInEvaluation.Question;
    var questionId = questionInEvaluation.ID;
    var action = questionInEvaluation.Action;
    var uniqueQuestionControlHash = $.trim(question + questionId).replace(/'/g, "\\'");

    $(selector).each(function () {
        $(this).empty();

        var id = $(this).attr("id");
        var contextIndex = $(this).attr("id").split('_')[1];
        var frmName = "voting_" + contextIndex;
        text = '<div style="margin:6px;"><form id="' + frmName + '"><table><tr><td bgcolor=lightgray class="rounded-corners-eval"><b>' + question + '</b></td></tr>';
        text += '<tr><td>' +
          
            '<div style="margin:2px;" id="voteoptions_' + contextIndex + '">';

        for (var x = 0; x < questionInEvaluation.Answers.length; x++) {

            answer = questionInEvaluation.Answers[x];

            if (x == 0) {
                text += '<input style="float:left;margin-left:10px;" id="radioCount' + contextIndex + '_' + answer.ID + '" type="radio" name="choice" value="' + answer.ID + '" checked>' + answer.Name + "&nbsp;&nbsp;&nbsp;";
                text += '<br />';
            }
            else {
                text += '<input style="float:left;margin-left:10px;"  id="radioCount' + contextIndex + '_' + answer.ID + '" type="radio" name="choice" value="' + answer.ID + '">' + answer.Name + "&nbsp;&nbsp;&nbsp;";
                text += '<br />';
            }
        }

        text += '<br/>';
        text += '<input  style="width: 100px; font-weight:bold; color:Red; font-size:12px; line-height:20px; display:inline; -webkit-border-radius: 5px; -moz-border-radius: 5px; border-radius: 5px;" value="' + action + '" type="button" onclick="submitVote(\'' + frmName + '\',\'' + uniqueQuestionControlHash + '\');" />';
        text += '<span id="spnThankyou_' + contextIndex + '" style="padding-left:10px;display:none;color:Green;">Danke!</span></div>';
        text += '</td></tr>';
        text += '</table></form></div>';

        $(this).html(text);

        $('#voteoptions_' + contextIndex + '').find("input").attr("checked", false);

    });
}


function getNext(source, target, index) {
    var lastConfirmationMessage;

    for (var i = 0; i < questions.length; i++) {

        for (var j = 0; j < questions[i].LanguageQuestions.length; j++) {

            var uniqueQuestionControlHash = $.trim(questions[i].LanguageQuestions[j].Question + questions[i].LanguageQuestions[j].ID);
           
            var md5Control = "";

            switch (duplicationLogic) {
                case 1: {
                    md5Control = generateEvaluationMD5Hash($.trim(source + target
                        + textIdInEvaluation + projectToken + userEvaluating + uniqueQuestionControlHash));
                } break;
                case 2: { md5Control = generateEvaluationMD5Hash($.trim(source + target + projectToken + userEvaluating + uniqueQuestionControlHash)); } break;
                default: {
                    md5Control = generateEvaluationMD5Hash($.trim(source + target
                        + textIdInEvaluation + projectToken + userEvaluating + uniqueQuestionControlHash));
                   
                } break;
            }


            try { lastConfirmationMessage = questions[i].LanguageQuestions[j].Confirmation; } catch (e) { lastConfirmationMessage = "" }

            if (clientSideLog == null || clientSideLog == undefined)
                clientSideLog = evaluationHistory;

            if ($.inArray(md5Control, clientSideLog) < 0) {
                injectForms(questions[i].LanguageQuestions[j], "div[id^='divFormContainer_" + index + "']");
                return true;
            }
        }
    }

    $("#evaluationRow_" + index + " :input").attr("disabled", true);
    $("#evaluationRow_" + index + " :input").attr("readonly", "readlony");
    $("#evaluationRow_" + index + "").css("opacity", "0.3");
    $("#divFormContainer_" + index + "").empty();
    $("#divFormContainer_" + index + "").html('<span>' + lastConfirmationMessage + '</span>');
   
    if ($('div[id^="evaluationRow_"]').length == $('div[style="opacity: 0.3;"]').length) {
       
        $(window).scrollTop(0);
        $("#spanIsFinished").show();
        if (!segmentsent)
            sendInternalEvaluationAudit(projectToken, userEvaluating, 1, (textIdInEvaluation + ";" + userInEvaluation).toString());
    }

}
function replaceAll(find, replace, str) {
    return str.replace(new RegExp(find, 'g'), replace);
}

//submit vote.
function submitVote(frmName, uniqueQuestionControlHash) {

    var index = frmName.split('_')[1];

    $('#' + frmName + " input:radio").each(function () {
        if ($(this).is(':checked') && projectToken.length > 0) {

            var source = $.trim($("#evaluationColSource_" + index.toString() + "").text());
            var target = $.trim($("#evaluationSpanTarget_" + index.toString() + "").text());
            var md5Mapping = generateEvaluationMD5Hash($.trim(source + target + projectToken + textIdInEvaluation + userInEvaluation));
            var md5Control = generateEvaluationMD5Hash($.trim(source + target + projectToken + textIdInEvaluation + userInEvaluation + userEvaluating + uniqueQuestionControlHash));
            var md5Control = "";

            switch (duplicationLogic) {
                case 1: {
                    md5Control = generateEvaluationMD5Hash($.trim(source + target
                        + textIdInEvaluation + projectToken + userEvaluating + uniqueQuestionControlHash));
                } break;
                case 2: { md5Control = generateEvaluationMD5Hash($.trim(source + target + projectToken + userEvaluating + uniqueQuestionControlHash)); } break;
                default: {
                    md5Control = generateEvaluationMD5Hash($.trim(source + target
                        + textIdInEvaluation + projectToken + userEvaluating + uniqueQuestionControlHash));
                    
                } break;
            }

            var inContextFormSelector = "#evaluationSegmentForm_" + index.toString() + "";

            sendViaAjax(projectId, apiPublicKey, $(this).val(), encodeURIComponent($.trim(source)), encodeURIComponent($.trim(target)),
            textIdInEvaluation, userInEvaluation, md5Mapping, md5Control, userEvaluating, parseInt((parseInt(index) + 1)), duplicationLogic, "");

            $('#voteoptions_' + index.toString() + '').find("input").attr("checked", false);

            if (clientSideLog != undefined) {
                clientSideLog.push(md5Control);
                $.localStorage.setItem(localStorageLabel, clientSideLog);
            }
            else {
                clientSideLog = evaluationHistory;
                clientSideLog.push(md5Control);
                $.localStorage.setItem(localStorageLabel, clientSideLog);
            }

            getNext(source, target, index);

        }
    });
}


function isFinished() {
    if ($('div[id^="evaluationRow_"]').length == $('div[style="opacity: 0.3;"]').length) {
        $("#spanIsFinished").show();
    }
}


//dependencies - local storage
(function ($, document, undefined) {
    var supported;
    try {
        supported = typeof window.localStorage == 'undefined' || typeof window.JSON == 'undefined' ? false : true;
    } catch (error) { }

    $.localStorage = function (key, value, options) {
        options = jQuery.extend({}, options);
        return $.localStorage.plugin.init(key, value);
    }

    $.localStorage.setItem = function (key, value) {
        return $.localStorage.plugin.setItem(key, value);
    }

    $.localStorage.getItem = function (key) {
        return $.localStorage.plugin.getItem(key);
    }

    $.localStorage.removeItem = function (key) {
        return $.localStorage.plugin.removeItem(key);
    }
    $.localStorage.plugin = {
        init: function (key, value) {
            if (typeof value != 'undefined') {
                return this.setItem(key, value);
            } else {
                return this.setItem(key);
            }
        },
        setItem: function (key, value) {
            var value = JSON.stringify(value);
            if (!supported) {
                try {
                    $.localStorage.cookie(key, value);
                } catch (e) { }
            }
            window.localStorage.setItem(key, value);
            return this.result(value);
        },
        getItem: function (key) {
            if (!supported) {
                try {
                    return this.result($.localStorage.cookie(key));
                } catch (e) {
                    return null;
                }
            }
            return this.result(window.localStorage.getItem(key));
        },
        removeItem: function (key) {
            if (!supported) {
                try {
                    $.localStorage.cookie(key, null);
                    return true;
                } catch (e) {
                    return false;
                }
            }
            window.localStorage.removeItem(key);
            return true;
        },
        result: function (res) {
            var ret;
            try {
                ret = JSON.parse(res);
                if (ret == 'true') {
                    ret = true;
                }
                if (ret == 'false') {
                    ret = false;
                }
                if (parseFloat(ret) == ret && typeof ret != "object") {
                    ret = parseFloat(ret);
                }
            } catch (e) { }
            return ret;
        }
    }

    $.localStorage.cookie = function (key, value, options) {

        if (arguments.length > 1 && (value === null || typeof value !== "object")) {
            if (value === null) {
                options.expires = -1;
            }

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            return (document.cookie = [
				encodeURIComponent(key), '=',
				options.raw ? String(value) : encodeURIComponent(String(value)),
				options.expires ? '; expires=' + options.expires.toUTCString() : '',
				options.path ? '; path=' + options.path : '',
				options.domain ? '; domain=' + options.domain : '',
				options.secure ? '; secure' : ''
            ].join(''));
        }

        options = value || {};
        var result,
			decode = options.raw ? function (s) { return s; } : decodeURIComponent;

        return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
    }

})(jQuery, document);
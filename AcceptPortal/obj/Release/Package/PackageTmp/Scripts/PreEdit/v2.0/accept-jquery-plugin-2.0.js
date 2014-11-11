/********************************************************************************************************************************************/
/*                                                                                                                                          */
/*  ACCEPT Pre-Editing Plug-in 2.0 version                                                                                             */
/*                                                                                                                                          */
/*                                                                                                                                          */
/********************************************************************************************************************************************/

(function ($) {

    $.fn.Accept = function (options) {

        /*global variables*/
        var globalSessionId = null;
        var currentChildSessionId = null;
        var acceptObject = this;
        var acceptObjectId = $(this).attr("id");
        var acceptContainerId = "div_accept_" + acceptObjectId;
        var $acceptContainer = null;
        var acceptDialogId = "dialogaccept_" + acceptObjectId;
        var mainContextMenuId = "myMenu_" + acceptObjectId;
        var btnReplaceId = "btn-replace-accept_" + acceptObjectId;
        var btnFixAllId = "btn-fixall_" + acceptObjectId;
        var btnRefreshId = "btn-refresh-accept_" + acceptObjectId;
        var btnManualRefreshId = "btn-manual-refresh-accept_" + acceptObjectId;
        var imgDialogTitleId = "imgDialogTitleId_" + acceptObjectId;
        var acceptTextContext = "";
        var acceptGenericResponses = [];
        var acceptNonSuggestionGenericResponses = [];
        var x;
        var y;
        //var isAutoRefresh = false;
        var checkGrammar = "1";
        var checkSpelling = "1";
        var checkStyle = "1";
        /*labels*/
        var labelCtxMenuAccept = "Check All";
        var labelCtxMenuGrammar = "Grammar";
        var labelCtxMenuSpelling = "Spelling";
        var labelCtxMenuStyle = "Style";
        var labelCtxMenuClose = "Close";
        var labelPleaseWait = "Please Wait...";
        var labelDialogFixAll = "Replace All";
        var labelDialogReplace = "Apply";
        var labelDialogRefresh = "Refresh";
        var labelDialogCancel = "Cancel";
        var labelManualCheck = "Check";
        var helpManualCheck = "This button triggers a spelling, grammar and style check on your text. Once your text is checked, potential spelling, grammar or stylistic problems will be underlined. In simple cases, hovering over an underlined word will bring up suggestions, which you may decide to use to improve your text. In more complex cases, suggestions will not be available and you will have the possibility to read the advice (in the tooltips) and decide whether you want to make any changes in the text area itself."
        var errorRequestFailed = "Your request failed.";
        var errorParsingApiStatusMessage = "Error parsing response.";
        var refreshMessage = "Your response is not ready at the moment, please refresh.";
        var noInputTextMessage = "Please enter some text!";
        var labelDialogCtxIgnoreAll = "Ignore All";
        var labelDialogCtxIgnore = "Ignore";
        var labelDialogCtxReplace = "Replace";
        var labelDialogCtxReplaceAll = "Replace All";
        var labelDialogCtxGrammarTooltip = "Grammar Suggestion";
        var labelDialogCtxSpellingTooltip = "Spelling Suggestion";
        var labelDialogCtxStyleTooltip = "Style Suggestion";
        var labelRuleName = "Rule:";
        var tinyButtonMCETooltip = 'Check Spelling, Grammar and Style';
        var labelNoResultsDialogTitle = 'Your text looks ok!';
        var labelNoResultsDialogBody = 'No issues were found.';
        var labelHelpDialogTitle = 'Help';
        var helpRuleWithSuggestion = "A red underline suggests that a word is misspelt or that it is not grammatically correct. Some alternative suggestions will appear when you hover over  the underlined word. You can then accept one of these suggestions by clicking on it.";
        var helpLongSentence = "let\'s suppose I\'m a long sentence.";
        var helpRuleWithNoSuggestion = "A green underline suggests that your text may be improved by following grammatical or stylistic recommendations. These recommendations will appear in a tooltip when you hover over an underlined word or punctuation mark.";
        var helpApplyButton = "When you click this button, your original text will be replaced with the text from the pop-up where you may have made some changes.";
        var helpCloseButton = "When you click the X button, the pop-up window closes and any change you may have made will be discarded.";
        var helpReplaceAllDescription = "When you click this button, all of the suggestions from the checker will be applied to your text. Note that some of these suggestions may not always be accurate, so the structure and meaning of your text may be distorted.";
        var $iframe = null;
        var learnDialogTooltip = "Learn this word";
        var learnDialogLabel = "Learn";
        var ignoreDialogLabel = "Ignore";
        var ignoreDialogTooltip = "Ignore this rule";
        var wordsLearntPool = [];
        var rulesLearntPool = [];
        var learnTooltipLabels = "&nbsp;Ignore this rule ?";
        var autoHideToolTip = true;
        var labelEmptySuggestion = "Delete redundant word";
        var $toolbarUserInfoPlaceholder = null;
        var labelSettings = "Settings";
        var labelEditor = "Editor";
        var messageWordLearnt = 'The word "@word@" was successfully learnt!';
        var messageRuleLearnt = 'The rule "@rule@" was successfully ignored!';
        var messageRuleSetChanged = 'Ruleset changed to: "@rule@"';
        var labelSaveChanges = "Save Changes";
        var labelLearntWords = "Learnt Words";
        var labelUnLearn = "Un-learn";
        //var labelRules = "Rules";
        var labelIgnored = "Ignored Rules";
        var labelRemove = "Remove";
        var helpCheckinglevelsDescription = "One or more checking level buttons may be present at the bottom of the main window. These buttons trigger various checks, ranging from simple to more complex.";
        var helpSettingsDescription = "When you click this button, the Settings window appears. This window allows you to manage the words that the tool has learnt as well as the rules that you want to ignore.";
        var labelNoRulesIgnored = "No rules ignored...";
        var labelNoWordsLearnt = "No words learnt...";
        var labelHelpAcceptMessage = "This tool is brought to you by the ACCEPT project thanks to grant agreement 288769.";
        var labelActionIgnoreRule = "ignore_rule";
        var labelActionRemoveIgnoreRule = "remove_ignore_rule";
        var labelActionLearnWord = "learn_word";
        var labelActionRemoveLearntWord = "remove_learn_word";
        var labelActionAcceptSuggestion = "accept_suggestion";
        var labelLocalStorageRules = "rulesLearntPool_en";
        var labelLocalStorageWords = "wordsLearntPool_en";
        $.ifrx = 0;
        $.ifry = 0;
        $.ifrxmem = 0;
        $.ifrymem = 0;
        var cssStyles = ['accept-highlight-tooltip', 'accept-highlight-tooltip', 'accept-highlight-tooltip'];
        var cssUnderlineStyles = ['accept-highlight-tooltip', 'accept-highlight-tooltip', 'accept-highlight-tooltip'];

        var labelActionDisplayTooltip = "display_tooltip";
        $.labelActionDisplayContextMenu = "display_contextmenu";

        $.sendDisplayAudit = function (label, ruleUniqueId, rawJson, context, pid) {
            debugger;
            sendAuditFlagGeneric(context, label, "", "", ruleUniqueId, "", "", "", rawJson, pid);

        }

        $.refreshIframePosition = function () {
            $.ifrx = 0;
            $.ifry = 0;
            $.ifrx = $iframe.offset().left - $iframe.contents().find('body').scrollLeft();
            $.ifry = $iframe.offset().top - $iframe.contents().find('body').scrollTop();
            $.ifry -= $(window).scrollTop();
            $.ifrx -= $(window).scrollLeft();
            /*$.ifrx = $(document).find("#mainPlaceHolder_" + acceptDialogId + "").find('#' + 'editArea_' + acceptContainerId + '_ifr').offset().left;
            $.ifry = $(document).find("#mainPlaceHolder_" + acceptDialogId + "").find('#' + 'editArea_' + acceptContainerId + '_ifr').offset().top;*/
        }

        /*$.getIframeScrollTop = function () {
        return $iframe.contents().find('body').scrollTop(); ;
        }
        $.getIframeScrollLeft = function () {
        return $iframe.contents().find('body').scrollLeft();
        }*/

        $.findTotalOffset = function (obj) {
            var ol = ot = 0;
            if (obj.offsetParent) {
                do {
                    ol += obj.offsetLeft;
                    ot += obj.offsetTop;
                } while (obj = obj.offsetParent);
            }
            return { left: ol, top: ot };
        }


        /*$.detectIe8 = function () {
        var ie = (function () {
        var undef,
        v = 3,
        div = document.createElement('div'),
        all = div.getElementsByTagName('i');
        while (
        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
        all[0]
        );
        return v > 4 ? v : undef;
        } ());
        return ie;
        }*/

        /*function getScrollTop() {
        if (typeof pageYOffset != 'undefined') {
        //most browsers except IE before #9
        return pageYOffset;
        }
        else {
        var B = document.body; //IE 'quirks'
        var D = document.documentElement; //IE with doctype
        D = (D.clientHeight) ? D : B;
        return D.scrollTop;
        }
        }*/

        //create some defaults, extending them with any options that were provided
        var settings = $.extend({
            'ApiKey': '',
            'AcceptServerPath': 'http://www.accept-portal.eu/AcceptApi/Api/v1',
            'configurationType': 'contextMenu',
            'Rule': '',
            'Lang': 'en',
            'righClickEnable': false,
            'imagesPath': '../../Content/images',
            'tinyMceUrl': '../extras/tiny_mce/tiny_mce.js',
            'textEditorPlaceHolderId': null,
            'timeoutWaitingTime': 7000,
            'LoadInputText': function () {
                var inputText = "";
                inputText = settings.requestFormat == 'TEXT' ? inputText = $("#" + acceptObjectId).val() : inputText = $("#" + acceptObjectId).html();
                return inputText;
            },
            'SubmitInputText': function (text) {
                settings.requestFormat == 'TEXT' ? $('#' + acceptObjectId).val(text) : $('#' + acceptObjectId).html(text);
            },
            'languageUi': 'en',
            'dialogHeight': 'auto',
            'dialogWidth': 'auto',
            'requestFormat': 'TEXT',
            'placeHolderMaxHeight': $(window).height(),
            'placeHolderMaxWidth': $(window).width(),
            'placeHolderMinHeight': 100,
            'placeHolderMinWidth': 380,
            'showFixAll': false,
            'showManualCheck': false,
            'isModal': true,
            'isDraggable': true,
            'styleSheetPath': '../css',
            'htmlBlockElements': 'p ,h1 ,h2 ,h3 ,h4 ,h5 ,h6 ,ol ,ul, li ,pre ,address ,blockquote ,dl ,div ,fieldset ,form ,hr ,noscript ,table, br',
            'refreshStatusAttempts': 5,
            'editorWidth': '380px',
            'editorHeight': '80px',
            'checkingLevels': [],
            'getSessionUser': function () { return ""; },
            'injectSelector': null,
            'triggerCheckSelector': null,
            'injectContent': null,
            'injectWaitingPeriod': 100,
            'dialogPosition': ['top', 50],
            'displayExtend': true,
            'dialogExtendOptions':
            {
                "close": true,
                "maximize": true,
                "minimize": false,
                "events":
                {
                    "maximize": function () {
                        autoResizeEditor();
                    },
                    "restore": function () {
                        autoResizeEditor();
                        debugger;
                        if (settings.dialogWidth === 'auto')
                            $("#" + acceptDialogId + "").dialog("option", "position", settings.dialogPosition);
                    }
                    , "beforeMaximize": function () {
                        debugger;
                        if (settings.dialogWidth === 'auto')
                            $("#" + acceptDialogId + "").data('autoWidthHelper', { dialogWidthBeforeMaximize: $("#" + acceptDialogId + "").width() });

                        $("#" + acceptDialogId + "").data('maximizationStatus', { editorWidthBefore: $iframe.width(), editorHeightBefore: $iframe.height(), dialogIsMaximized: true });
                    },
                    "beforeRestore": function () {
                        debugger;

                        $("#" + acceptDialogId + "").data('maximizationStatus').dialogIsMaximized = false;

                    }
                }
            }
        }, options);

        $.updateRuleSet = function (ruleSetName) {
            settings.Rule = ruleSetName;
        };

        $.updateShowFixAll = function (showFixAll) {
            settings.showFixAll = showFixAll;
        };

        //clean all plug-in data
        $.cleanPluginData = function () {
            $("#" + mainContextMenuId).remove();
            $("#" + acceptDialogId).remove();
        }

        $.injectAcceptButton = function (jQuerySelectorSource, jQuerySelectorTarget, contentToApply, waitingTime) {
            try {
                //var checkExist = null;
                if (jQuerySelectorSource != null && contentToApply != null) {
                    if ($(jQuerySelectorSource).length) {
                        $(jQuerySelectorSource).each(function () {
                            $(this).append(contentToApply);
                        });

                    }
                    else {
                        var checkExist1 = setInterval(function () {
                            if ($(jQuerySelectorSource).length) {
                                $(jQuerySelectorSource).each(function () {
                                    $(this).append(contentToApply);
                                });
                                clearInterval(checkExist1);
                            }
                        }, waitingTime);
                    }
                }
                if (jQuerySelectorTarget != null) {
                    if ($(jQuerySelectorTarget).length) {
                        $(jQuerySelectorTarget).click(function () {
                            checkGrammar = "1";
                            checkSpelling = "1";
                            checkStyle = "1";
                            CreateAcceptDialog();
                        });

                    }
                    else {
                        var checkExist2 = setInterval(function () {
                            if ($(jQuerySelectorTarget).length) {
                                $(jQuerySelectorTarget).click(function () {
                                    checkGrammar = "1";
                                    checkSpelling = "1";
                                    checkStyle = "1";
                                    CreateAcceptDialog();
                                });
                                clearInterval(checkExist2);
                            }
                        }, waitingTime);

                    }

                }

                /*
                setTimeout(function () {
                if (jQuerySelectorSource != null) {
                $(jQuerySelectorSource).each(function () {
                $(this).append(contentToApply);
                });
                }
                $(jQuerySelectorTarget).click(function () {
                checkGrammar = "1";
                checkSpelling = "1";
                checkStyle = "1";
                CreateAcceptDialog();
                });                
                }, waitingTime);*/

            } catch (ex) { }
        }

        $.injectAcceptButtonPostEdit = function (jQuerySelectorSource, jQuerySelectorTarget, contentToApply, waitingTime) {
            try {
                setTimeout(function () {
                    $(jQuerySelectorSource).each(function () {
                        $(this).append(contentToApply);
                    });

                    $(jQuerySelectorTarget).click(function () {
                        checkGrammar = "1";
                        checkSpelling = "1";
                        checkStyle = "0";
                        CreateAcceptDialog();
                    });
                }, waitingTime);
            } catch (ex) { }
        }

        //hash generator
        String.prototype.hashCode = function () {
            var hash = 0, i, char;
            if (this.length == 0) return hash;
            for (i = 0, l = this.length; i < l; i++) {
                char = this.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash |= 0; // Convert to 32bit integer
            }
            return hash;
        };

        //accept learn word object
        function WordLearn(context, isActive, jsonRaw, ruleId) {
            this.context = context;
            this.isActive = isActive;
            this.jsonRaw = jsonRaw;
            this.hash = context.hashCode().toString();
            this.ruleId = ruleId;
        }


        //accept learn rule object
        function RuleLearn(ruleId, ruleName, isIgnored, jsonRaw) {
            this.ruleId = ruleId
            this.ruleName = ruleName;
            this.isIgnored = isIgnored;
            this.jsonRaw = jsonRaw;
        }

        function globalSettings() {
            this.spellingType = "";
            this.checkLevelOne = true;
            this.checkLevelTwo = true;
            this.checkLevelThree = true;
        }

        //accept response Object
        function Response(context, type, suggestions, startpos, endpos, description, rule, contextpieces, uniqueId) {
            this.context = context;
            this.type = type;
            this.suggestions = suggestions;
            this.startpos = startpos;
            this.endpos = endpos;
            this.description = description;
            this.rule = rule;
            this.contextpieces = contextpieces;
            this.uniqueId = uniqueId;
            this.GetSuggestions = function () { return this.suggestions; }
            this.ComputePosAverage = function () { return (this.endpos - this.startpos); }
            this.GetStartPosition = function () { return this.startpos; }
            this.GetEndPosition = function () { return this.endpos; }
            this.GetRuleName = function () { return this.rule; }
            this.GetContext = function () {
                if (this.context.length > 0)
                    return this.context;
                else {
                    var allcontext = "";
                    for (i = 0; i < contextpieces.length; i++)
                        allcontext = allcontext + " " + contextpieces[i].Piece.toString();
                    return allcontext;
                }
            }
        }

        function AuditFlag(flag, action, actionValue, context, ignored, name, textBefore, textAfter, timeStamp, rawJson, privateId) {
            this.flag = flag;
            this.action = action;
            this.actionValue = actionValue;
            this.context = context;
            this.ignored = ignored;
            this.name = name;
            this.textBefore = textBefore;
            this.textAfter = textAfter;
            this.timeStamp = timeStamp;
            this.rawJson = rawJson;
            this.privateId = privateId;
        }

        var SubmitFlagAudit = function (flagAudit) {
            var stimeStampString = flagAudit.timeStamp.getUTCFullYear() + "/" + (flagAudit.timeStamp.getUTCMonth() + 1) + "/" + flagAudit.timeStamp.getUTCDate() + " " + flagAudit.timeStamp.getUTCHours() + ":" + flagAudit.timeStamp.getUTCMinutes() + ":" + flagAudit.timeStamp.getUTCSeconds();
            var jsonData = "";
            if ($.browser.msie) {
                jsonData = {
                    "globalSessionId": "" + globalSessionId + "",
                    "flag": "" + encodeURIComponent(flagAudit.flag) + "",
                    "userAction": "" + encodeURIComponent(flagAudit.action) + "",
                    "actionValue": "" + encodeURIComponent(flagAudit.actionValue) + "",
                    "ignored": "" + encodeURIComponent(flagAudit.ignored) + "",
                    "name": "" + flagAudit.name + "",
                    "textBefore": "" + encodeURIComponent(flagAudit.textBefore) + "",
                    "textAfter": "" + encodeURIComponent(flagAudit.textAfter) + "",
                    "timeStamp": "" + encodeURIComponent(stimeStampString) + "",
                    "jsonRaw": "" + flagAudit.rawJson + "",
                    "privateId": "" + (flagAudit.privateId.length > 0 ? flagAudit.privateId.hashCode() : flagAudit.privateId).toString() + ""
                };
                var xdr = new XDomainRequest();
                xdr.open("POST", settings.AcceptServerPath + "/Core/AuditFlag");
                xdr.onload = function () {
                }
                xdr.onerror = function () {
                };
                xdr.onprogress = function () { };
                xdr.ontimeout = function () { };
                xdr.onopen = function () { };
                xdr.timeout = settings.timeoutWaitingTime;
                xdr.send(JSON.stringify(jsonData));
            }
            else {

                jsonData = '{"globalSessionId":"' + globalSessionId + '","flag":"' + encodeURIComponent(flagAudit.flag) + '"' + ', "userAction":"' + encodeURIComponent(flagAudit.action) + '", "actionValue":"' + encodeURIComponent(flagAudit.actionValue) + '", "ignored":" ' + encodeURIComponent(flagAudit.ignored) + '", "name":"' + flagAudit.name + '", "textBefore":"' + encodeURIComponent(flagAudit.textBefore) + '", "textAfter":"' + encodeURIComponent(flagAudit.textAfter) + '", "timeStamp":"' + encodeURIComponent(stimeStampString) + '", "jsonRaw":"' + flagAudit.rawJson + '", "privateId":"' + (flagAudit.privateId.length > 0 ? flagAudit.privateId.hashCode() : flagAudit.privateId).toString() + '"}';
                $.ajax({
                    type: 'POST',
                    url: settings.AcceptServerPath + "/Core/AuditFlag",
                    contentType: "application/json",
                    success: function (data) {
                    },
                    complete: function () { },
                    error: function () {
                    },
                    data: jsonData,
                    cache: false,
                    async: true
                });
            }
        }


        function cleanRemainingSuggestionsInContextMenu(startIndex, endIndex, usedFlagContextMenuSelector, ruleType) {

            switch (ruleType) {
                case "GRAMMAR":
                    {
                        $(usedFlagContextMenuSelector).find('li[id$="_' + startIndex + '_' + endIndex + '_gr"]').remove();

                    } break;
                case "SPELLING":
                    {
                        $(usedFlagContextMenuSelector).find('li[id$="_' + startIndex + '_' + endIndex + '_sp"]').remove();

                    } break;
            }
        }

        function sendAuditFlag(startIndex, endIndex, usedflag, usedFlagContextMenuSelector, textBefore, textAfter, jsonRaw, pid) {

            for (var i = 0; i < acceptGenericResponses.length; i++)
                if (acceptGenericResponses[i].GetStartPosition() == startIndex && acceptGenericResponses[i].GetEndPosition() == endIndex) {
                    var newAuditFlag = new AuditFlag();
                    newAuditFlag.flag = acceptGenericResponses[i].GetContext();
                    newAuditFlag.action = labelActionAcceptSuggestion;
                    newAuditFlag.actionValue = usedflag;
                    newAuditFlag.ignored = "";
                    //get flags ignored                  
                    $(usedFlagContextMenuSelector).find('li:not([id^=lrn_])').each(function () {
                        if ($(this).text() != usedflag && $(this).text() != learnDialogLabel)
                            newAuditFlag.ignored.length > 0 ? newAuditFlag.ignored = newAuditFlag.ignored + ";" + $(this).text() : newAuditFlag.ignored = newAuditFlag.ignored + $(this).text();
                    });
                    newAuditFlag.name = acceptGenericResponses[i].uniqueId; //.type;
                    newAuditFlag.context = "";
                    newAuditFlag.textBefore = textBefore;
                    newAuditFlag.textAfter = textAfter;
                    newAuditFlag.timeStamp = new Date();
                    newAuditFlag.rawJson = jsonRaw;
                    newAuditFlag.privateId = pid;

                    SubmitFlagAudit(newAuditFlag);

                    cleanRemainingSuggestionsInContextMenu(startIndex, endIndex, usedFlagContextMenuSelector, acceptGenericResponses[i].type);

                }
        }


        function sendAuditFlagGeneric(flag, action, actionValue, ignored, name, context, textBefore, textAfter, jsonRaw, pid) {
            var newAuditFlag = new AuditFlag();
            newAuditFlag.flag = flag;
            newAuditFlag.action = action;
            newAuditFlag.actionValue = actionValue;
            newAuditFlag.ignored = ignored;
            newAuditFlag.name = name;
            newAuditFlag.context = context;
            newAuditFlag.textBefore = textBefore;
            newAuditFlag.textAfter = textAfter;
            newAuditFlag.rawJson = jsonRaw;
            newAuditFlag.timeStamp = new Date();
            newAuditFlag.privateId = pid;
            SubmitFlagAudit(newAuditFlag);
        }



        var SubmitFinalAudit = function (finalText, finalTimeStamp) {
            var stimeStampString = finalTimeStamp.getUTCFullYear() + "/" + (finalTimeStamp.getUTCMonth() + 1) + "/" + finalTimeStamp.getUTCDate() + " " + finalTimeStamp.getUTCHours() + ":" + finalTimeStamp.getUTCMinutes() + ":" + finalTimeStamp.getUTCSeconds();
            var jsonData = "";
            if ($.browser.msie) {
                jsonData = {
                    "globalSessionId": "" + globalSessionId + "",
                    "textContent": "" + finalText + "",
                    "timeStamp": "" + encodeURIComponent(stimeStampString) + ""
                };
                var xdr = new XDomainRequest();
                xdr.open("POST", settings.AcceptServerPath + "/Core/AuditFinalContext");
                xdr.onload = function () {
                }
                xdr.onerror = function () {
                };
                xdr.onprogress = function () { };
                xdr.ontimeout = function () { };
                xdr.onopen = function () { };
                xdr.timeout = settings.timeoutWaitingTime;
                xdr.send(JSON.stringify(jsonData));
            }
            else {
                //charset="utf-8"                 
                jsonData = '{"globalSessionId":"' + globalSessionId + '","textContent":"' + finalText + '"' + ', "timeStamp":"' + encodeURIComponent(stimeStampString) + '"}';
                $.ajax({
                    type: 'POST',
                    url: settings.AcceptServerPath + "/Core/AuditFinalContext",
                    contentType: "application/json charset=\"utf-8\"",
                    success: function (data) {
                    },
                    complete: function () { },
                    error: function () {
                    },
                    data: jsonData,
                    cache: false,
                    async: true
                });
            }
        }

        function removeTinyMCE(inst) {
            tinyMCE.execCommand('mceRemoveControl', false, inst);
        }

        function getTinyMCEWidth(inst) {
            return tinyMCE.get(inst).getParam('width');
        }

        function getTinyMCEHeight(inst) {
            return tinyMCE.get(inst).getParam('height');
        }

        var loadOnTheFlyEditTextEditor = function () {
            $.AcceptTinyMceEditor = tinyMCE.init({
                mode: 'exact', elements: 'editArea_' + acceptContainerId + '',
                //script_url: settings.tinyMceUrl,
                theme: "advanced",
                entity_encoding: "raw",
                plugins: "",
                custom_undo_redo_keyboard_shortcuts: false,
                //force_p_newlines: false,
                //force_br_newlines: true,
                //convert_newlines_to_brs: true,
                //remove_linebreaks: true,    
                //forced_root_block: false,
                //force_br_newlines : false,
                //force_p_newlines : false,
                //convert_newlines_to_brs: false,
                //remove_trailing_brs: false,
                width: settings.editorWidth,
                height: settings.editorHeight,
                theme_advanced_buttons1: "",
                theme_advanced_buttons2: "",
                theme_advanced_buttons3: "",
                theme_advanced_buttons4: "",
                //theme_advanced_toolbar_location: "top",
                //theme_advanced_toolbar_align: "left",
                //theme_advanced_statusbar_location: "bottom",
                theme_advanced_toolbar_location: "",
                theme_advanced_toolbar_align: "",
                theme_advanced_toolbar_align: "",
                theme_advanced_resizing: true,
                theme_advanced_statusbar_location: "bottom",
                theme_advanced_path: false,
                setup: function (ed) {
                    ed.onKeyDown.add(function (ed, e) {
                        var evtobj = window.event ? event : e
                        if (evtobj.keyCode == 90 && evtobj.ctrlKey) {
                            //cleanHighlightedNodes();
                            window.event.preventDefault();
                        }
                    });
                    ed.onKeyUp.add(function (ed, e) {
                        hideFlags();
                        if ((e.keyCode < 36) || (e.keyCode > 40)) {

                            var currentNode = tinyMCE.activeEditor.selection.getNode();
                            if (currentNode.id.indexOf("spncontext_") === 0 || currentNode.id.indexOf("spnToolTip_") === 0) {
                                $acceptContainer.find('span[id^=' + currentNode.id.split('_')[0] + '_' + currentNode.id.split('_')[1] + '_' + currentNode.id.split('_')[2] + ']').each(function () {

                                    $(this).unbind();
                                    $(this).css("background-color", "");
                                    $(this).attr("class", "");
                                    removeKeepChildren(this);
                                });

                                if ($acceptContainer.find('span[class^="accept-highlight"]').length <= 0)
                                    showNoResultsDialog();
                            }
                            else
                                if (currentNode.className.indexOf("accept-highlight") === 0)
                                    currentNode.removeAttribute("class");
                        }

                        e.stopPropagation();
                    });
                }
            });
        }



        //init plug-in         
        var initAccept = function () {
            //load ui labels
            initLanguageUi();

            if ($.browser.msie || $.browser.mozilla)
                jQuery.support.cors = true;

            $.cleanPluginData();

            $(document.body).append('<ul id="' + mainContextMenuId + '" class="contextMenu"><li class="accept"><a href="#accept">' + labelCtxMenuAccept + '</a></li><li class="grammar"><a href="#grammar">' + labelCtxMenuGrammar + '</a></li><li class="spell"><a href="#spell">' + labelCtxMenuSpelling + '</a></li><li class="style"><a href="#style">' + labelCtxMenuStyle + '</a></li>	<li class="accept_close"><a href="#accept_close">' + labelCtxMenuClose + '</a></li></ul>');
            $(document.body).append('<div id="' + acceptDialogId + '" title="Accept" style="display:none;"><div id="mainPlaceHolder_' + acceptDialogId + '">' +
            '<div id="load_' + acceptContainerId + '" class="loadmask"  style="position:relative; display:block; vertical-align:middle; text-align:center;top:0%;min-width:' + settings.placeHolderMinWidth + 'px;min-height:' + settings.placeHolderMinHeight + 'px;">' +
            '<img style="vertical-align:middle; text-align:center;margin-top:5%" alt="' + labelPleaseWait + '" src="' + settings.imagesPath + '/ajax-loader.gif" />' +
            '</div><div class="resultsPlaceHolder" id="' + acceptContainerId + '" style="display:none;text-align: justify;padding:5px;min-height:' + settings.placeHolderMinHeight + 'px;min-width:' + settings.placeHolderMinWidth + 'px;max-height:' + settings.placeHolderMaxHeight + 'px;max-width:' + settings.placeHolderMaxWidth + 'px;"></div>' +
            '<div class="resultsPlaceHolder" id="editor_' + acceptContainerId + '" style="display:none;text-align: justify;padding:5px;min-height:' + settings.placeHolderMinHeight + 'px;min-width:' + settings.placeHolderMinWidth + 'px;max-height:' + settings.placeHolderMaxHeight + 'px;max-width:' + settings.placeHolderMaxWidth + 'px;"><textarea id="editArea_' + acceptContainerId + '"></textarea></div>' +
            '<div class="resultsPlaceHolder" id="editorSettings_' + acceptContainerId + '" style="display:none;text-align: justify;margin:0px;padding:0px;min-height:' + settings.placeHolderMinHeight + 'px;min-width:' + settings.placeHolderMinWidth + 'px;max-height:' + settings.placeHolderMaxHeight + 'px;max-width:' + settings.placeHolderMaxWidth + 'px;"></div>' +
            '</div></div>');
            $(document.body).append('<div id="htmlPlaceHolderDiv_' + acceptDialogId + '" style="display:none;"></div>');
            $(document.body).append('<div id="helpDialog_' + acceptDialogId + '" title="' + labelHelpDialogTitle + '" style="display:none;text-align: justify;">'
            + '<table class="acceptSettingsTable">'
            + '<tr><td style="vertical-align: middle;padding-left: 10px;"><span class="accept-highlight" style="text-align:center;cursor:default;">Notron</span></td><td style="padding:5px;">' + helpRuleWithSuggestion + '</td></tr>'
            + '<tr><td style="vertical-align: middle;width: 70px;text-align: center;"><span class="accept-highlight-tooltip" style="text-align:center;cursor:default;">' + helpLongSentence + '</span></td><td style="padding:5px;">' + helpRuleWithNoSuggestion + '</td></tr>'
            + '<tr><td style="vertical-align: middle;padding-left: 10px;"><input id="acceptHelpButton_' + acceptDialogId + '" style="margin-right:5px;" type="button" value="' + labelDialogReplace + '" /></td><td style="padding:5px;">' + helpApplyButton + '</td></tr>'
            + '<tr><td style="vertical-align: middle;padding-left: 10px;"><input id="acceptHelpSettingsButton_' + acceptDialogId + '" style="margin-right:5px;" type="button" value="' + labelSettings + '" /></td><td style="padding:5px;">' + helpSettingsDescription + '</td></tr>'
            + '<tr id="acceptHelpManualCheckButtonRow_' + acceptDialogId + '" style="display:none"><td style="vertical-align: middle;padding-left: 10px;"><input id="acceptHelpManualCheckButton_' + acceptDialogId + '" style="margin-right:5px;" type="button" value="' + labelManualCheck + '" /></td><td style="padding:5px;">' + helpManualCheck + '</td></tr>'
            + '<tr><td style="vertical-align: middle;padding-left: 10px;"><input id="acceptHelpCloseButton_' + acceptDialogId + '" style="margin-right:5px;" type="button" value="' + "x" + '" /></td><td style="padding:5px;">' + helpCloseButton + '</td></tr>'
			+ '<tr id="replaceAllHelpRow_' + acceptDialogId + '" style="display:none"><td style="vertical-align: middle;padding-left: 10px;"><input id="acceptReplaceAllButton_' + acceptDialogId + '" style="margin-right:5px;" type="button" value="' + labelDialogFixAll + '" /></td><td style="padding:5px;">' + helpReplaceAllDescription + '</td></tr>'
            + '<tr id="checkingLevelsHelpRow_' + acceptDialogId + '" style="display:none"><td style="vertical-align: middle;padding-left: 10px;"><input id="help_checkLevel"  type="checkbox" style="display:none;"  checked="" /><label title="' + settings.checkingLevels[0] + '" for="help_checkLevel">1</label><span style="position: relative;width: 15px;display: inline-block"><img width="15px" style="position: absolute;bottom: 0.3px;" height="8px" src="' + settings.imagesPath + '/arrowResized.png" alt=""></span><input id="help_checkLevel_2"  type="checkbox" style="display:none;"  checked="" /><label title="' + settings.checkingLevels[1] + '" for="help_checkLevel_2">2</label></td><td style="padding:5px;">' + helpCheckinglevelsDescription + '</td></tr>'
            + '</table>'
            + '</div>');

            if (settings.configurationType == "externalCall")
                $.injectAcceptButton(settings.injectSelector, settings.triggerCheckSelector, settings.injectContent, settings.injectWaitingPeriod);
            else
                if (settings.configurationType == "tinyMceEmbedded") {
                    LoadTextEditor();
                    if (settings.righClickEnable) {
                        //setTimeout(function ()
                        //{
                        LoadRightClickContextMenuHtmlEmbedded("");
                        //}, settings.loadWaitingTime);
                    }
                }
                else {
                    if (settings.textEditorPlaceHolderId != null && settings.textEditorPlaceHolderId.length > 0 && settings.righClickEnable == true)
                        LoadRightClickContextMenuHtmlEmbedded(settings.textEditorPlaceHolderId); //setTimeout(function (){}, settings.loadWaitingTime);                                           
                    else
                        if (settings.righClickEnable == true)
                            LoadRightClickContextMenu();
                }
        };

        var initLanguageUi = function () {
            if (settings.languageUi == "fr") {
                labelCtxMenuAccept = "Tout Vérifier";
                labelCtxMenuGrammar = "Grammaire";
                labelCtxMenuSpelling = "Orthographe";
                labelCtxMenuStyle = "Style";
                labelCtxMenuClose = "Fermer";
                labelPleaseWait = "Attendez s'il vous plaît...";
                labelDialogFixAll = "Modifier tous";
                labelDialogReplace = "Remplacer";
                labelDialogRefresh = "Rafraîchir";
                labelDialogCancel = "Annuler";
                errorRequestFailed = "Votre demande a échoué..";
                errorParsingApiStatusMessage = "Erreur de réponse de l'analyse.";
                refreshMessage = "Votre réponse n'est pas prête pour le moment, rafraîchissez la page.";
                noInputTextMessage = "Veuillez saisir votre texte.";
                labelDialogCtxIgnoreAll = "Ignorer tous";
                labelDialogCtxIgnore = "Ignorer";
                labelDialogCtxReplace = "Remplacer";
                labelDialogCtxReplaceAll = "Tout remplacer";
                labelDialogCtxGrammarTooltip = "Suggestion Grammaire";
                labelDialogCtxSpellingTooltip = "Suggestion d'Orthographe";
                tinyButtonMCETooltip = "Vérifier l'orthographe, la grammaire et le style";
                labelNoResultsDialogTitle = 'Votre texte a l’air ok!';
                labelNoResultsDialogBody = 'Pas de problème détecté.';
                labelHelpDialogTitle = 'Aide';
                labelDialogReplace = "Appliquer";
                labelDialogCtxStyleTooltip = "Suggestion stylistique";

                helpRuleWithSuggestion = 'Un soulignage rouge indique qu\'un problème d\'orthographe ou de grammaire affecte un mot ou groupe de mots. Des suggestions apparaissent lorsque vous faites passer la souris sur le(s) mot(s) souligné(s). Vous pouvez choisir l\'une de ces suggestions en cliquant sur l\'une d\'entre elles.';
                helpRuleWithNoSuggestion = 'Un soulignage vert indique que le texte pourrait être amélioré en suivant certains conseils de grammaire ou de style. Les conseils apparaissent dans une bulle lorsque vous faites passer la souris sur le(s) mot(s) ou signe(s) de ponctuation souligné(s).';
                helpLongSentence = 'Imaginons une longue phrase.';
                helpApplyButton = 'En cliquant sur ce bouton, votre texte original sera remplacé avec le texte que vous aurez éventuellement modifié dans le pop-up.';
                helpCloseButton = 'En cliquant sur le bouton X, vous fermerez le pop-up et toute modification éventuellement effectuée sera perdue.';
                labelRuleName = "Règle:";
                helpReplaceAllDescription = "En cliquant sur ce bouton, toutes les suggestions proposées par le vérificateur seront appliquées à votre texte. Méfiez-vous car certaines de ces suggestions ne sont pas toujours exactes, ce qui peut entrainer une modification de la structure ou du sens de votre texte.";

                labelSettings = "Options";
                labelEditor = "Editeur";
                labelSaveChanges = "Enregistrer Changements";
                labelLearntWords = "Mots appris";
                labelUnLearn = "Oublier";
                //labelRules = "Règles";
                labelIgnored = "Règles ignorées";
                learnDialogLabel = "Apprendre";
                learnTooltipLabels = "&nbsp;Ignorer cette règle ?";
                messageWordLearnt = 'Le mot "@word@" a bien été appris!';
                messageRuleLearnt = 'La règle "@rule@" a bien été apprise!';
                messageRuleSetChanged = 'Jeu de règles changé: "@rule@"';
                learnDialogTooltip = "Apprendre ce mot";
                labelRemove = "Supprimer";

                labelNoRulesIgnored = "Aucune règle ignorée...";
                labelNoWordsLearnt = "Aucun mot appris...";
                labelEmptySuggestion = "Supprimer ce mot redondant.";


                helpCheckinglevelsDescription = "Un ou plusieurs boutons de niveau de vérification peuvent être présents en bas de la fenêtre principale. Ces boutons déclenchent diverses vérifications, allant du simple au plus complexe.";
                helpSettingsDescription = " Lorsque vous cliquez sur ce bouton, la fenêtre des paramètres s'affiche. Cette fenêtre vous permet de gérer les mots que l'outil a appris ainsi que les règles que vous souhaitez ignorer.";

                ignoreDialogLabel = "Ignorer";
                ignoreDialogTooltip = "Ignorer cette règle";

                labelManualCheck = "Vérifier";
                helpManualCheck = "Ce bouton déclenche une vérification de l’orthographe, de la grammaire et du style de votre texte. Une fois votre texte vérifié, il se peut que certains problèmes orthographiques, grammaticaux ou stylistiques soient soulignés. Pour les cas simples, vous pourrez afficher des suggestions en passant avec la souris sur le mot souligné, suggestions que vous pouvez utiliser afin d''améliorer votre texte. Pour les cas plus complexes, il n''y aura pas de suggestions mais vous aurez la possibilité de lire les conseils (dans les bulles) afin de décider si vous souhaitez faire des modifications dans la zone de texte même.";
                labelHelpAcceptMessage = 'Cet outil vous est proposé par le projet ACCEPT grâce à la convention de subvention 288769.';

                labelLocalStorageRules = "rulesLearntPool_fr";
                labelLocalStorageWords = "wordsLearntPool_fr";

            }
            else
                if (settings.languageUi == "de") {
                    labelCtxMenuAccept = "Alles prüfen";
                    labelCtxMenuGrammar = "Grammatik";
                    labelCtxMenuSpelling = "Rechtschreibung";
                    labelCtxMenuStyle = "Stil";
                    labelCtxMenuClose = "Schließen";
                    labelPleaseWait = "Bitte warten...";
                    labelDialogFixAll = "Alle verbessern";
                    labelDialogReplace = "Ersetzen";
                    labelDialogRefresh = "Aktualisieren";
                    labelDialogCancel = "Abbrechen";
                    errorRequestFailed = "Ihre Anfrage ist fehlgeschlagen.";
                    errorParsingApiStatusMessage = "Fehler beim Parsen der Antwort.";
                    refreshMessage = "Ihre Antwort ist noch nicht bereit. Bitte aktualisieren Sie die Seitesh.";
                    noInputTextMessage = "Bitte geben Sie Text ein!";
                    labelDialogCtxIgnoreAll = "Alle ignorieren";
                    labelDialogCtxIgnore = "Ignorieren";
                    labelDialogCtxReplace = "Ersetzen";
                    labelDialogCtxReplaceAll = "Alle ersetzen";
                    labelDialogCtxGrammarTooltip = "Grammatikvorschlag";
                    labelDialogCtxSpellingTooltip = "Rechtschreibvorschlag";
                    tinyButtonMCETooltip = 'Rechtschreibung, Grammatik und Stil prüfen';
                    labelNoResultsDialogTitle = 'Ihr Text sieht ok aus!';
                    labelNoResultsDialogBody = 'Es wurden keine Probleme gefunden.';
                    labelHelpDialogTitle = 'Hilfe';
                    labelDialogReplace = "Anwenden";
                    labelDialogCtxStyleTooltip = "Stil-Vorschlag";
                    helpRuleWithSuggestion = 'Rot unterstrichener Text weist darauf hin, dass ein Wort falsch geschrieben wurde oder dass es grammatikalisch unkorrekt ist. Alternative Vorschläge werden angezeigt, wenn Sie mit der Maus über das unterstrichene Wort fahren. Dann können Sie einen dieser Vorschläge durch Anklicken annehmen.';
                    helpRuleWithNoSuggestion = 'Grün unterstrichener Text weist darauf hin, dass Sie Ihren Text verbessert können, indem Sie grammatikalische oder stilistische Empfehlungen berücksichtigen. Diese Empfehlungen werden in einem „Tooltip“ angezeigt, wenn Sie mit der Maus über ein unterstrichenes Wort oder Satzzeichen fahren.';
                    helpLongSentence = 'Nehmen wir an, dies wäre ein langer Satz.';
                    helpApplyButton = 'Wenn Sie auf diese Schaltfläche klicken, wird der ursprüngliche Text mit dem Text aus dem Pop-up, an welchem Sie eventuell Änderungen vorgenommen haben, ersetzt.';
                    helpCloseButton = 'Wenn Sie auf das „X“ klicken, wird das Popup-Fenster und jede Änderung, die Sie vorgenommen haben, verworfen.';
                    labelRuleName = "Regel:";
                    helpReplaceAllDescription = "Wenn Sie auf diese Schaltfläche klicken werden alle Vorschläge der Rechtschreibprüfung in Ihrem Text angewendet. Bitte beachten Sie, dass einige dieser Vorschläge nicht immer korrekt sein werden. Dadurch könnte die Struktur und der Sinn Ihres Textes verändert werden.";
                    learnDialogLabel = "Lernen";
                    learnDialogTooltip = "Dieses Wort lernen";
                    learnTooltipLabels = "&nbsp;Diese Regel ignorieren ?";
                    labelSettings = "Einstellungen";
                    labelEditor = "Editor";
                    messageWordLearnt = 'Das Wort "@word@" wurde erfolgreich gelernt!';
                    messageRuleLearnt = 'Die Regel "@rule@" wurde erfolgreich ignoriert!';
                    messageRuleSetChanged = 'Regelliste zu: "@rule@" geändert';
                    labelSaveChanges = "Änderungen speichern";
                    labelLearntWords = "Gelernte Wörter";
                    labelUnLearn = "Vergessen";
                    //labelRules = "Regeln";
                    labelIgnored = "Ignorierte Regeln";
                    labelRemove = "Entfernen";
                    labelNoRulesIgnored = "Keine Regeln ignoriert...";
                    labelNoWordsLearnt = "Keine Wörter gelernt...";
                    labelEmptySuggestion = "Überflüssiges Wort löschen";
                    helpCheckinglevelsDescription = "Am unteren Rand des Hauptfensters können sich eine oder mehrere Schaltflächen mit unterschiedlichen Prüfungenstufen befinden. Diese Schaltflächen rufen verschiedene Prüfungen auf, die von einfach zu komplex reichen können.";
                    helpSettingsDescription = "Wenn Sie auf diese Schaltfläche klicken, erscheint das Einstellungsfenster. Dieses Fenster ermöglicht es Ihnen, die Wörter zu verwalten, die das Tool gelernt hat, sowie die Regeln, die Sie ignorieren möchten.";
                    ignoreDialogLabel = "Ignorieren";
                    ignoreDialogTooltip = "Diese Regel ignorieren";
                    labelManualCheck = "Prüfen";
                    helpManualCheck = 'Diese Schaltfläche lost eine Rechtschreib-, Grammatik und Stilprüfung Ihres Textes aus. Sobald Ihr Text geprüft wurde, werden potenzielle Rechtschreib-, Grammatik oder Stilfehler unterstrichen. In einfachen Fällen werden Ihnen, wenn Sie den Mauszeiger über ein unterstrichenes Wort bewegen, Vorschläge angezeigt, mit welchen Sie Ihren Text verbessern können. In komplexeren Fällen werden keine Vorschläge zur Verfügung stehen und Sie werden die Möglichkeit haben einen Hinweis (in den Tooltipps) zu lesen  und zu entscheiden ob Sie Veränderungen im Textfeld selbst vornehmen wollen.';
                    labelHelpAcceptMessage = 'Dieses Tool wird Ihnen Dank der Finanzhilfevereinbarung 288769 von dem ACCEPT Projekt präsentiert .';
                    labelLocalStorageRules = "rulesLearntPool_de";
                    labelLocalStorageWords = "wordsLearntPool_de";
                }

            if (settings.Rule == '') {
                if (settings.Lang == "fr")
                    settings.Rule = "Preediting_Forum";
                else
                    if (settings.Lang == "de")
                        settings.Rule = "MT-preediting-DE-EN";
                    else
                        settings.Rule = "Preediting_Forum";
            }

        }


        //build suggestions 
        function BuildStyleRules(styleResponses) {
            $('div[class^="accepttooltip"]').remove();
            var rulesWithNotFollowedSuggestions = [];
            //code for not followed suggestions
            for (var i = 0; i < styleResponses.length; i++) {
                if (styleResponses[i].context.length == 0) {
                    rulesWithNotFollowedSuggestions.push(styleResponses[i]);
                    styleResponses.splice(i, 1);
                    i = (i == 0) ? -1 : 0;
                }
            }
            var TooltTipMaxCounterHelper = rulesWithNotFollowedSuggestions.length;
            var TooltTipCurrentCounterHelper = -1;
            while (rulesWithNotFollowedSuggestions.length > 0) {
                var currentResponse = rulesWithNotFollowedSuggestions.shift();
                var currentResponseContextCollection = []
                for (var i = 0; i < rulesWithNotFollowedSuggestions.length; i++) {
                    if ((parseInt(rulesWithNotFollowedSuggestions[i].startpos) >= parseInt(currentResponse.startpos)) && (parseInt(rulesWithNotFollowedSuggestions[i].endpos) <= parseInt(currentResponse.endpos))) {
                        currentResponseContextCollection.push(rulesWithNotFollowedSuggestions[i]);
                        rulesWithNotFollowedSuggestions.splice(i, 1);
                        i = (i == 0) ? -1 : 0;
                    }
                }

                currentResponseContextCollection.push(currentResponse);
                var contextCollectionOrdered = currentResponseContextCollection.sort(function (a, b) {
                    var aval = parseInt(a.ComputePosAverage());
                    var bval = parseInt(b.ComputePosAverage());
                    return (bval - aval);
                })

                for (var i = 0; i < contextCollectionOrdered.length; i++) {
                    var startPosLastContextIndex = 0;
                    var endPosLastContextIndex = 0;
                    var firstindex = 0;
                    var firstcontext = "";
                    var lastcontext = "";
                    var ruleDescription = contextCollectionOrdered[i].description; contextCollectionOrdered[i].description = "";
                    ++TooltTipCurrentCounterHelper;
                    if (contextCollectionOrdered[i].contextpieces.length > 0) {
                        firstcontext = contextCollectionOrdered[i].contextpieces[0].Piece;
                        firstindex = contextCollectionOrdered[i].contextpieces[0].StartPos;
                        startPosLastContextIndex = contextCollectionOrdered[i].contextpieces[contextCollectionOrdered[i].contextpieces.length - 1].StartPos;
                        endPosLastContextIndex = contextCollectionOrdered[i].contextpieces[contextCollectionOrdered[i].contextpieces.length - 1].StartPos;
                        lastcontext = contextCollectionOrdered[i].contextpieces[contextCollectionOrdered[i].contextpieces.length - 1].Piece;
                        var spnId = "spnToolTip_" + firstindex.toString() + "_" + endPosLastContextIndex.toString();
                        if (_.where(rulesLearntPool, { ruleId: contextCollectionOrdered[i].uniqueId }).length === 0)
                            $acceptContainer.highlightHtmlMultiContextWithToolTip(firstcontext, lastcontext, firstindex, endPosLastContextIndex, "span", "", spnId, ruleDescription, TooltTipCurrentCounterHelper, TooltTipMaxCounterHelper, contextCollectionOrdered[i].rule, contextCollectionOrdered[i].uniqueId, encodeURIComponent(JSON.stringify(contextCollectionOrdered[i])));
                    }
                }
            }  //end while

            //code for not followed suggestions
            TooltTipMaxCounterHelper = styleResponses.length;
            TooltTipCurrentCounterHelper = -1;
            while (styleResponses.length > 0) {

                var currentResponse = styleResponses.shift();
                var currentResponseContextCollection = []

                for (var i = 0; i < styleResponses.length; i++) {
                    if ((parseInt(styleResponses[i].startpos) >= parseInt(currentResponse.startpos)) && (parseInt(styleResponses[i].endpos) <= parseInt(currentResponse.endpos))) {
                        currentResponseContextCollection.push(styleResponses[i]);
                        styleResponses.splice(i, 1);
                        i = (i == 0) ? -1 : 0;
                    }
                }

                currentResponseContextCollection.push(currentResponse);
                var contextCollectionOrdered = currentResponseContextCollection.sort(function (a, b) {

                    var aval = parseInt(a.ComputePosAverage());
                    var bval = parseInt(b.ComputePosAverage());
                    return (bval - aval);
                })

                for (var i = 0; i < contextCollectionOrdered.length; i++) {

                    if (contextCollectionOrdered[i].context.length > 0) {
                        ++TooltTipCurrentCounterHelper;
                        var spnId = "spnToolTip_" + contextCollectionOrdered[i].GetStartPosition() + "_" + contextCollectionOrdered[i].GetEndPosition();
                        var ruleDescription = contextCollectionOrdered[i].description; contextCollectionOrdered[i].description = "";
                        if (_.where(rulesLearntPool, { ruleId: contextCollectionOrdered[i].uniqueId }).length === 0)
                            $acceptContainer.highlightWithToolTip(contextCollectionOrdered[i].context, parseInt(contextCollectionOrdered[i].startpos), parseInt(contextCollectionOrdered[i].endpos), 'span', spnId, ruleDescription, TooltTipCurrentCounterHelper, TooltTipMaxCounterHelper, contextCollectionOrdered[i].rule, contextCollectionOrdered[i].uniqueId, encodeURIComponent(JSON.stringify(contextCollectionOrdered[i])));
                    }
                }

            } //end whiles

        } //end function

        function BuildRulesWithSuggestions(acceptResponses) {
            menuscount = 0;
            $('ul[id^="acceptmenu"]').remove();
            while (acceptResponses.length > 0) {
                var currentResponse = acceptResponses.shift();
                var currentResponseContextCollection = []

                for (var i = 0; i < acceptResponses.length; i++) {
                    var s1 = parseInt(acceptResponses[i].startpos);
                    var s2 = parseInt(currentResponse.startpos);
                    var e1 = parseInt(acceptResponses[i].endpos);
                    var e2 = parseInt(currentResponse.endpos);
                    if ((s1 >= s2) && (e1 <= e2)) {
                        currentResponseContextCollection.push(acceptResponses[i]);
                        acceptResponses.splice(i, 1);
                        i = (i == 0) ? -1 : 0;
                    }
                }
                currentResponseContextCollection.push(currentResponse);
                var contextCollectionOrdered = currentResponseContextCollection.sort(function (a, b) {

                    var aval = parseInt(a.ComputePosAverage());
                    var bval = parseInt(b.ComputePosAverage());
                    return (bval - aval);
                })


                for (var i = 0; i < contextCollectionOrdered.length; i++) {
                    for (var j = 0; j < contextCollectionOrdered.length; j++) {
                        if (contextCollectionOrdered[i].startpos == contextCollectionOrdered[j].startpos && contextCollectionOrdered[i].endpos == contextCollectionOrdered[j].endpos && i != j) {
                            contextCollectionOrdered[i].suggestions.push.apply(contextCollectionOrdered[i].suggestions, contextCollectionOrdered[j].suggestions);
                            contextCollectionOrdered.splice(j, 1);
                            j = (j == 0) ? -1 : 0;
                            i = (i == 0) ? -1 : 0;
                            break;
                        }
                    }
                }

                for (var i = 0; i < contextCollectionOrdered.length; i++) {
                    var spnid = "spncontext_" + contextCollectionOrdered[i].startpos + "_" + contextCollectionOrdered[i].endpos + "_" + menuscount + "_" + i;
                    if (contextCollectionOrdered[i].context.length > 0 && (contextCollectionOrdered[i].suggestions.length > 0)) {
                        if ((_.where(wordsLearntPool, { context: contextCollectionOrdered[i].context.toString() }).length === 0) && (_.where(rulesLearntPool, { ruleId: contextCollectionOrdered[i].uniqueId }).length === 0)) {
                            $acceptContainer.highlight(contextCollectionOrdered[i].context, parseInt(contextCollectionOrdered[i].startpos), 'span', 'accept-highlight', spnid);
                        }
                        else {
                            contextCollectionOrdered.splice(i, 1);
                            --i;
                        }

                    }
                    else {
                        var multiContext = "";
                        for (var j = 0; j < contextCollectionOrdered[i].contextpieces.length; j++)
                            multiContext += contextCollectionOrdered[i].contextpieces[j].Piece;

                        if (multiContext.length > 0 && _.where(wordsLearntPool, { context: multiContext.toString() }).length === 0 && _.where(rulesLearntPool, { ruleId: contextCollectionOrdered[i].uniqueId }).length === 0)
                            $acceptContainer.highlight(multiContext, parseInt(contextCollectionOrdered[i].startpos), 'span', 'accept-highlight', spnid); //$('#' + acceptContainerId).highlight(multiContext, parseInt(contextCollectionOrdered[i].startpos), 'span', 'accept-highlight', spnid);
                        else {
                            contextCollectionOrdered.splice(i, 1);
                            --i;
                        }

                    }
                }

                var menuname = "acceptmenu_" + menuscount.toString();
                ++menuscount;
                $(document.body).append('<ul id="' + menuname + '" class="jeegoocontext cm_default" style="z-index: 9999999;">');
                for (var j = 0; j < contextCollectionOrdered.length; j++) {
                    if (contextCollectionOrdered[j].suggestions.length == 0) {
                        //TODO
                    }
                    else {
                        contextCollectionOrdered[j].description = "";

                        switch (contextCollectionOrdered[j].type) {
                            case "GRAMMAR":
                                {
                                    for (var k = 0; k < contextCollectionOrdered[j].suggestions.length; k++)
                                        $('#' + menuname).append('<li style="cursor:pointer;" id="sug_' + j + "_" + k + "_" + contextCollectionOrdered[j].startpos + "_" + contextCollectionOrdered[j].endpos + "_gr" + '" class="icon"><span class="icon grammar" title="' + labelDialogCtxGrammarTooltip + '"><span style="display:none;" class="accept-rule-unique-id"  title="' + contextCollectionOrdered[j].uniqueId + '"></span><span style="display:none;" class="flag-raw-json" title="' + encodeURIComponent(JSON.stringify(contextCollectionOrdered[j])) + '"></span></span>' + (contextCollectionOrdered[j].suggestions[k].length > 0 ? contextCollectionOrdered[j].suggestions[k].toString() : labelEmptySuggestion) + '</li>');
                                } break;
                            case "SPELLING":
                                {
                                    for (var k = 0; k < contextCollectionOrdered[j].suggestions.length; k++)
                                        $('#' + menuname).append('<li style="cursor:pointer;" id="sug_' + j + "_" + k + "_" + contextCollectionOrdered[j].startpos + "_" + contextCollectionOrdered[j].endpos + "_sp" + '" class="icon"><span class="icon spelling" title="' + labelDialogCtxSpellingTooltip + '"><span style="display:none;" class="accept-rule-unique-id" title="' + contextCollectionOrdered[j].uniqueId + '"></span><span style="display:none;" class="flag-raw-json" title="' + encodeURIComponent(JSON.stringify(contextCollectionOrdered[j])) + '"></span></span>' + (contextCollectionOrdered[j].suggestions[k].length > 0 ? contextCollectionOrdered[j].suggestions[k].toString() : labelEmptySuggestion) + '</li>');
                                } break;
                            case "STYLE":
                                {
                                    for (var k = 0; k < contextCollectionOrdered[j].suggestions.length; k++)
                                        $('#' + menuname).append('<li  style="cursor:pointer;" id="sug_' + j + "_" + k + "_" + contextCollectionOrdered[j].startpos + "_" + contextCollectionOrdered[j].endpos + "_sp" + '" class="icon"><span class="icon style" title="' + labelDialogCtxStyleTooltip + '"><span style="display:none;" class="accept-rule-unique-id" title="' + contextCollectionOrdered[j].uniqueId + '"></span><span style="display:none;" class="flag-raw-json" title="' + encodeURIComponent(JSON.stringify(contextCollectionOrdered[j])) + '"></span></span>' + (contextCollectionOrdered[j].suggestions[k].length > 0 ? contextCollectionOrdered[j].suggestions[k].toString() : labelEmptySuggestion) + '</li>');
                                } break;
                        }
                    }

                }
                if ($('ul[id^="' + menuname + '"] li').size() > 0) {
                    switch (contextCollectionOrdered[0].type) {
                        case "GRAMMAR":
                            {
                                //$('#' + menuname).append('<li  style="cursor:pointer;" id="lrn_' + j + "_" + k + "_" + contextCollectionOrdered[0].startpos + "_" + contextCollectionOrdered[0].endpos + "_lrn" + '" class="icon"><span class="icon learn" title="' + ignoreDialogTooltip + '"></span><span style="display:none;" class="accept-rule-unique-id">' + contextCollectionOrdered[0].uniqueId + '</span><span style="display:none;" class="accept-rule-name">' + contextCollectionOrdered[0].rule + '</span><span style="display:none;" class="flag-raw-json" title="' + encodeURIComponent(JSON.stringify(contextCollectionOrdered)) + '"></span>' + ignoreDialogLabel + '</li>');
                                $('<li  style="cursor:pointer;" id="lrn_' + j + "_" + k + "_" + contextCollectionOrdered[0].startpos + "_" + contextCollectionOrdered[0].endpos + "_lrn" + '" class="icon"><span class="icon learn" title="' + ignoreDialogTooltip + '"></span><span style="display:none;" class="accept-rule-unique-id">' + contextCollectionOrdered[0].uniqueId + '</span><span style="display:none;" class="accept-rule-name">' + contextCollectionOrdered[0].rule + '</span><span style="display:none;" class="flag-raw-json" title="' + encodeURIComponent(JSON.stringify(contextCollectionOrdered)) + '"></span>' + ignoreDialogLabel + '</li>').insertBefore('#' + menuname + " LI:first");
                            } break;
                        default:
                            {
                                //$('#' + menuname).append('<li  style="cursor:pointer;" id="lrn_' + j + "_" + k + "_" + contextCollectionOrdered[0].startpos + "_" + contextCollectionOrdered[0].endpos + "_lrn" + '" class="icon"><span class="icon learn" title="' + learnDialogTooltip + '"></span><span style="display:none;" class="accept-spelling-rule-unique-id">' + contextCollectionOrdered[0].uniqueId + '</span><span style="display:none;" class="flag-raw-json" title="' + encodeURIComponent(JSON.stringify(contextCollectionOrdered)) + '"></span>' + learnDialogLabel + '</li>');
                                $('<li  style="cursor:pointer;" id="lrn_' + j + "_" + k + "_" + contextCollectionOrdered[0].startpos + "_" + contextCollectionOrdered[0].endpos + "_lrn" + '" class="icon"><span class="icon learn" title="' + learnDialogTooltip + '"></span><span style="display:none;" class="accept-spelling-rule-unique-id">' + contextCollectionOrdered[0].uniqueId + '</span><span style="display:none;" class="flag-raw-json" title="' + encodeURIComponent(JSON.stringify(contextCollectionOrdered)) + '"></span>' + learnDialogLabel + '</li>').insertBefore('#' + menuname + " LI:first");
                            } break;
                    }

                    CreateContextMenu(menuname);
                }
                else
                    $('#' + menuname).remove();
            }
        }

        //display results
        function displayResults() {
            //clean messages 
            showToolbarMessage("", "", 100);
            $("#" + btnReplaceId).css("display", "inline");
            $("#btnSwapText_").css("display", "inline");
            if (settings.showFixAll)
                $("#" + btnFixAllId).css("display", "inline");
            if (settings.showManualCheck)
                $("#" + btnRefreshId).css("display", "inline");
            $("#" + btnReplaceId).css("display", "inline");
            //hide loadding mask
            $("#mainPlaceHolder_" + acceptDialogId + "").find(".loadmask").css("display", "none");
            CheckifThereAnyMore();
            $("#editor_" + acceptContainerId).css("display", "block");
            //need to show checking levels
            if (settings.checkingLevels.length > 0)
                $('div[aria-labelledby=ui-dialog-title-' + acceptDialogId + ']').find('.ui-dialog-buttonpane').find("#format_" + acceptDialogId + "").css('display', 'block');
        }

        //checks if there any more replaceable rules
        function CheckifThereAnyMore() {
            if ($acceptContainer.find('SPAN.accept-highlight').length == 0) {  //if ($('#' + acceptContainerId + ' SPAN.accept-highlight').length == 0) {
                $("#" + btnFixAllId).css('display', 'none');
            }
        }

        function removeKeepChildren(node) {
            var $node = $(node);
            $node.contents().each(function () {
                $(this).insertBefore($node);
            });
            $node.remove();
        }

        //start build suggestions context menus and fix methods
        function CreateContextMenu(menuname) {
            $acceptContainer.find('SPAN.accept-highlight').each(function (index) {
                if (!$(this).data('events')) {
                    $('#' + menuname).mouseleave(function (event) {
                        $(this).css('display', 'none');
                    });

                    $(this).jeegoocontext(menuname,
							{
							    event: 'mouseover',
							    //startLeftOffset: ifrx,
							    //startTopOffset: ifry,
							    onSelect: function (e, context) {

							        var option = $(this).attr("id").substr(0, 4);

							        switch (option) {
							            case "sug_":
							                {
							                    var clickedli = $(this).closest('li[id^="sug_"]');
							                    var clickedLiSpllited = clickedli[0].id.split('_');
							                    var suggestionToUse = $(this).text();
							                    var clickedUl = $(this).closest('ul');
							                    var textBefore = $acceptContainer.text();

							                    //if flag type == gr means flag is grammar, in this case we check if there are any spelling rule we can use
							                    if (clickedLiSpllited[5] == "gr") {
							                        if (clickedUl != null && clickedUl.length > 0) {
							                            for (var i = 0; i < clickedUl[0].childNodes.length; i++) {
							                                var li = clickedUl[0].childNodes[i];
							                                var liIdSplitted = li.id.split('_');
							                                //If we find any Spelling rule we can replace it on the grammar suggestion before we actually use it
							                                if (liIdSplitted[5] == "sp") {
							                                    var matchingSpellingNode = $acceptContainer.find('span[id^="spncontext_' + liIdSplitted[3] + '_' + liIdSplitted[4] + '"]');
							                                    var spellingPartToReplace = "";
							                                    if (matchingSpellingNode != null && matchingSpellingNode.length > 0) {
							                                        spellingPartToReplace = matchingSpellingNode[0].childNodes[0].data;
							                                        var firstSpellingRuleToUse = $($(li)).contents().filter(function () { return this.nodeType == 3; });
							                                        suggestionToUse = suggestionToUse.replace(spellingPartToReplace, firstSpellingRuleToUse[0].data);
							                                        break;

							                                    }
							                                }
							                            }
							                        }

							                        $acceptContainer.find('span[id^="spncontext_' + clickedLiSpllited[3] + '_' + clickedLiSpllited[4] + '"]').each(function (index) {
							                            $(this).find('span[id^="spncontext"]').replaceWith(function () { return $(this).contents(); });
							                            suggestionToUse != labelEmptySuggestion ? $(this).text(suggestionToUse) : $(this).text("");
							                            removeKeepChildren($(this));
							                        });

							                        sendAuditFlag(clickedLiSpllited[3], clickedLiSpllited[4], suggestionToUse, clickedUl, textBefore, $acceptContainer.text(), $(this).find('span.flag-raw-json').attr('title'), context.id);
							                    }
							                    else {
							                        var spnContext = $acceptContainer.find('span[id^="spncontext_' + clickedLiSpllited[3].toString() + '_' + clickedLiSpllited[4].toString() + '"]');
							                        if (spnContext != null) {
							                            suggestionToUse != labelEmptySuggestion ? $(spnContext).text(suggestionToUse) : $(spnContext).text("");
							                            sendAuditFlag(clickedLiSpllited[3], clickedLiSpllited[4], suggestionToUse, clickedUl, textBefore, $acceptContainer.text(), $(this).find('span.flag-raw-json').attr('title'), context.id);
							                            removeKeepChildren($(spnContext));

							                        }
							                    }

							                    if ($acceptContainer.find('.accept-highlight').length == 0)
							                        $("#" + btnRefreshId).trigger('click');

							                } break;
							            case "lrn_":
							                {
							                    var clickedLiSpllited = this.id.split('_');
							                    var contextToLearn = null;
							                    $acceptContainer.find('span[id^="spncontext_' + clickedLiSpllited[3].toString() + '_' + clickedLiSpllited[4].toString() + '"]').each(function () {
							                        contextToLearn = $(this).text();
							                        removeKeepChildren($(this));
							                    });

							                    $(document).find('li[id$="' + clickedLiSpllited[3].toString() + '_' + clickedLiSpllited[4].toString() + '_gr"]').each(function () {
							                        var $nextLi = $(this).next("li");
							                        if ($nextLi !== null && $nextLi.attr("id") !== null && $nextLi.attr("id") !== undefined) {
							                            var idSplitted = $nextLi.attr("id").split('_');
							                            //$nextLi.closest('ul').find("li:last").attr('id', 'lrn_' + idSplitted[1] + '_' + idSplitted[2] + '_' + idSplitted[3] + '_' + idSplitted[4] + '_lrn');
							                            $nextLi.closest('ul').find("li:first").attr('id', 'lrn_' + idSplitted[1] + '_' + idSplitted[2] + '_' + idSplitted[3] + '_' + idSplitted[4] + '_lrn');
							                        }
							                    }).remove();

							                    $(document).find('li[id$="' + clickedLiSpllited[3].toString() + '_' + clickedLiSpllited[4].toString() + '_sp"]').remove();
							                    var result = _.where(wordsLearntPool, { context: contextToLearn });

							                    if (result.length === 0 && contextToLearn != null) {

							                        if ($(this).find(".accept-rule-unique-id").length > 0) {
							                            //rule behaviour
							                            var ruleUniqueId = $(this).find(".accept-rule-unique-id").text();
							                            var ruleName = $(this).find(".accept-rule-name").text(); /*not used?*/
							                            var jsonRaw = $(this).find("span.flag-raw-json").attr('title');
							                            $(this).find(".accept-rule-unique-id").remove();
							                            $(this).find(".accept-rule-name").remove();
							                            var result = _.where(rulesLearntPool, { ruleId: ruleUniqueId });
							                            if (result.length === 0) {
							                                //add the new learnt rule to the mem object
							                                rulesLearntPool.push(new RuleLearn(ruleUniqueId, ruleName, true, jsonRaw));
							                                //persist the mem object to local storage / cookie
							                                $.localStorage.setItem(labelLocalStorageRules, rulesLearntPool); //"rulesLearntPool"
							                                //show learn rule message
							                                showToolbarMessage(messageRuleLearnt.replace("@rule@", ruleName), "color:#0E9E4C;display:none;font-weight:bold;", 3000);
							                                //rebuild ignored rules table
							                                updateLearntRulesToSettingsPlaceHolder();
							                                //audit ignored rule							                               
							                                sendAuditFlagGeneric("", labelActionIgnoreRule, "", "", ruleUniqueId, "", "", "", jsonRaw, context.id);
							                            }
							                            //when the grammar rule is ignored we needed to pick the fist remaining li raw json and update the learn li for the next learn/ignore action
							                            var nextJsonRaw = $(this).closest('UL').find('li:nth-child(2)').find("span.flag-raw-json").attr("title"); //$(this).closest('ul').find("li:first").find("span.flag-raw-json").attr("title");
							                            var nextRuleUniqueId = $(this).closest('UL').find('li:nth-child(2)').find("span.accept-rule-unique-id").attr("title"); //$(this).closest('ul').find("li:first").find("span.accept-rule-unique-id").attr("title");
							                            //$(this).find("span:first").attr("title", learnDialogTooltip);
							                            $(this).html('<span class="icon learn" title="' + learnDialogTooltip + '"></span><span style="display:none;" class="accept-spelling-rule-unique-id">' + nextRuleUniqueId + '</span><span style="display:none;" class="flag-raw-json hover" title="' + nextJsonRaw + '"></span>' + learnDialogLabel + '');

							                        }
							                        else {
							                            //word to learn behaviour
							                            //json raw value
							                            var jsonRaw = $(this).find("span.flag-raw-json").attr('title');
							                            var ruleUniqueId = $(this).find("span.accept-spelling-rule-unique-id").text();
							                            //add the new learnt word to the mem object
							                            wordsLearntPool.push(new WordLearn(contextToLearn, true, jsonRaw, ruleUniqueId));
							                            //persist the mem object to local storage / cookie
							                            $.localStorage.setItem(labelLocalStorageWords, wordsLearntPool); //"wordsLearntPool"
							                            updateLearntWordsToSettingsPlaceHolder();
							                            //audit learnt word
							                            sendAuditFlagGeneric(contextToLearn, labelActionLearnWord, "", "", ruleUniqueId, "", "", "", jsonRaw, context.id);
							                            //show learn word message
							                            showToolbarMessage(messageWordLearnt.replace("@word@", contextToLearn), "color:#0E9E4C;display:none;font-weight:bold;", 3000);
							                        }

							                        if ($acceptContainer.find('span[class^="accept-highlight"]').length <= 0)
							                            showNoResultsDialog();
							                    }

							                } break;
							                //							            case "srp_":                                                                                                                                                                                                                                                                                                        
							                //							                break;                                                                                                                                                                                                                                                                                                        
							                //							            case "rpa_":                                                                                                                                                                                                                                                                                                        
							                //							                break;                                                                                                                                                                                                                                                                                                        
							                //							            case "ign_":                                                                                                                                                                                                                                                                                                        
							                //							                break;                                                                                                                                                                                                                                                                                                        
							                //							            case "iga_":                                                                                                                                                                                                                                                                                                        
							                //							                break;                                                                                                                                                                                                                                                                                                        
							            default: break;
							        }
							    }
							});

                } //end if has events attached                         

            });

        }

        function FixAll() {
            $(document).contents().find('ul[id^="acceptmenu_"]').each(function () {
                $(this).find("li:nth-child(2)").trigger('click');
                //this is now a learn all ;-)
                //$(this).find("li:first").trigger('click');
            });
        }


        //create a in-memory div, set it's inner text(which jQuery automatically encodes), then grab the encoded contents back out.  The div never exists on the page.   
        function htmlEncode(value) {
            try {
                return $('<div/>').text(value).html();
            } catch (e) {
                return value;
            }
        }

        function htmlDecode(value) {
            return $('<div/>').html(value).text();
        }

        var CleanText = function (text) {
            var cleanedText;
            //we dont necessarly need to remove the tags... its only for protection...
            //if (settings.requestFormat == 'TEXT') 
            //{
            //    cleanedText = $.trim(removeHTMLTags(text.replace(/&nbsp;/gi, ' ')));
            //    return encodeURIComponent(cleanedText);
            //}
            //else 
            //{
            cleanedText = $.trim(text); //$('#htmlPlaceHolderDiv_' + acceptDialogId).text() //.replace(/&nbsp;/gi, ' ')                							
            return encodeURIComponent(cleanedText);
            //}
        }
        function removeHTMLTags(input) {
            var strInputCode = input;
            strInputCode = strInputCode.replace(/&(lt|gt);/g, function (strMatch, p1) {
                return (p1 == "lt") ? "<" : ">";
            });
            var strTagStrippedText = strInputCode.replace(/<\/?[^>]+(>|$)/g, " ");
            return strTagStrippedText.toString();
        }
        function cloneObject(obj) {
            if (obj == null || typeof (obj) != 'object')
                return obj;
            var temp = new obj.constructor();
            for (var key in obj)
                temp[key] = clone(obj[key]);
            return temp;
        }

        function clone(obj) {
            if (obj == null || typeof (obj) != 'object')
                return obj;
            var temp = new obj.constructor();
            for (var key in obj)
                temp[key] = clone(obj[key]);
            return temp;
        }

        //load text tiny mce editor
        function LoadTextEditor() {
            $('#' + acceptObjectId).tinymce({
                //script_url: settings.tinyMceUrl,
                theme: "advanced",
                entity_encoding: "raw",
                plugins: "",
                width: "540px",
                theme_advanced_buttons1: "bold,italic,underline,separator,justifyleft,justifycenter,justifyright,separator,undo,redo,separator, btnTinyMceAccept_" + acceptObjectId + "",
                theme_advanced_buttons2: "",
                theme_advanced_buttons3: "",
                theme_advanced_buttons4: "",
                theme_advanced_toolbar_location: "top",
                theme_advanced_toolbar_align: "left",
                theme_advanced_statusbar_location: "bottom",
                theme_advanced_resizing: true,
                setup: function (ed) { // actually make the control
                    ed.addButton('btnTinyMceAccept_' + acceptObjectId, {
                        // command identifier (goes in toolbar list)
                        'title': tinyButtonMCETooltip, // title seen on hover            
                        'image': settings.imagesPath + '/actions-tools-check-spelling-icon.png',
                        'onclick': function () {
                            checkGrammar = "1";
                            checkSpelling = "1";
                            checkStyle = "1";
                            CreateAcceptDialog();
                        }
                    });
                }
            });


        } //END LOAD TEXT EDITOR

        /* start - Load Main Context Menu */
        function LoadRightClickContextMenu() {
            x = $(acceptObject).offset().left;
            y = $(acceptObject).offset().top;

            $(acceptObject).bind('mousemove', function (e) { // NOTE-1 // $('#textAreaAccept').contents().find('html').bind('mousemove', function (e) {
                if ($("#" + mainContextMenuId + "").is(':hidden') == true) {
                    $("#" + mainContextMenuId + "").css("top", y + e.clientY);
                    $("#" + mainContextMenuId + "").css("left", x + e.clientX);
                    e.stopPropagation();
                }
            });
            $(acceptObject).contextMenu({
                menu: mainContextMenuId
            }, function (action, el, pos) {
                switch (action) {
                    case "accept":
                        {
                            checkGrammar = "1"; checkSpelling = "1"; checkStyle = "1";
                            CreateAcceptDialog();

                        } break;
                    case "grammar":
                        {
                            checkGrammar = "1"; checkSpelling = "0"; checkStyle = "0"; CreateAcceptDialog();
                        }
                        break;
                    case "spell":
                        {
                            checkGrammar = "0"; checkSpelling = "1"; checkStyle = "0"; CreateAcceptDialog();
                        }
                        break;
                    case "style":
                        {
                            checkGrammar = "0"; checkSpelling = "0"; checkStyle = "1"; CreateAcceptDialog();
                        }
                        break;
                    case "accept_close": { $("#" + mainContextMenuId + "").css("display", "none") };
                }
            });
        }

        function LoadRightClickContextMenuHtmlEmbedded(placeHolderId) {
            var idTargetPlaceHolder = "";
            if (placeHolderId.length > 0)
                idTargetPlaceHolder = placeHolderId;
            else
                idTargetPlaceHolder = acceptObjectId + '_ifr';

            var checkExist = setInterval(function () {
                if ($('#' + idTargetPlaceHolder).length) {
                    x = $('#' + idTargetPlaceHolder).offset().left;
                    y = $('#' + idTargetPlaceHolder).offset().top;

                    $('#' + idTargetPlaceHolder).contents().find('html').bind('mousemove', function (e) {
                        if ($("#" + mainContextMenuId + "").is(':hidden') == true) {
                            $("#" + mainContextMenuId + "").css("top", y + e.clientY);
                            $("#" + mainContextMenuId + "").css("left", x + e.clientX);
                            e.stopPropagation();
                        }
                    });
                    $($('#' + idTargetPlaceHolder).contents().find('html')).contextMenu({
                        menu: mainContextMenuId, //'myMenu',
                        startx: x,
                        starty: y
                    }, function (action, el, pos) {
                        switch (action) {
                            case "accept":
                                {
                                    checkGrammar = "1"; checkSpelling = "1"; checkStyle = "1";
                                    CreateAcceptDialog();

                                } break;
                            case "grammar":
                                {
                                    checkGrammar = "1"; checkSpelling = "0"; checkStyle = "0"; CreateAcceptDialog();
                                }
                                break;
                            case "spell":
                                {
                                    checkGrammar = "0"; checkSpelling = "1"; checkStyle = "0"; CreateAcceptDialog();
                                }
                                break;
                            case "style":
                                {
                                    checkGrammar = "0"; checkSpelling = "0"; checkStyle = "1"; CreateAcceptDialog();

                                }
                                break;
                            case "close": { $("#" + mainContextMenuId + "").css("display", "none") };
                        }
                    });

                    clearInterval(checkExist);
                }


            }, 100); // check every 100ms

        }
        /* end Load Main Context Menu */


        /* start Main Context Menu Plugin */
        if (jQuery) (function () {
            $.extend($.fn, {
                contextMenu: function (o, callback) {
                    // Defaults
                    if (o.menu == undefined) return false;
                    //if (o.inSpeed == undefined) o.inSpeed = 150;
                    if (o.inSpeed == undefined) o.inSpeed = 150;
                    if (o.outSpeed == undefined) o.outSpeed = 75;
                    // 0 needs to be -1 for expected results (no fade)
                    if (o.inSpeed == 0) o.inSpeed = -1;
                    if (o.outSpeed == 0) o.outSpeed = -1;
                    // Loop each context menu
                    $(this).each(function () {
                        var el = $(this);
                        var offset = $(el).offset();
                        // Add contextMenu class
                        $('#' + o.menu).addClass('contextMenu');
                        // Simulate a true right click
                        $(this).mousedown(function (e) {
                            var evt = e;
                            evt.stopPropagation();
                            $(this).mouseup(function (e) {
                                e.stopPropagation();
                                var srcElement = $(this);
                                $(this).unbind('mouseup');
                                if (evt.button == 2) {
                                    // Hide context menus that may be showing
                                    $(".contextMenu").hide();
                                    // Get this context menu
                                    var menu = $('#' + o.menu);
                                    if ($(el).hasClass('disabled')) return false;
                                    // Detect mouse position
                                    var d = {}, x, y;
                                    if (self.innerHeight) {
                                        d.pageYOffset = self.pageYOffset;
                                        d.pageXOffset = self.pageXOffset;
                                        d.innerHeight = self.innerHeight;
                                        d.innerWidth = self.innerWidth;
                                    } else if (document.documentElement &&
								document.documentElement.clientHeight) {
                                        d.pageYOffset = document.documentElement.scrollTop;
                                        d.pageXOffset = document.documentElement.scrollLeft;
                                        d.innerHeight = document.documentElement.clientHeight;
                                        d.innerWidth = document.documentElement.clientWidth;
                                    } else if (document.body) {
                                        d.pageYOffset = document.body.scrollTop;
                                        d.pageXOffset = document.body.scrollLeft;
                                        d.innerHeight = document.body.clientHeight;
                                        d.innerWidth = document.body.clientWidth;
                                    }
                                    (e.pageX) ? x = e.pageX : x = e.clientX + d.scrollLeft;
                                    (e.pageY) ? y = e.pageY : y = e.clientY + d.scrollTop;

                                    // Show the menu
                                    $(document).unbind('click');
                                    if (o.starty == undefined || o.startx == undefined) {
                                        $(menu).css({ top: y, left: x }).fadeIn(o.inSpeed);

                                    }
                                    else {
                                        //$(menu).css({ top: (y + o.starty), left: (x + o.startx) }).fadeIn(o.inSpeed);                               
                                        $(menu).css({ top: (e.clientY + o.starty), left: (e.clientX + o.startx) }).fadeIn(o.inSpeed);
                                    }
                                    // alert(x); alert(y);
                                    // Hover events
                                    $(menu).find('A').mouseover(function () {
                                        $(menu).find('LI.hover').removeClass('hover');
                                        $(this).parent().addClass('hover');
                                    }).mouseout(function () {
                                        $(menu).find('LI.hover').removeClass('hover');
                                    });

                                    // Keyboard
                                    $(document).keypress(function (e) {
                                        switch (e.keyCode) {
                                            case 38: // up
                                                if ($(menu).find('LI.hover').size() == 0) {
                                                    $(menu).find('LI:last').addClass('hover');
                                                } else {
                                                    $(menu).find('LI.hover').removeClass('hover').prevAll('LI:not(.disabled)').eq(0).addClass('hover');
                                                    if ($(menu).find('LI.hover').size() == 0) $(menu).find('LI:last').addClass('hover');
                                                }
                                                break;
                                            case 40: // down
                                                if ($(menu).find('LI.hover').size() == 0) {
                                                    $(menu).find('LI:first').addClass('hover');
                                                } else {
                                                    $(menu).find('LI.hover').removeClass('hover').nextAll('LI:not(.disabled)').eq(0).addClass('hover');
                                                    if ($(menu).find('LI.hover').size() == 0) $(menu).find('LI:first').addClass('hover');
                                                }
                                                break;
                                            case 13: // enter
                                                $(menu).find('LI.hover A').trigger('click');
                                                break;
                                            case 27: // esc
                                                $(document).trigger('click');
                                                break
                                        }
                                    });

                                    // When items are selected
                                    $('#' + o.menu).find('A').unbind('click');
                                    $('#' + o.menu).find('LI:not(.disabled) A').click(function () {
                                        $(document).unbind('click').unbind('keypress');
                                        $(".contextMenu").hide();
                                        // Callback
                                        if (callback) callback($(this).attr('href').substr(1), $(srcElement), { x: x - offset.left, y: y - offset.top, docX: x, docY: y });
                                        return false;
                                    });

                                    // Hide bindings
                                    setTimeout(function () { // Delay for Mozilla
                                        $(document).click(function () {
                                            $(document).unbind('click').unbind('keypress');
                                            $(menu).fadeOut(o.outSpeed);
                                            return false;
                                        });
                                    }, 0);
                                }
                            });
                        });

                        // Disable text selection
                        if ($.browser.mozilla) {
                            $('#' + o.menu).each(function () { $(this).css({ 'MozUserSelect': 'none' }); });
                        } else if ($.browser.msie) {
                            $('#' + o.menu).each(function () { $(this).bind('selectstart.disableTextSelect', function () { return false; }); });
                        } else {
                            $('#' + o.menu).each(function () { $(this).bind('mousedown.disableTextSelect', function () { return false; }); });
                        }
                        // Disable browser context menu (requires both selectors to work in IE/Safari + FF/Chrome)
                        $(el).add($('UL.contextMenu')).bind('contextmenu', function () { return false; });

                    });
                    return $(this);
                },

                // Disable context menu items on the fly
                disableContextMenuItems: function (o) {
                    if (o == undefined) {
                        // Disable all
                        $(this).find('LI').addClass('disabled');
                        return ($(this));
                    }
                    $(this).each(function () {
                        if (o != undefined) {
                            var d = o.split(',');
                            for (var i = 0; i < d.length; i++) {
                                $(this).find('A[href="' + d[i] + '"]').parent().addClass('disabled');

                            }
                        }
                    });
                    return ($(this));
                },

                // Enable context menu items on the fly
                enableContextMenuItems: function (o) {
                    if (o == undefined) {
                        // Enable all
                        $(this).find('LI.disabled').removeClass('disabled');
                        return ($(this));
                    }
                    $(this).each(function () {
                        if (o != undefined) {
                            var d = o.split(',');
                            for (var i = 0; i < d.length; i++) {
                                $(this).find('A[href="' + d[i] + '"]').parent().removeClass('disabled');

                            }
                        }
                    });
                    return ($(this));
                },

                // Disable context menu(s)
                disableContextMenu: function () {
                    $(this).each(function () {
                        $(this).addClass('disabled');
                    });
                    return ($(this));
                },

                // Enable context menu(s)
                enableContextMenu: function () {
                    $(this).each(function () {
                        $(this).removeClass('disabled');
                    });
                    return ($(this));
                },

                // Destroy context menu(s)
                destroyContextMenu: function () {
                    // Destroy specified context menus
                    $(this).each(function () {
                        // Disable action
                        $(this).unbind('mousedown').unbind('mouseup');
                    });
                    return ($(this));
                }

            });
        })(jQuery);

        /* end  Main Context Menu Plugin  */


        /* start Handle API Result */
        function HandleResponseStatus(data, context) {
            //load local storage
            wordsLearntPool = $.localStorage.plugin.getItem(labelLocalStorageWords);
            rulesLearntPool = $.localStorage.plugin.getItem(labelLocalStorageRules);
            (wordsLearntPool != undefined) ? updateLearntWordsToSettingsPlaceHolder() : wordsLearntPool = [];
            (rulesLearntPool != undefined) ? updateLearntRulesToSettingsPlaceHolder() : rulesLearntPool = [];
            var responseStatusObj;
            if ($.browser.msie)
                responseStatusObj = JSON.parse(data.substring(2, (data.length - 1))); //responseStatusObj = JSON.parse(data);
            else
                responseStatusObj = data;
            if (responseStatusObj != null && responseStatusObj.Response.ResultSet != null) {
                var resultsets = responseStatusObj.Response.ResultSet;
                if (context == "ACCEPT") {
                    $.each(resultsets, function (i) {
                        var results = resultsets[i].Results;
                        $.each(results, function (j) {
                            var header = results[j].Header;
                            var body = results[j].Body;
                            // 
                            var acceptresponse = new Response(body.Context, header.Type, body.Suggestion, body.StartPos, body.EndPos, header.Description, header.Rule, body.ContextPieces, header.UniqueId);
                            if (body.Suggestion.length > 0)
                                acceptGenericResponses.push(acceptresponse);
                            else
                                acceptNonSuggestionGenericResponses.push(acceptresponse);
                        });
                    });      //end result set

                    if (acceptNonSuggestionGenericResponses.length > 0)
                        BuildStyleRules(clone(acceptNonSuggestionGenericResponses));

                    if (acceptGenericResponses.length > 0)
                        BuildRulesWithSuggestions(clone(acceptGenericResponses));

                    if ($acceptContainer.find('span[class^="accept-highlight"]').length > 0)
                        displayResults();
                    else
                        displayNoResultsMessage(context);


                }
                else {
                    //TODO?
                }

            }


        }
        /* end Handle API Result */

        /* start Handle API Result Status */
        function HandleRequestStatus(data, context) {
            var responseStatusObj;

            if ($.browser.msie)
                responseStatusObj = JSON.parse(data); //responseStatusObj = JSON.parse(data.substring(2,(data.length - 1)));
            else
                responseStatusObj = data;

            if (responseStatusObj != null && responseStatusObj.AcceptSessionCode != null) {

                if (responseStatusObj.GlobalSessionId != null && responseStatusObj.GlobalSessionId.length > 0)
                    globalSessionId = responseStatusObj.GlobalSessionId;

                if (responseStatusObj.AcceptSessionCode != null && responseStatusObj.AcceptSessionCode.length > 0)
                    currentChildSessionId = responseStatusObj.AcceptSessionCode;

                ParseResponseStatus(data, responseStatusObj.AcceptSessionCode, 0, context);  //DoGetResponseStatus(responseStatusObj.session);                           
            }
            else
                DisplayFailedMessage(context, errorParsingApiStatusMessage);
        }
        /* end Handle API Result Status */

        function ParseResponseStatus(data, sessionid, attempts, currentcontext) {
            var responseStatusObj;
            if ($.browser.msie) {
                try {
                    responseStatusObj = JSON.parse(data);
                }
                catch (e) {
                    responseStatusObj = JSON.parse(data.substring(2, (data.length - 1)));
                }
            }
            else
                responseStatusObj = data;

            var newattempt = ++attempts;
            if (responseStatusObj.State != null) {
                switch (responseStatusObj.State) {
                    case "DONE": DoGetResponse(sessionid, currentcontext); break;
                    case "FAILED": DisplayFailedMessage(currentcontext, errorRequestFailed); break;
                    default:
                        if (parseInt(newattempt) >= settings.refreshStatusAttempts) {
                            DisplayRefreshMessage(currentcontext, refreshMessage, sessionid); break;
                        }
                        setTimeout(function () {
                            DoGetResponseStatus(sessionid, newattempt, currentcontext);
                        }, 1000);
                        //pauseApplication(1000);                
                        break;
                }
            }
        }

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

        function buildSessionMetadata() {
            var sessionMedata = "";
            sessionMedata += settings.Rule;
            sessionMedata += ";" + settings.getSessionUser().hashCode().toString();
            return sessionMedata;
        }

        function GetData(text, withGlobalSession) {
            if (withGlobalSession) {
                return {
                    "ApiKey": "" + settings.ApiKey + "",
                    "GlobalSessionId": "" + globalSessionId + "",
                    "Text": "" + text + "",
                    "Language": "" + settings.Lang + "",
                    "Rule": "" + settings.Rule + "",
                    "Grammar": "" + checkGrammar + "",
                    "Spell": "" + checkSpelling + "",
                    "Style": "" + checkStyle + "",
                    "RequestFormat": "" + settings.requestFormat + "",
                    "IEDomain": "" + window.location + "",
                    "SessionMetadata": "" + buildSessionMetadata() + ""

                };
            }
            else {
                return {
                    "ApiKey": "" + settings.ApiKey + "",
                    "Text": "" + text + "",
                    "Language": "" + settings.Lang + "",
                    "Rule": "" + settings.Rule + "",
                    "Grammar": "" + checkGrammar + "",
                    "Spell": "" + checkSpelling + "",
                    "Style": "" + checkStyle + "",
                    "RequestFormat": "" + settings.requestFormat + "",
                    "IEDomain": "" + window.location + "",
                    "SessionMetadata": "" + buildSessionMetadata() + ""
                };

            }
        }

        /*core accept request*/
        function DoAcceptRequest(text) {
            if (text != null && text.length > 0) {
                var jsonData;
                var call;

                if ($.browser.msie) {
                    if (globalSessionId != null && globalSessionId.length > 0)
                        jsonData = GetData(text, true);
                    else
                        jsonData = GetData(text, false);
                    call = settings.AcceptServerPath + "/Core/AcceptRequest";
                    var xdr = new XDomainRequest();
                    xdr.open("POST", call);
                    xdr.onload = function () {
                        HandleRequestStatus(xdr.responseText, "ACCEPT");
                    };
                    xdr.onerror = function () {
                        DisplayFailedMessage("ACCEPT", errorRequestFailed);
                    };
                    xdr.onprogress = function () { };
                    xdr.ontimeout = function () { DisplayFailedMessage("ACCEPT", errorRequestFailed); };
                    xdr.onopen = function () { };
                    xdr.timeout = settings.timeoutWaitingTime;
                    xdr.send(JSON.stringify(jsonData));

                }
                else {
                    if (globalSessionId != null && globalSessionId.length > 0)                        
                        jsonData = '{"ApiKey":"' + settings.ApiKey + '","GlobalSessionId":"' + globalSessionId + '", Text:"' + text + '", Language:"' + settings.Lang + '", Rule:" ' + settings.Rule + '", Grammar:"' + checkGrammar + '", Spell:"' + checkSpelling + '", Style:"' + checkStyle + '", SessionMetadata:"' + buildSessionMetadata() + '", RequestFormat:"' + settings.requestFormat + '"}';
                    else                        
                        jsonData = '{"ApiKey":"' + settings.ApiKey + '", "Text":"' + text + '", "Language":"' + settings.Lang + '", "Rule":" ' + settings.Rule + '", "Grammar":"' + checkGrammar + '", "Spell":"' + checkSpelling + '", "Style":"' + checkStyle + '", SessionMetadata:"' + buildSessionMetadata() + '", "RequestFormat":"' + settings.requestFormat + '"}';


                    $.ajax({
                        url: settings.AcceptServerPath + "/Core/AcceptRequest",
                        dataType: 'json',
                        contentType: "application/json",
                        type: "POST",
                        async: true,
                        cache: true,
                        data: jsonData,
                        success: function (data) {
                            HandleRequestStatus(data, "ACCEPT");
                        },
                        complete: function (data) { },
                        error: function (error) {
                            DisplayFailedMessage("ACCEPT", errorRequestFailed);
                        }
                    });
                }
            }
            else {
                $("#" + acceptDialogId + "").dialog("close");
                alert(noInputTextMessage);
            }
        }


        function DoGetResponse(sessionid, currentcontext) {
            var call = settings.AcceptServerPath + "/Core/GetResponseJsonP?session=" + encodeURIComponent(sessionid) + "&callback=?";
            /*use ms cross domain requequest*/
            if ($.browser.msie) {
                var xdr = new XDomainRequest();
                xdr.open("GET", call);
                xdr.onerror = function () {
                    DisplayFailedMessage(currentcontext, errorRequestFailed);
                }
                xdr.onload = function () {
                    HandleResponseStatus(xdr.responseText, currentcontext);
                };
                xdr.onprogress = function () { };
                xdr.ontimeout = function () { };
                xdr.onopen = function () { };
                xdr.send();
            }
            else {
                $.ajax({
                    type: 'GET',
                    url: call,
                    dataType: 'jsonp',
                    success: function (data) {
                        HandleResponseStatus(data, currentcontext);
                    },
                    complete: function () { },
                    error: function () {
                        DisplayFailedMessage(currentcontext, errorRequestFailed);
                    },
                    data: {},
                    cache: false,
                    async: false
                });

            }
        }


        function DoGetResponseStatus(sessionid, newattempt, currentcontext) {
            var call = settings.AcceptServerPath + "/Core/GetResponseStatusJsonP?session=" + encodeURIComponent(sessionid) + "&callback=?";
            if ($.browser.msie) {
                var xdr = null;
                xdr = new XDomainRequest();
                xdr.open("GET", call);
                xdr.onload = function () {
                    ParseResponseStatus(xdr.responseText, sessionid, ++newattempt, currentcontext);
                };
                xdr.onerror = function () {
                    DisplayFailedMessage(currentcontext, errorRequestFailed);
                };
                xdr.onprogress = function () {
                };
                xdr.ontimeout = function () {
                };
                xdr.onopen = function () {
                };
                xdr.timeout = settings.timeoutWaitingTime;
                xdr.send();
            }
            else {

                $.ajax({
                    type: 'GET',
                    url: call,
                    dataType: 'jsonp',
                    success: function (data) {
                        ParseResponseStatus(data, sessionid, ++newattempt, currentcontext);
                    },
                    complete: function () { },
                    error: function () {
                        DisplayFailedMessage(currentcontext, errorRequestFailed);
                    },
                    data: {},
                    cache: false,
                    async: false
                });

            }

        }

        function DisplayRefreshMessage(context, message, sessionid) {
            $("#mainPlaceHolder_" + acceptDialogId + "").find(".loadmask").css("display", "none");
            //$acceptContainer.text(message);           
            $("#editor_" + acceptContainerId).css("display", "block");
            showToolbarMessage(message, "color:Orange;display:none;font-weight:bold;", -1);
            $("#" + btnManualRefreshId).css("display", "inline");
            $("#" + btnReplaceId).css("display", "none");
            $("#" + btnFixAllId).css("display", "none");
        }

        function DisplayFailedMessage(context, message) {
            $("#" + btnReplaceId).css("display", "none");
            $("#" + btnFixAllId).css("display", "none");
            $("#mainPlaceHolder_" + acceptDialogId + "").find(".loadmask").css("display", "none");
            $("#editor_" + acceptContainerId).css("display", "block");
            //$acceptContainer.text(message); 
            showToolbarMessage(message, "color:#FF0000;display:none;font-weight:bold;", -1);
        }

        function displayNoResultsMessage(context) {
            //need to show checking levels
            if (settings.checkingLevels.length > 0)
                $('div[aria-labelledby=ui-dialog-title-' + acceptDialogId + ']').find('.ui-dialog-buttonpane').find("#format_" + acceptDialogId + "").css('display', 'block');

            $("#btnSwapText_").css("display", "inline");
            if (settings.showManualCheck)
                $("#" + btnRefreshId).css("display", "inline");

            $("#mainPlaceHolder_" + acceptDialogId + "").find(".loadmask").css("display", "none"); //$("#" + acceptDialogId + " .loadmask").css("display", "none");            
            $("#editor_" + acceptContainerId).css("display", "block"); //$("#" + acceptContainerId).css("display", "block");

            //if (settings.requestFormat == "TEXT")
            //    $acceptContainer.text(decodeURIComponent(acceptTextContext)); //$("#" + acceptContainerId).text(unescape(acceptTextContext));
            //else
            //    $acceptContainer.html($('#htmlPlaceHolderDiv_' + acceptDialogId).html()); //$("#" + acceptContainerId).html($('#htmlPlaceHolderDiv_' + acceptDialogId).html());

            //if (isAutoRefresh) {
            //    isAutoRefresh = false;
            $("#" + btnReplaceId).css("display", "inline");
            //}
            showNoResultsDialog();
        }

        var showNoResultsDialog = function () {
            $("#" + btnFixAllId).css("display", "none");
            //show learn rule message
            showToolbarMessage(labelNoResultsDialogBody, "color:#0E9E4C;display:none;font-weight:bold;", -1);
        }

        var cleanHighlightedNodes = function (removeBreakLineControlNodes, removeControlParagraphs) {
            $acceptContainer.find('span[id^="spncontext_"]').each(function () {
                removeKeepChildren($(this));
            });
            $acceptContainer.find('span[id^="spnToolTip_"]').each(function () {
                removeKeepChildren($(this));
            });

            //if (removeControlNodes) {
            //$acceptContainer.find('.accept-container-paragraph').replaceWith('<br>'); //$("#" + acceptContainerId).find('p[id^="acceptParagraph_"]').replaceWith('<br>'); //&nbsp;
            //$acceptContainer.find('.accept-container-line-separator').remove(); // \n
            //}

            if (removeControlParagraphs) {
                $acceptContainer.find('.accept-container-paragraph').filter(function () {
                    return $.trim($(this).text()) === ''// && $(this).children().length == 0
                }).replaceWith('<br>');

                $acceptContainer.find('.accept-container-paragraph').removeClass();
            }

            if (removeBreakLineControlNodes) {
                $acceptContainer.find('.accept-container-line-separator').filter(function () {
                    return $.trim($(this).text()) === ''// && $(this).children().length == 0
                })
                .remove();
                $acceptContainer.find('.accept-container-line-separator').removeClass();
            }
        }

        function updateLearntRulesToSettingsPlaceHolder() {
            var $learntRules = $('#editorSettings_' + acceptContainerId).find("#learntRulesTable tbody");
            if (rulesLearntPool != null && rulesLearntPool.length > 0) {
                $learntRules.empty();
                for (var i = 0; i < rulesLearntPool.length; i++)
                    $learntRules.append('<tr><td>' + rulesLearntPool[i].ruleName + '</td><td><span class="check-unlearn-rule" id="checkUnlearnRule__' + rulesLearntPool[i].ruleId + '">' + labelRemove + '</span></td><td style="display:none;">' + rulesLearntPool[i].coolnessFactor + '</td></tr>');

                $(".check-unlearn-rule").unbind();
                $(".check-unlearn-rule").click(function () {
                    var toRemoveArray = _.where(rulesLearntPool, { ruleId: this.id.split('__')[1].toString() });
                    rulesLearntPool = _.difference(rulesLearntPool, toRemoveArray);
                    $.localStorage.setItem(labelLocalStorageRules, rulesLearntPool);
                    $(this).closest('tr').remove();

                    //audit ignored rule
                    if (toRemoveArray != null && toRemoveArray.length > 0)
                        sendAuditFlagGeneric("", labelActionRemoveIgnoreRule, "", "", toRemoveArray[0].ruleId, "", "", "", toRemoveArray[0].jsonRaw, "");

                    if (rulesLearntPool.length == 0)
                        $learntRules.append('<tr><td colspan="2">' + labelNoRulesIgnored + '</td></tr>');
                });
            }
            else {
                $learntRules.empty();
                $learntRules.append('<tr><td colspan="2">' + labelNoRulesIgnored + '</td></tr>');
            }
        }

        function updateLearntWordsToSettingsPlaceHolder() {

            var $learntWords = $('#editorSettings_' + acceptContainerId).find("#learntWordsTable tbody");
            if (wordsLearntPool != null && wordsLearntPool.length > 0) {
                $learntWords.empty();
                for (var i = 0; i < wordsLearntPool.length; i++)
                    $learntWords.append('<tr><td>' + wordsLearntPool[i].context + '</td><td><span class="check-unlearn-word" id="checkUnlearnWord_' + wordsLearntPool[i].hash + '">' + labelRemove + '</span></td><td style="display:none;">' + wordsLearntPool[i].coolnessFactor + '</td></tr>');
                $(".check-unlearn-word").unbind();
                $(".check-unlearn-word").click(function () {
                    //wordsLearntPool[parseInt(this.id.split('_')[1])].isActive = false;
                    //wordsLearntPool = _.where(wordsLearntPool, { isActive: true });                 
                    var toRemoveArray = _.where(wordsLearntPool, { hash: this.id.split('_')[1] });
                    wordsLearntPool = _.difference(wordsLearntPool, toRemoveArray);
                    $.localStorage.setItem(labelLocalStorageWords, wordsLearntPool); //"wordsLearntPool"
                    $(this).closest("tr").remove();
                    //audit learnt word
                    if (toRemoveArray != null && toRemoveArray.length > 0)
                        sendAuditFlagGeneric(toRemoveArray[0].context, labelActionRemoveLearntWord, "", "", toRemoveArray[0].ruleId, "", "", "", toRemoveArray[0].jsonRaw, "");

                    if (wordsLearntPool.length == 0)
                        $learntWords.append('<tr><td colspan="2">' + labelNoWordsLearnt + '</td></tr>');
                });
            }
            else {
                $learntWords.empty();
                $learntWords.append('<tr><td colspan="2">' + labelNoWordsLearnt + '</td></tr>');
            }

        }

        function buildSettingsPlaceHolder() {
            $('#editorSettings_' + acceptContainerId).empty().append('<div class="container" style="width:auto;margin-right:0px;margin-left:0px;">' +
            '<div class="row"><div class="left"><table id="learntWordsTable" class="acceptSettingsTable"><thead> <tr><th colspan="2">' + labelLearntWords + '</th></tr></thead><tbody><tr><td colspan="2">' + labelNoWordsLearnt + '</td></tr></tbody></table></div>' +
            '<div class="middle"><table id="learntRulesTable" class="acceptSettingsTable"><thead><tr><th colspan="2">' + labelIgnored + '</th></tr></thead><tbody><tr><td colspan="2">' + labelNoRulesIgnored + '</td></tr></tbody></table></div>' +
            '</div></div>');
        }

        function hideFlags() {
            $(document).find(".accepttooltip").css('display', 'none');
            $(document).find('.jeegoocontext').css('display', 'none');
        }

        //        var checkExist = setInterval(function ()
        //        {
        //            if ($("#mainPlaceHolder_" + acceptDialogId + "").find('#' + 'editArea_' + acceptContainerId + '_ifr').length) {                
        //                clearInterval(checkExist);
        //            }
        //        }, 100); // check every 100ms


        //resizes the editor window
        function autoResizeEditor() {
            debugger;
            if ($iframe) {
                var newh = 0;
                var neww = 0;

                if (settings.dialogWidth === 'auto' && $("#" + acceptDialogId + "").data('maximizationStatus').dialogIsMaximized === false)
                    $("#" + acceptDialogId + "").dialog("option", "width", $("#" + acceptDialogId + "").data('autoWidthHelper').dialogWidthBeforeMaximize);

                if ($("#" + acceptDialogId + "").data('maximizationStatus').dialogIsMaximized === false) {
                    newh = $("#" + acceptDialogId + "").data('maximizationStatus').editorHeightBefore;
                    neww = $("#" + acceptDialogId + "").data('maximizationStatus').editorWidthBefore;
                }
                else {
                    newh = parseFloat($("#" + acceptDialogId + "").height() * 0.95);
                    neww = parseFloat($("#" + acceptDialogId + "").width() * 0.99);
                }

                $iframe.css("width", neww + "px");
                $iframe.css("height", newh + "px");
            }
        }

        //create accept dialog	
        function CreateAcceptDialog() {
            $("#" + acceptDialogId + "").dialog("close");
            $("#" + acceptDialogId + "").dialog("destroy");
            $("#" + acceptDialogId + "").dialog({
                width: settings.dialogWidth, height: settings.dialogHeight, draggable: settings.isDraggable, modal: settings.isModal, maxWidth: settings.placeHolderMaxWidth, minHeight: settings.placeHolderMinHeight, minWidth: settings.placeHolderMinWidth, resizable: false, title: "",
                maxHeight: settings.placeHolderMaxHeight, position: settings.dialogPosition || 'center',
                open: function (event, ui) {
                    //$('div[aria-labelledby=ui-dialog-title-' + acceptDialogId + ']').find('.ui-dialog-titlebar img').remove();
                    //$('div[aria-labelledby=ui-dialog-title-' + acceptDialogId + ']').find('.ui-dialog-titlebar').append('<img id="' + imgDialogTitleId + '" style="margin-top:5px;margin-right:15px" src="' + settings.imagesPath + '/accept_dialog_title_.png" alt="ACCEPT" />');
                    $("#ui-dialog-title-" + acceptDialogId + "").html('&nbsp;');
                    $('div[aria-labelledby=ui-dialog-title-' + acceptDialogId + ']').find('.ui-dialog-buttonpane').append('<img id="imgAcceptInfo_' + acceptDialogId + '" width="30px" height="30px" style="float:left;cursor:pointer;margin: .5em .4em .5em 0;" src="' + settings.imagesPath + '/info_accept.png" alt="" />');
                    //if(!tinyMCE.getInstanceById("editArea_" + acceptContainerId + ""))
                    loadOnTheFlyEditTextEditor();
                    //$("#editorSettings_div_accept_txtAreaEnglishDemo").html($("#acceptSettings_").html());
                    buildSettingsPlaceHolder();
                    //checking levels
                    if (settings.checkingLevels.length > 0) {
                        $('div[aria-labelledby=ui-dialog-title-' + acceptDialogId + ']').find('.ui-dialog-buttonpane').append('<div id="format_' + acceptDialogId + '" style="margin: .5em .4em .5em 0;display:none;"></div>');
                        $('div[aria-labelledby=ui-dialog-title-' + acceptDialogId + ']').find('.ui-dialog-buttonpane').find("#format_" + acceptDialogId + "").append('<input type="checkbox" id="checkLevel_0" checked="checked" /><label title="' + settings.checkingLevels[0] + '" for="checkLevel_0">1</label>');
                        $('div[aria-labelledby=ui-dialog-title-' + acceptDialogId + ']').find('.ui-dialog-buttonpane').find("#format_" + acceptDialogId + "").append('<span style="position: relative;width: 15px;display: inline-block"><img width="15px" style="position: absolute;bottom: 0.3px;" height="8px" src="' + settings.imagesPath + '/arrowResized.png" alt=""></span>'); //'<img width="15px" style="padding-bottom:5px;margin-bottom:5px;" height="8px" src="' + settings.imagesPath + '/arrowResized.png" alt="">'

                        for (var i = 1; i < settings.checkingLevels.length; i++)
                            (i != (settings.checkingLevels.length - 1)) ? $('div[aria-labelledby=ui-dialog-title-' + acceptDialogId + ']').find('.ui-dialog-buttonpane').find("#format_" + acceptDialogId + "").append('<input type="checkbox" id="checkLevel_' + i.toString() + '"  /><label title="' + settings.checkingLevels[i] + '" for="checkLevel_' + i.toString() + '">' + (i + 1).toString() + '</label><span style="position: relative;width: 15px;display: inline-block"><img width="15px" style="position: absolute;bottom: 0.3px;" height="8px" src="' + settings.imagesPath + '/arrowResized.png" alt=""></span>') : $('div[aria-labelledby=ui-dialog-title-' + acceptDialogId + ']').find('.ui-dialog-buttonpane').find("#format_" + acceptDialogId + "").append('<input type="checkbox" id="checkLevel_' + i.toString() + '"  /><label title="' + settings.checkingLevels[i] + '" for="checkLevel_' + i.toString() + '">' + (i + 1).toString() + '</label>')
                        $.updateRuleSet(settings.checkingLevels[0].toString());
                    }
                },
                close: function (event, ui) {
                    $('#load_' + acceptContainerId).css('width', "auto");
                    $('#load_' + acceptContainerId).css('height', "auto");
                    if (globalSessionId != null && globalSessionId.length > 0) {
                        //if (settings.requestFormat == 'TEXT')
                        //SubmitFinalAudit($acceptContainer.text(), new Date());
                        //else {
                        acceptTextContext = getTextForHtml();
                        SubmitFinalAudit(acceptTextContext, new Date());
                        //}
                    }

                    globalSessionId = null;
                    currentChildSessionId = null;
                    acceptGenericResponses = [];
                    acceptNonSuggestionGenericResponses = [];
                    acceptTextContext = "";
                    $("#mainPlaceHolder_" + acceptDialogId + "").find(".loadmask").css("display", "block");
                    $(".resultsPlaceHolder").css("display", "none");
                    $acceptContainer.html("");
                    $('ul[id^="acceptmenu"]').remove();
                    removeTinyMCE('editArea_' + acceptContainerId + '');
                    $('div[class^="accepttooltip"]').remove();
                    $("#helpDialog_" + acceptDialogId).dialog("close");
                    $("#helpDialog_" + acceptDialogId).dialog("destroy");
                },
                dragStart: function (event, ui) {
                    hideFlags();
                },
                resize: function (event, ui) {
                    hideFlags();
                },
                buttons: [{
                    id: btnFixAllId,
                    text: labelDialogFixAll,
                    click: function () {
                        hideFlags();
                        $("#" + btnReplaceId).css("display", "none");
                        $("#" + btnFixAllId).css("display", "none");
                        FixAll();
                    }
                },
				{
				    id: btnRefreshId,
				    text: labelManualCheck,
				    click: function () {
				        hideFlags();
				        $("#btnSaveSettings_").css("display", "none");
				        $("#btnSwapText_ span").text(labelSettings);
				        $("#btnSwapText_").css("display", "none");
				        if (settings.showFixAll)
				            $("#" + btnFixAllId).css("display", "none");
				        if (settings.showManualCheck)
				            $("#" + btnRefreshId).css("display", "none");

				        $("#" + btnReplaceId).css("display", "none");
				        $('div[aria-labelledby=ui-dialog-title-' + acceptDialogId + ']').find('.ui-dialog-buttonpane').find("#format_" + acceptDialogId + "").css('display', 'none');
				        $('#load_' + acceptContainerId).css('width', $("#editor_" + acceptContainerId).outerWidth().toString() + "px");
				        $('#load_' + acceptContainerId).css('height', $("#editor_" + acceptContainerId).outerHeight().toString() + "px");
				        $("#mainPlaceHolder_" + acceptDialogId + "").find(".loadmask").css("display", "block"); //$("#" + $("#" + acceptContainerId).parent('div').attr("id") + " .loadmask").css("display", "block");				                                
				        $(".resultsPlaceHolder").css("display", "none"); //$("#" + acceptContainerId).css("display", "none");
				        acceptGenericResponses = [];
				        acceptNonSuggestionGenericResponses = [];
				        //isAutoRefresh = true;
				        /*if (settings.requestFormat == 'TEXT'){
				        acceptTextContext = $acceptContainer.text(); 
				        $acceptContainer.text("");
				        DoAcceptRequest(CleanText(acceptTextContext));
				        }
				        else
				        if (settings.requestFormat == 'HTML') {*/
				        cleanHighlightedNodes(true, false);

				        /*makes no sense to copy everything once again to the htmlPlaceHolderDiv_?*/
				        $('#htmlPlaceHolderDiv_' + acceptDialogId).html($acceptContainer.html());
				        prepareHtmlContent(false);
				        acceptTextContext = getTextForHtml();
				        DoAcceptRequest(acceptTextContext);
				        /*}*/
				    }
				}, {
				    id: btnManualRefreshId,
				    text: labelDialogRefresh,
				    click: function () {
				        $("#btnSwapText_ span").text(labelSettings);
				        $("#btnSwapText_").css("display", "none");
				        $("#btnSaveSettings_").css("display", "none");
				        $('div[aria-labelledby=ui-dialog-title-' + acceptDialogId + ']').find('.ui-dialog-buttonpane').find("#format_" + acceptDialogId + "").css('display', 'none');
				        $('#load_' + acceptContainerId).css('width', $("#editor_" + acceptContainerId).outerWidth().toString() + "px");
				        $('#load_' + acceptContainerId).css('height', $("#editor_" + acceptContainerId).outerHeight().toString() + "px");
				        $("#mainPlaceHolder_" + acceptDialogId + "").find(".loadmask").css("display", "block");
				        $(".resultsPlaceHolder").css("display", "none");
				        $("#" + btnManualRefreshId).css("display", "none");
				        acceptGenericResponses = [];
				        acceptNonSuggestionGenericResponses = [];
				        DoGetResponseStatus(currentChildSessionId, 1, "ACCEPT");
				    }

				}, {
				    id: 'btnSwapText_',
				    text: labelSettings,
				    click: function () {

				        if ($("#editor_" + acceptContainerId).is(':visible')) {
				            hideFlags();
				            $("#mainPlaceHolder_" + acceptDialogId + "").flip({
				                direction: 'tb',
				                color: '#f0f0ee',
				                onBefore: function () {
				                    $('#editorSettings_' + acceptContainerId).css('width', $("#editor_" + acceptContainerId).outerWidth().toString() + "px");
				                    $('#editorSettings_' + acceptContainerId).css('height', $("#editor_" + acceptContainerId).outerHeight().toString() + "px");
				                    $.ifrxmem = $.ifrx;
				                    $.ifrymem = $.ifry;
				                },
				                onAnimation: function () {

				                },
				                onEnd: function () {
				                    if ((wordsLearntPool != null && wordsLearntPool.length > 0) || (rulesLearntPool != null && rulesLearntPool.length > 0))
				                        $("#btnSaveSettings_").css("display", "inline");
				                    $("#" + btnReplaceId).css("display", "none");
				                    if (settings.showFixAll)
				                        $("#" + btnFixAllId).css("display", "none");
				                    if (settings.showManualCheck)
				                        $("#" + btnRefreshId).css("display", "none");
				                    $('div[aria-labelledby=ui-dialog-title-' + acceptDialogId + ']').find('.ui-dialog-buttonpane').find("#format_" + acceptDialogId + "").css('display', 'none');
				                    $("#btnSwapText_ span").text(labelEditor);
				                    $("#editor_" + acceptContainerId).css("display", "none");
				                    $('#editorSettings_' + acceptContainerId).css("display", "block");
				                }
				            });
				        }
				        else {
				            $("#mainPlaceHolder_" + acceptDialogId + "").flip({
				                direction: 'bt',
				                color: '#f0f0ee',
				                onBefore: function () {
				                },
				                onAnimation: function () {
				                },
				                onEnd: function () {
				                    $.ifrx = $.ifrxmem;
				                    $.ifry = $.ifrymem;
				                    $("#btnSaveSettings_").css("display", "none");
				                    $("#" + btnReplaceId).css("display", "inline");
				                    if (settings.showFixAll)
				                        $("#" + btnFixAllId).css("display", "inline");
				                    if (settings.showManualCheck)
				                        $("#" + btnRefreshId).css("display", "inline");
				                    $('div[aria-labelledby=ui-dialog-title-' + acceptDialogId + ']').find('.ui-dialog-buttonpane').find("#format_" + acceptDialogId + "").css('display', 'block');
				                    $("#btnSwapText_ span").text(labelSettings);
				                    //hide settings 
				                    $('#editorSettings_' + acceptContainerId).css("display", "none"); //$("#editorSettings_div_accept_txtAreaEnglishDemo").css("display", "none");
				                    //show editor
				                    $("#editor_" + acceptContainerId).css("display", "block"); //$("#editor_div_accept_txtAreaEnglishDemo").css("display", "block");
				                }
				            });
				        }
				    }
				},
                {
                    id: btnReplaceId,
                    text: labelDialogReplace,
                    click: function () {
                        cleanHighlightedNodes(true, true);
                        settings.requestFormat == 'TEXT' ? settings.SubmitInputText($acceptContainer.text()) : settings.SubmitInputText($acceptContainer.html());
                        /*if (settings.requestFormat == 'TEXT')
                        settings.SubmitInputText($acceptContainer.text()); 
                        else
                        if (settings.requestFormat == 'HTML') 
                        {
                        cleanHighlightedNodes(true);
                        settings.SubmitInputText($acceptContainer.html());
                        }*/
                        $(this).dialog("close");
                    }
                }]
            }).dialogExtend(settings.displayExtend ? settings.dialogExtendOptions : {});



            $("#" + btnReplaceId).mouseover(function () {
                $(this).removeClass().addClass("ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-state-hover");
            }).mouseout(function () {
                $(this).removeClass().addClass("ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only");
            });
            $("#" + btnRefreshId).mouseover(function () {
                $(this).removeClass().addClass("ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-state-hover");
            }).mouseout(function () {
                $(this).removeClass().addClass("ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only");
            });
            $("#" + btnManualRefreshId).mouseover(function () {
                $(this).removeClass().addClass("ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-state-hover");
            }).mouseout(function () {
                $(this).removeClass().addClass("ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only");
            });
            $("#" + btnFixAllId).mouseover(function () {
                $(this).removeClass().addClass("ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-state-hover");
            }).mouseout(function () {
                $(this).removeClass().addClass("ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only");
            });


            //checking levels
            if (settings.checkingLevels.length > 0) {
                $('div[aria-labelledby=ui-dialog-title-' + acceptDialogId + ']').find('.ui-dialog-buttonpane').find('input[id^="checkLevel_"]').button();
                $('div[aria-labelledby=ui-dialog-title-' + acceptDialogId + ']').find('.ui-dialog-buttonpane').find('input[id^="checkLevel_0"]').button("option", "icons", { primary: "", secondary: "ui-icon-check" });
                $('div[aria-labelledby=ui-dialog-title-' + acceptDialogId + ']').find('.ui-dialog-buttonpane').find('input[id^="checkLevel_1"]').button("option", "icons", { primary: "", secondary: "ui-icon-circle-triangle-e" });
                $('div[aria-labelledby=ui-dialog-title-' + acceptDialogId + ']').find('.ui-dialog-buttonpane').find('input[id^="checkLevel_2"]').button("option", "icons", { primary: "", secondary: "ui-icon-circle-triangle-e" });
                $('div[aria-labelledby=ui-dialog-title-' + acceptDialogId + ']').find('.ui-dialog-buttonpane').find('input[id^="checkLevel_"]').click(function () {

                    if ($(this).attr("checked") == true) {
                        $('div[aria-labelledby=ui-dialog-title-' + acceptDialogId + ']').find('.ui-dialog-buttonpane').find('input:not(#' + this.id + ')[id^="checkLevel_"]').each(function () {
                            $(this).removeAttr('checked').button("refresh");
                        });
                        $.updateRuleSet(settings.checkingLevels[this.id.split('_')[1]].toString());
                        showToolbarMessage(messageRuleSetChanged.replace('@rule@', settings.checkingLevels[this.id.split('_')[1]].toString()), "color:#0E9E4C;display:none;font-weight:bold;", -1);
                        $(this).button("option", "icons", { primary: "", secondary: "ui-icon-check" });
                    }
                    else {
                        $('div[aria-labelledby=ui-dialog-title-' + acceptDialogId + ']').find('.ui-dialog-buttonpane').find('input:not(#checkLevel_0)[id^="checkLevel_"]').each(function () {
                            $(this).removeAttr('checked').button("refresh");
                        });
                        $('div[aria-labelledby=ui-dialog-title-' + acceptDialogId + ']').find('.ui-dialog-buttonpane').find('#checkLevel_0').attr('checked', 'checked').button("refresh");
                        $.updateRuleSet(settings.checkingLevels[0].toString());
                        showToolbarMessage(messageRuleSetChanged.replace('@rule@', settings.checkingLevels[0].toString()), "color:#0E9E4C;display:none;font-weight:bold;", -1);
                    }

                    $("#" + btnRefreshId).trigger('click');
                });
            }


            $("#imgAcceptInfo_" + acceptDialogId).click(function () {

                $("#helpDialog_" + acceptDialogId).dialog("close");
                $("#helpDialog_" + acceptDialogId).dialog("destroy");
                $("#helpDialog_" + acceptDialogId).dialog({
                    resizable: true,
                    open: function (event, ui) {
                        $("#acceptHelpButton_" + acceptDialogId).button().unbind('mouseover').css('cursor', 'default');
                        $("#acceptHelpSettingsButton_" + acceptDialogId).button().unbind('mouseover').css('cursor', 'default');

                        $("#acceptHelpCloseButton_" + acceptDialogId).button().unbind('mouseover').css('cursor', 'default');

                        if (settings.showFixAll) {
                            $("#acceptReplaceAllButton_" + acceptDialogId).button().unbind('mouseover').css('cursor', 'default');
                            $("#replaceAllHelpRow_" + acceptDialogId).css('display', '');
                        }
                        else
                            $("#replaceAllHelpRow_" + acceptDialogId).css('display', 'none');

                        if (settings.checkingLevels.length > 0) {
                            $("#checkingLevelsHelpRow_" + acceptDialogId).css('display', '');
                            $("#checkingLevelsHelpRow_" + acceptDialogId).find('input').button();
                            $("#checkingLevelsHelpRow_" + acceptDialogId).find('*').css('cursor', 'default');
                            $("#checkingLevelsHelpRow_" + acceptDialogId).css('cursor', 'default');
                        }

                        if (settings.showManualCheck) {
                            $("#acceptHelpManualCheckButtonRow_" + acceptDialogId).css('display', '');
                            $("#acceptHelpManualCheckButton_" + acceptDialogId).button();
                            $("#acceptHelpManualCheckButton_" + acceptDialogId).css('cursor', 'default');;
                        }

                        $('div[aria-labelledby=ui-dialog-title-helpDialog_' + acceptDialogId + ']').find('.ui-dialog-buttonpane').append('<img id="' + imgDialogTitleId + '" style="margin-top:5px;margin-right:15px" src="' + settings.imagesPath + '/accept_globe.png" alt="ACCEPT" /><br /><span style="font-size: 0.8em;width: 100%;">' + labelHelpAcceptMessage + '</span>');

                    },
                    width: 600,
                    height: 'auto',
                    modal: false,
                    buttons: {
                        "Ok": function () {
                            $("#helpDialog_" + acceptDialogId).dialog("close");
                            $("#helpDialog_" + acceptDialogId).dialog("destroy");
                        }
                    }
                });

            });

            //hide all buttons by default
            $('div[aria-labelledby=ui-dialog-title-' + acceptDialogId + ']').find('.ui-dialog-buttonpane').find("button").css("display", "none");
            //check if tiny mce iframe is loaded
            if ($("#mainPlaceHolder_" + acceptDialogId + "").find('#' + 'editArea_' + acceptContainerId + '_ifr').length)
                doWork();
            else {
                var checkExistMain = setInterval(function () {
                    if ($("#mainPlaceHolder_" + acceptDialogId + "").find('#' + 'editArea_' + acceptContainerId + '_ifr').length) {
                        doWork()
                        clearInterval(checkExistMain);
                    }
                }, 100);
            }

        }

        function doWork() {
            //cache editor container object
            $acceptContainer = $("#mainPlaceHolder_" + acceptDialogId + "").find('#' + 'editArea_' + acceptContainerId + '_ifr').contents().find("#tinymce");
            //cache iframe object + left and right offsets
            $iframe = $("#mainPlaceHolder_" + acceptDialogId + "").find('#' + 'editArea_' + acceptContainerId + '_ifr');
            //$.ifrx = $("#mainPlaceHolder_" + acceptDialogId + "").find('#' + 'editArea_' + acceptContainerId + '_ifr').offset().left;
            //$.ifry = $("#mainPlaceHolder_" + acceptDialogId + "").find('#' + 'editArea_' + acceptContainerId + '_ifr').offset().top;        
            //$.ifry = $.ifry - $(window).scrollTop();
            $.refreshIframePosition();
            $toolbarUserInfoPlaceholder = $("#mainPlaceHolder_" + acceptDialogId + "").find("td.mceStatusbar");
            $toolbarUserInfoPlaceholder.append('<span id="spanInfoMessage_"></span>');
            //bind event to document calculate iframe scrolling when mouse under the iframe
            //        $iframe.contents().find('body').bind('mousemove', function (e) {
            //            try {
            //                $.refreshIframePosition();
            //                e.stopPropagation();
            //            } catch (ex) { }
            //        });
            //bind event to document calculate iframe scrolling
            //$(document).bind('mousemove', function (e) {
            //try {
            //$.ifrx = $iframe.offset().left - $iframe.contents().find('body').scrollLeft();
            //$.ifry = $iframe.offset().top - $iframe.contents().find('body').scrollTop();
            //$.refreshIframePosition();
            //e.stopPropagation();
            //} catch (ex) { }
            //});
            $(window).bind('scrollstop', function (e) {
                $.refreshIframePosition();
            });
            $iframe.contents().find('body').bind('scrollstop', function (e) {
                $.refreshIframePosition();
            });

            //add css to iframe
            var $head = $iframe.contents().find("head");
            $head.append($("<link/>", { rel: "stylesheet", href: "" + settings.styleSheetPath + "/Accept.css", type: "text/css" }));
            $head.append('<meta http-Equiv="Cache-Control" Content="no-cache">');
            $head.append('<meta http-Equiv="Pragma" Content="no-cache">');
            $head.append('<meta http-Equiv="Expires" Content="0">');
            //load content
            //if (settings.requestFormat == 'TEXT')
            //    acceptTextContext = CleanText(settings.LoadInputText());
            //else
            //    if (settings.requestFormat == 'HTML') {
            $('#htmlPlaceHolderDiv_' + acceptDialogId).html(settings.LoadInputText());
            prepareHtmlContent(true);
            acceptTextContext = getTextForHtml();
            //}

            DoAcceptRequest(acceptTextContext);
        }

        var showToolbarMessage = function (message, style, delay) {
            $toolbarUserInfoPlaceholder.find('#spanInfoMessage_').attr("style", style);
            $toolbarUserInfoPlaceholder.find('#spanInfoMessage_').text(message);
            $toolbarUserInfoPlaceholder.find('#spanInfoMessage_').fadeIn();
            if (delay > 0) {
                setTimeout(function () {
                    $toolbarUserInfoPlaceholder.find('#spanInfoMessage_').fadeOut()
                }, delay);
            }
        }

        var prepareHtmlContent = function (replaceBrTags) {
            /*tinymce.get("editArea_" + acceptContainerId + "").setContent($('#htmlPlaceHolderDiv_' + acceptDialogId).html());*/
            $acceptContainer.html($('#htmlPlaceHolderDiv_' + acceptDialogId).html());
            /*if (replaceBrTags) {
            $acceptContainer.find('br').replaceWith(function () {
            return $('<p class="accept-container-paragraph">&nbsp;</p>');
            });
            }*/

            $acceptContainer.find(settings.htmlBlockElements).each(function () {
                /*  $(this).append('<span class="accept-container-line-separator">\n</span>');*/

                $('<span class="accept-container-line-separator">\n</span>').insertAfter(this);
            });

            $acceptContainer.find('a').click(function (e) {
                e.preventDefault();
            });

        }

        //iterates html placeholder to get text to process 
        var getTextForHtml = function () {
            var content = "";
            try {
                jQuery.fn.getInnerTextFromHtml = function () {
                    function innerHighlight(node) {
                        var skip = 0;
                        if ($.browser.msie && $(node).attr('class') == 'accept-container-line-separator')
                            content = content + "\n";
                        if (node.nodeType == 3) {
                            content = content + node.data;
                        }
                        else if (node.nodeType == 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
                            for (var i = 0; i < node.childNodes.length; ++i)
                                i += innerHighlight(node.childNodes[i]);
                        }
                        return skip;
                    }
                    return this.each(function () {
                        innerHighlight(this);
                    });
                }

                $acceptContainer.html($acceptContainer.html());
                $acceptContainer.getInnerTextFromHtml();

            }
            catch (e) { }

            return encodeURIComponent(content);

        }

        //init plug-in
        initAccept();

        function addTriggerEventToContextNode(node, nodeIdToTrigger, eventToBind, eventToTrigger, ruleName, ruleUniqueId, jsonRaw) {
            if (eventToBind == 'click') {
                var myclick = $iframe.contents().find('#' + nodeIdToTrigger).data("events").click[0]; //var myclick = $('#' + nodeIdToTrigger).data("events").click[0];
                if (myclick != null)
                    $($(node)).click(myclick);
            }
            else {
                $($(node)).mouseover(function (e) {
                    sendAuditFlagGeneric("", labelActionDisplayTooltip, "", "", ruleUniqueId, "", "", "", jsonRaw, nodeIdToTrigger);
                    $("#toolTip_" + nodeIdToTrigger + "").unbind('delay');
                    hideFlags();
                    autoHideToolTip = false;
                    //var mousex = /*$iframe.contents()*/$acceptContainer.find('#' + nodeIdToTrigger).offset().left + $iframe.offset().left + 20 - $iframe.contents().find('body').scrollLeft();
                    //var mousey = /*$iframe.contents()*/$acceptContainer.find('#' + nodeIdToTrigger).offset().top + $iframe.offset().top + 10 - $iframe.contents().find('body').scrollTop();                                    														
                    //$("#toolTip_" + nodeIdToTrigger + "").css({ top: mousey, left: mousex });
                    //var contextOffset;
                    var startLeft = 0;
                    var startTop = 0;
                    var coordinates = null;
                    /*$.refreshIframePosition();
                    contextOffset = $acceptContainer.find('SPAN').filter('#' + nodeIdToTrigger).offset();
                    startLeft = contextOffset.left;
                    startTop = contextOffset.top + $acceptContainer.find('SPAN').filter('#' + nodeIdToTrigger).outerHeight();
                    startLeft += $.ifrx;
                    startTop += $.ifry;*/
                    var obj = $acceptContainer.find('SPAN').filter('#' + nodeIdToTrigger);
                    coordinates = $.findTotalOffset(obj[0]);
                    startLeft = coordinates.left + $(window).scrollLeft();
                    startTop = coordinates.top + $(window).scrollTop();
                    $.refreshIframePosition();
                    startLeft += $.ifrx;
                    startTop += $.ifry;
                    /*if($.detectIe8() === 8)
                    //$("#toolTip_" + nodeIdToTrigger + "").css({ top: startTop + $(window).scrollTop() + 10, left: startLeft + $(window).scrollLeft() + 20 });
                    //else*/
                    $("#toolTip_" + nodeIdToTrigger + "").css({ top: startTop + 10, left: startLeft + 20 });
                    $("#toolTip_" + nodeIdToTrigger + "").css('display', 'block');
                    $(this).css('background-color', 'yellow');
                    $iframe.contents().find('#' + nodeIdToTrigger).css('background-color', 'yellow');
                    $("#toolTip_" + nodeIdToTrigger + "").bind('mouseenter', function () {
                        $("#toolTip_" + nodeIdToTrigger + "").unbind('delay');
                        autoHideToolTip = false;
                    }).bind('mouseleave', function () {
                        $("#toolTip_" + nodeIdToTrigger + "").unbind('mouseleave');
                        $("#toolTip_" + nodeIdToTrigger + "").unbind('mouseenter');
                        $("#toolTip_" + nodeIdToTrigger + "").unbind('delay');
                        $("#toolTip_" + nodeIdToTrigger + "").css('display', 'none');
                    });
                }).mouseout(function () {
                    autoHideToolTip = true;
                    $(this).css('background-color', '');
                    $iframe.contents().find('#' + nodeIdToTrigger).css('background-color', '');
                    $("#toolTip_" + nodeIdToTrigger + "").delay(3000, function () {
                        if (autoHideToolTip)
                            $("#toolTip_" + nodeIdToTrigger + "").css('display', 'none');
                    });
                });
            }
        }





        function addSplittedNodeWithTriggerAction(node, startPos, endPos, elementtype, classname, id, parentNodeid, eventToBind, eventToTrigger, ruleName, ruleUniqueId, jsonRaw) {
            var spannode = document.createElement(elementtype);
            spannode.className = classname;
            spannode.id = id;
            addTriggerEventToContextNode(spannode, parentNodeid, eventToBind, eventToTrigger, ruleName, ruleUniqueId, jsonRaw);
            if (endPos == 0)
                endPos = node.length;
            var middlebit = node.splitText(startPos);
            var endbit = middlebit.splitText(endPos);
            var middleclone = middlebit.cloneNode(true);
            spannode.appendChild(middleclone);
            middlebit.parentNode.replaceChild(spannode, middlebit);
        }

        function bindToolTip(elementId, toolTipMessage, cornersIndex, oppositesIndex, stylesIndex, ruleName, ruleUniqueId, jsonRaw) {

            if (!$iframe.contents().find('#' + elementId).data('events')) {
                var tooltipContent = '<span>' + labelRuleName + ' ' + ruleName + '</span><span class="unique-rule-name-tooltip" style="display:none;">' + ruleUniqueId + '</span><span style="color: #0e9e4c;font-weight: bold;cursor:pointer;" id="check_' + elementId + '">.&nbsp ' + learnTooltipLabels + '</span><br /><br />' + toolTipMessage;
                //tooltipContent += '<span style="color: #0e9e4c;font-weight: bold;cursor:pointer;" id="check_' + elementId + '">' + learnTooltipLabels + '</span>';
                if ($("#toolTip_" + elementId + "").length == 0) {
                    $('<div id="toolTip_' + elementId + '" class="accepttooltip" style="display:none"></div>').html(tooltipContent).appendTo('body');
                    $('#check_' + elementId + '').click(function () {
                        var result = _.where(rulesLearntPool, { ruleId: ruleUniqueId });
                        if (result.length === 0) {
                            //add the new learnt rule to the mem object
                            rulesLearntPool.push(new RuleLearn(ruleUniqueId, ruleName, true, jsonRaw));
                            //persist the mem object to local storage / cookie
                            $.localStorage.setItem(labelLocalStorageRules, rulesLearntPool); //"rulesLearntPool"
                            //show learn rule message
                            showToolbarMessage(messageRuleLearnt.replace("@rule@", ruleName), "color:#0E9E4C;display:none;font-weight:bold;", 3000);
                            //rebuild ignored rules table
                            updateLearntRulesToSettingsPlaceHolder();
                            //audit ignored rule
                            sendAuditFlagGeneric("", labelActionIgnoreRule, "", "", ruleUniqueId, "", "", "", jsonRaw, elementId);

                            //now remove any other tooltip with the same rule name                          
                            var $nodesWithSameRuleName = $("span.unique-rule-name-tooltip").filter(function () {
                                return $(this).text() == ruleUniqueId;
                            }).parent();
                            $nodesWithSameRuleName.each(function () {
                                var idSplitted = this.id.split('_');
                                var $nodesToRemove = $acceptContainer.find('span[id^="spnToolTip_' + idSplitted[2] + '_' + idSplitted[3] + '"]');
                                $nodesToRemove.each(function () {
                                    removeKeepChildren($(this));
                                });
                            });

                        }
                        $acceptContainer.find('span[id^="' + this.id.toString().substring(6, this.id.lenght).replace("_final", "") + '"]').each(function () {
                            removeKeepChildren($(this));
                        });
                        if ($acceptContainer.find('span[class^="accept-highlight"]').length <= 0)
                            showNoResultsDialog();
                        hideFlags();
                    });
                }

                $acceptContainer.find('SPAN').filter('#' + elementId).mouseover(function (e) {
                    sendAuditFlagGeneric("", labelActionDisplayTooltip, "", "", ruleUniqueId, "", "", "", jsonRaw, elementId);
                    $("#toolTip_" + elementId + "").unbind('delay');
                    hideFlags();
                    autoHideToolTip = false;
                    var startLeft = 0;
                    var startTop = 0;
                    var coordinates = null;
                    /*var contextOffset;
                    $.refreshIframePosition();
                    contextOffset = $(this).offset();
                    startLeft = contextOffset.left;
                    startTop = contextOffset.top + $(this).outerHeight();
                    startLeft += $.ifrx;
                    startTop += $.ifry;
                    var startLeft = $iframe.offset().left + 20 - $iframe.contents().find('body').scrollLeft(); 
                    var startLeft = $iframe.offset().top + 10 - $iframe.contents().find('body').scrollTop();
                    if ($.detectIe8() === 8)
                    $("#toolTip_" + elementId + "").css({ top: startTop + $(window).scrollTop() + 10, left: startLeft + $(window).scrollLeft() + 20 });
                    else*/
                    coordinates = $.findTotalOffset(this);
                    startLeft = coordinates.left + $(window).scrollLeft();
                    startTop = coordinates.top + $(window).scrollTop();
                    $.refreshIframePosition();
                    startLeft += $.ifrx;
                    startTop += $.ifry;

                    $("#toolTip_" + elementId + "").css({ top: startTop + 10, left: startLeft + 20 });

                    $("#toolTip_" + elementId + "").css('display', 'block');
                    $iframe.contents().find('span[id^="' + elementId.split('_')[0] + '_' + elementId.split('_')[1] + '_' + elementId.split('_')[2] + '"]').css('background-color', 'yellow');
                    $("#toolTip_" + elementId + "").bind('mouseenter', function () {
                        $("#toolTip_" + elementId + "").unbind('delay');
                        autoHideToolTip = false;
                    }).bind('mouseleave', function (event) { //mouseout                        
                        $("#toolTip_" + elementId + "").unbind('mouseleave');
                        $("#toolTip_" + elementId + "").unbind('mouseenter');
                        $("#toolTip_" + elementId + "").unbind('delay');
                        $("#toolTip_" + elementId + "").css('display', 'none');
                    });

                }).mouseout(function () {
                    autoHideToolTip = true;
                    $iframe.contents().find('span[id^="' + elementId.split('_')[0] + '_' + elementId.split('_')[1] + '_' + elementId.split('_')[2] + '"]').css('background-color', '');

                    $("#toolTip_" + elementId + "").delay(3000, function (e) {
                        if (autoHideToolTip)
                            $("#toolTip_" + elementId + "").css('display', 'none');
                    });
                }).mousemove(function (e) {
                }).mouseenter(function (e) {
                    $iframe.contents().find('.jeegoocontext').css('display', 'none');
                });
            }

        }

        function GetTooltipStyleNumber(current, total, threshold) {
            if (current < threshold) {
                return current;
            }
            else {
                var res = (current - threshold);
                while (res >= threshold) {
                    res = (res - threshold);
                }
                return (res <= 0) ? 0 : res;
            }
        }

        function addSplittedNode(node, startPos, endPos, elementtype, classname, id) {
            var spannode = document.createElement(elementtype);
            spannode.className = classname;
            spannode.id = id;
            var middlebit = node.splitText(startPos);
            var endbit = middlebit.splitText(endPos);
            var middleclone = middlebit.cloneNode(true);
            spannode.appendChild(middleclone);
            middlebit.parentNode.replaceChild(spannode, middlebit);
        }

        jQuery.fn.delay = function (time, func) {
            return this.each(function () {
                setTimeout(func, time);
            });
        };

        jQuery.fn.highlight = function (pat, startpos, elementtype, classname, spnid) {
            var indexcount = 0;
            var found = false;
            function innerHighlight(node, pat, startpos) {
                var skip = 0;
                if ($.browser.msie && $(node).attr('class') == 'accept-container-line-separator') {
                    indexcount = indexcount + 1;
                }
                if (node.nodeType == 3) {
                    //var inputText = node.data.replace(/[↵]/gi, '\n');
                    var pos = node.data.toUpperCase().indexOf(pat);
                    if (pos >= 0) {
                        if (pos == startpos) {
                            addSplittedNode(node, pos, pat.length, elementtype, classname, spnid);
                            found = true;
                            skip = 1;
                        }
                        else {
                            if ((pos + indexcount) == startpos) {
                                addSplittedNode(node, pos, pat.length, elementtype, classname, spnid);
                                found = true;
                                skip = 1;
                            }
                            else {
                                var currentindexcount = (indexcount + pos + pat.length);
                                var aux = node.data.toUpperCase().substring((pos + pat.length), node.length);
                                var finalpos = pos + pat.length;
                                while (pos != -1) {
                                    pos = aux.indexOf(pat);
                                    finalpos = finalpos + pos;
                                    if ((pos + currentindexcount) == startpos) {
                                        addSplittedNode(node, finalpos, pat.length, elementtype, classname, spnid);
                                        skip = 1;
                                        found = true;
                                        break;
                                    }
                                    else {
                                        aux = aux.substring((pos + pat.length), aux.length);
                                        currentindexcount = (currentindexcount + pos + pat.length);
                                        finalpos = finalpos + pat.length;
                                    }
                                }
                                indexcount = (indexcount + parseInt(node.length));
                            }
                        }
                    }
                    else {
                        indexcount = (indexcount + parseInt(node.length));
                    }
                }
                else if (node.nodeType == 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
                    for (var i = 0; i < node.childNodes.length; ++i) {

                        i += innerHighlight(node.childNodes[i], pat, startpos);
                        if (found)
                            break;
                    }
                }
                return skip;
            }
            return this.each(function () {
                innerHighlight(this, pat.toUpperCase(), startpos);

            });
        };

        jQuery.fn.highlightWithToolTip = function (pat, startpos, endpos, elementtype, elementId, ruleTip, currentRuleCount, totalRulesCount, ruleName, ruleUniqueId, jsonRaw) {
            var indexcount = 0;
            var stylesIndex = GetTooltipStyleNumber(currentRuleCount, totalRulesCount, 3);
            var found = false;

            function innerHighlightWithToolTip(node, pat, startpos) {
                var skip = 0;
                if ($.browser.msie && $(node).attr('class') == 'accept-container-line-separator') {
                    indexcount = indexcount + 1;
                }
                if (node.nodeType == 3) {
                    //var inputText = node.data.replace(/[↵]/gi, '\n');
                    var pos = node.data.toUpperCase().indexOf(pat);
                    if (pos >= 0) {
                        if (pos == startpos) {
                            addSplittedNode(node, pos, pat.length, elementtype, cssStyles[stylesIndex], elementId);
                            found = true;
                            bindToolTip(elementId, ruleTip, stylesIndex, stylesIndex, stylesIndex, ruleName, ruleUniqueId, jsonRaw);
                            skip = 1;
                        }
                        else {

                            if ((pos + indexcount) == startpos) {
                                addSplittedNode(node, pos, pat.length, elementtype, cssStyles[stylesIndex], elementId);
                                bindToolTip(elementId, ruleTip, stylesIndex, stylesIndex, stylesIndex, ruleName, ruleUniqueId, jsonRaw);
                                found = true;
                                skip = 1;
                            }
                            else {
                                var currentindexcount = (indexcount + pos + pat.length);
                                //get the rest of the node to search for the right index.
                                var aux = node.data.toUpperCase().substring((pos + pat.length), node.length);
                                //update the final position
                                var finalpos = pos + pat.length;
                                while (pos != -1) {
                                    pos = aux.indexOf(pat);
                                    finalpos = finalpos + pos;
                                    if ((pos + currentindexcount) == startpos) {
                                        addSplittedNode(node, finalpos, pat.length, elementtype, cssStyles[stylesIndex], elementId);
                                        //BindToolTip(spannode);
                                        bindToolTip(elementId, ruleTip, stylesIndex, stylesIndex, stylesIndex, ruleName, ruleUniqueId, jsonRaw);
                                        found = true;
                                        skip = 1;
                                        break;
                                    }
                                    else {
                                        aux = aux.substring((pos + pat.length), aux.length);
                                        currentindexcount = (currentindexcount + pos + pat.length);
                                        finalpos = finalpos + pat.length;
                                    }
                                }
                                indexcount = (indexcount + parseInt(node.length));
                            }
                        }
                    }
                    else {
                        indexcount = (indexcount + parseInt(node.length));
                    }
                }
                else if (node.nodeType == 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
                    for (var i = 0; i < node.childNodes.length; ++i) {
                        i += innerHighlightWithToolTip(node.childNodes[i], pat, startpos);
                        if (found)
                            break;
                    }
                }
                return skip;
            }

            return this.each(function () {
                innerHighlightWithToolTip(this, pat.toUpperCase(), startpos);
            });
        };



        jQuery.fn.highlightHtmlMultiContextWithToolTip = function (pat, endpat, startPos, endPos, elementtype, classname, elementId, ruleTip, currentRuleCount, totalRulesCount, ruleName, ruleUniqueId, jsonRaw) {
            var indexcount = 0;
            var stylesIndex = GetTooltipStyleNumber(currentRuleCount, totalRulesCount, cssStyles.length);
            var startPiecefound = false;
            var endPieceFound = false;
            var currentPieceFound = endPieceFound;
            var finalElementId = elementId + '_final';
            var midlleContextNodesCount = 1;
            var startMiddleFound = false;
            var endMiddleFound = false;

            function innerHighlightWithToolTip(node, context, startIndex, nodeId) {
                var skip = 0;
                if ($.browser.msie && $(node).attr('class') == 'accept-container-line-separator') {
                    indexcount = indexcount + 1;
                }
                if (node.nodeType == 3) {
                    //var inputText = node.data.replace(/[↵]/gi, '\n');
                    var pos = node.data.toUpperCase().indexOf(context);
                    if (pos >= 0) {
                        if (pos == startIndex) {
                            if (!endPieceFound) {
                                addSplittedNode(node, pos, context.length, elementtype, cssUnderlineStyles[stylesIndex], nodeId);
                                bindToolTip(nodeId, ruleTip, stylesIndex, stylesIndex, stylesIndex, ruleName, ruleUniqueId, jsonRaw);
                                endMiddleIndex = pos;
                            }
                            else {
                                addSplittedNodeWithTriggerAction(node, pos, context.length, elementtype, cssUnderlineStyles[stylesIndex], nodeId, finalElementId, 'onmouseover', 'onmouseover', ruleName, ruleUniqueId, jsonRaw);
                            }
                            currentPieceFound = true;
                            skip = 1;
                        }
                        else {
                            if ((pos + indexcount) == startIndex) {
                                if (!endPieceFound) {
                                    addSplittedNode(node, pos, context.length, elementtype, cssUnderlineStyles[stylesIndex], nodeId);
                                    bindToolTip(nodeId, ruleTip, stylesIndex, stylesIndex, stylesIndex, ruleName, ruleUniqueId, jsonRaw);
                                }
                                else {
                                    addSplittedNodeWithTriggerAction(node, pos, context.length, elementtype, cssUnderlineStyles[stylesIndex], nodeId, finalElementId, 'onmouseover', 'onmouseover', ruleName, ruleUniqueId, jsonRaw);
                                }

                                currentPieceFound = true;
                                skip = 1;
                            }
                            else {
                                var currentindexcount = (indexcount + pos + context.length);
                                //get the rest of the node to search for the right index.
                                var aux = node.data.toUpperCase().substring((pos + context.length), node.length);
                                //update the final position
                                var finalpos = pos + context.length;
                                while (pos != -1) {
                                    pos = aux.indexOf(context);
                                    finalpos = finalpos + pos;
                                    if ((pos + currentindexcount) == startIndex) {
                                        if (!endPieceFound) {
                                            addSplittedNode(node, finalpos, context.length, elementtype, cssUnderlineStyles[stylesIndex], nodeId);
                                            bindToolTip(nodeId, ruleTip, stylesIndex, stylesIndex, stylesIndex, ruleName, ruleUniqueId, jsonRaw);
                                        }
                                        else {
                                            addSplittedNodeWithTriggerAction(node, finalpos, context.length, elementtype, cssUnderlineStyles[stylesIndex], nodeId, finalElementId, 'onmouseover', 'onmouseover', ruleName, ruleUniqueId, jsonRaw);
                                        }

                                        currentPieceFound = true;
                                        skip = 1;
                                        break;
                                    }
                                    else {
                                        aux = aux.substring((pos + context.length), aux.length);
                                        currentindexcount = (currentindexcount + pos + context.length);
                                        finalpos = finalpos + context.length;
                                    }
                                }

                                indexcount = (indexcount + parseInt(node.length));
                            }
                        }
                    }
                    else {
                        indexcount = (indexcount + parseInt(node.length));
                    }
                }
                else if (node.nodeType == 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
                    for (var i = 0; i < node.childNodes.length; ++i) {
                        i += innerHighlightWithToolTip(node.childNodes[i], context, startIndex, nodeId);
                        if (currentPieceFound)
                            break;
                    }
                }
                return skip;
            }


            function innerHighlightMiddleNodesWithToolTip(node, startElementId, endElementId, nodeId) {

                var skip = 0;
                if (node.nodeType == 3) {

                    var parentNodeId = $(node).parent().attr('Id');
                    if (parentNodeId != null && parentNodeId != 'undefined') {

                        if (parentNodeId == endElementId) {
                            endMiddleFound = true;
                        }
                        else
                            if (parentNodeId == startElementId) {
                                startMiddleFound = true;
                            }
                    } else
                        if (startMiddleFound && !endMiddleFound && node.data.length > 0) {

                            addSplittedNodeWithTriggerAction(node, 0, node.length, elementtype, cssUnderlineStyles[stylesIndex], (nodeId + "" + midlleContextNodesCount).toString(), finalElementId, 'onmouseover', 'onmouseover', ruleName, ruleUniqueId, jsonRaw);
                            ++midlleContextNodesCount;
                            skip = 1;
                        }
                }
                else if (node.nodeType == 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
                    for (var i = 0; i < node.childNodes.length; ++i) {
                        i += innerHighlightMiddleNodesWithToolTip(node.childNodes[i], startElementId, endElementId, nodeId);
                        if (endMiddleFound)
                            break;
                    }
                }
                return skip;
            }

            this.each(function () {
                innerHighlightWithToolTip(this, endpat.toUpperCase(), endPos, finalElementId);
            });
            indexcount = 0;
            endPieceFound = currentPieceFound;
            currentPieceFound = startPiecefound;
            this.each(function () {
                innerHighlightWithToolTip(this, pat.toUpperCase(), startPos, elementId);
            });
            startPiecefound = currentPieceFound;
            return this;
        };


    };
})(jQuery);                                                                                                                                                                                                                                                                                                                                                                                                 // end plugin code


/*JEEGO*/
// Copyright (c) 2009 - 2010 Erik van den Berg (http://www.planitworks.nl/jeegoocontext)
// Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
// and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
//
// Contributors:
// Denis Evteev
// Roman Imankulov (www.netangels.ru)
//
// Version: 1.3
// Requires jQuery 1.3.2+

(function ($) {
    var _global;
    var _menus;

    // Detect overflow.
    var _overflow = function (x, y) {
        return {
            width: x - $(window).width() - $(window).scrollLeft(),
            height: y - $(window).height() - $(window).scrollTop()
        };
    };

    // Keyboard up/down
    var _onKeyUpDown = function (down) {
        if (_menus[_global.activeId].currentHover) {
            // Hover the first visible menu-item from the next or previous siblings and skip any separator items.
            var prevNext = down ?
            _menus[_global.activeId].currentHover.nextAll(':not(.' + _menus[_global.activeId].separatorClass + '):visible:first') :
            _menus[_global.activeId].currentHover.prevAll(':not(.' + _menus[_global.activeId].separatorClass + '):visible:first');
            // If nothing is found, hover the first or last visible sibling.
            if (prevNext.length == 0) {
                prevNext = _menus[_global.activeId].currentHover.parent().find('> li:visible');
                prevNext = (down ? $(prevNext[0]) : $(prevNext[prevNext.length - 1]));
            }
            prevNext.mouseover();
        }
        else {
            // Current hover is null, select the last visible submenu.
            var visibleMenus = $('#' + _global.activeId + ', #' + _global.activeId + ' ul').filter(function () {
                return ($(this).is(':visible') && $(this).parents(':hidden').length == 0);
            });
            if (visibleMenus.length > 0) {
                // Find all visible menu-items for this menu and hover the first or last visible sibling.
                var visibleItems = $(visibleMenus[visibleMenus.length - 1]).find('> li:visible');
                $(visibleItems[(down ? 0 : (visibleItems.length - 1))]).mouseover();
            }
        }
    };

    // Clear all active context.
    var _clearActive = function () {
        for (cm in _menus) {
            $(_menus[cm].allContext).removeClass(_global.activeClass);
        }
    };

    // Reset menu.
    var _resetMenu = function () {
        // Hide active menu and it's submenus.
        if (_global.activeId) $('#' + _global.activeId).add('#' + _global.activeId + ' ul').hide();
        // Stop key up/down interval.
        clearInterval(_global.keyUpDown);
        _global.keyUpDownStop = false;
        // Clear current hover.
        if (_menus[_global.activeId]) _menus[_global.activeId].currentHover = null;
        // Clear active menu.
        _global.activeId = null;
        // Unbind click and mouseover functions bound to the document
        $(document).unbind('.jeegoocontext');
        // Unbind resize event bound to the window.
        $(window).unbind('resize.jeegoocontext');
    };

    var _globalHide = function (e) {
        // Invoke onHide callback if set, 'this' refers to the menu.    
        // Discontinue default behavior if callback returns false.       
        if (_global.activeId && _menus[_global.activeId].onHide) {
            if (_menus[_global.activeId].onHide.apply($('#' + _global.activeId), [e, _menus[_global.activeId].context]) == false) {
                return false;
            }
        }

        // Default behavior.
        // =================================================== // 

        // Clear active context.
        _clearActive();
        // Hide active menu.
        _resetMenu();
    };

    $.fn.jeegoocontext = function (id, options) {

        if (!_global) _global = {};
        if (!_menus) _menus = {};

        // Always override _global.menuClass if value is provided by options.
        if (options && options.menuClass) _global.menuClass = options.menuClass;
        // Only set _global.menuClass if not set.
        if (!_global.menuClass) _global.menuClass = 'jeegoocontext';
        // Always override _global.activeClass if value is provided by options.
        if (options && options.activeClass) _global.activeClass = options.activeClass;
        // Only set _global.activeClass if not set.
        if (!_global.activeClass) _global.activeClass = 'active';

        // Default undefined:
        // livequery, bool
        // event, string
        // openBelowContext, bool
        // ignoreWidthOverflow, bool
        // ignoreHeightOverflow, bool
        // autoHide, bool
        // onShow, function
        // onHover, function
        // onSelect, function
        // onHide, function
        _menus[id] = $.extend({
            hoverClass: 'hover',
            submenuClass: 'submenu',
            separatorClass: 'separator',
            operaEvent: 'ctrl+click',
            fadeIn: 200,
            delay: 300,
            keyDelay: 100,
            widthOverflowOffset: 0,
            heightOverflowOffset: 0,
            submenuLeftOffset: 0,
            submenuTopOffset: 0,
            autoAddSubmenuArrows: true,
            startLeftOffset: 0,
            startTopOffset: 0,
            keyboard: true
        }, options || {});
        debugger;
        // All context bound to this menu.
        _menus[id].allContext = this.selector;

        // Add mouseover and click handlers to the menu's items.
        $('#' + id).find('li')[_menus[id].livequery ? 'expire' : 'unbind']('.jeegoocontext')[_menus[id].livequery ? 'livequery' : 'bind']('mouseover.jeegoocontext', function (e) {

            var $this = _menus[id].currentHover = $(this);

            // Clear hide and show timeouts.
            clearTimeout(_menus[id].show);
            clearTimeout(_menus[id].hide);

            // Clear all hover state.
            $('#' + id).find('*').removeClass(_menus[id].hoverClass);

            // Set hover state on self, direct children, ancestors and ancestor direct children.
            var $parents = $this.parents('li');
            $this.add($this.find('> *')).add($parents).add($parents.find('> *')).addClass(_menus[id].hoverClass);

            // Invoke onHover callback if set, 'this' refers to the hovered list-item.
            // Discontinue default behavior if callback returns false.  
            var continueDefault = true;
            if (_menus[id].onHover) {
                if (_menus[id].onHover.apply(this, [e, _menus[id].context]) == false) continueDefault = false;
            }

            // Continue after timeout(timeout is reset on every mouseover).
            if (!_menus[id].proceed) {
                _menus[id].show = setTimeout(function () {
                    _menus[id].proceed = true;
                    $this.mouseover();
                }, _menus[id].delay);

                return false;
            }
            _menus[id].proceed = false;

            // Hide all sibling submenu's and deeper level submenu's.
            $this.parent().find('ul').not($this.find('> ul')).hide();

            if (!continueDefault) {
                e.preventDefault();
                return false;
            }

            // Default behavior.
            // =================================================== //       

            // Position and fade-in submenu's.
            var $submenu = $this.find('> ul');
            if ($submenu.length != 0) {
                var offSet = $this.offset();

                var overflow = _overflow(
                    (offSet.left + $this.parent().width() + _menus[id].submenuLeftOffset + $submenu.width() + _menus[id].widthOverflowOffset),
                    (offSet.top + _menus[id].submenuTopOffset + $submenu.height() + _menus[id].heightOverflowOffset)
                );
                var parentWidth = $submenu.parent().parent().width();
                var y = offSet.top - $this.parent().offset().top;
                $submenu.css(
                    {
                        'left': (overflow.width > 0 && !_menus[id].ignoreWidthOverflow) ? (-parentWidth - _menus[id].submenuLeftOffset + 'px') : (parentWidth + _menus[id].submenuLeftOffset + 'px'),
                        'top': (overflow.height > 0 && !_menus[id].ignoreHeightOverflow) ? (y - overflow.height + _menus[id].submenuTopOffset) + 'px' : y + _menus[id].submenuTopOffset + 'px'
                    }
                );

                $submenu.fadeIn(_menus[id].fadeIn);
            }
            e.stopPropagation();
        })[_menus[id].livequery ? 'livequery' : 'bind']('click.jeegoocontext', function (e) {

            // Invoke onSelect callback if set, 'this' refers to the selected listitem.
            // Discontinue default behavior if callback returns false.
            if (_menus[id].onSelect) {
                if (_menus[id].onSelect.apply(this, [e, _menus[id].context]) == false) {
                    return false;
                }
            }

            // Default behavior.
            //====================================================//

            // Reset menu
            _resetMenu();

            // Clear active state from this context.
            $(_menus[id].context).removeClass(_global.activeClass);

            e.stopPropagation();
        });

        // Determine the event type used to invoke the menu.
        // Event type is a namespaced event so it can be easily unbound later.
        var div = document.createElement('div');
        div.setAttribute('oncontextmenu', '');
        var eventType = _menus[id].event;

        if (!eventType) {
            eventType = (typeof div.oncontextmenu != 'undefined') ? 'contextmenu.jeegoocontext' : _menus[id].operaEvent + '.jeegoocontext';
        }
        else {
            eventType += '.jeegoocontext';
        }

        // Searching for the modifier in the event type
        // (e.g. ctrl+click, shift+contextmenu)
        if (eventType.indexOf('+') != -1) {
            var chunks = eventType.split('+', 2);
            _menus[id].modifier = chunks[0] + 'Key';
            eventType = chunks[1];
        }

        // Add menu invocation handler to the context.
        return this[_menus[id].livequery ? 'livequery' : 'bind'](eventType, function (e) {
            // Check for the modifier if any.
            if (typeof _menus[id].modifier == 'string' && !e[_menus[id].modifier]) return;

            // Save context(i.e. the current area to which the menu belongs).
            _menus[id].context = this;

            var $menu = $('#' + id);
            if ($menu.find("li:first").find(".accept-rule-unique-id").length > 0) {
                var ruleUniqueId = $menu.find("li:first").find(".accept-rule-unique-id").text();
                //var ruleName = $(this).find(".accept-rule-name").text();
                var jsonRaw = $menu.find("li:first").find("span.flag-raw-json").attr('title');
                $.sendDisplayAudit($.labelActionDisplayContextMenu, ruleUniqueId, jsonRaw, "", this.id);
            }
            else {
                var jsonRaw = $menu.find("li:first").find("span.flag-raw-json").attr('title');
                var ruleUniqueId = $menu.find("li:first").find("span.accept-spelling-rule-unique-id").text();
                var context = $(this).text();
                $.sendDisplayAudit($.labelActionDisplayContextMenu, ruleUniqueId, jsonRaw, context, this.id);
            }

            // Determine start position.
            var startLeft, startTop;
            //if (_menus[id].openBelowContext) 
            //{
            //var contextOffset = $(this).offset();
            //startLeft = contextOffset.left;
            //startTop = contextOffset.top + $(this).outerHeight();                                  
            //}
            //else 
            //{

            //startLeft = e.pageX;//$.ifrx;
            //startTop = e.pageY;//$.ifry;geY;       																									                              
            var coordinates = $.findTotalOffset(this);
            startLeft = coordinates.left + $(window).scrollLeft();
            startTop = coordinates.top + $(this).outerHeight() + $(window).scrollTop();
            //}        
            startLeft += _menus[id].startLeftOffset;
            startTop += _menus[id].startTopOffset;
            // Check for overflow and correct menu-position accordingly.         
            var overflow = _overflow((startLeft + $menu.width() + _menus[id].widthOverflowOffset), (startTop + $menu.height() + _menus[id].heightOverflowOffset));
            if (!_menus[id].ignoreWidthOverflow && overflow.width > 0) startLeft -= overflow.width;
            // Ignore y-overflow if openBelowContext or if _menus[id].ignoreHeightOverflow
            if (!_menus[id].openBelowContext && !_menus[id].ignoreHeightOverflow && overflow.height > 0) {
                startTop -= overflow.height;
            }
            // Invoke onShow callback if set, 'this' refers to the menu.
            // Discontinue default behavior if callback returns false.         
            if (_menus[id].onShow) {

                if (_menus[id].onShow.apply($menu, [e, _menus[id].context, startLeft, startTop]) == false) {
                    return false;
                }
            }

            // Default behavior.
            // =================================================== //

            // Reset last active menu.
            _resetMenu();

            // Set this id as active menu id.
            _global.activeId = id;

            // Hide current menu and all submenus, on first page load this is neccesary for proper keyboard support.
            $('#' + _global.activeId).add('#' + _global.activeId + ' ul').hide();

            // Clear all active context on page.
            _clearActive();

            // Make this context active.
            $(_menus[id].context).addClass(_global.activeClass);

            // Clear all hover state.
            $menu.find('li, li > *').removeClass(_menus[id].hoverClass);

            // Auto add/delete submenu arrows(spans) if set by options.
            if (_menus[id].autoAddSubmenuArrows) {
                $menu.find('li:has(ul)').not(':has(span.' + _menus[id].submenuClass + ')').prepend('<span class="' + _menus[id].submenuClass + '"></span>');
                $menu.find('li').not(':has(ul)').find('> span.' + _menus[id].submenuClass).remove();
            }


            $.refreshIframePosition();
            startLeft += $.ifrx;
            startTop += $.ifry;
            // Fade-in menu at clicked-position.	             
            $menu.css({
                'left': startLeft + 'px',
                'top': startTop + 'px'
            }).fadeIn(_menus[id].fadeIn);

            // If openBelowContext, maintain contextmenu left position on window resize event.
            if (_menus[id].openBelowContext) {
                $(window).bind('resize.jeegoocontext', function () {
                    $('#' + id).css('left', $(_menus[id].context).offset().left + _menus[id].startLeftOffset + 'px');
                });
            }

            // Bind mouseover, keyup/keydown and click events to the document.
            $(document).bind('mouseover.jeegoocontext', function (e) {
                // Remove hovers from last-opened submenu and hide any open relatedTarget submenu's after timeout.
                if ($(e.relatedTarget).parents('#' + id).length > 0) {
                    // Clear show submenu timeout.
                    clearTimeout(_menus[id].show);

                    var $li = $(e.relatedTarget).parent().find('li');
                    $li.add($li.find('> *')).removeClass(_menus[id].hoverClass);

                    // Clear last hovered menu-item.
                    _menus[_global.activeId].currentHover = null;

                    // Set hide submenu timeout.
                    _menus[id].hide = setTimeout(function () {
                        $li.find('ul').hide();
                        if (_menus[id].autoHide) _globalHide(e);
                    }, _menus[id].delay);
                }
            }).bind('click.jeegoocontext', _globalHide);

            if (_menus[id].keyboard) {
                $(document).bind('keydown.jeegoocontext', function (e) {
                    switch (e.which) {
                        case 38: //keyup
                            if (_global.keyUpDownStop) return false;
                            _onKeyUpDown();
                            _global.keyUpDown = setInterval(_onKeyUpDown, _menus[_global.activeId].keyDelay);
                            _global.keyUpDownStop = true;
                            return false;
                        case 39: //keyright
                            if (_menus[_global.activeId].currentHover) {
                                _menus[_global.activeId].currentHover.find('ul:visible:first li:visible:first').mouseover();
                            }
                            else {
                                var visibleMenus = $('#' + _global.activeId + ', #' + _global.activeId + ' ul:visible');
                                if (visibleMenus.length > 0) {
                                    $(visibleMenus[visibleMenus.length - 1]).find(':visible:first').mouseover();
                                }
                            }
                            return false;
                        case 40: //keydown
                            if (_global.keyUpDownStop) return false;
                            _onKeyUpDown(true);
                            _global.keyUpDown = setInterval(function () {
                                _onKeyUpDown(true);
                            }, _menus[_global.activeId].keyDelay);
                            _global.keyUpDownStop = true;
                            return false;
                        case 37: //keyleft
                            if (_menus[_global.activeId].currentHover) {
                                $(_menus[_global.activeId].currentHover.parents('li')[0]).mouseover();
                            }
                            else {
                                var hoveredLi = $('#' + _global.activeId + ' li.' + _menus[_global.activeId].hoverClass);
                                if (hoveredLi.length > 0) $(hoveredLi[hoveredLi.length - 1]).mouseover();
                            }
                            return false;
                        case 13: //enter
                            if (_menus[_global.activeId].currentHover) {
                                _menus[_global.activeId].currentHover.click();
                            }
                            else {
                                _globalHide(e);
                            }
                            break;
                        case 27: //escape
                            _globalHide(e);
                            break;
                        default:
                            break;
                    }
                }).bind('keyup.jeegoocontext', function (e) {
                    clearInterval(_global.keyUpDown);
                    _global.keyUpDownStop = false;
                });
            }

            return false;
        });
    };

    // Unbind context from context menu.
    $.fn.nojeegoocontext = function () {
        this.unbind('.jeegoocontext');
    };


})(jQuery);



//FLIP
eval(function (p, a, c, k, e, r) { e = function (c) { return (c < a ? '' : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36)) }; if (!''.replace(/^/, String)) { while (c--) r[e(c)] = k[c] || e(c); k = [function (e) { return r[e] }]; e = function () { return '\\w+' }; c = 1 }; while (c--) if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]); return p }('(5($){5 L(a){a.3x.1F[a.3r]=3o(a.3n,10)+a.3l}6 j=5(a){3k({3i:"1E.1d.3d 3c 3b",38:a})};6 k=5(){7(/*@2S!@*/19&&(2Q 2N.1w.1F.2K==="2F"))};6 l={2C:[0,4,4],2B:[1u,4,4],2y:[1s,1s,2v],2u:[0,0,0],2t:[0,0,4],2s:[1q,1p,1p],2o:[0,4,4],2n:[0,0,B],2m:[0,B,B],2l:[1b,1b,1b],2j:[0,1c,0],2i:[2h,2g,1o],2e:[B,0,B],2d:[2c,1o,2b],2a:[4,1n,0],27:[24,21,20],1Z:[B,0,0],1Y:[1R,1P,1O],1N:[3s,0,Y],2f:[4,0,4],1Q:[4,2z,0],2E:[0,t,0],22:[26,0,28],29:[1u,1z,1n],2p:[2r,2w,1z],2x:[1h,4,4],2A:[1i,2G,1i],2L:[Y,Y,Y],2M:[4,2O,2W],33:[4,4,1h],34:[0,4,0],35:[4,0,4],36:[t,0,0],39:[0,0,t],3e:[t,t,0],3j:[4,1q,0],3m:[4,W,3t],1H:[t,0,t],1I:[t,0,t],1J:[4,0,0],1K:[W,W,W],1L:[4,4,4],1M:[4,4,0],9:[4,4,4]};6 m=5(a){U(a&&a.1j("#")==-1&&a.1j("(")==-1){7"1S("+l[a].1T()+")"}1U{7 a}};$.1V($.1W.1X,{w:L,x:L,u:L,v:L});$.1k.23=5(){7 V.1l(5(){6 a=$(V);a.1d(a.F(\'1m\'))})};$.1k.1d=5(i){7 V.1l(5(){6 c=$(V),3,$8,C,11,1f,1e=k();U(c.F(\'S\')){7 19}6 e={R:(5(a){2k(a){X"T":7"Z";X"Z":7"T";X"15":7"14";X"14":7"15";2q:7"Z"}})(i.R),y:m(i.A)||"#H",A:m(i.y)||c.z("12-A"),1r:c.N(),D:i.D||1t,Q:i.Q||5(){},K:i.K||5(){},P:i.P||5(){}};c.F(\'1m\',e).F(\'S\',1).F(\'2D\',e);3={s:c.s(),p:c.p(),y:m(i.y)||c.z("12-A"),1v:c.z("2H-2I")||"2J",R:i.R||"T",E:m(i.A)||"#H",D:i.D||1t,o:c.1x().o,n:c.1x().n,1y:i.1r||2P,9:"9",18:i.18||19,Q:i.Q||5(){},K:i.K||5(){},P:i.P||5(){}};1e&&(3.9="#2R");$8=c.z("16","2T").8(2U).F(\'S\',1).2V("1w").N("").z({16:"1g",2X:"2Y",n:3.n,o:3.o,2Z:0,30:31,"-32-1A-1B":"G G G #1C","-37-1A-1B":"G G G #1C"});6 f=5(){7{1D:3.9,1v:0,3a:0,w:0,u:0,v:0,x:0,M:3.9,O:3.9,I:3.9,J:3.9,12:"3f",3g:\'3h\',p:0,s:0}};6 g=5(){6 a=(3.p/1c)*25;6 b=f();b.s=3.s;7{"q":b,"1a":{w:0,u:a,v:a,x:0,M:\'#H\',O:\'#H\',o:(3.o+(3.p/2)),n:(3.n-a)},"r":{x:0,w:0,u:0,v:0,M:3.9,O:3.9,o:3.o,n:3.n}}};6 h=5(){6 a=(3.p/1c)*25;6 b=f();b.p=3.p;7{"q":b,"1a":{w:a,u:0,v:0,x:a,I:\'#H\',J:\'#H\',o:3.o-a,n:3.n+(3.s/2)},"r":{w:0,u:0,v:0,x:0,I:3.9,J:3.9,o:3.o,n:3.n}}};11={"T":5(){6 d=g();d.q.w=3.p;d.q.M=3.y;d.r.x=3.p;d.r.O=3.E;7 d},"Z":5(){6 d=g();d.q.x=3.p;d.q.O=3.y;d.r.w=3.p;d.r.M=3.E;7 d},"15":5(){6 d=h();d.q.u=3.s;d.q.I=3.y;d.r.v=3.s;d.r.J=3.E;7 d},"14":5(){6 d=h();d.q.v=3.s;d.q.J=3.y;d.r.u=3.s;d.r.I=3.E;7 d}};C=11[3.R]();1e&&(C.q.3p="3q(A="+3.9+")");1f=5(){6 a=3.1y;7 a&&a.1E?a.N():a};$8.17(5(){3.Q($8,c);$8.N(\'\').z(C.q);$8.13()});$8.1G(C.1a,3.D);$8.17(5(){3.P($8,c);$8.13()});$8.1G(C.r,3.D);$8.17(5(){U(!3.18){c.z({1D:3.E})}c.z({16:"1g"});6 a=1f();U(a){c.N(a)}$8.3u();3.K($8,c);c.3v(\'S\');$8.13()})})}})(3w);', 62, 220, '|||flipObj|255|function|var|return|clone|transparent||||||||||||||left|top|height|start|second|width|128|borderLeftWidth|borderRightWidth|borderTopWidth|borderBottomWidth|bgColor|css|color|139|dirOption|speed|toColor|data|0px|999|borderLeftColor|borderRightColor|onEnd|int_prop|borderTopColor|html|borderBottomColor|onAnimation|onBefore|direction|flipLock|tb|if|this|192|case|211|bt||dirOptions|background|dequeue|rl|lr|visibility|queue|dontChangeColor|false|first|169|100|flip|ie6|newContent|visible|224|144|indexOf|fn|each|flipRevertedSettings|140|107|42|165|content|245|500|240|fontSize|body|offset|target|230|box|shadow|000|backgroundColor|jquery|style|animate|purple|violet|red|silver|white|yellow|darkviolet|122|150|gold|233|rgb|toString|else|extend|fx|step|darksalmon|darkred|204|50|indigo|revertFlip|153||75|darkorchid|130|khaki|darkorange|47|85|darkolivegreen|darkmagenta|fuchsia|183|189|darkkhaki|darkgreen|switch|darkgrey|darkcyan|darkblue|cyan|lightblue|default|173|brown|blue|black|220|216|lightcyan|beige|215|lightgreen|azure|aqua|flipSettings|green|undefined|238|font|size|12px|maxHeight|lightgrey|lightpink|document|182|null|typeof|123456|cc_on|hidden|true|appendTo|193|position|absolute|margin|zIndex|9999|webkit|lightyellow|lime|magenta|maroon|moz|message|navy|lineHeight|error|plugin|js|olive|none|borderStyle|solid|name|orange|throw|unit|pink|now|parseInt|filter|chroma|prop|148|203|remove|removeData|jQuery|elem'.split('|'), 0, {}))


//LOCAL STORAGE
; (function ($, document, undefined) {

    var supported;

    // if local storage optiosn are disabled in privacy settings on Firefox then trap
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
                } catch (e) {
                    // console.log('Local Storage not supported by this browser. Install the cookie plugin on your site to take advantage of the same functionality. You can get it at https://github.com/carhartl/jquery-cookie');
                }
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

        // key and value given, set cookie
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
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path ? '; path=' + options.path : '',
				options.domain ? '; domain=' + options.domain : '',
				options.secure ? '; secure' : ''
            ].join(''));
        }

        // key and possibly options given, get cookie...
        options = value || {};
        var result,
			decode = options.raw ? function (s) { return s; } : decodeURIComponent;

        return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
    }

})(jQuery, document);



//UNDERSCORE
(function () { var n = this, t = n._, r = {}, e = Array.prototype, u = Object.prototype, i = Function.prototype, a = e.push, o = e.slice, c = e.concat, l = u.toString, f = u.hasOwnProperty, s = e.forEach, p = e.map, h = e.reduce, v = e.reduceRight, d = e.filter, g = e.every, m = e.some, y = e.indexOf, b = e.lastIndexOf, x = Array.isArray, _ = Object.keys, j = i.bind, w = function (n) { return n instanceof w ? n : this instanceof w ? (this._wrapped = n, void 0) : new w(n) }; "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = w), exports._ = w) : n._ = w, w.VERSION = "1.4.4"; var A = w.each = w.forEach = function (n, t, e) { if (null != n) if (s && n.forEach === s) n.forEach(t, e); else if (n.length === +n.length) { for (var u = 0, i = n.length; i > u; u++) if (t.call(e, n[u], u, n) === r) return } else for (var a in n) if (w.has(n, a) && t.call(e, n[a], a, n) === r) return }; w.map = w.collect = function (n, t, r) { var e = []; return null == n ? e : p && n.map === p ? n.map(t, r) : (A(n, function (n, u, i) { e[e.length] = t.call(r, n, u, i) }), e) }; var O = "Reduce of empty array with no initial value"; w.reduce = w.foldl = w.inject = function (n, t, r, e) { var u = arguments.length > 2; if (null == n && (n = []), h && n.reduce === h) return e && (t = w.bind(t, e)), u ? n.reduce(t, r) : n.reduce(t); if (A(n, function (n, i, a) { u ? r = t.call(e, r, n, i, a) : (r = n, u = !0) }), !u) throw new TypeError(O); return r }, w.reduceRight = w.foldr = function (n, t, r, e) { var u = arguments.length > 2; if (null == n && (n = []), v && n.reduceRight === v) return e && (t = w.bind(t, e)), u ? n.reduceRight(t, r) : n.reduceRight(t); var i = n.length; if (i !== +i) { var a = w.keys(n); i = a.length } if (A(n, function (o, c, l) { c = a ? a[--i] : --i, u ? r = t.call(e, r, n[c], c, l) : (r = n[c], u = !0) }), !u) throw new TypeError(O); return r }, w.find = w.detect = function (n, t, r) { var e; return E(n, function (n, u, i) { return t.call(r, n, u, i) ? (e = n, !0) : void 0 }), e }, w.filter = w.select = function (n, t, r) { var e = []; return null == n ? e : d && n.filter === d ? n.filter(t, r) : (A(n, function (n, u, i) { t.call(r, n, u, i) && (e[e.length] = n) }), e) }, w.reject = function (n, t, r) { return w.filter(n, function (n, e, u) { return !t.call(r, n, e, u) }, r) }, w.every = w.all = function (n, t, e) { t || (t = w.identity); var u = !0; return null == n ? u : g && n.every === g ? n.every(t, e) : (A(n, function (n, i, a) { return (u = u && t.call(e, n, i, a)) ? void 0 : r }), !!u) }; var E = w.some = w.any = function (n, t, e) { t || (t = w.identity); var u = !1; return null == n ? u : m && n.some === m ? n.some(t, e) : (A(n, function (n, i, a) { return u || (u = t.call(e, n, i, a)) ? r : void 0 }), !!u) }; w.contains = w.include = function (n, t) { return null == n ? !1 : y && n.indexOf === y ? n.indexOf(t) != -1 : E(n, function (n) { return n === t }) }, w.invoke = function (n, t) { var r = o.call(arguments, 2), e = w.isFunction(t); return w.map(n, function (n) { return (e ? t : n[t]).apply(n, r) }) }, w.pluck = function (n, t) { return w.map(n, function (n) { return n[t] }) }, w.where = function (n, t, r) { return w.isEmpty(t) ? r ? null : [] : w[r ? "find" : "filter"](n, function (n) { for (var r in t) if (t[r] !== n[r]) return !1; return !0 }) }, w.findWhere = function (n, t) { return w.where(n, t, !0) }, w.max = function (n, t, r) { if (!t && w.isArray(n) && n[0] === +n[0] && 65535 > n.length) return Math.max.apply(Math, n); if (!t && w.isEmpty(n)) return -1 / 0; var e = { computed: -1 / 0, value: -1 / 0 }; return A(n, function (n, u, i) { var a = t ? t.call(r, n, u, i) : n; a >= e.computed && (e = { value: n, computed: a }) }), e.value }, w.min = function (n, t, r) { if (!t && w.isArray(n) && n[0] === +n[0] && 65535 > n.length) return Math.min.apply(Math, n); if (!t && w.isEmpty(n)) return 1 / 0; var e = { computed: 1 / 0, value: 1 / 0 }; return A(n, function (n, u, i) { var a = t ? t.call(r, n, u, i) : n; e.computed > a && (e = { value: n, computed: a }) }), e.value }, w.shuffle = function (n) { var t, r = 0, e = []; return A(n, function (n) { t = w.random(r++), e[r - 1] = e[t], e[t] = n }), e }; var k = function (n) { return w.isFunction(n) ? n : function (t) { return t[n] } }; w.sortBy = function (n, t, r) { var e = k(t); return w.pluck(w.map(n, function (n, t, u) { return { value: n, index: t, criteria: e.call(r, n, t, u) } }).sort(function (n, t) { var r = n.criteria, e = t.criteria; if (r !== e) { if (r > e || r === void 0) return 1; if (e > r || e === void 0) return -1 } return n.index < t.index ? -1 : 1 }), "value") }; var F = function (n, t, r, e) { var u = {}, i = k(t || w.identity); return A(n, function (t, a) { var o = i.call(r, t, a, n); e(u, o, t) }), u }; w.groupBy = function (n, t, r) { return F(n, t, r, function (n, t, r) { (w.has(n, t) ? n[t] : n[t] = []).push(r) }) }, w.countBy = function (n, t, r) { return F(n, t, r, function (n, t) { w.has(n, t) || (n[t] = 0), n[t]++ }) }, w.sortedIndex = function (n, t, r, e) { r = null == r ? w.identity : k(r); for (var u = r.call(e, t), i = 0, a = n.length; a > i;) { var o = i + a >>> 1; u > r.call(e, n[o]) ? i = o + 1 : a = o } return i }, w.toArray = function (n) { return n ? w.isArray(n) ? o.call(n) : n.length === +n.length ? w.map(n, w.identity) : w.values(n) : [] }, w.size = function (n) { return null == n ? 0 : n.length === +n.length ? n.length : w.keys(n).length }, w.first = w.head = w.take = function (n, t, r) { return null == n ? void 0 : null == t || r ? n[0] : o.call(n, 0, t) }, w.initial = function (n, t, r) { return o.call(n, 0, n.length - (null == t || r ? 1 : t)) }, w.last = function (n, t, r) { return null == n ? void 0 : null == t || r ? n[n.length - 1] : o.call(n, Math.max(n.length - t, 0)) }, w.rest = w.tail = w.drop = function (n, t, r) { return o.call(n, null == t || r ? 1 : t) }, w.compact = function (n) { return w.filter(n, w.identity) }; var R = function (n, t, r) { return A(n, function (n) { w.isArray(n) ? t ? a.apply(r, n) : R(n, t, r) : r.push(n) }), r }; w.flatten = function (n, t) { return R(n, t, []) }, w.without = function (n) { return w.difference(n, o.call(arguments, 1)) }, w.uniq = w.unique = function (n, t, r, e) { w.isFunction(t) && (e = r, r = t, t = !1); var u = r ? w.map(n, r, e) : n, i = [], a = []; return A(u, function (r, e) { (t ? e && a[a.length - 1] === r : w.contains(a, r)) || (a.push(r), i.push(n[e])) }), i }, w.union = function () { return w.uniq(c.apply(e, arguments)) }, w.intersection = function (n) { var t = o.call(arguments, 1); return w.filter(w.uniq(n), function (n) { return w.every(t, function (t) { return w.indexOf(t, n) >= 0 }) }) }, w.difference = function (n) { var t = c.apply(e, o.call(arguments, 1)); return w.filter(n, function (n) { return !w.contains(t, n) }) }, w.zip = function () { for (var n = o.call(arguments), t = w.max(w.pluck(n, "length")), r = Array(t), e = 0; t > e; e++) r[e] = w.pluck(n, "" + e); return r }, w.object = function (n, t) { if (null == n) return {}; for (var r = {}, e = 0, u = n.length; u > e; e++) t ? r[n[e]] = t[e] : r[n[e][0]] = n[e][1]; return r }, w.indexOf = function (n, t, r) { if (null == n) return -1; var e = 0, u = n.length; if (r) { if ("number" != typeof r) return e = w.sortedIndex(n, t), n[e] === t ? e : -1; e = 0 > r ? Math.max(0, u + r) : r } if (y && n.indexOf === y) return n.indexOf(t, r); for (; u > e; e++) if (n[e] === t) return e; return -1 }, w.lastIndexOf = function (n, t, r) { if (null == n) return -1; var e = null != r; if (b && n.lastIndexOf === b) return e ? n.lastIndexOf(t, r) : n.lastIndexOf(t); for (var u = e ? r : n.length; u--;) if (n[u] === t) return u; return -1 }, w.range = function (n, t, r) { 1 >= arguments.length && (t = n || 0, n = 0), r = arguments[2] || 1; for (var e = Math.max(Math.ceil((t - n) / r), 0), u = 0, i = Array(e) ; e > u;) i[u++] = n, n += r; return i }, w.bind = function (n, t) { if (n.bind === j && j) return j.apply(n, o.call(arguments, 1)); var r = o.call(arguments, 2); return function () { return n.apply(t, r.concat(o.call(arguments))) } }, w.partial = function (n) { var t = o.call(arguments, 1); return function () { return n.apply(this, t.concat(o.call(arguments))) } }, w.bindAll = function (n) { var t = o.call(arguments, 1); return 0 === t.length && (t = w.functions(n)), A(t, function (t) { n[t] = w.bind(n[t], n) }), n }, w.memoize = function (n, t) { var r = {}; return t || (t = w.identity), function () { var e = t.apply(this, arguments); return w.has(r, e) ? r[e] : r[e] = n.apply(this, arguments) } }, w.delay = function (n, t) { var r = o.call(arguments, 2); return setTimeout(function () { return n.apply(null, r) }, t) }, w.defer = function (n) { return w.delay.apply(w, [n, 1].concat(o.call(arguments, 1))) }, w.throttle = function (n, t) { var r, e, u, i, a = 0, o = function () { a = new Date, u = null, i = n.apply(r, e) }; return function () { var c = new Date, l = t - (c - a); return r = this, e = arguments, 0 >= l ? (clearTimeout(u), u = null, a = c, i = n.apply(r, e)) : u || (u = setTimeout(o, l)), i } }, w.debounce = function (n, t, r) { var e, u; return function () { var i = this, a = arguments, o = function () { e = null, r || (u = n.apply(i, a)) }, c = r && !e; return clearTimeout(e), e = setTimeout(o, t), c && (u = n.apply(i, a)), u } }, w.once = function (n) { var t, r = !1; return function () { return r ? t : (r = !0, t = n.apply(this, arguments), n = null, t) } }, w.wrap = function (n, t) { return function () { var r = [n]; return a.apply(r, arguments), t.apply(this, r) } }, w.compose = function () { var n = arguments; return function () { for (var t = arguments, r = n.length - 1; r >= 0; r--) t = [n[r].apply(this, t)]; return t[0] } }, w.after = function (n, t) { return 0 >= n ? t() : function () { return 1 > --n ? t.apply(this, arguments) : void 0 } }, w.keys = _ || function (n) { if (n !== Object(n)) throw new TypeError("Invalid object"); var t = []; for (var r in n) w.has(n, r) && (t[t.length] = r); return t }, w.values = function (n) { var t = []; for (var r in n) w.has(n, r) && t.push(n[r]); return t }, w.pairs = function (n) { var t = []; for (var r in n) w.has(n, r) && t.push([r, n[r]]); return t }, w.invert = function (n) { var t = {}; for (var r in n) w.has(n, r) && (t[n[r]] = r); return t }, w.functions = w.methods = function (n) { var t = []; for (var r in n) w.isFunction(n[r]) && t.push(r); return t.sort() }, w.extend = function (n) { return A(o.call(arguments, 1), function (t) { if (t) for (var r in t) n[r] = t[r] }), n }, w.pick = function (n) { var t = {}, r = c.apply(e, o.call(arguments, 1)); return A(r, function (r) { r in n && (t[r] = n[r]) }), t }, w.omit = function (n) { var t = {}, r = c.apply(e, o.call(arguments, 1)); for (var u in n) w.contains(r, u) || (t[u] = n[u]); return t }, w.defaults = function (n) { return A(o.call(arguments, 1), function (t) { if (t) for (var r in t) null == n[r] && (n[r] = t[r]) }), n }, w.clone = function (n) { return w.isObject(n) ? w.isArray(n) ? n.slice() : w.extend({}, n) : n }, w.tap = function (n, t) { return t(n), n }; var I = function (n, t, r, e) { if (n === t) return 0 !== n || 1 / n == 1 / t; if (null == n || null == t) return n === t; n instanceof w && (n = n._wrapped), t instanceof w && (t = t._wrapped); var u = l.call(n); if (u != l.call(t)) return !1; switch (u) { case "[object String]": return n == t + ""; case "[object Number]": return n != +n ? t != +t : 0 == n ? 1 / n == 1 / t : n == +t; case "[object Date]": case "[object Boolean]": return +n == +t; case "[object RegExp]": return n.source == t.source && n.global == t.global && n.multiline == t.multiline && n.ignoreCase == t.ignoreCase } if ("object" != typeof n || "object" != typeof t) return !1; for (var i = r.length; i--;) if (r[i] == n) return e[i] == t; r.push(n), e.push(t); var a = 0, o = !0; if ("[object Array]" == u) { if (a = n.length, o = a == t.length) for (; a-- && (o = I(n[a], t[a], r, e)) ;); } else { var c = n.constructor, f = t.constructor; if (c !== f && !(w.isFunction(c) && c instanceof c && w.isFunction(f) && f instanceof f)) return !1; for (var s in n) if (w.has(n, s) && (a++, !(o = w.has(t, s) && I(n[s], t[s], r, e)))) break; if (o) { for (s in t) if (w.has(t, s) && !a--) break; o = !a } } return r.pop(), e.pop(), o }; w.isEqual = function (n, t) { return I(n, t, [], []) }, w.isEmpty = function (n) { if (null == n) return !0; if (w.isArray(n) || w.isString(n)) return 0 === n.length; for (var t in n) if (w.has(n, t)) return !1; return !0 }, w.isElement = function (n) { return !(!n || 1 !== n.nodeType) }, w.isArray = x || function (n) { return "[object Array]" == l.call(n) }, w.isObject = function (n) { return n === Object(n) }, A(["Arguments", "Function", "String", "Number", "Date", "RegExp"], function (n) { w["is" + n] = function (t) { return l.call(t) == "[object " + n + "]" } }), w.isArguments(arguments) || (w.isArguments = function (n) { return !(!n || !w.has(n, "callee")) }), "function" != typeof /./ && (w.isFunction = function (n) { return "function" == typeof n }), w.isFinite = function (n) { return isFinite(n) && !isNaN(parseFloat(n)) }, w.isNaN = function (n) { return w.isNumber(n) && n != +n }, w.isBoolean = function (n) { return n === !0 || n === !1 || "[object Boolean]" == l.call(n) }, w.isNull = function (n) { return null === n }, w.isUndefined = function (n) { return n === void 0 }, w.has = function (n, t) { return f.call(n, t) }, w.noConflict = function () { return n._ = t, this }, w.identity = function (n) { return n }, w.times = function (n, t, r) { for (var e = Array(n), u = 0; n > u; u++) e[u] = t.call(r, u); return e }, w.random = function (n, t) { return null == t && (t = n, n = 0), n + Math.floor(Math.random() * (t - n + 1)) }; var M = { escape: { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;", "/": "&#x2F;" } }; M.unescape = w.invert(M.escape); var S = { escape: RegExp("[" + w.keys(M.escape).join("") + "]", "g"), unescape: RegExp("(" + w.keys(M.unescape).join("|") + ")", "g") }; w.each(["escape", "unescape"], function (n) { w[n] = function (t) { return null == t ? "" : ("" + t).replace(S[n], function (t) { return M[n][t] }) } }), w.result = function (n, t) { if (null == n) return null; var r = n[t]; return w.isFunction(r) ? r.call(n) : r }, w.mixin = function (n) { A(w.functions(n), function (t) { var r = w[t] = n[t]; w.prototype[t] = function () { var n = [this._wrapped]; return a.apply(n, arguments), D.call(this, r.apply(w, n)) } }) }; var N = 0; w.uniqueId = function (n) { var t = ++N + ""; return n ? n + t : t }, w.templateSettings = { evaluate: /<%([\s\S]+?)%>/g, interpolate: /<%=([\s\S]+?)%>/g, escape: /<%-([\s\S]+?)%>/g }; var T = /(.)^/, q = { "'": "'", "\\": "\\", "\r": "r", "\n": "n", "	": "t", "\u2028": "u2028", "\u2029": "u2029" }, B = /\\|'|\r|\n|\t|\u2028|\u2029/g; w.template = function (n, t, r) { var e; r = w.defaults({}, r, w.templateSettings); var u = RegExp([(r.escape || T).source, (r.interpolate || T).source, (r.evaluate || T).source].join("|") + "|$", "g"), i = 0, a = "__p+='"; n.replace(u, function (t, r, e, u, o) { return a += n.slice(i, o).replace(B, function (n) { return "\\" + q[n] }), r && (a += "'+\n((__t=(" + r + "))==null?'':_.escape(__t))+\n'"), e && (a += "'+\n((__t=(" + e + "))==null?'':__t)+\n'"), u && (a += "';\n" + u + "\n__p+='"), i = o + t.length, t }), a += "';\n", r.variable || (a = "with(obj||{}){\n" + a + "}\n"), a = "var __t,__p='',__j=Array.prototype.join," + "print=function(){__p+=__j.call(arguments,'');};\n" + a + "return __p;\n"; try { e = Function(r.variable || "obj", "_", a) } catch (o) { throw o.source = a, o } if (t) return e(t, w); var c = function (n) { return e.call(this, n, w) }; return c.source = "function(" + (r.variable || "obj") + "){\n" + a + "}", c }, w.chain = function (n) { return w(n).chain() }; var D = function (n) { return this._chain ? w(n).chain() : n }; w.mixin(w), A(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function (n) { var t = e[n]; w.prototype[n] = function () { var r = this._wrapped; return t.apply(r, arguments), "shift" != n && "splice" != n || 0 !== r.length || delete r[0], D.call(this, r) } }), A(["concat", "join", "slice"], function (n) { var t = e[n]; w.prototype[n] = function () { return D.call(this, t.apply(this._wrapped, arguments)) } }), w.extend(w.prototype, { chain: function () { return this._chain = !0, this }, value: function () { return this._wrapped } }) }).call(this);

//Detect Window Scroll
(function () {

    var special = jQuery.event.special,
        uid1 = 'D' + (+new Date()),
        uid2 = 'D' + (+new Date() + 1);

    special.scrollstart = {
        setup: function () {

            var timer,
                handler = function (evt) {

                    var _self = this,
                        _args = arguments;

                    if (timer) {
                        clearTimeout(timer);
                    } else {
                        evt.type = 'scrollstart';
                        jQuery.event.handle.apply(_self, _args);
                    }

                    timer = setTimeout(function () {
                        timer = null;
                    }, special.scrollstop.latency);

                };

            jQuery(this).bind('scroll', handler).data(uid1, handler);

        },
        teardown: function () {
            jQuery(this).unbind('scroll', jQuery(this).data(uid1));
        }
    };

    special.scrollstop = {
        latency: 300,
        setup: function () {

            var timer,
                    handler = function (evt) {

                        var _self = this,
                        _args = arguments;

                        if (timer) {
                            clearTimeout(timer);
                        }

                        timer = setTimeout(function () {

                            timer = null;
                            evt.type = 'scrollstop';
                            jQuery.event.handle.apply(_self, _args);

                        }, special.scrollstop.latency);

                    };

            jQuery(this).bind('scroll', handler).data(uid2, handler);

        },
        teardown: function () {
            jQuery(this).unbind('scroll', jQuery(this).data(uid2));
        }
    };

})();

//tiny mce jquery
(function (b) { var e, d, a = [], c = window; b.fn.tinymce = function (j) { var p = this, g, k, h, m, i, l = "", n = ""; if (!p.length) { return p } if (!j) { return tinyMCE.get(p[0].id) } p.css("visibility", "hidden"); function o() { var r = [], q = 0; if (f) { f(); f = null } p.each(function (t, u) { var s, w = u.id, v = j.oninit; if (!w) { u.id = w = tinymce.DOM.uniqueId() } s = new tinymce.Editor(w, j); r.push(s); s.onInit.add(function () { var x, y = v; p.css("visibility", ""); if (v) { if (++q == r.length) { if (tinymce.is(y, "string")) { x = (y.indexOf(".") === -1) ? null : tinymce.resolve(y.replace(/\.\w+$/, "")); y = tinymce.resolve(y) } y.apply(x || tinymce, r) } } }) }); b.each(r, function (t, s) { s.render() }) } if (!c.tinymce && !d && (g = j.script_url)) { d = 1; h = g.substring(0, g.lastIndexOf("/")); if (/_(src|dev)\.js/g.test(g)) { n = "_src" } m = g.lastIndexOf("?"); if (m != -1) { l = g.substring(m + 1) } c.tinyMCEPreInit = c.tinyMCEPreInit || { base: h, suffix: n, query: l }; if (g.indexOf("gzip") != -1) { i = j.language || "en"; g = g + (/\?/.test(g) ? "&" : "?") + "js=true&core=true&suffix=" + escape(n) + "&themes=" + escape(j.theme) + "&plugins=" + escape(j.plugins) + "&languages=" + i; if (!c.tinyMCE_GZ) { tinyMCE_GZ = { start: function () { tinymce.suffix = n; function q(r) { tinymce.ScriptLoader.markDone(tinyMCE.baseURI.toAbsolute(r)) } q("langs/" + i + ".js"); q("themes/" + j.theme + "/editor_template" + n + ".js"); q("themes/" + j.theme + "/langs/" + i + ".js"); b.each(j.plugins.split(","), function (s, r) { if (r) { q("plugins/" + r + "/editor_plugin" + n + ".js"); q("plugins/" + r + "/langs/" + i + ".js") } }) }, end: function () { } } } } b.ajax({ type: "GET", url: g, dataType: "script", cache: true, success: function () { tinymce.dom.Event.domLoaded = 1; d = 2; if (j.script_loaded) { j.script_loaded() } o(); b.each(a, function (q, r) { r() }) } }) } else { if (d === 1) { a.push(o) } else { o() } } return p }; b.extend(b.expr[":"], { tinymce: function (g) { return !!(g.id && tinyMCE.get(g.id)) } }); function f() { function i(l) { if (l === "remove") { this.each(function (n, o) { var m = h(o); if (m) { m.remove() } }) } this.find("span.mceEditor,div.mceEditor").each(function (n, o) { var m = tinyMCE.get(o.id.replace(/_parent$/, "")); if (m) { m.remove() } }) } function k(n) { var m = this, l; if (n !== e) { i.call(m); m.each(function (p, q) { var o; if (o = tinyMCE.get(q.id)) { o.setContent(n) } }) } else { if (m.length > 0) { if (l = tinyMCE.get(m[0].id)) { return l.getContent() } } } } function h(m) { var l = null; (m) && (m.id) && (c.tinymce) && (l = tinyMCE.get(m.id)); return l } function g(l) { return !!((l) && (l.length) && (c.tinymce) && (l.is(":tinymce"))) } var j = {}; b.each(["text", "html", "val"], function (n, l) { var o = j[l] = b.fn[l], m = (l === "text"); b.fn[l] = function (s) { var p = this; if (!g(p)) { return o.apply(p, arguments) } if (s !== e) { k.call(p.filter(":tinymce"), s); o.apply(p.not(":tinymce"), arguments); return p } else { var r = ""; var q = arguments; (m ? p : p.eq(0)).each(function (u, v) { var t = h(v); r += t ? (m ? t.getContent().replace(/<(?:"[^"]*"|'[^']*'|[^'">])*>/g, "") : t.getContent()) : o.apply(b(v), q) }); return r } } }); b.each(["append", "prepend"], function (n, m) { var o = j[m] = b.fn[m], l = (m === "prepend"); b.fn[m] = function (q) { var p = this; if (!g(p)) { return o.apply(p, arguments) } if (q !== e) { p.filter(":tinymce").each(function (s, t) { var r = h(t); r && r.setContent(l ? q + r.getContent() : r.getContent() + q) }); o.apply(p.not(":tinymce"), arguments); return p } } }); b.each(["remove", "replaceWith", "replaceAll", "empty"], function (m, l) { var n = j[l] = b.fn[l]; b.fn[l] = function () { i.call(this, l); return n.apply(this, arguments) } }); j.attr = b.fn.attr; b.fn.attr = function (n, q, o) { var m = this; if ((!n) || (n !== "value") || (!g(m))) { return j.attr.call(m, n, q, o) } if (q !== e) { k.call(m.filter(":tinymce"), q); j.attr.call(m.not(":tinymce"), n, q, o); return m } else { var p = m[0], l = h(p); return l ? l.getContent() : j.attr.call(b(p), n, q, o) } } } })(jQuery);

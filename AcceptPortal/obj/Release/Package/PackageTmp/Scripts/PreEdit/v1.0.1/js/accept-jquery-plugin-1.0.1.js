/********************************************************************************************************************************************/
//
//  Accept Project Plugin v1.0.1
//    
//
/********************************************************************************************************************************************/

(function ($) {

    $.fn.Accept = function (options) {
        /* START Global Variables */
        var acceptObject = this;
        var acceptObjectId = $(this).attr("id");
        var acceptContainerId = "div_accept_" + acceptObjectId;
        var acceptDialogId = "dialogaccept_" + acceptObjectId;
        var mainContextMenuId = "myMenu_" + acceptObjectId;

        //#btn-replace-accept
        var btnReplaceId = "btn-replace-accept_" + acceptObjectId;
        //#btn-fixall
        var btnFixAllId = "btn-fixall_" + acceptObjectId;
        //#btn-refresh-accept
        var btnRefreshId = "btn-refresh-accept_" + acceptObjectId;
        //#btn-manual-refresh-accept
        var btnManualRefreshId = "btn-manual-refresh-accept_" + acceptObjectId;
        var imgDialogTitleId = "imgDialogTitleId_" + acceptObjectId;
        var acceptTextContext = "";
        //var inputText = "";
        var acceptGenericResponses = [];  //var AcceptGenericResponses = [];
        var acceptNonSuggestionGenericResponses = [];  //var AcceptStyleResponses = [];        

        var x;
        var y;

        var userBrowser;
        var isAutoRefresh = false;

        var GlobalAuditAction = null;
        var MaxRuleExtractionLength = 40;
        var StartTimeGlobal = null;
        var EndTimeGlobal = null;

        var checkGrammar = "1";
        var checkSpelling = "1";
        var checkStyle = "1";

        //labels
        var labelCtxMenuAccept = "Check All";
        var labelCtxMenuGrammar = "Grammar";
        var labelCtxMenuSpelling = "Spelling";
        var labelCtxMenuStyle = "Style";
        var labelCtxMenuClose = "Close";

        var labelPleaseWait = "Please Wait...";
        var labelDialogFixAll = "FixAll";
        var labelDialogReplace = "Replace";
        var labelDialogRefresh = "Refresh";
        var labelDialogCancel = "Cancel";

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

        var tinyButtonMCETooltip = 'Check Spelling, Grammar and Style';

        var labelNoResultsDialogTitle = 'Your text looks ok!';
        var labelNoResultsDialogBody = 'No issues were found.';
		
		
		var labelHelpDialogText = 'Spelling, grammar or stylistic problems are highlighted or underlined in your text. In simple cases, clicking the highlighted words will bring up suggestions, which you may decide to use to improve your text. In more complex cases, suggestions will not be available and you will have the possibility to read the advice (in the tooltips) and decide whether you want to make any changes in the text area itself. At any time, you can replace your original text with the pop-up text by clicking “Replace”. The yellow, orange and red colors indicate how many problems are found in a particular category (for example, style).'
		var labelHelpDialogTitle = 'Help';

        // Create some defaults, extending them with any options that were provided
        var settings = $.extend({
            'ApiKey': '',
            'AcceptServerPath': 'http://www.accept-portal.eu/AcceptApi/Api/v1',
            'configurationType': 'contextMenu',
            'Rule': '',
            'Lang': 'en',
            'righClickEnable': true,
            'imagesPath': '../../Content/images',
            'tinyMceUrl': '../extras/tiny_mce/tiny_mce.js',
            'textEditorPlaceHolderId': null,
            'loadWaitingTime': 2000,
            'LoadInputText': function () {               
                var inputText;
                if (settings.requestFormat == 'TEXT')
                    inputText = $("#" + acceptObjectId).val();
                else
                    inputText = $("#" + acceptObjectId).html();
                return inputText;
            },
            'SubmitInputText': function (text) {
                if (settings.requestFormat == 'TEXT')
                    $('#' + acceptObjectId).html(text);
                else
                    $('#' + acceptObjectId).val(text);

            },
            'languageUi': 'en',
            'dialogHeight': 320,
            'dialogWidth': 480,
            'requestFormat': 'TEXT'

        }, options);


        /* start Response Object */
        function Response(context, type, suggestions, startpos, endpos, description, rule, contextpieces) {
            this.context = context;
            this.type = type;
            this.suggestions = suggestions;
            this.startpos = startpos;
            this.endpos = endpos;
            this.description = description;
            this.rule = rule;
            this.contextpieces = contextpieces;
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
                        allcontext = allcontext + "," + contextpieces[i];
                    return allcontext;
                }
            }
        }
        /* end Response Object */

        /* start Audit Object */
        function AuditAction(sessioncodeid, audittypeid, rulename, context, textbefore, textafter, starttime, endtime) {
            this.sessioncodeid = sessioncodeid;
            this.audittypeid = audittypeid;
            this.rulename = rulename;
            this.context = context;
            this.textbefore = textbefore;
            this.textafter = textafter;
            this.starttime = starttime;
            this.endtime = endtime;
            this.SetSession = function (sessioncodeid) {
                this.sessioncodeid = sessioncodeid;
            }
            this.GetSession = function (sessioncodeid) {
                return this.sessioncodeid;
            }
            this.SetFinalContext = function (textafter) {
                this.textafter = textafter;
                this.endtime = new Date();
            }
            this.GetJson = function () {

                return '{SessionCodeId:"' + this.sessioncodeid + '",AuditTypeId:"' + this.audittypeid + '",RuleName:"' + this.rulename + '",AuditContext:"' + this.context + '",TextBefore:"' + this.textbefore + '",TextAfter:"' + this.textafter + '",StartTime:"' + this.starttime.toUTCString() + '",EndTime:"' + this.endtime.toUTCString() + '"}';
            }
            this.SubmitAudit = function () {
                $.ajax({
                    url: settings.AcceptServerPath + "/Core/AuditAction",
                    dataType: 'json',
                    contentType: "application/json",
                    type: "POST",
                    async: false,
                    cache: false,
                    data: this.GetJson(),
                    success: function (data) { },
                    complete: function (data) { },
                    error: function (error) { }
                });
            }
        }
        /* end Audit Object */


        //clean all plug-in data
        $.cleanPluginData = function () {
            
            $("#" + mainContextMenuId).remove();
            $("#" + acceptDialogId).remove();
            $("#dialogNoIssues_" + acceptDialogId + "").remove();

        }

        //init plug-in         
        var initAccept = function () {
            acceptTextContext = CleanText(settings.LoadInputText()); //inputText = $('#' + acceptObjectId).val();
            userBrowser = $.browser;
            initLanguageUi();
            LoadCustomToolTips();

            if (userBrowser.msie || userBrowser.mozilla)
                jQuery.support.cors = true;

            $.cleanPluginData();

            $(document.body).append('<ul id="' + mainContextMenuId + '" class="contextMenu"><li class="accept"><a href="#accept">' + labelCtxMenuAccept + '</a></li><li class="grammar"><a href="#grammar">' + labelCtxMenuGrammar + '</a></li><li class="spell"><a href="#spell">' + labelCtxMenuSpelling + '</a></li><li class="style"><a href="#style">' + labelCtxMenuStyle + '</a></li>	<li class="accept_close"><a href="#accept_close">' + labelCtxMenuClose + '</a></li></ul>');
            $(document.body).append('<div id="' + acceptDialogId + '" title="Accept" style="display:none"><div class="loadmask"  style="position:relative; display:block; vertical-align:middle; text-align:center;top:30%"> <img alt="' + labelPleaseWait + '" src="' + settings.imagesPath + '/ajax-loader.gif" /> </div><div id="' + acceptContainerId + '" style="display:none"></div></div>');
            $(document.body).append('<div id="dialogNoIssues_' + acceptDialogId + '" title="' + labelNoResultsDialogTitle + '" style="display:none;"><p>' + labelNoResultsDialogBody + '</p></div>');
			
			//help
            $(document.body).append('<div id="helpDialog_" title="'+labelHelpDialogTitle+'" style="display:none;text-align: justify;"><p>'+labelHelpDialogText+'</p></div>');



            //            $(acceptObject).keyup(function () {
            //                if (inputText != $('#' + acceptObjectId).val()) {
            //                    inputText = $('#' + acceptObjectId).val();
            //                }
            //            });
             debugger;
            if (settings.configurationType == "tinyMceEmbedded") {

                LoadTextEditor();

                if (settings.righClickEnable) {
                    setTimeout(function () {
                        LoadRightClickContextMenuHtmlEmbedded("");
                    }, settings.loadWaitingTime);
                }

            }
            else {
                if (settings.textEditorPlaceHolderId != null && settings.textEditorPlaceHolderId.length > 0 && settings.righClickEnable == true) {
                  
					
					setTimeout(function () {
                        LoadRightClickContextMenuHtmlEmbedded(settings.textEditorPlaceHolderId);
                    }, settings.loadWaitingTime);
                }
                else
				{
					if(settings.righClickEnable == true)
						LoadRightClickContextMenu();
			    }

            }

        };

        var initLanguageUi = function () {
debugger;
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
                labelDialogCtxReplaceAll = "Remplacer tous";

                labelDialogCtxGrammarTooltip = "Suggestion Grammaire";
                labelDialogCtxSpellingTooltip = "Suggestion d'Orthographe";

                tinyButtonMCETooltip = "Vérifier l'orthographe, la grammaire et le style";

                labelNoResultsDialogTitle = 'Votre texte a l’air ok!';
                labelNoResultsDialogBody = 'Pas de problème détecté.';
				
				
				labelHelpDialogText = 'Des problèmes d\'orthographe, de grammaire ou de style peuvent être surlignés ou soulignés dans votre texte. Dans les cas simples, vous pourrez faire apparaître des suggestions en cliquant sur les mots surlignés, et vous pourrez ensuite les utiliser pour améliorer votre texte. Dans les cas plus complexes, les suggestions ne seront pas disponibles mais vous aurez tout de même la possibilité de lire certains conseils (dans les info-bulles) et décider si vous voulez apporter des changements dans la zone de texte-même. A tout moment, vous pouvez remplacer votre texte de départ avec le texte contenu dans le pop-up en cliquant sur "Remplacer". Les couleurs jaune, orange et rouge indiquent le nombre de problèmes trouvés dans une catégorie particulière (par exemple, le style).'
				labelHelpDialogTitle  = 'Aide';
													
            }
			else
			if(settings.languageUi == "de")
			{
			
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
			
			labelHelpDialogText = 'Rechtschreib-, Grammatik oder Stilfehler werden in Ihrem Text  markiert oder unterstrichen. In einfachen Fällen werden bei einem Klick auf die markierten Worte Vorschläge eingeblendet, von denen Sie entscheiden können, ob Sie diese auswählen möchten, um Ihren Text zu verbessern. In komplexeren Fällen werden keine Vorschläge zur Verfügung stehen. Sie werden dann die Möglichkeit haben Ratschläge (in den "Tooltips") zu lesen und zu entscheiden, ob Sie irgendwelche Änderungen im Textfeld selbst vornehmen wollen. Sie können zu jeder Zeit den Originaltext mit dem Text des Pop-Up Fensters ersetzen, indem Sie auf "Ersetzen" klicken. Die Unterstreichungsfarben gelb, orange und rot zeigen an, wie viele Fehler in der jeweiligen Kategorie gefunden wurden (z.B. Stil).'
			labelHelpDialogTitle  = 'Hilfe';
							
			}
			
		
            if (settings.Rule == '') {

                if (settings.Lang == "fr")
                    settings.Rule = "Preediting_MT";
                else
                    if (settings.Lang == "de")
                        settings.Rule = "MT-preediting-DE-EN";
                    else
                        settings.Rule = "Preediting_SMT";

            }

        }

        //end


        //external button injection
        $.injectAcceptButton = function (jQuerySelector, contentToApply, waitingTime) {
            try {

                setTimeout(function () {
                    var index = $(jQuerySelector).length;
                    $(jQuerySelector).each(function () {                       
                        this.id = "acceptInjectedButton_" + index;
                        $('#' + this.id).append(contentToApply);
                        $('#' + this.id).click(function () {
                            checkGrammar = "1";
                            checkSpelling = "1";
                            checkStyle = "1";
                            CreateAcceptDialog();
                        });
                        ++index;
                    });
                }, waitingTime);

            } catch (ex) { }
        }

		 $.injectAcceptButton2 = function (jQuerySelectorSource, jQuerySelectorTarget, contentToApply, waitingTime) {
            
			try {
				
                setTimeout(function () {
                   				                   
					$(jQuerySelectorSource).each(function () {
                                             
                        $(this).append(contentToApply);                        											
                    });
					
										
					$(jQuerySelectorTarget).click(function () {
                            checkGrammar = "1";
                            checkSpelling = "1";
                            checkStyle = "1";
                            CreateAcceptDialog();
					});
					
									
					
                }, waitingTime);


				
                        


            } catch (ex) { }
        }


		 $.injectAcceptButtonPostEdit = function (jQuerySelectorSource, jQuerySelectorTarget, contentToApply, waitingTime) {
            
			try {
				
                setTimeout(function () {
                   				                   
					$(jQuerySelectorSource).each(function () {
                                             
                        $(this).append(contentToApply);                        											
                    });
					
										
					$(jQuerySelectorTarget).click(function () {
                           debugger;
							checkGrammar = "1";
                            checkSpelling = "1";
                            checkStyle = "0";
                            CreateAcceptDialog();
					});
					
									
					
                }, waitingTime);


				
                        


            } catch (ex) { }
        }






        //build Suggestions 
        function BuildStyleRules(styleResponses) {
            $('div[class^="qtip"]').remove();
            var rulesWithNotFollowedSuggestions = [];
            /*START - Code for not followed suggestions*/
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
                    ++TooltTipCurrentCounterHelper;
                    if (contextCollectionOrdered[i].contextpieces.length > 0) {

                        firstcontext = contextCollectionOrdered[i].contextpieces[0].Piece;
                        firstindex = contextCollectionOrdered[i].contextpieces[0].StartPos;
                        startPosLastContextIndex = contextCollectionOrdered[i].contextpieces[contextCollectionOrdered[i].contextpieces.length - 1].StartPos;
                        endPosLastContextIndex = contextCollectionOrdered[i].contextpieces[contextCollectionOrdered[i].contextpieces.length - 1].EndPos;
                        lastcontext = contextCollectionOrdered[i].contextpieces[contextCollectionOrdered[i].contextpieces.length - 1].Piece;
                        var spnId = "spnToolTip_" + firstindex.toString() + "_" + endPosLastContextIndex.toString();
                        $('#' + acceptContainerId).highlightHtmlMultiContextWithToolTip(firstcontext, firstindex, endPosLastContextIndex, "span", "highlightTextCream", spnId, contextCollectionOrdered[i].description, TooltTipCurrentCounterHelper, TooltTipMaxCounterHelper);

                    }
                }
            }  //end whiles

            /*END - Code for not followed suggestions*/
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
                        $('#' + acceptContainerId).highlightWithToolTip(contextCollectionOrdered[i].context, parseInt(contextCollectionOrdered[i].startpos), parseInt(contextCollectionOrdered[i].endpos), 'span', spnId, contextCollectionOrdered[i].description, TooltTipCurrentCounterHelper, TooltTipMaxCounterHelper);

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
                    if (contextCollectionOrdered[i].context.length > 0 && (contextCollectionOrdered[i].suggestions.length > 0)) {
                        var spnid = "spncontext_" + contextCollectionOrdered[i].startpos + "_" + contextCollectionOrdered[i].endpos + "_" + menuscount + "_" + i;
                        $('#' + acceptContainerId).highlight(contextCollectionOrdered[i].context, parseInt(contextCollectionOrdered[i].startpos), 'span', 'highlight', spnid);  //$('#divaccept P').highlight(contextCollectionOrdered[0].context);          
                    }
                }

                var menuname = "acceptmenu_" + menuscount.toString();
                ++menuscount;

                $(document.body).append('<ul id="' + menuname + '" class="jeegoocontext cm_default" style="z-index: 99999;">');

                for (var j = 0; j < contextCollectionOrdered.length; j++) {
                    if (contextCollectionOrdered[j].suggestions.length == 0) {
                        /*TODO*/
                    }
                    else {
                        switch (contextCollectionOrdered[j].type) {
                            case "GRAMMAR":
                                {
                                    //ShortenString(contextCollectionOrdered[j].suggestions[k], 20)             
                                    for (var k = 0; k < contextCollectionOrdered[j].suggestions.length; k++) {

                                        $('#' + menuname).append('<li style="cursor:pointer;" id="sug_' + j + "_" + k + "_" + contextCollectionOrdered[j].startpos + "_" + contextCollectionOrdered[j].endpos + "_gr" + '" class="icon"><span class="icon grammar" title="' + labelDialogCtxGrammarTooltip + '"></span>' + contextCollectionOrdered[j].suggestions[k] + '<ul> <li style="cursor:pointer;" id="srp_' + j + "_" + k + '" class="icon"><span class="icon replace"></span>' + labelDialogCtxReplace + '</li><li style="cursor:pointer;" id="rpa_' + j + "_" + k + '" class="icon"><span class="icon replaceall"></span>' + labelDialogCtxReplaceAll + '</li> <li style="cursor:pointer;"  id="ign_' + j + "_" + k + '" class="icon"><span class="icon ignore"></span>' + labelDialogCtxIgnore + '</li></ul></li>');
                                    }
                                } break;
                            case "SPELLING":
                                {
                                    for (var k = 0; k < contextCollectionOrdered[j].suggestions.length; k++) {

                                        $('#' + menuname).append('<li style="cursor:pointer;"  style="cursor:pointer;" id="sug_' + j + "_" + k + "_" + contextCollectionOrdered[j].startpos + "_" + contextCollectionOrdered[j].endpos + "_sp" + '" class="icon"><span class="icon spelling" title="' + labelDialogCtxSpellingTooltip + '"></span>' + contextCollectionOrdered[j].suggestions[k] + '<ul> <li style="cursor:pointer;"  id="srp_' + j + "_" + k + '" class="icon"><span class="icon replace"></span>' + labelDialogCtxReplace + '</li><li  style="cursor:pointer;" id="rpa_' + j + "_" + k + '" class="icon"><span class="icon replaceall"></span>' + labelDialogCtxReplaceAll + '</li>  <li style="cursor:pointer;"  id="ign_' + j + "_" + k + '" class="icon"><span class="icon ignore"></span>' + labelDialogCtxIgnore + '</li></ul></li>');
                                    }
                                } break;
                        }
                    }
                }

                if ($('ul[id^="' + menuname + '"] li').size() > 0) {
                    $('#' + menuname).append('<li style="cursor:pointer;"  id="iga_' + j + "_" + k + "_" + contextCollectionOrdered[0].startpos + "_" + contextCollectionOrdered[0].endpos + '" class="icon"><span class="icon"></span><span style="font-weight:bold;color:red">' + labelDialogCtxIgnoreAll + '</span></li>');
                    CreateContextMenu(menuname);
                }
                else
                    $('#' + menuname).remove();
            }
        }


        //end Build Suggestions functions


        /* start Display Results */

        function DisplayResults() {

            $("#" + btnReplaceId).css("display", "inline");
            $("#" + btnFixAllId).css("display", "inline");
            //hide loadding mask
            $("#" + $("#" + acceptContainerId).parent('div').attr("id") + " .loadmask").css("display", "none");
            CheckifThereAnyMore();
            $("#" + acceptContainerId).css("display", "block");
        }


        //Checks if there any more replaceable rules
        function CheckifThereAnyMore() {
            if ($('#' + acceptContainerId + ' SPAN.highlight').length == 0) {
                $("#" + btnFixAllId).css('display', 'none');
            }
        }


        /* end Display Results */


        /* start Audit Aux Methods */
        function AuditRuleAction(startpos, endpos, auditypeid) {

            for (var i = 0; i < acceptGenericResponses.length; i++)
                if (acceptGenericResponses[i].GetStartPosition() == startpos && acceptGenericResponses[i].GetEndPosition() == endpos) {
                    var ruleAuditToAudit = new AuditAction(GlobalAuditAction.GetSession(), auditypeid, acceptGenericResponses[i].GetRuleName(), acceptGenericResponses[i].GetContext(), GetTextBefore(acceptTextContext, acceptGenericResponses[i].GetStartPosition(), MaxRuleExtractionLength), GetTextAfter(acceptTextContext, acceptGenericResponses[i].GetEndPosition(), MaxRuleExtractionLength), new Date(), new Date);
                    ruleAuditToAudit.SubmitAudit();
                }
        }

        function AuditAll(auditTypeId) {
            for (var k = 0; k < acceptGenericResponses.length; k++)
                if (acceptGenericResponses[k].GetSuggestions().length > 0)
                    AuditRuleAction(acceptGenericResponses[k].GetStartPosition(), acceptGenericResponses[k].GetEndPosition(), auditTypeId);
        }


        function GetTextAfter(text, endpos, length) {

            var finallength = ((endpos + length) > text.length) ? finallength = text.length : finallength = length;
            return text.substr(endpos, finallength);

        }

        function GetTextBefore(text, startpos, length) {

            var initiallength = ((startpos - length) < 0) ? initiallength = 0 : initiallength = (startpos - length);
            return text.substr(initiallength, startpos);
        }


        /* end Audit Aux Methods */

        //start build suggestions context menus and fix methods

        function CreateContextMenu(menuname) {
            /*NEW PLUGIN*/
            $('#' + acceptContainerId + ' SPAN.highlight').each(function (index) {//$('#divgrammar P SPAN').each(function (index) {

                if (!$(this).data('events')) {
                    $(this).jeegoocontext(menuname,
                        {
                            widthOverflowOffset: 0,
                            heightOverflowOffset: 3,
                            submenuLeftOffset: -4,
                            submenuTopOffset: -5,
                            event: 'click',
                            onSelect: function (e, context) {

                                var option = $(this).attr("id").substr(0, 4);
                                switch (option) {
                                    case "sug_":
                                        {

                                            var clickedli = $(this).closest('li[id^="sug_"]');
                                            var clickedLiSpllited = clickedli[0].id.split('_');
                                            var suggestionToUse = this.childNodes[2].data;

                                            /* If flag type == gr means Grammar, in this case we check if there are any Spelling rule we can use */
                                            if (clickedLiSpllited[5] == "gr") {

                                                var clickedUl = $(this).closest('ul');
                                                if (clickedUl != null && clickedUl.length > 0) {

                                                    for (var i = 0; i < clickedUl[0].childNodes.length; i++) {

                                                        var li = clickedUl[0].childNodes[i];
                                                        var liIdSplitted = li.id.split('_');

                                                        /*If we find any Spelling rule we can replace it on the Grammar suggestion before we actually use the Grammar suggestion*/
                                                        if (liIdSplitted[5] == "sp") {
                                                            var matchingSpellingNode = $('#' + acceptContainerId).find('span[id^="spncontext_' + liIdSplitted[3] + '_' + liIdSplitted[4] + '"]');
                                                            var spellingPartToReplace = "";
                                                            if (matchingSpellingNode != null && matchingSpellingNode.length > 0) {
                                                                spellingPartToReplace = matchingSpellingNode[0].childNodes[0].data;
                                                                var firstSpellingRuleToUse = $($(li)).contents().filter(function () { return this.nodeType == 3; });
                                                                suggestionToUse = suggestionToUse.replace(spellingPartToReplace, firstSpellingRuleToUse[0].data); // li.childNodes[j].data                                                                                                                              
                                                                break;

                                                            }
                                                        }
                                                    }
                                                }

                                                $('#' + acceptContainerId).find('span[id^="spncontext_' + clickedLiSpllited[3] + '_' + clickedLiSpllited[4] + '"]').each(function (index) {
                                                    $(this).find('span[id^="spncontext"]').replaceWith(function () { return $(this).contents(); });
                                                    $(this).text(suggestionToUse);

                                                    /*Audit Main Rule Used - 7 is the ID */
                                                    AuditRuleAction(clickedLiSpllited[3], clickedLiSpllited[4], 7);
                                                    /*Audit Main Rule*/

                                                });


                                            } // end if (clickedLiSpllited[5] == "gr") 
                                            else {

                                                var spnContext = $('#' + acceptContainerId).find('span[id^="spncontext_' + clickedLiSpllited[3].toString() + '_' + clickedLiSpllited[4].toString() + '"]');
                                                //$(this).find('span[id^="spncontext"]').replaceWith(function () { return $(this).contents(); });

                                                if (spnContext != null) {
                                                    $(spnContext).text(suggestionToUse);
                                                    /*Audit Main Rule Used - 7 is the ID */
                                                    AuditRuleAction(clickedLiSpllited[3], clickedLiSpllited[4], 7);
                                                    /*Audit Main Rule*/
                                                }
                                            }

                                            $("#" + btnRefreshId).trigger('click');

                                        } break;
                                    case "srp_":

                                        var clickedli = $(this).closest('li[id^="sug_"]');
                                        var clickedLiSpllited = clickedli[0].id.split('_'); //WAS called clickedliStartEndPos
                                        var suggestionToUse = this.childNodes[2].data;
                                        /* If flag type == gr means Grammar, in this case we check if there are any Spelling rule we can use */
                                        if (clickedLiSpllited[5] == "gr") {

                                            var clickedUl = $(this).closest('ul');
                                            if (clickedUl != null && clickedUl.length > 0) {

                                                for (var i = 0; i < clickedUl[0].childNodes.length; i++) {

                                                    var li = clickedUl[0].childNodes[i];
                                                    var liIdSplitted = li.id.split('_');

                                                    /*If we find any Spelling rule we can replace it on the Grammar suggestion before we actually use the Grammar suggestion*/
                                                    if (liIdSplitted[5] == "sp") {
                                                        var matchingSpellingNode = $('#' + acceptContainerId).find('span[id^="spncontext_' + liIdSplitted[3] + '_' + liIdSplitted[4] + '"]');
                                                        var spellingPartToReplace = "";
                                                        if (matchingSpellingNode != null && matchingSpellingNode.length > 0) {
                                                            spellingPartToReplace = matchingSpellingNode[0].childNodes[0].data;
                                                            var firstSpellingRuleToUse = $($(li)).contents().filter(function () { return this.nodeType == 3; });
                                                            suggestionToUse = suggestionToUse.replace(spellingPartToReplace, firstSpellingRuleToUse[0].data); // li.childNodes[j].data                                                                
                                                            break;
                                                        }
                                                    }
                                                }
                                            }

                                            $('#' + acceptContainerId).find('span[id^="spncontext_' + clickedLiSpllited[3] + '_' + clickedLiSpllited[4] + '"]').each(function (index) {
                                                $(this).find('span[id^="spncontext"]').replaceWith(function () { return $(this).contents(); });
                                                $(this).text(suggestionToUse);

                                                /*Audit Main Rule Used - 7 is the ID */
                                                AuditRuleAction(clickedLiSpllited[3], clickedLiSpllited[4], 7);
                                                /*Audit Main Rule*/

                                            });
                                        } // end if (clickedLiSpllited[5] == "gr") 
                                        else {
                                            var spnContext = $('#' + acceptContainerId).find('span[id^="spncontext_' + clickedLiSpllited[3].toString() + '_' + clickedLiSpllited[4].toString() + '"]');
                                            //$(this).find('span[id^="spncontext"]').replaceWith(function () { return $(this).contents(); });
                                            if (spnContext != null) {
                                                $(spnContext).text(suggestionToUse);
                                                /*Audit Main Rule Used - 7 is the ID */
                                                AuditRuleAction(clickedLiSpllited[3], clickedLiSpllited[4], 7);
                                                /*Audit Main Rule*/
                                            }
                                        }
                                        $("#" + btnRefreshId).trigger('click');

                                        break;
                                    case "rpa_":

                                        var clickedli = $(this).closest('li[id^="sug_"]');
                                        var suggestiontouse = clickedli[0].childNodes[2].data;
                                        var texttoreplace = "";
                                        var clickedliStartEndPos = clickedli[0].id.split('_');
                                        var subRulesUsed = [];
                                        $("#" + acceptContainerId + " SPAN.highlight").each(function (index) {
                                            var contextStartEndPos = this.id.split('_');
                                            if (contextStartEndPos != null && contextStartEndPos.length > 2) {

                                                if ((clickedliStartEndPos[3] == contextStartEndPos[1]) && (clickedliStartEndPos[4] == contextStartEndPos[2])) {
                                                    texttoreplace = $(this).text();

                                                    /* START Merge GRAMMAR with SPELL*/
                                                    var contextnodeid = this.id;
                                                    if (('#' + contextnodeid + ' SPAN').length > 0) {

                                                        var nodesmenu = $(clickedli).closest('li[id^="sug_"]').parent('ul');
                                                        $('#' + contextnodeid + ' SPAN').each(function (index) {

                                                            var contextsubnodes = this.id.split('_');
                                                            for (var i = 0; nodesmenu[0].childNodes.length; i++) {
                                                                var menunoderemaining = nodesmenu[0].childNodes[i].id.split('_');

                                                                if ((contextsubnodes[1] == menunoderemaining[3]) && (contextsubnodes[2] == menunoderemaining[4])) {



                                                                    var linode = nodesmenu[0].childNodes[i];

                                                                    for (var j = 0; j < linode.childNodes.length; j++) {

                                                                        if (linode.childNodes[j].nodeType == 3) {

                                                                            if (this.innerText != null && this.innerText.length > 0) //textContent for FF
                                                                                suggestiontouse = suggestiontouse.replace(this.innerText, linode.childNodes[j].data);
                                                                            else
                                                                                suggestiontouse = suggestiontouse.replace(this.textContent, linode.childNodes[j].data);

                                                                        }
                                                                    }



                                                                    /*Audit Sub Rule Used == 7 */
                                                                    AuditRuleAction(contextsubnodes[1], contextsubnodes[2], 7);
                                                                    subRulesUsed.push(contextsubnodes[1] + '_' + contextsubnodes[2]);
                                                                    /*Audit Sub Rule Used*/

                                                                    break;
                                                                }
                                                            }
                                                        });

                                                    }
                                                    /* END Merge GRAMMAR with SPELL*/

                                                    $(this).text(suggestiontouse);
                                                    /*Audit Main Rule Used == 7 */
                                                    AuditRuleAction(clickedliStartEndPos[3], clickedliStartEndPos[4], 7);
                                                    /*Audit Main Rule Used*/

                                                }
                                            }
                                        });

                                        if (texttoreplace != "") {
                                            $("#" + acceptContainerId + " SPAN").each(function (index) {                                               
                                                if ($(this).text() == texttoreplace) {
                                                    $(this).text(suggestiontouse);
                                                    /*Audit Main Rule Used == 7 */
                                                    AuditRuleAction(clickedliStartEndPos[3], clickedliStartEndPos[4], 7);
                                                    /*Audit Main Rule Used*/
                                                    for (var i = 0; i < subRulesUsed.length; i++)
                                                        AuditRuleAction(subRulesUsed[i].split('_')[0], subRulesUsed[i].split('_')[1], 7);

                                                }
                                            });
                                        }

                                        //AcceptTextContext = $('#divaccept').text();
                                        $("#" + btnRefreshId).trigger('click');



                                        break;
                                    case "ign_":                                      
                                        var nodesmenu = $(this).closest('li[id^="sug_"]').parent('ul');
                                        if (nodesmenu[0].childNodes.length == 2) {//if (nodesmenu[0].childNodes.length == 1) { /*Now there is the Ignore ALL node*/
                                            $(context).removeClass('highlight');
                                            $(context).removeClass('active');
                                            $(context).unbind('click');
                                            $(nodesmenu).remove();
                                        }
                                        else {

                                            var isttheremore = 0;
                                            var clickedli = $(this).closest('li[id^="sug_"]');
                                            var splittedStartEndPositions = clickedli[0].id.split('_');
                                            //.attr("id")                                           

                                            for (var i = 0; i < nodesmenu[0].childNodes.length; i++) {
                                                var childnodesStartEndPos = nodesmenu[0].childNodes[i].id.split('_');
                                                if ((splittedStartEndPositions[3] == childnodesStartEndPos[3]) && (splittedStartEndPositions[4] == childnodesStartEndPos[4]) && (childnodesStartEndPos[0] != "iga"))
                                                    ++isttheremore;
                                            }

                                            $(clickedli[0]).remove();

                                            if (isttheremore == 1) {
                                                $("#" + acceptContainerId + " SPAN.highlight").each(function (index) {

                                                    var contextStartEndPos = this.id.split('_');
                                                    if ((splittedStartEndPositions[3] == contextStartEndPos[1]) && (splittedStartEndPositions[4] == contextStartEndPos[2])) {

                                                        $(this).removeClass('highlight');
                                                        $(this).removeClass('active');
                                                        $(this).unbind('click');
                                                    }

                                                });

                                            }
                                            else {
                                                /*what ??? */
                                            }
                                        }
                                        break;
                                    case "iga_":


                                        var splittedStartEndPositions = this.id.split('_');

                                        $("#" + acceptContainerId + " SPAN.highlight").each(function (index) {

                                            var contextStartEndPos = this.id.split('_');

                                            if (contextStartEndPos != null && contextStartEndPos.length > 2) {

                                                if ((splittedStartEndPositions[3] == contextStartEndPos[1]) && (splittedStartEndPositions[4] == contextStartEndPos[2])) {
                                                    $(this).removeClass('highlight');
                                                    $(this).removeClass('active');
                                                    $(this).unbind('click');
                                                }

                                                var contextnodeid = this.id;
                                                if (('#' + contextnodeid + ' SPAN').length > 0) {
                                                    $('#' + contextnodeid + ' SPAN').each(function (index) {
                                                        $(this).removeClass('highlight');
                                                        $(this).removeClass('active');
                                                        $(this).unbind('click');
                                                    });
                                                }

                                            }
                                        });


                                        break;
                                    default: break;
                                }


                                CheckifThereAnyMore();

                            }
                        });

                } //end if has events attached                         

            });                                 //end $.each                                                        

            /*END NEW PLUGIN*/
        }




        function FixAll() {



            /* Audit all as Rule Used Type == 7 */
            //AuditAll(7);


            $('ul[id^="acceptmenu"]').each(function (index) {

                //$('#' + this.id + ' li:first').trigger('click');

                //var nodesmenuhelp = this;


                var clickedli = $('#' + this.id + ' li:first').closest('li[id^="sug_"]')
                var clickedliStartEndPos = clickedli[0].id.split('_');
                var suggestiontouse = "";

                //var suggestiontouse = clickedli[0].childNodes[1].data;
                for (var i = 0; i < clickedli[0].childNodes.length; i++) {

                    if (clickedli[0].childNodes[i].nodeType == 3) {

                        suggestiontouse = clickedli[0].childNodes[i].data;
                        break;
                    }
                }

                if (suggestiontouse.length > 0) {

                    var breakCicle = false;

                    $("#" + acceptContainerId + " SPAN.highlight").each(function (index) {


                        var contextStartEndPos = this.id.split('_');

                        if (contextStartEndPos != null && contextStartEndPos.length > 2) {


                            if ((clickedliStartEndPos[3] == contextStartEndPos[1]) && (clickedliStartEndPos[4] == contextStartEndPos[2])) {

                                /* START Merge GRAMMAR with SPELL*/
                                var contextnodeid = this.id;
                                if (('#' + contextnodeid + ' SPAN').length > 0) {

                                    var nodesmenu = $(clickedli).closest('li[id^="sug_"]').parent('ul');
                                    $('#' + contextnodeid + ' SPAN').each(function (index) {

                                        var contextsubnodes = this.id.split('_');
                                        for (var i = 0; i < nodesmenu[0].childNodes.length; i++) {//for (i = 0; nodesmenu[0].childNodes; i++) {
                                            var menunoderemaining = nodesmenu[0].childNodes[i].id.split('_');

                                            if ((contextsubnodes[1] == menunoderemaining[3]) && (contextsubnodes[2] == menunoderemaining[4])) {

                                                var linode = nodesmenu[0].childNodes[i];

                                                for (var j = 0; j < linode.childNodes.length; j++) {

                                                    if (linode.childNodes[j].nodeType == 3) {

                                                        if (this.innerText != null && this.innerText.length > 0) //textContent for FF
                                                            suggestiontouse = suggestiontouse.replace(this.innerText, linode.childNodes[j].data);
                                                        else
                                                            suggestiontouse = suggestiontouse.replace(this.textContent, linode.childNodes[j].data);

                                                    }
                                                }

                                                //suggestiontouse = suggestiontouse.replace(this.innerText, linode.childNodes[1].innerText); //alert("change it on the suggestion before final replace...");
                                                break;
                                            }
                                        }
                                    });

                                }
                                /* END Merge GRAMMAR with SPELL*/

                                $(this).text(suggestiontouse);
                                breakCicle = true;
                                return (!breakCicle);


                            }
                        }
                    });
                }

            });

            //AcceptTextContext = $('#divaccept').text();
            $("#" + btnRefreshId).trigger('click');

        }


        //end

        /* start PrepareTextOutput */
        function PrepareTextOutput(context) {           
            /*if the DIV text length is > 0 we are facing a Refresh*/
            if ($("#" + acceptContainerId).text().length == 0) {

                $("#" + acceptContainerId).text(unescape(acceptTextContext));
            }
            else {
                acceptTextContext = $("#" + acceptContainerId).text();
            }

        }

        /* end PrepareTextOutput */


        /* END Global Variables */


        /* ----- START Private Methods ----- */

        function encode_utf8(s) {
            return unescape(encodeURIComponent(s));
        }

        function decode_utf8(s) {
            return decodeURIComponent(escape(s));

        }

        /*start Clean Text */

        var CleanText = function (text) {
            var cleanedText;
            /*we dont necessarly need to remove the tags... its only for protection...*/
            if (settings.requestFormat == 'TEXT')
                cleanedText = $.trim(removeHTMLTags(text.replace(/&nbsp;/gi, ' ')));
            else
                cleanedText = $.trim(text.replace(/&nbsp;/gi, ' '));
            return escape(cleanedText);
        }

        /*end Clean Text */

        function removeHTMLTags(input) {
            var strInputCode = input;
            /* 
            This line is optional, it replaces escaped brackets with real ones, 
            i.e. < is replaced with < and > is replaced with >
            */
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


        //LOAD TEXT EDITOR
        function LoadTextEditor() {
            $('#' + acceptObjectId).tinymce({
                script_url: settings.tinyMceUrl,                
                theme: "advanced",
                entity_encoding: "raw",
                plugins: "",
                width: "540px",
                theme_advanced_buttons1: "bold,italic,underline,separator,justifyleft,justifycenter,justifyright,separator,undo,redo,separator, btnTinyMceAccept_" + acceptObjectId + "",      
                theme_advanced_buttons2: "",
                theme_advanced_buttons3: "",
                theme_advanced_buttons4: "",
                //theme_advanced_disable: "strikethrough,styleselect",
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
            $(acceptObject).contextMenu({   // NOTE-2 // //$($('#textAreaAccept').contents().find('html')).contextMenu({
                menu: mainContextMenuId//'myMenu',
                // NOTE-3 //  //startx: x, 
                // NOTE-4 //  //starty: y
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

            var responseStatusObj = data;
            if (responseStatusObj != null && responseStatusObj.Response.ResultSet != null) {
                var resultsets = responseStatusObj.Response.ResultSet;
                if (context == "ACCEPT") {
                    $.each(resultsets, function (i) {
                        var results = resultsets[i].Results;
                        $.each(results, function (j) {
                            var header = results[j].Header;
                            var body = results[j].Body;
                            // 
                            var acceptresponse = new Response(body.Context, header.Type, body.Suggestion, body.StartPos, body.EndPos, header.Description, header.Rule, body.ContextPieces);

                            if (header.Type == "GRAMMAR" || header.Type == "SPELLING") {
                                if (body.Suggestion.length > 0)
                                    acceptGenericResponses.push(acceptresponse);
                                else
                                    acceptNonSuggestionGenericResponses.push(acceptresponse); /*IF THERE ARE NO SUGGESTIONS WE TAKE IT LIKE A STYLE RULE*/
                            }
                            else
                                if (header.Type == "STYLE") {
                                    acceptNonSuggestionGenericResponses.push(acceptresponse);
                                }
                        });
                    });      //end result set

                    if (acceptGenericResponses.length == 0 && acceptNonSuggestionGenericResponses.length == 0) {
                        DisplayNoResultsyMessage(context, "No Results Found!");
                    }
                    else {
                        /*Get Content from Text Area to Accept Dialog DIV*/
                        PrepareTextOutput("accept");


                        if (acceptNonSuggestionGenericResponses.length > 0)
                            BuildStyleRules(clone(acceptNonSuggestionGenericResponses));

                        if (acceptGenericResponses.length > 0)
                            BuildRulesWithSuggestions(clone(acceptGenericResponses));

                        /*Hide Loading and Show Results*/
                        DisplayResults();
                    }
                }
                else {
                    //ALL RESULST WILL BE SHOWED WITTHIN THE SAME POPUP
                }

            }


        }
        /* end Handle API Result */

        /* start Handle API Result Status */
        function HandleRequestStatus(data, context) {
            var responseStatusObj = data;
            if (responseStatusObj != null && responseStatusObj.AcceptSessionCode != null) {
                if (GlobalAuditAction != null)
                    GlobalAuditAction.SetSession(responseStatusObj.AcceptSessionCode);
                ParseResponseStatus(data, responseStatusObj.AcceptSessionCode, 0, context);  //DoGetResponseStatus(responseStatusObj.session);                           
            }
            else
                DisplayFailedMessage(context, errorParsingApiStatusMessage);
        }
        /* end Handle API Result Status */




        function ParseResponseStatus(data, sessionid, attempts, currentcontext) {

            //var responseStatusObj = jQuery.parseJSON(data.responseText);
            var responseStatusObj = data;
            var newattempt = ++attempts;

            if (responseStatusObj.State != null) {
                switch (responseStatusObj.State) {
                    case "DONE": DoGetResponse(sessionid, currentcontext); break;
                    case "FAILED": DisplayFailedMessage(currentcontext, errorRequestFailed); break;
                    default:
                        if (parseInt(newattempt) >= 4) {
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

        /* start Do Accept Request */
        function DoAcceptRequest(text) {
debugger;
            if (text != null && text.length > 0) {
                //Audit
                //OriginalAndFinalText = 9
                if (GlobalAuditAction == null)
                    GlobalAuditAction = new AuditAction("", 9, "", "", text, "", new Date(), null);
                else {

                    GlobalAuditAction.SetFinalContext(CleanText(acceptTextContext));
                    GlobalAuditAction.SubmitAudit();
                    GlobalAuditAction = new AuditAction("", 9, "", "", text, "", new Date(), null);
                }
                //end Audit

                var jsonData = '{ApiKey:"' + settings.ApiKey + '", Text:"' + text + '", Language:"' + settings.Lang + '", Rule:" ' + settings.Rule + '", Grammar:"' + checkGrammar + '", Spell:"' + checkSpelling + '", Style:"' + checkStyle + '", RequestFormat:"' + settings.requestFormat + '"}'

                $.ajax({
                    url: settings.AcceptServerPath + "/Core/AcceptRequest",
                    dataType: 'json',
                    contentType: "application/json",
                    type: "POST",
                    async: false,
                    cache: false,
                    data: jsonData,
                    success: function (data) {

                        HandleRequestStatus(data, "ACCEPT");
                    },
                    complete: function (data) {

                    },
                    error: function (error) {

                        DisplayFailedMessage("ACCEPT", errorRequestFailed);
                    }
                });
            }
            else {

                $("#" + acceptDialogId + "").dialog("close");
                alert(noInputTextMessage);

            }
        }
        /* end Do Accept Request */


        /*start Do Get Response*/

        function DoGetResponse(sessionid, currentcontext) {
            $.ajax({
                url: settings.AcceptServerPath + "/Core/GetResponse?session=" + escape(sessionid),
                dataType: 'json',
                contentType: 'application/json',
                type: "GET",
                success: function (data) {
                    HandleResponseStatus(data, currentcontext);
                },
                complete: function (data) {
                    //DisplayNoResultsyMessage(currentcontext);
                },
                error: function (error) {
                    DisplayFailedMessage(currentcontext, errorRequestFailed);
                }
            });
        }

        /*end Do Get Response*/


        /* start Get Response Status */
        function DoGetResponseStatus(sessionid, newattempt, currentcontext) {

            $.ajax({
                url: settings.AcceptServerPath + "/Core/GetResponseStatus?session=" + escape(sessionid),
                dataType: 'json',
                contentType: 'application/json',
                type: "GET",
                success: function (data) {

                    ParseResponseStatus(data, sessionid, ++newattempt, currentcontext);
                },
                complete: function (data) {
                    //TODO:
                },
                error: function (error) {

                    DisplayFailedMessage(currentcontext, errorRequestFailed);
                }
            });
        }
        /* end Get Response Status */

        /* start Display Messages*/

        function DisplayRefreshMessage(context, message, sessionid) {

            $("#" + acceptDialogId + " .loadmask").css("display", "none");
            $("#" + acceptContainerId).text(message);
            $("#" + acceptContainerId).css("display", "block");
            //$("#btn-refresh-accept").css("display", "inline");
            $("#" + btnManualRefreshId).css("display", "inline");
            $("#" + btnReplaceId).css("display", "none");
            $("#" + btnFixAllId).css("display", "none");

        }

        function DisplayFailedMessage(context, message) {

            $("#" + btnReplaceId).css("display", "none");
            $("#" + btnFixAllId).css("display", "none");
            $("#" + acceptDialogId + " .loadmask").css("display", "none");
            $("#" + acceptContainerId).css("display", "block");
            $("#" + acceptContainerId).text(message);
        }

        function DisplayNoResultsyMessage(context) {

            $("#" + btnFixAllId).css("display", "none");
            $("#" + acceptDialogId + " .loadmask").css("display", "none");
            $("#" + acceptContainerId).css("display", "block");
            $("#" + acceptContainerId).text(unescape(acceptTextContext));

            if (isAutoRefresh) {
                isAutoRefresh = false;
                $("#" + btnReplaceId).css("display", "inline");
            }

            showNoResultsDialog();

        }


        var showNoResultsDialog = function () {

            $('#dialogNoIssues_' + acceptDialogId + '').dialog("destroy");
            $('#dialogNoIssues_' + acceptDialogId + '').dialog({
                modal: false,
                buttons: {
                    Ok: function () {
                        $(this).dialog("close");
                    }
                }
            });

        }





        /* end Display Messages*/

        /*start Create Accept Dialog*/
        function CreateAcceptDialog() {

            $("#" + acceptDialogId + "").dialog("close");
            $("#" + acceptDialogId + "").dialog("destroy");

            $("#" + acceptDialogId + "").dialog({ width: settings.dialogWidth, height: settings.dialogHeight,
                open: function (event, ui) {
                    $("#ui-dialog-title-" + acceptDialogId + "").html("");
                    //$(".ui-dialog-titlebar img").remove();
                    //$(".ui-dialog-titlebar").append('<img id="' + imgDialogTitleId + '" style="margin-top:5px;margin-right:15px" src="' + settings.imagesPath + '/accept_dialog_title_.png" alt="ACCEPT" />');
					
					$('div[aria-labelledby=ui-dialog-title-'+acceptDialogId+']').find('.ui-dialog-titlebar img').remove();
					$('div[aria-labelledby=ui-dialog-title-'+acceptDialogId+']').find('.ui-dialog-titlebar').append('<img id="' + imgDialogTitleId + '" style="margin-top:5px;margin-right:15px" src="' + settings.imagesPath + '/accept_dialog_title_.png" alt="ACCEPT" />');
					
					
					//help
					//$(".ui-dialog-buttonpane").append('<img id="imgAcceptInfo_" style="float:left;cursor:pointer;" src="' + settings.imagesPath + '/info_accept.png" alt="Help" />');					
					$('div[aria-labelledby=ui-dialog-title-'+acceptDialogId+']').find('.ui-dialog-buttonpane').append('<img id="imgAcceptInfo_" width="30px" height="30px" style="float:left;cursor:pointer;margin:4px;margin-top:10px;" src="' + settings.imagesPath + '/info_accept.png" alt="Help" />');
					
                },
                close: function (event, ui) {

                    //$("#" + imgDialogTitleId).remove(); //$(".ui-dialog-titlebar img").remove();
                    /*Audit*/
                    GlobalAuditAction = null;
                    /*Audit*/
                    acceptGenericResponses = [];
                    acceptNonSuggestionGenericResponses = [];
                    acceptTextContext = "";
                    $("#" + $("#" + acceptContainerId).parent('div').attr("id") + " .loadmask").css("display", "block");
                    $("#" + acceptContainerId).css("display", "none");
                    $("#" + acceptContainerId).html("");
                    $('ul[id^="acceptmenu"]').remove();

                },
                buttons: [{
                    id: btnFixAllId,
                    text: labelDialogFixAll,
                    click: function () {

                        $("#" + btnReplaceId).css("display", "none");
                        $("#" + btnFixAllId).css("display", "none");
                        FixAll();
                    }
                }, {
                    id: btnRefreshId,
                    text: "",
                    click: function () {

                        acceptTextContext = $('#' + acceptContainerId).text();
                        $('#' + acceptContainerId).text("");
                        $("#" + $("#" + acceptContainerId).parent('div').attr("id") + " .loadmask").css("display", "block");
                        $("#" + acceptContainerId).css("display", "none");

                        acceptGenericResponses = [];
                        acceptNonSuggestionGenericResponses = [];

                        isAutoRefresh = true;

                        DoAcceptRequest(CleanText(acceptTextContext));
                    }
                }, {
                    id: btnManualRefreshId,
                    text: labelDialogRefresh,
                    click: function () {

                        $('#' + acceptContainerId).text("");
                        $("#" + $("#" + acceptContainerId).parent('div').attr("id") + " .loadmask").css("display", "block");
                        $("#" + acceptContainerId).css("display", "none");

                        $("#" + btnManualRefreshId).css("display", "none");
                        acceptGenericResponses = [];
                        acceptNonSuggestionGenericResponses = [];
                        DoGetResponseStatus(GlobalAuditAction.GetSession(), 1, "ACCEPT");

                    }

                }, {
                    id: btnReplaceId,
                    text: labelDialogReplace,
                    click: function () {

                        settings.SubmitInputText($('#' + acceptContainerId).text());
                        //$('#' + acceptObjectId).text($('#' + acceptContainerId).text());  //$("#InputTextArea").text($("#divaccept").text());


                        $(this).dialog("close");
                    }
                }, {
                    id: "btn-cancel-accept",
                    text: labelCtxMenuClose,
                    click: function () {
                        $(this).dialog("close");
                    }
                }]
            });

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

            $("#" + btnRefreshId).css("display", "none");
            $("#" + btnManualRefreshId).css("display", "none");
            $("#" + btnReplaceId).css("display", "none");
            $("#" + btnFixAllId).css("display", "none");
			
			$("#imgAcceptInfo_").click(function () {

                $("#helpDialog_").dialog("close");
                $("#helpDialog_").dialog("destroy");
                $("#helpDialog_").dialog({
                    resizable: true,
                   width: 400,
			    height: 400,			    
			    modal: false,
			    buttons: {
				"Ok": function() {
				    $("#helpDialog_").dialog("close");
				    $("#helpDialog_").dialog("destroy");
				}				
			        }
		            });

            });


            acceptTextContext = CleanText(settings.LoadInputText());

            DoAcceptRequest(acceptTextContext);

        }
        /*end Create Accept Dialog*/


        /* END Private Methods */

        initAccept();

        //alert($(acceptObject).text());

        /*        
        Highlight text Code        
        */
        var corners = ['bottomLeft', 'bottomRight', 'topLeft'];
        var opposites = ['topRight', 'topLeft', 'bottomRight'];
        var styles = ['cream', 'orange', 'red'];
        var cssStyles = ['highlightTextCream', 'highlightTextOrange', 'highlightTextRed'];
        var cssUnderlineStyles = ['highlightCream', 'highlightOrange', 'highlightRed'];

        function cleanNodeData(node) {
            node.data = node.data.replace("\r", "");
            node.data = node.data.replace("\n", "");
            node.data = node.data.replace("\t", "");
            node.data = node.data.replace("“", "&ldquo;");
            node.data = node.data.replace("”", "&ldquo;");
        }

        function LoadCustomToolTips() {
            $.fn.qtip.styles.orange = { // Last part is the name of the style    
                background: '#FFCC6D',
                color: '#967840',
                border: {
                    color: '#F6A828'
                },
                name: 'red' // Inherit the rest of the attributes from the preset dark style
            }
        }

        function addTriggerEventToContextNode(node, nodeIdToTrigger, eventToBind, eventToTrigger) {

            if (eventToBind == 'click') {
                var myclick = $('#' + nodeIdToTrigger).data("events").click[0];
                if (myclick != null)
                    $($(node)).click(myclick);

            }
            else {

                $($(node)).mouseover(function () {

                    var mouseOverEvent = $('#' + nodeIdToTrigger).data("events").mouseover[0];
                    $('#' + nodeIdToTrigger).trigger(mouseOverEvent);


                });

                $($(node)).mouseout(function () {
                    var mouseOutEvent = $('#' + nodeIdToTrigger).data("events").mouseout[0];
                    $('#' + nodeIdToTrigger).trigger(mouseOutEvent);

                });
            }
        }


        function addSplittedNodeWithTriggerAction(node, startPos, endPos, elementtype, classname, id, parentNodeid, eventToBind, eventToTrigger) {

            var spannode = document.createElement(elementtype);
            spannode.className = classname;
            spannode.id = id;
            addTriggerEventToContextNode(spannode, parentNodeid, eventToBind, eventToTrigger);
            if (endPos == 0)
                endPos = node.length;
            var middlebit = node.splitText(startPos);
            var endbit = middlebit.splitText(endPos);
            var middleclone = middlebit.cloneNode(true);
            spannode.appendChild(middleclone);
            middlebit.parentNode.replaceChild(spannode, middlebit);
        }

        function bindToolTip(elementId, toolTipMessage, cornersIndex, oppositesIndex, stylesIndex) {

            $('#' + elementId).qtip(
        {
            content: toolTipMessage,
            position: {
                corner: {
                    tooltip: corners[cornersIndex],
                    target: opposites[oppositesIndex]
                }
            }, style: { border: { width: 5, radius: 10 }, padding: 10, textAlign: 'center', tip: true,
                name: styles[stylesIndex]
            }
        });
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

                return (res <= 0) ? 0 : res; //return (res <= 0) ? 1 : res;
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

        jQuery.fn.highlight = function (pat, startpos, elementtype, classname, spnid) {
            var indexcount = 0;
            var found = false;
            function innerHighlight(node, pat, startpos) {
                var skip = 0;
                if (node.nodeType == 3) {
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

        jQuery.fn.highlightWithToolTip = function (pat, startpos, endpos, elementtype, elementId, ruleTip, currentRuleCount, totalRulesCount) {
            var indexcount = 0;
            var stylesIndex = GetTooltipStyleNumber(currentRuleCount, totalRulesCount, 3);
            var found = false;

            function innerHighlightWithToolTip(node, pat, startpos) {
                var skip = 0;
                if (node.nodeType == 3) {
                    var pos = node.data.toUpperCase().indexOf(pat);
                    if (pos >= 0) {
                        if (pos == startpos) {
                            addSplittedNode(node, pos, pat.length, elementtype, cssStyles[stylesIndex], elementId);
                            found = true;
                            bindToolTip(elementId, ruleTip, stylesIndex, stylesIndex, stylesIndex);
                            skip = 1;
                        }
                        else {

                            if ((pos + indexcount) == startpos) {
                                addSplittedNode(node, pos, pat.length, elementtype, cssStyles[stylesIndex], elementId);
                                bindToolTip(elementId, ruleTip, stylesIndex, stylesIndex, stylesIndex);
                                found = true;
                                skip = 1;
                            }
                            else {

                                /*
                                The two IF statements before would check:
                                1 - IF the start position (of the word we are looking for) matches directly to the position of the node index position where the same word was found, if so then we found the result.  
                                2 - IF the start position (of the word we are looking for) matches the SUM of the number of characters we did so far plus the characters count till the index position where the word was foun, if so then we found the result.
                                3 - The third case occurs when in the same node the word we are looking for appears more than once, in this case the index will hit always the first occurence of the word in the node even if
                                that is not the word we are looking for, so for that we need an extra variable to do counting:

                                var currentindexcount = (indexcount + pos + pat.length);`

                                where:

                                indexcount = number of characters we count so far
                                pos = we need to add the number of characters before the matched word (the wrong one)
                                pat.length = we need to add also the length of that word;

                                Example:

                                [100 characters] + David THIS is not the word THIS we are looking for but THIS is the one.

                                in this case lets say the word to highlight should be the second THIS, so the first THIS would be the first
                                to be matched and he is the wrong one, so in this case: 

                                indexcount =  [100 characters] = 100 characteres 
                                pos = [David ] = 6 characters 
                                pat.length = [THIS] = 4 characters
                                                    
                                */
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
                                        bindToolTip(elementId, ruleTip, stylesIndex, stylesIndex, stylesIndex);
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



        /*METHOD USING ONLY START/END POSITIONs*/

        jQuery.fn.highlightHtmlMultiContextWithToolTip = function (pat, startpos, endPos, elementtype, classname, spnid, ruleTip, currentRuleCount, totalRulesCount) {
            var indexCount = -1;
            var startPiecefound = false;
            var endPieceFound = false;
            var additionalNodesIds = 0;
            var charNumberTillEndOfCurrentNode = -1; /*to check when it was used or not*/
            var charNumberTillLastContextIndex = 0;
            var midlleContextNodesCount = 0;

            var stylesIndex = GetTooltipStyleNumber(currentRuleCount, totalRulesCount, cssStyles.length);

            function innerHighlight(node, pat, startpos) {
                var skip = 0;



                if (node.id != null && node.nodeType != 3 && node.id != acceptContainerId && node.id.substring(0, 10) != "spncontext" && node.id.substring(0, 10) != "spnToolTip") {                    
                    /* check for node attributes */
                    var attributesCount = 0;
                    if (node.childNodes.length == 0) {

                        //attributesCount = node.outerHTML.length + 2;
                        //indexCount += attributesCount;

                        var openingTag = acceptTextContext.charAt(indexCount + 1);
                        if (openingTag == '<') {
                            var subString = acceptTextContext.substring(indexCount + 1, acceptTextContext.length)
                            if (subString != null && subString.length > 0) {
                                var indexFirstClosureTagCharacter = subString.indexOf(">");
                                attributesCount = indexFirstClosureTagCharacter + 1;
                                indexCount = indexCount + attributesCount;
                            }

                        }

                    }
                    else {
                        var indexFirstClosureTagCharacter = node.outerHTML.indexOf(">");
                        attributesCount = indexFirstClosureTagCharacter + 1;
                        indexCount = indexCount + attributesCount;
                    }
                }

                if (node.nodeType == 3) {

                    for (var currentCharIndex = 0; currentCharIndex < node.data.length; currentCharIndex++) {

                        ++indexCount;
                        var pos = currentCharIndex; //node.data.toUpperCase().indexOf(pat);
                        if (startPiecefound && endPieceFound)
                            break;
                        else
                            if (!startPiecefound) {
                                if (pos == startpos) {

                                    if (endPos <= (indexCount + (node.data.length - pos))) {// if ((pos + pat.length) < node.data.length) {
                                        addSplittedNode(node, pos, (node.length - pos), elementtype, cssUnderlineStyles[stylesIndex], spnid); //addSplittedNode(node, pos, pat.length, elementtype, classname, spnid);
                                        startPiecefound = true;
                                        endPieceFound = true;
                                        bindToolTip(spnid, ruleTip, stylesIndex, stylesIndex, stylesIndex);
                                        skip = 1;
                                    }
                                }
                                else {
                                    if ((indexCount) == startpos) {

                                        if (endPos <= (indexCount + (node.data.length - pos))) { //if ((pos + pat.length) <= node.data.length) {
                                            charNumberTillEndOfCurrentNode = (node.data.length - pos);
                                            addSplittedNode(node, pos, (endPos - indexCount), elementtype, cssUnderlineStyles[stylesIndex], spnid); //addSplittedNode(node, pos, (node.length - pos), elementtype, cssStyles[stylesIndex], spnid);
                                            startPiecefound = true;
                                            endPieceFound = true;
                                        }
                                        else {

                                            charNumberTillEndOfCurrentNode = (node.data.length - pos); /* cuting from the start pos till the end of the current node */
                                            addSplittedNode(node, pos, (node.length - pos), elementtype, cssUnderlineStyles[stylesIndex], spnid); //(pos - 1) was only (pos)
                                            startPiecefound = true;
                                        }
                                        bindToolTip(spnid, ruleTip, stylesIndex, stylesIndex, stylesIndex);
                                        //skip = 1;
                                    }
                                }
                            }
                            else {
                                ++charNumberTillLastContextIndex;
                                if (pos == endPos) {

                                    //addSplittedNodeWithTriggerAction(node, pos, pat.length, elementtype, classname, spnid + "_endContext", spnid, 'onmouseover', 'onmouseover');
                                    addSplittedNodeWithTriggerAction(node, 0, (pos + 1), elementtype, cssUnderlineStyles[stylesIndex], spnid + "_endContext", spnid, 'onmouseover', 'onmouseover');
                                    endPieceFound = true;
                                    skip = 1;
                                }
                                else {

                                    if ((indexCount) == endPos) {

                                        //addSplittedNodeWithTriggerAction(node, 0, ((pat.length - charNumberTillLastContextIndex) + pos + 1), elementtype, classname, spnid + "_endContext", spnid, 'onmouseover', 'onmouseover'); /* (pos + 1) because we start the cicle with currentCharIndex = 0 and ends with (currentCharIndex < node.data.length) */
                                        addSplittedNodeWithTriggerAction(node, 0, (pos + 1), elementtype, cssUnderlineStyles[stylesIndex], spnid + "_endContext", spnid, 'onmouseover', 'onmouseover'); /* (pos + 1) because we start the cicle with currentCharIndex = 0 and ends with (currentCharIndex < node.data.length) */
                                        endPieceFound = true;
                                        skip = 1;
                                    }
                                }
                            }

                    } //end for cicle



                    if (startPiecefound && !endPieceFound) {

                        if (charNumberTillEndOfCurrentNode == -1 && node.length > 0 && node.parentNode.id.substring(0, 20) != spnid) { //spncontext_2_0_11_27                      

                            addSplittedNodeWithTriggerAction(node, 0, node.length, elementtype, cssUnderlineStyles[stylesIndex], spnid + "_middleContext_" + midlleContextNodesCount + "", spnid, 'onmouseover', 'onmouseover');
                            ++midlleContextNodesCount;
                            skip = 1;
                        }

                        if (charNumberTillEndOfCurrentNode != -1)//The current node where the start context was found could not be added as a middleContext.
                            charNumberTillEndOfCurrentNode = -1;
                    }

                }
                else if (node.nodeType == 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {


                    for (var i = 0; i < node.childNodes.length; ++i) {

                        i += innerHighlight(node.childNodes[i], pat, startpos);

                        if (startPiecefound && endPieceFound)
                            break;
                    }
                    var thisNode = node;

                    if (thisNode.id != null && thisNode.nodeType != 3 && thisNode.id != acceptContainerId && node.id.substring(0, 10) != "spncontext" && node.id.substring(0, 10) != "spnToolTip") {

                        if (thisNode.childNodes.length == 0) {
                            /* Do nothing because the count was already performed, example: <img /> */
                        }
                        else {
                            indexCount = indexCount + parseInt(thisNode.nodeName.length) + 3; /*  node name + </>  */
                        }

                    }
                }
                return skip;
            }
            //return innerHighlight(this, pat.toUpperCase(), startpos);
            return this.each(function () {
                innerHighlight(this, pat.toUpperCase(), startpos);
            });

        };






    };
})(jQuery);                                                                               // end plugin code

/*

Highligh text code
 
*/




/*QTIP*/
/*
* jquery.qtip. The jQuery tooltip plugin
*
* Copyright (c) 2009 Craig Thompson
* http://craigsworks.com
*
* Licensed under MIT
* http://www.opensource.org/licenses/mit-license.php
*
* Launch  : February 2009
* Version : 1.0.0-rc3
* Released: Tuesday 12th May, 2009 - 00:00
* Debug: jquery.qtip.debug.js
*/

(function (f) { f.fn.qtip = function (B, u) { var y, t, A, s, x, w, v, z; if (typeof B == "string") { if (typeof f(this).data("qtip") !== "object") { f.fn.qtip.log.error.call(self, 1, f.fn.qtip.constants.NO_TOOLTIP_PRESENT, false) } if (B == "api") { return f(this).data("qtip").interfaces[f(this).data("qtip").current] } else { if (B == "interfaces") { return f(this).data("qtip").interfaces } } } else { if (!B) { B = {} } if (typeof B.content !== "object" || (B.content.jquery && B.content.length > 0)) { B.content = { text: B.content} } if (typeof B.content.title !== "object") { B.content.title = { text: B.content.title} } if (typeof B.position !== "object") { B.position = { corner: B.position} } if (typeof B.position.corner !== "object") { B.position.corner = { target: B.position.corner, tooltip: B.position.corner} } if (typeof B.show !== "object") { B.show = { when: B.show} } if (typeof B.show.when !== "object") { B.show.when = { event: B.show.when} } if (typeof B.show.effect !== "object") { B.show.effect = { type: B.show.effect} } if (typeof B.hide !== "object") { B.hide = { when: B.hide} } if (typeof B.hide.when !== "object") { B.hide.when = { event: B.hide.when} } if (typeof B.hide.effect !== "object") { B.hide.effect = { type: B.hide.effect} } if (typeof B.style !== "object") { B.style = { name: B.style} } B.style = c(B.style); s = f.extend(true, {}, f.fn.qtip.defaults, B); s.style = a.call({ options: s }, s.style); s.user = f.extend(true, {}, B) } return f(this).each(function () { if (typeof B == "string") { w = B.toLowerCase(); A = f(this).qtip("interfaces"); if (typeof A == "object") { if (u === true && w == "destroy") { while (A.length > 0) { A[A.length - 1].destroy() } } else { if (u !== true) { A = [f(this).qtip("api")] } for (y = 0; y < A.length; y++) { if (w == "destroy") { A[y].destroy() } else { if (A[y].status.rendered === true) { if (w == "show") { A[y].show() } else { if (w == "hide") { A[y].hide() } else { if (w == "focus") { A[y].focus() } else { if (w == "disable") { A[y].disable(true) } else { if (w == "enable") { A[y].disable(false) } } } } } } } } } } } else { v = f.extend(true, {}, s); v.hide.effect.length = s.hide.effect.length; v.show.effect.length = s.show.effect.length; if (v.position.container === false) { v.position.container = f(document.body) } if (v.position.target === false) { v.position.target = f(this) } if (v.show.when.target === false) { v.show.when.target = f(this) } if (v.hide.when.target === false) { v.hide.when.target = f(this) } t = f.fn.qtip.interfaces.length; for (y = 0; y < t; y++) { if (typeof f.fn.qtip.interfaces[y] == "undefined") { t = y; break } } x = new d(f(this), v, t); f.fn.qtip.interfaces[t] = x; if (typeof f(this).data("qtip") == "object") { if (typeof f(this).attr("qtip") === "undefined") { f(this).data("qtip").current = f(this).data("qtip").interfaces.length } f(this).data("qtip").interfaces.push(x) } else { f(this).data("qtip", { current: 0, interfaces: [x] }) } if (v.content.prerender === false && v.show.when.event !== false && v.show.ready !== true) { v.show.when.target.bind(v.show.when.event + ".qtip-" + t + "-create", { qtip: t }, function (C) { z = f.fn.qtip.interfaces[C.data.qtip]; z.options.show.when.target.unbind(z.options.show.when.event + ".qtip-" + C.data.qtip + "-create"); z.cache.mouse = { x: C.pageX, y: C.pageY }; p.call(z); z.options.show.when.target.trigger(z.options.show.when.event) }) } else { x.cache.mouse = { x: v.show.when.target.offset().left, y: v.show.when.target.offset().top }; p.call(x) } } }) }; function d(u, t, v) { var s = this; s.id = v; s.options = t; s.status = { animated: false, rendered: false, disabled: false, focused: false }; s.elements = { target: u.addClass(s.options.style.classes.target), tooltip: null, wrapper: null, content: null, contentWrapper: null, title: null, button: null, tip: null, bgiframe: null }; s.cache = { mouse: {}, position: {}, toggle: 0 }; s.timers = {}; f.extend(s, s.options.api, { show: function (y) { var x, z; if (!s.status.rendered) { return f.fn.qtip.log.error.call(s, 2, f.fn.qtip.constants.TOOLTIP_NOT_RENDERED, "show") } if (s.elements.tooltip.css("display") !== "none") { return s } s.elements.tooltip.stop(true, false); x = s.beforeShow.call(s, y); if (x === false) { return s } function w() { if (s.options.position.type !== "static") { s.focus() } s.onShow.call(s, y); if (f.browser.msie) { s.elements.tooltip.get(0).style.removeAttribute("filter") } } s.cache.toggle = 1; if (s.options.position.type !== "static") { s.updatePosition(y, (s.options.show.effect.length > 0)) } if (typeof s.options.show.solo == "object") { z = f(s.options.show.solo) } else { if (s.options.show.solo === true) { z = f("div.qtip").not(s.elements.tooltip) } } if (z) { z.each(function () { if (f(this).qtip("api").status.rendered === true) { f(this).qtip("api").hide() } }) } if (typeof s.options.show.effect.type == "function") { s.options.show.effect.type.call(s.elements.tooltip, s.options.show.effect.length); s.elements.tooltip.queue(function () { w(); f(this).dequeue() }) } else { switch (s.options.show.effect.type.toLowerCase()) { case "fade": s.elements.tooltip.fadeIn(s.options.show.effect.length, w); break; case "slide": s.elements.tooltip.slideDown(s.options.show.effect.length, function () { w(); if (s.options.position.type !== "static") { s.updatePosition(y, true) } }); break; case "grow": s.elements.tooltip.show(s.options.show.effect.length, w); break; default: s.elements.tooltip.show(null, w); break } s.elements.tooltip.addClass(s.options.style.classes.active) } return f.fn.qtip.log.error.call(s, 1, f.fn.qtip.constants.EVENT_SHOWN, "show") }, hide: function (y) { var x; if (!s.status.rendered) { return f.fn.qtip.log.error.call(s, 2, f.fn.qtip.constants.TOOLTIP_NOT_RENDERED, "hide") } else { if (s.elements.tooltip.css("display") === "none") { return s } } clearTimeout(s.timers.show); s.elements.tooltip.stop(true, false); x = s.beforeHide.call(s, y); if (x === false) { return s } function w() { s.onHide.call(s, y) } s.cache.toggle = 0; if (typeof s.options.hide.effect.type == "function") { s.options.hide.effect.type.call(s.elements.tooltip, s.options.hide.effect.length); s.elements.tooltip.queue(function () { w(); f(this).dequeue() }) } else { switch (s.options.hide.effect.type.toLowerCase()) { case "fade": s.elements.tooltip.fadeOut(s.options.hide.effect.length, w); break; case "slide": s.elements.tooltip.slideUp(s.options.hide.effect.length, w); break; case "grow": s.elements.tooltip.hide(s.options.hide.effect.length, w); break; default: s.elements.tooltip.hide(null, w); break } s.elements.tooltip.removeClass(s.options.style.classes.active) } return f.fn.qtip.log.error.call(s, 1, f.fn.qtip.constants.EVENT_HIDDEN, "hide") }, updatePosition: function (w, x) { var C, G, L, J, H, E, y, I, B, D, K, A, F, z; if (!s.status.rendered) { return f.fn.qtip.log.error.call(s, 2, f.fn.qtip.constants.TOOLTIP_NOT_RENDERED, "updatePosition") } else { if (s.options.position.type == "static") { return f.fn.qtip.log.error.call(s, 1, f.fn.qtip.constants.CANNOT_POSITION_STATIC, "updatePosition") } } G = { position: { left: 0, top: 0 }, dimensions: { height: 0, width: 0 }, corner: s.options.position.corner.target }; L = { position: s.getPosition(), dimensions: s.getDimensions(), corner: s.options.position.corner.tooltip }; if (s.options.position.target !== "mouse") { if (s.options.position.target.get(0).nodeName.toLowerCase() == "area") { J = s.options.position.target.attr("coords").split(","); for (C = 0; C < J.length; C++) { J[C] = parseInt(J[C]) } H = s.options.position.target.parent("map").attr("name"); E = f('img[usemap="#' + H + '"]:first').offset(); G.position = { left: Math.floor(E.left + J[0]), top: Math.floor(E.top + J[1]) }; switch (s.options.position.target.attr("shape").toLowerCase()) { case "rect": G.dimensions = { width: Math.ceil(Math.abs(J[2] - J[0])), height: Math.ceil(Math.abs(J[3] - J[1])) }; break; case "circle": G.dimensions = { width: J[2] + 1, height: J[2] + 1 }; break; case "poly": G.dimensions = { width: J[0], height: J[1] }; for (C = 0; C < J.length; C++) { if (C % 2 == 0) { if (J[C] > G.dimensions.width) { G.dimensions.width = J[C] } if (J[C] < J[0]) { G.position.left = Math.floor(E.left + J[C]) } } else { if (J[C] > G.dimensions.height) { G.dimensions.height = J[C] } if (J[C] < J[1]) { G.position.top = Math.floor(E.top + J[C]) } } } G.dimensions.width = G.dimensions.width - (G.position.left - E.left); G.dimensions.height = G.dimensions.height - (G.position.top - E.top); break; default: return f.fn.qtip.log.error.call(s, 4, f.fn.qtip.constants.INVALID_AREA_SHAPE, "updatePosition"); break } G.dimensions.width -= 2; G.dimensions.height -= 2 } else { if (s.options.position.target.add(document.body).length === 1) { G.position = { left: f(document).scrollLeft(), top: f(document).scrollTop() }; G.dimensions = { height: f(window).height(), width: f(window).width()} } else { if (typeof s.options.position.target.attr("qtip") !== "undefined") { G.position = s.options.position.target.qtip("api").cache.position } else { G.position = s.options.position.target.offset() } G.dimensions = { height: s.options.position.target.outerHeight(), width: s.options.position.target.outerWidth()} } } y = f.extend({}, G.position); if (G.corner.search(/right/i) !== -1) { y.left += G.dimensions.width } if (G.corner.search(/bottom/i) !== -1) { y.top += G.dimensions.height } if (G.corner.search(/((top|bottom)Middle)|center/) !== -1) { y.left += (G.dimensions.width / 2) } if (G.corner.search(/((left|right)Middle)|center/) !== -1) { y.top += (G.dimensions.height / 2) } } else { G.position = y = { left: s.cache.mouse.x, top: s.cache.mouse.y }; G.dimensions = { height: 1, width: 1} } if (L.corner.search(/right/i) !== -1) { y.left -= L.dimensions.width } if (L.corner.search(/bottom/i) !== -1) { y.top -= L.dimensions.height } if (L.corner.search(/((top|bottom)Middle)|center/) !== -1) { y.left -= (L.dimensions.width / 2) } if (L.corner.search(/((left|right)Middle)|center/) !== -1) { y.top -= (L.dimensions.height / 2) } I = (f.browser.msie) ? 1 : 0; B = (f.browser.msie && parseInt(f.browser.version.charAt(0)) === 6) ? 1 : 0; if (s.options.style.border.radius > 0) { if (L.corner.search(/Left/) !== -1) { y.left -= s.options.style.border.radius } else { if (L.corner.search(/Right/) !== -1) { y.left += s.options.style.border.radius } } if (L.corner.search(/Top/) !== -1) { y.top -= s.options.style.border.radius } else { if (L.corner.search(/Bottom/) !== -1) { y.top += s.options.style.border.radius } } } if (I) { if (L.corner.search(/top/) !== -1) { y.top -= I } else { if (L.corner.search(/bottom/) !== -1) { y.top += I } } if (L.corner.search(/left/) !== -1) { y.left -= I } else { if (L.corner.search(/right/) !== -1) { y.left += I } } if (L.corner.search(/leftMiddle|rightMiddle/) !== -1) { y.top -= 1 } } if (s.options.position.adjust.screen === true) { y = o.call(s, y, G, L) } if (s.options.position.target === "mouse" && s.options.position.adjust.mouse === true) { if (s.options.position.adjust.screen === true && s.elements.tip) { K = s.elements.tip.attr("rel") } else { K = s.options.position.corner.tooltip } y.left += (K.search(/right/i) !== -1) ? -6 : 6; y.top += (K.search(/bottom/i) !== -1) ? -6 : 6 } if (!s.elements.bgiframe && f.browser.msie && parseInt(f.browser.version.charAt(0)) == 6) { f("select, object").each(function () { A = f(this).offset(); A.bottom = A.top + f(this).height(); A.right = A.left + f(this).width(); if (y.top + L.dimensions.height >= A.top && y.left + L.dimensions.width >= A.left) { k.call(s) } }) } y.left += s.options.position.adjust.x; y.top += s.options.position.adjust.y; F = s.getPosition(); if (y.left != F.left || y.top != F.top) { z = s.beforePositionUpdate.call(s, w); if (z === false) { return s } s.cache.position = y; if (x === true) { s.status.animated = true; s.elements.tooltip.animate(y, 200, "swing", function () { s.status.animated = false }) } else { s.elements.tooltip.css(y) } s.onPositionUpdate.call(s, w); if (typeof w !== "undefined" && w.type && w.type !== "mousemove") { f.fn.qtip.log.error.call(s, 1, f.fn.qtip.constants.EVENT_POSITION_UPDATED, "updatePosition") } } return s }, updateWidth: function (w) { var x; if (!s.status.rendered) { return f.fn.qtip.log.error.call(s, 2, f.fn.qtip.constants.TOOLTIP_NOT_RENDERED, "updateWidth") } else { if (w && typeof w !== "number") { return f.fn.qtip.log.error.call(s, 2, "newWidth must be of type number", "updateWidth") } } x = s.elements.contentWrapper.siblings().add(s.elements.tip).add(s.elements.button); if (!w) { if (typeof s.options.style.width.value == "number") { w = s.options.style.width.value } else { s.elements.tooltip.css({ width: "auto" }); x.hide(); if (f.browser.msie) { s.elements.wrapper.add(s.elements.contentWrapper.children()).css({ zoom: "normal" }) } w = s.getDimensions().width + 1; if (!s.options.style.width.value) { if (w > s.options.style.width.max) { w = s.options.style.width.max } if (w < s.options.style.width.min) { w = s.options.style.width.min } } } } if (w % 2 !== 0) { w -= 1 } s.elements.tooltip.width(w); x.show(); if (s.options.style.border.radius) { s.elements.tooltip.find(".qtip-betweenCorners").each(function (y) { f(this).width(w - (s.options.style.border.radius * 2)) }) } if (f.browser.msie) { s.elements.wrapper.add(s.elements.contentWrapper.children()).css({ zoom: "1" }); s.elements.wrapper.width(w); if (s.elements.bgiframe) { s.elements.bgiframe.width(w).height(s.getDimensions.height) } } return f.fn.qtip.log.error.call(s, 1, f.fn.qtip.constants.EVENT_WIDTH_UPDATED, "updateWidth") }, updateStyle: function (w) { var z, A, x, y, B; if (!s.status.rendered) { return f.fn.qtip.log.error.call(s, 2, f.fn.qtip.constants.TOOLTIP_NOT_RENDERED, "updateStyle") } else { if (typeof w !== "string" || !f.fn.qtip.styles[w]) { return f.fn.qtip.log.error.call(s, 2, f.fn.qtip.constants.STYLE_NOT_DEFINED, "updateStyle") } } s.options.style = a.call(s, f.fn.qtip.styles[w], s.options.user.style); s.elements.content.css(q(s.options.style)); if (s.options.content.title.text !== false) { s.elements.title.css(q(s.options.style.title, true)) } s.elements.contentWrapper.css({ borderColor: s.options.style.border.color }); if (s.options.style.tip.corner !== false) { if (f("<canvas>").get(0).getContext) { z = s.elements.tooltip.find(".qtip-tip canvas:first"); x = z.get(0).getContext("2d"); x.clearRect(0, 0, 300, 300); y = z.parent("div[rel]:first").attr("rel"); B = b(y, s.options.style.tip.size.width, s.options.style.tip.size.height); h.call(s, z, B, s.options.style.tip.color || s.options.style.border.color) } else { if (f.browser.msie) { z = s.elements.tooltip.find('.qtip-tip [nodeName="shape"]'); z.attr("fillcolor", s.options.style.tip.color || s.options.style.border.color) } } } if (s.options.style.border.radius > 0) { s.elements.tooltip.find(".qtip-betweenCorners").css({ backgroundColor: s.options.style.border.color }); if (f("<canvas>").get(0).getContext) { A = g(s.options.style.border.radius); s.elements.tooltip.find(".qtip-wrapper canvas").each(function () { x = f(this).get(0).getContext("2d"); x.clearRect(0, 0, 300, 300); y = f(this).parent("div[rel]:first").attr("rel"); r.call(s, f(this), A[y], s.options.style.border.radius, s.options.style.border.color) }) } else { if (f.browser.msie) { s.elements.tooltip.find('.qtip-wrapper [nodeName="arc"]').each(function () { f(this).attr("fillcolor", s.options.style.border.color) }) } } } return f.fn.qtip.log.error.call(s, 1, f.fn.qtip.constants.EVENT_STYLE_UPDATED, "updateStyle") }, updateContent: function (A, y) { var z, x, w; if (!s.status.rendered) { return f.fn.qtip.log.error.call(s, 2, f.fn.qtip.constants.TOOLTIP_NOT_RENDERED, "updateContent") } else { if (!A) { return f.fn.qtip.log.error.call(s, 2, f.fn.qtip.constants.NO_CONTENT_PROVIDED, "updateContent") } } z = s.beforeContentUpdate.call(s, A); if (typeof z == "string") { A = z } else { if (z === false) { return } } if (f.browser.msie) { s.elements.contentWrapper.children().css({ zoom: "normal" }) } if (A.jquery && A.length > 0) { A.clone(true).appendTo(s.elements.content).show() } else { s.elements.content.html(A) } x = s.elements.content.find("img[complete=false]"); if (x.length > 0) { w = 0; x.each(function (C) { f('<img src="' + f(this).attr("src") + '" />').load(function () { if (++w == x.length) { B() } }) }) } else { B() } function B() { s.updateWidth(); if (y !== false) { if (s.options.position.type !== "static") { s.updatePosition(s.elements.tooltip.is(":visible"), true) } if (s.options.style.tip.corner !== false) { n.call(s) } } } s.onContentUpdate.call(s); return f.fn.qtip.log.error.call(s, 1, f.fn.qtip.constants.EVENT_CONTENT_UPDATED, "loadContent") }, loadContent: function (w, z, A) { var y; if (!s.status.rendered) { return f.fn.qtip.log.error.call(s, 2, f.fn.qtip.constants.TOOLTIP_NOT_RENDERED, "loadContent") } y = s.beforeContentLoad.call(s); if (y === false) { return s } if (A == "post") { f.post(w, z, x) } else { f.get(w, z, x) } function x(B) { s.onContentLoad.call(s); f.fn.qtip.log.error.call(s, 1, f.fn.qtip.constants.EVENT_CONTENT_LOADED, "loadContent"); s.updateContent(B) } return s }, updateTitle: function (w) { if (!s.status.rendered) { return f.fn.qtip.log.error.call(s, 2, f.fn.qtip.constants.TOOLTIP_NOT_RENDERED, "updateTitle") } else { if (!w) { return f.fn.qtip.log.error.call(s, 2, f.fn.qtip.constants.NO_CONTENT_PROVIDED, "updateTitle") } } returned = s.beforeTitleUpdate.call(s); if (returned === false) { return s } if (s.elements.button) { s.elements.button = s.elements.button.clone(true) } s.elements.title.html(w); if (s.elements.button) { s.elements.title.prepend(s.elements.button) } s.onTitleUpdate.call(s); return f.fn.qtip.log.error.call(s, 1, f.fn.qtip.constants.EVENT_TITLE_UPDATED, "updateTitle") }, focus: function (A) { var y, x, w, z; if (!s.status.rendered) { return f.fn.qtip.log.error.call(s, 2, f.fn.qtip.constants.TOOLTIP_NOT_RENDERED, "focus") } else { if (s.options.position.type == "static") { return f.fn.qtip.log.error.call(s, 1, f.fn.qtip.constants.CANNOT_FOCUS_STATIC, "focus") } } y = parseInt(s.elements.tooltip.css("z-index")); x = 6000 + f("div.qtip[qtip]").length - 1; if (!s.status.focused && y !== x) { z = s.beforeFocus.call(s, A); if (z === false) { return s } f("div.qtip[qtip]").not(s.elements.tooltip).each(function () { if (f(this).qtip("api").status.rendered === true) { w = parseInt(f(this).css("z-index")); if (typeof w == "number" && w > -1) { f(this).css({ zIndex: parseInt(f(this).css("z-index")) - 1 }) } f(this).qtip("api").status.focused = false } }); s.elements.tooltip.css({ zIndex: x }); s.status.focused = true; s.onFocus.call(s, A); f.fn.qtip.log.error.call(s, 1, f.fn.qtip.constants.EVENT_FOCUSED, "focus") } return s }, disable: function (w) { if (!s.status.rendered) { return f.fn.qtip.log.error.call(s, 2, f.fn.qtip.constants.TOOLTIP_NOT_RENDERED, "disable") } if (w) { if (!s.status.disabled) { s.status.disabled = true; f.fn.qtip.log.error.call(s, 1, f.fn.qtip.constants.EVENT_DISABLED, "disable") } else { f.fn.qtip.log.error.call(s, 1, f.fn.qtip.constants.TOOLTIP_ALREADY_DISABLED, "disable") } } else { if (s.status.disabled) { s.status.disabled = false; f.fn.qtip.log.error.call(s, 1, f.fn.qtip.constants.EVENT_ENABLED, "disable") } else { f.fn.qtip.log.error.call(s, 1, f.fn.qtip.constants.TOOLTIP_ALREADY_ENABLED, "disable") } } return s }, destroy: function () { var w, x, y; x = s.beforeDestroy.call(s); if (x === false) { return s } if (s.status.rendered) { s.options.show.when.target.unbind("mousemove.qtip", s.updatePosition); s.options.show.when.target.unbind("mouseout.qtip", s.hide); s.options.show.when.target.unbind(s.options.show.when.event + ".qtip"); s.options.hide.when.target.unbind(s.options.hide.when.event + ".qtip"); s.elements.tooltip.unbind(s.options.hide.when.event + ".qtip"); s.elements.tooltip.unbind("mouseover.qtip", s.focus); s.elements.tooltip.remove() } else { s.options.show.when.target.unbind(s.options.show.when.event + ".qtip-create") } if (typeof s.elements.target.data("qtip") == "object") { y = s.elements.target.data("qtip").interfaces; if (typeof y == "object" && y.length > 0) { for (w = 0; w < y.length - 1; w++) { if (y[w].id == s.id) { y.splice(w, 1) } } } } delete f.fn.qtip.interfaces[s.id]; if (typeof y == "object" && y.length > 0) { s.elements.target.data("qtip").current = y.length - 1 } else { s.elements.target.removeData("qtip") } s.onDestroy.call(s); f.fn.qtip.log.error.call(s, 1, f.fn.qtip.constants.EVENT_DESTROYED, "destroy"); return s.elements.target }, getPosition: function () { var w, x; if (!s.status.rendered) { return f.fn.qtip.log.error.call(s, 2, f.fn.qtip.constants.TOOLTIP_NOT_RENDERED, "getPosition") } w = (s.elements.tooltip.css("display") !== "none") ? false : true; if (w) { s.elements.tooltip.css({ visiblity: "hidden" }).show() } x = s.elements.tooltip.offset(); if (w) { s.elements.tooltip.css({ visiblity: "visible" }).hide() } return x }, getDimensions: function () { var w, x; if (!s.status.rendered) { return f.fn.qtip.log.error.call(s, 2, f.fn.qtip.constants.TOOLTIP_NOT_RENDERED, "getDimensions") } w = (!s.elements.tooltip.is(":visible")) ? true : false; if (w) { s.elements.tooltip.css({ visiblity: "hidden" }).show() } x = { height: s.elements.tooltip.outerHeight(), width: s.elements.tooltip.outerWidth() }; if (w) { s.elements.tooltip.css({ visiblity: "visible" }).hide() } return x } }) } function p() { var s, w, u, t, v, y, x; s = this; s.beforeRender.call(s); s.status.rendered = true; s.elements.tooltip = '<div qtip="' + s.id + '" class="qtip ' + (s.options.style.classes.tooltip || s.options.style) + '"style="display:none; -moz-border-radius:0; -webkit-border-radius:0; border-radius:0;position:' + s.options.position.type + ';">  <div class="qtip-wrapper" style="position:relative; overflow:hidden; text-align:left;">    <div class="qtip-contentWrapper" style="overflow:hidden;">       <div class="qtip-content ' + s.options.style.classes.content + '"></div></div></div></div>'; s.elements.tooltip = f(s.elements.tooltip); s.elements.tooltip.appendTo(s.options.position.container); s.elements.tooltip.data("qtip", { current: 0, interfaces: [s] }); s.elements.wrapper = s.elements.tooltip.children("div:first"); s.elements.contentWrapper = s.elements.wrapper.children("div:first").css({ background: s.options.style.background }); s.elements.content = s.elements.contentWrapper.children("div:first").css(q(s.options.style)); if (f.browser.msie) { s.elements.wrapper.add(s.elements.content).css({ zoom: 1 }) } if (s.options.hide.when.event == "unfocus") { s.elements.tooltip.attr("unfocus", true) } if (typeof s.options.style.width.value == "number") { s.updateWidth() } if (f("<canvas>").get(0).getContext || f.browser.msie) { if (s.options.style.border.radius > 0) { m.call(s) } else { s.elements.contentWrapper.css({ border: s.options.style.border.width + "px solid " + s.options.style.border.color }) } if (s.options.style.tip.corner !== false) { e.call(s) } } else { s.elements.contentWrapper.css({ border: s.options.style.border.width + "px solid " + s.options.style.border.color }); s.options.style.border.radius = 0; s.options.style.tip.corner = false; f.fn.qtip.log.error.call(s, 2, f.fn.qtip.constants.CANVAS_VML_NOT_SUPPORTED, "render") } if ((typeof s.options.content.text == "string" && s.options.content.text.length > 0) || (s.options.content.text.jquery && s.options.content.text.length > 0)) { u = s.options.content.text } else { if (typeof s.elements.target.attr("title") == "string" && s.elements.target.attr("title").length > 0) { u = s.elements.target.attr("title").replace("\\n", "<br />"); s.elements.target.attr("title", "") } else { if (typeof s.elements.target.attr("alt") == "string" && s.elements.target.attr("alt").length > 0) { u = s.elements.target.attr("alt").replace("\\n", "<br />"); s.elements.target.attr("alt", "") } else { u = " "; f.fn.qtip.log.error.call(s, 1, f.fn.qtip.constants.NO_VALID_CONTENT, "render") } } } if (s.options.content.title.text !== false) { j.call(s) } s.updateContent(u); l.call(s); if (s.options.show.ready === true) { s.show() } if (s.options.content.url !== false) { t = s.options.content.url; v = s.options.content.data; y = s.options.content.method || "get"; s.loadContent(t, v, y) } s.onRender.call(s); f.fn.qtip.log.error.call(s, 1, f.fn.qtip.constants.EVENT_RENDERED, "render") } function m() { var F, z, t, B, x, E, u, G, D, y, w, C, A, s, v; F = this; F.elements.wrapper.find(".qtip-borderBottom, .qtip-borderTop").remove(); t = F.options.style.border.width; B = F.options.style.border.radius; x = F.options.style.border.color || F.options.style.tip.color; E = g(B); u = {}; for (z in E) { u[z] = '<div rel="' + z + '" style="' + ((z.search(/Left/) !== -1) ? "left" : "right") + ":0; position:absolute; height:" + B + "px; width:" + B + 'px; overflow:hidden; line-height:0.1px; font-size:1px">'; if (f("<canvas>").get(0).getContext) { u[z] += '<canvas height="' + B + '" width="' + B + '" style="vertical-align: top"></canvas>' } else { if (f.browser.msie) { G = B * 2 + 3; u[z] += '<v:arc stroked="false" fillcolor="' + x + '" startangle="' + E[z][0] + '" endangle="' + E[z][1] + '" style="width:' + G + "px; height:" + G + "px; margin-top:" + ((z.search(/bottom/) !== -1) ? -2 : -1) + "px; margin-left:" + ((z.search(/Right/) !== -1) ? E[z][2] - 3.5 : -1) + 'px; vertical-align:top; display:inline-block; behavior:url(#default#VML)"></v:arc>' } } u[z] += "</div>" } D = F.getDimensions().width - (Math.max(t, B) * 2); y = '<div class="qtip-betweenCorners" style="height:' + B + "px; width:" + D + "px; overflow:hidden; background-color:" + x + '; line-height:0.1px; font-size:1px;">'; w = '<div class="qtip-borderTop" dir="ltr" style="height:' + B + "px; margin-left:" + B + 'px; line-height:0.1px; font-size:1px; padding:0;">' + u.topLeft + u.topRight + y; F.elements.wrapper.prepend(w); C = '<div class="qtip-borderBottom" dir="ltr" style="height:' + B + "px; margin-left:" + B + 'px; line-height:0.1px; font-size:1px; padding:0;">' + u.bottomLeft + u.bottomRight + y; F.elements.wrapper.append(C); if (f("<canvas>").get(0).getContext) { F.elements.wrapper.find("canvas").each(function () { A = E[f(this).parent("[rel]:first").attr("rel")]; r.call(F, f(this), A, B, x) }) } else { if (f.browser.msie) { F.elements.tooltip.append('<v:image style="behavior:url(#default#VML);"></v:image>') } } s = Math.max(B, (B + (t - B))); v = Math.max(t - B, 0); F.elements.contentWrapper.css({ border: "0px solid " + x, borderWidth: v + "px " + s + "px" }) } function r(u, w, s, t) { var v = u.get(0).getContext("2d"); v.fillStyle = t; v.beginPath(); v.arc(w[0], w[1], s, 0, Math.PI * 2, false); v.fill() } function e(v) { var t, s, x, u, w; t = this; if (t.elements.tip !== null) { t.elements.tip.remove() } s = t.options.style.tip.color || t.options.style.border.color; if (t.options.style.tip.corner === false) { return } else { if (!v) { v = t.options.style.tip.corner } } x = b(v, t.options.style.tip.size.width, t.options.style.tip.size.height); t.elements.tip = '<div class="' + t.options.style.classes.tip + '" dir="ltr" rel="' + v + '" style="position:absolute; height:' + t.options.style.tip.size.height + "px; width:" + t.options.style.tip.size.width + 'px; margin:0 auto; line-height:0.1px; font-size:1px;">'; if (f("<canvas>").get(0).getContext) { t.elements.tip += '<canvas height="' + t.options.style.tip.size.height + '" width="' + t.options.style.tip.size.width + '"></canvas>' } else { if (f.browser.msie) { u = t.options.style.tip.size.width + "," + t.options.style.tip.size.height; w = "m" + x[0][0] + "," + x[0][1]; w += " l" + x[1][0] + "," + x[1][1]; w += " " + x[2][0] + "," + x[2][1]; w += " xe"; t.elements.tip += '<v:shape fillcolor="' + s + '" stroked="false" filled="true" path="' + w + '" coordsize="' + u + '" style="width:' + t.options.style.tip.size.width + "px; height:" + t.options.style.tip.size.height + "px; line-height:0.1px; display:inline-block; behavior:url(#default#VML); vertical-align:" + ((v.search(/top/) !== -1) ? "bottom" : "top") + '"></v:shape>'; t.elements.tip += '<v:image style="behavior:url(#default#VML);"></v:image>'; t.elements.contentWrapper.css("position", "relative") } } t.elements.tooltip.prepend(t.elements.tip + "</div>"); t.elements.tip = t.elements.tooltip.find("." + t.options.style.classes.tip).eq(0); if (f("<canvas>").get(0).getContext) { h.call(t, t.elements.tip.find("canvas:first"), x, s) } if (v.search(/top/) !== -1 && f.browser.msie && parseInt(f.browser.version.charAt(0)) === 6) { t.elements.tip.css({ marginTop: -4 }) } n.call(t, v) } function h(t, v, s) { var u = t.get(0).getContext("2d"); u.fillStyle = s; u.beginPath(); u.moveTo(v[0][0], v[0][1]); u.lineTo(v[1][0], v[1][1]); u.lineTo(v[2][0], v[2][1]); u.fill() } function n(u) { var t, w, s, x, v; t = this; if (t.options.style.tip.corner === false || !t.elements.tip) { return } if (!u) { u = t.elements.tip.attr("rel") } w = positionAdjust = (f.browser.msie) ? 1 : 0; t.elements.tip.css(u.match(/left|right|top|bottom/)[0], 0); if (u.search(/top|bottom/) !== -1) { if (f.browser.msie) { if (parseInt(f.browser.version.charAt(0)) === 6) { positionAdjust = (u.search(/top/) !== -1) ? -3 : 1 } else { positionAdjust = (u.search(/top/) !== -1) ? 1 : 2 } } if (u.search(/Middle/) !== -1) { t.elements.tip.css({ left: "50%", marginLeft: -(t.options.style.tip.size.width / 2) }) } else { if (u.search(/Left/) !== -1) { t.elements.tip.css({ left: t.options.style.border.radius - w }) } else { if (u.search(/Right/) !== -1) { t.elements.tip.css({ right: t.options.style.border.radius + w }) } } } if (u.search(/top/) !== -1) { t.elements.tip.css({ top: -positionAdjust }) } else { t.elements.tip.css({ bottom: positionAdjust }) } } else { if (u.search(/left|right/) !== -1) { if (f.browser.msie) { positionAdjust = (parseInt(f.browser.version.charAt(0)) === 6) ? 1 : ((u.search(/left/) !== -1) ? 1 : 2) } if (u.search(/Middle/) !== -1) { t.elements.tip.css({ top: "50%", marginTop: -(t.options.style.tip.size.height / 2) }) } else { if (u.search(/Top/) !== -1) { t.elements.tip.css({ top: t.options.style.border.radius - w }) } else { if (u.search(/Bottom/) !== -1) { t.elements.tip.css({ bottom: t.options.style.border.radius + w }) } } } if (u.search(/left/) !== -1) { t.elements.tip.css({ left: -positionAdjust }) } else { t.elements.tip.css({ right: positionAdjust }) } } } s = "padding-" + u.match(/left|right|top|bottom/)[0]; x = t.options.style.tip.size[(s.search(/left|right/) !== -1) ? "width" : "height"]; t.elements.tooltip.css("padding", 0); t.elements.tooltip.css(s, x); if (f.browser.msie && parseInt(f.browser.version.charAt(0)) == 6) { v = parseInt(t.elements.tip.css("margin-top")) || 0; v += parseInt(t.elements.content.css("margin-top")) || 0; t.elements.tip.css({ marginTop: v }) } } function j() { var s = this; if (s.elements.title !== null) { s.elements.title.remove() } s.elements.title = f('<div class="' + s.options.style.classes.title + '">').css(q(s.options.style.title, true)).css({ zoom: (f.browser.msie) ? 1 : 0 }).prependTo(s.elements.contentWrapper); if (s.options.content.title.text) { s.updateTitle.call(s, s.options.content.title.text) } if (s.options.content.title.button !== false && typeof s.options.content.title.button == "string") { s.elements.button = f('<a class="' + s.options.style.classes.button + '" style="float:right; position: relative"></a>').css(q(s.options.style.button, true)).html(s.options.content.title.button).prependTo(s.elements.title).click(function (t) { if (!s.status.disabled) { s.hide(t) } }) } } function l() { var t, v, u, s; t = this; v = t.options.show.when.target; u = t.options.hide.when.target; if (t.options.hide.fixed) { u = u.add(t.elements.tooltip) } if (t.options.hide.when.event == "inactive") { s = ["click", "dblclick", "mousedown", "mouseup", "mousemove", "mouseout", "mouseenter", "mouseleave", "mouseover"]; function y(z) { if (t.status.disabled === true) { return } clearTimeout(t.timers.inactive); t.timers.inactive = setTimeout(function () { f(s).each(function () { u.unbind(this + ".qtip-inactive"); t.elements.content.unbind(this + ".qtip-inactive") }); t.hide(z) }, t.options.hide.delay) } } else { if (t.options.hide.fixed === true) { t.elements.tooltip.bind("mouseover.qtip", function () { if (t.status.disabled === true) { return } clearTimeout(t.timers.hide) }) } } function x(z) { if (t.status.disabled === true) { return } if (t.options.hide.when.event == "inactive") { f(s).each(function () { u.bind(this + ".qtip-inactive", y); t.elements.content.bind(this + ".qtip-inactive", y) }); y() } clearTimeout(t.timers.show); clearTimeout(t.timers.hide); t.timers.show = setTimeout(function () { t.show(z) }, t.options.show.delay) } function w(z) { if (t.status.disabled === true) { return } if (t.options.hide.fixed === true && t.options.hide.when.event.search(/mouse(out|leave)/i) !== -1 && f(z.relatedTarget).parents("div.qtip[qtip]").length > 0) { z.stopPropagation(); z.preventDefault(); clearTimeout(t.timers.hide); return false } clearTimeout(t.timers.show); clearTimeout(t.timers.hide); t.elements.tooltip.stop(true, true); t.timers.hide = setTimeout(function () { t.hide(z) }, t.options.hide.delay) } if ((t.options.show.when.target.add(t.options.hide.when.target).length === 1 && t.options.show.when.event == t.options.hide.when.event && t.options.hide.when.event !== "inactive") || t.options.hide.when.event == "unfocus") { t.cache.toggle = 0; v.bind(t.options.show.when.event + ".qtip", function (z) { if (t.cache.toggle == 0) { x(z) } else { w(z) } }) } else { v.bind(t.options.show.when.event + ".qtip", x); if (t.options.hide.when.event !== "inactive") { u.bind(t.options.hide.when.event + ".qtip", w) } } if (t.options.position.type.search(/(fixed|absolute)/) !== -1) { t.elements.tooltip.bind("mouseover.qtip", t.focus) } if (t.options.position.target === "mouse" && t.options.position.type !== "static") { v.bind("mousemove.qtip", function (z) { t.cache.mouse = { x: z.pageX, y: z.pageY }; if (t.status.disabled === false && t.options.position.adjust.mouse === true && t.options.position.type !== "static" && t.elements.tooltip.css("display") !== "none") { t.updatePosition(z) } }) } } function o(u, v, A) { var z, s, x, y, t, w; z = this; if (A.corner == "center") { return v.position } s = f.extend({}, u); y = { x: false, y: false }; t = { left: (s.left < f.fn.qtip.cache.screen.scroll.left), right: (s.left + A.dimensions.width + 2 >= f.fn.qtip.cache.screen.width + f.fn.qtip.cache.screen.scroll.left), top: (s.top < f.fn.qtip.cache.screen.scroll.top), bottom: (s.top + A.dimensions.height + 2 >= f.fn.qtip.cache.screen.height + f.fn.qtip.cache.screen.scroll.top) }; x = { left: (t.left && (A.corner.search(/right/i) != -1 || (A.corner.search(/right/i) == -1 && !t.right))), right: (t.right && (A.corner.search(/left/i) != -1 || (A.corner.search(/left/i) == -1 && !t.left))), top: (t.top && A.corner.search(/top/i) == -1), bottom: (t.bottom && A.corner.search(/bottom/i) == -1) }; if (x.left) { if (z.options.position.target !== "mouse") { s.left = v.position.left + v.dimensions.width } else { s.left = z.cache.mouse.x } y.x = "Left" } else { if (x.right) { if (z.options.position.target !== "mouse") { s.left = v.position.left - A.dimensions.width } else { s.left = z.cache.mouse.x - A.dimensions.width } y.x = "Right" } } if (x.top) { if (z.options.position.target !== "mouse") { s.top = v.position.top + v.dimensions.height } else { s.top = z.cache.mouse.y } y.y = "top" } else { if (x.bottom) { if (z.options.position.target !== "mouse") { s.top = v.position.top - A.dimensions.height } else { s.top = z.cache.mouse.y - A.dimensions.height } y.y = "bottom" } } if (s.left < 0) { s.left = u.left; y.x = false } if (s.top < 0) { s.top = u.top; y.y = false } if (z.options.style.tip.corner !== false) { s.corner = new String(A.corner); if (y.x !== false) { s.corner = s.corner.replace(/Left|Right|Middle/, y.x) } if (y.y !== false) { s.corner = s.corner.replace(/top|bottom/, y.y) } if (s.corner !== z.elements.tip.attr("rel")) { e.call(z, s.corner) } } return s } function q(u, t) { var v, s; v = f.extend(true, {}, u); for (s in v) { if (t === true && s.search(/(tip|classes)/i) !== -1) { delete v[s] } else { if (!t && s.search(/(width|border|tip|title|classes|user)/i) !== -1) { delete v[s] } } } return v } function c(s) { if (typeof s.tip !== "object") { s.tip = { corner: s.tip} } if (typeof s.tip.size !== "object") { s.tip.size = { width: s.tip.size, height: s.tip.size} } if (typeof s.border !== "object") { s.border = { width: s.border} } if (typeof s.width !== "object") { s.width = { value: s.width} } if (typeof s.width.max == "string") { s.width.max = parseInt(s.width.max.replace(/([0-9]+)/i, "$1")) } if (typeof s.width.min == "string") { s.width.min = parseInt(s.width.min.replace(/([0-9]+)/i, "$1")) } if (typeof s.tip.size.x == "number") { s.tip.size.width = s.tip.size.x; delete s.tip.size.x } if (typeof s.tip.size.y == "number") { s.tip.size.height = s.tip.size.y; delete s.tip.size.y } return s } function a() { var s, t, u, x, v, w; s = this; u = [true, {}]; for (t = 0; t < arguments.length; t++) { u.push(arguments[t]) } x = [f.extend.apply(f, u)]; while (typeof x[0].name == "string") { x.unshift(c(f.fn.qtip.styles[x[0].name])) } x.unshift(true, { classes: { tooltip: "qtip-" + (arguments[0].name || "defaults")} }, f.fn.qtip.styles.defaults); v = f.extend.apply(f, x); w = (f.browser.msie) ? 1 : 0; v.tip.size.width += w; v.tip.size.height += w; if (v.tip.size.width % 2 > 0) { v.tip.size.width += 1 } if (v.tip.size.height % 2 > 0) { v.tip.size.height += 1 } if (v.tip.corner === true) { v.tip.corner = (s.options.position.corner.tooltip === "center") ? false : s.options.position.corner.tooltip } return v } function b(v, u, t) { var s = { bottomRight: [[0, 0], [u, t], [u, 0]], bottomLeft: [[0, 0], [u, 0], [0, t]], topRight: [[0, t], [u, 0], [u, t]], topLeft: [[0, 0], [0, t], [u, t]], topMiddle: [[0, t], [u / 2, 0], [u, t]], bottomMiddle: [[0, 0], [u, 0], [u / 2, t]], rightMiddle: [[0, 0], [u, t / 2], [0, t]], leftMiddle: [[u, 0], [u, t], [0, t / 2]] }; s.leftTop = s.bottomRight; s.rightTop = s.bottomLeft; s.leftBottom = s.topRight; s.rightBottom = s.topLeft; return s[v] } function g(s) { var t; if (f("<canvas>").get(0).getContext) { t = { topLeft: [s, s], topRight: [0, s], bottomLeft: [s, 0], bottomRight: [0, 0]} } else { if (f.browser.msie) { t = { topLeft: [-90, 90, 0], topRight: [-90, 90, -s], bottomLeft: [90, 270, 0], bottomRight: [90, 270, -s]} } } return t } function k() { var s, t, u; s = this; u = s.getDimensions(); t = '<iframe class="qtip-bgiframe" frameborder="0" tabindex="-1" src="javascript:false" style="display:block; position:absolute; z-index:-1; filter:alpha(opacity=\'0\'); border: 1px solid red; height:' + u.height + "px; width:" + u.width + 'px" />'; s.elements.bgiframe = s.elements.wrapper.prepend(t).children(".qtip-bgiframe:first") } f(document).ready(function () { f.fn.qtip.cache = { screen: { scroll: { left: f(window).scrollLeft(), top: f(window).scrollTop() }, width: f(window).width(), height: f(window).height()} }; var s; f(window).bind("resize scroll", function (t) { clearTimeout(s); s = setTimeout(function () { if (t.type === "scroll") { f.fn.qtip.cache.screen.scroll = { left: f(window).scrollLeft(), top: f(window).scrollTop()} } else { f.fn.qtip.cache.screen.width = f(window).width(); f.fn.qtip.cache.screen.height = f(window).height() } for (i = 0; i < f.fn.qtip.interfaces.length; i++) { var u = f.fn.qtip.interfaces[i]; if (u.status.rendered === true && (u.options.position.type !== "static" || u.options.position.adjust.scroll && t.type === "scroll" || u.options.position.adjust.resize && t.type === "resize")) { u.updatePosition(t, true) } } }, 100) }); f(document).bind("mousedown.qtip", function (t) { if (f(t.target).parents("div.qtip").length === 0) { f(".qtip[unfocus]").each(function () { var u = f(this).qtip("api"); if (f(this).is(":visible") && !u.status.disabled && f(t.target).add(u.elements.target).length > 1) { u.hide(t) } }) } }) }); f.fn.qtip.interfaces = []; f.fn.qtip.log = { error: function () { return this } }; f.fn.qtip.constants = {}; f.fn.qtip.defaults = { content: { prerender: false, text: false, url: false, data: null, title: { text: false, button: false} }, position: { target: false, corner: { target: "bottomRight", tooltip: "topLeft" }, adjust: { x: 0, y: 0, mouse: true, screen: false, scroll: true, resize: true }, type: "absolute", container: false }, show: { when: { target: false, event: "mouseover" }, effect: { type: "fade", length: 100 }, delay: 140, solo: false, ready: false }, hide: { when: { target: false, event: "mouseout" }, effect: { type: "fade", length: 100 }, delay: 0, fixed: false }, api: { beforeRender: function () { }, onRender: function () { }, beforePositionUpdate: function () { }, onPositionUpdate: function () { }, beforeShow: function () { }, onShow: function () { }, beforeHide: function () { }, onHide: function () { }, beforeContentUpdate: function () { }, onContentUpdate: function () { }, beforeContentLoad: function () { }, onContentLoad: function () { }, beforeTitleUpdate: function () { }, onTitleUpdate: function () { }, beforeDestroy: function () { }, onDestroy: function () { }, beforeFocus: function () { }, onFocus: function () { } } }; f.fn.qtip.styles = { defaults: { background: "white", color: "#111", overflow: "hidden", textAlign: "left", width: { min: 0, max: 250 }, padding: "5px 9px", border: { width: 1, radius: 0, color: "#d3d3d3" }, tip: { corner: false, color: false, size: { width: 13, height: 13 }, opacity: 1 }, title: { background: "#e1e1e1", fontWeight: "bold", padding: "7px 12px" }, button: { cursor: "pointer" }, classes: { target: "", tip: "qtip-tip", title: "qtip-title", button: "qtip-button", content: "qtip-content", active: "qtip-active"} }, cream: { border: { width: 3, radius: 0, color: "#F9E98E" }, title: { background: "#F0DE7D", color: "#A27D35" }, background: "#FBF7AA", color: "#A27D35", classes: { tooltip: "qtip-cream"} }, light: { border: { width: 3, radius: 0, color: "#E2E2E2" }, title: { background: "#f1f1f1", color: "#454545" }, background: "white", color: "#454545", classes: { tooltip: "qtip-light"} }, dark: { border: { width: 3, radius: 0, color: "#303030" }, title: { background: "#404040", color: "#f3f3f3" }, background: "#505050", color: "#f3f3f3", classes: { tooltip: "qtip-dark"} }, red: { border: { width: 3, radius: 0, color: "#CE6F6F" }, title: { background: "#f28279", color: "#9C2F2F" }, background: "#F79992", color: "#9C2F2F", classes: { tooltip: "qtip-red"} }, green: { border: { width: 3, radius: 0, color: "#A9DB66" }, title: { background: "#b9db8c", color: "#58792E" }, background: "#CDE6AC", color: "#58792E", classes: { tooltip: "qtip-green"} }, blue: { border: { width: 3, radius: 0, color: "#ADD9ED" }, title: { background: "#D0E9F5", color: "#5E99BD" }, background: "#E5F6FE", color: "#4D9FBF", classes: { tooltip: "qtip-blue"}}} })(jQuery);

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

            // Determine start position.
            var startLeft, startTop;
            if (_menus[id].openBelowContext) {
                var contextOffset = $(this).offset();
                startLeft = contextOffset.left;
                startTop = contextOffset.top + $(this).outerHeight();
            }
            else {
                startLeft = e.pageX;
                startTop = e.pageY;
            }
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
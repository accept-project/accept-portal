/********************************************************************************************************************************************/
//
//  Accept Project - POST-EDIT Plugin v1.0.0
//    
//
/********************************************************************************************************************************************/

(function ($) {

    $.fn.AcceptPostEdit = function (options) {
        /* START Global Variables */

        debugger
        //var postEditTargetObject = $(this);
        //var postEditTargetObjectId = $(this).attr('id');

        var thisObject = $(this);

        //Labels
        var labelCloseDialog = 'Save For Later';
        var labelGuideLines = 'Guidelines';
        var labelUserAllSelected = 'Complete Task';

        $.labelEmptySegment = "[...]";

        $.labelEdit = "Edit";
        $.labelHelp = "Help";
        $.labelPreEditTitle = "Check Spelling, Grammar and Style";
        $.labelClickOntextToEdit = "Click on text to Edit:";

        $.htmlDialogHelp = '<p>This window has two parts: on the left hand-side, you can find a machine-translated text, which contains multiple sentences. Each of these sentences may be improved with your edits.</p><p>On the right hand-side, the “Current sentence to edit” box allows you to edit a machine-translated sentence, by following the guidelines that are made available to you via the “Guidelines” button. There are three buttons below the Edit box: an Undo button, a Redo button, and a spelling and grammar check button.</p> <p> These buttons will have an impact on the sentence that you are currently editing.For each sentence, you are free to add comments in the “Comments” box, but this is purely optional! And do not worry about saving your changes or comments, this happens automatically!You can navigate from one sentence to another in two ways: you can either click on any sentence on the left hand-side or use the “Prev” and “Next” sentence to move one sentence at a time.</p><p>If you would like to take a break, click “Save for Later” so that you can continue your activity the next time you open the task. When you no longer have any edits or comments to make, click “Complete Task”. If you encounter any problem, contact your project administrator.</p>';
        $.labelPrev = "Prev";
        $.labelNext = "Next";

        $.labelGuidelinesTitle = "Guidelines";

        $.htmlBilingualGuidelines = '<h4>Guidelines for <span id="guideLinesTranslationType_" >Bilingual</span> post‐editing:</h4>' +
        '<p> - Aim for semantically correct translation.</p>' +
        '<p> - Ensure that no information has been accidentally added or omitted.</p>' +
        '<p> - If words, phrases, or punctuation in the text are completely acceptable, try to use them (unmodified) rather than substituting them with something new and different.</p>';

        //        $.htmlGuidelinesMonolingual = '<h4>Guidelines for <span id="guideLinesTranslationType_" >Monolingual</span> post‐editing:</h4>' +
        //        '<p> -Try and edit the text by making it more fluent and clearer based on how you interpret its meaning.</p>' +
        //        '<p> - For example, try to rectify word order and spelling when they are inappropriate to the extent that the text has become impossible or difficult to comprehend.</p>' +
        //        '<p> - If words, phrases, or punctuation in the text are completely acceptable, try and use them (unmodified) rather than substituting them with something new and different.</p>';

        $.htmlGuidelinesMonolingual = '<h4>Guidelines for <span id="guideLinesTranslationType_" >Monolingual</span> post‐editing:</h4>' +
        '<p> - Edit the text by making it more fluent and clearer based on your interpretation.</p>' +
        '<p> - For example, try to rectify word order and spelling if they affect the text to the extent that it is difficult or impossible to be understood.</p>' +
        '<p> - Use words, phrases, or punctuation unmodified if they are acceptable.</p>' +
        '<p> - If editing with reference to the source text, ensure that no information has been added or omitted.</p>';

        $.labelQuickQuestionTitle = "Quick Question";
        $.labelConfirmationNeeded = "Confirmation needed";
        $.labelConfirmationText = "This action will finish your edition, are you sure?";
        $.labelQuickAnswerDone = "Done";
        $.labelConfirmationYes = "Yes";
        $.labelConfirmationNo = "No";
        $.labelCurrentSentenceToEdit = "Current sentence to edit:";
        $.labelTargetTextTitle = "Target Text";
        $.labelSourceTextTitle = "Source Text";
        $.labelComments = "Comments ?";
        $.labelCommentsTitle = "Comments";
        $.labelOriginalSentence = "Original sentence:";
        $.userBrowser = null;
        $.AcceptTinyMceEditor = null;

        var settings = $.extend({
            'dialogHeight': 320,
            'dialogWidth': 480,
            'imagesPath': '../../Content/postEdit/images',
            'presentationFormat': 'TEXT',
            'acceptServerPath': '',
            'textIdContainer': '',
            'userIdSelector': '',
            'userIdContainer': '',
            'addPreEditPlugin': false,
            'preEditApiKey': 'f3ebbb920a694f0aa04a898b48f0c833', //'preEditApiKey': 'c4c1707beb5147f7a5ca5651539bcf0c',
            'preEditImagesPath': 'http://www.accept-portal.eu/Plugin/v1.0.1/css/images',
            'preEditServerPath': 'http://www.accept-portal.eu/AcceptApi/Api/v1',
            'preEditWidth': 400,
            'preEditHeight': 300,
            'preEditRequestFormat': 'TEXT',
            'preEditLanguageUI': 'en',
            'preEditStyleSheetPath': 'http://www.accept-portal.eu/Plugin/v2.0/css',
            'leftPaneWidth': '320px',
            'leftPaneHeight': '400px',
            'leftPaneFontSize': '1.1em',
            'textAreasWidth': '400px',
            'textAreasHeight': '97px',
            'bottomPaneFontSize': '1em'
        }, options);

        //project configuration settings

        var contentObj = null;

        $.textId = "";
        $.currentUserId = "";
        $.jobId = "";
        $.tool = "ACCEPT Portal";
        $.tooldId = "0.9";

        $.targetLanguage = "";
        $.question = "";
        $.questionId = "";
        $.configurationId = "";
        $.processName = "bilingual";
        $.globalStartTime = null;
        $.globalEndTime = null;
        $.editOptions = [];

        $.displayTranslationOptions = true;
        $.customInterface = 0;
        $.lockCustomInterfacePhaseCreation = true;

        $.globalRevisionInitTime = null;
        //think phase
        $.globalThinkPhaseInitTime = null;

        $.labelShowSource = "Show Source";
        $.labelHideSource = "Hide Source";

        $.blockedDocumentMessage = "Document blocked.";
        $.isSingleRevision = false;
        $.projectMaxThreshold = "";

        $.messageDocBlock = "You have been working on this task for at least @timespan@ which was defined by your project administrator as the maximum amount of time a task could be locked for by a single user. Well done! <br /><br /> This task has now been claimed by another user. If you would like to contribute more, please wait for this user to be finished before opening the task again."
        $.messageDocBlockInitial = "Another user is already working on this task. If you still would like to contribute to this task, please try opening the task again later.";

        $.labelHours = "hours";
        $.labelSeconds = "seconds";
        $.labelMinutes = "minutes";

        $.lastBlockDate = null;


        var setUILanguage = function (lang) {
            if (lang == 'fr') {
                $.labelEdit = "Editer";
                $.labelHelp = "Aide";
                $.labelPreEditTitle = "Vérifier l'orthographe, la grammaire et le style";
                $.labelClickOntextToEdit = "Cliquez sur le texte à éditer:";

                $.htmlDialogHelp = '<p>Cette fenêtre comporte deux volets: sur la gauche se trouve la traduction automatique ' +
                'd\'un texte, qui contient une ou plusieurs phrases. Chacune de ces phrases peut être améliorée grâce à vos modifications.</p>' +
                '<p>Sur la droite se trouve la zone "Phrase en cours à éditer" qui vous permet d\' éditer une phrase traduite de façon automatique, en suivant les consignes disponibles en cliquant sur le bouton "Consignes". ' +
                'Il y a trois boutons sous la zone d\'édition: un bouton "Annuler", un bouton "Rétablir", et un bouton de correction d\'orthographe et de grammaire.</p>' +
                '<p> Ces boutons affectent la phrase en cours d\'édition. Pour chaque phrase, vous pouvez, si vous le souhaitez, ' +
                'laisser des commentaires dans la zone "Commentaires". Et ne vous inquiétez pas pour l\'enregistrement de vos changements ou commentaires, cela se fait automatiquement! ' +
                'Vous pouvez passer d\'une phrase à une autre de deux façons: soit en cliquant sur n\'importe quelle phrase sur la gauche de la fenêtre, soit en utilisant "Préc" ou "Suiv" pour avancer phrase par phrase.</p>' +
                '<p>Si vous souhaitez faire une pause, cliquez sur "Enregistrer pour plus tard" afin de reprendre votre activité lorsque vous ré-ouvrerez la tâche. Une fois vos changements ou commentaires terminés, cliquez sur "Terminer la tâche". Si vous avez le moindre problème, contacter la personne en charge de ce projet.</p>';

                $.labelPrev = "Préc";
                $.labelNext = "Suiv";

                $.labelGuidelinesTitle = "Consignes";

                $.htmlBilingualGuidelines = '<h4>Consignes de post‐édition <span id="guideLinesTranslationType_" >bilingue</span>:</h4>' +
               '<p> - Essayez de fournir des traductions dont le sens est correct.</p>' +
               '<p> - Assurez-vous qu\'aucune information du texte source n\'ait été ajoutée ou enlevée par accident.</p>' +
               '<p> - Si certains mots, groupes de mots ou signes de ponctuation vous paraissent acceptables, essayez de les utiliser tels quels plutôt que de les remplacer avec de nouvelles tournures.</p>';

                $.labelQuickQuestionTitle = "Question";
                $.labelConfirmationNeeded = "Confirmation requise";
                $.labelConfirmationText = "Cette action va mettre fin à votre édition, êtes-vous sûr?";

                $.labelQuickAnswerDone = "Terminer";
                $.labelConfirmationYes = "Oui";
                $.labelConfirmationNo = "Non";

                $.labelCurrentSentenceToEdit = "Phrase en cours à éditer:";

                $.labelTargetTextTitle = "Texte cible";
                $.labelSourceTextTitle = "Texte source";

                $.labelComments = "Commentaires?";
                $.labelCommentsTitle = "Commentaires";

                $.htmlGuidelinesMonolingual = '<h4> Consignes de post‐édition <span id="guideLinesTranslationType_" >monolingue</span>:</h4>' +
			    '<p> -Essayez de modifier le texte afin de le rendre plus clair et naturel en fonction de votre interprétation de sa signification.</p>' +
				'<p> - Par exemple, essayer de corriger l\’ordre des mots ou l\’orthographe si ceux-ci posent des problèmes qui rendent le texte impossible ou difficile à comprendre.</p>' +
				'<p> - Si certains mots, groupes de mots ou signes de ponctuation vous paraissent acceptables, essayez de les utiliser tels quels plutôt que de les remplacer avec de nouvelles tournures.</p>';

                labelCloseDialog = 'Enregistrer pour plus tard';
                labelGuideLines = 'Consignes';
                labelUserAllSelected = 'Terminer la tâche';

                $.labelOriginalSentence = "Phrase source:";

                $.labelShowSource = "Afficher source";
                $.labelHideSource = "Cacher source";


                $.messageDocBlock = "Cela fait au moins @timespan@ que vous travaillez sur cette tâche, ce qui correspond au temps maximum imparti comme défini par l'administrateur de votre projet.  Félicitations! <br /><br /> Un autre utilisateur travaille maintenant sur cette tâche. Si vous souhaitez toutefois y contribuer de nouveau, veuillez attendre que cet utilisateur ait fini avant de rouvrir cette tâche."
                $.messageDocBlockInitial = "Un autre utilisateur est déjà en train de travailler sur cette tâche. Si vous souhaitez toutefois y contribuer, veuillez rouvrir cette tâche plus tard.";
                $.labelHours = "heures";
                $.labelMinutes = "minutes";
                $.labelSeconds = "secondes";


                $(".slider-button").css("line-height", "3")


            } else
                if (lang == 'de') {

                    $.labelEdit = "Bearbeiten";
                    $.labelHelp = "Hilfe";
                    $.labelPreEditTitle = "Rechtschreibung, Grammatik und Stil prüfen";
                    $.labelClickOntextToEdit = "Klicken Sie auf den Text um diesen zu bearbeiten:";

                    $.htmlDialogHelp = '<p>Dieses Fenster besteht aus zwei Teilen: Auf der linken Seite finden Sie den maschinell übersetzten Text, der mehrere Sätze beinhaltet. Jeder dieser Sätze kann durch eine Bearbeitung von Ihnen verbessert werden.</p><p>Das Textfeld “aktueller Satz zum Bearbeiten” auf der rechten Seite ermöglicht es Ihnen einen maschinell übersetzten Satz zu bearbeiten, indem Sie den Richtlinien folgen, die Sie über die “Richtlinien”-Schaltfläche erreichen können. Es gibt drei Schaltflächen unter dem Eingabefeld: eine Rückgängigschaltfläche, eine Wiederherstellenschaltfläche und eine Schaltfläche zur Rechtschreib- und Grammatikprüfung.</p> <p>Diese Schaltflächen werden den Satz beeinflussen, der aktuell bearbeitet wird. Sie können für jeden Satz Kommentare in dem “Kommentare”-Eingabefeld hinzufügen – ob Sie diese Funktion verwenden möchten, ist Ihnen völlig freigestellt.  Sie müssen sich nicht darum kümmern die Änderungen oder Ihre Kommentare zu speichern - das geschieht automatisch! Sie können auf zwei verschiedene Arten zwischen den Sätzen navigieren: Sie können entweder auf einen Satz auf der linken Seite klicken oder Sie können die “Zurück” und “Weiter” Schaltflächen verwenden um sich um jeweils einen Satz zu bewegen. </p><p>Falls Sie eine Pause machen möchten, klicken Sie auf “für später speichern”, sodas Sie die Aktivität wieder aufnehmen können, sobald Sie die Aufgabe das nächste Mal öffnen. Wenn Sie keine Bearbeitungen mehr vornehmen und keine Kommentare mehr schreiben wollen, klicken Sie auf “Aufgabe fertigstellen”. Sollte ein Problem auftreten, kontaktieren Sie bitte ihren Projekt-Administrator. </p>';
                    $.labelPrev = "Zurück";
                    $.labelNext = "Weiter";

                    //$.labelGuidelinesTitle = "Richtlinien";
                    $.labelGuidelinesTitle = "Tipps";
                    labelGuideLines = 'Tipps';

                    $.htmlBilingualGuidelines = '<h4>Richtlinien zur<span id="guideLinesTranslationType_" >zweisprachig</span> Bearbeitung:</h4>' +
                    '<p> - Achten Sie darauf, dass die Übersetzung semantisch korrekt ist.</p>' +
                    '<p> - Stellen Sie sicher das keine Informationen versehentlich hinzugefügt oder gel öscht wurden.</p>' +
                    '<p> - Falls W örter, Satzteile oder Zeichensetzung in dem Text völlig akzeptal sind, versuchen Sie diese unbearbeitet zu verwenden, anstatt sie mit etwas Neuem und Anderen zu ersetzen.</p>';

                    $.labelQuickQuestionTitle = "Kurze Frage";
                    $.labelConfirmationNeeded = "Bestätigung erforderlich";
                    $.labelConfirmationText = "Sind Sie sicher, dass Sie die Bearbeitung beenden möchten?";

                    $.labelQuickAnswerDone = "Fertig";
                    $.labelConfirmationYes = "Ja";
                    $.labelConfirmationNo = "Nein";

                    $.labelCurrentSentenceToEdit = "Aktueller Satz zum Bearbeiten:";

                    $.labelTargetTextTitle = "Zieltext";
                    $.labelSourceTextTitle = "Ausgangstext";

                    $.labelComments = "Kommentare ?";
                    $.labelCommentsTitle = "Kommentare";

                    //                    $.htmlGuidelinesMonolingual = '<h4>Richtlinien zum <span id="guideLinesTranslationType_" ></span> Nachbearbeiten:</h4>' +
                    //					'<p> - Bearbeiten Sie den Text basierend auf Ihrer Interpretation der Bedeutung so, dass er flüssiger und klarer wird.</p>' +
                    //					'<p> - Versuchen Sie z.B. die Wortfolge und Rechtschreibung zu korrigieren, wenn diese so unpassend sind, dass der Text nur schwer oder nicht zu verstehen ist.</p>' +
                    //					'<p> - Falls W örter, Satzteile oder Zeichensetzung in dem Text völlig akzeptal sind, versuchen Sie diese unbearbeitet zu verwenden, anstatt sie mit etwas Neuem und Anderen zu ersetzen.</p>';

                    $.htmlGuidelinesMonolingual = '<h4>Tipps zum <span id="guideLinesTranslationType_" ></span>Nachbearbeiten:</h4>' +
                                                      '<p> - Bearbeiten Sie den Text nach Ihrer Interpretation so, dass er flüssiger und klarer wird.</p>' +
                                                      '<p> - Versuchen Sie z.B. die Wortfolge und Rechtschreibung zu korrigieren, wenn durch diese der Text schwer oder nicht zu verstehen ist.</p>' +
                                                      '<p> - Verwenden Sie Wörter, Satzteile oder Zeichensetzung unbearbeitet, falls diese akzeptabel sind.</p>' +
                    '<p> - Wenn Sie mit Referenz zum Originaltext arbeiten, achten Sie darauf, dass keine Informationen hinzugefügt oder gelöscht wurden.</p>';

                    labelCloseDialog = 'für später speichern';
                    labelUserAllSelected = 'Aufgabe fertigstellen';
                    $.labelOriginalSentence = "Ausgangssatz:";
                    $.labelShowSource = "Original einblenden";
                    $.labelHideSource = "Original ausblenden";

                    $.messageDocBlock = "Sie haben insgesamt mindestens @timespan@ an dieser Aufgabe gearbeitet. Dies wurde vom Administrator des Projekts als maximale Zeit, für die ein Benutzer eine Aufgabe sperren kann, festgelegt. Gut gemacht. <br/><br/> Diese Aufgabe wird momentan von einem anderen Benutzer bearbeitet. Wenn Sie zu mehr zu dieser Aufgabe beitragen möchten, warten Sie bitte bis dieser Benutzer fertig ist, bevor sie die Aufgabe erneut öffnen."
                    $.messageDocBlockInitial = "Ein anderer Benutzer arbeitet bereits an dieser Aufgabe. Falls Sie weiterhin etwas zu dieser beitragen möchten, versuchen Sie es später erneut die Aufgabe zu öffnen.";

                    $.labelHours = "stunden";
                    $.labelMinutes = "protokoll";
                    $.labelSeconds = "sekunden";


                }
                else {
                    //for english we just need to adjust the line-height for the switch button
                    $(".slider-button").css("line-height", "3")
                }

            //main dialog title
            $("#ui-dialog-title-postEditDialog_").attr("title", $.labelEdit.toString());
            $("#ui-dialog-title-postEditDialog_").text($.labelEdit.toString());

            //help title
            $("#imgPostAcceptInfo_ ").attr("alt", $.labelHelp.toString());
            $("#helpPostDialog_").attr("title", $.labelHelp.toString());

            //pre-edit title
            $("#tdTarget_").attr("title", $.labelPreEditTitle.toString());
            $("#myPostEditInjectedImage").attr("title", $.labelPreEditTitle.toString());

            //click on text to edit
            $("#labelClickOnTextToEdit_").text($.labelClickOntextToEdit.toString());

            //help dialog
            $("#helpPostDialog_").html($.htmlDialogHelp.toString());

            //next and prev links
            $("#postEditLinkPrev_").text($.labelPrev.toString());
            $("#postEditLinkNext_").text($.labelNext.toString());

            //guidelines title
            $("#guideLinesDialog_").attr("title", $.labelGuidelinesTitle.toString());

            //guidelines dialog body
            if ($.configurationId == "2")
                $("#guideLinesDialog_").html($.htmlGuidelinesMonolingual.toString());
            else
                if ($.configurationId == "1")
                    $("#guideLinesDialog_").html($.htmlBilingualGuidelines.toString());

            //question dialog title
            $("#completeQuestionDialog_").attr("title", $.labelQuickQuestionTitle.toString());

            //complete dialog title
            $("#closeDialog_").attr("title", $.labelConfirmationNeeded.toString());

            //complete dialog body
            $("#closeDialog_").text($.labelConfirmationText.toString());

            //quick question dialog - done button
            $("#btn-done_").val($.labelQuickAnswerDone.toString());

            //complete dialog - yes button
            $("#btn-yes_").val($.labelConfirmationYes.toString());

            //complete dialog - no button
            $("#btn-no_").val($.labelConfirmationNo.toString());

            //current sentence to edit
            $("#currentSentenceToEditLabel_").text($.labelCurrentSentenceToEdit.toString());

            //target text area title
            $("#targetTextArea_").attr("title", $.labelTargetTextTitle.toString());

            //source text area title
            $("#sourceTextArea_").attr("title", $.labelSourceTextTitle.toString());

            //label comments
            $("#labelComments_").text($.labelComments.toString());

            //comments title
            $("#commentsTextArea_").attr("title", $.labelCommentsTitle.toString());

            //main dialog - save for later button
            $("#btn-cancel-post-accept .ui-button-text").text(labelCloseDialog.toString());

            //main dialog - complete task button
            $("#btn-completeTask-accept .ui-button-text").text(labelUserAllSelected.toString());

            //main dialog - guidelines button
            $("#btn-guidelines-accept .ui-button-text").text(labelGuideLines.toString());

            //source text area text
            $("#labelOriginalSentence_").text($.labelOriginalSentence.toString());
        }


        //        var syncConnection = function () {

        ////            if ($.userBrowser.msie) {
        ////                call = settings.acceptServerPath + "/PostEdit/Document";
        ////                var xdr = new XDomainRequest();
        ////                xdr.open("POST", call);
        ////                xdr.onload = function () {
        ////                    parseContent(xdr.responseText);
        ////                };
        ////                xdr.onerror = function () { };
        ////                xdr.onprogress = function () { };
        ////                xdr.ontimeout = function () { };
        ////                xdr.onopen = function () { };
        ////                xdr.timeout = 5000;
        ////                xdr.send(JSON.stringify({ "textId": "" + $.textId + "", "userId": "" + $.currentUserId + "" }));
        ////            }
        ////            else {
        //                $.ajax({
        //                    url: settings.acceptServerPath + "/PostEdit/Document",
        //                    dataType: 'json',
        //                    contentType: "application/json",
        //                    type: "POST",
        //                    async: true,
        //                    cache: false,
        //                    data: '{"textId":"' + "2efb8d281a944037f79c811454986037b84d20724defb7bdf2224b1762a30a8aed3abc40290cffa070add9f2495b95f50b098ecc9b14adf2dd7792716cd4bce6_proj1" + '","userId":"' + "david_luz@sapo.pt" + '"}',
        //                    success: function (data) { },
        //                    complete: function (data) { initAcceptPostEdit(); },
        //                    error: function (error) { }
        //                });
        //           // }
        //        }

        //init post edit plug-in
        var initAcceptPostEdit = function () {



            injectHTML();

            $(thisObject).each(function () {
                // click on button to edit text.
                $(this).bind('click', function () {
                    $.globalRevisionInitTime = new Date();
                    //think phase
                    $.globalThinkPhaseInitTime = new Date();
                    $.textId = $(this).attr(settings.textIdContainer);
                    //$.currentUserId = $(this).find("div.userContainer").attr("title");
                    $.currentUserId = $(this).find(settings.userIdSelector).attr(settings.userIdContainer);
                    if ($.currentUserId != null && $.textId != null) {
                        if ($("#postEditDialog_").hasClass("ui-dialog-content")) {
                            cleanPluginData();
                            //$(".targetOptionContextWrapper").css('display', 'none');
                            $(".targetOptionContextWrapper").remove();
                        }

                        browserComp();
                        generateDialogWindow(); //generateDialogWindow(postEditTargetObjectId);
                        $("#btn-completeTask-accept").css("display", "none");
                        $("#btn-guidelines-accept").css("display", "none");
                        $("#btn-cancel-post-accept").css("display", "none");
                        setTimeout(function () {
                            loadTargetContent();
                        }, 200);

                    }
                });
            });
        }


        var injectSelectorEventListener = function () {

            //remove all events that migh be already added
            $('#notesSelector_').unbind();
            $("#notesSelector_").change(function () {

                var str = "";
                var value = "";
                $("#notesSelector_ option:selected").each(function () {
                    str += $(this).text();
                    value += $(this).val();
                });
                if ($.editOptions[0] != null && value != $.editOptions[0]) {
                    //metadata
                    //<note annotates='target' from='user'>Terminology</note>

                    //the pool index starts in zero and the global postion start from one
                    var currentTranslationUnitArrayIndex = (globalCurrentTranslationUnitIndex - 1);

                    /*old approach - like the switch button action, here we would create a new segment revision phase on purpose to record the note creation*/
                    //the user navigated to other text segment, so a new Phase needs to be created
                    /*if (!isNewPhaseCreatedForThisRevision) {                        
                    //think phase
                    saveThinkPhase(translationUnitsPool[currentTranslationUnitArrayIndex]);
                    var newPhase = new Phase(buildPhaseNameString(globalCurrentTranslationUnitIndex, (translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhasesCount + 1)), $.processName, new Date(), $.jobId, $.currentUserId, $.tool, $.tooldId);
                    translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases.push(newPhase);
                    ++translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhasesCount;
                    isNewPhaseCreatedForThisRevision = true;
                    ////persist drop down list
                    translationUnitsPool[currentTranslationUnitArrayIndex].lastOption = str;                                              
                    }
                    var currentPhaseArrayIndex = (translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases.length - 1);
                    translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].phaseNotes.push(new Note("target", 'user', str));
                    //<note annotates='target' from='user'>Terminology</note>
                    //metadata*/
                    /*old approach*/

                    /*new approach - we still check if a revision phase is created but to decide where the comment will be added*/
                    var currentPhaseArrayIndex;
                    if (!isNewPhaseCreatedForThisRevision) {
                        currentPhaseArrayIndex = (translationUnitsPool[currentTranslationUnitArrayIndex].thinkPhases.length - 1);
                        translationUnitsPool[currentTranslationUnitArrayIndex].thinkPhases[currentPhaseArrayIndex].phaseNotes.push(new Note("target", 'user', str));
                    }
                    else {
                        currentPhaseArrayIndex = (translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases.length - 1);
                        translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].phaseNotes.push(new Note("target", 'user', str));
                    }
                    /*new approach*/

                }

                //$('#notesSelector_>option:nth-child(1)').attr('selected', true);
            }).change();
        }

        //persist drop down list
        $.changeOptionsSelector = function (revisionValue) {

            $("#notesSelector_ option").each(function (index, value) {

                //var v = $(this).val();               
                if (revisionValue == $(this).val())
                    $('#notesSelector_>option:nth-child(' + (index + 1).toString() + ')').attr('selected', true);
            });

        }


        var startW = 0;
        var startH = 0;
        var endW = 0;
        var endH = 0;

        var generateDialogWindow = function () {

            $('#postEditDialog_').dialog('destroy');

            $('#postEditDialog_').dialog({
                width: settings.dialogWidth, height: settings.dialogHeight, resizable: true,
                open: function (event, ui) {
                    $('div[aria-labelledby=ui-dialog-title-' + "postEditDialog_" + ']').find('.ui-dialog-buttonpane').append('<img id="imgPostAcceptInfo_" width="30px" height="30px" style="float:left;cursor:pointer;margin:4px;margin-top:10px;" src="' + settings.imagesPath + '/info_accept.png" alt="' + $.labelHelp.toString() + '" />');
                    $('div[aria-labelledby=ui-dialog-title-' + "postEditDialog_" + ']').find('.ui-dialog-buttonpane').css("font-size", settings.bottomPaneFontSize);

                },
                resizeStart: function (event, ui) {
                    //                    startW = $(this).outerWidth();
                    //                    startH = $(this).outerHeight();
                    startW = $(this).dialog("option", "width");
                    startH = $(this).dialog("option", "height");


                },
                resizeStop: function (event, ui) {
                    endW = $(this).dialog("option", "width");
                    endH = $(this).dialog("option", "height");



                    //alert("width changed:" + (parseFloat(endW) - parseFloat(startW)) + " -- Height changed:" + parseFloat(endH - startH));

                },
                close: function (event, ui) {
                    saveBeforeExit();
                    cleanPluginData();
                    $(".targetOptionContextWrapper").css('display', 'none');
                    //auto refresh for survey purpose
                    //window.location = window.location;
                    //location.reload(true);   
                },
                drag: function (event, ui) { $(".targetOptionContextWrapper").css('display', 'none'); }
                ,
                buttons: [
                 {
                     id: "btn-completeTask-accept",
                     text: labelUserAllSelected,
                     click: function () {


                         saveBeforeExit();
                         createCloseDialog();
                     }

                 },
                {
                    id: "btn-guidelines-accept",
                    text: labelGuideLines,
                    click: function () {
                        createGuideLinesDialog();
                    }

                },
                {

                    id: "btn-cancel-post-accept",
                    text: labelCloseDialog,
                    click: function () {

                        //createCloseDialog();

                        $(this).dialog("close");
                    }
                }
                ]
            });

            $("#imgPostAcceptInfo_").click(function () {
                $("#helpPostDialog_").dialog("close");
                $("#helpPostDialog_").dialog("destroy");
                $("#helpPostDialog_").dialog({
                    resizable: true,
                    width: 500,
                    height: 'auto', //680,
                    modal: false,
                    buttons: {
                        "Ok": function () {
                            $("#helpPostDialog_").dialog("close");
                            $("#helpPostDialog_").dialog("destroy");
                        }
                    }
                });

            });

        } //end generateDialogWindow

        //pagination
        var createPagination = function (contentElementId) {

            //how much items per page to show
            var show_per_page = 1;
            //getting the amount of elements inside content div
            var number_of_items = $('#' + contentElementId).find("div").size(); //$('#' + contentElementId).children().size();
            //calculate the number of pages we are going to have
            var number_of_pages = Math.ceil(number_of_items / show_per_page);

            //set the value of our hidden input fields
            $('#current_page').val(0);
            $('#show_per_page').val(show_per_page);

            //now when we got all we need for the navigation let's make it '

            /* 
            what are we going to have in the navigation?
            - link to previous page
            - links to specific pages
            - link to next page
            */

            var navigation_html = '<a id="postEditLinkPrev_" class="previous_link" href="javascript:previous(\'' + contentElementId + '\');">' + $.labelPrev.toString() + '</a>';
            var current_link = 0;

            while (number_of_pages > current_link) {
                navigation_html += '<a style="display:none" class="page_link" href="javascript:go_to_page(' + current_link + ', ' + '\'' + contentElementId + '\'' + ')" longdesc="' + current_link + '">' + (current_link + 1) + '</a>';
                current_link++;
            }

            navigation_html += '<a id="postEditLinkNext_" class="next_link" href="javascript:next(\'' + contentElementId + '\');">' + $.labelNext.toString() + '</a>';

            $('#page_navigation').html(navigation_html);

            //add active_page class to the first page link
            $('#page_navigation .page_link:first').addClass('active_page');

            //hide all the elements inside content div
            //$('#' + contentElementId).children().css('display', 'none');

            $('#' + contentElementId).find("div").removeClass('postedit-highlight'); //$('#' + contentElementId).children().removeClass('postedit-highlight');

            //and show the first n (show_per_page) elements
            //$('#' + contentElementId).children().slice(0, show_per_page).css('display', 'block');
            $('#' + contentElementId).find("div").slice(0, show_per_page).addClass('postedit-highlight'); //$('#' + contentElementId).children().slice(0, show_per_page).addClass('postedit-highlight');

            go_to_page(0, 'editedContent_');
        }

        //        $.updateDocumentEditingTime = function (seconds) {
        //            if ($.userBrowser.msie) {
        //                var call = settings.acceptServerPath + "/PostEdit/UpdateEditionTimeJsonP?textId=" + $.textId + "&userId=" + $.currentUserId + "&seconds=" + seconds + "&callback=?";
        //                $.ajax({
        //                    type: 'GET',
        //                    url: call,
        //                    dataType: 'json',
        //                    success: function (data) { },
        //                    complete: function () { },
        //                    error: function () { },
        //                    data: {},
        //                    cache: false,
        //                    async: false
        //                });
        //            }
        //            else {
        //                $.ajax({
        //                    url: settings.acceptServerPath + "/PostEdit/UpdateEditionTime",
        //                    dataType: 'json',
        //                    contentType: "application/json",
        //                    type: "POST",
        //                    async: true,
        //                    cache: false,
        //                    data: '{"textId":"' + $.textId + '","userId":"' + $.currentUserId + '", "seconds":"' + seconds + '"}',
        //                    success: function (data) { },
        //                    complete: function (data) { },
        //                    error: function (error) { }
        //                });
        //            }
        //        }

        $.completeDocument = function (questionReply) {
            if ($.userBrowser.msie) {
                var call = settings.acceptServerPath + "/PostEdit/CompleteDocumentJsonP?textId=" + $.textId + "&userId=" + $.currentUserId + "&questionId=" + $.questionId + "&finalReply=" + encodeURIComponent(questionReply) + "&callback=?";
                $.ajax({
                    type: 'GET',
                    url: call,
                    dataType: 'json',
                    success: function (data)
                    { },
                    complete: function () { $("#postEditDialog_").dialog("close"); location.reload(true); },
                    error: function (data) { },
                    data: {},
                    cache: false,
                    async: false
                });
            }
            else {
                $.ajax({
                    url: settings.acceptServerPath + "/PostEdit/CompleteDocument",
                    dataType: 'json',
                    contentType: "application/json",
                    type: "POST",
                    async: true,
                    cache: false,
                    data: '{"textId":"' + $.textId + '","userId":"' + $.currentUserId + '", "questionId":"' + $.questionId + '","finalReply":"' + questionReply + '"}',
                    success: function (data) { },
                    complete: function (data) { $("#postEditDialog_").dialog("close"); location.reload(true); },
                    error: function (error) { }
                });
            }
        }

        var getContent = function () {
            if ($.userBrowser.msie) {
                call = settings.acceptServerPath + "/PostEdit/Document";
                var xdr = new XDomainRequest();
                xdr.open("POST", call);
                xdr.onload = function () {
                    //                    if (xdr.responseText.Exception == $.blockedDocumentMessage) {
                    //                        displayBlockedRevisionMessage();
                    //                    } else
                    parseContent(xdr.responseText);
                };
                xdr.onerror = function () { };
                xdr.onprogress = function () { };
                xdr.ontimeout = function () { };
                xdr.onopen = function () { };
                xdr.timeout = 5000;
                xdr.send(JSON.stringify({ "textId": "" + $.textId + "", "userId": "" + $.currentUserId + "" }));
            }
            else {
                $.ajax({
                    url: settings.acceptServerPath + "/PostEdit/Document",
                    dataType: 'json',
                    contentType: "application/json",
                    type: "POST",
                    async: true,
                    cache: false,
                    data: '{"textId":"' + $.textId + '","userId":"' + $.currentUserId + '"}',
                    success: function (data) {
                        debugger;
                        if (data.Exception == $.blockedDocumentMessage) {
                            displayBlockedRevisionMessage($.messageDocBlockInitial);
                        } else
                            parseContent(data);
                    },
                    complete: function (data) { },
                    error: function (error) { }
                });
            }
        }

        $.submitRevision = function (jsonData) {

            if ($.userBrowser.msie) {
                var jsonObj = JSON.parse(jsonData);
                call = settings.acceptServerPath + "/PostEdit/TranslationRevisionPhaseIe";
                var xdr = new XDomainRequest();
                xdr.open("POST", call);
                xdr.onload = function () {

                    var jsonObj = JSON.parse(xdr.responseText);
                    if (jsonObj.Exception == $.blockedDocumentMessage) {
                        //displayBlockedRevisionMessage($.messageDocBlock.replace("@timespan@", $.projectMaxThreshold));
                        displayBlockedRevisionMessage($.messageDocBlock.replace("@timespan@", formatThresholdPeriod($.projectMaxThreshold)));
                    }

                };
                xdr.onerror = function () { };
                xdr.onprogress = function () { };
                xdr.ontimeout = function () { };
                xdr.onopen = function () { };
                xdr.timeout = 5000;
                xdr.send(JSON.stringify({ "jsonRawString": "" + encodeURIComponent(jsonData) + "" }));
            }
            else {
                $.ajax({
                    url: settings.acceptServerPath + "/PostEdit/TranslationRevisionPhase",
                    dataType: 'json',
                    contentType: "application/json",
                    type: "POST",
                    async: true,
                    cache: false,
                    data: jsonData,
                    success: function (data) {

                        debugger;
                        if (data.Exception == $.blockedDocumentMessage) {
                            //displayBlockedRevisionMessage($.messageDocBlock.replace("@timespan@", $.projectMaxThreshold));
                            displayBlockedRevisionMessage($.messageDocBlock.replace("@timespan@", formatThresholdPeriod($.projectMaxThreshold)));
                        }

                    },
                    complete: function (data) {

                    },
                    error: function (error) {

                    }
                });

            }
        }

        var parseContent = function (data) {

            globalCurrentTranslationUnitIndex = 1;
            globalPreviousTranslationUnitIndex = 1;
            isNewPhaseCreatedForThisRevision = false;
            translationUnitsPool = [];
            $.configurationId = "1";
            $.processName = "bilingual";
            $.questionId = "";
            $.question = "";
            $.targetLanguage = "";
            $.editOptions = [];

            $.displayTranslationOptions = true;
            startPePhase = null;

            $.isSingleRevision = false;
            $.projectMaxThreshold = "";

            if (data != null) {
                var mainContentObj = null;
                if ($.browser.msie) {
                    mainContentObj = JSON.parse(data);
                    contentObj = mainContentObj.ResponseObject;
                    if (mainContentObj.Exception == $.blockedDocumentMessage) {
                        displayBlockedRevisionMessage($.messageDocBlockInitial);
                        return;
                    }
                }
                else {
                    mainContentObj = data;
                    contentObj = data.ResponseObject;
                }

                //single revision
                $.isSingleRevision = contentObj.isSingleRevisionProject;
                $.projectMaxThreshold = contentObj.maxThreshold;
                if ($.isSingleRevision) {
                    try {
                        var date = new Date(Date.parse(contentObj.lastBlockDate));
                        $.lastBlockDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
                        //alert(date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + (date.getDate() + 1));
                    } catch (e) { }
                }

                //project configuration
                if (contentObj.configurationId != null && contentObj.configurationId != "") {
                    $.configurationId = contentObj.configurationId;
                    if ($.configurationId == "2")
                        $.processName = "monolingual";

                    $.customInterface = contentObj.customInterface;
                }

                $("#guideLinesTranslationType_").text($.processName);
                if (contentObj.questionIdentifier != null && contentObj.questionIdentifier != "" && contentObj.projectQuestion != null && contentObj.projectQuestion != "") {
                    $.questionId = contentObj.questionIdentifier;
                    $.question = contentObj.projectQuestion;
                }

                if (contentObj.editOptions != null && contentObj.editOptions.length > 0) {
                    for (var i = 0; i < contentObj.editOptions.length; i++)
                        $.editOptions.push(contentObj.editOptions[i]);
                }

                //project configuration                //set current target language
                if (contentObj.targetLanguage.length > 0) {
                    if (contentObj.targetLanguage.indexOf("fr") == 0) {
                        $.targetLanguage = "fr"; settings.preEditLanguageUI = "fr"; setUILanguage("fr");
                    }
                    else
                        if (contentObj.targetLanguage.indexOf("de") == 0) {
                            $.targetLanguage = "de"; settings.preEditLanguageUI = "de"; setUILanguage("de");
                        }
                        else
                            if (contentObj.targetLanguage.indexOf("en") == 0)
                                $.targetLanguage = "en";

                }

                if (contentObj.displayTranslationOptions == 2)
                    $.displayTranslationOptions = false;

                switch (mainContentObj.ResponseStatus) {//switch (data.ResponseStatus) {
                    case "OK":
                        {

                            if (contentObj.tgt_templates.length == 0) {
                                for (var i = 0; i < contentObj.tgt_sentences.length; i++) {
                                    $('#divMain_').append('<div style="display:inline;">' + contentObj.tgt_sentences[i].text + '</div>&nbsp;');
                                    //metadata
                                    var currentSegmentIndex = (i + 1);
                                    var newTranslationUnit = new TranslationUnit(currentSegmentIndex, "needs-review-translation", buildPhaseNameString(currentSegmentIndex, 1), "", contentObj.tgt_sentences[i].text, contentObj.tgt_sentences[i].lastComment, contentObj.tgt_sentences[i].lastOption);
                                    translationUnitsPool.push(newTranslationUnit);
                                    //metadata
                                }
                            } else {

                                for (var i = 0; i < contentObj.tgt_sentences.length; i++) {
                                    $('#divMain_').append(contentObj.tgt_templates[i].markup.replace("@TARGET@", contentObj.tgt_sentences[i].text));
                                    //metadata
                                    var currentSegmentIndex = (i + 1);
                                    var newTranslationUnit = new TranslationUnit(currentSegmentIndex, "needs-review-translation", buildPhaseNameString(currentSegmentIndex, 1), "", contentObj.tgt_sentences[i].text, contentObj.tgt_sentences[i].lastComment, contentObj.tgt_sentences[i].lastOption);
                                    translationUnitsPool.push(newTranslationUnit);
                                    //metadata
                                }

                            }

                            //console.log($('#divMain_').html());
                            for (var i = 0; i < contentObj.src_sentences.length; i++) {
                                $('#divSourceMain_').append('<p id="sourcePar_' + (i + 1).toString() + '">' + contentObj.src_sentences[i].text + '</p>'); //  $('#divSourceMain_').append('<p id="sourcePar_' + (i + 1).toString() + '">' + contentObj.tgt_sentences[i].text + '</p>');
                                //metadata                                
                                translationUnitsPool[i].source = contentObj.src_sentences[i].text;
                                //metadata
                            }
                        } break;
                }




                //removed from the function loadtarget Content

                //changes for the templates
                var countParagraphs = 0;
                if (contentObj.tgt_sentences.length == 0) {
                    $('#divMain_').find('DIV').each(function () {//$('#divMain_').find('P').each(function () {
                        ++countParagraphs;
                        $(this).attr("id", "spanParagraph_" + countParagraphs.toString());
                    });

                }
                else {
                    $('#divMain_').find('DIV').each(function () {//$('#divMain_').find('P').each(function () {
                        ++countParagraphs;
                        $(this).attr("id", "spanParagraph_" + countParagraphs.toString());
                    });
                }

                $('#editedContent_').html($('#divMain_').html());
                //changes for the templates

                $('#editedContent_ DIV').each(function () {//$('#editedContent_ span').each(function () {

                    $(this).click(function () {

                        //get current page
                        var spanIdSplitted = $(this).attr('id').split('_');

                        //update page navigation
                        //$('#current_page').val(spanIdSplitted[1]);                                     
                        go_to_page((parseInt(spanIdSplitted[1]) - 1), 'editedContent_');
                    });

                    $(this).mouseover(function () {
                        if (!$(this).hasClass('postedit-highlight')) {
                            $(this).removeClass().addClass("highlightless");
                        }
                    });

                    $(this).mouseout(function () {
                        //if (!$(this).hasClass('postedit-highlight')) {
                        $(this).removeClass('highlightless');
                        //}
                    });
                });

                //removed from the function loadtarget Content
                //plugin flow stuff from init function				

                createPagination('editedContent_');


                createPluginOptionButtons();


                resizeBind();

                //mark auto-save check by default
                $('#autoSaveCheckBox_').attr('checked', true);


                //load text editor
                loadTextEditor($.targetLanguage);


                injectConfigurationMenus();


                injectSelectorEventListener();


                if (translationUnitsPool[0].lastOption.length == 0)
                    $('#notesSelector_>option:nth-child(1)').attr('selected', true);
                else
                    $.changeOptionsSelector(translationUnitsPool[0].lastOption);

                $.globalStartTime = new Date();
                //plugin flow stuff from init function

                /*add translation history for first segement*/
                if ($('#targetTextArea__toolbar1').find('tr:last').length) {
                    $('#targetTextArea__toolbar1').find('tr:last').append('<td><select id="ddlRevisionHistory_" style="border-style: solid;border-width: 1px;display:none;" class="revision-history"></select></td>');
                    $.updateRevisionHistory(0);
                    $('#ddlRevisionHistory_').change(function (index, value) { alert(index); alert(value); });
                }
                else {
                    var checkExistTinyMCEBottomToolbar = setInterval(function () {
                        if ($('#targetTextArea__toolbar1').find('tr:last').length) {
                            $('#targetTextArea__toolbar1').find('tr:last').append('<td><select id="ddlRevisionHistory_" style="border-style: solid;border-width: 1px;display:none;" class="revision-history"></select></td>');
                            $.updateRevisionHistory(0);
                            $('#ddlRevisionHistory_').change(function () {

                                if (this.value.length > 0)
                                    $('#targetTextArea_').val(decodeURIComponent(this.value).replace("<", "&lt;").replace(">", "&gt;"));

                            });
                            clearInterval(checkExistTinyMCEBottomToolbar);
                        }
                    }, 100);
                }


                //end loading  data...

                //hide ajax gif
                $("#divLoadingContainer").css("display", "none");
                $("#divDocumentBlockedContainer").css("display", "none");

                debugger;
                if (!$.isSingleRevision)
                    $("#btn-completeTask-accept").css("display", "inline");
                $("#spnMaxEditionThreshold_").text($.projectMaxThreshold);
                $("#btn-guidelines-accept").css("display", "inline");
                $("#btn-cancel-post-accept").css("display", "inline");

                $("#divMainContainer").css("display", "block");

                //think phase

                //createThinkPhase((globalCurrentTranslationUnitIndex - 1));

            } //if data != null
        }

        function formatThresholdPeriod(thresholdPeriod) {
            try {
                return (thresholdPeriod.split(":")[0] != "00" ? thresholdPeriod.split(":")[0] + " " + $.labelHours : "") +
                (thresholdPeriod.split(":")[1] != "00" ? thresholdPeriod.split(":")[1] + " " + $.labelMinutes : "") +
                (thresholdPeriod.split(":")[2] != "00" ? thresholdPeriod.split(":")[0] || thresholdPeriod.split(":")[1] != "00" ? " and " + thresholdPeriod.split(":")[2] + " " + $.labelSeconds : thresholdPeriod.split(":")[2] + " " + $.labelSeconds : thresholdPeriod.split(":")[1] != "00" ? "" : "")

            } catch (e) { return thresholdPeriod + " "; }
        }

        function displayBlockedRevisionMessage(message) {

            $("#spnBlockedMessage_").html(message);

            $("#btn-guidelines-accept").css("display", "none");
            $("#btn-cancel-post-accept").css("display", "none");

            $("#divMainContainer").css("display", "none");
            $("#divLoadingContainer").css("display", "none");
            $("#divDocumentBlockedContainer").css("display", "block");
        }

        $.updateRevisionHistory = function (index) {

            if (contentObj.targetRevisions != null && contentObj.targetRevisions.length > 0) {
                $('#targetTextArea__toolbar1').find('#ddlRevisionHistory_').empty();
                $('#targetTextArea__toolbar1').find('#ddlRevisionHistory_').append('<option value="">Select Revision</option>');

                for (var i = 0; i < contentObj.targetRevisions[index].length; i++)
                    $('#targetTextArea__toolbar1').find('#ddlRevisionHistory_').append('<option value="' + encodeURIComponent(contentObj.targetRevisions[index][i]) + '">Revision' + i.toString() + '</option>');

                $('#targetTextArea__toolbar1').find('#ddlRevisionHistory_').css("display", "inline");
            }
        }

        function validateOptionsValuesList(optionsValues) {
            var validList = false;
            for (var k = 0; k < optionsValues.length; k++)
                if (optionsValues[k].phrase.length > 0)
                    return true;

            return validList;
        }

        $.addTargetOptions = function (sentenceIndex) {
            //TODO: CLEAN ALL SPANS ? PROBABLY NO, BECAUSE WE ALREADY CHANGED THE TARGET TEXT AREA ID
            //TODO: Clean all elements with class starting by "targetOptionContextWrapper" from document
            //$(document.body).contents().find('div[id^="targetContextMenu_"]').remove();
            $(".targetOptionContextWrapper").remove();
            if ($.displayTranslationOptions) {
                for (var i = 0; i < contentObj.tgt_sentences[sentenceIndex].options.length; i++) {

                    if (validateOptionsValuesList(contentObj.tgt_sentences[sentenceIndex].options[i].values))
                        $('#targetTextArea__ifr').contents().find('#tinymce').highlightTargetOptions(contentObj.tgt_sentences[sentenceIndex].options[i].context, "targetSpan_" + i.toString(), contentObj.tgt_sentences[sentenceIndex].options[i].values, i);
                }
            }


            //bind all events to hide menus
            $('#targetTextArea__ifr').contents().find('html').click(function () {

                $(".targetOptionContextWrapper").css('display', 'none');
            });
            $('#postEditDialog_').click(function () {

                $(".targetOptionContextWrapper").css('display', 'none');
            });


            //bind all events related with target options
            $('#targetTextArea__ifr').contents().find('#tinymce SPAN').mouseover(function () {
                $(this).css("background-color", "yellow");
                $(this).css("cursor", "pointer");
            }).mouseout(function () {
                $(this).css("background-color", "");
                $(this).css("cursor", "");
            }).click(function (e) {

                $(".targetOptionContextWrapper").css('display', 'none');
                var spanOffset = $(this).offset();
                //alert(this.tagName + " coords ( " + offset.left + ", " + offset.top + " )");
                var iFrameOffset = $(document.body).contents().find('#targetTextArea__ifr').offset();
                //alert($(document.body).contents().find('#targetTextArea__ifr').offset());
                var left = iFrameOffset.left + spanOffset.left;
                var top = iFrameOffset.top + spanOffset.top
                var splittedId = this.id.split('_');
                $("#targetContextMenu_" + splittedId[1] + "_" + splittedId[2]).css('top', (top + 15));
                $("#targetContextMenu_" + splittedId[1] + "_" + splittedId[2]).css('left', left);
                $("#targetContextMenu_" + splittedId[1] + "_" + splittedId[2]).css('display', 'block');

                e.stopPropagation();
            });
        }


        var loadTargetContent = function () {
            getContent();
        } //end load targer content


        var browserComp = function () {
            $.userBrowser = $.browser;
            //            if ($.userBrowser.msie || $.userBrowser.mozilla)
            //              jQuery.support.cors = true;
            //        if ($.userBrowser.mozilla) {
            //            settings.dialogWidth = settings.dialogWidth + 30;
            //            settings.dialogHeight = settings.dialogHeight + 30;
            //        }
        }

        var resizeBind = function () {
            //$("#editedContent_").resizable();
            //$("#wrapper").resizable();
            //$('#sourceTextArea_').resizable();
        }

        var createGuideLinesDialog = function () {
            $('#guideLinesDialog_').dialog("destroy");
            $('#guideLinesDialog_').dialog();
        }

        var createCloseDialog = function () {

            $('#closeDialog_').dialog("destroy");
            $("#closeDialog_").dialog({
                modal: false,
                buttons:
                 [{
                     id: "btn-yes_",
                     text: $.labelConfirmationYes.toString(),
                     click: function () {

                         $(this).dialog("close");

                         //if the document has questions attached
                         if ($.question != "" && $.questionId != "") {

                             $('#completeQuestionDialog_').dialog({
                                 modal: false,
                                 buttons: [
                                {
                                    id: "btn-done_",
                                    text: $.labelQuickAnswerDone.toString(),
                                    click: function () {

                                        //chek if reply has something within it
                                        if ($.trim($("#QuickQuestionTextArea_").val())) {
                                            $.completeDocument($("#QuickQuestionTextArea_").val());
                                            // textarea is not empty or contains only white-space
                                        }
                                        $(this).dialog("close");
                                    }
                                }]
                             });
                         } else {
                             $.completeDocument("");
                         }
                         //if the document has questions attached
                         //$("#postEditDialog_").dialog("close");
                     }
                 },
                {
                    id: "btn-no_",
                    text: $.labelConfirmationNo.toString(),
                    click: function () {

                        $(this).dialog("close");
                    }
                }

                 ]
            });

        }

        //inject all HTML code
        var injectPaginationFields = function () {
            $(document.body).append('<input type="hidden" id="current_page" />');
            $(document.body).append('<input type="hidden" id="show_per_page" />');
        }
        var injectHelpButtonDialog = function () {

            $(document.body).append('<div id="helpPostDialog_" title="' + $.labelHelp.toString() + '" style="display:none; text-align: justify;">' + $.htmlDialogHelp.toString() + '</div>');
        }

        var injectMainDialog = function () {

            $(document.body).append('<div id="postEditDialog_" title="' + $.labelEdit.toString() + '" style="display:none;"> <div class="container" id="divLoadingContainer" style="vertical-align: middle;text-align: center;height: 100%;width: auto;"><img alt="" src="' + settings.imagesPath + '/ajax-loader_post.gif" style="vertical-align: middle;text-align: center;margin-top: 15%;"></div>' +
            '<div class="container" id="divDocumentBlockedContainer" style="vertical-align: middle;text-align: center;width: auto;height: 100%;display:none;"><span id="spnBlockedMessage_" style="vertical-align: middle;text-align: center;margin-top: 15%;height:100%;font-size: larger;"></span></div>' +
         ' <div id="divMain_" style="display:none;"></div>  <div id="divSourceMain_" style="display:none;"></div>  <div class="container" id="divMainContainer" style="display:none;width: auto;">  <div class="left"><span><b id="labelClickOnTextToEdit_">' + $.labelClickOntextToEdit.toString() + '</b></span><div id="wrapper"> <div id="editedContent_" style="height:' + settings.leftPaneHeight + ';width:' + settings.leftPaneWidth + ';font-size:' + settings.leftPaneFontSize + ';" class="scrollingDiv"></div></div></div><div class="middle"></div><div class="right"><div id="divSourceTextContainer_" style="display:none;width:' + settings.textAreasWidth + ';">' +
         '<span><b><span id="labelOriginalSentence_">' + $.labelOriginalSentence.toString() + '</span><span class="slider-frame" style="float: right;"><span class="slider-button" id="switcherButton_"></span></span></b></span>' +
         '<textarea title="' + $.labelSourceTextTitle.toString() + '" class="source-text-area" id="sourceTextArea_" style="width:' + settings.textAreasWidth + '; margin:0; padding:0;height:' + settings.textAreasHeight + ';background-color:#F0F0EE;padding-bottom:5px" readonly="readonly"></textarea>' +
         '<!--<select id="sourceOptionsList_" class="sourceList"></select>--></div>' +
         '<div id="divTargetTextContainer">' +
         '<span><b id="currentSentenceToEditLabel_">' + $.labelCurrentSentenceToEdit.toString() + '</b></span>' +
         '<textarea title="' + $.labelTargetTextTitle.toString() + '" class="targetTextArea" id="targetTextArea_" style="width:' + settings.textAreasWidth + '; margin:0; padding:0;height:' + settings.textAreasHeight + ';" ></textarea>' +
         '</div>' +
         '<div id="divOptions" style="width:' + settings.textAreasWidth + ';">' +
         '<!--<div style="padding-top: 20px;" id="page_navigation"></div>-->' +
         '<div style="padding-top: 10px;" id="checkOptions_"><span id="page_navigation"></span> <div style="display:none"> <span style="float:right;"><input type="button" id="btnSave_" title="Save" value="Save" /></span><span style="float:right;padding-right:5px;padding-top:5px;"> Auto Save? </span><span style="float:right;padding-top:5px;"><input id="autoSaveCheckBox_" type="checkbox" title="Auto Save"  /></span></div></div>' +
         '<!--<div  style="padding-top: 10px;"><span><input id="autoSaveCheckBox_" title="Auto Save" type="checkbox"  /></span><span> Auto Save ?</span></div>-->' +
         '</div>' +
         '<div id="divComments" style="padding-top:10px;width:' + settings.textAreasWidth + ';">' +
         '<span><b id="labelComments_">' + $.labelComments.toString() + '</b> <select id="notesSelector_" style="margin:0px;display:none;" > </select></span> ' +
         '<textarea title="' + $.labelCommentsTitle.toString() + '" id="commentsTextArea_" style="width:' + settings.textAreasWidth + '; margin:0; padding:0;height:' + settings.textAreasHeight + ';"></textarea> ' +
         '</div>' +
         '<div id="divCommentsOptions" style="width:' + settings.textAreasWidth + ';">' +
         '' +
         '</div>' +
         '</div>    ' +
         '</div>    ' +
         '</div>');

        }
        //        var injectMainDialog = function () {

        //            $(document.body).append('<div id="postEditDialog_" title="' + $.labelEdit.toString() + '" style="display:none;"> <div class="loadmask"  style="position:relative; display:block; vertical-align:middle; text-align:center;top:30%"> <img alt="Please Wait..." src="' + settings.imagesPath + '/ajax-loader.gif" /> </div> <div id="divMain_" style="display:none;"></div>  <div id="divSourceMain_" style="display:none;"></div>  <div class="container">  <div class="left"><span><b id="labelClickOnTextToEdit_">' + $.labelClickOntextToEdit.toString() + '</b></span><div id="wrapper"> <div id="editedContent_" class="scrollingDiv"></div></div></div><div class="middle"></div><div class="right"><div id="divSourceTextContainer_" style="display:none">' +
        //         '<span><b><span id="labelOriginalSentence_">' + $.labelOriginalSentence.toString() + '</span><img title="Minimize source" id="imgMinimize_" style="width:14px;height:14px;float: right;cursor: pointer;" src="' + settings.imagesPath + '/minimize.png" /><img title="Maximize source" id="imgMaximize_" style="width:14px;height:14px;float: right;cursor: pointer;display:none;" src="' + settings.imagesPath + '/maximize.png" /></b></span>' +
        //         '<textarea title="' + $.labelSourceTextTitle.toString() + '" class="sourceTextArea" id="sourceTextArea_" style="width:400px; margin:0; padding:0;height:97px;background-color:#F0F0EE;padding-bottom:5px" readonly="readonly"></textarea>' +
        //         '<!--<select id="sourceOptionsList_" class="sourceList"></select>--></div>' +
        //         '<div id="divTargetTextContainer">' +
        //         '<span><b id="currentSentenceToEditLabel_">' + $.labelCurrentSentenceToEdit.toString() + '</b></span>' +
        //         '<textarea title="' + $.labelTargetTextTitle.toString() + '" class="targetTextArea" id="targetTextArea_" style="width:400px; margin:0; padding:0;height:97px;" ></textarea>' +
        //         '</div>' +
        //         '<div id="divOptions" style="width:400px;">' +
        //         '<!--<div style="padding-top: 20px;" id="page_navigation"></div>-->' +
        //         '<div style="padding-top: 10px;" id="checkOptions_"><span id="page_navigation"></span> <div style="display:none"> <span style="float:right;"><input type="button" id="btnSave_" title="Save" value="Save" /></span><span style="float:right;padding-right:5px;padding-top:5px;"> Auto Save? </span><span style="float:right;padding-top:5px;"><input id="autoSaveCheckBox_" type="checkbox" title="Auto Save"  /></span></div></div>' +
        //         '<!--<div  style="padding-top: 10px;"><span><input id="autoSaveCheckBox_" title="Auto Save" type="checkbox"  /></span><span> Auto Save ?</span></div>-->' +
        //         '</div>' +
        //         '<div id="divComments" style="padding-top:10px;width:400px;">' +
        //         '<span><b id="labelComments_">' + $.labelComments.toString() + '</b> <select id="notesSelector_" style="margin:0px;display:none;" > </select></span> ' +
        //         '<textarea title="' + $.labelCommentsTitle.toString() + '" id="commentsTextArea_" style="width:400px; margin:0; padding:0;height:90px;"></textarea> ' +
        //         '</div>' +
        //         '<div id="divCommentsOptions" style="width:400px;">' +
        //         '' +
        //         '</div>' +
        //         '</div>    ' +
        //         '</div>    ' +
        //         '</div>');

        //        }
        var injectMainDialogMonolingual = function () {

            $(document.body).append('<div id="postEditDialog_" title="' + $.labelEdit.toString() + '" style="display:none;"> <div class="loadmask"  style="position:relative; display:block; vertical-align:middle; text-align:center;top:30%"> <img alt="Please Wait..." src="' + settings.imagesPath + '/ajax-loader.gif" /> </div> <div id="divMain_" style="display:none;"></div>  <div id="divSourceMain_" style="display:none;"></div>  <div class="container" style="width: auto;">  <div class="left"><span><b id="labelClickOnTextToEdit_" >' + $.labelClickOntextToEdit.toString() + '</b></span><div id="wrapper"> <div id="editedContent_" style="height:' + settings.leftPaneHeight + ';width:' + settings.leftPaneWidth + ';" class="scrollingDiv"></div></div></div><div class="middle"></div><div class="right"><div id="divSourceTextContainer_" style="display:none;width:' + settings.textAreasWidth + ';">' +
         '<span><b id="labelOriginalSentence_">' + $.labelOriginalSentence.toString() + '</b></span>' +
         '<textarea title="' + $.labelSourceTextTitle.toString() + '" class="source-text-area" id="sourceTextArea_" style="width:' + settings.textAreasWidth + '; margin:0; padding:0;height:' + settings.textAreasHeight + ';" readonly="readonly"></textarea>' +
         '<!--<select id="sourceOptionsList_" class="sourceList"></select>--></div>' +
         '<div id="divTargetTextContainer">' +
         '<span><b id="currentSentenceToEditLabel_">' + $.labelCurrentSentenceToEdit.toString() + '</b></span>' +
         '<textarea title="' + $.labelTargetTextTitle.toString() + '" class="targetTextArea" id="targetTextArea_" style="width:' + settings.textAreasWidth + '; margin:0; padding:0;height:' + settings.textAreasHeight + ';" ></textarea>' +
         '</div>' +
         '<div id="divOptions" style="width:' + settings.textAreasWidth + ';">' +
         '<!--<div style="padding-top: 20px;" id="page_navigation"></div>-->' +
         '<div style="padding-top: 10px;" id="checkOptions_"><span id="page_navigation"></span><div style="display:none"> <span style="float:right;"><input type="button" id="btnSave_" title="Save" value="Save" /></span><span style="float:right;padding-right:5px;padding-top:5px;"> Auto Save? </span><span style="float:right;padding-top:5px;"><input id="autoSaveCheckBox_" type="checkbox" title="Auto Save"  /></span></div></div>' +
         '<!--<div  style="padding-top: 10px;"><span><input id="autoSaveCheckBox_" title="Auto Save" type="checkbox"  /></span><span> Auto Save ?</span></div>-->' +
         '</div>' +
         '<div id="divComments" style="padding-top:10px;width:' + settings.textAreasWidth + ';">' +
         '<span><b id="labelComments_">' + $.labelComments.toString() + '</b></span> <select id="notesSelector_" style="margin:0px;display:none;" > </select>' +
         '<textarea title="' + $.labelCommentsTitle.toString() + '" id="commentsTextArea_" style="width:' + settings.textAreasWidth + '; margin:0; padding:0;height:' + settings.textAreasHeight + ';"></textarea> ' +
         '</div>' +
         '<div id="divCommentsOptions" style="width:' + settings.textAreasWidth + ';">' +
         ' ' +
         '</div>' +
         '</div>    ' +
         '</div>    ' +
         '</div>');

        }
        var injectGuidelinesDialog = function () {
            $(document.body).append('<div style="display:none;" id="guideLinesDialog_" title="' + $.labelGuidelinesTitle.toString() + '">' + $.htmlBilingualGuidelines.toString() + '</div>')
        }
        var injectCloseMenusDialogs = function () {
            $(document.body).append('<div style="display:none;" id="closeDialog_" title="' + $.labelConfirmationNeeded.toString() + '"><p>' + $.labelConfirmationText.toString() + '</p></div>');
        }
        var injectFinalQuestionDialog = function () {
            $(document.body).append('<div style="display:none;" id="completeQuestionDialog_" title="' + $.labelQuickQuestionTitle.toString() + '">	<p id="quickQuestion_"></p><textarea id="QuickQuestionTextArea_" style="width:250px; margin:0; padding:0;height:80px;border:0px;"></textarea>	</div>');
        }

        var injectHTML = function () {
            injectPaginationFields();
            // if ($.configurationId != null && $.configurationId == "2")
            //     injectMainDialogMonolingual();
            // else
            injectMainDialog();
            injectGuidelinesDialog();
            injectCloseMenusDialogs();
            injectFinalQuestionDialog();
            injectHelpButtonDialog();
        }

        var addSwitchAction = function () {

            debugger;
            //gives the index of the paragraph
            var currentTranslationUnitArrayIndex = (globalCurrentTranslationUnitIndex - 1);
            //gives the index of the last revision of the paragraph 
            var currentPhaseArrayIndex = (translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases.length - 1);

            if (isNewPhaseCreatedForThisRevision) { //if (currentPhaseArrayIndex >= 0 && translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases.length > 0) {

                translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].switchTimeStampList.push(new Date());
                translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].processName = $.processName;
                if (translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].switchTimeStampList.length == 2)//meaning this is the first switch after the default one
                {
                    translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].startSwitch = $.processName == "bilingual" ? "show" : "hide";
                }
            }
            else {
                /*old approach - in order to create a new segment revision when when the switch button is clicked*/
                /*if (!$.lockCustomInterfacePhaseCreation && !isNewPhaseCreatedForThisRevision) { //if (!$.lockCustomInterfacePhaseCreation) {
                //think phase
                saveThinkPhase(translationUnitsPool[currentTranslationUnitArrayIndex]);
                var newPhase = new Phase(buildPhaseNameString(globalCurrentTranslationUnitIndex, (translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhasesCount + 1)), $.processName, new Date(), $.jobId, $.currentUserId, $.tool, $.tooldId);
                translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases.push(newPhase); 
                ++translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhasesCount;
                currentPhaseArrayIndex = (translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases.length - 1);
                translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].switchTimeStampList[0] = $.globalRevisionInitTime;

                translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].switchTimeStampList.push(new Date());

                isNewPhaseCreatedForThisRevision = true;
                }
                $.lockCustomInterfacePhaseCreation = false;*/
                /*old approach*/

                /*new approach - if no segment revision is created by checking the flag 'isNewPhaseCreatedForThisRevision' we assume a thinking phase is in place*/
                if (!$.lockCustomInterfacePhaseCreation) {
                    currentPhaseArrayIndex = (translationUnitsPool[currentTranslationUnitArrayIndex].thinkPhases.length - 1);
                    //translationUnitsPool[currentTranslationUnitArrayIndex].thinkPhases[currentPhaseArrayIndex].switchTimeStampList[0] = $.globalThinkPhaseInitTime; ???? the start time for the 1th think phase is set when the phase is created.
                    translationUnitsPool[currentTranslationUnitArrayIndex].thinkPhases[currentPhaseArrayIndex].switchTimeStampList.push(new Date());

                }
                $.lockCustomInterfacePhaseCreation = false;
                /*new approach*/
            }
        }

        $.injectSwitchButtonBehaviour = function () {
            debugger;
            $('.slider-button').unbind();
            $.lockCustomInterfacePhaseCreation = true;
            //var localConfigurationId = $.localStorage.getItem("AcceptPostEditConfigurationId");
            //if (localConfigurationId != null && (parseInt(localConfigurationId) === 1 || parseInt(localConfigurationId) === 2))
            //$.configurationId = localConfigurationId.toString();
            if ($.configurationId == "2") {
                //$("#divSourceTextContainer_").css("display", "none");
                //$("#imgMinimize_").css("display", "none");
                //$("#imgMaximize_").css("display", "inline");
                $("#sourceTextArea_").css("display", "none");
                //$('.slider-button').addClass('on').html('Show');
                $('.slider-button').toggle(function () {
                    $("#sourceTextArea_").css("display", "none");
                    $("#labelOriginalSentence_").css("display", "none");
                    $(this).removeClass('on').html($.labelShowSource);
                    //$.localStorage.plugin.removeItem("AcceptPostEditConfigurationId");
                    //$.localStorage.setItem("AcceptPostEditConfigurationId", "2");
                    $.processName = "monolingual";
                    addSwitchAction();
                }, function () {
                    $(this).addClass('on').html($.labelHideSource);
                    $("#sourceTextArea_").css("display", "block");
                    $("#labelOriginalSentence_").css("display", "inline");
                    //$.localStorage.plugin.removeItem("AcceptPostEditConfigurationId");
                    //$.localStorage.setItem("AcceptPostEditConfigurationId", "1");
                    $.processName = "bilingual";
                    addSwitchAction();
                });
            }
            else {
                //$("#divSourceTextContainer_").css("display", "block");
                //$("#imgMinimize_").css("display", "inline");
                //$("#imgMaximize_").css("display", "none");
                $("#sourceTextArea_").css("display", "block");
                //$('.slider-button').addClass('on').html('Hide');
                $('.slider-button').toggle(function () {

                    $(this).addClass('on').html($.labelHideSource);
                    $("#sourceTextArea_").css("display", "block");
                    $("#labelOriginalSentence_").css("display", "inline");
                    //$.localStorage.plugin.removeItem("AcceptPostEditConfigurationId");
                    //$.localStorage.setItem("AcceptPostEditConfigurationId", "1");
                    $.processName = "bilingual";
                    addSwitchAction();
                }, function () {

                    $("#sourceTextArea_").css("display", "none");
                    $("#labelOriginalSentence_").css("display", "none");
                    $(this).removeClass('on').html($.labelShowSource);
                    //$.localStorage.plugin.removeItem("AcceptPostEditConfigurationId");
                    //$.localStorage.setItem("AcceptPostEditConfigurationId", "2");
                    $.processName = "monolingual";
                    addSwitchAction();
                });
            }
            $("#divSourceTextContainer_").css("display", "block");
            $('.slider-button').trigger('click');
        }

        var injectConfigurationMenus = function () {

            $("#quickQuestion_").text("");
            $("#notesSelector_").html("");
            $("#notesSelector_").css("display", "none");
            if ($.customInterface == 1) {
                $.injectSwitchButtonBehaviour();
            }
            else {
                if ($.configurationId == "2")
                    $("#divSourceTextContainer_").css("display", "none");
                else {
                    $("#divSourceTextContainer_").css("display", "block");
                    $(".slider-frame").css("display", "none");
                }
            }

            if ($.question != "" && $.questionId != "") {
                $("#quickQuestion_").text($.question);
            }

            //$("#notesSelector_").append('<option value="selectOption">' + 'Select Comment...' + '</option>');
            if ($.editOptions != null && $.editOptions.length > 0) {
                for (var i = 0; i < $.editOptions.length; i++)
                    $("#notesSelector_").append('<option value="' + $.editOptions[i] + '">' + $.editOptions[i] + '</option>');


                $("#notesSelector_").css("display", "inline");
            }

        }

        var cleanAllHTML = function () {
            //jQuery('[attribute^="value"]')
            $(document.body).find('div[id^="current_page"]');
            $(document.body).find('div[id^="show_per_page"]');
        }

        var loadTextEditor = function (preEditTargetLanguage) {
            $('#targetTextArea_').tinymce({
                theme_advanced_buttons1: "separator,undo,redo,separator",
                theme_advanced_resizing: false,
                theme_advanced_buttons2: "",
                theme_advanced_buttons3: "",
                theme_advanced_buttons4: "",
                theme_advanced_toolbar_location: "bottom",
                theme_advanced_toolbar_align: "left",
                theme_advanced_toolbar_align: "center",
                theme_advanced_statusbar_location: "",
                theme: "advanced",
                entity_encoding: "raw",
                setup: function (ed) {
                    ed.onKeyUp.add(function (ed, e) {

                        //alert('Key up event: ' + e.keyCode);
                        //metadata
                        //the pool index starts in zero and the global postion start from one
                        var currentTranslationUnitArrayIndex = (globalCurrentTranslationUnitIndex - 1);
                        //the user navigated to other text segment, so a new Phase needs to be created
                        if (!isNewPhaseCreatedForThisRevision) {
                            //think phase
                            saveThinkPhase(translationUnitsPool[currentTranslationUnitArrayIndex]);
                            var newPhase = new Phase(buildPhaseNameString(globalCurrentTranslationUnitIndex, (translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhasesCount + 1)), $.processName, new Date(), $.jobId, $.currentUserId, $.tool, $.tooldId);
                            translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases.push(newPhase);
                            ++translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhasesCount;
                            isNewPhaseCreatedForThisRevision = true;
                        }

                        var currentPhaseArrayIndex = (translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases.length - 1);
                        //new metric for time frame user actually started typing some text
                        if (translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].startTyping == null)
                            translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].startTyping = new Date();

                        switch (e.keyCode) {
                            case 8: { ++translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].numberOfDeleteKeysPressed; } break;
                            case 46: { ++translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].numberOfDeleteKeysPressed; } break;
                            case 32: { ++translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].numberOfWhiteKeysPressed; } break;
                            case 35: { ++translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].numberOfArrowKeysPressed }; break;
                            case 36: { ++translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].numberOfArrowKeysPressed }; break;
                            case 37: { ++translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].numberOfArrowKeysPressed }; break;
                            case 38: { ++translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].numberOfArrowKeysPressed }; break;
                            case 39: { ++translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].numberOfArrowKeysPressed }; break;
                            case 40: { ++translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].numberOfArrowKeysPressed }; break;
                            default:
                                {
                                    //non white key pressed
                                    var inp = String.fromCharCode(e.keyCode);
                                    if (/[a-zA-Z0-9-_‘@,.;:!"“”£$%^&*()+={}\][<>~]/.test(inp)) {
                                        ++translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].numberOfNonWhiteKeysPressed;
                                        //alert("input was a letter, number, hyphen, underscore or space");
                                    }
                                } break;
                        }

                        //total number of keys pressed
                        ++translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].numberOfKeysPressed;
                        checkIfTargetTextChanged();

                    });

                },
                init_instance_callback: function (ed) {

                    $.AcceptTinyMceEditor = ed;
                    ed.undoManager.onUndo.add(function (man, level) {

                        if ($.displayTranslationOptions)
                            $.addTargetOptions(globalCurrentTranslationUnitIndex - 1);

                        undo = level;
                    });

                    ed.undoManager.onRedo.add(function (man, level) {

                        if ($.displayTranslationOptions)
                            $.addTargetOptions(globalCurrentTranslationUnitIndex - 1);
                        redo = level;
                    });
                }
            });

            if (preEditTargetLanguage.length > 0 && settings.addPreEditPlugin) {
                $("#targetTextArea_").Accept({
                    configurationType: 'contextMenu',
                    AcceptServerPath: settings.preEditServerPath,
                    imagesPath: settings.preEditImagesPath,
                    ApiKey: settings.preEditApiKey,
                    Lang: preEditTargetLanguage,
                    requestFormat: settings.preEditRequestFormat,
                    //dialogHeight: settings.preEditHeight,
                    //dialogWidth: settings.preEditWidth,
                    languageUi: settings.preEditLanguageUI,
                    styleSheetPath: settings.preEditStyleSheetPath,
                    LoadInputText: function () {
                        try {
                            ;
                            //var inputText = tinymce.get('targetTextArea_').getContent();
                            var inputText = $("#targetTextArea_").text();
                            return inputText;
                        }
                        catch (error) {
                            return "";
                        }
                    },
                    SubmitInputText: function (text) {
                        $('#targetTextArea_').html(text);
                        try {
                            $.AcceptTinyMceEditor.execCommand("mceAddUndoLevel", false, null);
                        }
                        catch (error) {
                        }
                        //after replacing the target text translation options need to be rebuilt
                        if ($.displayTranslationOptions)
                            $.addTargetOptions(globalCurrentTranslationUnitIndex - 1);
                    }
                });

                setTimeout(function () {
                    checkIfTargetTextChanged();
                    $.injectAcceptButtonPostEdit("#targetTextArea__toolbar1 tr:last", '#tdTarget_', '<td id="tdTarget_" style="position:relative;" title="' + $.labelPreEditTitle.toString() + '"><a role="button" tabindex="-1"><img id="myPostEditInjectedImage" class="mceIcon" style="cursor:pointer!important;" src="' + settings.imagesPath + '/actions-tools-check-spelling-icon.png" alt="' + $.labelPreEditTitle.toString() + '"></a></td>', 100);
                    $.addTargetOptions(0);

                }, 400);

                setTimeout(function () {
                    $('#myPostEditInjectedImage').click(function () {
                        //metadata
                        //the pool index starts in zero and the global postion start from one
                        var currentTranslationUnitArrayIndex = (globalCurrentTranslationUnitIndex - 1);
                        //the user navigated to other text segment, so a new Phase needs to be created
                        if (!isNewPhaseCreatedForThisRevision) {
                            //think phase
                            saveThinkPhase(translationUnitsPool[currentTranslationUnitArrayIndex]);
                            var newPhase = new Phase(buildPhaseNameString(globalCurrentTranslationUnitIndex, (translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhasesCount + 1)), $.processName, new Date(), $.jobId, $.currentUserId, $.tool, $.tooldId);
                            translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases.push(newPhase);
                            ++translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhasesCount;
                            isNewPhaseCreatedForThisRevision = true;
                        }
                        var currentPhaseArrayIndex = (translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases.length - 1);
                        ++translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].numberOfGrammarChecks;
                        //checkIfTargetTextChanged();
                        //metadata
                    });
                }, 800);

            }


        }

        //syncConnection();
        initAcceptPostEdit();

    } //end main plug-in function

})(jQuery);                                                                                                 //end plugin


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

var cleanPluginData = function () {
    $('#targetTextArea_').dialog("close");
    $('#targetTextArea_').dialog("destroy");
    $('#editedContent_').empty();
    $('#divMain_').empty(); //$('#divMain_ DIV').remove();
    $('#autoSaveCheckBox_').attr('checked', false);
    $(".targetOptionContextWrapper").remove();
    $('#divSourceMain_ P').remove();
    try {
        tinyMCE.get('targetTextArea_').remove();
    } catch (e) { }
    $("#divMainContainer").css("display", "none");
    $("#divDocumentBlockedContainer").css("display", "none");
    $("#divLoadingContainer").css("display", "block");

    $("#divLoadingContainer").css("display", "block");
    $("#divDocumentBlockedContainer").css("display", "none");
    $("#divMainContainer").css("display", "none");

}


var createPluginOptionButtons = function () {

    //save button creation
    $('#btnSave_').button();
    $('#btnSave_').button("disable");
    //save button css
    $('#btnSave_').css('font-size', '0.7em');

    $('#btnSave_').click(function () {
        $('#editedContent_ DIV.postedit-highlight').text($('#targetTextArea_').text()); //$('#editedContent_ SPAN.postedit-highlight').text($('#targetTextArea_').text());

    });

    //auto save check box event
    $('#autoSaveCheckBox_').click(function () {

        $('#btnSave_').button("option", "disabled", this.checked);

    });

    //submit comment button creation
    $('#btnSubmitComment_').button();
    //submit comment button css
    $('#btnSubmitComment_').css('font-size', '0.7em');
    //close button css
    //    $('#closeDialog_').css('font-size', '0.7em');
    //    $('#btn-yes_').css('font-size', '0.7em');
    //    $('#btn-no_').css('font-size', '0.7em');
}


/* EXTERNAL METHODS ??? */

var previous = function (paginationContainerId) {
    new_page = parseInt($('#current_page').val()) - 1;
    //if there is an item before the current active link run the function
    if ($('.active_page').prev('.page_link').length == true) {
        go_to_page(new_page, paginationContainerId);
    }
}

var next = function (paginationContainerId) {
    new_page = parseInt($('#current_page').val()) + 1;
    //if there is an item after the current active link run the function
    if ($('.active_page').next('.page_link').length == true) {
        go_to_page(new_page, paginationContainerId);
    }
}

function createThinkPhase(revisionIndex) {
    debugger;
    var currentTranslationUnitArrayIndex = revisionIndex; // (globalCurrentTranslationUnitIndex - 1);

    if (translationUnitsPool[currentTranslationUnitArrayIndex].thinkPhases.length > 0)
        if (translationUnitsPool[currentTranslationUnitArrayIndex].thinkPhases[translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitThinkPhasesCount - 1].alreadySent == false)
            return;
    //console.log(">>creating think phase:" + (revisionIndex + 1));
    var newThinkPhase = new Phase(buildThinkPhaseNameString(/*globalCurrentTranslationUnitIndex*/(revisionIndex + 1), (translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitThinkPhasesCount + 1)), $.processName, new Date(), $.jobId, $.currentUserId, $.tool, $.tooldId);
    translationUnitsPool[currentTranslationUnitArrayIndex].thinkPhases.push(newThinkPhase);
    ++translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitThinkPhasesCount;
    isNewThinkingPhaseCreatedForThisRevision = true;
}

function saveThinkPhase(translationUnit) {
    try {
        debugger;
        if (translationUnit.thinkPhases[(translationUnit.translationUnitThinkPhasesCount - 1)].alreadySent == false) {
            translationUnit.thinkPhases[(translationUnit.translationUnitThinkPhasesCount - 1)].phaseEndTime = new Date();
            var jsonForCompletePhaseList = buildCompleteTranslationRevisionPhaseJSON($.textId, $.currentUserId, translationUnit.index, new Date(), translationUnit.state, translationUnit.source, translationUnit.target, translationUnit.thinkPhases[(translationUnit.translationUnitThinkPhasesCount - 1)], buildCountsList(translationUnit.thinkPhases[(translationUnit.translationUnitThinkPhasesCount - 1)]));
            if (jsonForCompletePhaseList != null && jsonForCompletePhaseList.length > 0) {
                $.submitRevision(jsonForCompletePhaseList);
                //console.log(">>saving think phase:" + translationUnit.index);                
                //console.log("content:" + $.trim(jsonForCompletePhaseList));                
            }
            //think phase
            $.globalThinkPhaseInitTime = new Date();
            translationUnit.thinkPhases[(translationUnit.translationUnitThinkPhasesCount - 1)].alreadySent = true;

        }
    }
    catch (e) { }
}

function saveRevision(translationUnit, createThinkPhase) {
    try {
        debugger;
        //(only if the text changed ???) -> We need to discuss what are the rules to send or not to send a phase
        if (translationUnit.translationUnitPhases[(translationUnit.translationUnitPhasesCount - 1)].alreadySent == false) {
            var jsonForCompletePhaseList = buildCompleteTranslationRevisionPhaseJSON($.textId, $.currentUserId, translationUnit.index, new Date(), translationUnit.state, translationUnit.source, translationUnit.target, translationUnit.translationUnitPhases[(translationUnit.translationUnitPhasesCount - 1)], buildCountsList(translationUnit.translationUnitPhases[(translationUnit.translationUnitPhasesCount - 1)]));
            if (jsonForCompletePhaseList != null && jsonForCompletePhaseList.length > 0)
                $.submitRevision(jsonForCompletePhaseList);
            //console.log(">>sending revision phase:" + translationUnit.index); 

            translationUnit.translationUnitPhases[(translationUnit.translationUnitPhasesCount - 1)].alreadySent = true;
            //reset revision global start date/time -> used only for the display "source" action.
            $.globalRevisionInitTime = new Date();
            //reset switch button behavior
            //if ($.customInterface == 1) {
            //    $.injectSwitchButtonBehaviour();
            //}        

            //think phase
            debugger;
            if (createThinkPhase) {
                createThinkPhase((globalCurrentTranslationUnitIndex - 1));
            }
        }
    }
    catch (e) { }
}


var saveBeforeExit = function () {
    try {
        //update global time   
        var uniqueSaveBeforeExitEndTime = $.globalEndTime = new Date();

        //we dont update the document last update time.
        //if ($.globalStartTime != null && $.globalEndTime != null) {
        //    var difference = ($.globalEndTime - $.globalStartTime) / 1000;
        //    if (difference != null && difference > 0)
        //        $.updateDocumentEditingTime(difference);
        //}
        //we dont update the document last update time.

        $.globalStartTime = new Date();
        $.globalEndTime = null;

        //array index for the current translation unit (which is also the last the user is going to edit)
        var currentArrayIndexForTranslationUnit = (globalCurrentTranslationUnitIndex - 1);
        //array index for the last phase under the previous translation unit
        var currentArrayIndexForTheLastPhaseAdded = (translationUnitsPool[currentArrayIndexForTranslationUnit].translationUnitPhases.length - 1);

        //add any notes in the comments box to the previous unit translation / phase        
        if ($.trim($("#commentsTextArea_").val()).length > 0)// && ($("#commentsTextArea_").val() != translationUnitsPool[currentArrayIndexForTranslationUnit].lastComment))// && translationUnitsPool[currentArrayIndexForTranslationUnit].translationUnitPhases.length > 0) {
        {
            /*old approach - we create a new segment revision phase to add the Note */
            /*//send comment in a new phase (without metrics) where the user just did a comment without changing the segment text
            if ($("#commentsTextArea_").val() != translationUnitsPool[currentArrayIndexForTranslationUnit].lastComment && (translationUnitsPool[currentArrayIndexForTranslationUnit].translationUnitPhases.length == 0 || translationUnitsPool[currentArrayIndexForTranslationUnit].translationUnitPhases[currentArrayIndexForTheLastPhaseAdded].alreadySent)) 
            {           
            saveThinkPhase(translationUnitsPool[currentTranslationUnitArrayIndex]);
            var newPhase = new Phase(buildPhaseNameString(globalPreviousTranslationUnitIndex, (translationUnitsPool[currentArrayIndexForTranslationUnit].translationUnitPhasesCount + 1)), $.processName, new Date(), $.jobId, $.currentUserId, $.tool, $.tooldId);
            translationUnitsPool[currentArrayIndexForTranslationUnit].translationUnitPhases.push(newPhase);
            ++translationUnitsPool[currentArrayIndexForTranslationUnit].translationUnitPhasesCount;
            //update index for the count of phases of the previous translation segment
            currentArrayIndexForTheLastPhaseAdded = (translationUnitsPool[currentArrayIndexForTranslationUnit].translationUnitPhases.length - 1);
            translationUnitsPool[currentArrayIndexForTranslationUnit].translationUnitPhases[currentArrayIndexForTheLastPhaseAdded].phaseNotes.push(new Note("general", "user", $("#commentsTextArea_").val()));                       
            }
            else
            if (translationUnitsPool[currentArrayIndexForTranslationUnit].translationUnitPhases.length > 0) {
            //(foo == 'bob') ? 'bob' : 'joe';           
            translationUnitsPool[currentArrayIndexForTranslationUnit].translationUnitPhases[currentArrayIndexForTheLastPhaseAdded].phaseNotes.push(new Note("general", "user", $("#commentsTextArea_").val()));
            }*/
            /*old approach*/

            /*new approach - instead of create a new segment revision for this pending Note we add it to the current think phase*/
            debugger;
            if (isNewPhaseCreatedForThisRevision) {
                if ($("#commentsTextArea_").val() != translationUnitsPool[currentArrayIndexForTranslationUnit].lastComment)
                    translationUnitsPool[currentArrayIndexForTranslationUnit].translationUnitPhases[currentArrayIndexForTheLastPhaseAdded].phaseNotes.push(new Note("general", "user", $("#commentsTextArea_").val()));
            }
            else {
                if ($("#commentsTextArea_").val() != translationUnitsPool[currentArrayIndexForTranslationUnit].lastComment)
                    translationUnitsPool[currentArrayIndexForTranslationUnit].thinkPhases[translationUnitsPool[currentArrayIndexForTranslationUnit].thinkPhases.length - 1].phaseNotes.push(new Note("general", "user", $("#commentsTextArea_").val()));
            }
            /*new approach*/
            //always need to update the last comment for each segment
            translationUnitsPool[currentArrayIndexForTranslationUnit].lastComment = $("#commentsTextArea_").val();

            $("#commentsTextArea_").val("");
        }
        debugger;
        if (translationUnitsPool[currentArrayIndexForTranslationUnit].translationUnitPhases.length > 0) {
            //need to update the last phase of the last segment with the final timestamp (phaseEndTime)
            translationUnitsPool[currentArrayIndexForTranslationUnit].translationUnitPhases[currentArrayIndexForTheLastPhaseAdded].phaseEndTime = uniqueSaveBeforeExitEndTime;  //new Date();
            //var checkBefore = translationUnitsPool[currentArrayIndexForTranslationUnit].target;
            //update the translation unit object with the last text in the target text area (like we do on the right column)
            translationUnitsPool[currentArrayIndexForTranslationUnit].target = $('#targetTextArea_').text().replace("&lt;", "<").replace("&gt;", ">");
            //submit the last phase revision to the server       
            saveRevision(translationUnitsPool[currentArrayIndexForTranslationUnit], false);
        }
        debugger;
        //think phase
        //translationUnitsPool[currentArrayIndexForTranslationUnit].thinkPhases[translationUnitsPool[currentArrayIndexForTranslationUnit].thinkPhases.length - 1].phaseEndTime = uniqueSaveBeforeExitEndTime; // >>it is being set under SaveThinkPhase
        saveThinkPhase(translationUnitsPool[currentArrayIndexForTranslationUnit]);
    } catch (e) { }
}

var go_to_page = function (page_num, paginationContainerId) {
    debugger;


    try {
        $.AcceptTinyMceEditor.undoManager.clear();
        //$.AcceptTinyMceEditor.execCommand("mceAddUndoLevel", false, null);
    }
    catch (e) { }

    //metadata
    $('#notesSelector_>option:nth-child(1)').attr('selected', true);
    var previousIndexHelper = $('#editedContent_ DIV.postedit-highlight').attr("id").split('_'); //$('#editedContent_ span.postedit-highlight').attr("id").split('_');
    globalPreviousTranslationUnitIndex = parseInt(previousIndexHelper[1]);
    globalCurrentTranslationUnitIndex = page_num + 1; // pagination index start in zero


    //think phase
    if (globalPreviousTranslationUnitIndex != globalCurrentTranslationUnitIndex) {

        if ($.trim($("#commentsTextArea_").val()).length > 0) {
            if (!isNewPhaseCreatedForThisRevision && $("#commentsTextArea_").val() != translationUnitsPool[globalPreviousTranslationUnitIndex - 1].lastComment)
                translationUnitsPool[globalPreviousTranslationUnitIndex - 1].thinkPhases[translationUnitsPool[globalPreviousTranslationUnitIndex - 1].thinkPhases.length - 1].phaseNotes.push(new Note("general", "user", $("#commentsTextArea_").val()));

            translationUnitsPool[globalPreviousTranslationUnitIndex - 1].lastComment = $("#commentsTextArea_").val();
            $("#commentsTextArea_").val("");
        }
        //update revision ddl with new segment old revisions
        $.updateRevisionHistory(page_num);
    }

    saveThinkPhase(translationUnitsPool[globalPreviousTranslationUnitIndex - 1]);
    createThinkPhase(page_num);

    //persist drop down list
    $.changeOptionsSelector(translationUnitsPool[globalCurrentTranslationUnitIndex - 1].lastOption);

    //if previous index and current index are different then means the user is probably about to enter in a new revision cycle
    if (globalPreviousTranslationUnitIndex != globalCurrentTranslationUnitIndex) {
        //array index for the last translation unit
        var currentArrayIndexForTranslationUnit = (globalPreviousTranslationUnitIndex - 1);
        //array index for the last phase under the previous translation unit
        var currentArrayIndexForTheLastPhaseAdded = (translationUnitsPool[currentArrayIndexForTranslationUnit].translationUnitPhases.length - 1);
        //add any notes in the comments box to the previous unit translation / phase        
        if ($.trim($("#commentsTextArea_").val()).length > 0)// && ($("#commentsTextArea_").val() != translationUnitsPool[currentArrayIndexForTranslationUnit].lastComment))// && translationUnitsPool[currentArrayIndexForTranslationUnit].translationUnitPhases.length > 0) {
        {

            /*old approach*/
            //send comment in a new phase (without metrics) where the user just did a comment without changing the segment text
            /*if ($("#commentsTextArea_").val() != translationUnitsPool[currentArrayIndexForTranslationUnit].lastComment && (translationUnitsPool[currentArrayIndexForTranslationUnit].translationUnitPhases.length == 0 || translationUnitsPool[currentArrayIndexForTranslationUnit].translationUnitPhases[currentArrayIndexForTheLastPhaseAdded].alreadySent)) {
            //think phase
            saveThinkPhase(translationUnitsPool[currentTranslationUnitArrayIndex]);
            var newPhase = new Phase(buildPhaseNameString(globalPreviousTranslationUnitIndex, (translationUnitsPool[currentArrayIndexForTranslationUnit].translationUnitPhasesCount + 1)), $.processName, new Date(), $.jobId, $.currentUserId, $.tool, $.tooldId);
            translationUnitsPool[currentArrayIndexForTranslationUnit].translationUnitPhases.push(newPhase);
            ++translationUnitsPool[currentArrayIndexForTranslationUnit].translationUnitPhasesCount;
            //update index for the count of phases of the previous translation segment
            currentArrayIndexForTheLastPhaseAdded = (translationUnitsPool[currentArrayIndexForTranslationUnit].translationUnitPhases.length - 1);
            translationUnitsPool[currentArrayIndexForTranslationUnit].translationUnitPhases[currentArrayIndexForTheLastPhaseAdded].phaseNotes.push(new Note("general", "user", $("#commentsTextArea_").val()));
            }
            else
            if (translationUnitsPool[currentArrayIndexForTranslationUnit].translationUnitPhases.length > 0) {
            //(foo == 'bob') ? 'bob' : 'joe';           
            translationUnitsPool[currentArrayIndexForTranslationUnit].translationUnitPhases[currentArrayIndexForTheLastPhaseAdded].phaseNotes.push(new Note("general", "user", $("#commentsTextArea_").val()));
            }*/
            /*old approach*/
            /*new approach*/
            if ($("#commentsTextArea_").val() != translationUnitsPool[currentArrayIndexForTranslationUnit].lastComment) {
                translationUnitsPool[currentArrayIndexForTranslationUnit].translationUnitPhases[currentArrayIndexForTheLastPhaseAdded].phaseNotes.push(new Note("general", "user", $("#commentsTextArea_").val()));
                //clean comments               
            }
            //always need to update the last comment for each segment
            /*new approach*/
            translationUnitsPool[currentArrayIndexForTranslationUnit].lastComment = $("#commentsTextArea_").val();
            $("#commentsTextArea_").val("");
        }

        if (translationUnitsPool[currentArrayIndexForTranslationUnit].translationUnitPhases.length > 0) {

            //need to update the last phase of the last segment with the final timestamp (phaseEndTime)
            translationUnitsPool[currentArrayIndexForTranslationUnit].translationUnitPhases[currentArrayIndexForTheLastPhaseAdded].phaseEndTime = new Date();

            //update the translation unit object with the last text in the target text area (like we do on the right column)
            translationUnitsPool[currentArrayIndexForTranslationUnit].target = $('#targetTextArea_').text().replace("&lt;", "<").replace("&gt;", ">");

            //submit the last phase revision to the server       
            saveRevision(translationUnitsPool[currentArrayIndexForTranslationUnit], true);
        }

        isNewPhaseCreatedForThisRevision = false;

    }

    //metatada



    //save target if auto save is checked
    if ($('#autoSaveCheckBox_').is(":checked")) {


        try {
            //$('#editedContent_ SPAN.postedit-highlight').text(tinymce.get('targetTextArea_').getContent());

            //alert(tinymce.get('targetTextArea_').getContent());
            var textSegment = $('#targetTextArea_').text().replace("&lt;", "<").replace("&gt;", ">");

            if (textSegment.length == 0)
                textSegment = $.labelEmptySegment;


            $('#editedContent_ DIV.postedit-highlight').text(textSegment); //$('#editedContent_ SPAN.postedit-highlight').text(textSegment);
        }
        catch (ex) {

        }
    }


    //get the number of items shown per page              
    var show_per_page = parseInt($('#show_per_page').val());

    //get the element number where to start the slice from
    start_from = page_num * show_per_page;

    //get the element number where to end the slice
    end_on = start_from + show_per_page;

    //hide all children elements of content div, get specific items and show them
    //$('#' + paginationContainerId).children().css('display', 'none').slice(start_from, end_on).css('display', 'block');
    //alert(paginationContainerId);
    $('#' + paginationContainerId).find("div").removeClass('postedit-highlight').slice(start_from, end_on).addClass('postedit-highlight'); //$('#' + paginationContainerId).children().removeClass('postedit-highlight').slice(start_from, end_on).addClass('postedit-highlight');


    /*get the page link that has longdesc attribute of the current page and add active_page class to it
    and remove that class from previously active page link*/
    $('.page_link[longdesc=' + page_num + ']').addClass('active_page').siblings('.active_page').removeClass('active_page');

    //update the current page input field
    $('#current_page').val(page_num);


    displayActiveParagraphs(paginationContainerId);

}




var displayActiveParagraphs = function (paginationContainerId) {

    $('#editedContent_').find('DIV.postedit-highlight').each(function () {//$('#editedContent_').find('SPAN.postedit-highlight').each(function () {        
        var spanIdSplitted = $(this).attr('id').split('_');
        //update comments text area with the last comment for the current segment
        $("#commentsTextArea_").val(translationUnitsPool[(globalCurrentTranslationUnitIndex - 1)].lastComment);
        //update text area text
        //var test = $(this).text().replace("<", "&lt;").replace(">", "&gt;");                
        var newTartgetTextToDisplay = $(this).text();

        if (newTartgetTextToDisplay == $.labelEmptySegment)
            $('#targetTextArea_').val("");
        else
            $('#targetTextArea_').val(newTartgetTextToDisplay.replace("<", "&lt;").replace(">", "&gt;")); // $('#targetTextArea_').val($(this).text().replace("<", "&lt;").replace(">", "&gt;"));


        try {

            $.AcceptTinyMceEditor.execCommand("mceAddUndoLevel", false, null);

        }
        catch (e) { }


        //clean all source sentences 
        $("#sourceOptionsList_ option").remove();

        //get source sentences for the paragraph
        var source = loadSource($(this).attr('id'));
        $('#sourceTextArea_').val(source); //$('#sourceOptionsList_').append(' <option value="1">' + source + '</option>');


        //update name of the text area which contains the paragraph id
        $('#targetTextArea_').attr('name', 'targetTextAreaName_' + spanIdSplitted[1].toString());

        //check if the text area is showed as updated (blue) or not (red)
        checkIfTargetTextChanged(); //$('#targetTextArea_').trigger('keyup');

        //$(this).trigger('click');

        $.addTargetOptions(parseInt(spanIdSplitted[1] - 1));

    });



}

var loadSource = function (parId) {
    //TODO: load the source content for a given paragraph ID.        
    //return "I am the source content for the paragraph ID " + parId;       

    var splittedTargetId = parId.split('_');
    return $('#divSourceMain_ #sourcePar_' + splittedTargetId[1]).text(); //.text();

    // }

    // return "object not found.";
}

var checkIfTargetTextChanged = function () {
    setTimeout(function () {

        var currentTargetTextAreaIdSplitted = $("#targetTextArea_").attr('name').split('_');
        var text1 = $("#targetTextArea_").text();
        var text2 = $('#spanParagraph_' + currentTargetTextAreaIdSplitted[1].toString()).text();
        if (text1 != text2) {
            try {
                $.AcceptTinyMceEditor.execCommand("mceAddUndoLevel", false, null);
            }
            catch (e) {

            }
            $('#targetTextArea__ifr').contents().find('body').css('background-color', '#FFFFFF')
        }
        else {
            $('#targetTextArea__ifr').contents().find('body').css('background-color', '#FFFFFF'); //EFF0F2                    
        }



    }, 100);


}

var buildRegex = function (pat) {

    var regex;
    try {
        if (pat == "." || pat == "!" || pat == "?")
            regex = new RegExp("\\b\\.", "g");
        else
            regex = new RegExp("(^|\\W)" + pat.toString() + "\\W", "g"); //regex = new RegExp("\\b" + pat.toString() + "\\b", "g");

    } catch (e) {
        //console.log("buildRegex_exception:"+e.toString());
        //console.log("buildRegex_context:" + pat);
        regex = new RegExp("\\b\\.", "g");
    }

    return regex;
}


/* HIGHLIGHT OPTIONS */
jQuery.fn.highlightTargetOptions = function (pat, elementId, menuOptions, currentIndex) {

    //regular expression that will match the options set context    
    var regex = buildRegex(pat);

    //when there are more than on context matched by the regular expression we need to create a new menu for each and give it a different id
    var menusCount = 0;
    var totalIndexHelper = 0;

    function innerHighlight(node, pat) {
        var skip = 0;
        if (node.nodeType == 3) {
            var textInNode = node.data + " ";
            while (m = regex.exec(textInNode)) {
                //create new node in the text editor iframe to fork the options menu
                var spannode;
                var middlebit;
                //var correctMatchedIndex;				
                if (m.index == 0 && (node.data.substring(m.index, pat.length) == pat)) {
                    spannode = document.createElement("SPAN");
                    spannode.className = "highlightOption";
                    spannode.id = elementId + "_" + menusCount.toString() + "_" + totalIndexHelper.toString();
                    middlebit = node.splitText(m.index); //var middlebit = node.splitText(m.index);
                    ++totalIndexHelper;
                    //correctMatchedIndex = m.index;										
                }
                else {
                    var charAt = encodeURIComponent(node.data.charAt(m.index));
                    if (charAt == "%A0" || charAt == "%20") {  //if (node.data.charAt(m.index) == " ") {
                        spannode = document.createElement("SPAN");
                        spannode.className = "highlightOption";
                        spannode.id = elementId + "_" + menusCount.toString() + "_" + totalIndexHelper.toString();
                        middlebit = node.splitText(m.index + 1);

                        ++totalIndexHelper;

                        //correctMatchedIndex = (m.index + 1);
                    }
                    else {
                        continue;
                    }
                }

                var endbit = middlebit.splitText(pat.length);
                var middleclone = middlebit.cloneNode(true);
                spannode.appendChild(middleclone);
                middlebit.parentNode.replaceChild(spannode, middlebit);
                //add new conxtext menu for each new target option matched
                $(document.body).append('<div id="targetContextMenu_' + currentIndex.toString() + '_' + menusCount.toString() + '" class="targetOptionContextWrapper" style="display:none"><ul></ul></div>');
                //add all options available for the new options menu
                for (var j = 0; j < menuOptions.length; j++) {

                    $("#targetContextMenu_" + currentIndex.toString() + "_" + menusCount.toString() + " ul").append('<li id="targetOption_' + j.toString() + '_' + spannode.id.toString() + '">' + menuOptions[j].phrase + '</li>'); //currentIndex.toString()
                }

                //bind all events related with menus options
                $("#targetContextMenu_" + currentIndex.toString() + "_" + menusCount.toString() + " ul li").click(function () {
                    //metadata
                    //the pool index starts in zero and the global postion start from one
                    var currentTranslationUnitArrayIndex = (globalCurrentTranslationUnitIndex - 1);
                    //the user navigated to other text segment, so a new Phase needs to be created
                    if (!isNewPhaseCreatedForThisRevision) {
                        //think phase
                        saveThinkPhase(translationUnitsPool[currentTranslationUnitArrayIndex]);
                        var newPhase = new Phase(buildPhaseNameString(globalCurrentTranslationUnitIndex, (translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhasesCount + 1)), $.processName, new Date(), $.jobId, $.currentUserId, $.tool, $.tooldId);
                        translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases.push(newPhase);
                        ++translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhasesCount;
                        isNewPhaseCreatedForThisRevision = true;
                    }

                    var currentPhaseArrayIndex = (translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases.length - 1);
                    ++translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].numberOfTranslationOptionsUsed;
                    //<note annotates='target' from='trans_options'>Hat|||Ist|||0</note>                    
                    var idCurrentTargetOption = spannode.id.split('_'); //$('#targetTextArea__ifr').contents().find("#" + spannode.id).attr("Id").split('_');
                    var listOfIndexes = [];
                    var context = pat;

                    var regex = buildRegex(pat);
                    while (m = regex.exec(translationUnitsPool[currentTranslationUnitArrayIndex].target + " ")) {

                        if (m.index > 0)
                            listOfIndexes.push((m.index + 1)); // listOfIndexes.push((correctMatchedIndex + 1));  //listOfIndexes.push(m.index);
                        else
                            listOfIndexes.push((m.index));
                    }

                    var indexFinal = listOfIndexes[idCurrentTargetOption[2]];
                    translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].phaseNotes.push(new Note("target", "trans_options", '' + $('#targetTextArea__ifr').contents().find("#" + spannode.id).text() + '|||' + $(this).text() + '|||' + indexFinal.toString()));
                    //<note annotates='target' from='trans_options'>Hat|||Ist|||0</note>      

                    checkIfTargetTextChanged();
                    //metadata
                    $('#targetTextArea__ifr').contents().find("#" + spannode.id).text($(this).text());

                    $(".targetOptionContextWrapper").css('display', 'none');

                });

                //update the menus counter for this target option
                ++menusCount;

            } //end while

            skip = 1;

        }
        else if (node.nodeType == 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
            for (var i = 0; i < node.childNodes.length; ++i) {
                i += innerHighlight(node.childNodes[i], pat);
            }
        }
        return skip;
    }
    return this.each(function () {
        innerHighlight(this, pat); //innerHighlight(this, pat.toUpperCase());
    });
};

jQuery.fn.removeHighlightTargetOptions = function () {
    return this.find("span.highlightOption").each(function () {
        this.parentNode.firstChild.nodeName;
        with (this.parentNode) {
            replaceChild(this.firstChild, this);
            normalize();
        }
    }).end();
};


/* Post Edit Audit Objects */

var globalCurrentTranslationUnitIndex = 1;
var globalPreviousTranslationUnitIndex = 1;
var isNewPhaseCreatedForThisRevision = false;
//think phase
var isNewThinkingPhaseCreatedForThisRevision = false;
translationUnitsPool = [];

var startPePhase = null;

function Note(annotates, from, value) {
    this.annotates = annotates;
    this.from = from;
    this.value = value;
}

function buildCountsList(phase) {

    var countsList = [];

    if (phase.numberOfKeysPressed > 0)
        countsList.push(new Count("N.A.", "x-keys", "instance", phase.numberOfKeysPressed));

    if (phase.numberOfDeleteKeysPressed > 0)
        countsList.push(new Count("N.A.", "x-delete-keys", "instance", phase.numberOfDeleteKeysPressed));

    if (phase.numberOfWhiteKeysPressed > 0)
        countsList.push(new Count("N.A.", "x-white-keys", "instance", phase.numberOfWhiteKeysPressed));

    if (phase.numberOfNonWhiteKeysPressed > 0)
        countsList.push(new Count("N.A.", "x-nonwhite-keys", "instance", phase.numberOfNonWhiteKeysPressed));

    if (phase.numberOfArrowKeysPressed > 0)
        countsList.push(new Count("N.A.", "x-arrow-keys", "instance", phase.numberOfArrowKeysPressed));

    debugger;
    if (phase.phaseStartTime != null && phase.phaseEndTime != null) {
        var difference = (phase.phaseEndTime - phase.phaseStartTime) / 1000;
        phase.phaseName.indexOf("r") > -1 ? countsList.push(new Count("N.A.", "x-editing-time", "x-seconds", difference)) : countsList.push(new Count("N.A.", "x-think-time", "x-seconds", difference));

    }

    if (phase.numberOfTranslationOptionsUsed > 0)
        countsList.push(new Count("N.A.", "x-trans-options-usage", "instance", phase.numberOfTranslationOptionsUsed));


    if (phase.numberOfGrammarChecks > 0)
        countsList.push(new Count("N.A.", "x-checking-usage", "instance", phase.numberOfGrammarChecks));

    if (phase.switchTimeStampList.length > 1) {
        countsList.push(new Count("N.A.", "x-start_source_switch", "instance", phase.startSwitch));
        countsList.push(new Count("N.A.", "x-source_switch", "instance", (phase.switchTimeStampList.length - 1)));

        for (var i = 1; i < phase.switchTimeStampList.length; i++) {
            var difference = (phase.switchTimeStampList[i] - phase.switchTimeStampList[i - 1]) / 1000;
            //var difference2 = (phase.switchTimeStampList[i].getTime() - phase.switchTimeStampList[i - 1].getTime()) / 1000;
            countsList.push(new Count("N.A.", "x-source_switch", "x-seconds", difference));
        }
    }

    //new metric for time frame user actually started typing some text
    if (phase.startTyping != null && phase.phaseEndTime != null) {
        var difference = (phase.phaseEndTime - phase.startTyping) / 1000;
        countsList.push(new Count("N.A.", "x-typing-time", "x-seconds", difference));
    }

    return countsList;

}

function Phase(phaseName, processName, date, jobId, contactEmail, tool, toolId) {
    this.phaseName = phaseName;
    this.processName = processName;
    this.date = date;
    this.jobId = jobId;
    this.contactEmail = contactEmail;
    this.tool = tool;
    this.toolId = toolId;

    this.alreadySent = false;
    this.phaseNotes = [];
    //x-editing-time
    this.phaseStartTime = new Date();
    this.phaseEndTime = null;
    //x-assessing-time 
    //???
    //x-keys
    this.numberOfKeysPressed = 0;
    //x-white-keys
    this.numberOfWhiteKeysPressed = 0;
    //x-nonwhite-keys
    this.numberOfNonWhiteKeysPressed = 0;
    //x-arrow-keys (↑,↓,→,←, End, Home )
    this.numberOfArrowKeysPressed = 0;
    //x-delete-keys (delete or backspace)
    this.numberOfDeleteKeysPressed = 0;
    //x-other-keys
    this.numberOfOtherKeysPressed = 0;
    /*
    //x-deletion        
    1) user marks something with the mouse, then starts to type, presses the delete or backspace key or CTRL+X
    2) user presses delete key repeatedly
    3) user presses backspace key repeatedly
    4) user presses combination of backspace and delete key
    -> the break between two keys should not be longer than        
    */
    this.numberOfDeletions = 0;
    /*
    //x-insertion
    User types combination of alphanumeric keys or uses CTRL+V
    -> break between two keys should not be longer than 1 second (TBC)
    -> once they use the arrow keys or click somewhere else with the mouse, the insertion ends        
    */
    this.numberOfInsertions = 0;
    //x-trans-options-usage
    this.numberOfTranslationOptionsUsed = 0;
    //x-checking-usage
    this.numberOfGrammarChecks = 0;
    //start switch   
    this.startSwitch = $.processName == "bilingual" ? "show" : "hide";
    this.switchTimeStampList = [new Date()];
    //new metric for time frame user actually started typing some text
    this.startTyping = null;

}

function Count(countPhaseName, countType, unit, value) {
    this.countPhaseName = countPhaseName;
    this.countType = countType;
    this.unit = unit;
    this.value = value;
}


function TranslationUnit(index, state, phaseName, source, target, lastComment, lastOption) {
    this.index = index;
    this.state = state;
    this.phaseName = phaseName;
    this.source = source;
    this.target = target;
    this.translationUnitPhases = [];
    this.translationUnitPhasesCount = 0;
    this.lastComment = lastComment;
    //persist drop down list
    this.lastOption = lastOption;

    //think phase
    this.thinkPhases = [];
    this.translationUnitThinkPhasesCount = 0;
}

function buildPhaseNameString(segmentIndex, revisionNumber) {
    return "r" + segmentIndex.toString() + "." + revisionNumber.toString();
}

//think phase
function buildThinkPhaseNameString(segmentIndex, revisionNumber) {
    return "t" + segmentIndex.toString() + "." + revisionNumber.toString();
}





function buildCompleteTranslationRevisionPhaseJSON(textId, userId, segmentIndex, timeStamp, state, source, target, currentPhase, listOfPhaseCounts) {
    if ($.userBrowser.msie) {

        var phaseDateString = currentPhase.date.getUTCFullYear() + "/" + (currentPhase.date.getUTCMonth() + 1) + "/" + currentPhase.date.getUTCDate() + " " + currentPhase.date.getUTCHours() + ":" + currentPhase.date.getUTCMinutes() + ":" + currentPhase.date.getUTCSeconds();
        var timeStampString = timeStamp.getUTCFullYear() + "/" + (timeStamp.getUTCMonth() + 1) + "/" + timeStamp.getUTCDate() + " " + timeStamp.getUTCHours() + ":" + timeStamp.getUTCMinutes() + ":" + timeStamp.getUTCSeconds();
        /*
        target = target.replace("\"", "\\\""); //replace(/"(.*?)"/g, "\\\"");
        source = source.replace("\"", "\\\"");		
        target = target.replace(/["]/g, "")
        source = source.replace(/["]/g, "")	 
        alert(target);		
        */
        var targetStr = target.replace(/["]/g, "\\\"");
        var sourceStr = source.replace(/["]/g, "\\\"");
        var jsonData = '{"textId":"' + textId + '","userIdentifier":"' + userId + '",';
        jsonData = jsonData + '"index":' + segmentIndex + ',';
        jsonData = jsonData + '"timeStamp":"' + timeStampString + '",';
        jsonData = jsonData + '"phaseDate":"' + phaseDateString + '",';
        jsonData = jsonData + '"state":"' + state + '",';
        jsonData = jsonData + '"source":"' + sourceStr + '",';
        jsonData = jsonData + '"target":"' + targetStr + '",';
        jsonData = jsonData + '"phase":{';
        jsonData = jsonData + '"PhaseName":"' + currentPhase.phaseName + '"';
        jsonData = jsonData + ',"ProcessName":"' + currentPhase.processName + '"';
        //jsonData = jsonData + ',"Date":"' + phaseDateString  + '"';
        jsonData = jsonData + ',"JobId":"' + currentPhase.jobId + '"';
        jsonData = jsonData + ',"ContactEmail":"' + currentPhase.contactEmail + '"';
        jsonData = jsonData + ',"Tool":"' + currentPhase.tool + '"';
        jsonData = jsonData + ',"ToolId":"' + currentPhase.toolId + '"';
        jsonData = jsonData + ',"Notes":[';
        if (currentPhase.phaseNotes.length > 0) {
            for (var j = 0; j < currentPhase.phaseNotes.length; j++) {
                jsonData = jsonData + '{';
                jsonData = jsonData + '"Annotates":"' + currentPhase.phaseNotes[j].annotates + '"';
                jsonData = jsonData + ',"NoteFrom":"' + currentPhase.phaseNotes[j].from + '"';
                jsonData = jsonData + ',"Note":"' + currentPhase.phaseNotes[j].value + '"';
                if (j != (currentPhase.phaseNotes.length - 1))
                    jsonData = jsonData + '},';
                else
                    jsonData = jsonData + '}';
            }
            jsonData = jsonData + ']';
        }
        else {
            jsonData = jsonData + ']';
        }

        jsonData = jsonData + '},';
        jsonData = jsonData + '"phaseCounts":[';

        if (listOfPhaseCounts.length > 0) {
            for (var j = 0; j < listOfPhaseCounts.length; j++) {
                jsonData = jsonData + '{';
                jsonData = jsonData + '"PhaseName":"not set"';
                jsonData = jsonData + ',"CountType":"' + listOfPhaseCounts[j].countType + '"';
                jsonData = jsonData + ',"Unit":"' + listOfPhaseCounts[j].unit + '"';
                jsonData = jsonData + ',"Value":"' + listOfPhaseCounts[j].value + '"';
                if (j != (listOfPhaseCounts.length - 1))
                    jsonData = jsonData + '},';
                else
                    jsonData = jsonData + '}';
            }
            jsonData = jsonData + ']';
        }
        else {
            jsonData = jsonData + ']';
        }
        jsonData = jsonData + '}';
        return jsonData;
    }
    else {
        var jsonData = '{"textId":"' + textId + '","userIdentifier":"' + userId + '",';
        jsonData = jsonData + '"index":' + segmentIndex + ',';
        jsonData = jsonData + '"timeStamp":"' + timeStamp.toUTCString() + '",';
        jsonData = jsonData + '"state":"' + state + '",';
        jsonData = jsonData + '"source":"' + encodeURIComponent(source) + '",';
        jsonData = jsonData + '"target":"' + encodeURIComponent(target) + '",';
        jsonData = jsonData + '"phase":{';
        jsonData = jsonData + '"PhaseName":"' + currentPhase.phaseName + '"';
        jsonData = jsonData + ',"ProcessName":"' + currentPhase.processName + '"';
        jsonData = jsonData + ',"Date":"' + currentPhase.date.toUTCString() + '"';
        jsonData = jsonData + ',"JobId":"' + currentPhase.jobId + '"';
        jsonData = jsonData + ',"ContactEmail":"' + currentPhase.contactEmail + '"';
        jsonData = jsonData + ',"Tool":"' + currentPhase.tool + '"';
        jsonData = jsonData + ',"ToolId":"' + currentPhase.toolId + '"';
        jsonData = jsonData + ',"Notes":[';
        if (currentPhase.phaseNotes.length > 0) {
            for (var j = 0; j < currentPhase.phaseNotes.length; j++) {
                jsonData = jsonData + '{';
                jsonData = jsonData + '"Annotates":"' + currentPhase.phaseNotes[j].annotates + '"';
                jsonData = jsonData + ',"NoteFrom":"' + currentPhase.phaseNotes[j].from + '"';
                jsonData = jsonData + ',"Note":"' + encodeURIComponent(currentPhase.phaseNotes[j].value) + '"';
                if (j != (currentPhase.phaseNotes.length - 1))
                    jsonData = jsonData + '},';
                else
                    jsonData = jsonData + '}';
            }
            jsonData = jsonData + ']';
        }
        else {
            jsonData = jsonData + ']';
        }
        jsonData = jsonData + '},';
        jsonData = jsonData + '"phaseCounts":[';
        if (listOfPhaseCounts.length > 0) {
            for (var j = 0; j < listOfPhaseCounts.length; j++) {

                jsonData = jsonData + '{';
                jsonData = jsonData + '"PhaseName":"not set"';
                jsonData = jsonData + ',"CountType":"' + listOfPhaseCounts[j].countType + '"';
                jsonData = jsonData + ',"Unit":"' + listOfPhaseCounts[j].unit + '"';
                jsonData = jsonData + ',"Value":"' + listOfPhaseCounts[j].value + '"';

                if (j != (listOfPhaseCounts.length - 1))
                    jsonData = jsonData + '},';
                else
                    jsonData = jsonData + '}';
            }

            jsonData = jsonData + ']';
        }
        else {
            jsonData = jsonData + ']';
        }

        jsonData = jsonData + '}';

        return jsonData;
    }
}

/*

Date.prototype.toMSJSON = function () {
var date = '/Date(' + this.getTime() + ')/'; //CHANGED LINE
return date;
};

*/
/* Post Edit Audit Objects */
/* Extra Code */
/*
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
console.log('Local Storage not supported by this browser. Install the cookie plugin on your site to take advantage of the same functionality. You can get it at https://github.com/carhartl/jquery-cookie');
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


*/

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Configuration;

namespace AcceptPortal.Utils
{
    public static class AcceptPortalSettings
    {

        public static readonly string ACCEPT_PORTAL_API_PATH_KEY = "AcceptPortalApiPath";
        public static readonly string ACCEPT_PROJECT_HOME_URL_KEY = "AcceptProjectUrl";

        #region PreEdit
        public static readonly string PREEDIT_API_KEY = "PreEditingApiKey";
        public static readonly string PREEDIT_DEMO_APIKEY_ENGLISH = "PreEditEnglishDemoApiKey";
        public static readonly string PREEDIT_DEMO_DEFAULT_RULESET_ENGLISH = "PreEditEnglishDemoDefaultRuleSet";
        public static readonly string PREEDIT_DEMO_APIKEY_FRENCH = "PreEditFrenchDemoApiKey";
        public static readonly string PREEDIT_DEMO_DEFAULT_RULESET_FRENCH = "PreEditFrenchDemoDefaultRuleSet";
        public static readonly string PREEDIT_DEMO_DEFAULT_CHECKING_LEVELS_RULESETS = "PreEditFrenchDemoDefaultCheckingLevelsRuleSets";
        public static readonly string PREEDIT_DEMO_APIKEY_GERMAN = "PreEditGermanDemoApiKey";
        public static readonly string PREEDIT_DEMO_DEFAULT_RULESET_GERMAN = "PreEditGermanDemoDefaultRuleSet";
        #endregion

        #region User
        public static readonly string ACCEPT_PORTAL_API_REGISTERUSER_REQUEST_BODY = "PortalApiRegisterUserRequestBody";
        public static readonly string ACCEPT_PORTAL_API_AUTHENTICATEUSER_REQUEST_BODY = "PortalApiAuthenticateUserRequestBody";
        public static readonly string ACCEPT_PORTAL_API_AUTHENTICATEUSER_REQUEST_BY_EMAIL_REGISTRATION_CODE_BODY = "PortalApiAuthenticateUserByEmailRegistrationCodeBody";
        public static readonly string ACCEPT_PORTAL_API_USERPASSWORD_RECOVERY_REQUEST_BY_EMAIL_REGISTRATION_CODE_BODY = "PortalApiUserRecoveryPassword";
        public static readonly string ACCEPT_PORTAL_API_CHANGE_USERPASSWORD_JSON_BODY = "PortalApiChangeUserPasswordJsonRequestBody";
        #endregion

        #region API
        public static readonly string ACCEPT_API_CREATE_USER_API_KEY_JSON_BODY = "AcceptApiCreateUserApiKeyBody";
        public static readonly string ACCEPT_API_GET_USER_API_KEYS_JSON_BODY = "AcceptApiGetUserApiKeysBody";
        public static readonly string ACCEPT_API_GET_API_KEY_PARAMETERS =  "AcceptApiGetApiKeyBody";
        public static readonly string ACCEPT_API_UPDATE_USER_API_KEY_JSON_BODY = "AcceptApiUpdateUserApiKeyBody";
        #endregion

        #region Admin
        public static readonly string CREATE_UNIVERSE_JSON_BODY = "CreateUniverseJsonBody";
        public static readonly string CREATE_DOMAIN_JSON_BODY = "CreateDomainJsonBody";                       
        public static readonly string ADDUSER_DOMAIN_JSON_BODY = "AddUserDomainJsonBody";
        public static readonly string CREATE_EVALUATION_PROJECT_JSON_BODY = "CreateEvaluationProjectJsonBody";
        public static readonly string UPDATE_EVALUATION_PROJECT_JSON_BODY = "UpdateEvaluationProjectJsonBody";
        public static readonly string UPLOAD_EVALUATION_FILE_JSON_BODY = "UploadEvaluationFileJsonBody";
        public static readonly string CREATE_EVALUATION_QUESTION_JSON_BODY = "CreateEvaluationQuestionJsonBody";
        public static readonly string CREATE_EVALUATION_QUESTION_ITEM_JSON_BODY = "CreateEvaluationQuestionItemJsonBody";
        public static readonly string CREATE_EVALUATION_QUESTION_ITEM_ANSWER_JSON_BODY = "CreateEvaluationQuestionItemAnswerJsonBody";
        public static readonly string UPDATE_EVALUATION_QUESTION_JSON_BODY = "UpdateEvaluationQuestionJsonBody";
        public static readonly string UPDATE_EVALUATION_QUESTION_ITEM_JSON_BODY = "UpdateEvaluationQuestionItemJsonBody";
        public static readonly string UPDATE_EVALUATION_QUESTION_ITEM_ANSWER_JSON_BODY = "UpdateEvaluationQuestionItemAnswerJsonBody";        
        #endregion

        #region PostEdit      
        public static readonly string CREATE_PROJECT_JSON_BODY = "ProjectJsonBody";       
        #endregion

        #region CoreAudit
        public static readonly string ACCEPT_PORTAL_COREAUDIT_PAGEVISIT_AUDIT_JSON_BODY = "PageVisitCoreAuditJsonBody";
        public static readonly string ENABLE_PAGEVISIT_AUDIT = "EnablePageVisitAudit";
        #endregion

        #region Appraise
        public static readonly string APPRAISE_ENDPOINT = "AppraiseEndpoint";
        #endregion

        #region Learn
        public static readonly string LEARN_ENDPOINT = "LearnEnpoint";
        public static readonly string LEARN_ENDPOINT_PREEDIT = "LearnEnpointPreEdit";
        public static readonly string LEARN_ENDPOINT_POSTEDIT = "LearnEnpointPostEdit";
        public static readonly string LEARN_ENDPOINT_EVALUATION = "LearnEnpointEvaluation";
        #endregion

        #region RealTime
        public static readonly string REALTIME_HUBS_URL_ENDPOINT = "RealTimeHubsConventionalUrl";
        public static readonly string REALTIME_SIGNALR_CONVENTION_URL_ENDPOINT = "RealTimeSignalRConventionalUrl";
        public static readonly string REALTIME_SIGNALR_SCRIPT_FILE_CONVENTION_URL_ENDPOINT = "RealTimeSignalRScriptFileUrl";
        #endregion

        #region DisplayFeatures
        public static readonly string DISPLAY_PREEDIT = "DisplayPreEdit";
        public static readonly string DISPLAY_PREEDIT_DOWNLOAD = "DisplayPreEditDownload";
        public static readonly string DISPLAY_PREEDIT_DEMO = "DisplayPreEditDemo";
        public static readonly string DISPLAY_PREEDIT_APP_CREATION = "DisplayPreEditAppCreation";
        public static readonly string DISPLAY_POSTEDIT = "DisplayPostEdit";
        public static readonly string DISPLAY_POSTEDIT_DEMO = "DisplayPostEditDemo";
        public static readonly string DISPLAY_EVALUATION = "DisplayEvaluation";
        public static readonly string DISPLAY_LEARN = "DisplayLearn";
        public static readonly string DISPLAY_APPRAISE = "DisplayAppraise";
        public static readonly string DISPLAY_FEEDBACK = "DisplayFeedback";        
        #endregion

        #region EvaluationDemo
        public static readonly string EVALUATION_DEMO_QUESTION_URL = "EvaluationDemoQuestionUrl";
        public static readonly string EVALUATION_DEMO_SCORES_URL = "EvaluationDemoScoreUrl";
        public static readonly string EVALUATION_DEMO_API_KEY = "EvaluationDemoApiKey";
        #endregion
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;
using System.Runtime.Serialization.Json;
using System.IO;
using System.Text;

namespace AcceptPortal.Utils
{
    public static class CoreUtils
    {
        private static string _acceptPortalApiPath;
        private static string _acceptProjectHomeUrl;

        private static string _acceptPortalRegisterUserRequestBody;
        private static string _acceptPortalAuthenticateUserRequestBody;

        #region PreEdit
        private static string _preEditApyKey;
        private static string _preEditEnglishDemoPreEditApiKey;      
        private static string _preEditEnglishDemoPreEditDefaultRuleSet;        
        private static string _preEditFrenchDemoPreEditApiKey;
        private static string _preEditFrenchDemoPreEditDefaultRuleSet;
        private static string _preEditFrenchDemoPreEditCheckingLevelsDefaultRuleSets;
        private static string _preEditGermanDemoPreEditApiKey;
        private static string _preEditGermanDemoPreEditDefaultRuleSet;        
        #endregion

        #region User
        private static string _acceptRegisterUserPath;
        private static string _acceptAuthenticateUserPath;
        private static string _acceptAuthenticateUserByEmailCodePath;
        private static string _acceptAuthenticateUserByEmailCodeRequestBody;
        private static string _acceptUserPasswordRecoveryPath;       
        private static string _acceptUserPasswordRecoveryPathBodyRequest;
        private static string _acceptChangeUserPasswordPath;
        private static string _acceptChangeUserPasswordPathJsonRequestBody;
        private static string _acceptUserApiKeyPath;       
        private static string _acceptCreateUserApiKeyRequestBody;
        private static string _acceptGetUserApiKeysPath;
        private static string _acceptGetUserApiKeysRequestBody;
        private static string _acceptApiGetApiKeyBody;
        private static string _acceptUpdateUserApiKeyRequestBody;
        private static string _acceptSecretUserKeyPath;
        private static string _userRolePostEditProjectPath;
        private static string _allUsersPath;               
        #endregion

        #region PostEdit
        private static string _createUniversePath;
        private static string _createDomainPath;
        private static string _createProjectPath;        
        private static string _createUniverseJsonBody;        
        private static string _createDomainJsonBody;
        private static string _createProjectJsonBody;
        private static string _getProjectPath;
        private static string _getDomainPath;
        private static string _getUniversetPath;
        private static string _addUserProjectPath;
        private static string _userProject;       
        private static string _addUserDomainPath;       
        private static string _addUserDomainJsonBody;
        private static string _getAllUniversesPath;
        private static string _getDomainsByUniversePath;
        private static string _getProjectsByDomainPath;
        private static string _getAllLanguagesPath;
        private static string _getAllDomainsPath;       
        private static string _getAllprojectsPath;       
        private static string _getDocumentByIdPath;
        private static string _getDocumentByTextIdPath;
        private static string _deleteProject;
        private static string _deleteEvaluationProject;
        private static string _deleteEvaluationQuestion;
        private static string _deleteEvaluationQuestionCategory;
        private static string _deleteEvaluationQuestionAnswer;        
        private static string _getAllEvaluationProjectsPath;
        private static string _getEvaluationProjectsByUserPath;                
        private static string _createEvaluationProjectPath;
        private static string _updateEvaluationProjectPath;
        private static string _deleteEvaluationProjectPath;
        private static string _createEvaluationProjectJsonBody;
        private static string _updateEvaluationProjectJsonBody;
        private static string _createEvaluationQuestionPath;
        private static string _createEvaluationQuestionJsonBody;
        private static string _updateEvaluationQuestionPath;
        private static string _updateEvaluationQuestionJsonBody;        
        private static string _getEvaluationProjectPath;
        private static string _uploadEvaluationFileJsonBody;
        private static string _getAllEvaluationQuestionsPath;
        private static string _uploadEvaluationFilePath;
        private static string _getEvaluatioDocumentsPath;
        private static string _createEvaluationQuestionItemPath;
        private static string _createEvaluationQuestionItemJsonBody;
        private static string _updateEvaluationQuestionItemPath;
        private static string _updateEvaluationQuestionItemJsonBody;
        private static string _createEvaluationQuestionItemAnswerPath;
        private static string _createEvaluationQuestionItemAnswerJsonBody;
        private static string _updateEvaluationQuestionItemAnswerPath;
        private static string _updateEvaluationQuestionItemAnswerJsonBody;
        private static string _getAllEvaluationScoresPath;
        private static string _projectPath;
        private static string _rolesPath;
        private static string _inviteUsersPath;
        private static string _invitePath;
        private static string _inviteByUserNamePath;
        private static string _projectByUserNamePath;
        private static string _getDemoProjectsPath;        
        private static string _document;
        private static string _updateProjectInviteConfirmationDateByCodePath;
        private static string _projectWithActiveDocumentsPath;
        private static string _addDocumentToProjectRawPath;
        private static string _projectTaskStatus;
        private static string _isProjectStarted;
        private static string _projectInfo;
        private static string _paraphrasingDefaults;        
        #endregion

        #region UserFeedback

        private static string _userFeedbackPath;

        
        #endregion

        #region Evaluation

        private static string _addContentToEvaluationProject;


        #endregion

        #region CoreAudit
        private static string _pageVisitCoreAuditPath;        
        private static string _pageVisitCoreAuditBody;
        private static readonly bool _isPageVisitAuditEnabled = true;            
        #endregion       
        
        #region Appraise
        private static string _appraiseEndpoint;          
        #endregion

        #region Learn
        private static string _learnEndpoint;
        private static string _learnEndpointPreEdit;
        private static string _learnEndpointPostEdit;
        private static string _learnEndpointEvaluation;
        #endregion

        #region RealTime
        private static string _realTimeHubsConventionUrl;
        private static string _realTimeSignalRConventionUrl;
        private static string _realTimeSignalRScriptFileUrl;
        #endregion

        #region DisplayFeatures
        private static bool _displayPreEdit = true;
        private static bool _displayPreEditDownload = true;
        private static bool _displayPreEditDemo = true;
        private static bool _displayPreEditAppCreation = true;
        private static bool _displayPostEdit = true;
        private static bool _displayPostEditDemo = true;
        private static bool _displayEvaluation = true;
        private static bool _displayLearn = true;
        private static bool _displayAppraise = true;
        private static bool _displayFeedback = true;
        #endregion

        #region EvaluationDemo               
        private static readonly string _evaluationDemoScoresUrl = "EvaluationDemoScoreUrl";
        private static readonly string _evaluationDemoApiKey = "EvaluationDemoApiKey";
        private static readonly string _evaluationDemoQuestionUrl = "EvaluationDemoQuestionUrl";
        #endregion

        static CoreUtils()
        {

            _acceptPortalApiPath = ConfigurationManager.AppSettings[AcceptPortalSettings.ACCEPT_PORTAL_API_PATH_KEY];
            _acceptProjectHomeUrl = ConfigurationManager.AppSettings[AcceptPortalSettings.ACCEPT_PROJECT_HOME_URL_KEY];

            #region PreEdit
            _preEditApyKey = ConfigurationManager.AppSettings[AcceptPortalSettings.PREEDIT_API_KEY];
            _preEditEnglishDemoPreEditApiKey = ConfigurationManager.AppSettings[AcceptPortalSettings.PREEDIT_DEMO_APIKEY_ENGLISH];
            _preEditEnglishDemoPreEditDefaultRuleSet = ConfigurationManager.AppSettings[AcceptPortalSettings.PREEDIT_DEMO_DEFAULT_RULESET_ENGLISH];
            _preEditFrenchDemoPreEditApiKey = ConfigurationManager.AppSettings[AcceptPortalSettings.PREEDIT_DEMO_APIKEY_FRENCH];
            _preEditFrenchDemoPreEditDefaultRuleSet = ConfigurationManager.AppSettings[AcceptPortalSettings.PREEDIT_DEMO_DEFAULT_RULESET_FRENCH];
            _preEditFrenchDemoPreEditCheckingLevelsDefaultRuleSets = ConfigurationManager.AppSettings[AcceptPortalSettings.PREEDIT_DEMO_DEFAULT_CHECKING_LEVELS_RULESETS];
            _preEditGermanDemoPreEditApiKey = ConfigurationManager.AppSettings[AcceptPortalSettings.PREEDIT_DEMO_APIKEY_GERMAN];
            _preEditGermanDemoPreEditDefaultRuleSet = ConfigurationManager.AppSettings[AcceptPortalSettings.PREEDIT_DEMO_DEFAULT_RULESET_GERMAN];
            #endregion

            #region User
            _acceptPortalRegisterUserRequestBody = ConfigurationManager.AppSettings[AcceptPortalSettings.ACCEPT_PORTAL_API_REGISTERUSER_REQUEST_BODY];
            _acceptPortalAuthenticateUserRequestBody = ConfigurationManager.AppSettings[AcceptPortalSettings.ACCEPT_PORTAL_API_AUTHENTICATEUSER_REQUEST_BODY];
            _acceptRegisterUserPath = _acceptPortalApiPath.EndsWith("/") == true ? _acceptRegisterUserPath = _acceptPortalApiPath + "Authentication/RegisterUser" : _acceptRegisterUserPath = _acceptPortalApiPath + "/Authentication/RegisterUser";
            _acceptAuthenticateUserPath = _acceptPortalApiPath.EndsWith("/") == true ? _acceptAuthenticateUserPath = _acceptPortalApiPath + "Authentication/AuthenticateUser" : _acceptAuthenticateUserPath = _acceptPortalApiPath + "/Authentication/AuthenticateUser";
            _acceptAuthenticateUserByEmailCodePath = _acceptPortalApiPath.EndsWith("/") == true ? _acceptAuthenticateUserByEmailCodePath = _acceptPortalApiPath + "Authentication/AuthenticateUserByConfirmationCode" : _acceptAuthenticateUserByEmailCodePath = _acceptPortalApiPath + "/Authentication/AuthenticateUserByConfirmationCode";
            _acceptAuthenticateUserByEmailCodeRequestBody = ConfigurationManager.AppSettings[AcceptPortalSettings.ACCEPT_PORTAL_API_AUTHENTICATEUSER_REQUEST_BY_EMAIL_REGISTRATION_CODE_BODY];
            _acceptUserPasswordRecoveryPath = _acceptPortalApiPath.EndsWith("/") == true ? _acceptUserPasswordRecoveryPath = _acceptPortalApiPath + "Authentication/RecoverUserPassword" : _acceptUserPasswordRecoveryPath = _acceptPortalApiPath + "/Authentication/RecoverUserPassword";
            _acceptUserPasswordRecoveryPathBodyRequest = ConfigurationManager.AppSettings[AcceptPortalSettings.ACCEPT_PORTAL_API_USERPASSWORD_RECOVERY_REQUEST_BY_EMAIL_REGISTRATION_CODE_BODY];
            _acceptChangeUserPasswordPath = _acceptPortalApiPath.EndsWith("/") == true ? _acceptChangeUserPasswordPath = _acceptPortalApiPath + "Authentication/ChangeUserPassword" : _acceptChangeUserPasswordPath = _acceptPortalApiPath + "/Authentication/ChangeUserPassword";
            _acceptChangeUserPasswordPathJsonRequestBody = ConfigurationManager.AppSettings[AcceptPortalSettings.ACCEPT_PORTAL_API_CHANGE_USERPASSWORD_JSON_BODY];
            _acceptUserApiKeyPath = _acceptPortalApiPath.EndsWith("/") == true ? _acceptUserApiKeyPath = _acceptPortalApiPath + "Authentication/Key" : _acceptUserApiKeyPath = _acceptPortalApiPath + "/Authentication/Key";
            _acceptCreateUserApiKeyRequestBody = ConfigurationManager.AppSettings[AcceptPortalSettings.ACCEPT_API_CREATE_USER_API_KEY_JSON_BODY];
            _acceptGetUserApiKeysPath = _acceptPortalApiPath.EndsWith("/") == true ? _acceptGetUserApiKeysPath = _acceptPortalApiPath + "Authentication/UserKeys" : _acceptGetUserApiKeysPath = _acceptPortalApiPath + "/Authentication/UserKeys";
            _acceptGetUserApiKeysRequestBody = ConfigurationManager.AppSettings[AcceptPortalSettings.ACCEPT_API_GET_USER_API_KEYS_JSON_BODY];
            _acceptApiGetApiKeyBody = ConfigurationManager.AppSettings[AcceptPortalSettings.ACCEPT_API_GET_API_KEY_PARAMETERS];
            _acceptUpdateUserApiKeyRequestBody = ConfigurationManager.AppSettings[AcceptPortalSettings.ACCEPT_API_UPDATE_USER_API_KEY_JSON_BODY];
            _acceptSecretUserKeyPath = _acceptPortalApiPath.EndsWith("/") == true ? _acceptSecretUserKeyPath = _acceptPortalApiPath + "Authentication/UserSecretKey" : _acceptSecretUserKeyPath = _acceptPortalApiPath + "/Authentication/UserSecretKey";
            _userRolePostEditProjectPath = _acceptPortalApiPath.EndsWith("/") == true ? _userRolePostEditProjectPath = _acceptPortalApiPath + "Admin/UserRolePostEditProject?userName={0}&projectId={1}" : _userRolePostEditProjectPath = _acceptPortalApiPath + "/Admin/UserRolePostEditProject?userName={0}&projectId={1}";
            _allUsersPath = _acceptPortalApiPath.EndsWith("/") == true ? _allUsersPath = _acceptPortalApiPath + "Admin/GetAllUsers" : _allUsersPath = _acceptPortalApiPath + "/Admin/GetAllUsers";
            #endregion
           
            _createUniversePath = _acceptPortalApiPath.EndsWith("/") == true ? _createUniversePath = _acceptPortalApiPath + "Admin/CreateUniverse" : _createUniversePath = _acceptPortalApiPath + "/Admin/CreateUniverse";
            _createDomainPath = _acceptPortalApiPath.EndsWith("/") == true ? _createDomainPath = _acceptPortalApiPath + "Admin/CreateDomain" : _createDomainPath = _acceptPortalApiPath + "/Admin/CreateDomain";
            _createProjectPath = _acceptPortalApiPath.EndsWith("/") == true ? _createProjectPath = _acceptPortalApiPath + "Admin/CreateProject" : _createProjectPath = _acceptPortalApiPath + "/Admin/CreateProject";
            _projectPath = _acceptPortalApiPath.EndsWith("/") == true ? _projectPath = _acceptPortalApiPath + "Admin/Project" : _projectPath = _acceptPortalApiPath + "/Admin/Project";
            _rolesPath = _acceptPortalApiPath.EndsWith("/") == true ? _rolesPath = _acceptPortalApiPath + "Authentication/Role" : _rolesPath = _acceptPortalApiPath + "/Authentication/Role";
            _createUniverseJsonBody = ConfigurationManager.AppSettings[AcceptPortalSettings.CREATE_UNIVERSE_JSON_BODY];
            _createDomainJsonBody  = ConfigurationManager.AppSettings[AcceptPortalSettings.CREATE_DOMAIN_JSON_BODY];
            _createProjectJsonBody = ConfigurationManager.AppSettings[AcceptPortalSettings.CREATE_PROJECT_JSON_BODY];
            _getProjectPath = _acceptPortalApiPath.EndsWith("/") == true ? _getProjectPath = _acceptPortalApiPath + "Admin/GetProject/{0}" : _getProjectPath = _acceptPortalApiPath + "/Admin/GetProject/{0}";
            _getDomainPath = _acceptPortalApiPath.EndsWith("/") == true ? _getDomainPath = _acceptPortalApiPath + "Admin/GetDomain/{0}" : _getDomainPath = _acceptPortalApiPath + "/Admin/GetDomain/{0}";
            _getUniversetPath = _acceptPortalApiPath.EndsWith("/") == true ? _getUniversetPath = _acceptPortalApiPath + "Admin/GetUniverse/{0}" : _getUniversetPath = _acceptPortalApiPath + "/Admin/GetUniverse/{0}";
            _addUserProjectPath = _acceptPortalApiPath.EndsWith("/") == true ? _addUserProjectPath = _acceptPortalApiPath + "Admin/AddUserProject" : _addUserProjectPath = _acceptPortalApiPath + "/Admin/AddUserProject";
            _userProject = _acceptPortalApiPath.EndsWith("/") == true ? _addUserProjectPath = _acceptPortalApiPath + "Admin/UserProject/?userName={0}&token={1}" : _addUserProjectPath = _acceptPortalApiPath + "/Admin/UserProject/?userName={0}&token={1}";            
            _addUserDomainPath = _acceptPortalApiPath.EndsWith("/") == true ? _addUserDomainPath = _acceptPortalApiPath + "Admin/AddUserDomain" : _addUserDomainPath = _acceptPortalApiPath + "/Admin/AddUserDomain";            
            _addUserDomainJsonBody = ConfigurationManager.AppSettings[AcceptPortalSettings.ADDUSER_DOMAIN_JSON_BODY];
            _getAllUniversesPath = _acceptPortalApiPath.EndsWith("/") == true ? _getAllUniversesPath = _acceptPortalApiPath + "Admin/GetAllUniverse" : _getAllUniversesPath = _acceptPortalApiPath + "/Admin/GetAllUniverse";
            _getDomainsByUniversePath = _acceptPortalApiPath.EndsWith("/") == true ? _getDomainsByUniversePath = _acceptPortalApiPath + "Admin/GetDomainsByUniverse/{0}" : _getDomainsByUniversePath = _acceptPortalApiPath + "/Admin/GetDomainsByUniverse/{0}";
            _getProjectsByDomainPath = _acceptPortalApiPath.EndsWith("/") == true ? _getProjectsByDomainPath = _acceptPortalApiPath + "Admin/GetProjectsByDomain/{0}" : _getProjectsByDomainPath = _acceptPortalApiPath + "/Admin/GetProjectsByDomain/{0}";
            _getAllDomainsPath = _acceptPortalApiPath.EndsWith("/") == true ? _getAllDomainsPath = _acceptPortalApiPath + "Admin/GetAllDomains" : _getAllDomainsPath = _acceptPortalApiPath + "/Admin/GetAllDomains";
            _getAllprojectsPath = _acceptPortalApiPath.EndsWith("/") == true ? _getAllprojectsPath = _acceptPortalApiPath + "Admin/GetAllProjects" : _getAllprojectsPath = _acceptPortalApiPath + "/Admin/GetAllProjects";
            _getAllLanguagesPath = _acceptPortalApiPath.EndsWith("/") == true ? _getAllLanguagesPath = _acceptPortalApiPath + "Evaluation/Languages" : _getAllLanguagesPath = _acceptPortalApiPath + "/Evaluation/Languages";            
            _getDocumentByIdPath = _acceptPortalApiPath.EndsWith("/") == true ? _getDocumentByIdPath = _acceptPortalApiPath + "PostEdit/GetDocument/{0}" : _getDocumentByIdPath = _acceptPortalApiPath + "/PostEdit/GetDocument/{0}";
            _getDocumentByTextIdPath = _acceptPortalApiPath.EndsWith("/") == true ? _getDocumentByTextIdPath = _acceptPortalApiPath + "PostEdit/GetDocumentByTextId?textId={0}" : _getDocumentByTextIdPath = _acceptPortalApiPath + "/PostEdit/GetDocumentByTextId?textId={0}";
            _deleteProject = _acceptPortalApiPath.EndsWith("/") == true ? _deleteProject = _acceptPortalApiPath + "Admin/DeleteProject/{0}" : _deleteProject = _acceptPortalApiPath + "/Admin/DeleteProject/{0}";
            _deleteEvaluationProject = _acceptPortalApiPath.EndsWith("/") == true ? _deleteEvaluationProject = _acceptPortalApiPath + "Evaluation/DeleteProject/{0}" : _deleteEvaluationProject = _acceptPortalApiPath + "/Evaluation/DeleteProject/{0}";
            _deleteEvaluationQuestion = _acceptPortalApiPath.EndsWith("/") == true ? _deleteEvaluationQuestion = _acceptPortalApiPath + "Evaluation/DeleteQuestion/{0}" : _deleteEvaluationQuestion = _acceptPortalApiPath + "/Evaluation/DeleteQuestion/{0}";
            _deleteEvaluationQuestionCategory = _acceptPortalApiPath.EndsWith("/") == true ? _deleteEvaluationQuestionCategory = _acceptPortalApiPath + "Evaluation/DeleteCategory/{0}" : _deleteEvaluationQuestionCategory = _acceptPortalApiPath + "/Evaluation/DeleteCategory/{0}";
            _deleteEvaluationQuestionAnswer = _acceptPortalApiPath.EndsWith("/") == true ? _deleteEvaluationQuestionAnswer = _acceptPortalApiPath + "Evaluation/DeleteAnswer/{0}" : _deleteEvaluationQuestionAnswer = _acceptPortalApiPath + "/Evaluation/DeleteAnswer/{0}";            
            _getAllEvaluationProjectsPath = _acceptPortalApiPath.EndsWith("/") == true ? _getAllEvaluationProjectsPath = _acceptPortalApiPath + "Evaluation/GetAllProjects" : _getAllEvaluationProjectsPath = _acceptPortalApiPath + "/Evaluation/GetAllProjects";
            _createEvaluationProjectPath = _acceptPortalApiPath.EndsWith("/") == true ? _createEvaluationProjectPath = _acceptPortalApiPath + "Evaluation/CreateProject" : _createEvaluationProjectPath = _acceptPortalApiPath + "/Evaluation/CreateProject";
            _updateEvaluationProjectPath = _acceptPortalApiPath.EndsWith("/") == true ? _updateEvaluationProjectPath = _acceptPortalApiPath + "Evaluation/UpdateProject/{0}" : _updateEvaluationProjectPath = _acceptPortalApiPath + "/Evaluation/UpdateProject/{0}";
            _deleteEvaluationProjectPath = _acceptPortalApiPath.EndsWith("/") == true ? _deleteEvaluationProjectPath = _acceptPortalApiPath + "Evaluation/DeleteProject/{0}" : _deleteEvaluationProjectPath = _acceptPortalApiPath + "/Evaluation/DeleteProject/{0}";            
            _createEvaluationProjectJsonBody = ConfigurationManager.AppSettings[AcceptPortalSettings.CREATE_EVALUATION_PROJECT_JSON_BODY];
            _updateEvaluationProjectJsonBody = ConfigurationManager.AppSettings[AcceptPortalSettings.UPDATE_EVALUATION_PROJECT_JSON_BODY];            
            _getEvaluationProjectPath = _acceptPortalApiPath.EndsWith("/") == true ? _getEvaluationProjectPath = _acceptPortalApiPath + "Evaluation/GetProject/{0}" : _getEvaluationProjectPath = _acceptPortalApiPath + "/Evaluation/GetProject/{0}";
            _createEvaluationQuestionPath = _acceptPortalApiPath.EndsWith("/") == true ? _createEvaluationQuestionPath = _acceptPortalApiPath + "Evaluation/CreateQuestion" : _createEvaluationQuestionPath = _acceptPortalApiPath + "/Evaluation/CreateQuestion";
            _createEvaluationQuestionJsonBody = ConfigurationManager.AppSettings[AcceptPortalSettings.CREATE_EVALUATION_QUESTION_JSON_BODY];
            _updateEvaluationQuestionPath = _acceptPortalApiPath.EndsWith("/") == true ? _updateEvaluationQuestionPath = _acceptPortalApiPath + "Evaluation/UpdateQuestionCategory" : _updateEvaluationQuestionPath = _acceptPortalApiPath + "/Evaluation/UpdateQuestionCategory";
            _updateEvaluationQuestionJsonBody = ConfigurationManager.AppSettings[AcceptPortalSettings.UPDATE_EVALUATION_QUESTION_JSON_BODY];
            _uploadEvaluationFileJsonBody = ConfigurationManager.AppSettings[AcceptPortalSettings.UPLOAD_EVALUATION_FILE_JSON_BODY];
            _getAllEvaluationQuestionsPath = _acceptPortalApiPath.EndsWith("/") == true ? _getAllEvaluationQuestionsPath = _acceptPortalApiPath + "Evaluation/GetAllQuestions/{0}" : _getAllEvaluationQuestionsPath = _acceptPortalApiPath + "/Evaluation/GetAllQuestions/{0}";
            _getEvaluationProjectsByUserPath = _acceptPortalApiPath.EndsWith("/") == true ? _getEvaluationProjectsByUserPath = _acceptPortalApiPath + "Evaluation/GetProjectsByUser" : _getEvaluationProjectsByUserPath = _acceptPortalApiPath + "/Evaluation/GetProjectsByUser";            
            _uploadEvaluationFilePath = _acceptPortalApiPath.EndsWith("/") == true ? _uploadEvaluationFilePath = _acceptPortalApiPath + "Evaluation/UploadFile/{0}" : _uploadEvaluationFilePath = _acceptPortalApiPath + "/Evaluation/UploadFile/{0}";
            _getEvaluatioDocumentsPath = _acceptPortalApiPath.EndsWith("/") == true ? _getEvaluatioDocumentsPath = _acceptPortalApiPath + "Evaluation/Documents/{0}" : _getEvaluatioDocumentsPath = _acceptPortalApiPath + "/Evaluation/Documents/{0}";
            _createEvaluationQuestionItemPath = _acceptPortalApiPath.EndsWith("/") == true ? _createEvaluationQuestionItemPath = _acceptPortalApiPath + "Evaluation/CreateQuestionItem" : _createEvaluationQuestionItemPath = _acceptPortalApiPath + "/Evaluation/CreateQuestionItem";
            _createEvaluationQuestionItemJsonBody = ConfigurationManager.AppSettings[AcceptPortalSettings.CREATE_EVALUATION_QUESTION_ITEM_JSON_BODY];
            _updateEvaluationQuestionItemPath = _acceptPortalApiPath.EndsWith("/") == true ? _updateEvaluationQuestionItemPath = _acceptPortalApiPath + "Evaluation/UpdateQuestion" : _updateEvaluationQuestionItemPath = _acceptPortalApiPath + "/Evaluation/UpdateQuestion";
            _updateEvaluationQuestionItemJsonBody = ConfigurationManager.AppSettings[AcceptPortalSettings.UPDATE_EVALUATION_QUESTION_ITEM_JSON_BODY];
            _createEvaluationQuestionItemAnswerPath = _acceptPortalApiPath.EndsWith("/") == true ? _createEvaluationQuestionItemAnswerPath = _acceptPortalApiPath + "Evaluation/CreateQuestionItemAnswer" : _createEvaluationQuestionItemAnswerPath = _acceptPortalApiPath + "/Evaluation/CreateQuestionItemAnswer";
            _createEvaluationQuestionItemAnswerJsonBody = ConfigurationManager.AppSettings[AcceptPortalSettings.CREATE_EVALUATION_QUESTION_ITEM_ANSWER_JSON_BODY];
            _updateEvaluationQuestionItemAnswerPath = _acceptPortalApiPath.EndsWith("/") == true ? _updateEvaluationQuestionItemAnswerPath = _acceptPortalApiPath + "Evaluation/UpdateQuestionAnswer" : _updateEvaluationQuestionItemAnswerPath = _acceptPortalApiPath + "/Evaluation/UpdateQuestionAnswer";
            _updateEvaluationQuestionItemAnswerJsonBody = ConfigurationManager.AppSettings[AcceptPortalSettings.UPDATE_EVALUATION_QUESTION_ITEM_ANSWER_JSON_BODY];                        
            _getAllEvaluationScoresPath = _acceptPortalApiPath.EndsWith("/") == true ? _getAllEvaluationScoresPath = _acceptPortalApiPath + "Evaluation/Scores/{0}" : _getAllEvaluationScoresPath = _acceptPortalApiPath + "/Evaluation/Scores/?id={0}&token={1}";            
            _inviteUsersPath = _acceptPortalApiPath.EndsWith("/") == true ? _inviteUsersPath = _acceptPortalApiPath + "PostEdit/InviteUsers" : _inviteUsersPath = _acceptPortalApiPath + "/PostEdit/InviteUsers";
            _invitePath = _acceptPortalApiPath.EndsWith("/") == true ? _invitePath = _acceptPortalApiPath + "PostEdit/Invite?code={0}" : _invitePath = _acceptPortalApiPath + "/PostEdit/Invite?code={0}";
            _inviteByUserNamePath = _acceptPortalApiPath.EndsWith("/") == true ? _inviteByUserNamePath = _acceptPortalApiPath + "PostEdit/InviteByUserName?userName={0}" : _inviteByUserNamePath = _acceptPortalApiPath + "/PostEdit/InviteByUserName?userName={0}";
            _projectByUserNamePath = _acceptPortalApiPath.EndsWith("/") == true ? _projectByUserNamePath = _acceptPortalApiPath + "Admin/ProjectByUser" : _projectByUserNamePath = _acceptPortalApiPath + "/Admin/ProjectByUser";
            _getDemoProjectsPath = _acceptPortalApiPath.EndsWith("/") == true ? _getDemoProjectsPath = _acceptPortalApiPath + "Admin/DemoProjects" : _getDemoProjectsPath = _acceptPortalApiPath + "/Admin/DemoProjects";
            _document = _acceptPortalApiPath.EndsWith("/") == true ? _document = _acceptPortalApiPath + "PostEdit/Document" : _document = _acceptPortalApiPath + "/PostEdit/Document";
            _updateProjectInviteConfirmationDateByCodePath = _acceptPortalApiPath.EndsWith("/") == true ? _updateProjectInviteConfirmationDateByCodePath = _acceptPortalApiPath + "PostEdit/UpdateProjectInviteConfirmationDateByCode?code={0}" : _updateProjectInviteConfirmationDateByCodePath = _acceptPortalApiPath + "/PostEdit/UpdateProjectInviteConfirmationDateByCode?code={0}";
            _projectWithActiveDocumentsPath = _acceptPortalApiPath.EndsWith("/") == true ? _projectWithActiveDocumentsPath = _acceptPortalApiPath + "PostEdit/GetProjectWithValidDocuments" : _projectWithActiveDocumentsPath = _acceptPortalApiPath + "/PostEdit/GetProjectWithValidDocuments";
            _addDocumentToProjectRawPath = _acceptPortalApiPath.EndsWith("/") == true ? _addDocumentToProjectRawPath = _acceptPortalApiPath + "PostEdit/AddDocumentToProjectRaw" : _addDocumentToProjectRawPath = _acceptPortalApiPath + "/PostEdit/AddDocumentToProjectRaw";                        
            _projectTaskStatus = _acceptPortalApiPath.EndsWith("/") == true ? _projectTaskStatus = _acceptPortalApiPath + "PostEdit/GetProjectTaskStatus?token={0}" : _projectTaskStatus = _acceptPortalApiPath + "/PostEdit/GetProjectTaskStatus?token={0}";            
            _isProjectStarted = _acceptPortalApiPath.EndsWith("/") == true ? _isProjectStarted = _acceptPortalApiPath + "Admin/IsProjectStarted?projectId={0}" : _isProjectStarted = _acceptPortalApiPath + "/Admin/IsProjectStarted?projectId={0}";
            _userFeedbackPath = _acceptPortalApiPath.EndsWith("/") == true ? _userFeedbackPath = _acceptPortalApiPath + "Admin/UserFeedback" : _userFeedbackPath = _acceptPortalApiPath + "/Admin/UserFeedback";
            _projectInfo = _acceptPortalApiPath.EndsWith("/") == true ? _projectInfo = _acceptPortalApiPath + "Admin/ProjectInfo?token={0}" : _projectInfo = _acceptPortalApiPath + "/Admin/ProjectInfo?token={0}";            
            _paraphrasingDefaults = _acceptPortalApiPath.EndsWith("/") == true ? _paraphrasingDefaults = _acceptPortalApiPath + "PostEdit/PostEditDefaults?lang={0}" : _paraphrasingDefaults = _acceptPortalApiPath + "/PostEdit/PostEditDefaults?lang={0}";

            #region Evaluation
            _addContentToEvaluationProject = _acceptPortalApiPath.EndsWith("/") == true ? _addContentToEvaluationProject = _acceptPortalApiPath + "Evaluation/AddContentToProjectRaw" : _addContentToEvaluationProject = _acceptPortalApiPath + "/Evaluation/AddContentToProjectRaw";
            #endregion

            #region CoreAudit
            _pageVisitCoreAuditBody = ConfigurationManager.AppSettings[AcceptPortalSettings.ACCEPT_PORTAL_COREAUDIT_PAGEVISIT_AUDIT_JSON_BODY];
            _pageVisitCoreAuditPath = _acceptPortalApiPath.EndsWith("/") ? _pageVisitCoreAuditPath = _acceptPortalApiPath + "Audit/PageVisit" : _pageVisitCoreAuditPath = _acceptPortalApiPath + "/Audit/PageVisit";
            _isPageVisitAuditEnabled = Boolean.Parse(ConfigurationManager.AppSettings[AcceptPortalSettings.ENABLE_PAGEVISIT_AUDIT]);
            #endregion

            #region Appraise
            _appraiseEndpoint = ConfigurationManager.AppSettings[AcceptPortalSettings.APPRAISE_ENDPOINT]; 
            
            #endregion

            #region Learn
            _learnEndpoint = ConfigurationManager.AppSettings[AcceptPortalSettings.LEARN_ENDPOINT];
            _learnEndpointPreEdit = ConfigurationManager.AppSettings[AcceptPortalSettings.LEARN_ENDPOINT_PREEDIT];
            _learnEndpointPostEdit = ConfigurationManager.AppSettings[AcceptPortalSettings.LEARN_ENDPOINT_POSTEDIT];
            _learnEndpointEvaluation = ConfigurationManager.AppSettings[AcceptPortalSettings.LEARN_ENDPOINT_EVALUATION];          
            #endregion

            #region RealTime
            _realTimeHubsConventionUrl = ConfigurationManager.AppSettings[AcceptPortalSettings.REALTIME_HUBS_URL_ENDPOINT];
            _realTimeSignalRConventionUrl = ConfigurationManager.AppSettings[AcceptPortalSettings.REALTIME_SIGNALR_CONVENTION_URL_ENDPOINT];
            _realTimeSignalRScriptFileUrl = ConfigurationManager.AppSettings[AcceptPortalSettings.REALTIME_SIGNALR_SCRIPT_FILE_CONVENTION_URL_ENDPOINT];
            #endregion

            #region DisplayFeatures
            _displayPreEdit = bool.TryParse(ConfigurationManager.AppSettings[AcceptPortalSettings.DISPLAY_PREEDIT], out _displayPreEdit);
            _displayPreEditDownload = bool.TryParse(ConfigurationManager.AppSettings[AcceptPortalSettings.DISPLAY_PREEDIT_DOWNLOAD], out _displayPreEditDownload);
            _displayPreEditDemo = bool.TryParse(ConfigurationManager.AppSettings[AcceptPortalSettings.DISPLAY_PREEDIT_DEMO], out _displayPreEditDemo);
            _displayPreEditAppCreation = bool.TryParse(ConfigurationManager.AppSettings[AcceptPortalSettings.DISPLAY_PREEDIT_APP_CREATION], out _displayPreEditDemo);
            _displayPostEdit = bool.TryParse(ConfigurationManager.AppSettings[AcceptPortalSettings.DISPLAY_POSTEDIT], out _displayPostEdit);
            _displayPostEditDemo = bool.TryParse(ConfigurationManager.AppSettings[AcceptPortalSettings.DISPLAY_POSTEDIT_DEMO], out _displayPostEditDemo);
            _displayEvaluation = bool.TryParse(ConfigurationManager.AppSettings[AcceptPortalSettings.DISPLAY_EVALUATION], out _displayEvaluation);
            _displayLearn = bool.TryParse(ConfigurationManager.AppSettings[AcceptPortalSettings.DISPLAY_LEARN], out _displayLearn);
            _displayAppraise = bool.TryParse(ConfigurationManager.AppSettings[AcceptPortalSettings.DISPLAY_APPRAISE], out _displayAppraise);
            _displayFeedback = bool.TryParse(ConfigurationManager.AppSettings[AcceptPortalSettings.DISPLAY_FEEDBACK], out _displayFeedback);
            #endregion

            #region EvaluationDemo
            _evaluationDemoQuestionUrl = ConfigurationManager.AppSettings[AcceptPortalSettings.EVALUATION_DEMO_QUESTION_URL];
            _evaluationDemoScoresUrl = ConfigurationManager.AppSettings[AcceptPortalSettings.EVALUATION_DEMO_SCORES_URL];
            _evaluationDemoApiKey = ConfigurationManager.AppSettings[AcceptPortalSettings.EVALUATION_DEMO_API_KEY];
            #endregion

        }
        
        #region Properties

        #region PreEdit
        public static string PreEditApyKey { get { return CoreUtils._preEditApyKey; } }
        public static string PreEditEnglishDemoPreEditApiKey { get { return CoreUtils._preEditEnglishDemoPreEditApiKey; } }
        public static string PreEditEnglishDemoPreEditDefaultRuleSet { get { return CoreUtils._preEditEnglishDemoPreEditDefaultRuleSet; } }
        public static string PreEditFrenchDemoPreEditApiKey { get { return CoreUtils._preEditFrenchDemoPreEditApiKey; } }
        public static string PreEditFrenchDemoPreEditDefaultRuleSet { get { return CoreUtils._preEditFrenchDemoPreEditDefaultRuleSet; } }
        public static string PreEditFrenchDemoPreEditCheckingLevelsDefaultRuleSets { get { return CoreUtils._preEditFrenchDemoPreEditCheckingLevelsDefaultRuleSets; } }
        public static string PreEditGermanDemoPreEditApiKey { get { return CoreUtils._preEditGermanDemoPreEditApiKey; } }
        public static string PreEditGermanDemoPreEditDefaultRuleSet { get { return CoreUtils._preEditGermanDemoPreEditDefaultRuleSet; } }
        #endregion

        public static string AcceptPortalApiPath  {get { return CoreUtils._acceptPortalApiPath;}}
        public static string AcceptProjectHomeUrl { get { return CoreUtils._acceptProjectHomeUrl; } }
         
        public static string AcceptRegisterUserPath { get { return CoreUtils._acceptRegisterUserPath; } }
        public static string AcceptAuthenticateUserPath { get { return CoreUtils._acceptAuthenticateUserPath; } }        
        public static string AcceptPortalRegisterUserRequestBody { get { return CoreUtils._acceptPortalRegisterUserRequestBody; } }
        public static string AcceptPortalAuthenticateUserRequestBody { get { return CoreUtils._acceptPortalAuthenticateUserRequestBody; } }
        public static string AcceptAuthenticateUserByEmailCodePath { get { return CoreUtils._acceptAuthenticateUserByEmailCodePath; } }
        public static string AcceptAuthenticateUserByEmailCodeRequestBody{get { return CoreUtils._acceptAuthenticateUserByEmailCodeRequestBody; }}
        public static string AcceptUserPasswordRecoveryPathBodyRequest{get { return CoreUtils._acceptUserPasswordRecoveryPathBodyRequest; }}
        public static string AcceptUserPasswordRecoveryPath{get { return CoreUtils._acceptUserPasswordRecoveryPath; }}
        public static string AcceptChangeUserPasswordPath{get { return CoreUtils._acceptChangeUserPasswordPath; }}
        public static string AcceptChangeUserPasswordPathJsonRequestBody{get { return CoreUtils._acceptChangeUserPasswordPathJsonRequestBody; }}
        public static string AcceptUserApiKeyPath{get { return CoreUtils._acceptUserApiKeyPath; } }
        public static string AcceptCreateUserApiKeyRequestBody { get { return CoreUtils._acceptCreateUserApiKeyRequestBody; } }
        public static string AcceptGetUserApiKeysPath { get { return CoreUtils._acceptGetUserApiKeysPath; } }
        public static string AcceptGetUserApiKeysRequestBody { get { return CoreUtils._acceptGetUserApiKeysRequestBody; } }
        public static string AcceptApiGetApiKeyBody{get { return CoreUtils._acceptApiGetApiKeyBody; }}
        public static string AcceptUpdateUserApiKeyRequestBody{get { return CoreUtils._acceptUpdateUserApiKeyRequestBody; }}
        public static string AcceptSecretUserKeyPath { get { return CoreUtils._acceptSecretUserKeyPath; } }
        public static string CreateUniversePath { get { return CoreUtils._createUniversePath; } }
        public static string CreateDomainPath { get { return CoreUtils._createDomainPath; } }
        public static string CreateProjectPath { get { return CoreUtils._createProjectPath; } }
        public static string CreateUniverseJsonBody {get { return CoreUtils._createUniverseJsonBody; }}        
        public static string CreateDomainJsonBody{get { return CoreUtils._createDomainJsonBody; }}
        public static string CreateProjectJsonBody{get { return CoreUtils._createProjectJsonBody; }}
        public static string GetUniversetPath{get { return CoreUtils._getUniversetPath; }}
        public static string GetDomainPath{get { return CoreUtils._getDomainPath; }}
        public static string GetProjectPath{get { return CoreUtils._getProjectPath; }}
        public static string AddUserProjectPath{get { return CoreUtils._addUserProjectPath; }}
        public static string AddUserDomainPath{get { return CoreUtils._addUserDomainPath; }}        
        public static string AddUserDomainJsonBody{get { return CoreUtils._addUserDomainJsonBody; }}
        public static string GetProjectsByDomainPath{get { return CoreUtils._getProjectsByDomainPath; }}
        public static string GetAllUniversesPath{get { return CoreUtils._getAllUniversesPath; }}
        public static string GetDomainsByUniversePath{get { return CoreUtils._getDomainsByUniversePath; }}
        public static string GetAllLanguagesPath { get { return CoreUtils._getAllLanguagesPath; } }
        public static string GetAllDomainsPath{get { return CoreUtils._getAllDomainsPath; } }
        public static string GetAllprojectsPath { get { return CoreUtils._getAllprojectsPath; } }       
        public static string GetDocumentByIdPath{get { return CoreUtils._getDocumentByIdPath; }}
        public static string GetDocumentByTextIdPath{get { return CoreUtils._getDocumentByTextIdPath; }}
        public static string GetAllUsersPath{get { return CoreUtils._allUsersPath; }}        
        public static string DeleteProject { get { return CoreUtils._deleteProject; } }

        #region Evolution
        public static string DeleteEvaluationProject { get { return CoreUtils._deleteEvaluationProject; } }
        public static string DeleteEvaluationQuestion { get { return CoreUtils._deleteEvaluationQuestion; } }
        public static string DeleteEvaluationQuestionCategory { get { return CoreUtils._deleteEvaluationQuestionCategory; } }
        public static string DeleteEvaluationQuestionAnswer { get { return CoreUtils._deleteEvaluationQuestionAnswer; } }   
        public static string GetAllEvaluationProjectsPath { get { return CoreUtils._getAllEvaluationProjectsPath; } }
        public static string GetEvaluationProjectsByUserPath { get { return CoreUtils._getEvaluationProjectsByUserPath; } }
        public static string CreateEvaluationProjectPath { get { return CoreUtils._createEvaluationProjectPath; } }
        public static string CreateEvaluationProjectJsonBody { get { return CoreUtils._createEvaluationProjectJsonBody; } }
        public static string UpdateEvaluationProjectPath { get { return CoreUtils._updateEvaluationProjectPath; } }
        public static string UpdateEvaluationProjectJsonBody { get { return CoreUtils._updateEvaluationProjectJsonBody; } }        
        public static string CreateEvaluationQuestionPath { get { return CoreUtils._createEvaluationQuestionPath; } }
        public static string CreateEvaluationQuestionJsonBody { get { return CoreUtils._createEvaluationQuestionJsonBody; } }
        public static string UpdateEvaluationQuestionPath { get { return CoreUtils._updateEvaluationQuestionPath; } }
        public static string UpdateEvaluationQuestionJsonBody { get { return CoreUtils._updateEvaluationQuestionJsonBody; } }                
        public static string GetEvaluationProjectPath { get { return CoreUtils._getEvaluationProjectPath; } }
        public static string GetEvaluationDocumentsPath { get { return CoreUtils._getEvaluatioDocumentsPath; } }
        public static string UploadEvaluationFileJsonBody { get { return CoreUtils._uploadEvaluationFileJsonBody; } }
        public static string GetAllEvaluationQuestionsPath { get { return CoreUtils._getAllEvaluationQuestionsPath; } }
        public static string UploadEvaluationFilePath { get { return CoreUtils._uploadEvaluationFilePath; } }
        public static string CreateEvaluationQuestionItemPath { get { return CoreUtils._createEvaluationQuestionItemPath; } }
        public static string CreateEvaluationQuestionItemJsonBody { get { return CoreUtils._createEvaluationQuestionItemJsonBody; } }
        public static string UpdateEvaluationQuestionItemPath { get { return CoreUtils._updateEvaluationQuestionItemPath; } }
        public static string UpdateEvaluationQuestionItemJsonBody { get { return CoreUtils._updateEvaluationQuestionItemJsonBody; } }
        public static string UpdateEvaluationQuestionItemAnswerPath { get { return CoreUtils._updateEvaluationQuestionItemAnswerPath; } }
        public static string UpdateEvaluationQuestionItemAnswerJsonBody { get { return CoreUtils._updateEvaluationQuestionItemAnswerJsonBody; } }
        public static string CreateEvaluationQuestionItemAnswerPath { get { return CoreUtils._createEvaluationQuestionItemAnswerPath; } }
        public static string CreateEvaluationQuestionItemAnswerJsonBody { get { return CoreUtils._createEvaluationQuestionItemAnswerJsonBody; } }
        public static string GetEvaluationScoresPath { get { return CoreUtils._getAllEvaluationScoresPath; } }
        #endregion

        public static string ProjectPath { get { return CoreUtils._projectPath; } }
        public static string RolesPath{get { return CoreUtils._rolesPath; }}
        public static string InviteUsersPath{get { return CoreUtils._inviteUsersPath; }}
        public static string InvitePath{get { return CoreUtils._invitePath; }}
        public static string InviteByUserNamePath{get { return CoreUtils._inviteByUserNamePath; }}
        public static string ProjectByUserNamePath{get { return CoreUtils._projectByUserNamePath; }}
        public static string GetDemoProjectsPath { get { return CoreUtils._getDemoProjectsPath; } }                     
        public static string Document{get { return CoreUtils._document; }}
        public static string ProjectWithActiveDocumentsPath{get { return CoreUtils._projectWithActiveDocumentsPath; }}
        public static string UpdateProjectInviteConfirmationDateByCodePath{get { return CoreUtils._updateProjectInviteConfirmationDateByCodePath; }}
        public static string AddDocumentToProjectRawPath{get { return CoreUtils._addDocumentToProjectRawPath; } }
        public static string ProjectTaskStatus{get { return CoreUtils._projectTaskStatus; }}
        public static string UserFeedbackPath{get { return CoreUtils._userFeedbackPath; }}
        public static string IsProjectStarted{get { return CoreUtils._isProjectStarted; }}
        public static string UserRolePostEditProjectPath{ get { return CoreUtils._userRolePostEditProjectPath; } }
        public static string AddContentToEvaluationProject { get { return _addContentToEvaluationProject; } }
        public static string UserProject{get { return CoreUtils._userProject; }}
        public static string ProjectInfo{get { return CoreUtils._projectInfo; }}
        public static string ParaphrasingDefaults { get { return CoreUtils._paraphrasingDefaults; } }

        #region Appraise
        public static string AppraiseEndpoint{get { return CoreUtils._appraiseEndpoint; }}
        #endregion

        #region Learn      
        public static string LearnEndpoint { get { return CoreUtils._learnEndpoint; } }
        public static string LearnEndpointPreEdit { get { return CoreUtils._learnEndpointPreEdit; } }
        public static string LearnEndpointPostEdit { get { return CoreUtils._learnEndpointPostEdit; } }
        public static string LearnEndpointEvaluation { get { return CoreUtils._learnEndpointEvaluation; } }
        #endregion

        #region CoreAudit
        public static string PageVisitCoreAuditBody { get { return CoreUtils._pageVisitCoreAuditBody; } }
        public static string PageVisitCoreAuditPath { get { return CoreUtils._pageVisitCoreAuditPath; } }
        public static bool IsPageVisitAuditEnabled { get { return CoreUtils._isPageVisitAuditEnabled; } }
        #endregion

        #region RealTime
        public static string RealTimeHubsConventionUrl { get { return CoreUtils._realTimeHubsConventionUrl; } }
        public static string RealTimeSignalRConventionUrl { get { return CoreUtils._realTimeSignalRConventionUrl; } }
        public static string RealTimeSignalRScriptFileUrl { get { return CoreUtils._realTimeSignalRScriptFileUrl; } }
        #endregion

        #region DisplayFeatures
        public static bool DisplayPreEdit { get { return CoreUtils._displayPreEdit; } }
        public static bool DisplayPreEditDownload { get { return CoreUtils._displayPreEditDownload; } }
        public static bool DisplayPreEditDemo { get { return CoreUtils._displayPreEditDemo; } }
        public static bool DisplayPreEditAppCreation { get { return CoreUtils._displayPreEditAppCreation; } }        
        public static bool DisplayPostEdit { get { return CoreUtils._displayPostEdit; } }
        public static bool DisplayPostEditDemo { get { return CoreUtils._displayPostEditDemo; } }
        public static bool DisplayEvaluation { get { return CoreUtils._displayEvaluation; } }
        public static bool DisplayLearn { get { return CoreUtils._displayLearn; } }
        public static bool DisplayAppraise { get { return CoreUtils._displayAppraise; } }
        public static bool DisplayFeedback { get { return CoreUtils._displayFeedback; } }
        #endregion

        #region EvaluationDemo
        public static string EvaluationDemoQuestionUrl { get { return CoreUtils._evaluationDemoQuestionUrl; } }
        public static string EvaluationDemoScoresUrl { get { return CoreUtils._evaluationDemoScoresUrl; } }
        public static string EvaluationDemoApiKey { get { return CoreUtils._evaluationDemoApiKey; } }
        #endregion

        #endregion
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AcceptPortal.Models.Audit
{
    public static class AuditDescriptor
    {
        #region Global
        public const string PORTAL_LOGIN = "PORTAL_LOGIN";
        public const string PORTAL_LOGIN_ATTEMPT = "PORTAL_LOGIN_ATTEMPT";
        public const string PASSWORD_RECOVERED = "PASSWORD_RECOVERED";
        public const string ACCOUNT_CREATED = "ACCOUNT_CREATED";
        public const string LEARN_PAGE_REQUESTED = "LEARN_PAGE_REQUESTED";
        public const string APPRAISE_PAGE_REQUESTED = "APPRAISE_PAGE_REQUESTED";                         
        #endregion

        #region Post-Edit
        public const string POSTEDIT_PROJECT_CREATED = "POST-EDIT_PROJECT_CREATED";
        public const string POSTEDIT_PROJECT_UPDATED = "POST-EDIT_PROJECT_UPDATED";
        public const string POSTEDIT_PROJECT_DELETED = "POST-EDIT_PROJECT_DELETED";
        public const string POSTEDIT_TASK_UPLOADED = "POST-EDIT_TASK_UPLOADED";
        public const string POSTEDIT_USERS_INVITATION_TRIGGERED = "POSTEDIT_USERS_INVITATION_TRIGGERED";        
        #endregion

        #region Pre-Edit
        public const string PREEDIT_ALL_DEMO_PAGE_REQUESTED = "ALL_DEMO_PAGE_REQUESTED";
        public const string PREEDIT_ENGLISH_DEMO_PAGE_REQUESTED = "ENGLISH_DEMO_PAGE_REQUESTED";
        public const string PREEDIT_FRENCH_DEMO_PAGE_REQUESTED = "FRENCH_DEMO_PAGE_REQUESTED";
        public const string PREEDIT_GERMAN_DEMO_PAGE_REQUESTED = "GERMAN_DEMO_PAGE_REQUESTED";
        public const string PREEDIT_PROJECT_CREATED = "PRE-EDIT_PROJECT_CREATED";
        public const string PREEDIT_PROJECT_UPDATED = "PRE-EDIT_PROJECT_UPDATED";
        public const string PREEDIT_PROJECT_DELETED = "PRE-EDIT_PROJECT_DELETED";
        public const string PREEDIT_PLUGIN_DOWNLOADED = "PRE-EDIT_PLUGIN_DOWNLOADED";
        public const string PREEDIT_APIKEY_CREATED = "PRE-EDIT_API_KEY_CREATED";
        public const string PREEDIT_APIKEY_UPDATED = "PRE-EDIT_API_KEY_UPDATED";
        public const string PREEDIT_APIKEY_DELETED = "PRE-EDIT_API_KEY_DELETED";        
        #endregion

        #region Evaluation
        public const string EVALUATION_PROJECT_CREATED = "EVALUATION_PROJECT_CREATED";
        public const string EVALUATION_PROJECT_UPDATED = "EVALUATION_PROJECT_UPDATE";
        public const string EVALUATION_PROJECT_DELETED = "EVALUATION_PROJECT_DELETED";        
        #endregion                                                     
    }
}
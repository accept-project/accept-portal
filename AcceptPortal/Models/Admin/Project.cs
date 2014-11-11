using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AcceptPortal.Models.PosEdit;
using System.ComponentModel.DataAnnotations;
using AcceptPortal.ViewModels;

namespace AcceptPortal.Models.Admin
{
    public class Project
    {
        public Project() { this.MaxThreshold = new TimeSpan(); }
        public Project(int id, string projectName, int domainID, string domainName, int status, List<Document> documents)
        {
            this.ID = id;
            this.ProjectName = projectName;
            this.DomainID = domainID;
            this.DomainName = domainName;
            this.Status = status;
            this.Documents = documents;
            this.ProjectSurvey = string.Empty;
            this.EmailInvitationBodyText = string.Empty;
            this.DisplayTranslationOptions = new ShowTranslationOptions();
            this.Completed = 0;
            this.Organization = string.Empty;
            this.ProjQuestion = string.Empty;
            this.CustomInterfaceConfiguration = 0;
            this.SingleRevision = false;
            this.MaxThreshold = new TimeSpan();
        }

        public Project(int id, string projectName, string projectOwner, string surveyUrl)
        {
            this.ID = id;
            this.ProjectName = projectName;
            this.DomainID = -1;
            this.DomainName = string.Empty;
            this.Status = 1;
            this.Documents = new List<Document>();
            this.ProjectOwner = projectOwner;
            this.ProjectSurvey = surveyUrl;
            this.EmailInvitationBodyText = string.Empty;
            this.DisplayTranslationOptions = new ShowTranslationOptions();
            this.Completed = 1;
            this.Organization = string.Empty;
            this.ProjQuestion = string.Empty;
            this.CustomInterfaceConfiguration = 0;
            this.SingleRevision = false;
            this.MaxThreshold = new TimeSpan();
        }

        public Project(int id, string projectName, int domainID, string domainName, int status,
            List<Document> documents, string projectOwner, int interfaceConfiguration, string sourceLang, string targetLang,
            string organization, List<ProjectOption> options, string question, int questionId, string surveyLink, string emailBody,
            ShowTranslationOptions showTranslationOptions, int customInterfaceConfiguration, bool isExternal, string adminToken,
            bool isSingleRevision, TimeSpan maxThreshold, int paraphrasingMode, int interactiveCheck, string interactiveCheckMetadata,
            string paraphrasingMetadata)
        {
            this.ID = id;
            this.ProjectName = projectName;
            this.DomainID = domainID;
            this.DomainName = domainName;
            this.Status = status;
            this.Documents = documents;
            this.ProjectOwner = projectOwner;
            this.ProjectSurvey = string.Empty;
            this.EmailInvitationBodyText = string.Empty;
            this.DisplayTranslationOptions = new ShowTranslationOptions();
            this.InterfaceConfigurationId = interfaceConfiguration;
            this.Completed = 0;
            this.Organization = organization;
            this.SourceLanguageName = sourceLang;
            this.TargetLanguageName = targetLang;
            this.ProjectOptions = options;
            this.ProjQuestion = question;
            this.ProjQuestionId = questionId;
            this.ProjectSurvey = surveyLink;
            this.EmailInvitationBodyText = emailBody;
            this.DisplayTranslationOptions = showTranslationOptions;
            this.CustomInterfaceConfiguration = customInterfaceConfiguration;
            this.External = isExternal;
            this.AdminToken = adminToken;
            this.SingleRevision = isSingleRevision;
            this.MaxThreshold = maxThreshold;
            this.ParaphrasingMode = paraphrasingMode;
            this.InteractiveCheck = interactiveCheck;
            this.InteractiveCheckMetadata = interactiveCheckMetadata;
            this.ParaphrasingMetadata = paraphrasingMetadata;
        }               

        public string InteractiveCheckingMetadataLabel;
        
        public int ID { get; set; }
                
        [Required(ErrorMessageResourceName = "PostEditProjectNameRequired", ErrorMessageResourceType = typeof(Resources.Global))]
        [DataType(DataType.Text)]
        [Display(Name = "PostEditProjectName", ResourceType = typeof(Resources.Global))]
        public string ProjectName { get; set; }
        
        public int DomainID { get; set; }
        public string DomainName { get; set; }
        public int Status { get; set; }
        public Domain ProjectDomain { get; set; }
        public List<Document> Documents { get; set; }               
        
        [Required]
        [Display(Name = "PostEditProjectSourceLanguage", ResourceType = typeof(Resources.Global))]
        public int SourceLangId { get; set; }
        
        [Required]
        [Display(Name = "PostEditProjectTargetLanguage", ResourceType = typeof(Resources.Global))]
        public int TargetLangId { get; set; }
        
        [Required]
        [Display(Name = "PostEditUIConfiguration", ResourceType = typeof(Resources.Global))]
        public int InterfaceConfigurationId { get; set; }
        
        [Required]
        [Display(Name = "PostEditProjectAdministrator", ResourceType = typeof(Resources.Global))]
        public string ProjectOwner { get; set; }
        
        [Display(Name = "PostEditProjectQuestions", ResourceType = typeof(Resources.Global))]
        public List<ProjectQuestion> ProjectQuestions { get; set; }
        
        [Display(Name = "PostEditProjectQuestion", ResourceType = typeof(Resources.Global))]
        public string ProjQuestion { get; set; }
        public int ProjQuestionId { get; set; }
        
        [Display(Name = "PostEditProjectOptions", ResourceType = typeof(Resources.Global))]
        public List<ProjectOption> ProjectOptions { get; set; }
        
        [Display(Name = "PostEditProjectSurveyLink", ResourceType = typeof(Resources.Global))]
        public string ProjectSurvey { get; set; }
        
        [Display(Name = "PostEditDisplayTranslationOptions", ResourceType = typeof(Resources.Global))]
        public ShowTranslationOptions DisplayTranslationOptions { get; set; }
        
        [Display(Name = "PostEditInvitationsEmailBodyText", ResourceType = typeof(Resources.Global))]
        public string EmailInvitationBodyText { get; set; }
        
        [Display(Name = "PostEditOrganization", ResourceType = typeof(Resources.Global))]
        public string Organization { get; set; }
        public int Completed { get; set; }
        
        [Required]
        [Display(Name = "PostEditProjectSourceLanguage", ResourceType = typeof(Resources.Global))]
        public string SourceLanguageName { get; set; }
        
        [Required]
        [Display(Name = "PostEditProjectTargetLanguage", ResourceType = typeof(Resources.Global))]        
        public string TargetLanguageName { get; set; }
        
        [Required]        
        [Display(Name = "CustomInterfaceConfiguration", ResourceType = typeof(Resources.Global))]
        public int CustomInterfaceConfiguration { get; set; }
        
        [Required]        
        [Display(Name = "ExternalProjectLabel", ResourceType = typeof(Resources.Global))]
        public bool External { get; set; }
        
        [Display(Name = "ProjectAdminToken", ResourceType = typeof(Resources.Global))]
        public string AdminToken { get; set; }
        
        public string UserRoleInProject { get; set; }
        
        [Required]
        [Display(Name = "SingleRevision", ResourceType = typeof(Resources.Global))]
        public bool SingleRevision { get; set; }
        
        [Required]
        [Display(Name = "MaxThresholdLabel", ResourceType = typeof(Resources.Global))]
        public TimeSpan MaxThreshold { get; set; }

        [Required]
        [Display(Name = "ParaphrasingModeLabel", ResourceType = typeof(Resources.Global))]
        public int ParaphrasingMode { get; set; }
        
        [Required]
        [Display(Name = "ParaphrasingMetadataLabel", ResourceType = typeof(Resources.Global))]
        public string ParaphrasingMetadata { get; set; }        
        
        [Required]
        [Display(Name = "InteractiveCheckingLabel", ResourceType = typeof(Resources.Global))]
        public int InteractiveCheck { get; set; }
        
        [Required]
        [Display(Name = "InteractiveCheckingMetadataLabel", ResourceType = typeof(Resources.Global))]
        public string InteractiveCheckMetadata { get; set; }
              
    }
}
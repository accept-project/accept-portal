using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using AcceptPortal.Resources;

namespace AcceptPortal.Models.Evaluation
{
    public class EvaluationProject
    {
        public EvaluationProject() { }

        public EvaluationProject(int id, string name, string description, string org, string _apiKey, string _domain, DateTime _createDate)
        {
            ID = id;
            Name = name;
            Description = description;
            Organization = org;
            ApiKey = _apiKey;
            Domain = _domain;
            CreationDate = _createDate;
            this.AdminToken = string.Empty;
            #region EvaluationInternal
            this.PostEditProjectId = -1;
            this.EvaluationType = -1;
            this.Questions = new List<EvaluationQuestion>();
            this.EvaluationMethod = 0;
            this.DuplicationLogic = 0;
            this.IncludeOwnerRevision = false;
            this.CustomEmailBody = string.Empty;
            this.ProjectCreator = string.Empty;
            #endregion
        }

        public EvaluationProject(int id, string name, string description, string org, string _apiKey, string _domain, DateTime _createDate, string adminToken)
        {
            ID = id;
            Name = name;
            Description = description;
            Organization = org;
            ApiKey = _apiKey;
            Domain = _domain;
            CreationDate = _createDate;
            this.AdminToken = adminToken;
            #region EvaluationInternal
            this.PostEditProjectId = -1;
            this.EvaluationType = -1;
            this.Questions = new List<EvaluationQuestion>();
            this.EvaluationMethod = 0;
            this.DuplicationLogic = 0;
            this.IncludeOwnerRevision = false;
            this.CustomEmailBody = string.Empty;
            this.ProjectCreator = string.Empty;
            #endregion
        }

        #region EvaluationInternal
        public EvaluationProject(int id, string name, string description, string org, string _apiKey, string _domain, DateTime _createDate,
           string adminToken, int type, int postEditprojectId, int evaluationMethod, int duplicationLogic, bool includeOwner, string customEmailBody, string creator)
        {
            ID = id;
            Name = name;
            Description = description;
            Organization = org;
            ApiKey = _apiKey;
            Domain = _domain;
            CreationDate = _createDate;
            this.AdminToken = adminToken;
            this.PostEditProjectId = postEditprojectId;
            this.EvaluationType = type;
            this.Questions = new List<EvaluationQuestion>();

            this.EvaluationMethod = evaluationMethod;
            this.DuplicationLogic = duplicationLogic;
            this.IncludeOwnerRevision = includeOwner;
            this.CustomEmailBody = customEmailBody;
            this.ProjectCreator = creator;

        }
        #endregion

        public int ID { get; set; }
        public virtual DateTime CreationDate { get; set; }
        public virtual string ApiKey { get; set; }

        [Required(ErrorMessageResourceType = typeof(Global), ErrorMessageResourceName = "EvaluationRequiredField")]
        [StringLength(200, ErrorMessageResourceType = typeof(Global), ErrorMessageResourceName = "EvaluationMaximumLength200")]
        public virtual string Domain { get; set; }

        [Required(ErrorMessageResourceType = typeof(Global), ErrorMessageResourceName = "EvaluationRequiredField")]
        [StringLength(50, ErrorMessageResourceType = typeof(Global), ErrorMessageResourceName = "EvaluationMaximumLength50")]
        public string Name { get; set; }

        [Required(ErrorMessageResourceType = typeof(Global), ErrorMessageResourceName = "EvaluationRequiredField")]
        [StringLength(25, ErrorMessageResourceType = typeof(Global), ErrorMessageResourceName = "EvaluationMaximumLength25")]
        public string Organization { get; set; }

        [Required(ErrorMessageResourceType = typeof(Global), ErrorMessageResourceName = "EvaluationRequiredField")]
        [StringLength(100, ErrorMessageResourceType = typeof(Global), ErrorMessageResourceName = "EvaluationMaximumLength100")]
        public string Description { get; set; }

        public string Status { get; set; }
        public EvaluationType EvalType { get; set; }
        public List<EvaluationProvider> Providers { get; set; }
        public List<EvaluationLanguagePair> LanguagePairs { get; set; }
        public string AdminToken { get; set; }

        #region EvaluationInternal
        public virtual string ProjectCreator { get; set; }

        [Required]
        [Display(Name = "EvaluationProjectReferencePostEditProjectLabel", ResourceType = typeof(Resources.Global))]
        public int PostEditProjectId { get; set; }

        [Required]
        [Display(Name = "EvaluationProjectTypeLabel", ResourceType = typeof(Resources.Global))]
        public int EvaluationType { get; set; }

        [Required]
        [Display(Name = "EvaluationMethodLabel", ResourceType = typeof(Resources.Global))]
        public int EvaluationMethod { get; set; }

        [Required]
        [Display(Name = "DuplicationLogicLabel", ResourceType = typeof(Resources.Global))]
        public int DuplicationLogic { get; set; }

        [Required]
        [Display(Name = "IncludeOwnerRevisionLabel", ResourceType = typeof(Resources.Global))]
        public bool IncludeOwnerRevision { get; set; }

        [Display(Name = "CustomEmailBodyLabel", ResourceType = typeof(Resources.Global))]
        public string CustomEmailBody { get; set; }

        public List<EvaluationQuestion> Questions { get; set; }
        #endregion

    }
}
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
        }

        public  int ID { get; set; }
        public virtual DateTime CreationDate { get; set; }
        public virtual string ApiKey { get; set; }

        [Required(ErrorMessageResourceType = typeof (Global), ErrorMessageResourceName = "EvaluationRequiredField")]
        [StringLength(200, ErrorMessageResourceType = typeof (Global), ErrorMessageResourceName = "EvaluationMaximumLength200")]
        public virtual string Domain { get; set; }

        [Required(ErrorMessageResourceType = typeof(Global), ErrorMessageResourceName = "EvaluationRequiredField")]
        [StringLength(50, ErrorMessageResourceType = typeof (Global), ErrorMessageResourceName = "EvaluationMaximumLength50")]
        public string Name { get; set; }

        [Required(ErrorMessageResourceType = typeof(Global), ErrorMessageResourceName = "EvaluationRequiredField")]
        [StringLength(25, ErrorMessageResourceType = typeof (Global), ErrorMessageResourceName = "EvaluationMaximumLength25")]
        public string Organization { get; set; }

        [Required(ErrorMessageResourceType = typeof(Global), ErrorMessageResourceName = "EvaluationRequiredField")]
        [StringLength(100, ErrorMessageResourceType = typeof (Global), ErrorMessageResourceName = "EvaluationMaximumLength100")]
        public string Description { get; set; }

        public string Status { get; set; }
        public EvaluationType EvalType { get; set; }
        public List<EvaluationProvider> Providers { get; set; }
        public List<EvaluationLanguagePair> LanguagePairs { get; set; }
        public string AdminToken { get; set; }
    
    }
}
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using AcceptPortal.Models.Admin;
using AcceptPortal.Models.Evaluation;
using System.Web.WebPages.Html;

namespace AcceptPortal.ViewModels
{
    public class ProjectVM
    {       
        public Project Project { get; set; }
        public List<EvaluationLanguage> SourceLanguageList { get; set; }
        public List<EvaluationLanguage> TargetLanguageList { get; set; }
        public List<Domain> DomainsList { get; set; }
        public List<ProjectUICongfiguration> ConfigurationList { get; set; }       
        public List<ShowTranslationOptions> UseTranslationOptions { get; set; }       
        public bool IsProjectStarted { get; set; }
        public List<CustomInterfaceConfigurationOption> CustomInterfaceConfigurationOptions { get; set; }
        public List<ParaphrasingModeOption> ParaphrasingModeOptions { get; set; }
        public List<InteractiveCheckOption> InteractiveCheckOptions { get; set; }
        public PostEditDefaultsVM PostEditDefaults { get; set; }
        [Required]
        public string AllOptions { get; set; }
        [Required]
        public string AllQuestions { get; set; }

        public ProjectVM()
        {
            this.Project = new Project();
            this.DomainsList = new List<Domain>();
            this.SourceLanguageList = new List<EvaluationLanguage>();
            this.TargetLanguageList = new List<EvaluationLanguage>();
            this.ConfigurationList = new List<ProjectUICongfiguration>();         
            this.AllOptions = string.Empty;
            this.AllQuestions = string.Empty;
            this.UseTranslationOptions = new List<ShowTranslationOptions>();
            this.IsProjectStarted = false;
            this.CustomInterfaceConfigurationOptions = new List<CustomInterfaceConfigurationOption>();
            this.ParaphrasingModeOptions = new List<ParaphrasingModeOption>();
            this.InteractiveCheckOptions = new List<InteractiveCheckOption>();
            this.PostEditDefaults = new PostEditDefaultsVM();
        }

    
    }

    #region post-edit project aux objects

    public class ProjectOption
    {
        public ProjectOption(int id, string option)
        {
            this.ID = id;
            this.Option = option;
        }
        public int ID { get; set; }
        public string Option { get; set; }
    }

    public class ProjectQuestion
    {
        public int ID { get; set; }
        public string Question { get; set; }
    }

    public class ProjectUICongfiguration
    {
        public ProjectUICongfiguration()
        {

        }
        public ProjectUICongfiguration(int id, string name)
        {
            this.ID = id;
            this.Name = name;
        }
        public int ID { get; set; }
        public string Name { get; set; }
    }

    public class BaseSelect
    { 
        public BaseSelect()
        {

        }
        public BaseSelect(int id, string label)
        {
            this.ID = id;
            this.Label = label;
        }
        public int ID { get; set; }
        public string Label { get; set; }    
    }

    public class ShowTranslationOptions:BaseSelect
    {
        public ShowTranslationOptions()
        :base(){}

        public ShowTranslationOptions(int id, string label)
        :base(id,label){}       
    }

    public class CustomInterfaceConfigurationOption : BaseSelect
    {
        public CustomInterfaceConfigurationOption(int id, string label)
            : base(id, label)
        {
        }
    }

    public class ParaphrasingModeOption : BaseSelect
    {
        public ParaphrasingModeOption(int id, string label)
            : base(id, label)
        {
        }
    }

    public class InteractiveCheckOption : BaseSelect
    {
        public InteractiveCheckOption(int id, string label)
            : base(id, label)
        {
        }
    }

    #endregion
}
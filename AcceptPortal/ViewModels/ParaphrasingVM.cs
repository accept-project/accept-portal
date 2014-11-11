using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AcceptPortal.ViewModels
{
    public class PostEditDefaultsVM
    {
        public string MaxResultsEnglish { get; set; }
        public string MaxResultFrench { get; set; }
        public string LanguageCodeEnglish { get; set; }
        public string LanguageCodeFrench { get; set; }
        public string SystemIdEnglish { get; set; }
        public string SystemIdFrench { get; set; }      
        public string InteractiveChecksDefaultRuleSet { get; set; }
        
        public PostEditDefaultsVM()
        {
            this.LanguageCodeEnglish = string.Empty;
            this.LanguageCodeFrench = string.Empty;
            this.MaxResultFrench = string.Empty;
            this.MaxResultsEnglish = string.Empty;
            this.SystemIdEnglish = string.Empty;
            this.SystemIdFrench = string.Empty;
            this.InteractiveChecksDefaultRuleSet = string.Empty;
        }
    
    }
}
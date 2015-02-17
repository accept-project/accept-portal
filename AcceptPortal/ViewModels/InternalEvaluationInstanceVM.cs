using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AcceptPortal.ViewModels
{
    #region EvaluationInternal
    public class InternalEvaluationInstanceVM
    {
        public string TextId { get; set; }
        public string UserId { get; set; }

        public List<string> Sources { get; set; }
        public List<string> Targets { get; set; }
        public List<string> MTBaselines { get; set; }
        public List<List<string>> AlternativeTranslations { get; set; }

        public InternalEvaluationInstanceVM()
        {
            this.TextId = string.Empty;
            this.UserId = string.Empty;
            this.Sources = new List<string>();
            this.Targets = new List<string>();
            this.MTBaselines = new List<string>();
            this.AlternativeTranslations = new List<List<string>>();
        }

    }
    #endregion
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AcceptPortal.Models.Audit
{
    public class CoreAudit
    {
        public string UserName { get; set; }
        public string Type { get; set; }
        public string Action { get; set; }
        public string Description { get; set; }
        public string Origin { get; set; }
        public string Meta { get; set; }
        public string TimeStamp { get; set; }
        public string Language { get; set; }
        public string UserAgent { get; set; }

        public CoreAudit() 
        {
            this.UserName = string.Empty;
            this.Type = string.Empty;
            this.Action = string.Empty;
            this.Description = string.Empty;
            this.Origin = string.Empty;
            this.Meta = string.Empty;
            this.TimeStamp = string.Empty;
            this.Language = string.Empty;
            this.UserAgent = string.Empty;
        }

    }
}
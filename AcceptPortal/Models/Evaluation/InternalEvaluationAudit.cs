using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AcceptPortal.Models.Evaluation
{
    #region EvaluationInternal
    public class InternalEvaluationAudit
    {
        public string Id { get; set; }
        public string ProjectToken { get; set; }
        public string UserName { get; set; }
        public DateTime CreationDate { get; set; }
        public int Status { get; set; }
        public string Meta { get; set; }

        public InternalEvaluationAudit()
        {
            this.ProjectToken = string.Empty;
            this.UserName = string.Empty;
            this.CreationDate = DateTime.MinValue;
            this.Status = -1;
            this.Meta = string.Empty;
            this.Id = string.Empty;
        }

        public InternalEvaluationAudit(string id, string token, string user, DateTime date, int status, string meta)
        {
            this.Id = id;
            this.ProjectToken = token;
            this.UserName = user;
            this.CreationDate = date;
            this.Status = status;
            this.Meta = meta;
        }
    }
    #endregion
}
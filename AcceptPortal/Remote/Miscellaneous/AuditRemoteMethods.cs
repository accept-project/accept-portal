using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using AcceptPortal.Models.Audit;
using AcceptPortal.Utils;

namespace AcceptPortal.Remote.Miscellaneous
{
    public static class AuditRemoteMethods
    {
        public static void PageVisit(CoreAudit pageVisitAudit)
        {
            string jSonResponse = WebUtils.PostJson(CoreUtils.PageVisitCoreAuditPath, string.Format(CoreUtils.PageVisitCoreAuditBody, pageVisitAudit.UserName, pageVisitAudit.Type, pageVisitAudit.Action, pageVisitAudit.Description, pageVisitAudit.Origin, pageVisitAudit.Meta, pageVisitAudit.TimeStamp, pageVisitAudit.Language, pageVisitAudit.UserAgent), "application/json");
            if (jSonResponse.Length > 0)
            {
                var serializer = new JavaScriptSerializer();
                serializer.RegisterConverters(new[] { new DynamicJsonConverter() });
                dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                if (obj.ResponseStatus != null && obj.ResponseStatus != "OK")
                {
                    throw new Exception("Request audit failed.");
                }
            }
        }
    
    }
}
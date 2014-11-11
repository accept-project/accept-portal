using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AcceptPortal.Models.Audit;
using System.Web.Mvc;
using AcceptPortal.Utils;
using AcceptPortal.Remote.Miscellaneous;

namespace AcceptPortal.Filters
{
    public class AuditFilter : ActionFilterAttribute
    {        
        public string AuditAction { set; get; }
        public string AuditType { set; get; }
        public string AuditDescription { set; get; }
        public const string TYPEDEFAULT = "PORTAL";
        public const string AUDIT_DEFAULT_DESCRIPTION = "PAGE_REQUESTED";
        public const string READ = "READ";
        public const string CREATE = "CREATE";
        public const string UPDATE = "UPDATE";
        public const string DELETE = "DELETE";

        public AuditFilter()
        {            
            this.AuditAction = AuditFilter.READ;
            this.AuditType = AuditFilter.TYPEDEFAULT;
            this.AuditDescription = AuditFilter.AUDIT_DEFAULT_DESCRIPTION;
        }

        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {           
            if(CoreUtils.IsPageVisitAuditEnabled)
            {
                //stores the request in an accessible object.
                var request = filterContext.HttpContext.Request;

                CoreAudit audit = new CoreAudit()
                {
                    //the user name (if available).
                    UserName = (request.IsAuthenticated) ? filterContext.HttpContext.User.Identity.Name : "Anonymous",
                    //the IP address of the request.
                    Origin = request.ServerVariables["HTTP_X_FORWARDED_FOR"] ?? request.UserHostAddress,
                    //the URL that was accessed.
                    Meta = request.Url != null ? request.Url.AbsoluteUri : string.Empty,
                    //page request timestamp.
                    TimeStamp = DateTime.UtcNow.ToString(),
                    //does not matter in this context, it will be always portal.
                    Type = this.AuditType,
                    //example: "page visit" its a read action.
                    Action = this.AuditAction,
                    //Description provided for the Audit.
                    Description = this.AuditDescription,
                    //language under the http header: accept-Language.
                    Language = request.Headers["Accept-Language"] ?? string.Empty,
                    //browser info taken from the http request header.
                    UserAgent = request.Headers["User-Agent"] ?? string.Empty
                };

                AuditRemoteMethods.PageVisit(audit);
            }

            base.OnActionExecuting(filterContext);
        }    
    }
}
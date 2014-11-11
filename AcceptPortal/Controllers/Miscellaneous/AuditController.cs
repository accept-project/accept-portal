using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AcceptPortal.Filters;
using AcceptPortal.Models.Audit;
using AcceptPortal.Remote.Miscellaneous;

namespace AcceptPortal.Controllers
{
    [AcceptRequireHttps]
    [Localization]
    [Authorize]
    public class AuditController : Controller
    {       
        // GET: /Audit/
        public ActionResult Index()
        {
            return View();
        }
      
        public ActionResult PageVisit(string action, string description, string meta)
        {

            var request = HttpContext.Request;

            CoreAudit audit = new CoreAudit()
            {
                //the user name (if available).
                UserName = (request.IsAuthenticated) ? HttpContext.User.Identity.Name : "Anonymous",
                //the IP address of the request.
                Origin = request.ServerVariables["HTTP_X_FORWARDED_FOR"] ?? request.UserHostAddress,
                //the URL that was accessed.
                Meta = request.Url != null ? request.Url.AbsoluteUri : string.Empty,
                //page request timestamp.
                TimeStamp = DateTime.UtcNow.ToString(),
                //does not matter in this context, it will be always portal.
                Type = AuditFilter.TYPEDEFAULT,
                //example: "page visit" its a read action.
                Action = action,
                Description = description,
                //language under the http header: accept-Language.
                Language = request.Headers["Accept-Language"] ?? string.Empty,
                //browser info taken from the http request header.
                UserAgent = request.Headers["User-Agent"] ?? string.Empty
            };

            AuditRemoteMethods.PageVisit(audit);
            return View();
        }

    }
}

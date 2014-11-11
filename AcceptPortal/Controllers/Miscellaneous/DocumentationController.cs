using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AcceptPortal.Filters;
using AcceptPortal.Models.Audit;
using AcceptPortal.Utils;

namespace AcceptPortal.Controllers
{
    [AcceptRequireHttps]
    [Localization]
    [Authorize]    
    public class DocumentationController : Controller
    {
        // GET: /Documentation/
        [AuditFilter(AuditAction = AuditFilter.READ, AuditType = AuditFilter.TYPEDEFAULT, AuditDescription = AuditDescriptor.LEARN_PAGE_REQUESTED)]
        public ActionResult Index(string section)
        {
            try
            {
                switch (section)
                {
                    case "pre": { ViewBag.Section = CoreUtils.LearnEndpointPreEdit; } break;
                    case "post": { ViewBag.Section = CoreUtils.LearnEndpointPostEdit; } break;
                    case "eval": { ViewBag.Section = CoreUtils.LearnEndpointEvaluation; } break;
                    default: { ViewBag.Section = CoreUtils.LearnEndpoint; } break;
                }
            }
            catch
            {
                ViewBag.Section = CoreUtils.LearnEndpoint;                
            }
                                   
            return View("All");           
        }
  
        [AllowAnonymous]
        public ActionResult Privacy()
        {
            return new FilePathResult("~/Html/TermsAndConditions/PortalPrivacyPolice.html", "text/html");          
        }

        [AllowAnonymous]
        public ActionResult Terms()
        {
            return new FilePathResult("~/Html/TermsAndConditions/AcceptPortalToS.html", "text/html");            
        }

    }
}

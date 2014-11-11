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
    [Localization]
    [Authorize]
    public class AppraiseController : Controller
    {      
        // GET: /Appraise/
        [AuditFilter(AuditAction = AuditFilter.READ, AuditType = AuditFilter.TYPEDEFAULT, AuditDescription = AuditDescriptor.APPRAISE_PAGE_REQUESTED)]
        public ActionResult Index()
        {
            @ViewBag.AppraiseEndpoint = CoreUtils.AppraiseEndpoint;
            return View();
        }

    }
}

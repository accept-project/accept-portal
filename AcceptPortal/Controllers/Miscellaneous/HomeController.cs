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
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Message = "Modify this template to jump-start your ASP.NET MVC application.";

            return View();
        }

        [AuditFilter(AuditAction=AuditFilter.READ, AuditType=AuditFilter.TYPEDEFAULT, AuditDescription=AuditDescriptor.PORTAL_LOGIN)]
        public ActionResult About()
        {
            ViewBag.Message = "Your app description page.";
          
            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}

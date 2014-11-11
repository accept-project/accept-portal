using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AcceptPortal.Remote.Miscellaneous;
using AcceptPortal.Filters;
using AcceptPortal.Models.Admin;

namespace AcceptPortal.Controllers.Admin
{
    [AcceptRequireHttps]
    [Localization]
    [Authorize]
    public class AdminController : Controller
    {
        //
        // GET: /Admin/
        [AuditFilter(AuditAction = AuditFilter.READ, AuditType = AuditFilter.TYPEDEFAULT, AuditDescription = AuditFilter.AUDIT_DEFAULT_DESCRIPTION)]
        public ActionResult Index()
        {
            return View();                             
        }

        [HttpGet]
        public bool UserFeedback(string user, string email, string message, string link, string subject)
        {
            try
            {
                return MiscellaneousRemoteMethods.SendUserFeedback(MiscellaneousRemoteMethods.GetUserFeedbackJsonBody(user, email, link, message, subject));              
            }
            catch (Exception e)
            {
                return false;
            }            
        }
        
        [HttpGet] 
        public ActionResult  AllUsers()
        {
            List<User> all = MiscellaneousRemoteMethods.GetAllUsers();
           SelectList list = new SelectList(all, "Id", "UserName");
           @ViewBag.AllUsers = all.Select(x => x.UserName).ToList<string>();
           return PartialView("_AllUsersPartial", list);
        }        
    }
}

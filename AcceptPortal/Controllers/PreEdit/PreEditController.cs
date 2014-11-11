using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using AcceptPortal.Filters;
using AcceptPortal.Models.Audit;
using AcceptPortal.Models.User;
using AcceptPortal.Remote.Miscellaneous;

namespace AcceptPortal.Controllers
{
    [Localization]
    [Authorize]
    public class PreEditController : Controller
    {
        
        // GET: /PreEdit/
        public ActionResult Index()
        {
            return View();
        }
     
        [AuditFilter(AuditAction = AuditFilter.READ, AuditType = AuditFilter.TYPEDEFAULT, AuditDescription = AuditFilter.AUDIT_DEFAULT_DESCRIPTION)]
        public ActionResult UserProfile()
        {
            UserAccountProfile userProfile; userProfile = new UserAccountProfile();
            userProfile.UserName = User.Identity.Name;
            userProfile.UserApplications = UsersRemoteMethods.GetUserApplications(userProfile.UserName);
            userProfile.UserSecretKey = UsersRemoteMethods.GetUserSecretKey(userProfile.UserName);
            return View(userProfile);
        }
        
        [AuditFilter(AuditAction = AuditFilter.READ, AuditType = AuditFilter.TYPEDEFAULT, AuditDescription = AuditFilter.AUDIT_DEFAULT_DESCRIPTION)]
        public ActionResult UserApplication(UserApplication model)
        {            
            return View(model);
        }

        [Authorize]
        [AuditFilter(AuditAction = AuditFilter.READ, AuditType = AuditFilter.TYPEDEFAULT, AuditDescription = AuditFilter.AUDIT_DEFAULT_DESCRIPTION)]
        public ActionResult ApplicationDetail(string apiKey)
        {
            UserApplication model = UsersRemoteMethods.GetApplication(User.Identity.Name, apiKey);
            return View(model);
        }

        [Authorize]
        [AuditFilter(AuditAction = AuditFilter.UPDATE, AuditType = AuditFilter.TYPEDEFAULT, AuditDescription = AuditDescriptor.PREEDIT_APIKEY_UPDATED)]
        public ActionResult UpdateApplicationDetail(UserApplication modelToUpdate)
        {
            UserApplication model = UsersRemoteMethods.UpdateApplication(User.Identity.Name, modelToUpdate.AccessToken, modelToUpdate.ApplicationDns, modelToUpdate.ApplicationIp, modelToUpdate.ApplicationName, modelToUpdate.OrganizationName, modelToUpdate.Description);
            RouteValueDictionary route = new RouteValueDictionary();
            route.Add("apiKey", modelToUpdate.AccessToken); 
            return RedirectToAction("ApplicationDetail", "PreEdit", route);
        }
       
        [Authorize]
        public ActionResult CreateApplication()
        {
            return View();
        }

        [Authorize]
        [AuditFilter(AuditAction = AuditFilter.DELETE, AuditType = AuditFilter.TYPEDEFAULT, AuditDescription = AuditDescriptor.PREEDIT_APIKEY_DELETED)]
        public ActionResult DeleteApplication(string apiKey)
        {
            UsersRemoteMethods.DeleteApplication(User.Identity.Name, apiKey);
            UserAccountProfile userProfile; userProfile = new UserAccountProfile();
            userProfile.UserName = User.Identity.Name;
            userProfile.UserApplications = UsersRemoteMethods.GetUserApplications(userProfile.UserName);
            return View("UserProfile", userProfile);
        }

        /// <summary>
        /// this method creates an api key for the pre-edit plug-in.
        /// </summary>
        /// <param name="model">data model that will be bind.</param>
        /// <returns>view with all api keys.</returns>
        [Authorize]
        [HttpPost]
        [AuditFilter(AuditAction = AuditFilter.CREATE, AuditType = AuditFilter.TYPEDEFAULT, AuditDescription = AuditDescriptor.PREEDIT_APIKEY_CREATED)]        
        public ActionResult CreateApplication(UserApplication model)
        {
            if (ModelState.IsValid)
            {
                UserApplication userApp = UsersRemoteMethods.CreateApplication(User.Identity.Name, model.ApplicationDns, model.ApplicationIp, model.ApplicationName, model.OrganizationName, model.Description);
                if (userApp != null)
                {
                    RedirectToAction("UserProfile");
                }
            }
            UserAccountProfile userProfile; userProfile = new UserAccountProfile();
            userProfile.UserName = User.Identity.Name;
            userProfile.UserApplications = UsersRemoteMethods.GetUserApplications(userProfile.UserName);
            return View("UserProfile", userProfile);
        }
        
    }
}

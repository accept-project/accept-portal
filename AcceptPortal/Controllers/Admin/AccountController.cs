using System;
using System.Collections.Generic;
using System.Linq;
using System.Transactions;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using DotNetOpenAuth.AspNet;
using Microsoft.Web.WebPages.OAuth;
using WebMatrix.WebData;
using AcceptPortal.Filters;
using AcceptPortal.Models;
using AcceptPortal.Models.User;
using System.Web.Routing;
using AcceptPortal.Models.Security;
using AcceptPortal.Utils;
using AcceptPortal.Models.Audit;

namespace AcceptPortal.Controllers
{
    [AcceptRequireHttps]    
    [Localization]
    [Authorize]
    [InitializeSimpleMembership]
    public class AccountController : Controller
    {        
        // GET: /Account/Login
        [AllowAnonymous]
        public ActionResult Login(string returnUrl)
        {
            ViewBag.ReturnUrl = returnUrl;

            #region check for user info messages
            if (TempData.ContainsKey("LoginMessage"))                        
                ViewBag.LoginMessage = TempData["LoginMessage"];            
           
            if (TempData.ContainsKey("UserName"))            
                ViewBag.UserName = (string)TempData["UserName"];                       
                       
            if (TempData.ContainsKey("ProjectIdInvitationUserName") && TempData.ContainsKey("ProjectIdInvitation"))
            {
                ViewBag.UserName = (string)TempData["ProjectIdInvitationUserName"];
                ViewBag.ProjectId = TempData["ProjectIdInvitation"];
                TempData.Clear();                
                TempData.Add("ProjectIdInvitationUserName", ViewBag.UserName);
                TempData.Add("ProjectIdInvitation", ViewBag.ProjectId);
            }
            #endregion

            return View();
        }
        
        // POST: /Account/Login
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        [AuditFilter(AuditAction = AuditFilter.READ, AuditType = AuditFilter.TYPEDEFAULT, AuditDescription = AuditDescriptor.PORTAL_LOGIN_ATTEMPT)]
        public ActionResult Login(LoginModel model, string returnUrl)
        {
           
            if (ModelState.IsValid && Membership.ValidateUser(model.UserName, model.Password))
            {
                FormsAuthentication.SetAuthCookie(model.UserName, model.RememberMe);
                if (Url.IsLocalUrl(returnUrl) && returnUrl.Length > 1 && returnUrl.StartsWith("/") && !returnUrl.StartsWith("//") && !returnUrl.StartsWith("/\\"))
                {                 
                    if (System.Web.HttpContext.Current.Request.Cookies["AceeptRedirection"] != null)
                    {
                        HttpCookie myCookie = System.Web.HttpContext.Current.Request.Cookies["AceeptRedirection"];
                        string projectId = myCookie["ProjectId"];
                        
                        //delete redirection cookie.
                        var c = new HttpCookie("AceeptRedirection");
                        c.Expires = DateTime.Now.AddDays(-1);
                        Response.Cookies.Add(c);

                        return RedirectToAction("ProjectDetail", new RouteValueDictionary(new { controller = "PostEdit", action = "ProjectDetail", Id = projectId }));                       
                    }
                    else
                    if (TempData.ContainsKey("ProjectIdInvitation"))
                    {
                        var projectId = TempData["ProjectIdInvitation"];
                        TempData.Clear();
                        return RedirectToAction("ProjectDetail", new RouteValueDictionary(new { controller = "PostEdit", action = "ProjectDetail", Id = projectId.ToString() }));                       
                    }
                    else                                        
                    return Redirect(returnUrl);
                }
                else
                {
                    if (System.Web.HttpContext.Current.Request.Cookies["AceeptRedirection"] != null)
                    {
                        HttpCookie myCookie = System.Web.HttpContext.Current.Request.Cookies["AceeptRedirection"];
                        string projectId = myCookie["ProjectId"];

                        //delete redirection cookie.
                        var c = new HttpCookie("AceeptRedirection");
                        c.Expires = DateTime.Now.AddDays(-1);
                        Response.Cookies.Add(c);

                        return RedirectToAction("ProjectDetail", new RouteValueDictionary(new { controller = "PostEdit", action = "ProjectDetail", Id = projectId }));
                    }
                    else
                    if (TempData.ContainsKey("ProjectIdInvitationUserName"))
                    {                        
                        var projectId = TempData["ProjectIdInvitation"];
                        TempData.Clear();
                        return RedirectToAction("ProjectDetail", new RouteValueDictionary(new { controller = "PostEdit", action = "ProjectDetail", Id = projectId.ToString() }));
                       
                    }
                    else   
                    return RedirectToAction("About", "Home");
                }                        
            }

            // If we got this far, something failed, redisplay form
            ModelState.AddModelError("", @AcceptPortal.Resources.Global.UserOrPasswordProvidedIncorrect);
            return View(model);
        }
        
        // POST: /Account/LogOff
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult LogOff()
        {                             
            FormsAuthentication.SignOut(); 
            return RedirectToAction("About", "Home");
        }
        
        // GET: /Account/Register
        [HttpGet]
        [AllowAnonymous]       
        public ActionResult Register()
        {
            if (TempData.ContainsKey("ProjectIdInvitationUserName"))           
                ViewBag.UserName = (string)TempData["ProjectIdInvitationUserName"];

            ModelState.Clear();      
            return View();
        }
        
        // POST: /Account/Register
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public ActionResult Register(RegisterModel model)
        {
            if (ModelState.IsValid)
            {                
                #region MVC3 legacy

                MembershipCreateStatus createStatus;
                Membership.Provider.CreateUser(model.UserName, model.Password, model.UserName, null, null, true, null, out createStatus);

                if (createStatus == MembershipCreateStatus.Success)
                {                     
                    TempData.Add("LoginMessage", @AcceptPortal.Resources.Global.LoginSuccessMessage + " " + @AcceptPortal.Resources.Global.SpamFilterNote);
                    TempData.Add("UserName", model.UserName);                           
                    return RedirectToAction("Login", "Account");
                }
                else
                    ModelState.AddModelError("", ErrorCodeToString(createStatus));

                #endregion
            }

            //if it got this far, something failed, redisplay form.
            return View(model);
        }

        // POST: /Account/Disassociate
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Disassociate(string provider, string providerUserId)
        {
            string ownerAccount = OAuthWebSecurity.GetUserName(provider, providerUserId);
            ManageMessageId? message = null;

            //only disassociate the account if the currently logged in user is the owner.
            if (ownerAccount == User.Identity.Name)
            {
                //use a transaction to prevent the user from deleting their last login credential.
                using (var scope = new TransactionScope(TransactionScopeOption.Required, new TransactionOptions { IsolationLevel = IsolationLevel.Serializable }))
                {
                    bool hasLocalAccount = OAuthWebSecurity.HasLocalAccount(WebSecurity.GetUserId(User.Identity.Name));
                    if (hasLocalAccount || OAuthWebSecurity.GetAccountsFromUserName(User.Identity.Name).Count > 1)
                    {
                        OAuthWebSecurity.DeleteAccount(provider, providerUserId);
                        scope.Complete();
                        message = ManageMessageId.RemoveLoginSuccess;
                    }
                }
            }

            return RedirectToAction("Manage", new { Message = message });
        }
        
        // GET: /Account/Manage
        public ActionResult Manage(ManageMessageId? message)
        {
            ViewBag.StatusMessage =
                message == ManageMessageId.ChangePasswordSuccess ? "Your password has been changed."
                : message == ManageMessageId.SetPasswordSuccess ? "Your password has been set."
                : message == ManageMessageId.RemoveLoginSuccess ? "The external login was removed."
                : "";
            ViewBag.HasLocalPassword = OAuthWebSecurity.HasLocalAccount(WebSecurity.GetUserId(User.Identity.Name));
            ViewBag.ReturnUrl = Url.Action("Manage");
            return View();
        }
        
        // POST: /Account/Manage
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Manage(LocalPasswordModel model)
        {
            bool hasLocalAccount = OAuthWebSecurity.HasLocalAccount(WebSecurity.GetUserId(User.Identity.Name));
            ViewBag.HasLocalPassword = hasLocalAccount;
            ViewBag.ReturnUrl = Url.Action("Manage");
            if (hasLocalAccount)
            {
                if (ModelState.IsValid)
                {
                    //changePassword will throw an exception rather than return false in certain failure scenarios.
                    bool changePasswordSucceeded;
                    try
                    {
                        changePasswordSucceeded = WebSecurity.ChangePassword(User.Identity.Name, model.OldPassword, model.NewPassword);
                    }
                    catch (Exception)
                    {
                        changePasswordSucceeded = false;
                    }

                    if (changePasswordSucceeded)
                    {
                        return RedirectToAction("Manage", new { Message = ManageMessageId.ChangePasswordSuccess });
                    }
                    else
                    {
                        ModelState.AddModelError("", "The current password is incorrect or the new password is invalid.");
                    }
                }
            }
            else
            {
                //user does not have a local password so remove any validation errors caused by a missing
                //oldPassword field
                ModelState state = ModelState["OldPassword"];
                if (state != null)
                {
                    state.Errors.Clear();
                }

                if (ModelState.IsValid)
                {
                    try
                    {
                        WebSecurity.CreateAccount(User.Identity.Name, model.NewPassword);
                        return RedirectToAction("Manage", new { Message = ManageMessageId.SetPasswordSuccess });
                    }
                    catch (Exception e)
                    {
                        ModelState.AddModelError("", e);
                    }
                }
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }
        
        // POST: /Account/ExternalLogin
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public ActionResult ExternalLogin(string provider, string returnUrl)
        {
            return new ExternalLoginResult(provider, Url.Action("ExternalLoginCallback", new { ReturnUrl = returnUrl }));
        }
        
        // GET: /Account/ExternalLoginCallback
        [AllowAnonymous]
        public ActionResult ExternalLoginCallback(string returnUrl)
        {
            AuthenticationResult result = OAuthWebSecurity.VerifyAuthentication(Url.Action("ExternalLoginCallback", new { ReturnUrl = returnUrl }));
            if (!result.IsSuccessful)
            {
                return RedirectToAction("ExternalLoginFailure");
            }

            if (OAuthWebSecurity.Login(result.Provider, result.ProviderUserId, createPersistentCookie: false))
            {
                return RedirectToLocal(returnUrl);
            }

            if (User.Identity.IsAuthenticated)
            {
                //if the current user is logged in add the new account.
                OAuthWebSecurity.CreateOrUpdateAccount(result.Provider, result.ProviderUserId, User.Identity.Name);
                return RedirectToLocal(returnUrl);
            }
            else
            {
                //user is new, ask for their desired membership name.
                string loginData = OAuthWebSecurity.SerializeProviderUserId(result.Provider, result.ProviderUserId);
                ViewBag.ProviderDisplayName = OAuthWebSecurity.GetOAuthClientData(result.Provider).DisplayName;
                ViewBag.ReturnUrl = returnUrl;
                return View("ExternalLoginConfirmation", new RegisterExternalLoginModel { UserName = result.UserName, ExternalLoginData = loginData });
            }
        }
        
        // POST: /Account/ExternalLoginConfirmation
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public ActionResult ExternalLoginConfirmation(RegisterExternalLoginModel model, string returnUrl)
        {
            string provider = null;
            string providerUserId = null;

            if (User.Identity.IsAuthenticated || !OAuthWebSecurity.TryDeserializeProviderUserId(model.ExternalLoginData, out provider, out providerUserId))
            {
                return RedirectToAction("Manage");
            }

            if (ModelState.IsValid)
            {
                //insert a new user into the database.
                using (UsersContext db = new UsersContext())
                {
                    UserProfile user = db.UserProfiles.FirstOrDefault(u => u.UserName.ToLower() == model.UserName.ToLower());
                    //check if user already exists.
                    if (user == null)
                    {
                        //insert name into the profile table.
                        db.UserProfiles.Add(new UserProfile { UserName = model.UserName });
                        db.SaveChanges();

                        OAuthWebSecurity.CreateOrUpdateAccount(provider, providerUserId, model.UserName);
                        OAuthWebSecurity.Login(provider, providerUserId, createPersistentCookie: false);

                        return RedirectToLocal(returnUrl);
                    }
                    else
                    {
                        ModelState.AddModelError("UserName", "User name already exists. Please enter a different user name.");
                    }
                }
            }

            ViewBag.ProviderDisplayName = OAuthWebSecurity.GetOAuthClientData(provider).DisplayName;
            ViewBag.ReturnUrl = returnUrl;
            return View(model);
        }
        
        // GET: /Account/ExternalLoginFailure
        [AllowAnonymous]
        public ActionResult ExternalLoginFailure()
        {
            return View();
        }

        [AllowAnonymous]
        [ChildActionOnly]
        public ActionResult ExternalLoginsList(string returnUrl)
        {
            ViewBag.ReturnUrl = returnUrl;
            return PartialView("_ExternalLoginsListPartial", OAuthWebSecurity.RegisteredClientData);
        }

        [ChildActionOnly]
        public ActionResult RemoveExternalLogins()
        {
            ICollection<OAuthAccount> accounts = OAuthWebSecurity.GetAccountsFromUserName(User.Identity.Name);
            List<ExternalLogin> externalLogins = new List<ExternalLogin>();
            foreach (OAuthAccount account in accounts)
            {
                AuthenticationClientData clientData = OAuthWebSecurity.GetOAuthClientData(account.Provider);

                externalLogins.Add(new ExternalLogin
                {
                    Provider = account.Provider,
                    ProviderDisplayName = clientData.DisplayName,
                    ProviderUserId = account.ProviderUserId,
                });
            }

            ViewBag.ShowRemoveButton = externalLogins.Count > 1 || OAuthWebSecurity.HasLocalAccount(WebSecurity.GetUserId(User.Identity.Name));
            return PartialView("_RemoveExternalLoginsPartial", externalLogins);
        }

        #region MVC3 legacy

        [AllowAnonymous]
        public ActionResult PasswordRecovery()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [AllowAnonymous]
        public ActionResult PasswordRecovery(AcceptPortal.Models.RecoverPasswordModel model)
        {                       
            if (ModelState.IsValid)
            {
                if (CustomAdminMembershipProvider.RecoverPassword(model.UserName))
                {
                    TempData.Add("LoginMessage", @AcceptPortal.Resources.Global.PasswordRecoveredMessage + " " + @AcceptPortal.Resources.Global.SpamFilterNote);
                    ViewBag.EmailSent = @AcceptPortal.Resources.Global.LoginSuccessMessage + " " + @AcceptPortal.Resources.Global.SpamFilterNote;
                    return View(model);                   
                }
                else
                {
                    ModelState.AddModelError("PasswordRecovery", "Password recovery failed.");                
                }                            
            }
            
            return View(model);
        }

        [HttpGet]
        [AllowAnonymous]
        public ActionResult PasswordRecoveryConfirmation(string code)
        {
            if (StringUtils.Validate32CharactersGuid(code))
            {
                string userName = CustomAdminMembershipProvider.ValidateRegistrationCode(code);
                if (userName.Length > 0)
                {
                    TempData.Add("UserName", userName);
                    return RedirectToAction("ChangePassword");
                }
                else
                    throw new Exception("Password confirmation failed.");             
            }
            else
            {              
                throw new Exception("Password confirmation failed.");
            }
        }

        [AllowAnonymous]
        public ActionResult ChangePassword()
        {
            var model = new ForgottenPasswordModel();           
            if (TempData.ContainsKey("UserName"))            
                model.UserName = (string)TempData["UserName"];            
            
            return View(model);
        }

        [HttpPost]
        [AllowAnonymous]
        public ActionResult ChangePassword(AcceptPortal.Models.ForgottenPasswordModel model)
        {
           if (ModelState.IsValid)
            {
                //changePassword will throw an exception rather
                //than return false in certain failure scenarios.
                bool changePasswordSucceeded;
                try
                {                
                    changePasswordSucceeded = CustomAdminMembershipProvider.ChangeUserPassword(model.UserName, model.Password);
                }
                catch (Exception)
                {
                    changePasswordSucceeded = false;
                }

                if (changePasswordSucceeded)
                {
                    TempData.Add("UserName", model.UserName);
                    TempData.Add("LoginMessage", @AcceptPortal.Resources.Global.LoginShortSucessMessage);
                    return RedirectToAction("Login");
                }
                else
                {
                    TempData.Add("LoginMessage", @AcceptPortal.Resources.Global.LoginShortNotSucessMessage);
                    return RedirectToAction("Login");
                }
            }
             
             //if we got this far, something failed, redisplay form.
             return View(model);
         }

        [HttpGet]
        [AllowAnonymous]
        public ActionResult Confirmation(string code)
         {
             if (StringUtils.Validate32CharactersGuid(code))
             {
                 string userName = CustomAdminMembershipProvider.ValidateRegistrationCode(code);
                 if (userName.Length > 0)
                 {
                     TempData.Add("LoginMessage", @AcceptPortal.Resources.Global.PasswordRecoveredEnterCredsMessage);
                     TempData.Add("UserName", userName);
                 }
                 else                 
                     //this message is bad, if the user already did the confirmation this message makes no sense.
                     TempData.Add("LoginMessage", @AcceptPortal.Resources.Global.PasswordRecoveredFailedMessage);                 
             }

             return RedirectToAction("Login");
         }

        #endregion

        #region help methods

        private ActionResult RedirectToLocal(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl))
                return Redirect(returnUrl);
            else
                return RedirectToAction("About", "Home");
        }

        public enum ManageMessageId
        {
            ChangePasswordSuccess,
            SetPasswordSuccess,
            RemoveLoginSuccess,
        }

        internal class ExternalLoginResult : ActionResult
        {
            public ExternalLoginResult(string provider, string returnUrl)
            {
                Provider = provider;
                ReturnUrl = returnUrl;
            }

            public string Provider { get; private set; }
            public string ReturnUrl { get; private set; }

            public override void ExecuteResult(ControllerContext context)
            {
                OAuthWebSecurity.RequestAuthentication(Provider, ReturnUrl);
            }
        }

        private static string ErrorCodeToString(MembershipCreateStatus createStatus)
        {
            // See http://go.microsoft.com/fwlink/?LinkID=177550 for
            // a full list of status codes.
            switch (createStatus)
            {
                case MembershipCreateStatus.DuplicateUserName:
                    return "User name already exists. Please enter a different user name.";

                case MembershipCreateStatus.DuplicateEmail:
                    return "A user name for that e-mail address already exists. Please enter a different e-mail address.";

                case MembershipCreateStatus.InvalidPassword:
                    return "The password provided is invalid. Please enter a valid password value.";

                case MembershipCreateStatus.InvalidEmail:
                    return "The e-mail address provided is invalid. Please check the value and try again.";

                case MembershipCreateStatus.InvalidAnswer:
                    return "The password retrieval answer provided is invalid. Please check the value and try again.";

                case MembershipCreateStatus.InvalidQuestion:
                    return "The password retrieval question provided is invalid. Please check the value and try again.";

                case MembershipCreateStatus.InvalidUserName:
                    return "The user name provided is invalid. Please check the value and try again.";

                case MembershipCreateStatus.ProviderError:
                    return "The authentication provider returned an error. Please verify your entry and try again. If the problem persists, please contact your system administrator.";

                case MembershipCreateStatus.UserRejected:
                    return "The user creation request has been canceled. Please verify your entry and try again. If the problem persists, please contact your system administrator.";

                default:
                    return "An unknown error occurred. Please verify your entry and try again. If the problem persists, please contact your system administrator.";
            }
        }
        
        #endregion
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AcceptPortal.Filters;
using AcceptPortal.Models.Admin;
using System.IO;
using AcceptPortal.Resources;
using AcceptPortal.Utils;
using AcceptPortal.Models.PosEdit;
using AcceptPortal.ViewModels;
using AcceptPortal.Models.Evaluation;
using System.Text.RegularExpressions;
using System.Web.Routing;
using AcceptPortal.Models.Audit;
using AcceptPortal.Remote.PostEdit;
using AcceptPortal.Remote.Miscellaneous;

namespace AcceptPortal.Controllers.PosEdit
{
 
    [AcceptRequireHttps]  
    [Localization]  
    public class PostEditController : Controller
    {

        // GET: /PostEdit/
        [AuditFilter(AuditAction = AuditFilter.READ, AuditType = AuditFilter.TYPEDEFAULT, AuditDescription = AuditFilter.AUDIT_DEFAULT_DESCRIPTION)]
        [Authorize]       
        public ActionResult Index()
        {
            List<Project> projects = PostEditRemoteMethods.GetProjectsByUser(User.Identity.Name);
          
            if (TempData.ContainsKey("ProjectUpdateMessage"))
            {
                ViewBag.ProjectUpdateMessage = TempData["ProjectUpdateMessage"];
                ViewBag.ProjectName = TempData["ProjectName"];
            }

            TempData.Remove("ProjectUpdateMessage");
            TempData.Remove("ProjectName");

            foreach (Project p in projects)
                p.UserRoleInProject = PostEditRemoteMethods.GetUserRolePostEditProject(User.Identity.Name, p.ID);

            return View(projects);
        }
       
        // GET: /PostEdit/
        [AuditFilter(AuditAction = AuditFilter.READ, AuditType = AuditFilter.TYPEDEFAULT, AuditDescription = AuditFilter.AUDIT_DEFAULT_DESCRIPTION)]
        [Authorize]
        public ActionResult DemoProjects()
        {
            List<Project> projects = PostEditRemoteMethods.GetDemoProjects();                      
            foreach (Project p in projects)
                p.UserRoleInProject = PostEditRemoteMethods.GetUserRolePostEditProject(User.Identity.Name, p.ID);

            return View(projects);
        }

        [Authorize]
        public ActionResult CreateProject()
        {
            ProjectVM projectVm = new ProjectVM();         

            #region hardcoded language ID's
            //both source and target language ID's are hardcoded(bad conduct but no time (yet) available to change this...). 
            //if you plan to support more languages, advise you to create a method on the API side and get them.
            projectVm.SourceLanguageList.Add(new EvaluationLanguage(1, Global.English));
            projectVm.SourceLanguageList.Add(new EvaluationLanguage(2, Global.French));
            projectVm.SourceLanguageList.Add(new EvaluationLanguage(3, Global.German));
            projectVm.SourceLanguageList.Add(new EvaluationLanguage(6, Global.OtherLanguage));
            projectVm.TargetLanguageList.Add(new EvaluationLanguage(1, Global.English));
            projectVm.TargetLanguageList.Add(new EvaluationLanguage(2, Global.French));
            projectVm.TargetLanguageList.Add(new EvaluationLanguage(3, Global.German));
            projectVm.TargetLanguageList.Add(new EvaluationLanguage(6, Global.OtherLanguage));
            #endregion

            #region domain ID
            //the domain is somehow obsolete(the concept was about better grouping of pre-edit client instances and post-edit projects), it should be removed from the framework, however is hardcoded ID is a bad conduct too.            
            projectVm.DomainsList = MiscellaneousRemoteMethods.GetAllDomains();    
            #endregion

            //the defaults interpreted the client are: "1" for bilingual and "2" for monolingual.
            projectVm.ConfigurationList.Add(new ProjectUICongfiguration(1, Global.BiLingualLabel));
            projectVm.ConfigurationList.Add(new ProjectUICongfiguration(2, Global.MonoLingualLabel));

            //the defaults interpreted the client are: "1" for bilingual and "2" for monolingual.
            projectVm.UseTranslationOptions.Add(new ShowTranslationOptions(1, Global.LabelDisplayTranslationOptions));
            projectVm.UseTranslationOptions.Add(new ShowTranslationOptions(2, Global.DoNotDisplayTranslationOptions));

            //the defaults interpreted the client are: "1" for when user can switch to display source and "0" for when the source cannot be displayed.
            projectVm.CustomInterfaceConfigurationOptions.Add(new CustomInterfaceConfigurationOption(0, Global.NotAllowCustomUIValue));
            projectVm.CustomInterfaceConfigurationOptions.Add(new CustomInterfaceConfigurationOption(1, Global.AllowCustomUIValue));

            //the defaults interpreted the client are: "1" for paraphrasing enabled and "0" for paraphrasing disabled.
            projectVm.ParaphrasingModeOptions.Add(new ParaphrasingModeOption(0, Global.ParaphrasingDisabledLabel));
            projectVm.ParaphrasingModeOptions.Add(new ParaphrasingModeOption(1, Global.ParaphrasingEnabledLabel));

            //the defaults interpreted the client are: "1" for interactive check enabled and "0" for interactive check disabled.
            projectVm.InteractiveCheckOptions.Add(new InteractiveCheckOption(0, Global.InteractiveCheckDisabledLabel));
            projectVm.InteractiveCheckOptions.Add(new InteractiveCheckOption(1, Global.InteractiveCheckEnabledLabel));

            //getting the defaults for paraphrasing and interactive check: paraphrasing engine name, default rule-set per language, etc.
            projectVm.PostEditDefaults = PostEditRemoteMethods.GetParaprasingDefaults("all");
       
            //the paraphrasing metadata is the name for the engine used.
            projectVm.Project.ParaphrasingMetadata = projectVm.PostEditDefaults.SystemIdEnglish;

            #region interactive checks and paraphrasing endpoints defaults
            
            //default rule-sets.
            string[] rulesets = projectVm.PostEditDefaults.InteractiveChecksDefaultRuleSet.Split(',');
            ViewBag.EnglishRuleSet = rulesets[0];
            projectVm.Project.InteractiveCheckMetadata = rulesets[0];
            try
            {                
                ViewBag.FrenchRuleSet = rulesets[1];
                ViewBag.GermanRuleSet = rulesets[2];
            }
            catch {
                ViewBag.FrenchRuleSet = "";
                ViewBag.GermanRuleSet = "";
            }
            #endregion

            return View(projectVm);
        }

        // POST: /Project/Create
        [Authorize]
        [HttpPost]
        [AuditFilter(AuditAction = AuditFilter.CREATE, AuditType = AuditFilter.TYPEDEFAULT, AuditDescription = AuditDescriptor.POSTEDIT_PROJECT_CREATED)]
        public ActionResult CreateProject(FormCollection collection)
        {
            try
            {                
                string domainId = collection["Project.ProjectDomain"];
                string projectName = collection["Project.ProjectName"];
                string[] projectOptions = collection["AllOptions"].Split(new string[] { "_$#$_" }, StringSplitOptions.RemoveEmptyEntries);                
                string sourceLanguageId = collection["Project.SourceLangId"];
                string targetLanguageId = collection["Project.TargetLangId"];
                string uiConfigurationId = collection["Project.InterfaceConfigurationId"];
                string projectAdmin = User.Identity.Name;
                string survey = collection["Project.ProjectSurvey"];
                string emailBody = collection["Project.EmailInvitationBodyText"];
                string showTransOptions = collection["Project.DisplayTranslationOptions"];
                string projectOrganization = collection["Project.Organization"];
                string question = collection["Project.ProjQuestion"];
                
                string[] projectQuestions;
                projectQuestions = question.Length > 0 ? projectQuestions = new string[] { question } : new string[] { };
                
                string customUiConfiguration = collection["Project.CustomInterfaceConfiguration"];
                bool isProjectExternal = bool.Parse(collection["Project.External"].Replace("true,false", "true").Replace("False,false", "false"));
                bool isSingleRevision = bool.Parse(collection["Project.SingleRevision"].Replace("true,false", "true").Replace("False,false", "false"));                                
                
                TimeSpan maxLockingSpan; maxLockingSpan = new TimeSpan();
                if (collection["Project.MaxThreshold"] != null)
                    maxLockingSpan = TimeSpan.Parse(collection["Project.MaxThreshold"]);

                string paraphrasingMode; paraphrasingMode = collection["Project.ParaphrasingMode"] != null ? paraphrasingMode = collection["Project.ParaphrasingMode"] : paraphrasingMode = "0";
                string interactiveCheck; interactiveCheck = collection["Project.InteractiveCheck"] != null ? interactiveCheck = collection["Project.InteractiveCheck"] : interactiveCheck = "0";
                string interactiveCheckMetadata; interactiveCheckMetadata = collection["Project.InteractiveCheckMetadata"] != null ? collection["Project.InteractiveCheckMetadata"] : string.Empty;                                
                string paraphrasingMetadata;paraphrasingMetadata = collection["Project.ParaphrasingMetadata"] != null ? collection["Project.ParaphrasingMetadata"] : string.Empty;

                Project p = PostEditRemoteMethods.CreateProject(PostEditRemoteMethods.getProjectJson(-1, projectName, domainId, "1", projectAdmin,
                projectQuestions, projectOptions, sourceLanguageId, targetLanguageId, uiConfigurationId,
                int.Parse(showTransOptions), emailBody, survey, projectOrganization,
                int.Parse(customUiConfiguration), isProjectExternal, isSingleRevision,
                maxLockingSpan.ToString(), int.Parse(paraphrasingMode), int.Parse(interactiveCheck), interactiveCheckMetadata, paraphrasingMetadata));                
                
                return RedirectToAction("Index");               
            }
            catch
            {
                return View();
            }
        }

        [Authorize]
        [AuditFilter(AuditAction = AuditFilter.READ, AuditType = AuditFilter.TYPEDEFAULT, AuditDescription = AuditFilter.AUDIT_DEFAULT_DESCRIPTION)]
        public ActionResult ProjectDetail(int Id)
        {

            ViewBag.ShowMessage = false;
            Project project; project = PostEditRemoteMethods.GetProjectWithValidDocuments(Id, User.Identity.Name);
            
            if (project == null)            
                return RedirectToAction("Index", "PostEdit");
            
            project.UserRoleInProject = PostEditRemoteMethods.GetUserRolePostEditProject(User.Identity.Name, project.ID);

            if (project.Status == -1)
            {
                project = new Project();
                project.Status = -1;
                project.ProjectOwner = string.Empty;
                project.Documents = new List<Document>();
            }

            if (TempData.ContainsKey("UploadFail"))
            {                
                ViewBag.MessageTaskUploadFail = TempData["MessageUploadFail"];
                TempData.Remove("MessageUploadFail");
                TempData.Remove("UploadFail");
            }

            ViewBag.AcceptApiUrl = CoreUtils.AcceptPortalApiPath;
        

            return View(project);
        }

        [Authorize]
        [HttpGet]
        public ActionResult AllProjectUsers(string token)
        {
            List<string> allUsersInProject = PostEditRemoteMethods.ProjectInfo(token);                       
            SelectList list = new SelectList(allUsersInProject);   
            @ViewBag.AllUsers = allUsersInProject;
            return PartialView("AllProjectUsersPartial", list);
        }

        [Authorize]
        [AuditFilter(AuditAction = AuditFilter.DELETE, AuditType = AuditFilter.TYPEDEFAULT, AuditDescription = AuditDescriptor.POSTEDIT_PROJECT_DELETED)]
        public ActionResult DeleteProject(int Id)
        {
            bool deleted = PostEditRemoteMethods.DeletePostEditProject(Id);
            return RedirectToAction("Index");
        }
     
        [Authorize]
        [HttpPost]
        public ActionResult UploadFile(HttpPostedFileBase file, string projectId)
        {
            try
            {
                if (file != null && file.ContentLength > 0)
                {                   
                    byte[] data;
                    using (Stream inputStream = file.InputStream)
                    {
                        MemoryStream memoryStream = inputStream as MemoryStream;
                        if (memoryStream == null)
                        {
                            memoryStream = new MemoryStream();
                            inputStream.CopyTo(memoryStream);
                        }
                        data = memoryStream.ToArray();
                    }

                    string myJsonString = System.Text.Encoding.UTF8.GetString(data);                   
                    string errorMessage = string.Empty;
                    bool added = PostEditRemoteMethods.AddDocumentToProjectRaw(int.Parse(projectId), myJsonString, out errorMessage);

                    if (!added)
                    {
                        TempData.Add("UploadFail", true);
                        TempData.Add("MessageUploadFail", errorMessage);
                    }

                }

                return RedirectToAction("ProjectDetail", new { @Id = projectId });               
            }
            catch
            {
                return RedirectToAction("ProjectDetail", new { @Id = projectId });
            }
        }

        [Authorize]
        [HttpPost]
        public JsonResult InviteUsers(string usersList, string projectInvitatedId, string projectOwner)
        {   
            //note the user role is hardcoded with the value "Guest", that's the basic starting role for a new post editor.
            return Json(PostEditRemoteMethods.InviteUsersToProject(usersList.Split(new string[] { ";" }, StringSplitOptions.RemoveEmptyEntries), projectOwner, projectInvitatedId, "Guest"));
        }

        [Authorize]
        [HttpGet]
        public ActionResult DeleteDocument(string textId, string projectOwner, int projectId)
        {
            PostEditRemoteMethods.DeleteDocument(textId, projectOwner);
            return RedirectToAction("ProjectDetail", new { @Id = projectId });
        }

        [AllowAnonymous]
        [HttpGet]
        public ActionResult Invitation(string code)
        {

            if (StringUtils.Validate32CharactersGuid(code))
            {
                Invitation invitation = PostEditRemoteMethods.GetInvitationByCode(code);
                TempData.Remove("ProjectIdInvitation");
                TempData.Remove("ProjectIdInvitationUserName");
                if (invitation != null)
                {
                    if (invitation.InvitationType == 2)
                    {
                        #region redirection cookie
                        HttpCookie myCookie = new HttpCookie("AceeptRedirection");
                        myCookie["UserId"] = invitation.UserName.ToString();
                        myCookie["ProjectId"] = invitation.ProjectId.ToString();
                        myCookie.Expires = DateTime.Now.AddDays(30);
                        System.Web.HttpContext.Current.Response.Cookies.Add(myCookie);                     
                        #endregion
                        PostEditRemoteMethods.UpdateProjectInviteConfirmationDateByCode(code);
                        TempData.Add("ProjectIdInvitationUserName", invitation.UserName);
                        return RedirectToAction("Register", "Account");
                    }
                    else
                    {
                        if (invitation.InvitationType == 1)
                        {
                            if (User.Identity.IsAuthenticated)
                            {
                                PostEditRemoteMethods.UpdateProjectInviteConfirmationDateByCode(code);                               
                                TempData.Add("ProjectIdInvitation", invitation.ProjectId);
                                TempData.Add("ProjectIdInvitationUserName", invitation.UserName);                                                              
                                return RedirectToAction("ProjectDetail", new RouteValueDictionary(new { controller = "PostEdit", action = "ProjectDetail", Id = invitation.ProjectId }));
                            }
                            else
                            {
                                PostEditRemoteMethods.UpdateProjectInviteConfirmationDateByCode(code);                             
                                TempData.Add("ProjectIdInvitation", invitation.ProjectId);
                                TempData.Add("ProjectIdInvitationUserName", invitation.UserName);
                                return RedirectToAction("Login", "Account");
                            }
                        }
                        else
                        {
                            if (User.Identity.IsAuthenticated)                            
                                return RedirectToAction("Index", "PostEdit");
                            else                         
                                return RedirectToAction("Login", "Account");                            
                        }
                    }
                }
                else
                {
                    return RedirectToAction("Login", "Account");
                }           
            }

            //last return to login.
            return RedirectToAction("Login", "Account");
        }

        [Authorize]
        [HttpGet]
        public ActionResult EditProject(int ID)
        {
            ProjectVM projectVm = new ProjectVM();
            projectVm.Project = PostEditRemoteMethods.GetProject(ID);
            projectVm.IsProjectStarted = PostEditRemoteMethods.IsProjectStarted(ID);

            #region hardcoded language ID's
            //both source and target language ID's are hardcoded(bad conduct but enough time (yet) available to change this...). 
            //if you plan to support more languages, advise you to create a method on the API side and get them.
            switch (projectVm.Project.SourceLanguageName)
            {
                case "English": { projectVm.SourceLanguageList.Add(new EvaluationLanguage(1, Global.English)); } break;
                case "French": { projectVm.SourceLanguageList.Add(new EvaluationLanguage(2, Global.French)); } break;
                case "German": { projectVm.SourceLanguageList.Add(new EvaluationLanguage(3, Global.German)); } break;
                case "Other": { projectVm.SourceLanguageList.Add(new EvaluationLanguage(6, Global.OtherLanguage)); } break;
            }
            switch (projectVm.Project.TargetLanguageName)
            {
                case "English": { projectVm.TargetLanguageList.Add(new EvaluationLanguage(1, Global.English)); } break;
                case "French": { projectVm.TargetLanguageList.Add(new EvaluationLanguage(2, Global.French)); } break;
                case "German": { projectVm.TargetLanguageList.Add(new EvaluationLanguage(3, Global.German)); } break;
                case "Other": { projectVm.TargetLanguageList.Add(new EvaluationLanguage(6, Global.OtherLanguage)); } break;
            }
            #endregion

            #region domain ID
            //the domain is somehow obsolete, it should be removed from the framework, however is hardcoded ID is a bad conduct too.            
            List<Domain> domains = MiscellaneousRemoteMethods.GetAllDomains();
            if (domains.Where(r => r.ID == projectVm.Project.DomainID).Count() > 0)
            {
                projectVm.DomainsList.Add(domains.Where(r => r.ID == projectVm.Project.DomainID).First());
            }
            #endregion

            if (projectVm.IsProjectStarted)
            {
                switch (projectVm.Project.DisplayTranslationOptions.ID)
                {                    
                    case 2: { projectVm.UseTranslationOptions.Add(new ShowTranslationOptions(2, Global.DoNotDisplayTranslationOptions)); } break;
                    default: { projectVm.UseTranslationOptions.Add(new ShowTranslationOptions(1, Global.LabelDisplayTranslationOptions)); } break;
                }

                switch (projectVm.Project.InterfaceConfigurationId)
                {
                    case 2: { projectVm.ConfigurationList.Add(new ProjectUICongfiguration(2, Global.MonoLingualLabel)); } break;
                    default: { projectVm.ConfigurationList.Add(new ProjectUICongfiguration(1, Global.BiLingualLabel)); } break;
                }
            }
            else
            {
                projectVm.ConfigurationList.Add(new ProjectUICongfiguration(1, Global.BiLingualLabel));
                projectVm.ConfigurationList.Add(new ProjectUICongfiguration(2, Global.MonoLingualLabel));
                projectVm.UseTranslationOptions.Add(new ShowTranslationOptions(1, Global.LabelDisplayTranslationOptions));
                projectVm.UseTranslationOptions.Add(new ShowTranslationOptions(2, Global.DoNotDisplayTranslationOptions));
            }

            projectVm.CustomInterfaceConfigurationOptions.Add(new CustomInterfaceConfigurationOption(0, Global.NotAllowCustomUIValue));
            projectVm.CustomInterfaceConfigurationOptions.Add(new CustomInterfaceConfigurationOption(1, Global.AllowCustomUIValue));
            projectVm.ParaphrasingModeOptions.Add(new ParaphrasingModeOption(0, Global.ParaphrasingDisabledLabel));
            projectVm.ParaphrasingModeOptions.Add(new ParaphrasingModeOption(1, Global.ParaphrasingEnabledLabel));
            projectVm.InteractiveCheckOptions.Add(new InteractiveCheckOption(0, Global.InteractiveCheckDisabledLabel));
            projectVm.InteractiveCheckOptions.Add(new InteractiveCheckOption(1, Global.InteractiveCheckEnabledLabel));

            projectVm.PostEditDefaults = PostEditRemoteMethods.GetParaprasingDefaults("all");
            return View(projectVm);
        }

        [Authorize]
        [HttpPost]
        [AuditFilter(AuditAction = AuditFilter.UPDATE, AuditType = AuditFilter.TYPEDEFAULT, AuditDescription = AuditDescriptor.POSTEDIT_PROJECT_UPDATED)]
        public ActionResult EditProject(int id, FormCollection collection)
        {
            try
            {
                string domainId = collection["Project.ProjectDomain"];
                string projectName = collection["Project.ProjectName"];
                string[] projectOptions = collection["AllOptions"].Split(new string[] { "_$#$_" }, StringSplitOptions.RemoveEmptyEntries);
                string sourceLanguageId = collection["Project.SourceLangId"];
                string targetLanguageId = collection["Project.TargetLangId"];
                string uiConfigurationId = collection["Project.InterfaceConfigurationId"];
                string projectAdmin = User.Identity.Name;
                string survey = collection["Project.ProjectSurvey"];
                string emailBody = collection["Project.EmailInvitationBodyText"];
                string showTransOptions = collection["Project.DisplayTranslationOptions"];
                string projectOrganization = collection["Project.Organization"];
                string question = collection["Project.ProjQuestion"];
                string[] projectQuestions;
                projectQuestions = question.Length > 0 ? projectQuestions = new string[] { question } : new string[] { };
                string customUiConfiguration = collection["Project.CustomInterfaceConfiguration"];
                string isExternal = collection["Project.External"].ToString().Replace("true,false", "true").Replace("True,false", "true").Replace("False,false","false");
                bool isProjectExternal = bool.Parse(isExternal);
                string message = string.Empty;
                string isSingle = collection["Project.SingleRevision"].Replace("true,false", "true").Replace("True,false", "true").Replace("False,false", "false"); 
                bool isSingleRevision = bool.Parse(isSingle);                
                TimeSpan maxLockingSpan;
                maxLockingSpan = collection.GetValue("Project.MaxThreshold") != null ? TimeSpan.Parse(collection["Project.MaxThreshold"]) : new TimeSpan(0);                            
                string paraphrasingMode = collection["Project.ParaphrasingMode"];
                string interactiveCheck = collection["Project.InteractiveCheck"];
                string interactiveCheckMetadata = collection["Project.InteractiveCheckMetadata"];
                string paraphrasingMetadata = collection["Project.ParaphrasingMetadata"];

                PostEditRemoteMethods.UpdateProject(PostEditRemoteMethods.getProjectJson(id, projectName, domainId, "1", projectAdmin, projectQuestions,
                    projectOptions, sourceLanguageId, targetLanguageId, uiConfigurationId, int.Parse(showTransOptions), emailBody, survey,
                    projectOrganization, int.Parse(customUiConfiguration), isProjectExternal, isSingleRevision,
                    maxLockingSpan.ToString(), int.Parse(paraphrasingMode), int.Parse(interactiveCheck), interactiveCheckMetadata, paraphrasingMetadata), out message);

                if (message.Length > 0)
                {
                    TempData.Add("ProjectUpdateMessage", message);
                    TempData.Add("ProjectName", projectName);
                }

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        [Authorize]
        public ActionResult GetTaskStatus(string token)
        {
            TaskStatusVM allTaskStatus = PostEditRemoteMethods.GetProjectTasksStatus(token);

            allTaskStatus.Users = (from w in allTaskStatus.UserTaskStatus
                                   select w.UserId).Distinct().ToList();

            allTaskStatus.Tasks = (from w in allTaskStatus.UserTaskStatus
                                   select w.TextId).Distinct().ToList();

            return PartialView("GetTaskStatusPartial", allTaskStatus);
        }
   
    }
}

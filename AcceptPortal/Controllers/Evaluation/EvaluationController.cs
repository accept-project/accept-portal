using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Configuration;
using System.Web.Mvc;
using AcceptPortal.Models.Admin;
using System.IO;
using AcceptPortal.Models.Evaluation;
using AcceptPortal.Utils;
using AcceptPortal.Models.PosEdit;
using AcceptPortal.Filters;
using ICSharpCode.SharpZipLib.Zip;
using AcceptPortal.Models.Audit;
using AcceptPortal.Remote.Evaluation;
using AcceptPortal.Remote.Miscellaneous;
using AcceptPortal.ViewModels;
using System.Xml.Linq;
using AcceptPortal.Remote.PostEdit;
using System.Web.Routing;
using AcceptPortal.Resources;

namespace AcceptPortal.Controllers.Evaluation
{
    [AcceptRequireHttps]
    [Localization]
    [Authorize]
    public class EvaluationController : Controller
    {
        //
        // GET: /PostEdit/
        [AuditFilter(AuditAction = AuditFilter.READ, AuditType = AuditFilter.TYPEDEFAULT, AuditDescription = AuditFilter.AUDIT_DEFAULT_DESCRIPTION)]
        public ActionResult Index()
        {
            string username = User.Identity.Name;
            List<EvaluationProject> projects = EvaluationRemoteMethods.GetEvaluationProjectsByUser(username);
            return View(projects);
        }

        [HttpGet]
        public ActionResult Create()
        {
            List<Project> projects = PostEditRemoteMethods.GetProjectsByUser(User.Identity.Name);
            List<SelectListItem> projectsList = new List<SelectListItem>();
            List<SelectListItem> projectsTypesList = new List<SelectListItem>();

            List<SelectListItem> evaluationMethods = new List<SelectListItem>();
            List<SelectListItem> duplicationApproachOptions = new List<SelectListItem>();


            projectsList.Add(new SelectListItem() { Text = Global.EvaluationProjectSelectLabel, Value = "-1" });

            foreach (Project p in projects)
            {
                if (p.ProjectOwner == User.Identity.Name)
                    projectsList.Add(new SelectListItem() { Text = p.ProjectName, Value = p.ID.ToString() });
            }

            projectsTypesList.Add(new SelectListItem() { Text = Global.EvaluationProjectExternalProjectLabel, Value = "2" });
            projectsTypesList.Add(new SelectListItem() { Text = Global.EvaluationProjectInternalLabel, Value = "1" });

            evaluationMethods.Add(new SelectListItem() { Text = Global.NotSet, Value = "0" });
            evaluationMethods.Add(new SelectListItem() { Text = Global.EvaluateOriginalLabel, Value = "1" });
            evaluationMethods.Add(new SelectListItem() { Text = Global.EvaluateOriginalAndAllRevisionsLabel, Value = "2" });
            evaluationMethods.Add(new SelectListItem() { Text = Global.EvaluateAllRevisionsOnlyLabel, Value = "3" });

            duplicationApproachOptions.Add(new SelectListItem() { Text = Global.NotSet, Value = "0" });
            duplicationApproachOptions.Add(new SelectListItem() { Text = Global.AvoidDuplicationTaskLevel, Value = "1" });
            duplicationApproachOptions.Add(new SelectListItem() { Text = Global.AvoidDuplicationProjectLevel, Value = "2" });

            @ViewBag.PostEditProjects = projectsList;
            @ViewBag.EvaluationProjectType = projectsTypesList;
            @ViewBag.EvaluationMethods = evaluationMethods;
            @ViewBag.DuplicationApproachOptions = duplicationApproachOptions;

            return View();
        }

        /// <summary>
        /// Create a New Evaluation Project
        /// </summary>
        /// <param name="collection">Collection of Form items</param>
        /// <returns></returns>
        [HttpPost]
        [AuditFilter(AuditAction = AuditFilter.CREATE, AuditType = AuditFilter.TYPEDEFAULT, AuditDescription = AuditDescriptor.EVALUATION_PROJECT_CREATED)]
        public ActionResult Create(FormCollection collection)
        {
            try
            {
                string evalProjectName = collection["Name"];
                string evalOrganization = collection["Organization"];
                string evalDescription = collection["Description"];
                string evalDomain = collection["Domain"];
                string username = User.Identity.Name;

                string evalProjectType = collection["EvaluationType"];
                string evalPostEditProjectId = collection["PostEditProjectId"] != null ? evalPostEditProjectId = collection["PostEditProjectId"] : evalPostEditProjectId = "-1";
                string evalMethod = collection["EvaluationMethod"] != null ? evalMethod = collection["EvaluationMethod"] : evalMethod = "0";
                string includeOwnerRev = collection["IncludeOwnerRevision"].Replace("true,false", "true").Replace("False,false", "false");
                string duplicationLogic = collection["DuplicationLogic"] != null ? duplicationLogic = collection["DuplicationLogic"] : duplicationLogic = "0";
                string emailBody = collection["CustomEmailBody"] != null ? emailBody = collection["CustomEmailBody"] : emailBody = string.Empty;

                EvaluationProject p = EvaluationRemoteMethods.CreateEvaluationProject(evalProjectName, evalDescription,
                    evalOrganization, evalDomain, username, evalProjectType, evalPostEditProjectId
                    , evalMethod, duplicationLogic, includeOwnerRev, emailBody);

                if (p != null && p.ID > 0)
                    return RedirectToAction("Questions", new { @Id = p.ID });
                else
                    return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        public ActionResult Demo()
        {
            ViewBag.EvaluationDemoQuestionUrl = CoreUtils.EvaluationDemoQuestionUrl;
            ViewBag.EvaluationDemoScoresUrl = CoreUtils.EvaluationDemoScoresUrl;
            ViewBag.EvaluationDemoApiKey = CoreUtils.EvaluationDemoApiKey;
            return View();
        }

        public ActionResult DemoMetrics()
        {
            var questions = EvaluationRemoteMethods.GetAllQuestions(3);
            var demoQuestion = new EvaluationQuestionItem();

            foreach (var item in questions)
            {
                foreach (var q in item.LanguageQuestions)
                {
                    if (q.ID == 5)
                    {
                        demoQuestion = q;
                    }
                }

            }

            return View(demoQuestion);
        }

        public ActionResult Project(int id)
        {
            EvaluationProject project = EvaluationRemoteMethods.GetEvaluationProject(id);
            return View(project);
        }

        [HttpPost]
        public ActionResult Project(int id, FormCollection collection)
        {
            return RedirectToAction("Edit", new { id = id });
        }

        public ActionResult AddData(int id)
        {
            ViewData["Documents"] = null;

            var documents = EvaluationRemoteMethods.GetEvaluationDocuments(id);
            ViewData["Documents"] = documents;

            EvaluationProject project = EvaluationRemoteMethods.GetEvaluationProject(id);
            return View(project);
        }

        public ActionResult AddDataFile(int id, int provider, int langpair)
        {
            ViewData["Documents"] = null;

            EvaluationProject project = EvaluationRemoteMethods.GetEvaluationProject(id);

            foreach (var p in project.Providers)
            {
                if (p.ID == provider)
                {
                    ViewData["providerid"] = p.ID;
                    ViewData["provider"] = p.Name;
                }
            }


            foreach (var l in project.LanguagePairs)
            {
                if (l.ID == langpair)
                {
                    ViewData["langpairid"] = l.ID;
                    ViewData["langpair"] = l.Name;
                }
            }

            return View(project);
        }

        [HttpPost]
        public ActionResult AddDataFile(int id, HttpPostedFileBase file, FormCollection collection)
        {
            bool bError = false;
            string errorMessage = string.Empty;

            int providerId = Convert.ToInt32(collection["providerid"]);
            int langpairId = Convert.ToInt32(collection["langpairid"]);

            if (file == null)
                return RedirectToAction("AddData", new { id = id });

            string originalFileName = Path.GetFileNameWithoutExtension(file.FileName);
            string filePath = originalFileName + "_" + Guid.NewGuid().ToString("N") + ".zip";
            string docsUploadPath = Server.MapPath("~/App_Data/uploads");

            if (docsUploadPath.StartsWith("~"))
            {
                docsUploadPath = Server.MapPath(docsUploadPath);
            }
            if (!Directory.Exists(docsUploadPath))
            {
                Directory.CreateDirectory(docsUploadPath);
            }

            filePath = Path.Combine(docsUploadPath, filePath);
            file.SaveAs(filePath);

            string tagerFolder = Path.Combine(docsUploadPath, Path.GetFileNameWithoutExtension(filePath));
            try
            {
                FastZip zip = new FastZip();
                zip.ExtractZip(filePath, tagerFolder, "\\.*$");
            }
            catch
            {
                bError = true;
                errorMessage = "Unable to extract ZIP archive";
            }

            string[] importFiles = new string[0];

            if (!bError)
            {
                if (Directory.Exists(tagerFolder))
                {
                    importFiles = Directory.GetFiles(tagerFolder);
                    if (importFiles.Length == 0)
                    {
                        bError = true;
                        errorMessage = "Upload archive was empty";
                    }
                }
                else
                {
                    bError = true;
                    errorMessage = "Upload archive was empty";
                }
            }

            if (!bError)
            {
                foreach (string item in importFiles)
                {
                    try
                    {
                        string filestr = System.IO.File.ReadAllText(item);

                        bool success = EvaluationRemoteMethods.UploadEvaluationFile(id, providerId, langpairId, filestr);
                    }
                    catch (Exception ex)
                    {
                        string docName = Path.GetFileNameWithoutExtension(item);
                        bError = true;
                        errorMessage = "Error uploading file: " + docName;
                    }
                }
            }
            if (!bError)
            {
                return RedirectToAction("AddData", new { id = id });
            }


            EvaluationProject project = EvaluationRemoteMethods.GetEvaluationProject(id);

            foreach (var p in project.Providers)
            {
                if (p.ID == providerId)
                {
                    ViewData["provider"] = p.Name;
                }
            }


            foreach (var l in project.LanguagePairs)
            {
                if (l.ID == langpairId)
                {
                    ViewData["langpair"] = l.Name;
                }
            }

            ViewData["error"] = "<font color='red'>" + errorMessage + "</font>";
            return View(project);
        }

        public ActionResult Tasks(int id)
        {
            EvaluationProject project = EvaluationRemoteMethods.GetEvaluationProject(id);
            return View(project);
        }

        public ActionResult Score(int id)
        {
            EvaluationProject project = EvaluationRemoteMethods.GetEvaluationProject(id);
            return View(project);
        }

        public ActionResult Metrics(int id)
        {
            ViewData["ProjectID"] = id;

            var questions = EvaluationRemoteMethods.GetAllQuestions(id);

            return View(questions);
        }

        public ActionResult TaskBilingual(int id)
        {
            EvaluationProject project = EvaluationRemoteMethods.GetEvaluationProject(id);
            return View(project);
        }

        public ActionResult TaskMonoLingualSource(int id)
        {
            EvaluationProject project = EvaluationRemoteMethods.GetEvaluationProject(id);
            return View(project);
        }

        public ActionResult TaskMonoLingualTarget(int id)
        {
            EvaluationProject project = EvaluationRemoteMethods.GetEvaluationProject(id);
            return View(project);
        }

        public ActionResult Questions(int id)
        {
            ViewData["ProjectID"] = id;
            var questions = EvaluationRemoteMethods.GetAllQuestions(id);
            var languages = MiscellaneousRemoteMethods.GetAllLanguages();
            var selectLanguageList = new SelectList(languages, "Id", "Name", 1);
            ViewData["EvalLanguages"] = selectLanguageList;
            if (questions == null)
                return View();

            return View(questions);
        }

        [HttpPost]
        public ActionResult Questions(int id, FormCollection collection)
        {
            try
            {
                if (collection["AddEvaluationQuestion"] != null)
                {
                    int language = Convert.ToInt32(collection["language"]);
                    string name = collection["QuestionName"];
                    EvaluationQuestion q = EvaluationRemoteMethods.CreateEvaluationQuestion(id, name);
                }
                if (collection["AddEvaluationQuestionItem"] != null)
                {
                    string name = collection["QuestionName"];
                    string action = collection["ActionName"];
                    string confirmation = collection["ConfirmationName"];
                    int language = Convert.ToInt32(collection["language"]);
                    int qid = Convert.ToInt32(collection["QuestionID"]);
                    EvaluationQuestion q = EvaluationRemoteMethods.CreateEvaluationQuestionItem(id, qid, language, name, action, confirmation);
                }
                if (collection["AddEvaluationQuestionItemAnswer"] != null)
                {
                    string answer = collection["Answer"];
                    string value = collection["AnswerValue"];
                    int qid = Convert.ToInt32(collection["QuestionItemID"]);
                    EvaluationQuestion q = EvaluationRemoteMethods.CreateEvaluationQuestionItemAnswer(id, qid, answer, value);
                }


                return RedirectToAction("Questions", "Evaluation", new { id = id });
            }
            catch
            {
                return View();
            }
        }

        public ActionResult Evaluate(int id)
        {
            EvaluationProject project = EvaluationRemoteMethods.GetEvaluationProject(id);
            return View(project);
        }

        public ActionResult Details(int id)
        {
            EvaluationProject project = EvaluationRemoteMethods.GetEvaluationProject(id);
            return View(project);
        }

        public ActionResult ViewEvaluationData(int id, string token)
        {
            ViewData["ProjectID"] = id;
            List<EvaluationSimpleScore> list = EvaluationRemoteMethods.GetScores(id, token);
            return View(list);
        }

        public ActionResult Delete(int Id)
        {
            EvaluationProject project = EvaluationRemoteMethods.GetEvaluationProject(Id);
            return View(project);
        }

        [HttpPost]
        [AuditFilter(AuditAction = AuditFilter.DELETE, AuditType = AuditFilter.TYPEDEFAULT, AuditDescription = AuditDescriptor.EVALUATION_PROJECT_DELETED)]
        public ActionResult Delete(int Id, FormCollection collection)
        {
            bool deleted = EvaluationRemoteMethods.DeleteProject(Id);
            return RedirectToAction("Index");
        }

        public ActionResult DeleteQuestion(int Id, int qid)
        {
            ViewData["ProjectID"] = Id;

            List<EvaluationQuestion> questions = EvaluationRemoteMethods.GetAllQuestions(Id);
            foreach (var evaluationQuestion in questions)
            {
                foreach (var q in evaluationQuestion.LanguageQuestions)
                {
                    if (q.ID == qid)
                    {
                        return View(q);
                    }
                }
            }
            return View();
        }

        [HttpPost]
        public ActionResult DeleteQuestion(int Id, int qid, FormCollection collection)
        {
            bool deleted = EvaluationRemoteMethods.DeleteEvaluationQuestion(qid);
            return RedirectToAction("Questions", new { id = Id });
        }

        public ActionResult DeleteQuestionCategory(int Id, int cid)
        {
            ViewData["ProjectID"] = Id;

            List<EvaluationQuestion> questions = EvaluationRemoteMethods.GetAllQuestions(Id);
            foreach (var evaluationQuestion in questions)
            {
                if (evaluationQuestion.ID == cid)
                {
                    return View(evaluationQuestion);
                }
            }
            return View();
        }

        [HttpPost]
        public ActionResult DeleteQuestionCategory(int Id, int cid, FormCollection collection)
        {
            bool deleted = EvaluationRemoteMethods.DeleteEvaluationQuestionCategory(cid);
            return RedirectToAction("Questions", new { id = Id });
        }

        public ActionResult DeleteQuestionAnswer(int Id, int aid)
        {
            ViewData["ProjectID"] = Id;
            List<EvaluationQuestion> questions = EvaluationRemoteMethods.GetAllQuestions(Id);
            EvaluationQuestionItemAnswer answerItem = null;
            foreach (var evaluationQuestion in questions)
            {
                foreach (var q in evaluationQuestion.LanguageQuestions)
                {
                    foreach (var answer in q.Answers)
                    {
                        if (answer.ID == aid)
                        {
                            answerItem = answer;
                            return View(answerItem);
                        }
                    }
                }
            }
            return View(answerItem);
        }

        [HttpPost]
        public ActionResult DeleteQuestionAnswer(int Id, int aid, FormCollection collection)
        {
            bool deleted = EvaluationRemoteMethods.DeleteEvaluationQuestionAnswer(aid);
            return RedirectToAction("Questions", new { id = Id });
        }

        public ActionResult Edit(int id)
        {
            EvaluationProject project = EvaluationRemoteMethods.GetEvaluationProject(id);

            List<Project> projects = PostEditRemoteMethods.GetProjectsByUser(User.Identity.Name);
            List<SelectListItem> projectsList = new List<SelectListItem>();
            List<SelectListItem> projectsTypesList = new List<SelectListItem>();

            List<SelectListItem> evaluationMethods = new List<SelectListItem>();
            List<SelectListItem> duplicationApproachOptions = new List<SelectListItem>();


            projectsList.Add(new SelectListItem() { Text = Global.EvaluationProjectSelectLabel, Value = "-1" });

            foreach (Project p in projects)
            {
                if (p.ProjectOwner == User.Identity.Name)
                    projectsList.Add(new SelectListItem() { Text = p.ProjectName, Value = p.ID.ToString() });
            }

            projectsTypesList.Add(new SelectListItem() { Text = Global.EvaluationProjectExternalProjectLabel, Value = "2" });
            projectsTypesList.Add(new SelectListItem() { Text = Global.EvaluationProjectInternalLabel, Value = "1" });

            evaluationMethods.Add(new SelectListItem() { Text = Global.NotSet, Value = "0" });
            evaluationMethods.Add(new SelectListItem() { Text = Global.EvaluateOriginalLabel, Value = "1" });
            evaluationMethods.Add(new SelectListItem() { Text = Global.EvaluateOriginalAndAllRevisionsLabel, Value = "2" });
            evaluationMethods.Add(new SelectListItem() { Text = Global.EvaluateAllRevisionsOnlyLabel, Value = "3" });

            duplicationApproachOptions.Add(new SelectListItem() { Text = Global.NotSet, Value = "0" });
            duplicationApproachOptions.Add(new SelectListItem() { Text = Global.AvoidDuplicationTaskLevel, Value = "1" });
            duplicationApproachOptions.Add(new SelectListItem() { Text = Global.AvoidDuplicationProjectLevel, Value = "2" });

            @ViewBag.PostEditProjects = projectsList;
            @ViewBag.EvaluationProjectType = projectsTypesList;
            @ViewBag.EvaluationMethods = evaluationMethods;
            @ViewBag.DuplicationApproachOptions = duplicationApproachOptions;

            @ViewBag.ProjectTypeHelper = project.PostEditProjectId;

            @ViewBag.EvalApproach = project.EvaluationMethod;
            @ViewBag.AvoidDuplications = project.DuplicationLogic;
            @ViewBag.IncludeOwner = project.IncludeOwnerRevision;




            return View(project);
        }

        [HttpPost]
        [AuditFilter(AuditAction = AuditFilter.UPDATE, AuditType = AuditFilter.TYPEDEFAULT, AuditDescription = AuditDescriptor.EVALUATION_PROJECT_UPDATED)]
        public ActionResult Edit(int id, FormCollection collection)
        {
            try
            {
                string evalProjectName = collection["Name"];
                string evalOrganization = collection["Organization"];
                string evalDescription = collection["Description"];
                string evalApiKey = collection["ApiKey"];
                string evalDomain = collection["Domain"];


                string evalProjectType = collection["EvaluationType"];
                string evalPostEditProjectId = collection["PostEditProjectId"] != null ? evalPostEditProjectId = collection["PostEditProjectId"] : evalPostEditProjectId = "-1";
                string evalMethod = collection["EvaluationMethod"] != null ? evalMethod = collection["EvaluationMethod"] : evalMethod = "0";
                string includeOwnerRev = collection["IncludeOwnerRevision"].Replace("true,false", "true").Replace("False,false", "false");
                string duplicationLogic = collection["DuplicationLogic"] != null ? duplicationLogic = collection["DuplicationLogic"] : duplicationLogic = "0";
                string emailBody = collection["CustomEmailBody"] != null ? emailBody = collection["CustomEmailBody"] : emailBody = string.Empty;


                EvaluationProject p = EvaluationRemoteMethods.UpdateEvaluationProject(id, evalProjectName, evalDescription,
                    evalOrganization, evalApiKey, evalDomain, evalProjectType, evalPostEditProjectId
                    , evalMethod, duplicationLogic, includeOwnerRev, emailBody);
                return RedirectToAction("Project", new { id = id });

            }
            catch
            {
                return View();
            }
        }

        public ActionResult EditQuestion(int id, int qid)
        {
            ViewData["ProjectID"] = id;

            var languages = MiscellaneousRemoteMethods.GetAllLanguages();
            List<EvaluationQuestion> questions = EvaluationRemoteMethods.GetAllQuestions(id);
            EvaluationQuestionItem questionItem = null;

            //find the question.
            foreach (var evaluationQuestion in questions)
            {
                foreach (var q in evaluationQuestion.LanguageQuestions)
                {
                    if (q.ID == qid)
                    {
                        questionItem = q;
                        var selectLanguageList = new SelectList(languages, "Id", "Name", questionItem.Language.ID);
                        ViewData["Languages"] = selectLanguageList;
                        return View(questionItem);
                    }
                }
            }

            return View(questionItem);
        }

        [HttpPost]
        public ActionResult EditQuestion(int id, int qid, FormCollection collection)
        {

            string name = collection["Question"];
            int language = Convert.ToInt32(collection["Language.ID"]);

            string action = collection["Action"];
            string confirmation = collection["Confirmation"];

            EvaluationQuestion categoryItem = EvaluationRemoteMethods.UpdateEvaluationQuestion(qid, language, name, action, confirmation);


            return RedirectToAction("Questions", new { id = id });
        }

        public ActionResult EditQuestionCategory(int id, int category)
        {
            ViewData["ProjectID"] = id;
            List<EvaluationQuestion> questions = EvaluationRemoteMethods.GetAllQuestions(id);
            var categoryItem = questions.Where(q => q.ID == category).FirstOrDefault();
            // TODO: We need to add extra validation. Is the user allowed to edit this category?
            return View(categoryItem);
        }

        [HttpPost]
        public ActionResult EditQuestionCategory(int id, int category, FormCollection collection)
        {
            string name = collection["Name"];
            EvaluationQuestion categoryItem = EvaluationRemoteMethods.UpdateEvaluationQuestionCategory(category, name);
            return RedirectToAction("Questions", new { id = id });
        }

        public ActionResult EditQuestionAnswer(int id, int aid)
        {
            ViewData["ProjectID"] = id;
            List<EvaluationQuestion> questions = EvaluationRemoteMethods.GetAllQuestions(id);
            EvaluationQuestionItemAnswer answerItem = null;
            //find the answer.
            foreach (var evaluationQuestion in questions)
            {
                foreach (var q in evaluationQuestion.LanguageQuestions)
                {
                    foreach (var answer in q.Answers)
                    {
                        if (answer.ID == aid)
                        {
                            answerItem = answer;
                            return View(answerItem);
                        }
                    }
                }
            }
            return View(answerItem);
        }

        [HttpPost]
        public ActionResult EditQuestionAnswer(int id, int aid, FormCollection collection)
        {
            string name = collection["Name"];
            string value = collection["Value"];
            EvaluationQuestion categoryItem = EvaluationRemoteMethods.UpdateEvaluationQuestionAnswer(aid, name, value);
            return RedirectToAction("Questions", new { id = id });
        }

        [HttpPost]
        public ActionResult UploadFile(HttpPostedFileBase file, string projectId)
        {
            try
            {
                if (file != null && file.ContentLength > 0)
                {
                    byte[] data;
                    string jsonContent;
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

                    jsonContent = System.Text.Encoding.UTF8.GetString(data);

                    //fix BOM.
                    int index = jsonContent.IndexOf('{');
                    if (index > 0)
                        jsonContent = jsonContent.Substring(index, jsonContent.Length - index);

                    ViewBag.Result = EvaluationRemoteMethods.AddContentToEvaluationProject(jsonContent, projectId);
                }

                return PartialView("_UploadFile");
            }
            catch (Exception e)
            {
                throw (e);
            }
        }

        #region EvaluationInternal

        [Authorize]
        [HttpPost]
        public JsonResult InviteUsers(string usersList, string projectInvitatedId, string projectOwner)
        {
            return Json(EvaluationRemoteMethods.InviteUsersToProject(usersList.Split(new string[] { ";" }, StringSplitOptions.RemoveEmptyEntries), projectOwner, projectInvitatedId, "Guest"));
        }

        [AllowAnonymous]
        [HttpGet]
        public ActionResult Invitation(string code)
        {

            if (StringUtils.Validate32CharactersGuid(code))
            {
                Invitation invitation = EvaluationRemoteMethods.GetInvitationByCode(code);
                TempData.Remove("ProjectIdInvitationEval");
                TempData.Remove("ProjectIdInvitationUserNameEval");
                if (invitation != null)
                {
                    if (invitation.InvitationType == 2)
                    {
                        #region redirection cookie
                        HttpCookie myCookie = new HttpCookie("AceeptRedirectionEval");
                        myCookie["UserIdEval"] = invitation.UserName.ToString();
                        myCookie["ProjectIdEval"] = invitation.ProjectId.ToString();
                        myCookie.Expires = DateTime.Now.AddDays(30);
                        System.Web.HttpContext.Current.Response.Cookies.Add(myCookie);
                        #endregion
                        EvaluationRemoteMethods.UpdateProjectInviteConfirmationDateByCode(code);
                        TempData.Add("ProjectIdInvitationUserNameEval", invitation.UserName);
                        return RedirectToAction("Register", "Account");
                    }
                    else
                    {
                        if (invitation.InvitationType == 1)
                        {
                            if (User.Identity.IsAuthenticated && invitation.UserName == User.Identity.Name)
                            {

                                EvaluationRemoteMethods.UpdateProjectInviteConfirmationDateByCode(code);
                                TempData.Add("ProjectIdInvitationEval", invitation.ProjectId);
                                TempData.Add("ProjectIdInvitationUserNameEval", invitation.UserName);

                                return RedirectToAction("EvaluateProject", new RouteValueDictionary(new { controller = "Evaluation", action = "EvaluateProject", Id = invitation.ProjectId }));

                            }
                            else
                            {
                                EvaluationRemoteMethods.UpdateProjectInviteConfirmationDateByCode(code);
                                TempData.Add("ProjectIdInvitationEval", invitation.ProjectId);
                                TempData.Add("ProjectIdInvitationUserNameEval", invitation.UserName);
                                return RedirectToAction("Login", "Account");
                            }
                        }
                        else
                        {
                            if (User.Identity.IsAuthenticated && invitation.UserName == User.Identity.Name)
                                return RedirectToAction("Index", "Evaluation");
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


        public ActionResult EvaluateProject(int Id)
        {
            string userRole = EvaluationRemoteMethods.GetUserRoleEvaluationProject(User.Identity.Name, Id);
            if (userRole.CompareTo("ProjUser") != 0 && userRole.CompareTo("ProjAdmin") != 0)
                return RedirectToAction("Index");

            InternalEvaluationVM model = new InternalEvaluationVM();

            model.EvaluationProject = EvaluationRemoteMethods.GetEvaluationProject(Id);

            //this method slowsdown everything!
            var p = PostEditRemoteMethods.GetProject(model.EvaluationProject.PostEditProjectId);

            model.PostEditProjectInEvaluation = PostEditRemoteMethods.GetProjectWithValidDocuments(model.EvaluationProject.PostEditProjectId, p.ProjectOwner);

            PostEditRemoteMethods.GetProjectTasksStatus(model.PostEditProjectInEvaluation.AdminToken);

            if (model.PostEditProjectInEvaluation.SingleRevision)
            {

                foreach (var doc in model.PostEditProjectInEvaluation.Documents)
                    model.ProjectTaskStatus.Tasks.Add(doc.TextId);

                foreach (string t in model.ProjectTaskStatus.Tasks)
                    model.ProjectTaskStatus.Users.Add(model.PostEditProjectInEvaluation.ProjectOwner);
            }
            else
            {

                model.ProjectTaskStatus.Tasks = (from w in model.ProjectTaskStatus.UserTaskStatus
                                                 select w.TextId).Distinct().ToList();

                model.ProjectTaskStatus.Users = (from w in model.ProjectTaskStatus.UserTaskStatus
                                                 select w.UserId).Distinct().ToList();

            }

            model.InternalAudits = EvaluationRemoteMethods.GetInternalEvaluationAudits(model.EvaluationProject.AdminToken, User.Identity.Name, "1");
            return View(model);
        }

        //[AuditFilter(AuditAction = AuditFilter.READ, AuditType = AuditFilter.TYPEDEFAULT, AuditDescription = AuditDescriptor.)]
        public ActionResult EvaluateProjectAction(int Id, string user, string task)
        {

            user = @AcceptPortal.Utils.CoreUtils.Base64Decode(user);
            task = @AcceptPortal.Utils.CoreUtils.Base64Decode(task);

            string userRole = EvaluationRemoteMethods.GetUserRoleEvaluationProject(User.Identity.Name, Id);
            if (userRole.CompareTo("ProjUser") != 0 && userRole.CompareTo("ProjAdmin") != 0)
                return RedirectToAction("Index");

            InternalEvaluationVM model = new InternalEvaluationVM();
            model.EvaluationProject = EvaluationRemoteMethods.GetEvaluationProject(Id);

            model.EvaluationProject.Questions = EvaluationRemoteMethods.GetAllQuestions(Id);

            var p = PostEditRemoteMethods.GetProject(model.EvaluationProject.PostEditProjectId);

            if (user == "MT")
                model.PostEditProjectInEvaluation = PostEditRemoteMethods.GetProjectWithValidDocuments(model.EvaluationProject.PostEditProjectId, p.ProjectOwner);
            else
                model.PostEditProjectInEvaluation = PostEditRemoteMethods.GetProjectWithValidDocuments(model.EvaluationProject.PostEditProjectId, user);//User.Identity.Name

            ViewBag.CurrentUser = user;
            ViewBag.CurrentTaskId = task;
            string[] test = EvaluationRemoteMethods.GetEvaluationHistory(model.EvaluationProject.AdminToken, User.Identity.Name);
            ViewBag.EvaluationHistory = test;

            ViewBag.AcceptApiUrl = CoreUtils.AcceptPortalApiPath;

            return View(model);
        }

        [HttpGet]
        public ActionResult GetPosEditedDocument(string textId, string userName, string owner, bool isSingleRevision)
        {

            string urlDoc = CoreUtils.AcceptPortalApiPath + "/PostEdit/DocumentXliff?userId={0}&textId={1}";
            InternalEvaluationInstanceVM model = new InternalEvaluationInstanceVM();
            model.UserId = userName;
            model.TextId = textId;
            try
            {
                string jSonResponse;

                if (userName != "MT" && !isSingleRevision)
                    jSonResponse = WebUtils.GetJson(string.Format(urlDoc, userName, textId), "application/xml");
                else
                    jSonResponse = WebUtils.GetJson(string.Format(urlDoc, owner, textId), "application/xml");
                XDocument obj = XDocument.Parse(jSonResponse);
                XNamespace df = obj.Root.Name.Namespace;
                foreach (XElement transUnitNode in obj.Descendants(df + "trans-unit"))
                {
                    XElement sourceNode = transUnitNode.Element(df + "source");
                    XElement targetNode = transUnitNode.Element(df + "target");
                    XElement mtBaselineNode = transUnitNode.Elements().Where(x => x.Name == "alt-trans" && x.Attribute("phase-name").Value == "mt_baseline").FirstOrDefault();

                    List<XElement> alternativeTranslationNodes = transUnitNode.Elements().Where(x => x.Name == "alt-trans" && x.Attribute("phase-name").Value != "mt_baseline").ToList();

                    if (alternativeTranslationNodes != null && alternativeTranslationNodes.Count > 0)
                    {
                        List<string> altersTrans; altersTrans = new List<string>();
                        foreach (XElement alter in alternativeTranslationNodes)
                            altersTrans.Add(alter.Value);

                        model.AlternativeTranslations.Add(altersTrans);
                    }

                    model.Sources.Add(sourceNode.Value);
                    model.Targets.Add(targetNode.Value);

                    if (mtBaselineNode != null && mtBaselineNode.Value != null)
                        model.MTBaselines.Add(mtBaselineNode.Value);
                    else
                    {
                        mtBaselineNode = transUnitNode.Elements().Where(x => x.Name == "target" && x.Attribute("phase-name").Value == "mt_baseline").FirstOrDefault();
                        if (mtBaselineNode != null && mtBaselineNode.Value != null)
                            model.MTBaselines.Add(mtBaselineNode.Value);
                        else
                            model.MTBaselines.Add("@@NOMTNODE@@");
                    }
                }

            }
            catch (Exception e)
            {
                throw (e);
            }

            if (userName == "MT")
                model.Targets = model.MTBaselines;

            return PartialView("_PostEditDocumentEvaluation", model);
        }
        #endregion

    }
}

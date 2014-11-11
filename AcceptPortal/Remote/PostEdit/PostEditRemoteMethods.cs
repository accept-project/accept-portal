using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using AcceptPortal.Models.Admin;
using AcceptPortal.Models.PosEdit;
using AcceptPortal.Resources;
using AcceptPortal.Utils;
using AcceptPortal.ViewModels;

namespace AcceptPortal.Remote.PostEdit
{
    public static class PostEditRemoteMethods
    {
        #region projects

        public static Project CreateProject(string projectName, int domainId, int status)
        {

            try
            {
                string jSonResponse;
                jSonResponse = WebUtils.PostJson(CoreUtils.CreateProjectPath, string.Format(CoreUtils.CreateProjectJsonBody, projectName, domainId, status), "application/json");

                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });

                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus == "OK" && obj.ResponseObject.Count > 0)
                    {
                        return new Project(obj.ResponseStatus.Id, obj.ResponseStatus.Name, obj.ResponseStatus.ProjectDomain.Id, obj.ResponseStatus.ProjectDomain.DomainName, obj.ResponseStatus.Status, new List<Document>());
                    }
                }

                return new Project();
            }
            catch (Exception e)
            {
                throw (e);
            }
        }

        public static Project CreateProject(string jsonBody)
        {

            try
            {
                string jSonResponse;
                jSonResponse = WebUtils.PostJson(CoreUtils.ProjectPath, jsonBody, "application/json");

                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });

                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus == "OK" && obj.ResponseObject.Count > 0)
                    {
                        return new Project(obj.ResponseStatus.Id, obj.ResponseStatus.Name, obj.ResponseStatus.ProjectDomain.Id, obj.ResponseStatus.ProjectDomain.DomainName, obj.ResponseStatus.Status, new List<Document>());
                    }
                }

                return new Project();
            }
            catch (Exception e)
            {
                throw (e);
            }
        }

        public static bool UpdateProject(string jsonBody, out string message)
        {
            try
            {
                message = string.Empty;
                string jSonResponse;
                jSonResponse = WebUtils.PutJson(CoreUtils.ProjectPath, jsonBody, "application/json");

                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });
                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    string ResponseStatus = obj.ResponseStatus;
                    switch (ResponseStatus)
                    {
                        case "OK": { message = @AcceptPortal.Resources.Global.ProjectUpdated; return true; }
                        case "INCOMPLETE": { message = @AcceptPortal.Resources.Global.ProjectUpdated; return true; }
                    }
                }

                return false;
            }
            catch
            {
                message = string.Empty;
                return false;
            }
        }

        public static List<Project> GetAllProjects()
        {
            try
            {
                string jSonResponse;
                jSonResponse = WebUtils.GetJson(string.Format(CoreUtils.GetAllprojectsPath), "application/json");
                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });
                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus == "OK" && obj.ResponseObject.Count > 0)
                    {
                        List<Project> projects = new List<Project>();

                        foreach (var p in obj.ResponseObject)
                        {
                            if (p.Status == 1)
                                projects.Add(new Project(p.Id, p.Name, p.ProjectDomain.Id, p.ProjectDomain.DomainName, p.Status, new List<Document>()));
                        }

                        return projects;
                    }
                }

                return new List<Project>();
            }
            catch (Exception e)
            {
                throw (e);
            }
        }

        public static Project GetProject(int projectId)
        {

            try
            {
                string jSonResponse;
                jSonResponse = WebUtils.GetJson(string.Format(CoreUtils.GetProjectPath, projectId), "application/json");
                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });
                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus == "OK")
                    {
                        List<ProjectOption> options = getProjectOptions(obj.ResponseObject.ProjectEditOptions);
                        ProjectQuestion question = getProjectQuestion(obj.ResponseObject.ProjectQuestion);
                        ShowTranslationOptions displayTransOptions = getShowTranslationOption(obj.ResponseObject.TranslationOptions);
                        return new Project(obj.ResponseObject.Id, obj.ResponseObject.Name, obj.ResponseObject.ProjectDomain.Id,
                            obj.ResponseObject.ProjectDomain.DomainName, obj.ResponseObject.Status, GetProjectDocuments(obj.ResponseObject.ProjectDocuments, projectId),
                            obj.ResponseObject.ProjectOwner, obj.ResponseObject.InterfaceConfiguration, obj.ResponseObject.SourceLanguage.Name,
                            obj.ResponseObject.TargetLanguage.Name, obj.ResponseObject.ProjectOrganization != null ? obj.ResponseObject.ProjectOrganization : string.Empty,
                            options, question.Question, question.ID, obj.ResponseObject.SurveyLink, obj.ResponseObject.EmailBodyMessage,
                            displayTransOptions, obj.ResponseObject.CustomInterfaceConfiguration, obj.ResponseObject.External,
                            obj.ResponseObject.AdminToken, obj.ResponseObject.IsSingleRevision,
                            new TimeSpan(obj.ResponseObject.MaxThreshold.Hours, obj.ResponseObject.MaxThreshold.Minutes,
                                obj.ResponseObject.MaxThreshold.Seconds), obj.ResponseObject.ParaphrasingMode,
                                obj.ResponseObject.InteractiveCheck, obj.ResponseObject.InteractiveCheckMetadata, obj.ResponseObject.ParaphrasingMetadata);
                    }
                }

                return null;
            }
            catch (Exception e)
            {
                throw (e);
            }
        }

        public static bool IsProjectStarted(int projectId)
        {

            try
            {
                string jSonResponse;
                jSonResponse = WebUtils.GetJson(string.Format(CoreUtils.IsProjectStarted, projectId), "application/json");
                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });
                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus == "OK")
                    {
                        return obj.ResponseObject;
                    }
                }

                return true;
            }
            catch (Exception e)
            {
                throw (e);
            }
        }

        public static Project GetProjectWithValidDocuments(int projectId, string userName)
        {

            try
            {

                var jsonRequestBody = new { projectId = projectId, userName = userName };
                JavaScriptSerializer serializer = new JavaScriptSerializer();
                var jsonRequestBodyOutput = serializer.Serialize(jsonRequestBody);

                string jSonResponse;
                jSonResponse = WebUtils.PostJson(string.Format(CoreUtils.ProjectWithActiveDocumentsPath, projectId), jsonRequestBodyOutput, "application/json");
                if (jSonResponse.Length > 0)
                {
                    serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });
                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus == "OK" && obj.ResponseObject != null)
                    {
                        if (obj.ResponseObject.Completed != null)
                            return new Project(obj.ResponseObject.Id, obj.ResponseObject.Name, obj.ResponseObject.ProjectOwner, obj.ResponseObject.SurveyLink);
                        else
                        {
                            List<ProjectOption> options = getProjectOptions(obj.ResponseObject.ProjectEditOptions);
                            ProjectQuestion question = getProjectQuestion(obj.ResponseObject.ProjectQuestion);
                            ShowTranslationOptions displayTransOptions = getShowTranslationOption(obj.ResponseObject.TranslationOptions);

                            return new Project(obj.ResponseObject.Id, obj.ResponseObject.Name, obj.ResponseObject.ProjectDomain.Id,
                                obj.ResponseObject.ProjectDomain.DomainName, obj.ResponseObject.Status, GetProjectDocuments(obj.ResponseObject.ProjectDocuments,
                                projectId), obj.ResponseObject.ProjectOwner, obj.ResponseObject.InterfaceConfiguration, obj.ResponseObject.SourceLanguage.Name,
                                obj.ResponseObject.TargetLanguage.Name,
                                obj.ResponseObject.ProjectOrganization != null ? obj.ResponseObject.ProjectOrganization : string.Empty, options,
                                question.Question, question.ID, obj.ResponseObject.SurveyLink,
                                obj.ResponseObject.EmailBodyMessage, displayTransOptions, obj.ResponseObject.CustomInterfaceConfiguration,
                                obj.ResponseObject.External, obj.ResponseObject.AdminToken, obj.ResponseObject.IsSingleRevision,
                                new TimeSpan(obj.ResponseObject.MaxThreshold.Hours, obj.ResponseObject.MaxThreshold.Minutes,
                                    obj.ResponseObject.MaxThreshold.Seconds), obj.ResponseObject.ParaphrasingMode, obj.ResponseObject.InteractiveCheck,
                                    obj.ResponseObject.InteractiveCheckMetadata, obj.ResponseObject.ParaphrasingMetadata);
                        }
                    }
                }

                return null;
            }
            catch (Exception e)
            {
                throw (e);
            }
        }

        public static void GetProjectsByDomains(int domainId)
        {
            try
            {
                string jSonResponse;
                jSonResponse = WebUtils.GetJson(string.Format(CoreUtils.GetProjectsByDomainPath, domainId), "application/json");
                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });
                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus == "OK")
                    {

                    }
                }
            }
            catch (Exception e)
            {
                throw (e);
            }
        }

        public static List<Project> GetProjectsByUser(string userName)
        {
            try
            {
                string jSonResponse;
                jSonResponse = WebUtils.PostJson(CoreUtils.ProjectByUserNamePath, "{\"userName\":\"" + userName + "\"}", "application/json");
                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });
                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus == "OK" && obj.ResponseObject.Count > 0)
                    {
                        List<Project> projects = new List<Project>();

                        foreach (var p in obj.ResponseObject)
                        {
                            if (p.Status == 1)
                            {
                                List<ProjectOption> options = getProjectOptions(p.ProjectEditOptions);
                                ProjectQuestion question = getProjectQuestion(p.ProjectQuestion);
                                ShowTranslationOptions displayTransOptions = getShowTranslationOption(p.TranslationOptions);

                                projects.Add(new Project(p.Id, p.Name, p.ProjectDomain.Id, p.ProjectDomain.DomainName, p.Status, new List<Document>(),
                                    p.ProjectOwner, p.InterfaceConfiguration, p.SourceLanguage.Name, p.TargetLanguage.Name,
                                    p.ProjectOrganization != null ? p.ProjectOrganization : string.Empty, options, question.Question, question.ID,
                                    p.SurveyLink, p.EmailBodyMessage, displayTransOptions, p.CustomInterfaceConfiguration, p.External, p.AdminToken,
                                    p.IsSingleRevision, new TimeSpan(p.MaxThreshold.Hours, p.MaxThreshold.Minutes, p.MaxThreshold.Seconds),
                                    p.ParaphrasingMode, p.InteractiveCheck,
                                    p.InteractiveCheckMetadata, p.ParaphrasingMetadata));
                            }
                        }

                        return projects;
                    }
                }
                return new List<Project>();
            }
            catch (Exception e)
            {
                throw (e);
            }
        }

        public static List<Project> GetDemoProjects()
        {
            try
            {
                string jSonResponse;
                jSonResponse = WebUtils.GetJson(CoreUtils.GetDemoProjectsPath, "application/json");
                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });
                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus == "OK" && obj.ResponseObject.Count > 0)
                    {
                        List<Project> projects = new List<Project>();

                        foreach (var p in obj.ResponseObject)
                        {
                            if (p.Status == 1)
                            {
                                List<ProjectOption> options = getProjectOptions(p.ProjectEditOptions);
                                ProjectQuestion question = getProjectQuestion(p.ProjectQuestion);
                                ShowTranslationOptions displayTransOptions = getShowTranslationOption(p.TranslationOptions);

                                projects.Add(new Project(p.Id, p.Name, p.ProjectDomain.Id, p.ProjectDomain.DomainName, p.Status, new List<Document>(),
                                    p.ProjectOwner, p.InterfaceConfiguration, p.SourceLanguage.Name, p.TargetLanguage.Name,
                                    p.ProjectOrganization != null ? p.ProjectOrganization : string.Empty, options, question.Question, question.ID,
                                    p.SurveyLink, p.EmailBodyMessage, displayTransOptions, p.CustomInterfaceConfiguration, p.External, p.AdminToken,
                                    p.IsSingleRevision, new TimeSpan(p.MaxThreshold.Hours, p.MaxThreshold.Minutes, p.MaxThreshold.Seconds),
                                    p.ParaphrasingMode, p.InteractiveCheck,
                                    p.InteractiveCheckMetadata, p.ParaphrasingMetadata));
                            }
                        }

                        return projects;
                    }
                }
                return new List<Project>();
            }
            catch (Exception e)
            {
                throw (e);
            }
        }

        private static List<ProjectOption> getProjectOptions(dynamic projectOptionsDynamic)
        {
            List<ProjectOption> projectOptions = new List<ProjectOption>();

            try
            {
                foreach (var opt in projectOptionsDynamic)
                {
                    projectOptions.Add(new ProjectOption(opt.Id, opt.EditOption));
                }
            }
            catch
            {
                return new List<ProjectOption>();
            }

            return projectOptions;
        }

        private static ProjectQuestion getProjectQuestion(dynamic projectQuestionDynamic)
        {
            ProjectQuestion question = new ProjectQuestion();

            try
            {
                foreach (var opt in projectQuestionDynamic)
                {
                    question.ID = opt.Id;
                    question.Question = opt.Question;
                }
            }

            catch { }
            return question;
        }

        private static ShowTranslationOptions getShowTranslationOption(dynamic showTransaltionOptionsDynamic)
        {
            ShowTranslationOptions showTranslationOptions = new ShowTranslationOptions(1, AcceptPortal.Resources.Global.LabelDisplayTranslationOptions);

            try
            {
                if (showTransaltionOptionsDynamic == 2)
                    showTranslationOptions = new ShowTranslationOptions(2, AcceptPortal.Resources.Global.DoNotDisplayTranslationOptions);
            }
            catch (Exception e)
            {
                throw (e);
            }

            return showTranslationOptions;

        }

        private static List<Document> GetProjectDocuments(dynamic obj, int projectId)
        {
            try
            {
                List<Document> docs = new List<Document>();
                foreach (var doc in obj)
                    docs.Add(new Document(doc.Id, projectId, doc.text_id));
                return docs;
            }
            catch (Exception e)
            {
                throw (e);
            }

        }

        public static bool DeletePostEditProject(int projectId)
        {
            try
            {
                string jSonResponse;
                jSonResponse = WebUtils.DeleteJson(string.Format(CoreUtils.DeleteProject, projectId), "", "application/json");
                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });
                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus == "OK")
                        return true;
                }

                return false;
            }
            catch (Exception e)
            {
                throw (e);
            }
        }

        public static TaskStatusVM GetProjectTasksStatus(string token)
        {
            try
            {
                string jSonResponse = WebUtils.GetJson(string.Format(CoreUtils.ProjectTaskStatus, token), "application/json");
                if (jSonResponse.Length > 0)
                {
                    TaskStatusVM tasksStatus = new TaskStatusVM();
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });
                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus != null && obj.ResponseStatus == "OK")
                    {
                        foreach (var statusTask in obj.ResponseObject)
                        {
                            tasksStatus.UserTaskStatus.Add(new TaskStatus(statusTask.TextId, statusTask.UserId, statusTask.Status));
                        }

                        return tasksStatus;
                    }
                }

            }
            catch (Exception e)
            {
                throw (e);
            }

            return new TaskStatusVM();

        }

        public static bool AddDocumentToProjectRaw(int projectId, string jSonRaw, out string errorMessage)
        {

            try
            {
                string jSonResponse;
                errorMessage = Global.TaskUploadFailedLabel;

                //fix BOM.
                int index = jSonRaw.IndexOf('{');
                if (index > 0)
                {
                    jSonRaw = jSonRaw.Substring(index, jSonRaw.Length - index);
                }

                string encodedContent = HttpUtility.UrlEncode(jSonRaw, System.Text.Encoding.UTF8);
                jSonResponse = WebUtils.PostJson(CoreUtils.AddDocumentToProjectRawPath, "jsonRaw=" + encodedContent + "&projectId=" + projectId, "application/x-www-form-urlencoded");

                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });
                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus == "OK")
                    {
                        return true;
                    }
                    else
                    {
                        if (obj.ResponseStatus == "FAILED")
                        {
                            string failedMessage = obj.Context;
                            switch (failedMessage)
                            {
                                case "AddDocumentToProjectRaw-InvalidJson": { errorMessage = Resources.Global.UploadTask_InvalidJsonMessage; } break;
                                case "AddDocumentToProjectRaw-InvalidSourceTarget": { errorMessage = Resources.Global.UploadTask_DifferentNumberOfItemsMessage; } break;
                                case "AddDocumentToProjectRaw-DuplicatedTextId": { errorMessage = Resources.Global.UploadTask_DuplicatedTextIdMessage; } break;
                            }

                        }
                    }

                }

                return false;
            }
            catch (Exception e)
            {
                errorMessage = Global.TaskUploadFailedLabel;
                return false;
            }
        }

        public static string InviteUsersToProject(string[] emailsList, string projectOwner, string projectId, string uniqueRoleName)
        {

            try
            {
                List<string> validEmails = new List<string>();
                foreach (string email in emailsList)
                    if (StringUtils.EmailValidator(email.Trim()))
                        validEmails.Add(email.Trim());

                var jsonObject = new { usersList = emailsList, projectId = projectId, uniqueRoleName = uniqueRoleName, projectOwner = projectOwner };
                JavaScriptSerializer serializer = new JavaScriptSerializer();
                var output = serializer.Serialize(jsonObject);

                string jSonResponse = WebUtils.PostJson(CoreUtils.InviteUsersPath, output, "application/json");
                return jSonResponse;

            }
            catch (Exception e)
            {
                throw (e);
            }
        }

        public static string getProjectJson(int projId, string projectName, string projectDomainId, string projStatus, string projectAdmin,
            string[] questions, string[] options, string sourceLanguageId, string targetLanguageId, string interfaceConfigId,
            int showTranslationsOptions, string emailBodyText, string projectSurveyUrl, string projOrganization,
            int customInterfaceConfiguration, bool isExternal, bool isSingleRev, string maxThreshold, int paraphrasingMode,
            int interactiveCheck, string interactiveCheckMetadata, string paraphrasingMetadata)
        {

            var project = new
            {
                Id = projId,
                name = projectName,
                projectOwner = projectAdmin,
                domainId = projectDomainId,
                status = projStatus,
                projectQuestions = questions,
                sourceLangId = sourceLanguageId,
                targetLangId = targetLanguageId,
                interfaceConfig = interfaceConfigId,
                projectOptions = options,
                translationOptions = showTranslationsOptions,
                emailMessage = emailBodyText,
                surveyLink = projectSurveyUrl,
                projectOrganization = projOrganization,
                customInterfaceConfiguration = customInterfaceConfiguration,
                isExternalProject = isExternal,
                isSingleRevision = isSingleRev,
                maxThreshold = maxThreshold,
                paraphrasingMode = paraphrasingMode,
                interactiveCheck = interactiveCheck,
                interactiveCheckMetadata = interactiveCheckMetadata,
                paraphrasingMetadata = paraphrasingMetadata
            };

            try
            {
                JavaScriptSerializer serializer = new JavaScriptSerializer();
                var output = serializer.Serialize(project);
                return string.Format("{{\"project\":{0} }}", output);
            }
            catch (Exception e)
            {
                throw (e);
            }

        }

        #endregion
      
        public static Invitation GetInvitationByCode(string code)
        {
            try
            {
                string jSonResponse = WebUtils.GetJson(string.Format(CoreUtils.InvitePath, code), "application/json");
                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });
                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus != null && obj.ResponseStatus == "OK")
                    {
                        Invitation invitation = new Invitation();
                        if (obj.ResponseObject != null)
                        {
                            invitation.InvitationType = obj.ResponseObject.Type;
                            invitation.UserName = obj.ResponseObject.UserName;
                            invitation.ProjectId = obj.ResponseObject.ProjectId;
                        }

                        return invitation;
                    }
                }

            }
            catch (Exception e)
            {
                throw (e);
            }


            return new Invitation();

        }

        public static Invitation GetInvitationByUserName(string userName)
        {
            try
            {
                string jSonResponse = WebUtils.GetJson(string.Format(CoreUtils.InviteByUserNamePath, userName), "application/json");
                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });
                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus != null && obj.ResponseStatus == "OK")
                    {

                        Invitation invitation = new Invitation();
                        if (obj.ResponseObject != null)
                        {
                            invitation.InvitationType = obj.ResponseObject.Type;
                            invitation.UserName = obj.ResponseObject.UserName;
                            invitation.ProjectId = obj.ResponseObject.ProjectId;
                            invitation.ConfirmationCode = obj.ResponseObject.ConfirmationCode;
                        }
                        return invitation;
                    }
                }

            }
            catch (Exception e)
            {
                throw (e);
            }

            return new Invitation();
        }

        public static Invitation UpdatetInvitationByCode(string code)
        {
            try
            {
                string jSonResponse = WebUtils.PostJson(string.Format(CoreUtils.InvitePath, code), "{\"code\":\"" + code + "\"}", "application/json");
                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });
                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus != null && obj.ResponseStatus == "OK")
                    {
                        Invitation invitation = new Invitation();

                        if (obj.ResponseObject != null)
                        {
                            invitation.InvitationType = obj.ResponseObject.Type;
                            invitation.UserName = obj.ResponseObject.UserName;
                            invitation.ProjectId = obj.ResponseObject.ProjectId;
                        }
                        return invitation;
                    }
                }

            }
            catch (Exception e)
            {
                throw (e);
            }

            return new Invitation();

        }

        public static void UpdateProjectInviteConfirmationDateByCode(string code)
        {
            try
            {
                string jSonResponse;
                jSonResponse = WebUtils.GetJson(string.Format(CoreUtils.UpdateProjectInviteConfirmationDateByCodePath, code), "application/json");
                //TODO: validate response... 
            }
            catch (Exception e)
            {
                throw (e);
            }
        }

        public static void DeleteDocument(string textId, string userId)
        {

            try
            {
                string jSonResponse;
                jSonResponse = WebUtils.DeleteJson(CoreUtils.Document, "textId=" + textId + "&userId=" + userId + "", "application/json");
                //TODO: validate response... 
            }
            catch (Exception e)
            {
                throw (e);
            }

        }
    
        public static List<string> ProjectInfo(string token)
        {
            try
            {
                string jSonResponse = WebUtils.GetJson(string.Format(CoreUtils.ProjectInfo, token), "application/json");
                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });
                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus != null && obj.ResponseStatus == "OK")
                    {
                        System.Collections.ArrayList test2 = obj.ResponseObject[1];
                        return test2.Cast<string>().ToList();
                    }
                }
            }
            catch (Exception e)
            {
                throw (e);
            }

            return new List<string> { };
        }

        public static string GetUserRolePostEditProject(string userName, int projectId)
        {
            try
            {

                string jSonResponse = WebUtils.GetJson(string.Format(CoreUtils.UserRolePostEditProjectPath, userName, projectId), "application/json");
                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });
                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus != null && obj.ResponseStatus == "OK")
                        return obj.ResponseObject;
                }
                return string.Empty;
            }
            catch (Exception e)
            {
                throw (e);
            }


        }

        public static List<AcceptPortal.Models.Admin.User> GetUsersInProject(string token)
        {
            try
            {
                List<AcceptPortal.Models.Admin.User> allUsersinProject; allUsersinProject = new List<AcceptPortal.Models.Admin.User>();
                string jSonResponse = WebUtils.GetJson(string.Format(CoreUtils.UserProject, string.Empty, token), "application/json");
                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });
                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus != null && obj.ResponseStatus == "OK")
                    {
                        foreach (dynamic user in obj.ResponseObject)
                        {
                            if (user.ExternalUserName != null)
                            {
                                ExternalUser u = new ExternalUser(user.Id, user.ExternalUserName, user.UniqueIdentifier);
                                allUsersinProject.Add(u);
                            }
                            else
                            {
                                AcceptPortal.Models.Admin.User u = new AcceptPortal.Models.Admin.User(user.Id, user.UserName);
                                allUsersinProject.Add(u);

                            }
                        }
                    }
                }

                return allUsersinProject;
            }
            catch (Exception e)
            {
                throw (e);
            }


        }

        public static PostEditDefaultsVM GetParaprasingDefaults(string lang)
        {
            try
            {
                string jSonResponse = WebUtils.GetJson(string.Format(CoreUtils.ParaphrasingDefaults, lang), "application/json");
                if (jSonResponse.Length > 0)
                {
                    PostEditDefaultsVM paraDef = new PostEditDefaultsVM();
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });
                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus != null && obj.ResponseStatus == "OK")
                    {
                        paraDef.MaxResultFrench = obj.ResponseObject.frMaxResults;
                        paraDef.MaxResultsEnglish = obj.ResponseObject.enMaxResults;
                        paraDef.LanguageCodeEnglish = obj.ResponseObject.enLanguageCode;
                        paraDef.LanguageCodeFrench = obj.ResponseObject.frLanguageCode;
                        paraDef.SystemIdEnglish = obj.ResponseObject.enSystemId;
                        paraDef.SystemIdFrench = obj.ResponseObject.frSystemId;
                        paraDef.InteractiveChecksDefaultRuleSet = obj.ResponseObject.interactiveCheckDefaultRuleSet;
                        return paraDef;
                    }
                }

            }
            catch (Exception e)
            {
                throw (e);
            }

            return new PostEditDefaultsVM();

        }

    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using AcceptPortal.Models.Evaluation;
using AcceptPortal.Models.PosEdit;
using AcceptPortal.Utils;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace AcceptPortal.Remote.Evaluation
{
    public static class EvaluationRemoteMethods
    {
        #region evaluation

        public static EvaluationProject CreateEvaluationProject(string evalProjectName, string description, string org, string domain, string requestor, string type, string postEditProjectId, string evaluationMethod, string duplicationLogic, string includeOwnerRevision, string emailBody)
        {
            try
            {
                string jSonResponse = WebUtils.PostJson(CoreUtils.CreateEvaluationProjectPath, string.Format(CoreUtils.CreateEvaluationProjectJsonBody, evalProjectName, description, org, domain, requestor, type, postEditProjectId, evaluationMethod, duplicationLogic, includeOwnerRevision, emailBody), "application/json");

                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });

                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus == "OK" && obj.ResponseObject != null)
                    {
                        return new EvaluationProject(obj.ResponseObject.Id, obj.ResponseObject.Name, obj.ResponseObject.Description,
                            obj.ResponseObject.Organization, obj.ResponseObject.ApiKey, obj.ResponseObject.Domain, obj.ResponseObject.CreationDate);
                    }
                }

                return new EvaluationProject();
            }
            catch (Exception e)
            {
                return null;
                //TODO: 
            }
        }

        public static EvaluationProject UpdateEvaluationProject(int projectId, string evalProjectName, string description,
             string org, string apiKey, string domain, string type, string postEditProjectId,
             string evaluationMethod, string duplicationLogic, string includeOwnerRevision, string emailBody)
        {

            try
            {
                string jSonResponse;
                string jsonRequest = string.Format(CoreUtils.UpdateEvaluationProjectJsonBody, evalProjectName, description, org, apiKey, domain, type, postEditProjectId, evaluationMethod, duplicationLogic, includeOwnerRevision, emailBody);
                string apiUrl = string.Format(CoreUtils.UpdateEvaluationProjectPath, projectId);
                jSonResponse = WebUtils.PostJson(apiUrl, jsonRequest, "application/json");

                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });

                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus == "OK")
                    {
                        return new EvaluationProject(obj.ResponseObject.Id, obj.ResponseObject.Name, obj.ResponseObject.Description,
                            obj.ResponseObject.Organization, obj.ResponseObject.ApiKey, obj.ResponseObject.Domain, obj.ResponseObject.CreationDate);
                    }
                }

                return new EvaluationProject();
            }
            catch (Exception e)
            {
                return null;
                //TODO: 
            }
        }

        public static EvaluationQuestion CreateEvaluationQuestionItem(int pid, int qid, int lid, string name, string action, string confirmation)
        {
            try
            {
                string jSonResponse;
                string jsonRequest = string.Format(CoreUtils.CreateEvaluationQuestionItemJsonBody, pid, qid, lid, name, action, confirmation);
                jSonResponse = WebUtils.PostJson(CoreUtils.CreateEvaluationQuestionItemPath, jsonRequest, "application/json");

                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });

                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus == "OK" && obj.ResponseObject.Count > 0)
                    {
                        return new EvaluationQuestion(obj.ResponseStatus.Id, obj.ResponseStatus.Name, obj.ResponseStatus.Count);
                    }
                }

                return new EvaluationQuestion();
            }
            catch (Exception e)
            {
                return null;
                //TODO: 
            }
        }

        public static EvaluationQuestion CreateEvaluationQuestionItemAnswer(int pid, int qid, string answer, string value)
        {
            try
            {
                string jSonResponse;
                string jsonRequest = string.Format(CoreUtils.CreateEvaluationQuestionItemAnswerJsonBody, pid, qid, answer, value);
                jSonResponse = WebUtils.PostJson(CoreUtils.CreateEvaluationQuestionItemAnswerPath, jsonRequest, "application/json");

                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });

                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus == "OK" && obj.ResponseObject.Count > 0)
                    {
                        return new EvaluationQuestion(obj.ResponseStatus.Id, obj.ResponseStatus.Name, obj.ResponseStatus.Count);
                    }
                }

                return new EvaluationQuestion();
            }
            catch (Exception e)
            {
                return null;
                //TODO: 
            }
        }

        public static EvaluationQuestion CreateEvaluationQuestion(int projectid, string name)
        {

            try
            {
                string jSonResponse;
                string jsonRequest = string.Format(CoreUtils.CreateEvaluationQuestionJsonBody, projectid, name);
                jSonResponse = WebUtils.PostJson(CoreUtils.CreateEvaluationQuestionPath, jsonRequest, "application/json");

                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });

                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus == "OK" && obj.ResponseObject.Count > 0)
                    {
                        return new EvaluationQuestion(obj.ResponseStatus.Id, obj.ResponseStatus.Name, obj.ResponseStatus.Count);
                    }
                }

                return new EvaluationQuestion();
            }
            catch (Exception e)
            {
                return null;
                //TODO: 
            }
        }

        public static EvaluationQuestion UpdateEvaluationQuestionCategory(int id, string name)
        {
            try
            {
                string jsonRequest = string.Format(CoreUtils.UpdateEvaluationQuestionJsonBody, id, name);
                string jSonResponse = WebUtils.PostJson(CoreUtils.UpdateEvaluationQuestionPath, jsonRequest, "application/json");

                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });

                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus == "OK" && obj.ResponseObject.Count > 0)
                    {
                        return new EvaluationQuestion(obj.ResponseStatus.Id, obj.ResponseStatus.Name, obj.ResponseStatus.Count);
                    }
                }

                return new EvaluationQuestion();
            }
            catch (Exception e)
            {
                return null;
                //TODO: 
            }
        }

        public static EvaluationQuestion UpdateEvaluationQuestion(int id, int lid, string name, string action, string confirmation)
        {
            try
            {
                string jsonRequest = string.Format(CoreUtils.UpdateEvaluationQuestionItemJsonBody, id, lid, name, action, confirmation);
                string jSonResponse = WebUtils.PostJson(CoreUtils.UpdateEvaluationQuestionItemPath, jsonRequest, "application/json");

                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });

                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus == "OK" && obj.ResponseObject.Count > 0)
                    {
                        return new EvaluationQuestion(obj.ResponseStatus.Id, obj.ResponseStatus.Name, obj.ResponseStatus.Count);
                    }
                }

                return new EvaluationQuestion();
            }
            catch (Exception e)
            {
                return null;
                //TODO: 
            }
        }

        public static EvaluationQuestion UpdateEvaluationQuestionAnswer(int id, string name, string value)
        {
            try
            {
                string jsonRequest = string.Format(CoreUtils.UpdateEvaluationQuestionItemAnswerJsonBody, id, name, value);
                string jSonResponse = WebUtils.PostJson(CoreUtils.UpdateEvaluationQuestionItemAnswerPath, jsonRequest, "application/json");

                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });

                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus == "OK" && obj.ResponseObject.Count > 0)
                    {
                        return new EvaluationQuestion(obj.ResponseStatus.Id, obj.ResponseStatus.Name, obj.ResponseStatus.Count);
                    }
                }

                return new EvaluationQuestion();
            }
            catch (Exception e)
            {
                return null;
                //TODO: 
            }
        }

        public static List<EvaluationProvider> Convert2EvaluationProviders(dynamic array)
        {
            var providers = new List<EvaluationProvider>();
            foreach (var item in array)
            {
                var provider = new EvaluationProvider();
                provider.Name = item.Name;
                provider.ID = Convert.ToInt32(item.Id);
                providers.Add(provider);
            }
            return providers;
        }

        public static List<EvaluationLanguagePair> Convert2EvaluationLanguagePairs(dynamic array)
        {
            var languagepairs = new List<EvaluationLanguagePair>();
            foreach (var item in array)
            {
                var lp = new EvaluationLanguagePair();
                lp.Name = item.FullName;
                lp.ID = Convert.ToInt32(item.Id);
                languagepairs.Add(lp);
            }
            return languagepairs;

        }

        public static bool UploadEvaluationFile(int projectid, int provider, int langpair, string file)
        {

            try
            {
                string jSonResponse;
                string jsonRequest = string.Format(CoreUtils.UploadEvaluationFileJsonBody, projectid, provider, langpair, System.Web.HttpUtility.HtmlEncode(file));
                jSonResponse = WebUtils.PostJson(CoreUtils.UploadEvaluationFilePath, jsonRequest, "application/json");

                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });

                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus == "OK" && obj.ResponseObject.Count > 0)
                        return true;

                }
                return false;
            }
            catch (Exception e)
            {
                return false;
                //TODO: 
            }
        }

        public static string AddContentToEvaluationProject(string jSonRaw, string projectId)
        {
            try
            {
                string encodedContent = HttpUtility.UrlEncode(jSonRaw, System.Text.Encoding.UTF8);
                string jSonResponse = WebUtils.PostJson(CoreUtils.AddContentToEvaluationProject, "jsonRaw=" + encodedContent + "&projectId=" + projectId, "application/x-www-form-urlencoded; charset=utf-8");

                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });
                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    return obj.ResponseStatus == "OK" ? "ok" : "failed";
                }

                return string.Empty;
            }
            catch (Exception e)
            {
                throw (e);
            }
        }

        public static EvaluationProject GetEvaluationProject(int projectId)
        {

            try
            {
                string jSonResponse;
                jSonResponse = WebUtils.GetJson(string.Format(CoreUtils.GetEvaluationProjectPath, projectId), "application/json");
                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });
                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus == "OK")
                    {
                        //return new EvaluationProject(obj.ResponseObject.Id, obj.ResponseObject.Name,
                        //obj.ResponseObject.Description, obj.ResponseObject.Organization, obj.ResponseObject.ApiKey, obj.ResponseObject.Domain, obj.ResponseObject.CreationDate, obj.ResponseObject.AdminToken);
                        #region EvaluationInternal
                        return new EvaluationProject(obj.ResponseObject.Id, obj.ResponseObject.Name,
                            obj.ResponseObject.Description, obj.ResponseObject.Organization, obj.ResponseObject.ApiKey, obj.ResponseObject.Domain,
                            obj.ResponseObject.CreationDate,
                            obj.ResponseObject.AdminToken, obj.ResponseObject.Type, obj.ResponseObject.PostEditProjectReferenceId, obj.ResponseObject.PostEditProjectEvaluationMethod,
                            obj.ResponseObject.PostEditProjectDuplicationLogic, obj.ResponseObject.IncludePostEditProjectOwner, obj.ResponseObject.EmailBodyMessage, obj.ResponseObject.Creator.UserName);

                        #endregion
                    }
                }

                return null;
            }
            catch (Exception e)
            {
                throw (e);
            }
        }

        public static List<EvaluationSimpleScore> GetScores(int projectId, string token)
        {
            try
            {
                string jSonResponse;
                jSonResponse = WebUtils.GetJson(string.Format(CoreUtils.GetEvaluationScoresPath, projectId, token), "application/json");
                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });
                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus == "OK")
                    {
                        var list = new List<EvaluationSimpleScore>();
                        foreach (var p in obj.ResponseObject)
                        {
                            var item = new EvaluationSimpleScore();
                            item.ID = p.Id;
                            item.ProjectID = p.ProjectID;
                            item.QuestionCategoryId = p.QuestionCategoryId;
                            item.QuestionCategory = p.QuestionCategory;
                            item.QuestionId = p.QuestionId;
                            item.Question = p.Question;
                            item.AnswerId = p.AnswerId;
                            item.Answer = p.Answer;
                            item.Domain = p.Domain;
                            item.Language = p.Language;
                            item.Var1 = p.Var1;
                            item.Var2 = p.Var2;
                            item.Var3 = p.Var3;
                            item.Var4 = p.Var4;
                            item.Var5 = p.Var5;
                            item.Var6 = p.Var6;
                            item.Var7 = p.Var7;
                            item.Var8 = p.Var8;
                            item.Var9 = p.Var9;
                            item.Var10 = p.Var10;
                            item.TimeStamp = p.TimeStamp;
                            list.Add(item);
                        }
                        return list;
                    }
                }

                return null;
            }
            catch (Exception e)
            {
                throw (e);
            }
        }

        public static EvaluationProject GetEvaluationDocuments(int projectId)
        {

            try
            {
                string jSonResponse;
                jSonResponse = WebUtils.GetJson(string.Format(CoreUtils.GetEvaluationDocumentsPath, projectId), "application/json");
                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });
                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus == "OK")
                    {
                        var providers = Convert2EvaluationProviders(obj.ResponseObject.Providers);
                        var languagepairs = Convert2EvaluationLanguagePairs(obj.ResponseObject.LanguagePairs);
                        return new EvaluationProject();
                    }
                }

                return null;
            }
            catch (Exception e)
            {
                throw (e);
            }
        }

        public static List<EvaluationQuestion> GetAllQuestions(int projectId)
        {
            try
            {
                string jSonResponse;
                jSonResponse = WebUtils.GetJson(string.Format(CoreUtils.GetAllEvaluationQuestionsPath, projectId), "application/json");
                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });
                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus == "OK" && obj.ResponseObject.Count > 0)
                    {
                        var questions = new List<EvaluationQuestion>();

                        foreach (var p in obj.ResponseObject)
                        {
                            var question = new EvaluationQuestion(p.Id, p.Name, p.Count);

                            foreach (var p2 in p.LanguageQuestions)
                            {
                                var qitem = new EvaluationQuestionItem();
                                var lang = new EvaluationLanguage { ID = p2.Language.Id, Name = p2.Language.Name };
                                qitem.ID = p2.Id;
                                qitem.Language = lang;
                                qitem.Question = p2.Question;
                                qitem.Count = p2.Count;
                                qitem.Action = p2.Action;
                                qitem.Confirmation = p2.Confirmation;
                                foreach (var p3 in p2.Answers)
                                {
                                    var answer = new EvaluationQuestionItemAnswer();
                                    answer.ID = p3.Id;
                                    answer.Name = p3.Name;
                                    answer.Count = p3.Count;
                                    answer.Value = p3.Value;

                                    if (qitem.Answers == null) qitem.Answers = new List<EvaluationQuestionItemAnswer>();
                                    qitem.Answers.Add(answer);
                                }
                                question.LanguageQuestions.Add(qitem);
                            }
                            questions.Add(question);
                        }

                        return questions;

                    }
                }

                return new List<EvaluationQuestion>();
            }
            catch (Exception e)
            {
                throw (e);
            }
        }

        public static List<EvaluationProject> GetAllEvaluationProjects()
        {
            try
            {
                string jSonResponse;
                jSonResponse = WebUtils.GetJson(string.Format(CoreUtils.GetAllEvaluationProjectsPath), "application/json");
                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });
                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus == "OK" && obj.ResponseObject.Count > 0)
                    {
                        var projects = new List<EvaluationProject>();
                        foreach (var p in obj.ResponseObject)
                        {
                            if (p.Status == 1)
                                projects.Add(new EvaluationProject(p.Id, p.Name, p.Description, p.Organization, p.ApiKey, p.Domain, p.CreationDate));
                        }

                        return projects;
                    }
                }

                return new List<EvaluationProject>();
            }
            catch (Exception e)
            {
                throw (e);
            }
        }

        public static List<EvaluationProject> GetEvaluationProjectsByUser(string username)
        {
            try
            {
                string jSonResponse;
                jSonResponse = WebUtils.PostJson(CoreUtils.GetEvaluationProjectsByUserPath, "{\"userName\":\"" + username + "\"}", "application/json");

                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });
                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus == "OK" && obj.ResponseObject.Count > 0)
                    {
                        var projects = new List<EvaluationProject>();

                        foreach (var p in obj.ResponseObject)
                        {
                            if (p.Status == 1)
                            {
                                projects.Add(new EvaluationProject(p.Id, p.Name, p.Description, p.Organization, p.ApiKey, p.Domain, p.CreationDate));
                            }
                        }

                        return projects;

                    }
                }

                return new List<EvaluationProject>();
            }
            catch (Exception e)
            {
                throw (e);
            }
        }

        public static bool DeleteProject(int projectId)
        {
            try
            {
                string jSonResponse;
                jSonResponse = WebUtils.DeleteJson(string.Format(CoreUtils.DeleteEvaluationProject, projectId), "", "application/json");
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

        public static bool DeleteEvaluationQuestionAnswer(int id)
        {
            try
            {
                string jSonResponse = WebUtils.DeleteJson(string.Format(CoreUtils.DeleteEvaluationQuestionAnswer, id), "", "application/json");
                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });
                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus == "OK")
                    {
                        return true;
                    }
                }

                return false;
            }
            catch (Exception e)
            {
                throw (e);
            }
        }

        public static bool DeleteEvaluationProject(int id)
        {
            try
            {
                string jSonResponse = WebUtils.DeleteJson(string.Format(CoreUtils.DeleteEvaluationQuestionAnswer, id), "", "application/json");
                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });
                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus == "OK")
                    {
                        return true;
                    }
                }

                return false;
            }
            catch (Exception e)
            {
                throw (e);
            }
        }

        public static bool DeleteEvaluationQuestionCategory(int Id)
        {
            try
            {
                string jSonResponse = WebUtils.DeleteJson(string.Format(CoreUtils.DeleteEvaluationQuestionCategory, Id), "", "application/json");
                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });
                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus == "OK")
                    {
                        return true;
                    }
                }

                return false;
            }
            catch (Exception e)
            {
                throw (e);
            }
        }

        public static bool DeleteEvaluationQuestion(int Id)
        {
            try
            {
                string jSonResponse = WebUtils.DeleteJson(string.Format(CoreUtils.DeleteEvaluationQuestion, Id), "", "application/json");
                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });
                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus == "OK")
                    {
                        return true;
                    }
                }

                return false;
            }
            catch (Exception e)
            {
                throw (e);
            }
        }

        #endregion

        #region EvaluationInternal - and not forget the body of the api methods within the config...

        public static InternalEvaluationAudit InsertEvaluationAudit(string token, string user, string status)
        {
            try
            {
                string jSonResponse = WebUtils.PostJson(string.Format(CoreUtils.InternalEvaluationAuditPath, token, user, status), "application/json");
                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });
                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus != null && obj.ResponseStatus == "OK")
                    {
                        return new InternalEvaluationAudit(obj.ResponseObject.Id,
                            obj.ResponseObject.ProjectToken, obj.ResponseObject.UserName,
                            obj.ResponseObject.CreationDate, obj.ResponseObject.Status, obj.ResponseObject.Meta);

                    }
                }

                return null;
            }
            catch (Exception e)
            {
                throw (e);
            }
        }

        public static List<InternalEvaluationAudit> GetInternalEvaluationAudits(string token, string user, string status)
        {
            try
            {
                string jSonResponse = WebUtils.GetJson(string.Format(CoreUtils.InternalEvaluationAuditPath, token, user, status, string.Empty), "application/json");
                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });
                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus != null && obj.ResponseStatus == "OK")
                    {
                        var audits = new List<InternalEvaluationAudit>();

                        foreach (var p in obj.ResponseObject)
                        {
                            InternalEvaluationAudit t = new InternalEvaluationAudit();
                            t.UserName = p.UserName;
                            t.ProjectToken = p.ProjectToken;
                            t.Meta = p.Meta;

                            audits.Add(t);

                        }

                        return audits;

                    }
                }

                return new List<InternalEvaluationAudit>();
            }
            catch (Exception e)
            {
                throw (e);
            }
        }

        public static string GetUserRoleEvaluationProject(string userName, int projectId)
        {
            try
            {

                string jSonResponse = WebUtils.GetJson(string.Format(CoreUtils.UserRoleEvaluationProjectPath, userName, projectId), "application/json");
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
                return string.Empty;
            }


        }


        public static string[] GetEvaluationHistory(string token, string user)
        {

            try
            {
                string jSonResponse = WebUtils.GetJson(string.Format(CoreUtils.GetEvaluationHistory, token, user), "application/json");
                if (jSonResponse.Length > 0)
                {
                    JObject jObject = JObject.Parse(jSonResponse);
                    string seri = JsonConvert.SerializeObject(jObject["ResponseObject"]);
                    string[] md5s = JsonConvert.DeserializeObject<string[]>(seri);
                    return md5s;
                }

                return new string[] { };
            }
            catch (Exception e)
            {
                throw (e);
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

                string jSonResponse = WebUtils.PostJson(CoreUtils.InviteUsersPathEvaluation, output, "application/json");
                return jSonResponse;

            }
            catch (Exception e)
            {
                throw (e);
            }
        }

        public static Invitation GetInvitationByCode(string code)
        {
            try
            {
                string jSonResponse = WebUtils.GetJson(string.Format(CoreUtils.InvitePathEvaluation, code), "application/json");
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
                jSonResponse = WebUtils.GetJson(string.Format(CoreUtils.UpdateProjectInviteConfirmationDateByCodePathEvaluation, code), "application/json");
                //TODO: validate response... 
            }
            catch (Exception e)
            {
                throw (e);
            }
        }

        #endregion
    }
}
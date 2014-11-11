using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using AcceptPortal.Models.Admin;
using AcceptPortal.Models.Evaluation;
using AcceptPortal.Utils;

namespace AcceptPortal.Remote.Miscellaneous
{
    public static class MiscellaneousRemoteMethods
    {
        #region universes

        public static Universe CreateUniverse(string universeName)
        {

            try
            {
                string jSonResponse;
                jSonResponse = WebUtils.PostJson(CoreUtils.CreateUniversePath, string.Format(CoreUtils.CreateUniverseJsonBody, universeName), "application/json");

                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });
                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus == "OK" && obj.ResponseObject.Count > 0)
                    {
                        Universe u = new Universe(obj.ResponseObject[0].Id, obj.ResponseObject[0].UniverseName, obj.ResponseObject[0].Status);
                        return u;
                    }
                }

                return null;

            }
            catch (Exception e)
            {
                throw (e);
            }
        }

        public static List<Universe> GetAllUniverses()
        {

            try
            {
                string jSonResponse;
                jSonResponse = WebUtils.GetJson(string.Format(CoreUtils.GetAllUniversesPath), "application/json");
                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });
                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus == "OK" && obj.ResponseObject.Count > 0)
                    {
                        List<Universe> universes = new List<Universe>();

                        foreach (var u in obj.ResponseObject)
                        {
                            universes.Add(new Universe(u.Id, u.UniverseName, u.Status));
                        }

                        return universes;

                    }
                }

                return new List<Universe>();
            }
            catch (Exception e)
            {
                throw (e);
            }
        }

        public static void GetUniverse(int universeId)
        {

            try
            {
                string jSonResponse;
                jSonResponse = WebUtils.GetJson(string.Format(CoreUtils.GetUniversetPath, universeId), "application/json");
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

        #endregion

        #region domains

        public static Domain CreateDomain(string domainName, int universeId)
        {

            try
            {
                string jSonResponse;
                jSonResponse = WebUtils.PostJson(CoreUtils.CreateDomainPath, string.Format(CoreUtils.CreateDomainJsonBody, domainName, universeId), "application/json");

                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });

                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus == "OK" && obj.ResponseObject.Count > 0)
                    {
                        return new Domain(obj.ResponseStatus.Id, obj.ResponseStatus.DomainUniverse.UniverseName, obj.ResponseStatus.DomainUniverse.Id, obj.ResponseStatus.DomainName, obj.ResponseStatus.Status);
                    }
                }

                return new Domain();
            }
            catch (Exception e)
            {
                throw (e);
            }
        }

        public static void AddUserToDomain(string userName, int domainId, string userRoleInDomain)
        {

            try
            {
                string jSonResponse;
                jSonResponse = WebUtils.PostJson(CoreUtils.AddUserDomainPath, string.Format(CoreUtils.AddUserDomainJsonBody, userName, domainId, userRoleInDomain), "application/json");

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

        public static List<Domain> GetAllDomains()
        {

            try
            {
                string jSonResponse;
                jSonResponse = WebUtils.GetJson(string.Format(CoreUtils.GetAllDomainsPath), "application/json");
                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });
                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus == "OK" && obj.ResponseObject.Count > 0)
                    {
                        List<Domain> domains = new List<Domain>();

                        foreach (var d in obj.ResponseObject)
                        {
                            domains.Add(new Domain(d.Id, d.DomainUniverse.UniverseName, d.DomainUniverse.Id, d.DomainName, d.Status));
                        }

                        return domains;

                    }
                }

                return new List<Domain>();
            }
            catch (Exception e)
            {
                throw (e);
            }
        }

        public static void GetDomain(int domainId)
        {

            try
            {
                string jSonResponse;
                jSonResponse = WebUtils.GetJson(string.Format(CoreUtils.GetDomainPath, domainId), "application/json");
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

        public static void GetDomainsByUniverse(int universeId)
        {
            try
            {
                string jSonResponse;
                jSonResponse = WebUtils.GetJson(string.Format(CoreUtils.GetDomainsByUniversePath, universeId), "application/json");
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

        #endregion

        #region others

        public static List<User> GetAllUsers()
        {
            try
            {
                string jSonResponse;
                jSonResponse = WebUtils.GetJson(string.Format(CoreUtils.GetAllUsersPath), "application/json");
                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });
                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus == "OK" && obj.ResponseObject.Count > 0)
                    {
                        List<User> universes = new List<User>();
                        foreach (var u in obj.ResponseObject)
                            universes.Add(new User(u.Id, u.UserName));

                        return universes;
                    }
                }

                return new List<User>();
            }
            catch (Exception e)
            {
                throw (e);
            }
        }

        public static List<EvaluationLanguage> GetAllLanguages()
        {
            try
            {
                string jSonResponse;
                jSonResponse = WebUtils.GetJson(string.Format(CoreUtils.GetAllLanguagesPath), "application/json");
                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });
                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus == "OK" && obj.ResponseObject.Count > 0)
                    {
                        var languages = new List<EvaluationLanguage>();
                        foreach (var d in obj.ResponseObject)
                            languages.Add(new EvaluationLanguage(d.Id, d.Name));

                        return languages;
                    }
                }

                return new List<EvaluationLanguage>();
            }
            catch (Exception e)
            {
                throw (e);
            }
        }

        #endregion

        #region user feedback

        public static string GetUserFeedbackJsonBody(string user, string email, string link, string message, string subject)
        {
            var jsonObject = new { user = user, email = email, link = link, message = message, subject = subject };
            try
            {
                JavaScriptSerializer serializer = new JavaScriptSerializer();
                return serializer.Serialize(jsonObject);
            }
            catch (Exception e)
            {
                throw (e);
            }
        }

        public static bool SendUserFeedback(string jsonBody)
        {
            try
            {
                string jSonResponse = WebUtils.PostJson(CoreUtils.UserFeedbackPath, jsonBody, "application/json");

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

        #endregion
    
    
    }
}
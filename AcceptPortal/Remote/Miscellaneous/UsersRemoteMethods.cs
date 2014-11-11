using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using AcceptPortal.Models.User;
using AcceptPortal.Utils;

namespace AcceptPortal.Remote.Miscellaneous
{
    public static class UsersRemoteMethods
    {

        public static List<UserApplication> GetUserApplications(string userName)
        {

            try
            {
                string jSonResponse;
                jSonResponse = WebUtils.GetJson(CoreUtils.AcceptGetUserApiKeysPath, string.Format(CoreUtils.AcceptGetUserApiKeysRequestBody, userName), "application/json");
                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });
                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus == "OK")
                    {
                        List<UserApplication> userApps = new List<UserApplication>();
                        foreach (var keyList in obj.KeyList)
                        {
                            if ((int)keyList.KeyStatus > 0)
                            {
                                UserApplication uapp = new UserApplication(keyList.Organization, keyList.ApplicationName, keyList.KeyDns, keyList.KeyIp, keyList.Description, keyList.KeyStatus, keyList.ApiKey);
                                userApps.Add(uapp);
                            }
                        }

                        return userApps;

                    }
                }

                return new List<UserApplication>();
            }
            catch (Exception e)
            {
                throw (e);
            }
        }

        public static UserApplication CreateApplication(string userName, string webSiteDns, string webSiteIp, string aplicationName, string organization, string description)
        {
            try
            {
                string jSonResponse;
                jSonResponse = WebUtils.PostJson(CoreUtils.AcceptUserApiKeyPath, string.Format(CoreUtils.AcceptCreateUserApiKeyRequestBody, userName, webSiteDns, webSiteIp, aplicationName, organization, description), "application/json");
                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });
                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus == "OK")
                        return new UserApplication(obj.KeyList[0].Organization, obj.KeyList[0].ApplicationName, obj.KeyList[0].KeyDns, obj.KeyList[0].KeyIp, obj.KeyList[0].Description, obj.KeyList[0].KeyStatus, obj.KeyList[0].ApiKey);

                }

                return null;
            }
            catch (Exception e)
            {
                throw (e);
            }
        }

        public static UserApplication GetApplication(string userName, string key)
        {

            try
            {
                string jSonResponse;
                jSonResponse = WebUtils.GetJson(CoreUtils.AcceptUserApiKeyPath, string.Format(CoreUtils.AcceptApiGetApiKeyBody, userName, key), "application/json");
                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });
                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus == "OK")
                        return new UserApplication(obj.KeyList[0].Organization, obj.KeyList[0].ApplicationName, obj.KeyList[0].KeyDns, obj.KeyList[0].KeyIp, obj.KeyList[0].Description, obj.KeyList[0].KeyStatus, obj.KeyList[0].ApiKey);
                }

                return null;
            }
            catch (Exception e)
            {
                throw (e);
            }
        }

        public static bool DeleteApplication(string userName, string key)
        {

            try
            {
                string jSonResponse;
                jSonResponse = WebUtils.DeleteJson(CoreUtils.AcceptUserApiKeyPath, string.Format(CoreUtils.AcceptApiGetApiKeyBody, userName, key), "application/json");
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

        public static UserApplication UpdateApplication(string userName, string apiKey, string webSiteDns, string webSiteIp, string aplicationName, string organization, string description)
        {

            try
            {
                string jSonResponse;
                jSonResponse = WebUtils.PutJson(CoreUtils.AcceptUserApiKeyPath, string.Format(CoreUtils.AcceptUpdateUserApiKeyRequestBody, userName, webSiteDns, webSiteIp, aplicationName, organization, description, apiKey), "application/json");
                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });
                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus == "OK")
                        return new UserApplication(obj.KeyList[0].Organization, obj.KeyList[0].ApplicationName, obj.KeyList[0].KeyDns, obj.KeyList[0].KeyIp, obj.KeyList[0].Description, obj.KeyList[0].KeyStatus, obj.KeyList[0].ApiKey);

                }

                return null;
            }
            catch (Exception e)
            {
                throw (e);
            }
        }

        public static string GetUserSecretKey(string userName)
        {
            try
            {
                string jSonResponse;
                jSonResponse = WebUtils.GetJson(CoreUtils.AcceptSecretUserKeyPath, "user=" + userName + "", "application/json");
                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });
                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus == "OK")
                        return obj.ResponseObject;
                }

                return string.Empty;
            }
            catch (Exception e)
            {
                throw (e);
            }
        }
    
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Security;
using AcceptPortal.Utils;

namespace AcceptPortal.Models.Security
{
    public class CustomAdminRoleProvider: RoleProvider
    {
        public override void AddUsersToRoles(string[] usernames, string[] roleNames)
        {
            foreach (string username in usernames)
            {
                try
                {
                    foreach (string rolename in roleNames)
                    {
                        var jsonObject = new { userName = username, roleName = rolename };

                        JavaScriptSerializer serializerTwo = new JavaScriptSerializer();
                        var output = serializerTwo.Serialize(jsonObject);

                        string jSonResponse;
                        jSonResponse = WebUtils.PostJson(CoreUtils.RolesPath, output, "application/json");

                        if (jSonResponse.Length > 0)
                        {
                            var serializer = new JavaScriptSerializer();
                            serializer.RegisterConverters(new[] { new DynamicJsonConverter() });
                            dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                            if (obj.ResponseStatus == "OK" && obj.ResponseObject.Count > 0)
                                continue;

                        }
                    }

                }
                catch (Exception e)
                {
                }
            }
           
        }

        public override string[] GetRolesForUser(string username)
        {
            try
            {
                string jSonResponse;
                jSonResponse = WebUtils.GetJson(CoreUtils.RolesPath, "userName=" + username + "", "application/json");

                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });
                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus == "OK" && obj.ResponseObject.Count > 0)
                    {
                        List<string> roles = new List<string>();
                        foreach (var role in obj.ResponseObject)                        
                            roles.Add(role.UniqueName);
                        
                        return roles.ToArray();
                    }
                    else
                        return new string[] { };
                }
                else
                {
                    return new string[] { };
                }

            }
            catch (Exception e)
            {
                return new string[] { };
            }            
        }

        public override bool IsUserInRole(string username, string roleName)
        {
            try
            {
                string jSonResponse;
                jSonResponse = WebUtils.GetJson(CoreUtils.RolesPath, "userName=" + username + "", "application/json");

                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });
                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus == "OK" && obj.ResponseObject.Count > 0)
                    {
                        List<string> roles = new List<string>();
                        foreach (var role in obj.ResponseObject)
                            if (role.UniqueName == roleName)
                                return true;
                    }
                    return false;
                }
                else
                {
                    return false;
                }
            }
            catch (Exception e)
            {
                return false;
            }
        }

        #region not implemented

        public override string ApplicationName
        {
            get
            {
                throw new NotImplementedException();
            }
            set
            {
                throw new NotImplementedException();
            }
        }

        public override void CreateRole(string roleName)
        {
            throw new NotImplementedException();
        }

        public override bool DeleteRole(string roleName, bool throwOnPopulatedRole)
        {
            throw new NotImplementedException();
        }

        public override string[] FindUsersInRole(string roleName, string usernameToMatch)
        {
            throw new NotImplementedException();
        }

        public override string[] GetAllRoles()
        {
            throw new NotImplementedException();
        }

        public override string[] GetUsersInRole(string roleName)
        {
            throw new NotImplementedException();
        }

        public override void RemoveUsersFromRoles(string[] usernames, string[] roleNames)
        {
            throw new NotImplementedException();
        }

        public override bool RoleExists(string roleName)
        {
            throw new NotImplementedException();
        }

        #endregion

















    }
}
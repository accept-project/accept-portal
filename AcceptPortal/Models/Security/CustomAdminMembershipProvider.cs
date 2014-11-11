using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Security;
using AcceptPortal.Utils;
using WebMatrix.WebData;


namespace AcceptPortal.Models.Security
{
    public class CustomAdminMembershipProvider : SimpleMembershipProvider
    {
        #region MVC4 authentication
        // TODO: will do a better way
        //private const string SELECT_ALL_USER_SCRIPT = "select * from [dbo].[User]private where UserName = '{0}'";
        //private readonly IEncrypting _encryptor;
        //private readonly SimpleSecurityContext _simpleSecurityContext;
        //public CustomAdminMembershipProvider(SimpleSecurityContext simpleSecurityContext)
        //    : this(new Encryptor(), new SimpleSecurityContext("DefaultDb")){}
        //public CustomAdminMembershipProvider(IEncrypting encryptor, SimpleSecurityContext simpleSecurityContext)
        //{
        //    _encryptor = encryptor;
        //    _simpleSecurityContext = simpleSecurityContext;
        //}
        #endregion

        #region MVC3 legacy

        public override MembershipUser CreateUser(string username, string password, string email, string passwordQuestion, string passwordAnswer, bool isApproved, object providerUserKey, out MembershipCreateStatus status)
        {
            try
            {
                CultureInfo currentCulture = Thread.CurrentThread.CurrentUICulture;
                string jSonResponse;
                jSonResponse = WebUtils.PostJson(CoreUtils.AcceptRegisterUserPath, string.Format(CoreUtils.AcceptPortalRegisterUserRequestBody, username, password, currentCulture.Name), "application/json");

                if (jSonResponse.Length > 0)
                {              
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });
                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus == "OK")
                    {
                        status = MembershipCreateStatus.Success;                       
                        return null;
                    }
                    else
                    {
                        status = MembershipCreateStatus.ProviderError;
                        return null;
                    }
                }
                else
                {
                    status = MembershipCreateStatus.ProviderError;
                    return null;
                }
            }
            catch
            {
                status = MembershipCreateStatus.ProviderError;
                return null;
            }            
        }

        public override bool ValidateUser(string username, string password)
        {
            if (string.IsNullOrEmpty(username))
            {
                throw new ArgumentException("Argument cannot be null or empty", "username");
            }

            if (string.IsNullOrEmpty(password))
            {
                throw new ArgumentException("Argument cannot be null or empty", "password");
            }

            try
            {
                string jSonResponse;
                jSonResponse = WebUtils.PostJson(CoreUtils.AcceptAuthenticateUserPath, string.Format(CoreUtils.AcceptPortalAuthenticateUserRequestBody, username, password), "application/json");

                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });
                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    return obj.ResponseStatus == "OK" ? true : false;                                         
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

            #region MVC4 authentication
            //throw new NotImplementedException();
            ////var hash = _encryptor.Encode(password);
            //using (_simpleSecurityContext)
            //{
            //var users =
            //_simpleSecurityContext.Users.SqlQuery(
            //string.Format(SELECT_ALL_USER_SCRIPT, username));
            //if (users == null && !users.Any())
            //{
            //return false;
            //}
            //return users.FirstOrDefault().Password == hash;
            //}
            #endregion
        
        }
    
        public static bool RecoverPassword(string userName)
        {
            try
            {
                string jSonResponse;
                jSonResponse = WebUtils.PostJson(CoreUtils.AcceptUserPasswordRecoveryPath, string.Format(CoreUtils.AcceptUserPasswordRecoveryPathBodyRequest, userName), "application/json");
                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });
                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus == "OK")
                        return true;
                    else
                        return false;
                }
                else
                    return false;

            }
            catch (Exception e)
            {
                throw (e);
            }

        }

        public static string ValidateRegistrationCode(string code)
        {
            try
            {
                string jSonResponse;
                jSonResponse = WebUtils.PostJson(CoreUtils.AcceptAuthenticateUserByEmailCodePath, string.Format(CoreUtils.AcceptAuthenticateUserByEmailCodeRequestBody, code), "application/json");
                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });
                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus == "OK")
                    {
                        return obj.UserName; ;
                    }
                    else
                        return string.Empty;
                }
                else
                {
                    return string.Empty;
                }
            }
            catch (Exception e)
            {
                throw (e);
            }

        }
        
        public static bool ChangeUserPassword(string username, string password)
        {
            try
            {
                string jSonResponse;

                jSonResponse = WebUtils.PostJson(CoreUtils.AcceptChangeUserPasswordPath, string.Format(CoreUtils.AcceptChangeUserPasswordPathJsonRequestBody, username, password), "application/json");

                if (jSonResponse.Length > 0)
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new[] { new DynamicJsonConverter() });

                    dynamic obj = serializer.Deserialize(jSonResponse, typeof(object));
                    if (obj.ResponseStatus == "OK")
                        return true;
                    else
                        return false;
                }
                else
                {
                    return false;
                }

            }
            catch (Exception e)
            {
                throw (e);
            }

        }

        #endregion



    }
}
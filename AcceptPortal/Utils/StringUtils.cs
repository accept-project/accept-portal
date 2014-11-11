using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text.RegularExpressions;
using System.Web.Mvc;

namespace AcceptPortal.Utils
{
    public class StringUtils
    {
        public static bool Validate32CharactersGuid(string input)
        {                
            Guid aux;
            bool result = Guid.TryParse(input, out aux);
            return result;
        }

        public static bool EmailValidator(string email)
        {
            string emailPattern = @"[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?";
            Match emailMatch = Regex.Match(email, emailPattern);
            return !string.IsNullOrEmpty(emailMatch.Value);
        }    
    }
}
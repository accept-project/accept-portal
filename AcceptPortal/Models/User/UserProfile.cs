using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AcceptPortal.Models.User
{
    public class UserAccountProfile
    {
        public string UserName { get; set; }
        public List<UserApplication> UserApplications { get; set; }       
        public string UserSecretKey { get; set; }

        public UserAccountProfile()
        {
            this.UserName = string.Empty;
            this.UserApplications = new List<UserApplication>();
            this.UserSecretKey = string.Empty;
        }

        
               
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AcceptPortal.Models.Admin
{
    public class User
    {
        public string UserName { get; set; }
        public int Id { get; set; }
        public User(int id, string userName) { this.Id = id; this.UserName = userName; }
    }
}
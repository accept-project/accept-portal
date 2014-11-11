using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AcceptPortal.Models.Admin
{
    public class ExternalUser: User
    {
        public ExternalUser(int id, string userName, string uniqueIdentifier)
        :base(id, userName)
        {
            this.UniqueIdentifier = uniqueIdentifier;
        }

        public string UniqueIdentifier { get; set; }
    }
}
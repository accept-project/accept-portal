using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AcceptPortal.Models.PosEdit
{
    public class Invitation
    {
        public int InvitationType { get; set; }
        public string UserName { get; set; }
        public int ProjectId { get; set; }
        public string ConfirmationCode { get; set; }

        public Invitation()
        {
            this.InvitationType = -1;
            this.UserName = string.Empty;
            this.ProjectId = -1;
            this.ConfirmationCode = string.Empty;             
        }        
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace AcceptPortal.Models.Admin
{
    public class Domain
    {      
        public Domain()
        { }

        public Domain(int id, string universe, int universeId, string domainName, int status)
        {
            ID = id;
            Universe = universe;
            UniverseID = universeId;
            DomainName = domainName;
            Status = status;
        }

        public  int ID { get; set; }
        public  string Universe { get; set; }
        public  int UniverseID { get; set; }
        [Required]
        [DataType(DataType.Text)]
        [Display(Name = "Domain Name")]
        public  string DomainName { get; set; }
        public  int Status { get; set; }              
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using AcceptPortal.Helpers;

namespace AcceptPortal.Models.User
{
    public class UserApplication
    {
        public UserApplication()
        {
            OrganizationName = string.Empty;
            ApplicationName = string.Empty;
            ApplicationDns = string.Empty;
            ApplicationIp = string.Empty;
            Status = -1;
            AccessToken = string.Empty;
            Description = string.Empty;
        }

        public UserApplication(string organizationName, string applicationName, string applicationDns, string applicationIp,string description, int status, string accessToken)
        {
            OrganizationName = organizationName;
            ApplicationName = applicationName;
            ApplicationDns = applicationDns;
            ApplicationIp = applicationIp;
            Description = description;
            Status = status;
            AccessToken = accessToken;
        }

        [Required]
        [StringLength(255, ErrorMessage = "The organization name cannot have more than {0} characters long.")]
        [DataType(DataType.Text)]
        [Display(Name = "Model_UserApplication_OrgName", ResourceType = typeof(Resources.Global))]     
        public string OrganizationName { get; set; }
       
        [Required]
        [StringLength(255, ErrorMessage = "The aplication name cannot have more than {0} characters long.")]
        [DataType(DataType.Text)]       
        [Display(Name = "Model_UserApplication_AppName", ResourceType = typeof(Resources.Global))]        
        public string ApplicationName { get; set; }

        [Required]
        [StringLength(255, ErrorMessage = "The description name cannot have more than {0} characters long.")]
        [DataType(DataType.Text)]        
        [Display(Name = "Model_UserApplication_Description", ResourceType = typeof(Resources.Global))]
        public string Description { get; set; }

        [Required]
        [StringLength(255, ErrorMessage = "The web site name cannot have more than {0} characters long.")]
        [DataType(DataType.Text)]        
        [Display(Name = "UserApplication_WebSiteLabel", ResourceType = typeof(Resources.Global))]
        public string ApplicationDns { get; set; }

        [Required]
        [StringLength(39, ErrorMessage = "The web site IP address cannot have more than {0} characters long.")]
        [DataType(DataType.Text)]       
        [Display(Name = "Model_UserApplication_IPAddress", ResourceType = typeof(Resources.Global))]
        public string ApplicationIp {get; set;}        
                
        public int Status { get; set; }
      
        [Display(Name = "Model_UserApplication_AppKey", ResourceType = typeof(Resources.Global))]
        public string AccessToken { get; set; }
    }
}
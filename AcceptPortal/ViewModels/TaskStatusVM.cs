using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AcceptPortal.ViewModels
{
    public class TaskStatusVM
    {
        public List<TaskStatus> UserTaskStatus {get;set;}
        public List<string> Users { get; set; }
        public List<string> Tasks { get; set; }

        public TaskStatusVM()
        {
            this.UserTaskStatus = new List<TaskStatus>();
            this.Users = new List<string>();
            this.Tasks = new List<string>();
        }

    }

    public class TaskStatus
    { 
         public string TextId { get; set; }
         public string UserId { get; set; }
         public int Status { get; set; }

         public TaskStatus(string textId, string userId, int status)
         {
                this.TextId = textId;
                this.UserId = userId;
                this.Status = status;
         }             
    }


}


 
           
         
             
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AcceptPortal.Models.Admin
{
    public class Universe
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Status { get; set; }
      
        public Universe(int id, string name, int status)
        {
            Id = id;
            Name = name;
            Status = status;
        }       
    }
}
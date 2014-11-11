using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AcceptPortal.Models.PosEdit
{
    public class Document
    {
        public Document() { }

        public Document(int Id, int projectId, string textId) { ID = Id; ProjectId = projectId; TextId = textId; }

        public int ID { get; set; }

        public int ProjectId { get; set; }       

        public string TextId { get; set; }          
    }
}
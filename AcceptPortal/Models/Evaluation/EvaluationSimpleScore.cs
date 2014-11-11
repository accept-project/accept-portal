using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace AcceptPortal.Models.Evaluation
{
    public class EvaluationSimpleScore
    {
        public EvaluationSimpleScore() { }

        public int ID { get; set; }
        public int ProjectID { get; set; }
        public string Domain { get; set; }
        public string Reviewer { get; set; }
        public int QuestionCategoryId { get; set; }
        public string QuestionCategory { get; set; }
        public int QuestionId { get; set; }
        public string Question { get; set; }
        public int AnswerId { get; set; }
        public string AnswerValue { get; set; }
        public string Answer { get; set; }
        public string Language { get; set; }
        public DateTime TimeStamp { get; set; }
        public string Var1 { get; set; }
        public string Var2 { get; set; }
        public string Var3 { get; set; }
        public string Var4 { get; set; }
        public string Var5 { get; set; }
        public string Var6 { get; set; }
        public string Var7 { get; set; }
        public string Var8 { get; set; }
        public string Var9 { get; set; }
        public string Var10 { get; set; }
    
    }
}
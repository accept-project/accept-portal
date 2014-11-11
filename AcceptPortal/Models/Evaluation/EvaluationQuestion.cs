using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace AcceptPortal.Models.Evaluation
{
    public class EvaluationQuestion
    {
        public EvaluationQuestion()
        {
        }

        public EvaluationQuestion(int id, string _name, int _count)
        {
            ID = id;
            Name = _name;
            Count = _count;
            LanguageQuestions = new List<EvaluationQuestionItem>();
        }

        public int ID { get; set; }
        public int Count { get; set; }
        public string Name { get; set; }
        public IList<EvaluationQuestionItem> LanguageQuestions { get; set; }
    }

    public class EvaluationQuestionItem
    {

        public EvaluationQuestionItem()
        {
        }

        public EvaluationQuestionItem(int id, string _question, string _action, string _confirmation, EvaluationLanguage _language, int _count)
        {
            ID = id;
            Count = _count;
            Language = _language;
            Question = _question;
            Action = _action;
            Confirmation = _confirmation;
            Answers = new List<EvaluationQuestionItemAnswer>();
        }

        public int ID { get; set; }
        public int Count { get; set; }
        public string Question { get; set; }
        public string Action { get; set; }
        public string Confirmation { get; set; }
        public IList<EvaluationQuestionItemAnswer> Answers { get; set; }
        public EvaluationLanguage Language { get; set; }    
    }


    public class EvaluationQuestionItemAnswer
    {
        public EvaluationQuestionItemAnswer()
        {
        }

        public EvaluationQuestionItemAnswer(int id, string value, string name, int _count)
        {
            ID = id;
            Name = name;
            Value = value;
            Count = _count;
        }

        public int ID { get; set; }
        public int Count { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }
    }
}
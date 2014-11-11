namespace AcceptPortal.Models.Evaluation
{
    public class EvaluationDocument
    {
        public EvaluationDocument() { }

        public EvaluationDocument(int id, string name)
        {
            ID = id;
            Name = name;
        }

        public  int ID { get; set; }
        public string Name { get; set; }

        public EvaluationProvider Provider { get; set; }
        public EvaluationLanguagePair LanguagePair { get; set; }

    }
}
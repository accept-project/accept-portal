namespace AcceptPortal.Models.Evaluation
{
    public class EvaluationLanguagePair
    {

        public EvaluationLanguagePair() { }

        public EvaluationLanguagePair(int id, string name)
        {
            ID = id;
            Name = name;
        }

        public  int ID { get; set; }
        public string Name { get; set; }
    }
}
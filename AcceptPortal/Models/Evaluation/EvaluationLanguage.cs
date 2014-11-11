namespace AcceptPortal.Models.Evaluation
{
    public class EvaluationLanguage
    {

        public EvaluationLanguage() { }

        public EvaluationLanguage(int id, string name)
        {
            ID = id;
            Name = name;
        }

        public  int ID { get; set; }
        public string Name { get; set; }
    }
}
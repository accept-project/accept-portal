namespace AcceptPortal.Models.Evaluation
{
    public class EvaluationProvider
    {

        public EvaluationProvider() { }

        public EvaluationProvider(int id, string name)
        {
            ID = id;
            Name = name;
        }

        public  int ID { get; set; }
        public string Name { get; set; }
    }
}
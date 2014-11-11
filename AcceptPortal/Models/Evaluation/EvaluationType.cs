using System.ComponentModel;

namespace AcceptPortal.Models.Evaluation
{
    public enum EvaluationType
    {
        [Description("Embedded Evaluation")]
        Embedded = 1,

        [Description("External Evaluation")]
        External = 2
    }
}
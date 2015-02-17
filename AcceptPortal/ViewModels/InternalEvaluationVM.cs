using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AcceptPortal.Models.Admin;
using AcceptPortal.Models.Evaluation;
using AcceptPortal.Models.PosEdit;

namespace AcceptPortal.ViewModels
{
    #region Evaluation
    public class InternalEvaluationVM
    {
        public EvaluationProject EvaluationProject { get; set; }
        public Project PostEditProjectInEvaluation { get; set; }
        public TaskStatusVM ProjectTaskStatus { get; set; }
        public List<InternalEvaluationAudit> InternalAudits { get; set; }

        public string GetLabelFromAudit(string user, string task)
        {
            if (this.InternalAudits != null && this.InternalAudits.Count > 0)
            {

                foreach (InternalEvaluationAudit audit in InternalAudits)
                {
                    string[] help = audit.Meta.Split(';');
                    if (help != null && help.Length > 1)
                        if (help[0] == task && help[1] == user)
                            return AcceptPortal.Resources.Global.EvaluationTileCompletedLabel;
                }

            }

            return AcceptPortal.Resources.Global.EvaluationTileLabel;
        }

        public InternalEvaluationVM()
        {
            this.EvaluationProject = new EvaluationProject();
            this.PostEditProjectInEvaluation = new Project();
            this.ProjectTaskStatus = new TaskStatusVM();
        }

        public InternalEvaluationVM(EvaluationProject evaluationProject, Project postEditProject, TaskStatusVM taskStatusVm)
        {
            this.EvaluationProject = evaluationProject;
            this.PostEditProjectInEvaluation = postEditProject;
            this.ProjectTaskStatus = taskStatusVm;
        }

    }
    #endregion
}
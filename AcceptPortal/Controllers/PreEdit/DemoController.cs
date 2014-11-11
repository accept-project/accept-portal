using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AcceptPortal.Filters;
using AcceptPortal.Models.Audit;
using AcceptPortal.Utils;

namespace AcceptPortal.Controllers.PreEdit
{

    [Authorize]
    [Localization]
    public class DemoController : Controller
    {
        public ActionResult Index()
        {
            return View("All");
        }
    
        // GET: /Demo/
        [AuditFilter(AuditAction = AuditFilter.READ, AuditType = AuditFilter.TYPEDEFAULT, AuditDescription = AuditDescriptor.PREEDIT_ALL_DEMO_PAGE_REQUESTED)]
        public ActionResult All()
        {
            return View();
        }

        [AuditFilter(AuditAction = AuditFilter.READ, AuditType = AuditFilter.TYPEDEFAULT, AuditDescription = AuditDescriptor.PREEDIT_ENGLISH_DEMO_PAGE_REQUESTED)]
        public ActionResult English()
        {
            ViewBag.AcceptApiUrl = CoreUtils.AcceptPortalApiPath;           
            ViewBag.PreEditApiKey = CoreUtils.PreEditEnglishDemoPreEditApiKey;
            ViewBag.PreEditEnglishDemoDefaultRuleSet = CoreUtils.PreEditEnglishDemoPreEditDefaultRuleSet;
            return View();
        }

        [AuditFilter(AuditAction = AuditFilter.READ, AuditType = AuditFilter.TYPEDEFAULT, AuditDescription = AuditDescriptor.PREEDIT_FRENCH_DEMO_PAGE_REQUESTED)]
        public ActionResult French()
        {
            ViewBag.AcceptApiUrl = CoreUtils.AcceptPortalApiPath;
            ViewBag.PreEditApiKey = CoreUtils.PreEditFrenchDemoPreEditApiKey;
            ViewBag.PreEditFrenchDemoDefaultRuleSet = CoreUtils.PreEditFrenchDemoPreEditDefaultRuleSet;
            ViewBag.PreEditFrenchDemoDefaultCheckingLevelsRuleSets = CoreUtils.PreEditFrenchDemoPreEditCheckingLevelsDefaultRuleSets.Split(',').ToArray();
            return View();
        }
                
        [AuditFilter(AuditAction = AuditFilter.READ, AuditType = AuditFilter.TYPEDEFAULT, AuditDescription = AuditDescriptor.PREEDIT_GERMAN_DEMO_PAGE_REQUESTED)]
        public ActionResult German()
        {
            ViewBag.AcceptApiUrl = CoreUtils.AcceptPortalApiPath;
            ViewBag.PreEditApiKey = CoreUtils.PreEditGermanDemoPreEditApiKey;
            ViewBag.PreEditGermanDemoDefaultRuleSet = CoreUtils.PreEditGermanDemoPreEditDefaultRuleSet;   
            return View();
        }

    }
}

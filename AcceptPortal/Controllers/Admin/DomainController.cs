using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AcceptPortal.Models.Admin;
using AcceptPortal.Filters;
using AcceptPortal.Remote.Miscellaneous;

namespace AcceptPortal.Controllers.Admin
{
    [RequireHttps]
    [Localization]
    [AuditFilter(AuditAction=AuditFilter.READ, AuditType=AuditFilter.TYPEDEFAULT, AuditDescription=AuditFilter.AUDIT_DEFAULT_DESCRIPTION)]
    public class DomainController : Controller
    {
        //
        // GET: /Domain/
        [AuditFilter(AuditAction = AuditFilter.READ, AuditType = AuditFilter.TYPEDEFAULT, AuditDescription = AuditFilter.AUDIT_DEFAULT_DESCRIPTION)]
        public ActionResult Index()
        {
            List<Domain> domains = MiscellaneousRemoteMethods.GetAllDomains(); 

            return View(domains);
        }

        //
        // GET: /Domain/Details/5

        public ActionResult Details(int id)
        {
            return View();
        }

        //
        // GET: /Domain/Create

        public ActionResult Create()
        {
            return View();
        } 

        //
        // POST: /Domain/Create

        [HttpPost]
        public ActionResult Create(FormCollection collection)
        {
            try
            {
                // TODO: Add insert logic here

                Domain domain = MiscellaneousRemoteMethods.CreateDomain(collection["DomainName"], int.Parse(collection["UniverseID"]));


                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }
        
        //
        // GET: /Domain/Edit/5
 
        public ActionResult Edit(int id)
        {
            return View();
        }

        //
        // POST: /Domain/Edit/5

        [HttpPost]
        public ActionResult Edit(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add update logic here
 
                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        //
        // GET: /Domain/Delete/5
 
        public ActionResult Delete(int id)
        {
            return View();
        }

        //
        // POST: /Domain/Delete/5

        [HttpPost]
        public ActionResult Delete(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here
 
                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }
    }
}

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
    [Authorize]
    public class UniverseController : Controller
    {
        //
        // GET: /Universe/
        [AuditFilter(AuditAction = AuditFilter.READ, AuditType = AuditFilter.TYPEDEFAULT, AuditDescription = AuditFilter.AUDIT_DEFAULT_DESCRIPTION)]
        public ActionResult Index()
        {
            List<Universe> universes = MiscellaneousRemoteMethods.GetAllUniverses();


            return View(universes);
        }

        //
        // GET: /Universe/Details/5

        public ActionResult Details(int id)
        {
            return View();
        }

        //
        // GET: /Universe/Create

        public ActionResult Create()
        {
            return View();
        } 

        //
        // POST: /Universe/Create

        [HttpPost]
        public ActionResult Create(FormCollection collection)
        {
            try
            {
                // TODO: Add insert logic here
                Universe universe = MiscellaneousRemoteMethods.CreateUniverse(collection["Name"]);
              
                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }
        
        //
        // GET: /Universe/Edit/5
 
        public ActionResult Edit(int id)
        {
            return View();
        }

        //
        // POST: /Universe/Edit/5

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
        // GET: /Universe/Delete/5
 
        public ActionResult Delete(int id)
        {
            return View();
        }

        //
        // POST: /Universe/Delete/5

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

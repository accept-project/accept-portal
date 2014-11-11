using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AcceptPortal.Models.Download;
using System.IO;
using AcceptPortal.Filters;
using AcceptPortal.Models.Audit;

namespace AcceptPortal.Controllers
{
    [AcceptRequireHttps]   
    [Localization]
    [Authorize]    
    public class DownloadController : Controller
    {        
        // GET: /Download/
        [AuditFilter(AuditAction = AuditFilter.READ, AuditType = AuditFilter.TYPEDEFAULT, AuditDescription = AuditFilter.AUDIT_DEFAULT_DESCRIPTION)]
        public ActionResult Index()
        {
            return View();
        }
        
        [AuditFilter(AuditAction = AuditFilter.CREATE, AuditType = AuditFilter.TYPEDEFAULT, AuditDescription = AuditDescriptor.PREEDIT_PLUGIN_DOWNLOADED)]
        public FileDownloadResult DownloadFile(string file)
        {
            try
            {
                var fileData = file.GetFileData(Server.MapPath("~/Content/Files"));
                return new FileDownloadResult(file, fileData);
            }
            catch (FileNotFoundException)
            {
                throw new HttpException(404, string.Format("The file {0} was not found.", file));
            }
            finally
            { 
            
            }
        }
    }
}

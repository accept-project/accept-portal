using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace AcceptPortal
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
               "Login", 
               "Account/{action}", 
               new { controller = "Account", action = "Login" } 
           );

            routes.MapRoute(
               "Localization", 
               "{lang}/{controller}/{action}/{id}", 
               new { lang = "en-US", controller = "Home", action = "About", id = UrlParameter.Optional } 
           );

            routes.MapRoute(
                "AddDataFile",
                "{lang}/{controller}/{action}/{id}/{provider}/{langpair}",
               new { lang = "en-US", controller = "Evaluation", action = "AddDataFile", id = "", provider = "", langpair = "" },
               new { id = @"\d+", provider = @"[0-9]", langpair = @"[0-9]" } 
            );

            routes.MapRoute(
                "Default", 
                "{controller}/{action}/{id}", 
                new { lang = "en-US", controller = "Home", action = "About", id = UrlParameter.Optional } 
            );
        }
    }
}
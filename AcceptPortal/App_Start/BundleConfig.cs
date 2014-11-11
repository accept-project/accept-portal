using System.Web;
using System.Web.Optimization;

namespace AcceptPortal
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryui").Include(
                        "~/Scripts/jquery-ui-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.unobtrusive*",
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));
           
            bundles.Add(new StyleBundle("~/Content/css").Include("~/Content/portal.css", "~/Content/login.css"));

            bundles.Add(new StyleBundle("~/Content/Themes/base/css").Include(
                        "~/Content/Themes/base/jquery.ui.core.css",
                        "~/Content/Themes/base/jquery.ui.resizable.css",
                        "~/Content/Themes/base/jquery.ui.selectable.css",
                        "~/Content/Themes/base/jquery.ui.accordion.css",
                        "~/Content/Themes/base/jquery.ui.autocomplete.css",
                        "~/Content/Themes/base/jquery.ui.button.css",
                        "~/Content/Themes/base/jquery.ui.dialog.css",
                        "~/Content/Themes/base/jquery.ui.slider.css",
                        "~/Content/Themes/base/jquery.ui.tabs.css",
                        "~/Content/Themes/base/jquery.ui.datepicker.css",
                        "~/Content/Themes/base/jquery.ui.progressbar.css",
                        "~/Content/Themes/base/jquery.ui.theme.css"));
            
            #region bootstrap v2.2.2
            bundles.Add(new StyleBundle("~/bundles/bootstrap/css").Include("~/Scripts/bootstrap/css/bootstrap.css", "~/Scripts/bootstrap/css/bootstrap-responsive.css"));
            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap/js/bootstrap.js"));
            #endregion

            #region bootstrap v2.3.2            
            bundles.Add(new StyleBundle("~/bundles/bootstrap-2.3.2/css").Include("~/Scripts/bootstrap-2.3.2/css/bootstrap.css"));
            bundles.Add(new ScriptBundle("~/bundles/bootstrap-2.3.2").Include(
                      "~/Scripts/bootstrap-2.3.2/js/bootstrap.js"));
            #endregion
        
            #region global
            bundles.Add(new ScriptBundle("~/bundles/global").Include(
                   "~/Scripts/global/global.js"));
            #endregion

            #region not in use

            #region miscellaneous
            bundles.Add(new ScriptBundle("~/bundles/miscellaneous").Include(                  
                  "~/Scripts/tiny_mce_4.0.26/tinymce.min.js",
                  "~/Scripts/feedback/jquery.contactable.js",
                  "~/Scripts/datatables/jquery.dataTables.js",
                  "~/Scripts/datatables/jquery.dataTablesPaging.js",
                  "~/Scripts/datatables/jquery.dataTablesFilteringDelay.js",
                  "~/Scripts/jqdialogextend/jquery.dialogextend.1_0_1.js"
                  ));
    
            bundles.Add(new StyleBundle("~/Content/miscellaneous").Include("~/Content/Themes/smooth/jquery-ui.css",
                "~/Scripts/feedback/contactable.css", "~/Content/Datatables/css/datatables-bootstrap.css"));
            #endregion

            #region post-edit client dependencies
            bundles.Add(new ScriptBundle("~/bundles/post-edit-client").Include(
                "~/Scripts/tiny_mce_4.0.26/jquery.tinymce.min.js",
                "~/Scripts/postEdit/v2.0/accept-postedit-jquery-plugin-2.0.js",
                "~/Scripts/underscore/underscore-min.js",
                "~/Scripts/preEditRealTime/accept-realtime-jquery-plugin-1.0.js",
                "~/Scripts/global/post-edit/project-detail.js"));
            bundles.Add(new StyleBundle("~/Content/post-edit-client").Include("~/Content/PostEdit/v2.0/post-edit.css",
              "~/Scripts/preEditRealTime/acceptRealTime.css"));
            #endregion

            #region pre-edit client dependencies
            bundles.Add(new ScriptBundle("~/bundles/pre-edit-client").Include(
                "~/Scripts/flip/jquery.flip.min.js",
                "~/Scripts/underscore/underscore-min.js",
                "~/Scripts/tiny_mce_4.0.26/jquery.tinymce.min.js",
                "~/Scripts/preEdit/v3.0/accept-jquery-plugin-3.0.js"));

            bundles.Add(new StyleBundle("~/Content/pre-edit-client").Include("~/Content/PreEdit/v3.0/accept.css"));
            #endregion

            #endregion

        }
    }
}
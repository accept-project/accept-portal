using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net;
using System.Text;
using System.IO;

namespace AcceptPortal.Utils
{
    public static class WebUtils
    {
      
        public static bool AcceptAllCertifications(object sender, System.Security.Cryptography.X509Certificates.X509Certificate certification, System.Security.Cryptography.X509Certificates.X509Chain chain, System.Net.Security.SslPolicyErrors sslPolicyErrors)
        {
            return true;
        }

        /// <summary>
        /// Post JSON
        /// </summary>
        /// <param name="url">URL endpoint</param>
        /// <param name="parameters">Parameters</param>
        /// <returns>JSON string</returns>
        public static string PostJson(string url, string parameters,string contentType)
        {
            string _json = "";
            byte[] bytes = Encoding.UTF8.GetBytes(parameters);
            var request = (HttpWebRequest)WebRequest.Create(url);
            request.ContentLength = bytes.Length;
            request.ContentType = contentType;
            request.Method = "POST";
            request.Accept = "*/*";           
            ServicePointManager.ServerCertificateValidationCallback = new System.Net.Security.RemoteCertificateValidationCallback(AcceptAllCertifications);

            try
            {
                using (Stream requestStream = request.GetRequestStream())
                {
                    requestStream.Write(bytes, 0, bytes.Length);
                }

                using (var response = request.GetResponse() as HttpWebResponse)
                {
                    if (response != null)
                    {
                        var reader = new StreamReader(response.GetResponseStream());
                        _json = reader.ReadToEnd();
                        response.Close();
                    }
                    else
                    {
                        //TODO:
                    }
                }
            }
            catch (WebException e)
            {
                throw (e);
            }
            catch (Exception exception)
            {
                throw (exception);
            }
            return _json;
        }

        /// <summary>
        /// GET JSON
        /// </summary>
        /// <param name="url">URL endpoint</param>
        /// <param name="parameters">Parameters</param>
        /// <returns>JSON string</returns>
        public static string GetJson(string url, string parameters, string contentType)
        {
            string _json = "";
            string full_url = url + "?" + parameters;           
            ServicePointManager.ServerCertificateValidationCallback = new System.Net.Security.RemoteCertificateValidationCallback(AcceptAllCertifications);

            try
            {
                var request = (HttpWebRequest)WebRequest.Create(full_url);
                request.ContentType = contentType;

                using (var response = request.GetResponse() as HttpWebResponse)
                {
                    if (response != null)
                    {
                        var reader = new StreamReader(response.GetResponseStream());
                        _json = reader.ReadToEnd();
                        response.Close();
                    }
                    else
                    {
                        //TODO:
                    }
                }

            }
            catch (WebException e)
            {
                throw (e);
            }
            catch (Exception exception)
            {
                throw (exception);
            }

            return _json;
        }

        /// <summary>
        /// GET JSON
        /// </summary>
        /// <param name="url">URL endpoint</param>
        /// <param name="parameters">Parameters</param>
        /// <returns>JSON string</returns>
        public static string GetJson(string url, string contentType)
        {
            string _json = "";
            ServicePointManager.ServerCertificateValidationCallback = new System.Net.Security.RemoteCertificateValidationCallback(AcceptAllCertifications);

            try
            {
                var request = (HttpWebRequest)WebRequest.Create(url);
                request.ContentType = contentType;

                using (var response = request.GetResponse() as HttpWebResponse)
                {
                    if (response != null)
                    {
                        var reader = new StreamReader(response.GetResponseStream());
                        _json = reader.ReadToEnd();
                        response.Close();
                    }
                    else
                    {
                        //TODO:
                    }
                }

            }
            catch (WebException e)
            {
                throw (e);

            }
            catch (Exception exception)
            {
                throw (exception);
            }

            return _json;
        }

        /// <summary>
        /// Post JSON
        /// </summary>
        /// <param name="url">URL endpoint</param>
        /// <param name="parameters">Parameters</param>
        /// <returns>JSON string</returns>
        public static string DeleteJson(string url, string parameters, string contentType)
        {
            string _json = "";
            string full_url = parameters.Length > 0 ? full_url = url + "?" + parameters : full_url = url;
            ServicePointManager.ServerCertificateValidationCallback = new System.Net.Security.RemoteCertificateValidationCallback(AcceptAllCertifications);
        
            try
            {
                var request = (HttpWebRequest)WebRequest.Create(full_url);
                request.ContentType = contentType;
                request.Method = "DELETE";

                using (var response = request.GetResponse() as HttpWebResponse)
                {
                    if (response != null)
                    {
                        var reader = new StreamReader(response.GetResponseStream());
                        _json = reader.ReadToEnd();
                        response.Close();
                    }
                    else
                    {
                       //TODO:
                    }
                }

            }
            catch (WebException e)
            {
                throw (e);
            }
            catch (Exception exception)
            {
                throw (exception);
            }

            return _json;
        }

        /// <summary>
        /// Put JSON
        /// </summary>
        /// <param name="url">URL endpoint</param>
        /// <param name="parameters">Parameters</param>
        /// <param name="contentType">Http header content-type</param>
        /// <returns>JSON string</returns>
        public static string PutJson(string url, string parameters, string contentType)
        {
            string _json = "";
            byte[] bytes = Encoding.UTF8.GetBytes(parameters);
            var request = (HttpWebRequest)WebRequest.Create(url);

            request.ContentLength = bytes.Length;
            request.ContentType = contentType;
            request.Method = "PUT";
            request.Accept = "*/*";            
            ServicePointManager.ServerCertificateValidationCallback = new System.Net.Security.RemoteCertificateValidationCallback(AcceptAllCertifications);

            try
            {
                using (Stream requestStream = request.GetRequestStream())
                {
                    requestStream.Write(bytes, 0, bytes.Length);
                }

                using (var response = request.GetResponse() as HttpWebResponse)
                {
                    if (response != null)
                    {
                        var reader = new StreamReader(response.GetResponseStream());
                        _json = reader.ReadToEnd();
                        response.Close();
                    }
                    else
                    {
                        //TODO:
                    }
                }
            }
            catch (WebException e)
            {
                throw (e);
            }
            catch (Exception exception)
            {
               throw(exception);
            }
            return _json;
        }

    }
}
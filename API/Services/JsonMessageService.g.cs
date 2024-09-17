using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Newtonsoft.Json.Converters;
using Microsoft.AspNetCore.Mvc;
using System;

namespace Sept2417.Services
{
    /// <summary>
    /// The jsonmessageserviceService responsible for managing jsonmessageservice related operations.
    /// </summary>
    /// <remarks>
    /// This service for adding, retrieving, updating, and deleting jsonmessageservice information.
    /// </remarks>
    public interface IJsonMessageService
    {
        /// <summary>
        /// It will return Json metadata 
        /// </summary>
        /// <param name="result">result of response </param>
        /// <returns>List object</returns>
        JsonResult IgnoreNullableObject(object result);
    }

    /// <summary>
    /// The jsonmessageserviceService responsible for managing jsonmessageservice related operations.
    /// </summary>
    /// <remarks>
    /// This service for adding, retrieving, updating, and deleting jsonmessageservice information.
    /// </remarks>
    public class JsonMessageService : IJsonMessageService
    {
        JsonResult IJsonMessageService.IgnoreNullableObject(object result)
        {
            var settings = new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, ContractResolver = new CamelCasePropertyNamesContractResolver() };
            settings.Converters.Add(new StringEnumConverter { NamingStrategy = new DefaultNamingStrategy() });
            var jsonResult = new JsonResult(result, settings) { ContentType = "application/json" };
            return jsonResult;
        }
    }
}
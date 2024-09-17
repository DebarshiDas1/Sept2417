using System.Dynamic;
using System.Reflection;
using System;

namespace Sept2417.Services
{
    /// <summary>
    /// The fieldmapperserviceService responsible for managing fieldmapperservice related operations.
    /// </summary>
    /// <remarks>
    /// This service for adding, retrieving, updating, and deleting fieldmapperservice information.
    /// </remarks>
    public interface IFieldMapperService
    {
        /// <summary>
        /// It will mapp field with result object 
        /// </summary>
        /// <param name="source">source of response </param>
        /// <param name="fields">fields of user inputs </param>
        /// <returns>object of result</returns>
        dynamic MapToFields(object source, string fields);
    }

    /// <summary>
    /// The fieldmapperserviceService responsible for managing fieldmapperservice related operations.
    /// </summary>
    /// <remarks>
    /// This service for adding, retrieving, updating, and deleting fieldmapperservice information.
    /// </remarks>
    public class FieldMapperService : IFieldMapperService
    {
        dynamic IFieldMapperService.MapToFields(object source, string fields)
        {
            if (source == null)
            {
                return source;
            }

            if (string.IsNullOrEmpty(fields))
                return source;
            var fieldList = fields.Split(',').Select(f => f.Trim()).ToList();
            var result = new ExpandoObject() as IDictionary<string, object>;
            MapFields(source, fieldList, result);
            return result;
        }

        private static void MapFields(object source, List<string> fields, IDictionary<string, object> result)
        {
            foreach (var field in fields)
            {
                var parts = field.Split(".");
                var propertyName = parts[0];
                var property = source.GetType().GetProperties(BindingFlags.Public | BindingFlags.Instance).FirstOrDefault(p => p.Name.Equals(propertyName.ToLower(), StringComparison.OrdinalIgnoreCase));
                if (property == null)
                {
                    continue;
                }

                var value = property.GetValue(source);
                if (parts.Length == 1)
                {
                    result[propertyName] = value;
                }
                else if (value != null)
                {
                    var nestedFields = fields.Where(f => f.StartsWith(propertyName + ".")).Select(f => f.Substring(propertyName.Length + 1)).ToList();
                    var nestedResult = new ExpandoObject() as IDictionary<string, object>;
                    MapFields(value, nestedFields, nestedResult);
                     result[propertyName] = nestedResult;
                }
            }
        }
    }
}
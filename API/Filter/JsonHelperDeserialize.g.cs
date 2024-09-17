using System;
using System.Text.Json;

namespace Sept2417.Filter
{
    /// <summary>
    /// Helper class for JSON serialization and deserialization.
    /// </summary>
    public static class JsonHelper
    {
        /// <summary>
        /// Deserializes a JSON string into an object of the specified type.
        /// </summary>
        /// <typeparam name = "T">The type of object to deserialize.</typeparam>
        /// <param name = "json">The JSON string to deserialize.</param>
        /// <returns>The deserialized object.</returns>
        public static T Deserialize<T>(string json)
        {
            return JsonSerializer.Deserialize<T>(json);
        }
    }
}
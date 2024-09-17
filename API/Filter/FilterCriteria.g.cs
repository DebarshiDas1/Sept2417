using System;

namespace Sept2417.Filter
{
    /// <summary>
    /// Represents a filter criteria for dynamic filtering.
    /// </summary>
    public class FilterCriteria
    {
        /// <summary>
        /// Gets or sets the name of the property on which filtering will be applied.
        /// </summary>
        public string PropertyName { get; set; }
        /// <summary>
        /// Gets or sets the operator to be used for comparison.
        /// </summary>
        public string Operator { get; set; }
        /// <summary>
        /// Gets or sets the value to compare against.
        /// </summary>
        public string Value { get; set; }
    }
}
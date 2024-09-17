namespace Sept2417.Models
{
    /// <summary>
    /// Field class for layout 
    /// </summary>
    public class Field
    {
        /// <summary>
        /// AutoClose of the Field 
        /// </summary>
        public bool? AutoClose { get; set; }
        /// <summary>
        /// ClearButton of the Field 
        /// </summary>
        public bool? ClearButton { get; set; }
        /// <summary>
        /// Column of the Field 
        /// </summary>
        public int Column { get; set; }
        /// <summary>
        /// DataSource of the Field 
        /// </summary>
        public List<object>? DataSource { get; set; }
        /// <summary>
        /// DataType of the Field 
        /// </summary>
        public string DataType { get; set; }
        /// <summary>
        /// EntityName of the Field 
        /// </summary>
        public string EntityName { get; set; }
        /// <summary>
        /// FieldName of the Field 
        /// </summary>
        public string? FieldName { get; set; }
        /// <summary>
        /// DefaultValue of the Field 
        /// </summary>
        public object? DefaultValue { get; set; }
        /// <summary>
        /// Hint of the Field 
        /// </summary>
        public string? Hint { get; set; }
        /// <summary>
        /// Filterable of the Field 
        /// </summary>
        public bool? Filterable { get; set; }
        /// <summary>
        /// Format of the Field 
        /// </summary>
        public string? Format { get; set; }
        /// <summary>
        /// Icon of the Field 
        /// </summary>
        public string? Icon { get; set; }
        /// <summary>
        /// IsMultiSelectCheckbox of the Field 
        /// </summary>
        public bool? IsMultiSelectCheckbox { get; set; }
        /// <summary>
        /// IsSpinnersRequired of the Field 
        /// </summary>
        public bool? IsSpinnersRequired { get; set; }
        /// <summary>
        /// IsValuePrimitive of the Field 
        /// </summary>
        public bool? IsValuePrimitive { get; set; }
        /// <summary>
        /// Label of the Field 
        /// </summary>
        public string? Label { get; set; }
        /// <summary>
        /// Length of the Field 
        /// </summary>
        public int? Length { get; set; }
        /// <summary>
        /// Max of the Field 
        /// </summary>
        public double? Max { get; set; }
        /// <summary>
        /// MaxDate of the Field 
        /// </summary>
        public DateTime? MaxDate { get; set; }
        /// <summary>
        /// Maxlength of the Field 
        /// </summary>
        public int? Maxlength { get; set; }
        /// <summary>
        /// Min of the Field 
        /// </summary>
        public double? Min { get; set; }
        /// <summary>
        /// MinDate of the Field 
        /// </summary>
        public DateTime? MinDate { get; set; }
        /// <summary>
        /// Minlength of the Field 
        /// </summary>
        public int? Minlength { get; set; }
        /// <summary>
        /// OperatorForSearch of the Field 
        /// </summary>
        public string? OperatorForSearch { get; set; }
        /// <summary>
        /// ReadOnly of the Field 
        /// </summary>
        public bool? ReadOnly { get; set; }
        /// <summary>
        /// Required of the Field 
        /// </summary>
        public bool? Required { get; set; }
        /// <summary>
        /// Resizable of the Field 
        /// </summary>
        public string? Resizable { get; set; }
        /// <summary>
        /// Scale of the Field 
        /// </summary>
        public int? Scale { get; set; }
        /// <summary>
        /// ShowDefaultValue of the Field 
        /// </summary>
        public bool? ShowDefaultValue { get; set; }
        /// <summary>
        /// ShowHorizontal of the Field 
        /// </summary>
        public bool? ShowHorizontal { get; set; }
        /// <summary>
        /// ShowIndividual of the Field 
        /// </summary>
        public bool? ShowIndividual { get; set; }
        /// <summary>
        /// ShowNumericFormat of the Field 
        /// </summary>
        public bool? ShowNumericFormat { get; set; }
        /// <summary>
        /// Suggest of the Field 
        /// </summary>
        public bool? Suggest { get; set; }
        /// <summary>
        /// TextField of the Field 
        /// </summary>
        public string? TextField { get; set; }
        /// <summary>
        /// Type of the Field 
        /// </summary>
        public string? Type { get; set; }
        /// <summary>
        /// Value of the Field 
        /// </summary>
        public object? Value { get; set; }
        /// <summary>
        /// ValueField of the Field 
        /// </summary>
        public string? ValueField { get; set; }
        /// <summary>
        /// Fields of the Field 
        /// </summary>
        public List<Field>? Fields { get; set; }
        /// <summary>
        /// ShowTitle of the Field 
        /// </summary>
        public bool? ShowTitle { get; set; }
        /// <summary>
        /// ApiUrl of the Field 
        /// </summary>
        public string? ApiUrl { get; set; }
        /// <summary>
        /// IsExtendedEntity of the Field 
        /// </summary>
        public bool? IsExtendedEntity { get; set; }
        /// <summary>
        /// LookupView of the Field 
        /// </summary>
        public string? LookupView { get; set; }
        /// <summary>
        /// LookupViewTemplate of the Field 
        /// </summary>
        public List<Field>? LookupViewTemplate { get; set; }
        /// <summary>
        /// IsManyToManyEntity of the Field 
        /// </summary>
        public bool? IsManyToManyEntity { get; set; }

        /// <summary>
        /// Initializes a new instance of the Field class.
        /// </summary>
        public Field()
        {
            Column = 12;
            DataType = "string";
        }

        /// <summary>
        /// Initializes a new instance of the Field class.
        /// </summary>
        /// <param name = "dataType">dataType value to set.</param>
        /// <param name = "fieldName">fieldName value to set.</param>
        public Field(string dataType, string fieldName)
        {
            Column = 12;
            DataType = dataType;
            FieldName = fieldName;
        }
    }
}
namespace Sept2417.Models
{
    using System.Collections.Generic;
    using System.Diagnostics.CodeAnalysis;

    /// <summary>
    /// Metadata for entity details 
    /// </summary>
    public class MetaDataEntity
    {
        /// <summary>
        /// Initializes a new instance of the MetaDataEntity class.
        /// </summary>
        public MetaDataEntity()
        {
            Fields = new List<PropertyInformation>();
            RelatedEntities = new List<string>();
        }

        /// <summary>
        /// Name of the MetaDataEntity 
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// PrimaryField of the MetaDataEntity 
        /// </summary>
        [AllowNull]
        public PropertyInformation PrimaryField { get; set; }
        /// <summary>
        /// Fields of the MetaDataEntity 
        /// </summary>
        public List<PropertyInformation> Fields { get; set; }
        /// <summary>
        /// RelatedEntities of the MetaDataEntity 
        /// </summary>
        public List<string> RelatedEntities { get; set; }
    }

    /// <summary>
    /// Entity property class 
    /// </summary>
    public class PropertyInformation
    {
        /// <summary>
        /// Name of the MetaDataEntity 
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// DataType of the PropertyInformation 
        /// </summary>
        public string DataType { get; set; }

        /// <summary>
        /// ReferenceEntity of the PropertyInformation 
        /// </summary>
        [AllowNull]
        public string ReferenceEntity { get; set; }
        /// <summary>
        /// Required of the PropertyInformation 
        /// </summary>
        public bool? Required { get; set; }
        /// <summary>
        /// IsExtendedEntity of the PropertyInformation 
        /// </summary>
        public bool? IsExtendedEntity { get; set; }
        /// <summary>
        /// IsManyToManyEntity of the PropertyInformation 
        /// </summary>
        public bool? IsManyToManyEntity { get; set; }
    }

    /// <summary>
    /// Layout file model 
    /// </summary>
    public class LayoutFileDetail
    {
        /// <summary>
        /// FileName of the LayoutFileDetail 
        /// </summary>
        public string? FileName { get; set; }
        /// <summary>
        /// Fields of the LayoutFileDetail 
        /// </summary>
        public List<Field>? Fields { get; set; }
    }

    /// <summary>
    /// File detail model 
    /// </summary>
    public class FileDetails
    {
        /// <summary>
        /// Id of the FileDetails 
        /// </summary>
        public string? Id { get; set; }
        /// <summary>
        /// Name of the FileDetails 
        /// </summary>
        public string? Name { get; set; }
        /// <summary>
        /// FileType of the FileDetails 
        /// </summary>
        public string? FileType { get; set; }
    }
}
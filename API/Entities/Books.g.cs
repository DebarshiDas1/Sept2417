using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Sept2417.Entities
{
#pragma warning disable
    /// <summary> 
    /// Represents a books entity with essential details
    /// </summary>
    public class Books
    {
        /// <summary>
        /// Initializes a new instance of the Books class.
        /// </summary>
        public Books()
        {
            Price = 12.34M;
            Quantity = 1;
        }

        /// <summary>
        /// Primary key for the Books 
        /// </summary>
        [Key]
        [Required]
        public Guid Id { get; set; }
        /// <summary>
        /// Title of the Books 
        /// </summary>
        public string? Title { get; set; }
        /// <summary>
        /// Foreign key referencing the Author to which the Books belongs 
        /// </summary>
        public Guid? AuthorId { get; set; }

        /// <summary>
        /// Navigation property representing the associated Author
        /// </summary>
        [ForeignKey("AuthorId")]
        public Author? AuthorId_Author { get; set; }
        /// <summary>
        /// Genre of the Books 
        /// </summary>
        public string? Genre { get; set; }
        /// <summary>
        /// Publication of the Books 
        /// </summary>
        public string? Publication { get; set; }

        /// <summary>
        /// PublishDate of the Books 
        /// </summary>
        [Column(TypeName = "datetime")]
        public DateTime? PublishDate { get; set; }

        /// <summary>
        /// Required field Price of the Books 
        /// </summary>
        [Required]
        public decimal Price { get; set; }
        /// <summary>
        /// Quantity of the Books 
        /// </summary>
        public int? Quantity { get; set; }
        /// <summary>
        /// TenantId of the Books 
        /// </summary>
        public Guid? TenantId { get; set; }

        /// <summary>
        /// CreatedOn of the Books 
        /// </summary>
        [Column(TypeName = "datetime")]
        public DateTime? CreatedOn { get; set; }
        /// <summary>
        /// CreatedBy of the Books 
        /// </summary>
        public Guid? CreatedBy { get; set; }

        /// <summary>
        /// UpdatedOn of the Books 
        /// </summary>
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedOn { get; set; }
        /// <summary>
        /// UpdatedBy of the Books 
        /// </summary>
        public Guid? UpdatedBy { get; set; }
    }
}
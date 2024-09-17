using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Sept2417.Entities
{
#pragma warning disable
    /// <summary> 
    /// Represents a user entity with essential details
    /// </summary>
    public class User
    {
        /// <summary>
        /// Foreign key referencing the Tenant to which the User belongs 
        /// </summary>
        [Required]
        public Guid? TenantId { get; set; }

        /// <summary>
        /// Navigation property representing the associated Tenant
        /// </summary>
        [ForeignKey("TenantId")]
        public Tenant? TenantId_Tenant { get; set; }

        /// <summary>
        /// Primary key for the User 
        /// </summary>
        [Key]
        [Required]
        public Guid Id { get; set; }
        /// <summary>
        /// Name of the User 
        /// </summary>
        public string? Name { get; set; }

        /// <summary>
        /// Required field EmailId of the User 
        /// </summary>
        [Required]
        public string EmailId { get; set; }

        /// <summary>
        /// Required field UserName of the User 
        /// </summary>
        [Required]
        public string UserName { get; set; }

        /// <summary>
        /// Required field PasswordHash of the User 
        /// </summary>
        [Required]
        public string PasswordHash { get; set; }

        /// <summary>
        /// Required field Saltkey of the User 
        /// </summary>
        [Required]
        public string Saltkey { get; set; }

        /// <summary>
        /// Dob of the User 
        /// </summary>
        [Column(TypeName = "datetime")]
        public DateTime? Dob { get; set; }

        /// <summary>
        /// Required field IsSuperAdmin of the User 
        /// </summary>
        [Required]
        public bool IsSuperAdmin { get; set; }

        /// <summary>
        /// CreatedOn of the User 
        /// </summary>
        [Column(TypeName = "datetime")]
        public DateTime? CreatedOn { get; set; }
        /// <summary>
        /// CreatedBy of the User 
        /// </summary>
        public Guid? CreatedBy { get; set; }

        /// <summary>
        /// UpdatedOn of the User 
        /// </summary>
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedOn { get; set; }
        /// <summary>
        /// UpdatedBy of the User 
        /// </summary>
        public Guid? UpdatedBy { get; set; }
    }
}
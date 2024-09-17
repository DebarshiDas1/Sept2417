using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Sept2417.Entities
{
#pragma warning disable
    /// <summary> 
    /// Represents a roleentitlement entity with essential details
    /// </summary>
    public class RoleEntitlement
    {
        /// <summary>
        /// Foreign key referencing the Tenant to which the RoleEntitlement belongs 
        /// </summary>
        [Required]
        public Guid? TenantId { get; set; }

        /// <summary>
        /// Navigation property representing the associated Tenant
        /// </summary>
        [ForeignKey("TenantId")]
        public Tenant? TenantId_Tenant { get; set; }

        /// <summary>
        /// Primary key for the RoleEntitlement 
        /// </summary>
        [Key]
        [Required]
        public Guid Id { get; set; }
        /// <summary>
        /// Foreign key referencing the Role to which the RoleEntitlement belongs 
        /// </summary>
        public Guid? RoleId { get; set; }

        /// <summary>
        /// Navigation property representing the associated Role
        /// </summary>
        [ForeignKey("RoleId")]
        public Role? RoleId_Role { get; set; }
        /// <summary>
        /// Foreign key referencing the Entity to which the RoleEntitlement belongs 
        /// </summary>
        public Guid? EntityId { get; set; }

        /// <summary>
        /// Navigation property representing the associated Entity
        /// </summary>
        [ForeignKey("EntityId")]
        public Entity? EntityId_Entity { get; set; }

        /// <summary>
        /// Required field Entitlement of the RoleEntitlement 
        /// </summary>
        [Required]
        public int Entitlement { get; set; }
        /// <summary>
        /// Foreign key referencing the User to which the RoleEntitlement belongs 
        /// </summary>
        public Guid? CreatedBy { get; set; }

        /// <summary>
        /// Navigation property representing the associated User
        /// </summary>
        [ForeignKey("CreatedBy")]
        public User? CreatedBy_User { get; set; }

        /// <summary>
        /// CreatedOn of the RoleEntitlement 
        /// </summary>
        [Column(TypeName = "datetime")]
        public DateTime? CreatedOn { get; set; }

        /// <summary>
        /// UpdatedOn of the RoleEntitlement 
        /// </summary>
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedOn { get; set; }
        /// <summary>
        /// Foreign key referencing the User to which the RoleEntitlement belongs 
        /// </summary>
        public Guid? UpdatedBy { get; set; }

        /// <summary>
        /// Navigation property representing the associated User
        /// </summary>
        [ForeignKey("UpdatedBy")]
        public User? UpdatedBy_User { get; set; }
    }
}
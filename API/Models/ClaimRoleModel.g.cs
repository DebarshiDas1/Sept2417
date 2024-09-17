using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Sept2417.Models
{
#pragma warning disable
    /// <summary> 
    /// Represents a claimrolemodel entity with essential details
    /// </summary>
    public class ClaimRoleModel
    {
        /// <summary>
        /// EntityName of the ClaimRoleModel 
        /// </summary>
        public string? EntityName { get; set; }
        /// <summary>
        /// Action of the ClaimRoleModel 
        /// </summary>
        public List<int>? Action { get; set; }
    }
}
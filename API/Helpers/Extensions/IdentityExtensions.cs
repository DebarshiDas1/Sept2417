using System;
using System.Security.Claims;
using System.Security.Principal;
using System.Linq;

namespace Sept2417.Helpers.Extensions
{
    /// <summary>
/// This is used to Get some system data
/// </summary>
    public static class IdentityExtensions
    {
        /// <summary>
/// Get TenantId from claim.
/// </summary>
        public static Guid GetTenantId(this IIdentity identity)
        {
            if (identity is ClaimsIdentity claimsIdentity)
            {
                var claim = claimsIdentity.Claims.FirstOrDefault(c => string.Equals(c.Type, "TenantId", StringComparison.OrdinalIgnoreCase));
                if (claim?.Value != null && Guid.TryParse(claim.Value, out Guid tenantId))
                {
                    return tenantId;
                }
            }

            throw new InvalidOperationException("Invalid TenantId");
        }

        /// <summary>
/// Get UserId from claim.
/// </summary>
        public static Guid GetUserId(this IIdentity identity)
        {
            if (identity is ClaimsIdentity claimsIdentity)
            {
                var claim = claimsIdentity.Claims.FirstOrDefault(c => string.Equals(c.Type, "UserId", StringComparison.OrdinalIgnoreCase));
                if (claim?.Value != null && Guid.TryParse(claim.Value, out Guid userId))
                {
                    return userId;
                }
            }

            throw new InvalidOperationException("Invalid UserId");
        }
    }
}
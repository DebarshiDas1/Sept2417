namespace Sept2417.Models
{
    /// <summary>
    /// Provides access to application settings related to JWT authentication.
    /// </summary>
    public static class AppSetting
    {
        ///  /// <summary>
        /// Gets or sets the JWT secret key used for token generation and validation.
        /// </summary>
        public static string JwtKey { get; set; }
        /// <summary>
        /// Gets or sets the JWT token issuer.
        /// </summary>
        public static string JwtIssuer { get; set; }
        /// <summary>
        /// Gets or sets the token expiration time in minutes.
        /// </summary>
        public static int TokenExpirationtime { get; set; }
    }
}
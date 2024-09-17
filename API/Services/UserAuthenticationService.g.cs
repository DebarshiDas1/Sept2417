namespace Sept2417.Services
{
    using System;
    using Sept2417.Data;
    using Sept2417.Entities;
    using Sept2417.Models;

    /// <summary>
    /// Interface of UserAuthenticationService
    /// </summary>
    public interface IUserAuthenticationService
    {
        /// <summary>
        /// It will create user
        /// </summary>
        /// <param name = "model">object of User</param>
        /// <returns>bool as true or false</returns>
        bool CreateUser(User model);
        /// <summary>
        /// It will return user by id or userName
        /// </summary>
        /// <param name = "id">id</param>
        /// <param name = "username">user-name</param>
        /// <returns>object of User</returns>
        User GetUser(Guid? id, string username);
        /// <summary>
        /// It will validate User exist or not
        /// </summary>
        /// <param name = "tenantId">tenant id</param>
        /// <param name = "username">user-name</param>
        /// <param name = "emailId">user email id</param>
        /// <returns>bool as true or false</returns>
        bool UserExist(Guid tenantId, string username, string emailId);
        /// <summary>
        /// It will create refresh token for an user
        /// </summary>
        /// <param name = "tenantId">tenant id</param>
        /// <param name = "userId">user id</param>
        /// <param name = "token">token</param>
        /// <returns>bool as true or false</returns>
        bool CreateRefreshTokenByUser(Guid tenantId, Guid userId, string token);
        /// <summary>
        /// It will update refresh token 
        /// </summary>
        /// <param name = "tenantId">tenant id</param>
        /// <param name = "refreshTokenId">refresh token id</param>
        /// <param name = "userId">user id</param>
        /// <param name = "token">token</param>
        /// <returns>bool as true or false</returns>
        bool UpdateRefreshTokenByUser(Guid tenantId, Guid refreshTokenId, Guid userId, string token);
        /// <summary>
        /// It will validate refresh token exist or not
        /// </summary>
        /// <param name = "tenantId">tenant id</param>
        /// <param name = "token">token</param>
        /// <param name = "userId">user id</param>
        /// <returns>guid</returns>
        Guid? RefreshTokenExist(Guid tenantId, string token, Guid userId);
        /// <summary>
        /// It will return ACL data by user id
        /// </summary>
        /// <param name = "tenantId">tenant id</param>
        /// <param name = "userId">user id</param>
        /// <returns>list of CliamRole model</returns>
        List<ClaimRoleModel> GetUserACL(Guid tenantId, Guid userId);
    }

    /// <summary>
    /// Implementation of UserAuthenticationService
    /// </summary>
    public class UserAuthenticationService : IUserAuthenticationService
    {
        private Sept2417Context _dbContext;
        /// <summary>
        ///  Constructor of UserAuthenticationService
        /// </summary>
        public UserAuthenticationService(Sept2417Context dbContext)
        {
            _dbContext = dbContext;
        }

        /// <summary>
        /// It will create user
        /// </summary>
        /// <param name = "model">object of User</param>
        /// <returns>bool as true or false</returns>
        public bool CreateUser(User model)
        {
            if (model != null)
            {
                model.CreatedOn = DateTime.UtcNow;
                model.UpdatedOn = DateTime.UtcNow;
                _dbContext.User.Add(model);
                _dbContext.SaveChanges();
                return true;
            }

            return false;
        }

        /// <summary>
        /// It will return user by id or userName
        /// </summary>
        /// <param name = "id">id</param>
        /// <param name = "username">user-name</param>
        /// <returns>object of User</returns>
        public User GetUser(Guid? id, string username)
        {
            if (id == null && !string.IsNullOrEmpty(username))
                return _dbContext.User.FirstOrDefault(u => u.UserName == username);
            return _dbContext.User.FirstOrDefault(u => u.Id == id);
        }

        /// <summary>
        /// It will validate User exist or not
        /// </summary>
        /// <param name = "tenantId">tenant id</param>
        /// <param name = "username">user-name</param>
        /// <param name = "emailId">user email id</param>
        /// <returns>bool as true or false</returns>
        public bool UserExist(Guid tenantId, string username, string emailId)
        {
            return _dbContext.User.Any(u => u.EmailId == emailId || u.UserName == username && u.TenantId == tenantId);
        }

        /// <summary>
        /// It will update refresh token 
        /// </summary>
        /// <param name = "tenantId">tenant id</param>
        /// <param name = "refreshTokenId">refresh token id</param>
        /// <param name = "userId">user id</param>
        /// <param name = "token">token</param>
        /// <returns>bool as true or false</returns>
        public bool UpdateRefreshTokenByUser(Guid tenantId, Guid refreshTokenId, Guid userId, string token)
        {
            UserToken model = new UserToken
            {
                UserId = userId,
                TenantId = tenantId,
                RefershToken = token,
                CreatedOn = DateTime.UtcNow
            };
            _dbContext.UserToken.Update(model);
            _dbContext.SaveChanges();
            return true;
        }

        /// <summary>
        /// It will create refresh token for an user
        /// </summary>
        /// <param name = "tenantId">tenant id</param>
        /// <param name = "userId">user id</param>
        /// <param name = "token">token</param>
        /// <returns>bool as true or false</returns>
        public bool CreateRefreshTokenByUser(Guid tenantId, Guid userId, string token)
        {
            UserToken model = new UserToken
            {
                Id = new Guid(),
                UserId = userId,
                TenantId = tenantId,
                RefershToken = token,
                CreatedOn = DateTime.UtcNow
            };
            _dbContext.UserToken.Add(model);
            _dbContext.SaveChanges();
            return true;
        }

        /// <summary>
        /// It will validate refresh token exist or not
        /// </summary>
        /// <param name = "tenantId">tenant id</param>
        /// <param name = "token">token</param>
        /// <param name = "userId">user id</param>
        /// <returns>guid</returns>
        public Guid? RefreshTokenExist(Guid tenantId, string token, Guid userId)
        {
            return _dbContext.UserToken.FirstOrDefault(u => u.TenantId == tenantId && u.RefershToken == token && u.UserId == userId)?.Id;
        }

        /// <summary>
        /// It will return ACL data by user id
        /// </summary>
        /// <param name = "tenantId">tenant id</param>
        /// <param name = "userId">user id</param>
        /// <returns>list of CliamRole model</returns>
        public List<ClaimRoleModel> GetUserACL(Guid tenantId, Guid userId)
        {
            List<ClaimRoleModel> data = new List<ClaimRoleModel>();
            var roles = _dbContext.UserInRole.Where(w => w.TenantId == tenantId && w.UserId == userId).ToList();
            if (roles.Count != 0)
                data = _dbContext.Entity.Where(e => e.TenantId == tenantId).Select(entity => new ClaimRoleModel { EntityName = entity.Name, Action = _dbContext.RoleEntitlement.Where(re => re.TenantId == tenantId && re.EntityId == entity.Id && roles.Select(s => s.RoleId).Contains(re.RoleId)).Select(re => re.Entitlement).ToList() }).ToList();
            return data;
        }
    }
}
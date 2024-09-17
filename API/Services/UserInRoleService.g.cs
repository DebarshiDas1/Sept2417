using Sept2417.Models;
using Sept2417.Data;
using Sept2417.Filter;
using Sept2417.Entities;
using Sept2417.Logger;
using Microsoft.AspNetCore.JsonPatch;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using System.Dynamic;
using Task = System.Threading.Tasks.Task;

namespace Sept2417.Services
{
    /// <summary>
    /// The userinroleService responsible for managing userinrole related operations.
    /// </summary>
    /// <remarks>
    /// This service for adding, retrieving, updating, and deleting userinrole information.
    /// </remarks>
    public interface IUserInRoleService
    {
        /// <summary>Retrieves a specific userinrole by its primary key</summary>
        /// <param name="id">The primary key of the userinrole</param>
        /// <param name="fields">The fields is fetch data of selected fields</param>
        /// <returns>The userinrole data</returns>
        Task<dynamic> GetById(Guid id, string fields);

        /// <summary>Retrieves a list of userinroles based on specified filters</summary>
        /// <param name="filters">The filter criteria in JSON format. Use the following format: [{"PropertyName": "PropertyName", "Operator": "Equal", "Value": "FilterValue"}] </param>
        /// <param name="searchTerm">To searching data.</param>
        /// <param name="pageNumber">The page number.</param>
        /// <param name="pageSize">The page size.</param>
        /// <param name="sortField">The entity's field name to sort.</param>
        /// <param name="sortOrder">The sort order asc or desc.</param>
        /// <returns>The filtered list of userinroles</returns>
        Task<List<UserInRole>> Get(List<FilterCriteria> filters = null, string searchTerm = "", int pageNumber = 1, int pageSize = 1, string sortField = null, string sortOrder = "asc");

        /// <summary>Adds a new userinrole</summary>
        /// <param name="model">The userinrole data to be added</param>
        /// <returns>The result of the operation</returns>
        Task<Guid> Create(UserInRole model);

        /// <summary>Updates a specific userinrole by its primary key</summary>
        /// <param name="id">The primary key of the userinrole</param>
        /// <param name="updatedEntity">The userinrole data to be updated</param>
        /// <returns>The result of the operation</returns>
        Task<bool> Update(Guid id, UserInRole updatedEntity);

        /// <summary>Updates a specific userinrole by its primary key</summary>
        /// <param name="id">The primary key of the userinrole</param>
        /// <param name="updatedEntity">The userinrole data to be updated</param>
        /// <returns>The result of the operation</returns>
        Task<bool> Patch(Guid id, JsonPatchDocument<UserInRole> updatedEntity);

        /// <summary>Deletes a specific userinrole by its primary key</summary>
        /// <param name="id">The primary key of the userinrole</param>
        /// <returns>The result of the operation</returns>
        Task<bool> Delete(Guid id);
    }

    /// <summary>
    /// The userinroleService responsible for managing userinrole related operations.
    /// </summary>
    /// <remarks>
    /// This service for adding, retrieving, updating, and deleting userinrole information.
    /// </remarks>
    public class UserInRoleService : IUserInRoleService
    {
        private readonly Sept2417Context _dbContext;
        private readonly IFieldMapperService _mapper;

        /// <summary>
        /// Initializes a new instance of the UserInRole class.
        /// </summary>
        /// <param name="dbContext">dbContext value to set.</param>
        /// <param name="mapper">mapper value to set.</param>
        public UserInRoleService(Sept2417Context dbContext, IFieldMapperService mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        /// <summary>Retrieves a specific userinrole by its primary key</summary>
        /// <param name="id">The primary key of the userinrole</param>
        /// <param name="fields">The fields is fetch data of selected fields</param>
        /// <returns>The userinrole data</returns>
        public async Task<dynamic> GetById(Guid id, string fields)
        {
            var query = _dbContext.UserInRole.AsQueryable();
            List<string> allfields = new List<string>();
            if (!string.IsNullOrEmpty(fields))
            {
                allfields.AddRange(fields.Split(","));
                fields = $"Id,{fields}";
            }
            else
            {
                fields = "Id";
            }

            string[] navigationProperties = ["TenantId_Tenant","RoleId_Role","UserId_User","CreatedBy_User","UpdatedBy_User"];
            foreach (var navigationProperty in navigationProperties)
            {
                if (allfields.Any(field => field.StartsWith(navigationProperty + ".", StringComparison.OrdinalIgnoreCase)))
                {
                    query = query.Include(navigationProperty);
                }
            }

            query = query.Where(entity => entity.Id == id);
            return _mapper.MapToFields(await query.FirstOrDefaultAsync(),fields);
        }

        /// <summary>Retrieves a list of userinroles based on specified filters</summary>
        /// <param name="filters">The filter criteria in JSON format. Use the following format: [{"PropertyName": "PropertyName", "Operator": "Equal", "Value": "FilterValue"}] </param>
        /// <param name="searchTerm">To searching data.</param>
        /// <param name="pageNumber">The page number.</param>
        /// <param name="pageSize">The page size.</param>
        /// <param name="sortField">The entity's field name to sort.</param>
        /// <param name="sortOrder">The sort order asc or desc.</param>
        /// <returns>The filtered list of userinroles</returns>/// <exception cref="Exception"></exception>
        public async Task<List<UserInRole>> Get(List<FilterCriteria> filters = null, string searchTerm = "", int pageNumber = 1, int pageSize = 1, string sortField = null, string sortOrder = "asc")
        {
            var result = await GetUserInRole(filters, searchTerm, pageNumber, pageSize, sortField, sortOrder);
            return result;
        }

        /// <summary>Adds a new userinrole</summary>
        /// <param name="model">The userinrole data to be added</param>
        /// <returns>The result of the operation</returns>
        public async Task<Guid> Create(UserInRole model)
        {
            model.Id = await CreateUserInRole(model);
            return model.Id;
        }

        /// <summary>Updates a specific userinrole by its primary key</summary>
        /// <param name="id">The primary key of the userinrole</param>
        /// <param name="updatedEntity">The userinrole data to be updated</param>
        /// <returns>The result of the operation</returns>
        /// <exception cref="Exception"></exception>
        public async Task<bool> Update(Guid id, UserInRole updatedEntity)
        {
            await UpdateUserInRole(id, updatedEntity);
            return true;
        }

        /// <summary>Updates a specific userinrole by its primary key</summary>
        /// <param name="id">The primary key of the userinrole</param>
        /// <param name="updatedEntity">The userinrole data to be updated</param>
        /// <returns>The result of the operation</returns>
        /// <exception cref="Exception"></exception>
        public async Task<bool> Patch(Guid id, JsonPatchDocument<UserInRole> updatedEntity)
        {
            await PatchUserInRole(id, updatedEntity);
            return true;
        }

        /// <summary>Deletes a specific userinrole by its primary key</summary>
        /// <param name="id">The primary key of the userinrole</param>
        /// <returns>The result of the operation</returns>
        /// <exception cref="Exception"></exception>
        public async Task<bool> Delete(Guid id)
        {
            await DeleteUserInRole(id);
            return true;
        }
        #region
        private async Task<List<UserInRole>> GetUserInRole(List<FilterCriteria> filters = null, string searchTerm = "", int pageNumber = 1, int pageSize = 1, string sortField = null, string sortOrder = "asc")
        {
            if (pageSize < 1)
            {
                throw new ApplicationException("Page size invalid!");
            }

            if (pageNumber < 1)
            {
                throw new ApplicationException("Page mumber invalid!");
            }

            var query = _dbContext.UserInRole.IncludeRelated().AsQueryable();
            int skip = (pageNumber - 1) * pageSize;
            var result = FilterService<UserInRole>.ApplyFilter(query, filters, searchTerm);
            if (!string.IsNullOrEmpty(sortField))
            {
                var parameter = Expression.Parameter(typeof(UserInRole), "b");
                var property = Expression.Property(parameter, sortField);
                var lambda = Expression.Lambda<Func<UserInRole, object>>(Expression.Convert(property, typeof(object)), parameter);
                if (sortOrder.Equals("asc", StringComparison.OrdinalIgnoreCase))
                {
                    result = result.OrderBy(lambda);
                }
                else if (sortOrder.Equals("desc", StringComparison.OrdinalIgnoreCase))
                {
                    result = result.OrderByDescending(lambda);
                }
                else
                {
                    throw new ApplicationException("Invalid sort order. Use 'asc' or 'desc'");
                }
            }

            var paginatedResult = await result.Skip(skip).Take(pageSize).ToListAsync();
            return paginatedResult;
        }

        private async Task<Guid> CreateUserInRole(UserInRole model)
        {
            _dbContext.UserInRole.Add(model);
            await _dbContext.SaveChangesAsync();
            return model.Id;
        }

        private async Task UpdateUserInRole(Guid id, UserInRole updatedEntity)
        {
            _dbContext.UserInRole.Update(updatedEntity);
            await _dbContext.SaveChangesAsync();
        }

        private async Task<bool> DeleteUserInRole(Guid id)
        {
            var entityData = _dbContext.UserInRole.FirstOrDefault(entity => entity.Id == id);
            if (entityData == null)
            {
                throw new ApplicationException("No data found!");
            }

            _dbContext.UserInRole.Remove(entityData);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        private async Task PatchUserInRole(Guid id, JsonPatchDocument<UserInRole> updatedEntity)
        {
            if (updatedEntity == null)
            {
                throw new ApplicationException("Patch document is missing!");
            }

            var existingEntity = _dbContext.UserInRole.FirstOrDefault(t => t.Id == id);
            if (existingEntity == null)
            {
                throw new ApplicationException("No data found!");
            }

            updatedEntity.ApplyTo(existingEntity);
            _dbContext.UserInRole.Update(existingEntity);
            await _dbContext.SaveChangesAsync();
        }
        #endregion
    }
}
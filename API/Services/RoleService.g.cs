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
    /// The roleService responsible for managing role related operations.
    /// </summary>
    /// <remarks>
    /// This service for adding, retrieving, updating, and deleting role information.
    /// </remarks>
    public interface IRoleService
    {
        /// <summary>Retrieves a specific role by its primary key</summary>
        /// <param name="id">The primary key of the role</param>
        /// <param name="fields">The fields is fetch data of selected fields</param>
        /// <returns>The role data</returns>
        Task<dynamic> GetById(Guid id, string fields);

        /// <summary>Retrieves a list of roles based on specified filters</summary>
        /// <param name="filters">The filter criteria in JSON format. Use the following format: [{"PropertyName": "PropertyName", "Operator": "Equal", "Value": "FilterValue"}] </param>
        /// <param name="searchTerm">To searching data.</param>
        /// <param name="pageNumber">The page number.</param>
        /// <param name="pageSize">The page size.</param>
        /// <param name="sortField">The entity's field name to sort.</param>
        /// <param name="sortOrder">The sort order asc or desc.</param>
        /// <returns>The filtered list of roles</returns>
        Task<List<Role>> Get(List<FilterCriteria> filters = null, string searchTerm = "", int pageNumber = 1, int pageSize = 1, string sortField = null, string sortOrder = "asc");

        /// <summary>Adds a new role</summary>
        /// <param name="model">The role data to be added</param>
        /// <returns>The result of the operation</returns>
        Task<Guid> Create(Role model);

        /// <summary>Updates a specific role by its primary key</summary>
        /// <param name="id">The primary key of the role</param>
        /// <param name="updatedEntity">The role data to be updated</param>
        /// <returns>The result of the operation</returns>
        Task<bool> Update(Guid id, Role updatedEntity);

        /// <summary>Updates a specific role by its primary key</summary>
        /// <param name="id">The primary key of the role</param>
        /// <param name="updatedEntity">The role data to be updated</param>
        /// <returns>The result of the operation</returns>
        Task<bool> Patch(Guid id, JsonPatchDocument<Role> updatedEntity);

        /// <summary>Deletes a specific role by its primary key</summary>
        /// <param name="id">The primary key of the role</param>
        /// <returns>The result of the operation</returns>
        Task<bool> Delete(Guid id);
    }

    /// <summary>
    /// The roleService responsible for managing role related operations.
    /// </summary>
    /// <remarks>
    /// This service for adding, retrieving, updating, and deleting role information.
    /// </remarks>
    public class RoleService : IRoleService
    {
        private readonly Sept2417Context _dbContext;
        private readonly IFieldMapperService _mapper;

        /// <summary>
        /// Initializes a new instance of the Role class.
        /// </summary>
        /// <param name="dbContext">dbContext value to set.</param>
        /// <param name="mapper">mapper value to set.</param>
        public RoleService(Sept2417Context dbContext, IFieldMapperService mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        /// <summary>Retrieves a specific role by its primary key</summary>
        /// <param name="id">The primary key of the role</param>
        /// <param name="fields">The fields is fetch data of selected fields</param>
        /// <returns>The role data</returns>
        public async Task<dynamic> GetById(Guid id, string fields)
        {
            var query = _dbContext.Role.AsQueryable();
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

            string[] navigationProperties = ["TenantId_Tenant","CreatedBy_User","UpdatedBy_User"];
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

        /// <summary>Retrieves a list of roles based on specified filters</summary>
        /// <param name="filters">The filter criteria in JSON format. Use the following format: [{"PropertyName": "PropertyName", "Operator": "Equal", "Value": "FilterValue"}] </param>
        /// <param name="searchTerm">To searching data.</param>
        /// <param name="pageNumber">The page number.</param>
        /// <param name="pageSize">The page size.</param>
        /// <param name="sortField">The entity's field name to sort.</param>
        /// <param name="sortOrder">The sort order asc or desc.</param>
        /// <returns>The filtered list of roles</returns>/// <exception cref="Exception"></exception>
        public async Task<List<Role>> Get(List<FilterCriteria> filters = null, string searchTerm = "", int pageNumber = 1, int pageSize = 1, string sortField = null, string sortOrder = "asc")
        {
            var result = await GetRole(filters, searchTerm, pageNumber, pageSize, sortField, sortOrder);
            return result;
        }

        /// <summary>Adds a new role</summary>
        /// <param name="model">The role data to be added</param>
        /// <returns>The result of the operation</returns>
        public async Task<Guid> Create(Role model)
        {
            model.Id = await CreateRole(model);
            return model.Id;
        }

        /// <summary>Updates a specific role by its primary key</summary>
        /// <param name="id">The primary key of the role</param>
        /// <param name="updatedEntity">The role data to be updated</param>
        /// <returns>The result of the operation</returns>
        /// <exception cref="Exception"></exception>
        public async Task<bool> Update(Guid id, Role updatedEntity)
        {
            await UpdateRole(id, updatedEntity);
            return true;
        }

        /// <summary>Updates a specific role by its primary key</summary>
        /// <param name="id">The primary key of the role</param>
        /// <param name="updatedEntity">The role data to be updated</param>
        /// <returns>The result of the operation</returns>
        /// <exception cref="Exception"></exception>
        public async Task<bool> Patch(Guid id, JsonPatchDocument<Role> updatedEntity)
        {
            await PatchRole(id, updatedEntity);
            return true;
        }

        /// <summary>Deletes a specific role by its primary key</summary>
        /// <param name="id">The primary key of the role</param>
        /// <returns>The result of the operation</returns>
        /// <exception cref="Exception"></exception>
        public async Task<bool> Delete(Guid id)
        {
            await DeleteRole(id);
            return true;
        }
        #region
        private async Task<List<Role>> GetRole(List<FilterCriteria> filters = null, string searchTerm = "", int pageNumber = 1, int pageSize = 1, string sortField = null, string sortOrder = "asc")
        {
            if (pageSize < 1)
            {
                throw new ApplicationException("Page size invalid!");
            }

            if (pageNumber < 1)
            {
                throw new ApplicationException("Page mumber invalid!");
            }

            var query = _dbContext.Role.IncludeRelated().AsQueryable();
            int skip = (pageNumber - 1) * pageSize;
            var result = FilterService<Role>.ApplyFilter(query, filters, searchTerm);
            if (!string.IsNullOrEmpty(sortField))
            {
                var parameter = Expression.Parameter(typeof(Role), "b");
                var property = Expression.Property(parameter, sortField);
                var lambda = Expression.Lambda<Func<Role, object>>(Expression.Convert(property, typeof(object)), parameter);
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

        private async Task<Guid> CreateRole(Role model)
        {
            _dbContext.Role.Add(model);
            await _dbContext.SaveChangesAsync();
            return model.Id;
        }

        private async Task UpdateRole(Guid id, Role updatedEntity)
        {
            _dbContext.Role.Update(updatedEntity);
            await _dbContext.SaveChangesAsync();
        }

        private async Task<bool> DeleteRole(Guid id)
        {
            var entityData = _dbContext.Role.FirstOrDefault(entity => entity.Id == id);
            if (entityData == null)
            {
                throw new ApplicationException("No data found!");
            }

            _dbContext.Role.Remove(entityData);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        private async Task PatchRole(Guid id, JsonPatchDocument<Role> updatedEntity)
        {
            if (updatedEntity == null)
            {
                throw new ApplicationException("Patch document is missing!");
            }

            var existingEntity = _dbContext.Role.FirstOrDefault(t => t.Id == id);
            if (existingEntity == null)
            {
                throw new ApplicationException("No data found!");
            }

            updatedEntity.ApplyTo(existingEntity);
            _dbContext.Role.Update(existingEntity);
            await _dbContext.SaveChangesAsync();
        }
        #endregion
    }
}
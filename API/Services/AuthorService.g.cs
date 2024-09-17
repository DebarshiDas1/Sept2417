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
    /// The authorService responsible for managing author related operations.
    /// </summary>
    /// <remarks>
    /// This service for adding, retrieving, updating, and deleting author information.
    /// </remarks>
    public interface IAuthorService
    {
        /// <summary>Retrieves a specific author by its primary key</summary>
        /// <param name="id">The primary key of the author</param>
        /// <param name="fields">The fields is fetch data of selected fields</param>
        /// <returns>The author data</returns>
        Task<dynamic> GetById(Guid id, string fields);

        /// <summary>Retrieves a list of authors based on specified filters</summary>
        /// <param name="filters">The filter criteria in JSON format. Use the following format: [{"PropertyName": "PropertyName", "Operator": "Equal", "Value": "FilterValue"}] </param>
        /// <param name="searchTerm">To searching data.</param>
        /// <param name="pageNumber">The page number.</param>
        /// <param name="pageSize">The page size.</param>
        /// <param name="sortField">The entity's field name to sort.</param>
        /// <param name="sortOrder">The sort order asc or desc.</param>
        /// <returns>The filtered list of authors</returns>
        Task<List<Author>> Get(List<FilterCriteria> filters = null, string searchTerm = "", int pageNumber = 1, int pageSize = 1, string sortField = null, string sortOrder = "asc");

        /// <summary>Adds a new author</summary>
        /// <param name="model">The author data to be added</param>
        /// <returns>The result of the operation</returns>
        Task<Guid> Create(Author model);

        /// <summary>Updates a specific author by its primary key</summary>
        /// <param name="id">The primary key of the author</param>
        /// <param name="updatedEntity">The author data to be updated</param>
        /// <returns>The result of the operation</returns>
        Task<bool> Update(Guid id, Author updatedEntity);

        /// <summary>Updates a specific author by its primary key</summary>
        /// <param name="id">The primary key of the author</param>
        /// <param name="updatedEntity">The author data to be updated</param>
        /// <returns>The result of the operation</returns>
        Task<bool> Patch(Guid id, JsonPatchDocument<Author> updatedEntity);

        /// <summary>Deletes a specific author by its primary key</summary>
        /// <param name="id">The primary key of the author</param>
        /// <returns>The result of the operation</returns>
        Task<bool> Delete(Guid id);
    }

    /// <summary>
    /// The authorService responsible for managing author related operations.
    /// </summary>
    /// <remarks>
    /// This service for adding, retrieving, updating, and deleting author information.
    /// </remarks>
    public class AuthorService : IAuthorService
    {
        private readonly Sept2417Context _dbContext;
        private readonly IFieldMapperService _mapper;

        /// <summary>
        /// Initializes a new instance of the Author class.
        /// </summary>
        /// <param name="dbContext">dbContext value to set.</param>
        /// <param name="mapper">mapper value to set.</param>
        public AuthorService(Sept2417Context dbContext, IFieldMapperService mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        /// <summary>Retrieves a specific author by its primary key</summary>
        /// <param name="id">The primary key of the author</param>
        /// <param name="fields">The fields is fetch data of selected fields</param>
        /// <returns>The author data</returns>
        public async Task<dynamic> GetById(Guid id, string fields)
        {
            var query = _dbContext.Author.AsQueryable();
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

            string[] navigationProperties = [];
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

        /// <summary>Retrieves a list of authors based on specified filters</summary>
        /// <param name="filters">The filter criteria in JSON format. Use the following format: [{"PropertyName": "PropertyName", "Operator": "Equal", "Value": "FilterValue"}] </param>
        /// <param name="searchTerm">To searching data.</param>
        /// <param name="pageNumber">The page number.</param>
        /// <param name="pageSize">The page size.</param>
        /// <param name="sortField">The entity's field name to sort.</param>
        /// <param name="sortOrder">The sort order asc or desc.</param>
        /// <returns>The filtered list of authors</returns>/// <exception cref="Exception"></exception>
        public async Task<List<Author>> Get(List<FilterCriteria> filters = null, string searchTerm = "", int pageNumber = 1, int pageSize = 1, string sortField = null, string sortOrder = "asc")
        {
            var result = await GetAuthor(filters, searchTerm, pageNumber, pageSize, sortField, sortOrder);
            return result;
        }

        /// <summary>Adds a new author</summary>
        /// <param name="model">The author data to be added</param>
        /// <returns>The result of the operation</returns>
        public async Task<Guid> Create(Author model)
        {
            model.Id = await CreateAuthor(model);
            return model.Id;
        }

        /// <summary>Updates a specific author by its primary key</summary>
        /// <param name="id">The primary key of the author</param>
        /// <param name="updatedEntity">The author data to be updated</param>
        /// <returns>The result of the operation</returns>
        /// <exception cref="Exception"></exception>
        public async Task<bool> Update(Guid id, Author updatedEntity)
        {
            await UpdateAuthor(id, updatedEntity);
            return true;
        }

        /// <summary>Updates a specific author by its primary key</summary>
        /// <param name="id">The primary key of the author</param>
        /// <param name="updatedEntity">The author data to be updated</param>
        /// <returns>The result of the operation</returns>
        /// <exception cref="Exception"></exception>
        public async Task<bool> Patch(Guid id, JsonPatchDocument<Author> updatedEntity)
        {
            await PatchAuthor(id, updatedEntity);
            return true;
        }

        /// <summary>Deletes a specific author by its primary key</summary>
        /// <param name="id">The primary key of the author</param>
        /// <returns>The result of the operation</returns>
        /// <exception cref="Exception"></exception>
        public async Task<bool> Delete(Guid id)
        {
            await DeleteAuthor(id);
            return true;
        }
        #region
        private async Task<List<Author>> GetAuthor(List<FilterCriteria> filters = null, string searchTerm = "", int pageNumber = 1, int pageSize = 1, string sortField = null, string sortOrder = "asc")
        {
            if (pageSize < 1)
            {
                throw new ApplicationException("Page size invalid!");
            }

            if (pageNumber < 1)
            {
                throw new ApplicationException("Page mumber invalid!");
            }

            var query = _dbContext.Author.IncludeRelated().AsQueryable();
            int skip = (pageNumber - 1) * pageSize;
            var result = FilterService<Author>.ApplyFilter(query, filters, searchTerm);
            if (!string.IsNullOrEmpty(sortField))
            {
                var parameter = Expression.Parameter(typeof(Author), "b");
                var property = Expression.Property(parameter, sortField);
                var lambda = Expression.Lambda<Func<Author, object>>(Expression.Convert(property, typeof(object)), parameter);
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

        private async Task<Guid> CreateAuthor(Author model)
        {
            _dbContext.Author.Add(model);
            await _dbContext.SaveChangesAsync();
            return model.Id;
        }

        private async Task UpdateAuthor(Guid id, Author updatedEntity)
        {
            _dbContext.Author.Update(updatedEntity);
            await _dbContext.SaveChangesAsync();
        }

        private async Task<bool> DeleteAuthor(Guid id)
        {
            var entityData = _dbContext.Author.FirstOrDefault(entity => entity.Id == id);
            if (entityData == null)
            {
                throw new ApplicationException("No data found!");
            }

            _dbContext.Author.Remove(entityData);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        private async Task PatchAuthor(Guid id, JsonPatchDocument<Author> updatedEntity)
        {
            if (updatedEntity == null)
            {
                throw new ApplicationException("Patch document is missing!");
            }

            var existingEntity = _dbContext.Author.FirstOrDefault(t => t.Id == id);
            if (existingEntity == null)
            {
                throw new ApplicationException("No data found!");
            }

            updatedEntity.ApplyTo(existingEntity);
            _dbContext.Author.Update(existingEntity);
            await _dbContext.SaveChangesAsync();
        }
        #endregion
    }
}
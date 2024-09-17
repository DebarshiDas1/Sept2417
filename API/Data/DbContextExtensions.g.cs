using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace Sept2417.Data
{
    /// <summary>
    /// Extention of Db context of Ef to eagerly load related entities in Entity Framework Core queries
    /// </summary>
    public static class DbContextExtensions
    {
        /// <summary>
        /// Extension method to eagerly load related entities in Entity Framework Core queries.
        /// </summary>
        /// <typeparam name="TEntity">The type of entity for which related entities are to be included.</typeparam>
        /// <param name="query">The queryable collection of entities.</param>
        /// <returns>An IQueryable of the same entity type with related entities included.</returns>
        /// <remarks>
        /// This method allows for the eager loading of related entities by specifying navigation properties
        /// to include in the query result. It helps to optimize performance by reducing database round-trips
        /// and avoiding lazy loading.
        /// </remarks>
        /// <example>
        /// Example usage:
        /// <code>
        /// var query = dbContext.Products.IncludeRelated();
        /// </code>
        /// </example>
        public static IQueryable<TEntity> IncludeRelated<TEntity>(this IQueryable<TEntity> query) where TEntity : class
        {
            var includedProperties = GetIncludedProperties(typeof(TEntity));
            foreach (var property in includedProperties)
            {
                query = query.Include(property);
            }

            return query;
        }

        private static IEnumerable<string> GetIncludedProperties(Type entityType)
        {
            var foreignKeyProperties = entityType.GetProperties().Where(p => Attribute.IsDefined(p, typeof(ForeignKeyAttribute))).ToList();
            var includedProperties = new List<string>();
            foreach (var foreignKeyProperty in foreignKeyProperties)
            {
                includedProperties.Add(foreignKeyProperty.Name);
            }

            return includedProperties;
        }
    }
}
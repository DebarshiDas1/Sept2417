using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Globalization;
using System.Linq.Expressions;

namespace Sept2417.Filter
{
    /// <summary>
    /// Applies a dynamic filter to the provided query based on the given filter criteria and search term.
    /// </summary>
    /// <typeparam name = "TEntity">The type of entity to filter.</typeparam>
    public static class FilterService<TEntity>
    {
        /// <summary>
        /// Applies a dynamic filter to the provided query based on the given filter criteria and search term.
        /// </summary>
        /// <param name = "query">The query to which the filter will be applied.</param>
        /// <param name = "filters">A list of filter criteria to apply.</param>
        /// <param name = "searchTerm">The search term to be used for filtering.</param>
        /// <returns>The filtered query.</returns>
        public static IQueryable<TEntity> ApplyFilter(IQueryable<TEntity> query, List<FilterCriteria> filters, string searchTerm)
        {
            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = ApplyContainsSearch(query, searchTerm);
            }

            if (filters == null || filters.Count == 0)
            {
                return query;
            }

            var parameter = Expression.Parameter(typeof(TEntity), "x");
            Expression combinedFilter = null;
            int i = 0;
            foreach (var filter in filters)
            {
                var property = Expression.Property(parameter, filter.PropertyName);
                var propertyType = property.Type;
                var constantValue = ConvertValue(filter.Value, propertyType);
                var constant = Expression.Constant(constantValue);
                var individualFilter = GetFilterExpression(property, constant, filter.Operator);
                if (combinedFilter == null)
                {
                    combinedFilter = individualFilter;
                }
                else
                {
                    if (filter.PropertyName == filters[i-1].PropertyName)
                    {
                        combinedFilter = Expression.OrElse(combinedFilter, individualFilter);
                    }
                    else
                    {
                        combinedFilter = Expression.AndAlso(combinedFilter, individualFilter);
                    }
                }

                i++;
            }

            if (combinedFilter != null)
            {
                var lambda = Expression.Lambda<Func<TEntity, bool>>(combinedFilter, parameter);
                query = query.Where(lambda);
            }

            return query;
        }

        private static Expression GetFilterExpression(Expression property, ConstantExpression constant, string op)
        {
            bool isNullable = property.Type.IsGenericType && property.Type.GetGenericTypeDefinition() == typeof(Nullable<>);
            switch (op.ToLower())
            {
                case "equals":
                case "=":
                    if (isNullable)
                    {
                        return Expression.Equal(Expression.Property(property, "Value"), constant);
                    }
                    else
                    {
                        return Expression.Equal(property, constant);
                    }

                case "notequals":
                case "!=":
                    if (isNullable)
                    {
                        return Expression.NotEqual(Expression.Property(property, "Value"), constant);
                    }
                    else
                    {
                        return Expression.NotEqual(property, constant);
                    }

                case "greaterthan":
                case ">":
                    if (isNullable)
                    {
                        return Expression.GreaterThan(Expression.Property(property, "Value"), constant);
                    }
                    else
                    {
                        return Expression.GreaterThan(property, constant);
                    }

                case "greaterthanorequal":
                case ">=":
                    if (isNullable)
                    {
                        return Expression.GreaterThanOrEqual(Expression.Property(property, "Value"), constant);
                    }
                    else
                    {
                        return Expression.GreaterThanOrEqual(property, constant);
                    }

                case "lessthan":
                case "<":
                    if (isNullable)
                    {
                        return Expression.LessThan(Expression.Property(property, "Value"), constant);
                    }
                    else
                    {
                        return Expression.LessThan(property, constant);
                    }

                case "lessthanorequal":
                case "<=":
                    if (isNullable)
                    {
                        return Expression.LessThanOrEqual(Expression.Property(property, "Value"), constant);
                    }
                    else
                    {
                        return Expression.LessThanOrEqual(property, constant);
                    }

                case "default":
                    throw new NotSupportedException ( $"Operator {op} is not supported." );
            }

            return Expression.Constant(false);
        }

        private static IQueryable<TEntity> ApplyContainsSearch(IQueryable<TEntity> query, string searchTerm)
        {
            IEnumerable<string> stringProperties =  GetStringProperties();
            ParameterExpression parameter =  Expression.Parameter(typeof(TEntity), "x");
            Expression combinedExpression = null;
            foreach (var property in stringProperties)
            {
                Expression propertyExpression = Expression.Property(parameter, property);
                Expression searchTermExpression = Expression.Constant(searchTerm);
                MethodInfo method = typeof(string).GetMethod("Contains", new[] { typeof(string) });
                MethodCallExpression methodCall = Expression.Call(propertyExpression, method, searchTermExpression);
                if (combinedExpression == null)
                {
                    combinedExpression = methodCall;
                }
                else
                {
                    combinedExpression = Expression.OrElse(combinedExpression, methodCall);
                }
            }

             Expression<Func<TEntity, bool>> lambda = Expression.Lambda<Func<TEntity, bool>>(combinedExpression, parameter);
            return query.Where(lambda);
        }

        private static IEnumerable<string> GetStringProperties()
        {
            var entityType = typeof(TEntity);
            var stringProperties = entityType.GetProperties().Where(p => p.PropertyType == typeof(string)).Select(p => p.Name);
            return stringProperties;
        }

        private static object ConvertValue(string value, Type targetType)
        {
            if (targetType == typeof(Guid? ) || targetType == typeof(Guid))
            {
                return Guid.Parse(value);
            }
            else if ((targetType == typeof(DateTime? ) || targetType == typeof(DateTime)))
            {
                if (DateTime.TryParseExact(value.ToString(), "yyyy-MM-ddTHH:mm:ss.fffZ", CultureInfo.InvariantCulture, DateTimeStyles.AdjustToUniversal, out DateTime constantDateTime))
                {
                    return constantDateTime.ToUniversalTime();
                }
                else
                {
                    throw new ArgumentException($"Failed to parse datetime value '{value}'");
                }
            }
            else if (targetType == typeof(string))
            {
                return value;
            }
            else if (targetType.IsEnum)
            {
                return Enum.Parse(targetType, value);
            }
            else if (targetType == typeof(decimal? ) || targetType == typeof(decimal))
            {
                return decimal.Parse(value);
            }
            else if (targetType == typeof(int? ) || targetType == typeof(int))
            {
                return int.Parse(value);
            }
            else if (targetType == typeof(bool? ) || targetType == typeof(bool))
            {
                return bool.Parse(value);
            }
            else
            {
                return Convert.ChangeType(value, targetType);
            }
        }
    }
}
using Microsoft.AspNetCore.Mvc;
using Sept2417.Models;
using Sept2417.Helpers;
using Microsoft.AspNetCore.Authorization;
using YamlDotNet.Serialization;
using Sept2417.Services;
using Task = System.Threading.Tasks.Task;

namespace Sept2417.Controllers
{
    /**The MetaDataController class provides API endpoints for retrieving metadata.
                                                                    * It includes authorization and two actions:
                                                                    * - GetMenu: Retrieves menu data from a YAML file and returns it as JSON.
                                                                    * - GetLayout: Retrieves layout data based on the entity and layout type, specified in the route and query parameters respectively.
                                                                    *   The layout data is read from a YAML file and returned as JSON.
                                                                    */
    [Route("api/meta-data")]
    [Authorize]
    public class MetaDataController : BaseApiController
    {
        private readonly IJsonMessageService _jsonservice;

        /// <summary>
        /// Initializes a new instance of the MetaDataController class.
        /// </summary>
        /// <param name="jsonservice">jsonservice value to set.</param>
        public MetaDataController(IJsonMessageService jsonservice)
        {
            _jsonservice = jsonservice;
        }

        /// <summary>
        /// Retrieves and returns menu data
        /// </summary>
        /// <returns>Returns json.</returns>
        [HttpGet]
        [Route("menu")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [Produces("application/json")]
        public async Task<IActionResult> GetMenu()
        {
            string menuFilePath =  $"./Menu/Menu.yaml";
            var dynamicYaml = await System.IO.File.ReadAllTextAsync(menuFilePath);
            var deserializer =  new DeserializerBuilder().Build();
            var yamlObject = deserializer.Deserialize<dynamic>(dynamicYaml);
            return Ok(yamlObject);
        }

        /// <summary>
        /// Retrieves and returns layout data based on entity and layout type.
        /// </summary>
        /// <param name="entity">Entity name</param>
        /// <param name="fileName">Layout file name</param>
        /// <returns>Returns json.</returns>
        [HttpGet]
        [Route("{entity}/layout")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Produces("application/json")]
        public async Task<IActionResult> GetLayout([FromRoute] string entity, [FromQuery] string fileName)
        {
            if (string.IsNullOrEmpty(entity))
            {
                return BadRequest("Entity should not be empty");
            }

            if (string.IsNullOrEmpty(fileName))
            {
                return BadRequest("Layout's file name should not be blank");
            }

            fileName = fileName.Contains(".yaml") ? fileName : fileName + ".yaml";
            string layoutFilePath = $"./Layout/{entity}/{fileName}";
            var dynamicYaml = await System.IO.File.ReadAllTextAsync(layoutFilePath);;
            var deserializer =  new DeserializerBuilder().Build();
            if (fileName.StartsWith("List"))
                return Ok(deserializer.Deserialize<dynamic>(dynamicYaml));
            var yamlObject = deserializer.Deserialize<List<Field>>(dynamicYaml);
            return _jsonservice.IgnoreNullableObject(yamlObject);
        }

        /// <summary>
        /// Retrieves and returns layout data based on entity and layout type.
        /// </summary>
        /// <param name="entity">Entity name</param>
        /// <returns>Returns json.</returns>
        [HttpGet]
        [Route("{entity}/layouts")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Produces("application/json")]
        public IActionResult GetAllLayout([FromRoute] string entity)
        {
            if (string.IsNullOrEmpty(entity))
            {
                return BadRequest("Entity should not be empty");
            }

            var directoryPath = $"./Layout/{entity}/";
            List<FileDetails> files = new List<FileDetails>();
            if (Directory.Exists(directoryPath))
            {
                var item = Directory.GetFiles(directoryPath, "*.*", SearchOption.AllDirectories);
                foreach (var file in item)
                {
                    var fileName = Path.GetFileName(file);
                    var fileType = Path.GetExtension(file).TrimStart('.');
                    files.Add(new FileDetails { Id = fileName.Split(".")[0], Name = fileName, FileType = fileType });
                }
            }
            else
            {
                return BadRequest("The directory does not exist.");
            }

            return Ok(files);
        }
    }
}
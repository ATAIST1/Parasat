using Application.Services;
using Core.Dtos.Investment;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InvestmentRequestsController : ControllerBase
    {
        private readonly InvestmentRequestService _service;
        private readonly IHttpContextAccessor _httpContext;

        public InvestmentRequestsController(InvestmentRequestService service, IHttpContextAccessor httpContext)
        {
            _service = service;
            _httpContext = httpContext;
        }

        private string CurrentUserId => _httpContext.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                              ?? "test-user-123"; 
        //private string CurrentUserId => _httpContext.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                                      //?? throw new UnauthorizedAccessException();

//         [HttpGet]
//         public async Task<ActionResult<List<InvestmentRequestResponseDto>>> GetAll()
//             => Ok(await _service.GetAllAsync());

        [HttpGet]
        public async Task<ActionResult<List<InvestmentRequestResponseDto>>> GetAll(
            [FromQuery] string? search,
            [FromQuery] string? industry,
            [FromQuery] string? profitRange,
            [FromQuery] string? equityRange)
        {
            var requests = await _service.GetAllAsync(search, industry, profitRange, equityRange);
            return Ok(requests);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<InvestmentRequestResponseDto>> GetById(string id)
            => await _service.GetByIdAsync(id) is {} r ? Ok(r) : NotFound();

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateInvestmentRequestDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            await _service.CreateAsync(dto, CurrentUserId);
            return Ok(new { message = "Запрос на инвестиции создан (черновик)" });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] UpdateInvestmentRequestDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var success = await _service.UpdateAsync(id, dto, CurrentUserId);
            return success ? NoContent() : NotFound();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var success = await _service.DeleteAsync(id, CurrentUserId);
            return success ? NoContent() : NotFound();
        }

        [HttpPost("{id}/publish")]
        public async Task<IActionResult> Publish(string id)
        {
            var success = await _service.PublishAsync(id, CurrentUserId);
            return success 
                ? Ok(new { message = "Запрос опубликован и виден инвесторам!" }) 
                : BadRequest("Нельзя опубликовать: либо не ваш, либо уже опубликован");
        }
    }
}
using Application.Services;
using Core.Dtos.Investment;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

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

        private string CurrentUserId =>
            _httpContext.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? "test-user-123";

        // ----- GET /api/InvestmentRequests -----
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

        // ----- GET /api/InvestmentRequests/{id} -----
        [HttpGet("{id}")]
        public async Task<ActionResult<InvestmentRequestResponseDto>> GetById(string id)
        {
            var dto = await _service.GetByIdAsync(id);
            if (dto == null) return NotFound();
            return Ok(dto);
        }

        // ----- POST /api/InvestmentRequests -----
        [HttpPost]
        [RequestSizeLimit(100_000_000)]
        public async Task<IActionResult> Create(
            [FromForm] CreateInvestmentRequestDto dto,
            IFormFile? investmentMemorandum,
            IFormFile? financialReport,
            IFormFile? businessPlan,
            IFormFile? presentation,
            List<IFormFile>? otherDocuments)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            // IFormFile -> Stream + ContentType + FileName

            Stream? memoStream = null;
            string? memoContentType = null;
            if (investmentMemorandum is { Length: > 0 })
            {
                memoStream = investmentMemorandum.OpenReadStream();
                memoContentType = investmentMemorandum.ContentType;
            }

            Stream? finStream = null;
            string? finContentType = null;
            if (financialReport is { Length: > 0 })
            {
                finStream = financialReport.OpenReadStream();
                finContentType = financialReport.ContentType;
            }

            Stream? bpStream = null;
            string? bpContentType = null;
            if (businessPlan is { Length: > 0 })
            {
                bpStream = businessPlan.OpenReadStream();
                bpContentType = businessPlan.ContentType;
            }

            Stream? presStream = null;
            string? presContentType = null;
            if (presentation is { Length: > 0 })
            {
                presStream = presentation.OpenReadStream();
                presContentType = presentation.ContentType;
            }

            var otherDocs = new List<(Stream Stream, string ContentType, string FileName)>();
            if (otherDocuments != null && otherDocuments.Count > 0)
            {
                foreach (var file in otherDocuments.Where(f => f is { Length: > 0 }))
                {
                    otherDocs.Add((file.OpenReadStream(), file.ContentType, file.FileName));
                }
            }

            await _service.CreateAsync(
                dto,
                CurrentUserId,
                memoStream, memoContentType,
                finStream, finContentType,
                bpStream, bpContentType,
                presStream, presContentType,
                otherDocs);

            return Ok(new { message = "Запрос на инвестиции создан (черновик)" });
        }

        // ----- PUT /api/InvestmentRequests/{id} -----
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] UpdateInvestmentRequestDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var success = await _service.UpdateAsync(id, dto, CurrentUserId);
            return success ? NoContent() : NotFound();
        }

        // ----- DELETE /api/InvestmentRequests/{id} -----
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var success = await _service.DeleteAsync(id, CurrentUserId);
            return success ? NoContent() : NotFound();
        }

        // ----- POST /api/InvestmentRequests/{id}/publish -----
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

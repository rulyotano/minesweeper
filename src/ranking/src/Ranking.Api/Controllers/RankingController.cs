using System.Net;
using Microsoft.AspNetCore.Mvc;
using Ranking.Api.Dtos;
using Ranking.Api.Services.Ranking;

namespace Ranking.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class RankingController : ControllerBase
{
  private readonly ILogger<RankingController> _logger;
  private readonly IRanking _ranking;

  public RankingController(ILogger<RankingController> logger, IRanking ranking)
  {
    _logger = logger;
    _ranking = ranking;
  }

  [HttpGet]
  [ProducesResponseType(typeof(IEnumerable<RankingItemDto>), (int)HttpStatusCode.OK)]
  public async Task<ActionResult> Get([FromQuery] int limit = 15)
  {
    return Ok((await _ranking.GetRanking(limit)).Select(it => new RankingItemDto { UserName = it.UserName, TimeInMs = it.TimeInMs }));
  }
  
  [HttpPut]
  [ProducesResponseType(typeof(IEnumerable<RankingItemDto>), (int)HttpStatusCode.OK)]
  public async Task<ActionResult> AddNewGameResult([FromBody] GameResultDto gameResult)
  {
    await _ranking.AddGameResult(gameResult.ToGameResult());
    return Ok();
  }
}
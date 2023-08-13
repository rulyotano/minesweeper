using System.ComponentModel.DataAnnotations;
using Ranking.Api.Domain;

namespace Ranking.Api.Dtos;

public class GameResultDto
{
  [Required]
  public int TimeInMs { get; set; }

  [Required]
  public string UserName { get; set; }

  [Required]
  public string GameSize { get; set; }

  public GameResult ToGameResult()
   => new GameResult
   {
    TimeInMs=TimeInMs,
    UserName=UserName,
    GameSize=Enum.Parse<GameSize>(GameSize, ignoreCase: true),
   };
}
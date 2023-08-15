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

  public string Device { get; set; }

  public GameResult ToGameResult()
   => new GameResult
   {
     TimeInMs = TimeInMs,
     UserName = UserName,
     GameSize = Enum.TryParse(GameSize, ignoreCase: true, out GameSize gameSize)
      ? gameSize : Domain.GameSize.Beginner,
     Device = Enum.TryParse(Device, ignoreCase: true, out Device device)
      ? device : Domain.Device.Desktop,
     DateTime = DateTime.UtcNow
   };
}
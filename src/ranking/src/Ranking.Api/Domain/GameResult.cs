namespace Ranking.Api.Domain;
public class GameResult
{
  public int TimeInMs { get; set; }
  public string UserName { get; set; }
  public GameSize GameSize { get; set; }
  public DateTime DateTime { get; set; }
  public Device Device { get; set; }
}

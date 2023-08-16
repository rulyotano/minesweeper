using Ranking.Api.Domain;

namespace Ranking.Api.Services.Ranking;

public class RankingInMemory : IRanking
{
  private SortedList<int, GameResult> _ranking = new SortedList<int, GameResult> 
  {
    { 12000, new GameResult { DateTime = DateTime.UtcNow, Device = Device.Desktop, GameSize = GameSize.Beginner, TimeInMs=12000, UserName = "rulyotano" } },
    { 25000, new GameResult { DateTime = DateTime.UtcNow.AddMinutes(-100), Device = Device.Desktop, GameSize = GameSize.Beginner, TimeInMs=25000, UserName = "rulyotano" } },
    { 80000, new GameResult { DateTime = DateTime.UtcNow.AddMinutes(-60), Device = Device.Desktop, GameSize = GameSize.Intermediate, TimeInMs=80000, UserName = "rick8080" } },
    { 124000, new GameResult { DateTime = DateTime.UtcNow.AddMinutes(-300), Device = Device.Desktop, GameSize = GameSize.Expert, TimeInMs=124000, UserName = "rachelbolufe" } },
  };
  public Task AddGameResult(GameResult gameResult)
  {
    _ranking.Add(gameResult.TimeInMs, gameResult);
    return Task.CompletedTask;
  }

  public Task<IEnumerable<GameResult>> GetRanking(GameSize gameSize, int size = 15)
  {
    return Task.FromResult(_ranking
                            .Where(it => it.Value.GameSize == gameSize)
                            .Take(size)
                            .Select(it => it.Value));
  }
}

public interface IRanking
{
  Task<IEnumerable<GameResult>> GetRanking(GameSize gameSize, int size = 15);
  Task AddGameResult(GameResult gameResult);
}
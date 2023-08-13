using Ranking.Api.Domain;

namespace Ranking.Api.Services.Ranking;

public class RankingInMemory : IRanking
{
  private SortedList<int, GameResult> _ranking = new SortedList<int, GameResult>();
  public Task AddGameResult(GameResult gameResult)
  {
    _ranking.Add(gameResult.TimeInMs, gameResult);
    return Task.CompletedTask;
  }

  public Task<IEnumerable<GameResult>> GetRanking(int size = 15)
  {
    return Task.FromResult(_ranking.Take(size).Select(it => it.Value));
  }
}

public interface IRanking
{
  Task<IEnumerable<GameResult>> GetRanking(int size = 15);
  Task AddGameResult(GameResult gameResult);
}
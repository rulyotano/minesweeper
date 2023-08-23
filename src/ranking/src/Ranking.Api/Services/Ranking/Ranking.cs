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
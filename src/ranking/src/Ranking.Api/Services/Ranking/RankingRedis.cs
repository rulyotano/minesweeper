using Ranking.Api.Domain;
using StackExchange.Redis;

namespace Ranking.Api.Services.Ranking;

public class RankingRedis : IRanking
{
  private readonly IRedisProvider redisProvider;

  public RankingRedis(IRedisProvider redisProvider)
  {
    this.redisProvider = redisProvider;
  }

  public async Task AddGameResult(GameResult gameResult)
  {
    var database = redisProvider.Redis.GetDatabase();
    await database.SortedSetAddAsync(
      GetKey(gameResult.GameSize),
      new[]
      {
        new SortedSetEntry(new RedisValue(gameResult.UserName), gameResult.TimeInMs)
      }, SortedSetWhen.LessThan);
  }

  public async Task<IEnumerable<RankingListItem>> GetRanking(GameSize gameSize, int size = 15)
  {
    var database = redisProvider.Redis.GetDatabase();

    var dbResult = await database.SortedSetRangeByRankWithScoresAsync(GetKey(gameSize), 0, size - 1);
    return dbResult.Select((it, i) => new RankingListItem(i + 1, (int)it.Score, it.Element));
  }

  private static string GetKey(GameSize gameSize) => $"ranking-{gameSize.ToString().ToLowerInvariant()}";
}
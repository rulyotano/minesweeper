using Microsoft.Extensions.Diagnostics.HealthChecks;

public class RedisHealthCheck : IHealthCheck
{
  private readonly IRedisProvider redisProvider;

  public RedisHealthCheck(IRedisProvider redisProvider)
  {
    this.redisProvider = redisProvider;
  }

  public async Task<HealthCheckResult> CheckHealthAsync(
      HealthCheckContext context, CancellationToken cancellationToken = default)
  {

    try
    {
      var redisDatabase = redisProvider.Redis.GetDatabase();
      await redisDatabase.StringSetAndGetAsync("healthcheck", "check");
    }
    catch (Exception e)
    {
      return HealthCheckResult.Unhealthy(e.Message);
    }
    return HealthCheckResult.Healthy();
  }
}
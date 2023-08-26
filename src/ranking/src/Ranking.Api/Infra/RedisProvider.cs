using StackExchange.Redis;

public interface IRedisProvider
{
  ConnectionMultiplexer Redis { get; }
}

public class RedisProvider : IRedisProvider
{
  private ConnectionMultiplexer redis;
  private readonly IConfiguration configuration;

  public RedisProvider(IConfiguration configuration)
  {
    this.configuration = configuration;
  }

  public ConnectionMultiplexer Redis
  {
    get
    {
      if (redis is null) redis = GetRedisConnection();
      if (!redis.IsConnected)
      {
        redis = GetRedisConnection();
      }
      return redis;
    }
  }

  private ConnectionMultiplexer GetRedisConnection()
    => ConnectionMultiplexer.Connect(configuration.GetConnectionString(RedisConfig.RedisConfigKey));
}
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Ranking.Api.Services.Ranking;
using Microsoft.AspNetCore.Authentication.JwtBearer;

const string FromAllowedDomains = "_fromAllowedDomains";

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddCors(options =>
                          options.AddPolicy(name: FromAllowedDomains,
                                            policy =>
                                            {
                                              policy.WithOrigins(
                                                      "http://localhost:3000",
                                                      "http://web.minesweeper.localhost",
                                                      "https://minesweeper.rulyotano.com")
                                                    .AllowAnyHeader()
                                                    .AllowAnyMethod();
                                            }));

builder.Services.AddControllers();
builder.Services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer(options =>
        {
            var authConfig = new AuthConfig();
            builder.Configuration.GetSection(AuthConfig.AuthConfigName).Bind(authConfig);
            options.Authority = authConfig.Authority;
            options.Audience = authConfig.Audience;
        });
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<IRanking, RankingRedis>();
builder.Services.AddSingleton<IRedisProvider, RedisProvider>();
builder.Services.AddHealthChecks()
  .AddCheck("self", () => HealthCheckResult.Healthy(), tags: new[] { "internal" }, TimeSpan.FromSeconds(5))
  .AddCheck<RedisHealthCheck>("redis", tags: new [] { "external" });
builder.Services.Configure<AuthConfig>(builder.Configuration.GetSection(AuthConfig.AuthConfigName));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

app.UseCors(FromAllowedDomains);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapHealthChecks("/ready", new HealthCheckOptions
{
    Predicate = healthCheck => healthCheck.Tags.Contains("internal")
});

app.MapHealthChecks("/live", new HealthCheckOptions
{
    Predicate = healthCheck => healthCheck.Tags.Contains("external")
});

app.Run();

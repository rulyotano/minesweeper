using Ranking.Api.Services.Ranking;

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
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<IRanking, RankingInMemory>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

app.UseCors(FromAllowedDomains);

app.UseAuthorization();

app.MapControllers();

app.Run();

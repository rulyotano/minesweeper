public class RankingListItem
{
  public RankingListItem(int ranking, int timeInMs, string userName)
  {
    Ranking = ranking;
    TimeInMs = timeInMs;
    UserName = userName;
  }
  public int Ranking { get; set; }
  public int TimeInMs { get; set; }
  public string UserName { get; set; }
}
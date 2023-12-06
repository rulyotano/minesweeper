import moment from "moment";

export interface IBoardConfiguration {
  rows: number;
  columns: number;
  mines: number;
  name: string;
}

export interface IGameConfigurations {
  beginner: IBoardConfiguration;
  intermediate: IBoardConfiguration;
  expert: IBoardConfiguration;
  custom: IBoardConfiguration;
}

export const gameConfigurations: IGameConfigurations = {
  beginner: {
    rows: 9,
    columns: 9,
    mines: 10,
    name: "beginner"
  },
  intermediate: {
    rows: 16,
    columns: 16,
    mines: 40,
    name: "intermediate"
  },
  expert: { rows: 16, columns: 30, mines: 99, name: "expert" },
  custom: { rows: -1, columns: -1, mines: -1, name: "custom" }
};

class GameConfigurationCollection {
  configurations: Array<IBoardConfiguration> = [
    gameConfigurations.beginner,
    gameConfigurations.intermediate,
    gameConfigurations.expert,
  ]

  static configurationMatchSize(config: IBoardConfiguration, rows: number, columns: number)
  {
    return config.rows === rows && config.columns === columns;
  }
  getConfiguration(rows: number, columns: number){
    return this.configurations.filter(
      c => GameConfigurationCollection.configurationMatchSize(c, rows, columns))[0]
        || this.configurations[0];
  }
  getConfigurationByName(name: string){
    return this.configurations.filter(c => c.name === name)[0] || this.configurations[0];
  }
}
export const gameConfigurationsCollection = new GameConfigurationCollection();

export const isCustomConfiguration = (configuration: IBoardConfiguration): boolean =>
  configuration.rows < 0;

export const calculateTimeElapsed = (
  startTime: Date | null,
  finishTime: Date | null
) => {
  if (!startTime) return 0;
  const lastComparingTime = finishTime ? moment(finishTime) : moment();
  const start = moment(startTime);

  return lastComparingTime.diff(start, "second");
};
import moment from "moment";

export interface IBoardConfiguration {
  rows: number;
  columns: number;
  mines: number;
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
    mines: 10
  },
  intermediate: {
    rows: 16,
    columns: 16,
    mines: 40
  },
  expert: { rows: 16, columns: 30, mines: 99 },
  custom: { rows: -1, columns: -1, mines: -1 }
};

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

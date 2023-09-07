import { IBoardConfiguration, gameConfigurationsCollection } from "../../helpers/gameHelper";

export interface ParamsType {
    winKey: string;
}

export interface GameState {
    startedMs: number;
    finishedMs: number;
    level: IBoardConfiguration;
    creationTime: number;
}

export const defaultGameState = {
  startedMs: 0,
  finishedMs: 0,
  level: gameConfigurationsCollection.getConfigurationByName("beginner"),
};

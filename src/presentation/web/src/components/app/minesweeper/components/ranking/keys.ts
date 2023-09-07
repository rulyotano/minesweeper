import { baseDateMilliseconds } from "../../../../../settings";
import { GameState } from "./types";

const MAX_KEY_DURATION_MS = 10*60*1000;
const PENDING_RANKING_STORAGE_KEY = "pending-ranking";

const getDateSecond = (date: Date | null, defaultValue: number | null = null) => {
  if (!date && defaultValue) return defaultValue;
  const useDate = date || new Date();
  return useDate.valueOf() - baseDateMilliseconds
}

const isGameStateStillValid = (gameState: GameState): boolean => {
  return getDateSecond(new Date()) - gameState.creationTime < MAX_KEY_DURATION_MS;
}

const getGameStateFromStorage = () => {
  const storageKeyValue = localStorage.getItem(PENDING_RANKING_STORAGE_KEY);
  if (!storageKeyValue) return null;
  const decodedStorageValue = atob(storageKeyValue);
  const parsedStorageValue = JSON.parse(decodedStorageValue);
  const gameSate = parsedStorageValue as GameState;
  if (gameSate && isGameStateStillValid(gameSate)) return gameSate;
  return null;
}
const saveGameStateToStorage = (gameState: GameState) => {
  gameState.creationTime = getDateSecond(new Date());
  localStorage.setItem(PENDING_RANKING_STORAGE_KEY, btoa(JSON.stringify(gameState)));
}

export class SubmitKeyHelper
{
  static getDateSecond(date: Date | null, defaultValue: number | null = null) {
    return getDateSecond(date, defaultValue);
  }
  static getSavedGameState(): GameState | null {
    return getGameStateFromStorage();    
  }
  static saveGameState(gameState: GameState) {
    saveGameStateToStorage(gameState);
  }
  static clearSavedGameState() {
    localStorage.removeItem(PENDING_RANKING_STORAGE_KEY);
  }
}

export default new SubmitKeyHelper();
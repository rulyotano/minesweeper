import { baseDateMilliseconds } from "../../../../../settings";
import { GameState, defaultGameState } from "./types";

const MAX_KEY_DURATION_MS = 10*60*1000;

const createKey = (keyTimeMs: number) => `${keyTimeMs}-${Math.floor(Math.random()*10000)}`
const createKeyEncoded = (keyTimeMs: number) => btoa(createKey(keyTimeMs))
const decodeKey = (encodedKey: string) => atob(encodedKey)
const getTimeFromEncodedKey = 
  (encodedKey: string) => getMaxDurationFromKey(decodeKey(encodedKey));
const getMaxDurationFromKey = (key: string) =>
{
  if (!key) return 0;
  const splitted = key.split("-");
  if (splitted.length === 0) return 0;
  return Number(splitted[0]);
}
const getGameStateFromStorage = (key: string) => {
  const storageValue = localStorage.getItem(key);
  console.log(storageValue);
  if (!storageValue) return null;
  const gameState = JSON.parse(storageValue);
  console.log("parsed value:");
  console.log(JSON.stringify(gameState, null, 2))
  if (!(gameState as GameState)) return null;
  return gameState as GameState;
}

export class SubmitKeyHelper
{
  static getDateSecond(date: Date | null, defaultValue: number | null = null) {
    if (!date && defaultValue) return defaultValue;
    const useDate = date || new Date();
    return useDate.valueOf() - baseDateMilliseconds
  }
  static getGameStateFromKey(key: string): GameState {
    const gameState = getGameStateFromStorage(key);
    console.log("game state as:")
    console.log(gameState)
    const keyTime = getTimeFromEncodedKey(key);
    const currentTime = SubmitKeyHelper.getDateSecond(new Date());
    console.log(`key time: ${keyTime}, current time: ${currentTime}. diff = ${currentTime - keyTime}, and max diff = ${MAX_KEY_DURATION_MS}`)
    if (!gameState || currentTime - keyTime > MAX_KEY_DURATION_MS) return defaultGameState;
    return gameState;
    
  }
  static getKeyFromGameState(gameState: GameState): string {
    const currentTime = SubmitKeyHelper.getDateSecond(new Date());
    const key = createKeyEncoded(currentTime);

    localStorage.setItem(key, JSON.stringify(gameState));

    return key;
  }
  static removeKey(key: string) {
    localStorage.removeItem(key);
  }
}

export default new SubmitKeyHelper();
import moment from "moment";
import { isCustomConfiguration, gameConfigurations, calculateTimeElapsed } from "../gameHelper";

describe("src > components > minesweeper > helpers > gameHelper", () => {
  beforeEach(() => {});

  afterEach(() => {});

  describe("isCustomConfiguration", () => {
    test("when custom configuration should return true", () => {
      const result = isCustomConfiguration(gameConfigurations.custom);

      expect(result).toBeTruthy();
    });

    test("when beginner configuration should return false", () => {
      const result = isCustomConfiguration(gameConfigurations.beginner);

      expect(result).toBeFalsy();
    });

    test("when intermediate configuration should return false", () => {
      const result = isCustomConfiguration(gameConfigurations.intermediate);

      expect(result).toBeFalsy();
    });

    test("when expert configuration should return false", () => {
      const result = isCustomConfiguration(gameConfigurations.expert);

      expect(result).toBeFalsy();
    });
  });

  describe("calculateTimeElapsed()", () => {
    let dateNowSpy: jest.SpyInstance;
    const startTime = moment("2020-01-01").toDate();
    const endTime = moment(startTime).add(350, "second").toDate();
    const nowTime = moment(startTime).add(300, "second").toDate();

    beforeEach(() => {
      dateNowSpy = jest.spyOn(Date, "now").mockImplementation(() => nowTime.valueOf());
    });

    afterEach(() => {
      dateNowSpy.mockRestore();
    });

    test("when running time, should return now - start time", () => {
      const result = calculateTimeElapsed(startTime, null);
      expect(result).toBe((nowTime.valueOf() - startTime.valueOf()) / 1000);
    });

    test("when already finished time, should return end time - start time", () => {
      const result = calculateTimeElapsed(startTime, endTime);
      expect(result).toBe((endTime.valueOf() - startTime.valueOf()) / 1000);
    });

    test("when game is no started should return 0", () => {
      const result = calculateTimeElapsed(null, null);
      expect(result).toBe(0);
    });
  });
});

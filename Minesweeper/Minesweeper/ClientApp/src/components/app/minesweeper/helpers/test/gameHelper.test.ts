import { isCustomConfiguration, gameConfigurations } from "../gameHelper";

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
});

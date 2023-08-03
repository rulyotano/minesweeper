import {{name}}, { exportToTest } from "../{{name}}";
import thingToMock from "../thingToMockPath";

jest.mock("../thingToMockPath");

describe("... > {{name}}", () => {
  beforeEach(() => {});

  afterEach(() => {
    thingToMock.someMethod.mockReset();
  });

  test("should do something", () => {
    thingToMock.someMethod.mockReturnValue("Some mock value");

    {{name}}();
    exportToTest();

    expect(thingToMock.someMethod).toBeCalled();
  });
});

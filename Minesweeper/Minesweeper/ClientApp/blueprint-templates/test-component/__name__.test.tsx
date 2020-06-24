import React from "react";
import { shallow } from "enzyme";
import {{pascalCase name}} from "../{{name}}";

// jest.mock("../defaultMenuItems");

describe("components > ... > {{name}}", () => {
  const componentCreation = (props: any) => {
    return <{{pascalCase name}} {...props} />;
  };

  const shallowWrapper = (props = {}) => {
    return shallow(componentCreation(props));
  };

  beforeEach(() => {});
  
  afterEach(() => {});

  test("Component is mounted", () => {
    const wrapper = shallowWrapper();
    expect(wrapper.exists()).toBeTruthy();
  });
});

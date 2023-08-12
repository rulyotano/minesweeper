import React from "react";
import { mount } from "enzyme";
import InfoBar, { InfoBarProps } from "../InfoBar";

jest.mock("../../SizeSelector", () => () => null);

describe("components > infoBar > InfoBar", () => {
  const componentCreation = (props: InfoBarProps) => {
    return <InfoBar {...props} />;
  };

  const mountWrapper = (props: InfoBarProps = getDefaultProps()) => {
    return mount(componentCreation(props));
  };

  beforeEach(() => { });

  afterEach(() => { });

  test("Component is mounted", () => {
    const wrapper = mountWrapper();
    expect(wrapper.exists()).toBeTruthy();
  });

  const getDefaultProps = (): InfoBarProps => ({
    gameState: {
      isLost: false, isWin: false
    },
    onReset: () => {},
    time: {
      endTime: new Date(),
      startTime: new Date()
    }
  });
});

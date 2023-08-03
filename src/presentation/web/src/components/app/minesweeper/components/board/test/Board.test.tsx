import React from "react";
import { shallow } from "enzyme";
import Board, { BoardProps } from "../Board";
import { Cell } from "../../../helpers/cellHelper";
import { boardFromString } from "../../../helpers/boardHelper";
import TableCell from "../TableCell";

// jest.mock("../defaultMenuItems");

describe("components > app > minesweeper > components > board > Board", () => {
  const componentCreation = (props: any) => {
    return <Board {...props} />;
  };

  const shallowWrapper = (props = getPropsWithBoard()) => {
    return shallow(componentCreation(props));
  };

  beforeEach(() => {});

  afterEach(() => {});

  test("Component is mounted", () => {
    const wrapper = shallowWrapper();
    expect(wrapper.exists()).toBeTruthy();
  });
  
  test("should render all table cells", () => {
    const wrapper = shallowWrapper();
    
    const cells = wrapper.find(TableCell);
    expect(cells).toHaveLength(9);
  });

  const getDefaultBoard = () =>
    boardFromString(`...|
                     .*.|
                     ..*`);
  const getPropsWithBoard = (board: Cell[][] = getDefaultBoard()): BoardProps => ({
    board,
    discoverCell: jest.fn(),
    toggleCellMark: jest.fn(),
    discoverSurrounding: jest.fn()
  });
});

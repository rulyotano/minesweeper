import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { createStore } from "redux";
import TableCell, { TableCellProps } from "../TableCell";
import { buildCell, Cell, CellStatus } from "../../../helpers/cellHelper";
import { initialState, ReducerState } from "../../../_duck/reducer";
import { MinesweeperAction } from "../../../_duck/types";

// jest.mock("../defaultMenuItems");

describe("components > app > minesweeper > components > board > Cell", () => {
  const componentCreation = (props: TableCellProps, cell: Cell) => {
    const store = createStore(() => {
      return ({
        minesweeper: {
          ...initialState,
          boardCells: { [cell.Key]: cell }
        }
      })
    })
    return <Provider store={store}><TableCell {...props} /></Provider>;
  };

  const mountWrapper = (props = getPropsWithCell(), cell: Cell) => {
    return mount(componentCreation(props, cell));
  };

  beforeEach(() => { });

  afterEach(() => { });

  test("When cell is status is revealed number", () => {
    const cell = getDefaultCell();
    cell.Status = CellStatus.DiscoveredAndNumber;
    cell.MinesAround = 5;

    const wrapper = mountWrapper(getPropsWithCell(cell), cell);
    const cellNumber = wrapper.find(`#${CELL_NUMBER_ID}`);
    expect(cellNumber).not.toHaveLength(0);
    expect(cellNumber.first().text()).toEqual(`${cell.MinesAround}`);

    const cellFlag = wrapper.find(`#${CELL_FLAG_ID}`);
    expect(cellFlag).toHaveLength(0);
  });

  test("When cell is marked as mine should show flag", () => {
    const cell = getDefaultCell();
    cell.Status = CellStatus.MarkedAsMine;
    cell.MinesAround = 5;

    const wrapper = mountWrapper(getPropsWithCell(cell), cell);

    const cellFlag = wrapper.find(`#${CELL_FLAG_ID}`);
    expect(cellFlag).not.toHaveLength(0);

    const cellNumber = wrapper.find(`#${CELL_NUMBER_ID}`);
    expect(cellNumber).toHaveLength(0);
  });

  test("When cell is marked as mine but empty should show wrong flag", () => {
    const cell = getDefaultCell();
    cell.Status = CellStatus.MarkedAsMineButEmpty;
    cell.MinesAround = 5;

    const wrapper = mountWrapper(getPropsWithCell(cell), cell);

    const cellFlag = wrapper.find(`#${CELL_WRONG_FLAG_ID}`);
    expect(cellFlag).not.toHaveLength(0);

    const cellNumber = wrapper.find(`#${CELL_NUMBER_ID}`);
    expect(cellNumber).toHaveLength(0);
  });

  test("When cell is exploited mine should show mine-explosion", () => {
    const cell = getDefaultCell();
    cell.Status = CellStatus.ExploitedMine;
    cell.MinesAround = 5;

    const wrapper = mountWrapper(getPropsWithCell(cell), cell);

    const cellFlag = wrapper.find(`#${CELL_EXPLOSION_FLAG_ID}`);
    expect(cellFlag).not.toHaveLength(0);

    const cellNumber = wrapper.find(`#${CELL_NUMBER_ID}`);
    expect(cellNumber).toHaveLength(0);
  });

  test("when cell left clicked should reveal cell", () => {
    const cell = getDefaultCell();
    const props = getPropsWithCell(cell);

    const wrapper = mountWrapper(props, cell);
    wrapper.simulate("mouseUp", leftButtonEvent);

    expect(props.discoverCell).toHaveBeenCalledWith(cell);
    expect(props.discoverSurrounding).not.toHaveBeenCalled();
    expect(props.toggleCellMark).not.toHaveBeenCalled();
  });

  test("when cell right clicked should toggle cell", () => {
    const cell = getDefaultCell();
    const props = getPropsWithCell(cell);

    const wrapper = mountWrapper(props, cell);
    wrapper.simulate("mouseUp", rightButtonEvent);

    expect(props.discoverCell).not.toHaveBeenCalled();
    expect(props.discoverSurrounding).not.toHaveBeenCalled();
    expect(props.toggleCellMark).toHaveBeenCalledWith(cell);
  });

  test("when cell left and right mouse down, then mouse up should only reveal surrounding", () => {
    const cell = getDefaultCell();
    const props = getPropsWithCell(cell);

    const wrapper = mountWrapper(props, cell);
    wrapper.simulate("mouseDown", leftButtonEvent);
    wrapper.simulate("mouseDown", rightButtonEvent);
    wrapper.simulate("mouseUp", leftButtonEvent);

    expect(props.discoverCell).not.toHaveBeenCalled();
    expect(props.discoverSurrounding).toHaveBeenCalledWith(cell);
    expect(props.toggleCellMark).not.toHaveBeenCalled();
  });

  test("when cell right and left mouse down, then mouse up should only reveal surrounding", () => {
    const cell = getDefaultCell();
    const props = getPropsWithCell(cell);

    const wrapper = mountWrapper(props, cell);
    wrapper.simulate("mouseDown", rightButtonEvent);
    wrapper.simulate("mouseDown", leftButtonEvent);
    wrapper.simulate("mouseUp", leftButtonEvent);

    expect(props.discoverCell).not.toHaveBeenCalled();
    expect(props.discoverSurrounding).toHaveBeenCalledWith(cell);
    expect(props.toggleCellMark).not.toHaveBeenCalled();
  });

  test("when double click should only reveal surrounding", () => {
    const cell = getDefaultCell();
    const props = getPropsWithCell(cell);

    const wrapper = mountWrapper(props, cell);
    wrapper.simulate("doubleClick", leftButtonEvent);

    expect(props.discoverCell).not.toHaveBeenCalled();
    expect(props.discoverSurrounding).toHaveBeenCalledWith(cell);
    expect(props.toggleCellMark).not.toHaveBeenCalled();
  });

  const leftButtonEvent = { button: 1 };
  const rightButtonEvent = { button: 2 };

  const getDefaultCell = () => buildCell(0, 0);
  const getPropsWithCell = (cell: Cell = getDefaultCell()): TableCellProps => ({
    cellKey: cell.Key,
    discoverCell: jest.fn(),
    toggleCellMark: jest.fn(),
    discoverSurrounding: jest.fn()
  });
  const CELL_NUMBER_ID = "cell-number";
  const CELL_FLAG_ID = "flag";
  const CELL_WRONG_FLAG_ID = "wrong-flag";
  const CELL_EXPLOSION_FLAG_ID = "mine-explosion";
});

import { Thunk } from "redux-testkit";
import { mocked } from "ts-jest";
import _ from "lodash";
import {
  RESET,
  BEGIN_GAME,
  UPDATE_BOARD,
  FINISH_GAME,
  INITIALIZE_BOARD,
  FinishGameAction,
  UpdateBoardAction,
  MinesweeperAction
} from "../types";
import * as actions from "../actions";
import * as boardHelper from "../../helpers/boardHelper";
import { CellStatus, Cell, buildCell } from "../../helpers/cellHelper";
import { ApplicationState, AppThunkAction } from "../../../../../store";

const { buildBoard } = boardHelper;

describe("components > app > minesweeper > actions", () => {
  const ROWS = 12;
  const COLUMNS = 12;
  const MINES = 30;
  const getFakeBoard = () => buildBoard(ROWS, COLUMNS, 3, 3, 30);
  const fakeBoard = getFakeBoard();

  afterEach(() => {});

  describe("cellClick", () => {
    test(`When cell is mine, should reveal it, and mark it as exploded, mark not discovered mines as mines, 
          mark (marked as mine) as marked as mine but empty and mark the game as finished`, async () => {
      const TEST_ROW = 3;
      const TEST_COLUMN = 3;
      const MARKED_NOT_MINE_ROW = 1;
      const MARKED_NOT_MINE_COLUMN = 1;
      const MINE_NO_DISCOVERED_ROW = 0;
      const MINE_NO_DISCOVERED_COLUMN = 0;
      const customFakeBoard = getFakeBoard();
      customFakeBoard[MARKED_NOT_MINE_ROW][MARKED_NOT_MINE_COLUMN].IsMine = false;
      customFakeBoard[MARKED_NOT_MINE_ROW][MARKED_NOT_MINE_COLUMN].Status = CellStatus.MarkedAsMine;
      customFakeBoard[MINE_NO_DISCOVERED_ROW][MINE_NO_DISCOVERED_COLUMN].IsMine = true;
      customFakeBoard[MINE_NO_DISCOVERED_ROW][MINE_NO_DISCOVERED_COLUMN].Status =
        CellStatus.UnDiscovered;

      customFakeBoard[TEST_ROW][TEST_COLUMN] = {
        ...customFakeBoard[TEST_ROW][TEST_COLUMN],
        IsMine: true
      };
      const fakeState = getStateWithBoard(customFakeBoard);

      const dispatches = await Thunk(actions.cellClick)
        .withState(fakeState)
        .execute(TEST_ROW, TEST_COLUMN);
      expect(dispatches).toHaveLength(1);
      const finishGameAction = dispatches[0].getAction() as FinishGameAction;
      expect(finishGameAction.type).toBe(FINISH_GAME);
      expect(finishGameAction.board[TEST_ROW][TEST_COLUMN].Status).toBe(CellStatus.ExploitedMine);
      expect(finishGameAction.board[MARKED_NOT_MINE_ROW][MARKED_NOT_MINE_COLUMN].Status).toBe(
        CellStatus.MarkedAsMineButEmpty
      );
      expect(finishGameAction.board[MINE_NO_DISCOVERED_ROW][MINE_NO_DISCOVERED_COLUMN].Status).toBe(
        CellStatus.Mine
      );
    });

    test("When is NO mine, should reveal all cells that should be revealed", async () => {
      const TEST_ROW = 3;
      const TEST_COLUMN = 3;
      const customFakeBoard = getFakeBoard();
      customFakeBoard[TEST_ROW][TEST_COLUMN] = {
        ...customFakeBoard[TEST_ROW][TEST_COLUMN],
        IsMine: false
      };
      const fakeState = getStateWithBoard(customFakeBoard);

      const getCellsToRevealMocked = jest
        .spyOn(boardHelper, "getCellsToReveal")
        .mockReturnValueOnce([
          buildCell(1, 1, CellStatus.UnDiscovered, 0, false),
          buildCell(2, 2, CellStatus.UnDiscovered, 2, false)
        ]);

      const dispatches = await Thunk(actions.cellClick)
        .withState(fakeState)
        .execute(TEST_ROW, TEST_COLUMN);

      expect(getCellsToRevealMocked).toBeCalledTimes(1);
      expect(dispatches).toHaveLength(1);

      const updateBoardAction = dispatches[0].getAction() as UpdateBoardAction;
      expect(updateBoardAction.type).toBe(UPDATE_BOARD);
      expect(updateBoardAction.board[1][1].Status).toBe(CellStatus.DiscoveredAndEmpty);
      expect(updateBoardAction.board[2][2].Status).toBe(CellStatus.DiscoveredAndNumber);
    });
  });

  describe("revealSurroundingNoMarkedMines", () => {
    test("when cells mines are equal to surrounding marked mines, should click on all surrounding (no mines) cells", async () => {
      const { fakeBoard, testRow, testColumn } = getBoardConfiguration();
      const fakeState = getStateWithBoard(fakeBoard);

      const dispatches = await Thunk(actions.revealSurroundingNoMarkedMines)
        .withState(fakeState)
        .execute(testRow, testColumn);

      expect(dispatches).toHaveLength(5);
    });

    test("when main cell is not number revealed, do nothing", async () => {
      const { fakeBoard, testRow, testColumn } = getBoardConfiguration();
      fakeBoard[1][1].Status = CellStatus.UnDiscovered;
      const fakeState = getStateWithBoard(fakeBoard);

      const dispatches = await Thunk(actions.revealSurroundingNoMarkedMines)
        .withState(fakeState)
        .execute(testRow, testColumn);

      expect(dispatches).toHaveLength(0);
    });

    test("when have more cells marked as mines that current number, do nothing", async () => {
      const { fakeBoard, testRow, testColumn } = getBoardConfiguration();
      fakeBoard[0][0].Status = CellStatus.MarkedAsMine;
      const fakeState = getStateWithBoard(fakeBoard);

      const dispatches = await Thunk(actions.revealSurroundingNoMarkedMines)
        .withState(fakeState)
        .execute(testRow, testColumn);

      expect(dispatches).toHaveLength(0);
    });

    test("when have less cells marked as mines that current number, do nothing", async () => {
      const { fakeBoard, testRow, testColumn } = getBoardConfiguration();
      fakeBoard[1][1].Status = CellStatus.UnDiscovered;
      const fakeState = getStateWithBoard(fakeBoard);

      const dispatches = await Thunk(actions.revealSurroundingNoMarkedMines)
        .withState(fakeState)
        .execute(testRow, testColumn);

      expect(dispatches).toHaveLength(0);
    });

    test("when finished game, do nothing", async () => {
      const { fakeBoard, testRow, testColumn } = getBoardConfiguration();
      fakeBoard[1][1].Status = CellStatus.UnDiscovered;
      const fakeState = getStateWithBoard(fakeBoard);
      fakeState.minesweeper.gameFinishTime = new Date();

      const dispatches = await Thunk(actions.revealSurroundingNoMarkedMines)
        .withState(fakeState)
        .execute(testRow, testColumn);

      expect(dispatches).toHaveLength(0);
    });

    const getBoardConfiguration = () => {
      const TEST_ROW = 1;
      const TEST_COLUMN = 1;
      const customFakeBoard = boardHelper.boardFromString(`..*|
                                                           *..|
                                                           .*.`);
      customFakeBoard[1][1].Status = CellStatus.DiscoveredAndNumber;
      customFakeBoard[0][2].Status = CellStatus.MarkedAsMine;
      customFakeBoard[1][0].Status = CellStatus.MarkedAsMine;
      customFakeBoard[2][1].Status = CellStatus.MarkedAsMine;

      return {
        testRow: TEST_ROW,
        testColumn: TEST_COLUMN,
        fakeBoard: customFakeBoard
      };
    };
  });

  describe("switchMarkAsMine", () => {
    test("when cell is not marked as mine or empty should do nothing", async () => {
      const { fakeBoard, testRow, testColumn } = getBoardConfiguration();
      fakeBoard[testRow][testColumn].Status = CellStatus.DiscoveredAndEmpty;

      const fakeState = getStateWithBoard(fakeBoard);

      const dispatches = await Thunk(actions.switchMarkAsMine)
        .withState(fakeState)
        .execute(testRow, testColumn);

      expect(dispatches).toHaveLength(0);
    });

    test("when cell is marked as mine should switch it to empty", async () => {
      const { fakeBoard, testRow, testColumn } = getBoardConfiguration();
      fakeBoard[testRow][testColumn].Status = CellStatus.MarkedAsMine;

      const fakeState = getStateWithBoard(fakeBoard);

      const dispatches = await Thunk(actions.switchMarkAsMine)
        .withState(fakeState)
        .execute(testRow, testColumn);

      expect(dispatches).toHaveLength(1);
      const newBoard = (dispatches[0].getAction() as UpdateBoardAction).board;
      expect(newBoard[testRow][testColumn].Status).toBe(CellStatus.UnDiscovered);
    });

    test("when cell is empty should switch it to marked as mine", async () => {
      const { fakeBoard, testRow, testColumn } = getBoardConfiguration();
      fakeBoard[testRow][testColumn].Status = CellStatus.UnDiscovered;

      const fakeState = getStateWithBoard(fakeBoard);

      const dispatches = await Thunk(actions.switchMarkAsMine)
        .withState(fakeState)
        .execute(testRow, testColumn);

      expect(dispatches).toHaveLength(1);
      const newBoard = (dispatches[0].getAction() as UpdateBoardAction).board;
      expect(newBoard[testRow][testColumn].Status).toBe(CellStatus.MarkedAsMine);
    });

    test("discovered cells should be the same than before", async () => {
      const { fakeBoard, testRow, testColumn } = getBoardConfiguration();
      fakeBoard[testRow][testColumn].Status = CellStatus.UnDiscovered;
      const FAKE_DISCOVERED_CELLS = 5;

      const fakeState = getStateWithBoard(fakeBoard);
      fakeState.minesweeper.discoveredCells = FAKE_DISCOVERED_CELLS;

      const dispatches = await Thunk(actions.switchMarkAsMine)
        .withState(fakeState)
        .execute(testRow, testColumn);

      expect(dispatches).toHaveLength(1);
      const newDiscovered = (dispatches[0].getAction() as UpdateBoardAction).discoveredCells;
      expect(newDiscovered).toBe(FAKE_DISCOVERED_CELLS);
    });

    const getBoardConfiguration = () => {
      const TEST_ROW = 1;
      const TEST_COLUMN = 0;
      const customFakeBoard = boardHelper.boardFromString(`..|
                                                           *.`);
      return {
        testRow: TEST_ROW,
        testColumn: TEST_COLUMN,
        fakeBoard: customFakeBoard
      };
    };
  });

  test("resetAction() should return action with type RESET", () => {
    const action = actions.resetAction();

    expect(action.type).toBe(RESET);
  });

  test("beginAction() should return action with type BEGIN_GAME", () => {
    const action = actions.beginAction(fakeBoard, ROWS, COLUMNS, MINES);

    expect(action.type).toBe(BEGIN_GAME);
    expect(action.board).toBe(fakeBoard);
    expect(action.rows).toBe(ROWS);
    expect(action.columns).toBe(COLUMNS);
    expect(action.mines).toBe(MINES);
  });

  test("finishAction() should return action with type FINISH_GAME", () => {
    const action = actions.finishAction(fakeBoard);

    expect(action.type).toBe(FINISH_GAME);
    expect(action.board).toBe(fakeBoard);
  });

  test("updateBoardAction() should return action with type UPDATE_BOARD", () => {
    const fakeDiscovered = 9;
    const action = actions.updateBoardAction(fakeBoard, fakeDiscovered);

    expect(action.type).toBe(UPDATE_BOARD);
    expect(action.board).toBe(fakeBoard);
    expect(action.discoveredCells).toBe(fakeDiscovered);
  });

  test("initializeBoardAction() should return action with type INITIALIZE_BOARD", () => {
    const action = actions.initializeBoardAction(fakeBoard, ROWS, COLUMNS);

    expect(action.type).toBe(INITIALIZE_BOARD);
    expect(action.board).toBe(fakeBoard);
    expect(action.rows).toBe(ROWS);
    expect(action.columns).toBe(COLUMNS);
  });

  const getStateWithBoard = (board: Cell[][]): ApplicationState =>
    (({
      minesweeper: {
        board: board
      }
    } as unknown) as ApplicationState);
});

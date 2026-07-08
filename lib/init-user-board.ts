import ConnectDB from "./db";
import { Board, Column } from "./models";

const DEFAULT_COLUMNS = [
  {
    name: "Skill wish list",
    order: 0,
  },
  {
    name: "Skills development",
    order: 1,
  },
  {
    name: "Consolidating skills",
    order: 2,
  },
  {
    name: "My skills",
    order: 3,
  },
];

export async function initializeUserBoard(userId: string, boardName: string) {
  try {
    await ConnectDB();

    const existingBoard = await Board.findOne({ userId, name: boardName });

    if (existingBoard) {
      return existingBoard;
    }

    const board = await Board.create({
      name: boardName,
      userId,
      columns: [],
    });

    const columns = await Promise.all(
      DEFAULT_COLUMNS.map((col) =>
        Column.create({
          name: col.name,
          order: col.order,
          boardId: board._id,
          progressApplication: [],
        }),
      ),
    );
    board.columns = columns.map((col) => col._id);
    await board.save();
    return board;
  } catch (err) {
    throw err;
  }
}

import ConnectDB from "./db";
import { Board, Column } from "./models";
import { generateSlug } from "./utils";

type TColumn = {
  name: string;
  order: number;
};

const DEFAULT_COLUMNS: TColumn[] = [
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

export async function initializeUserBoard(
  userId: string,
  boardName: string,
  propColumns?: TColumn[],
) {
  try {
    await ConnectDB();

    const existingBoard = await Board.findOne({ userId, name: boardName });

    if (existingBoard) {
      return existingBoard;
    }

    const board = await Board.create({
      name: boardName,
      slug: generateSlug(boardName),
      userId,
      columns: [],
    });

    if (!propColumns) {
      await board.save();
      return board;
    }

    const columns = await Promise.all(
      propColumns.map((col) =>
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

export async function defaultInitializeUserBoard(
  userId: string,
  boardName: string,
) {
  initializeUserBoard(userId, boardName, DEFAULT_COLUMNS);
}

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const DIRECTIONS = [
  [-1, 0], // 상
  [1, 0], // 하
  [0, -1], // 좌
  [0, 1], // 우
];

export type BalloonGameType = {
  rows?: number;
  columns?: number;
  balloonProbability?: number;
};

export default function useBalloonGame({
  rows = 6,
  columns = 6,
  balloonProbability = 30,
}: BalloonGameType) {
  if (balloonProbability < 0 || balloonProbability > 100) {
    throw new Error("balloonProbability은 0이상, 100이하까지 가능합니다.");
  }

  const probability = balloonProbability / 100;

  const generateGrid = useCallback(
    (rows: number, columns: number, probability: number) => {
      let balloonCount = 0;

      const grid = Array.from({ length: rows }, () =>
        Array.from({ length: columns }, () => {
          const hasBalloon =
            probability === 1 ? true : Math.random() < probability;

          if (hasBalloon) {
            balloonCount++;
          }

          return hasBalloon;
        })
      );

      if (balloonCount === 0) {
        const randomRow = Math.floor(Math.random() * rows);
        const randomColumn = Math.floor(Math.random() * columns);
        grid[randomRow][randomColumn] = true;
      }

      return grid;
    },
    []
  );

  const [grid, setGrid] = useState(generateGrid(rows, columns, probability));
  const [balloonCount, setBalloonCount] = useState<number[]>([]);
  const [isFailure, setIsFailure] = useState(false);

  const gridRef = useRef(grid);
  const balloonCountRef = useRef(balloonCount);

  const isClear = useMemo(
    () => grid.every((row) => row.every((cell) => cell === false)),
    [grid]
  );

  const isValid = useCallback(
    (grid: boolean[][], x: number, y: number, checkedGrid: boolean[][]) => {
      return (
        x >= 0 &&
        y >= 0 &&
        x < rows &&
        y < columns &&
        !checkedGrid[x][y] &&
        grid[x][y]
      );
    },
    [rows, columns]
  );

  const findGroup = useCallback(
    (grid: boolean[][], x: number, y: number, checkedGrid: boolean[][]) => {
      const group: [number, number][] = [];
      const queue = [[x, y]];

      checkedGrid[x][y] = true;

      while (queue.length > 0) {
        const current = queue.shift()!;
        group.push([current[0], current[1]]);

        for (let i = 0; i < DIRECTIONS.length; i++) {
          const direction = DIRECTIONS[i];

          const next_x = current[0] + direction[0];
          const next_y = current[1] + direction[1];

          if (isValid(grid, next_x, next_y, checkedGrid)) {
            checkedGrid[next_x][next_y] = true;
            queue.push([next_x, next_y]);
          }
        }
      }

      return group;
    },
    [isValid]
  );

  const getBalloonGroup = useCallback(
    (x: number, y: number) => {
      const checkedGrid = Array.from({ length: rows }, () =>
        Array.from({ length: columns }, () => false)
      );

      return findGroup(gridRef.current, x, y, checkedGrid);
    },
    [rows, columns, findGroup]
  );

  const getBalloonCount = useCallback(
    (grid: boolean[][]) => {
      const balloonCount: number[] = [];

      const checkedGrid = Array.from({ length: rows }, () =>
        Array.from({ length: columns }, () => false)
      );

      checkedGrid.forEach((rows, rowIndex) => {
        rows.forEach((_, columnIndex) => {
          if (isValid(grid, rowIndex, columnIndex, checkedGrid)) {
            const ballonGroup = findGroup(
              grid,
              rowIndex,
              columnIndex,
              checkedGrid
            );

            if (ballonGroup.length) {
              balloonCount.push(ballonGroup.length);
            }
          }
        });
      });

      return balloonCount.sort((a, b) => a - b);
    },
    [rows, columns, findGroup, isValid]
  );

  const onClick = useCallback(
    (rowIndex: number, columnIndex: number) => {
      if (probability === 1) {
        const newGrid = Array.from({ length: rows }, () =>
          Array.from({ length: columns }, () => false)
        );

        setGrid(newGrid);
        return;
      }

      const balloonGroup = getBalloonGroup(rowIndex, columnIndex);

      if (
        balloonCountRef.current[balloonCountRef.current.length - 1] ===
        balloonGroup.length
      ) {
        const newGrid = [...gridRef.current];
        balloonGroup.forEach(([x, y]) => {
          newGrid[x][y] = false;
        });

        setGrid(newGrid);
        setBalloonCount(getBalloonCount(newGrid));
      } else {
        setIsFailure(true);
      }
    },
    [rows, columns, probability, getBalloonGroup, getBalloonCount]
  );

  const onReset = () => {
    const newGrid = generateGrid(rows, columns, probability);

    setGrid(newGrid);
    setBalloonCount(getBalloonCount(newGrid));
    setIsFailure(false);
  };

  useEffect(() => {
    const newGrid = generateGrid(rows, columns, probability);

    setGrid(newGrid);
    setBalloonCount(getBalloonCount(newGrid));
  }, [rows, columns, probability, generateGrid, getBalloonCount]);

  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  useEffect(() => {
    balloonCountRef.current = balloonCount;
  }, [balloonCount]);

  return {
    grid,
    isClear,
    isFailure,
    onClick,
    onReset,
  };
}

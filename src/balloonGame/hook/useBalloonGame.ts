import { useCallback, useEffect, useMemo, useState } from "react";

type Props = {
  rows?: number;
  columns?: number;
  balloonProbability?: number;
};

export default function useBalloonGame({
  rows = 6,
  columns = 6,
  balloonProbability = 30,
}: Props) {
  if (balloonProbability < 0 || balloonProbability > 100) {
    throw new Error("balloonProbability은 0이상, 100이하까지 가능합니다.");
  }

  const probability = balloonProbability / 100;

  const generateGrid = useCallback(
    (rows: number, columns: number, probability: number) =>
      Array.from({ length: rows }, () =>
        Array.from({ length: columns }, () => Math.random() < probability)
      ),
    []
  );

  const [grid, setGrid] = useState(generateGrid(rows, columns, probability));
  const [balloonCount, setBalloonCount] = useState<number[]>([]);
  const [isFailure, setIsFailure] = useState(false);

  const isClear = useMemo(
    () => grid.every((row) => row.every((cell) => cell === false)),
    [grid]
  );

  const directions = useMemo(
    () => [
      [-1, 0], // 상
      [1, 0], // 하
      [0, -1], // 좌
      [0, 1], // 우
    ],
    []
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

      group.push([x, y]);
      checkedGrid[x][y] = true;

      directions.forEach((direction) => {
        const current = [x + direction[0], y + direction[1]];

        if (isValid(grid, current[0], current[1], checkedGrid)) {
          checkedGrid[current[0]][current[1]] = true;

          if (grid[current[0]][current[1]]) {
            group.push(...findGroup(grid, current[0], current[1], checkedGrid));
          }
        }
      });

      return group;
    },
    [directions, isValid]
  );

  const onClick = (rowIndex: number, columnIndex: number) => {
    const balloonGroup = getBalloonGroup(rowIndex, columnIndex);

    if (balloonCount[balloonCount.length - 1] === balloonGroup.length) {
      const newGrid = [...grid];
      balloonGroup.forEach(([x, y]) => (newGrid[x][y] = false));

      setGrid(newGrid);
      setBalloonCount(getBalloonCount(newGrid));
    } else {
      setIsFailure(true);
    }
  };

  const onReset = () => {
    const newGrid = generateGrid(rows, columns, probability);

    setGrid(newGrid);
    setBalloonCount(getBalloonCount(newGrid));
    setIsFailure(false);
  };

  const getBalloonGroup = (x: number, y: number) => {
    const checkedGrid = Array.from({ length: rows }, () =>
      Array.from({ length: columns }, () => false)
    );

    return findGroup(grid, x, y, checkedGrid);
  };

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

  useEffect(() => {
    const newGrid = generateGrid(rows, columns, probability);

    setGrid(newGrid);
    setBalloonCount(getBalloonCount(newGrid));
  }, [rows, columns, probability, generateGrid, getBalloonCount]);

  return {
    grid,
    isClear,
    isFailure,
    onClick,
    onReset,
  };
}

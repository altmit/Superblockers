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

  const generateGrid = Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => Math.random() < probability)
  );

  const [grid, setGrid] = useState(generateGrid);
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
    (x: number, y: number, checkedGrid: boolean[][]) => {
      return (
        x >= 0 &&
        y >= 0 &&
        x < rows &&
        y < columns &&
        !checkedGrid[x][y] &&
        grid[x][y]
      );
    },
    [grid, rows, columns]
  );

  const calcGroup = useCallback(
    (x: number, y: number, checkedGrid: boolean[][]) => {
      const sum: [number, number][] = [];

      sum.push([x, y]);
      checkedGrid[x][y] = true;

      directions.forEach((direction) => {
        const current = [x + direction[0], y + direction[1]];

        if (isValid(current[0], current[1], checkedGrid)) {
          checkedGrid[current[0]][current[1]] = true;
          if (grid[current[0]][current[1]]) {
            sum.push(...calcGroup(current[0], current[1], checkedGrid));
          }
        }
      });

      return sum;
    },
    [directions, grid, isValid]
  );

  const onClick = (rowIndex: number, columnIndex: number) => {
    const balloonGroup = getBalloonGroup(rowIndex, columnIndex);

    if (balloonCount[balloonCount.length - 1] === balloonGroup.length) {
      const newGrid = [...grid];

      balloonGroup.forEach(([x, y]) => (newGrid[x][y] = false));

      setGrid(newGrid);
    } else {
      setIsFailure(true);
    }
  };

  const onReset = () => {
    setGrid(generateGrid);
    setIsFailure(false);
  };

  const getBalloonGroup = (x: number, y: number) => {
    const row = grid.length;
    const column = grid[0].length;

    const checkedGrid = Array.from({ length: row }, () =>
      Array.from({ length: column }, () => false)
    );

    return calcGroup(x, y, checkedGrid);
  };

  const getBalloonCount = useCallback(
    (grid: boolean[][]) => {
      const row = grid.length;
      const column = grid[0].length;

      const sum: number[] = [];

      const checkedGrid = Array.from({ length: row }, () =>
        Array.from({ length: column }, () => false)
      );

      checkedGrid.forEach((rows, rowIndex) => {
        rows.forEach((_, columnIndex) => {
          if (
            isValid(rowIndex, columnIndex, checkedGrid) &&
            grid[rowIndex][columnIndex]
          ) {
            const ballonGroup = calcGroup(rowIndex, columnIndex, checkedGrid);
            if (ballonGroup.length) {
              sum.push(ballonGroup.length);
            }
          }
        });
      });

      return sum.sort((a, b) => a - b);
    },
    [calcGroup, isValid]
  );

  useEffect(() => {
    setBalloonCount(getBalloonCount(grid));
  }, [grid, getBalloonCount]);

  return {
    grid,
    isClear,
    isFailure,
    onClick,
    onReset,
  };
}
